import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const client = await clientPromise
    const db = client.db('hopely_db')
    const donationsCollection = db.collection('donations')
    
    // Build query filter
    let filter = {}
    if (status !== 'all') {
      filter = { status: status }
    }
    
    // Get donations with pagination
    const donations = await donationsCollection
      .find(filter)
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray()
    
    // Get total count
    const totalCount = await donationsCollection.countDocuments(filter)
    
    return NextResponse.json({
      success: true,
      data: donations,
      total: totalCount,
      limit: limit
    })
    
  } catch (error) {
    console.error('❌ Error fetching donations:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch donations'
    }, { status: 500 })
  }
}
