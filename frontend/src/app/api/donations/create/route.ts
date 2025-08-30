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
      amount: donationData.amount,
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
    
    return NextResponse.json({
      success: true,
      donation_id: result.insertedId,
      order_id: donationData.order_id
    })
    
  } catch (error) {
    console.error('❌ Error creating donation record:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create donation record'
    }, { status: 500 })
  }
}
