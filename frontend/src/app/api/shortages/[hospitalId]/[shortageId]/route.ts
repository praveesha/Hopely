import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ShortageStatus } from '@/models/MedicineRequest'

// DELETE /api/shortages/[hospitalId]/[shortageId] - Cancel/delete a shortage
export async function DELETE(
  request: NextRequest,
  { params }: { params: { hospitalId: string; shortageId: string } }
) {
  try {
    const client = await clientPromise
    const db = client.db('hopely_db')
    const shortageCollection = db.collection('medicine_shortages')

    const { hospitalId, shortageId } = params

    console.log("🗑️ Deleting shortage:", shortageId, "for hospital:", hospitalId)

    // Soft delete - update status instead of actually deleting
    const filter = {
      id: shortageId,
      hospitalId: hospitalId
    }

    console.log("🔍 Looking for document with filter:", filter)

    const updateDoc = {
      $set: {
        status: ShortageStatus.CANCELLED,
        dateUpdated: new Date().toISOString()
      }
    }

    console.log("📝 Applying update:", updateDoc)

    const result = await shortageCollection.updateOne(filter, updateDoc)

    if (result.matchedCount === 0) {
      console.log("❌ No document found matching the criteria")
      return NextResponse.json(
        {
          success: false,
          message: "Shortage not found or you don't have permission to cancel it"
        },
        { status: 404 }
      )
    }

    if (result.modifiedCount === 0) {
      console.log("⚠️ Document found but not modified (may already be cancelled)")
      return NextResponse.json({
        success: true,
        message: "Shortage was already cancelled"
      })
    }

    console.log("✅ Update result:", result)
    console.log("✅ Shortage cancellation completed")

    return NextResponse.json({
      success: true,
      message: "Shortage cancelled successfully"
    })

  } catch (error) {
    console.error("❌ Delete shortage error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to cancel shortage",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
