import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    // Parse form data (PayHere sends as form-encoded, not JSON)
    const formData = await request.formData()
    
    const merchant_id = formData.get('merchant_id') as string
    const order_id = formData.get('order_id') as string
    const payhere_amount = formData.get('payhere_amount') as string
    const payhere_currency = formData.get('payhere_currency') as string
    const status_code = formData.get('status_code') as string
    const md5sig = formData.get('md5sig') as string
    
    console.log('📧 Payment notification received:', {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code
    })
    
    // Verify signature
    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET!
    const merchant_secret_hash = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase()
    const local_md5sig_string = merchant_id + order_id + payhere_amount + payhere_currency + status_code + merchant_secret_hash
    const local_md5sig = crypto.createHash('md5').update(local_md5sig_string).digest('hex').toUpperCase()
    
    console.log('🔐 Signature verification:', {
      received: md5sig,
      calculated: local_md5sig,
      match: local_md5sig === md5sig
    })
    
    if (local_md5sig === md5sig && status_code === '2') {
      // Payment successful - update existing donation record
      const client = await clientPromise
      const db = client.db('hopely_db')
      
      // Update the existing donation record with payment details
      const updateResult = await db.collection('donations').updateOne(
        { order_id: order_id },
        { 
          $set: { 
            status: 'completed',
            payment_id: formData.get('payment_id'),
            payment_method: formData.get('method'),
            payhere_amount: parseFloat(payhere_amount),
            payhere_currency: payhere_currency,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }
      )
      
      if (updateResult.matchedCount > 0) {
        console.log('✅ Payment verified and donation updated:', order_id)
      } else {
        console.log('⚠️ No matching donation found for order_id:', order_id)
        
        // If no existing record found, create a new one (fallback)
        const donationRecord = {
          order_id: order_id,
          payment_id: formData.get('payment_id'),
          merchant_id: merchant_id,
          amount: parseFloat(payhere_amount),
          currency: payhere_currency,
          status: 'completed',
          payment_method: formData.get('method'),
          completed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          donor_name: 'Unknown', // These will be null for fallback records
          donor_email: 'unknown@example.com',
          donor_phone: 'Unknown'
        }
        
        await db.collection('donations').insertOne(donationRecord)
        console.log('✅ Fallback donation record created:', order_id)
      }
    } else {
      console.log('❌ Payment verification failed or payment not successful')
    }
    
    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('❌ Payment notification error:', error)
    return NextResponse.json({ error: 'Failed to process payment notification' }, { status: 500 })
  }
}
