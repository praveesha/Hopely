import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortageId: string }> }
) {
  try {
    const { shortageId } = await params
    
    if (!shortageId) {
      return NextResponse.json({
        success: false,
        error: 'Shortage ID is required'
      }, { status: 400 })
    }
    
    const client = await clientPromise
    const db = client.db('hopely_db')
    const donationsCollection = db.collection('donations')
    
    // Get all donations for this shortage ID
    const donations = await donationsCollection
      .find({ shortage_id: shortageId })
      .sort({ created_at: -1 })
      .toArray()
    
    // Calculate totals for ALL donations (regardless of status)
    // This ensures progress bars update immediately when payments are made
    const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0)
    const donationCount = donations.length
    
    // Still provide breakdown for debugging
    const completedDonations = donations.filter(d => d.status === 'completed')
    const pendingDonations = donations.filter(d => d.status === 'pending')
    
    return NextResponse.json({
      success: true,
      data: {
        shortage_id: shortageId,
        total_donated: totalDonated,
        donation_count: donationCount,
        donations: donations,
        completed_donations: completedDonations,
        pending_donations: pendingDonations,
        status_breakdown: {
          total: donations.length,
          completed: completedDonations.length,
          pending: pendingDonations.length
        }
      }
    })  } catch (error) {
    console.error('❌ Error fetching donations by shortage:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch donations'
    }, { status: 500 })
  }
}
