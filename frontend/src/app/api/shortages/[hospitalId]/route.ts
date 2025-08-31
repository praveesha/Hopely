import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { MedicineShortage, ShortageStatus, UrgencyLevel } from '@/models/MedicineRequest'

// GET /api/shortages/[hospitalId] - Get shortages for a hospital
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hospitalId: string }> }
) {
  try {
    const client = await clientPromise
    const db = client.db('hopely_db')
    const shortageCollection = db.collection('medicine_shortages')

    const { hospitalId } = await params

    console.log("🔍 Getting shortages for hospital:", hospitalId)

    // Query shortages for this hospital
    const filter = {
      hospitalId: hospitalId,
      status: ShortageStatus.ACTIVE
    }

    console.log("🔍 Querying with filter:", filter)

    // Count documents first
    const count = await shortageCollection.countDocuments(filter)
    console.log("📊 Found", count, "matching documents")

    if (count === 0) {
      console.log("📭 No shortages found for this hospital")
      return NextResponse.json({
        success: true,
        message: "Shortages retrieved successfully",
        data: []
      })
    }

    // Retrieve documents
    console.log("📄 Retrieving documents...")
    const documents = await shortageCollection.find(filter).toArray()
    console.log("📄 Successfully retrieved", documents.length, "documents from database")

    // Convert MongoDB documents to MedicineShortage objects
    const shortages: MedicineShortage[] = documents.map(doc => {
      console.log("🔄 Converting document:", doc._id)
      console.log("🔄 Document keys:", Object.keys(doc))

      return {
        id: doc.id || doc._id?.toString() || "",
        hospitalId: doc.hospitalId || "",
        medicineName: doc.medicineName || "",
        genericName: doc.genericName || undefined,
        urgencyLevel: doc.urgencyLevel as UrgencyLevel || UrgencyLevel.LOW,
        quantityNeeded: doc.quantityNeeded || 0,
        unit: doc.unit || "",
        description: doc.description || undefined,
        datePosted: doc.datePosted || "",
        dateUpdated: doc.dateUpdated || "",
        expirationDate: doc.expirationDate || undefined,
        status: doc.status as ShortageStatus || ShortageStatus.ACTIVE,
        contactEmail: doc.contactEmail || "",
        createdBy: doc.createdBy || "",
        updatedBy: doc.updatedBy || "",
        
        // Funding Information
        estimatedFunding: doc.estimatedFunding || undefined,
        fundingCurrency: doc.fundingCurrency || undefined,
        costPerUnit: doc.costPerUnit || undefined,
        fundingNote: doc.fundingNote || undefined,
      }
    })

    console.log("🎉 Successfully converted", shortages.length, "shortages")

    return NextResponse.json({
      success: true,
      message: "Shortages retrieved successfully",
      data: shortages
    })

  } catch (error) {
    console.error("❌ Get shortages error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve shortages",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
