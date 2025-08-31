import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { action, order_id } = await request.json()
    
    const client = await clientPromise
    const db = client.db('hopely_db')
    const donationsCollection = db.collection('donations')
    
    if (action === 'complete_pending') {
      // Complete all pending donations (useful for development/testing)
      const result = await donationsCollection.updateMany(
        { status: 'pending' },
        { 
          $set: { 
            status: 'completed',
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            payment_method: 'manual_completion'
          }
        }
      )
      
      console.log(`✅ Manually completed ${result.modifiedCount} pending donations`)
      
      return NextResponse.json({
        success: true,
        message: `Completed ${result.modifiedCount} pending donations`,
        modified_count: result.modifiedCount
      })
    }
    
    if (action === 'complete_order' && order_id) {
      // Complete specific order
      const result = await donationsCollection.updateOne(
        { order_id: order_id, status: 'pending' },
        { 
          $set: { 
            status: 'completed',
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            payment_method: 'manual_completion'
          }
        }
      )
      
      console.log(`✅ Manually completed donation for order: ${order_id}`)
      
      return NextResponse.json({
        success: true,
        message: `Completed donation for order ${order_id}`,
        modified_count: result.modifiedCount
      })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid action or missing parameters'
    }, { status: 400 })
    
  } catch (error) {
    console.error('❌ Error in manual completion:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to complete donations'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('hopely_db')
    const donationsCollection = db.collection('donations')
    
    // Get all pending donations
    const pendingDonations = await donationsCollection
      .find({ status: 'pending' })
      .sort({ created_at: -1 })
      .toArray()
    
    return NextResponse.json({
      success: true,
      pending_count: pendingDonations.length,
      pending_donations: pendingDonations.map(d => ({
        order_id: d.order_id,
        amount: d.amount,
        donor_name: d.donor_name,
        shortage_id: d.shortage_id,
        created_at: d.created_at
      }))
    })
    
  } catch (error) {
    console.error('❌ Error fetching pending donations:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch pending donations'
    }, { status: 500 })
  }
}
