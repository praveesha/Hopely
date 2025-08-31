import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const hospitalId = searchParams.get('hospital_id')
    const shortageId = searchParams.get('shortage_id')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit
    
    const client = await clientPromise
    const db = client.db('hopely_db')
    const donationsCollection = db.collection('donations')
    
    // Build query filter
    let filter: any = {}
    if (status !== 'all') {
      filter.status = status
    }
    if (hospitalId) {
      filter.hospital_id = hospitalId
    }
    if (shortageId) {
      filter.shortage_id = shortageId
    }
    
    // Get donations with pagination
    const donations = await donationsCollection
      .find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
    
    // Get total count
    const totalCount = await donationsCollection.countDocuments(filter)
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit)
    
    return NextResponse.json({
      success: true,
      data: donations,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_count: totalCount,
        limit: limit,
        has_next: page < totalPages,
        has_previous: page > 1
      }
    })
    
  } catch (error) {
    console.error('❌ Error fetching donations:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch donations'
    }, { status: 500 })
  }
}
