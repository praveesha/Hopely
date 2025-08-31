import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hospitalId = searchParams.get('hospital_id')
    const shortageId = searchParams.get('shortage_id')
    
    const client = await clientPromise
    const db = client.db('hopely_db')
    const donationsCollection = db.collection('donations')
    
    // Build query filter
    let filter: any = {}
    if (hospitalId) {
      filter.hospital_id = hospitalId
    }
    if (shortageId) {
      filter.shortage_id = shortageId
    }
    
    // Get donation statistics
    const pipeline = [
      { $match: filter },
      {
        $group: {
          _id: null,
          total_donations: { $sum: 1 },
          total_amount: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'completed'] },
                '$amount',
                0
              ]
            }
          },
          pending_count: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, 1, 0]
            }
          },
          completed_count: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          },
          failed_count: {
            $sum: {
              $cond: [{ $eq: ['$status', 'failed'] }, 1, 0]
            }
          },
          cancelled_count: {
            $sum: {
              $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0]
            }
          }
        }
      }
    ]
    
    const result = await donationsCollection.aggregate(pipeline).toArray()
    const stats = result.length > 0 ? result[0] : {
      total_donations: 0,
      total_amount: 0,
      pending_count: 0,
      completed_count: 0,
      failed_count: 0,
      cancelled_count: 0
    }
    
    // Remove the aggregation _id field
    delete stats._id
    
    return NextResponse.json({
      success: true,
      data: stats
    })
    
  } catch (error) {
    console.error('❌ Error fetching donation totals:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch donation totals'
    }, { status: 500 })
  }
}