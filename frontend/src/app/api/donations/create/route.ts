import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const donationData = await request.json()
    
    console.log('📝 Creating donation record:', donationData)
    
    // Connect to database
    const client = await clientPromise
    const db = client.db('hopely_db')
    const donationsCollection = db.collection('donations')
    const shortageCollection = db.collection('medicine_shortages')
    
    // If this donation is for a specific shortage, validate funding limits
    let validatedAmount = donationData.amount
    let fundingInfo: any = null
    
    if (donationData.shortage_id) {
      console.log('🔍 Validating funding for shortage:', donationData.shortage_id)
      
      // Get shortage details to check funding target
      const shortage = await shortageCollection.findOne({ 
        id: donationData.shortage_id 
      })
      
      if (shortage && shortage.estimatedFunding) {
        const targetAmount = shortage.estimatedFunding
        
        // Get current donations total for this shortage
        const existingDonations = await donationsCollection
          .find({ shortage_id: donationData.shortage_id })
          .toArray()
        
        const currentTotal = existingDonations.reduce((sum, donation) => sum + donation.amount, 0)
        const remainingNeeded = targetAmount - currentTotal
        
        console.log('💰 Funding validation:', {
          target: targetAmount,
          current_total: currentTotal,
          remaining_needed: remainingNeeded,
          requested_amount: donationData.amount
        })
        
        fundingInfo = {
          target: targetAmount,
          current_total: currentTotal,
          remaining_needed: remainingNeeded,
          original_requested: donationData.amount,
          was_capped: false
        }
        
        // Check if already fully funded
        if (remainingNeeded <= 0) {
          return NextResponse.json({
            success: false,
            error: 'This shortage request is already fully funded',
            funding_info: fundingInfo
          }, { status: 400 })
        }
        
        // Cap the donation amount to remaining needed
        if (donationData.amount > remainingNeeded) {
          validatedAmount = remainingNeeded
          console.log(`⚠️ Donation amount capped from LKR ${donationData.amount.toLocaleString()} to LKR ${validatedAmount.toLocaleString()}`)
          
          fundingInfo.capped_amount = validatedAmount
          fundingInfo.was_capped = true
        }
      }
    }
    
    // Create donation document
    const donationDoc = {
      order_id: donationData.order_id,
      shortage_id: donationData.shortage_id || null,
      hospital_id: donationData.hospital_id || null,
      
      // Donor information
      donor_name: donationData.donor_name,
      donor_email: donationData.donor_email,
      donor_phone: donationData.donor_phone,
      donor_address: donationData.donor_address,
      donor_city: donationData.donor_city,
      
      // Medicine/Hospital info
      medicine_name: donationData.medicine_name || null,
      hospital_name: donationData.hospital_name || null,
      note: donationData.note || null,
      
      // Payment information
      amount: validatedAmount, // Use validated amount instead of original
      currency: 'LKR',
      status: 'pending', // Will be updated to 'completed' by webhook
      
      // Timestamps
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      
      // PayHere specific fields (will be updated by webhook)
      payment_id: null,
      merchant_id: donationData.merchant_id,
      payment_method: null,
      completed_at: null
    }
    
    // Insert donation record
    const result = await donationsCollection.insertOne(donationDoc)
    
    console.log('✅ Donation record created with ID:', result.insertedId)
    
    // Prepare response with funding information
    const response: any = {
      success: true,
      donation_id: result.insertedId,
      order_id: donationData.order_id,
      validated_amount: validatedAmount
    }
    
    // Add funding info if available
    if (fundingInfo) {
      response.funding_info = fundingInfo
      
      if (fundingInfo.was_capped) {
        response.message = `Donation amount was capped to LKR ${validatedAmount.toLocaleString()} to match remaining funding needed`
      }
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('❌ Error creating donation record:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create donation record'
    }, { status: 500 })
  }
}
