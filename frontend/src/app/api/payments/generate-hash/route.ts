import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { merchant_id, order_id, amount, currency } = await request.json()
    
    // Check if merchant secret exists
    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET
    if (!merchant_secret) {
      console.error('❌ PAYHERE_MERCHANT_SECRET not found in environment variables')
      return NextResponse.json({ error: 'Merchant secret not configured' }, { status: 500 })
    }
    
    console.log('🔐 Generating hash for:', { merchant_id, order_id, amount, currency })
    
    // Generate hash as per PayHere documentation
    const merchant_secret_hash = crypto.createHash('md5').update(merchant_secret).digest('hex').toUpperCase()
    const hash_string = merchant_id + order_id + amount + currency + merchant_secret_hash
    const hash = crypto.createHash('md5').update(hash_string).digest('hex').toUpperCase()
    
    console.log('✅ Hash generated successfully')
    
    return NextResponse.json({ hash })
  } catch (error) {
    console.error('❌ Hash generation error:', error)
    return NextResponse.json({ error: 'Failed to generate hash' }, { status: 500 })
  }
}
