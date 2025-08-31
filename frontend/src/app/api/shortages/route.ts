import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { CreateShortageRequest, UrgencyLevel, ShortageStatus } from '@/models/MedicineRequest'
import { v4 as uuidv4 } from 'uuid'

// POST /api/shortages - Create new shortage
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('hopely_db')
    const shortageCollection = db.collection('medicine_shortages')

    // Parse request body
    const body: CreateShortageRequest = await request.json()

    // Validate required fields
    if (!body.medicineName || !body.quantityNeeded || !body.unit || !body.urgencyLevel) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: medicineName, quantityNeeded, unit, urgencyLevel'
        },
        { status: 400 }
      )
    }

    // Validate urgency level
    if (!Object.values(UrgencyLevel).includes(body.urgencyLevel)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid urgency level. Must be LOW, MEDIUM, HIGH, or CRITICAL'
        },
        { status: 400 }
      )
    }

    // Generate shortage data
    const shortageId = uuidv4()
    const timestamp = new Date().toISOString()
    const hospitalId = "CGH_001" // TODO: Get from JWT token
    const createdBy = "admin@hospital.lk" // TODO: Get from JWT token

    // Create shortage document
    const shortageDoc = {
      id: shortageId,
      hospitalId: hospitalId,
      medicineName: body.medicineName,
      genericName: body.genericName || null,
      urgencyLevel: body.urgencyLevel,
      quantityNeeded: body.quantityNeeded,
      unit: body.unit,
      description: body.description || null,
      datePosted: timestamp,
      dateUpdated: timestamp,
      expirationDate: body.expirationDate || null,
      status: ShortageStatus.ACTIVE,
      contactEmail: "", // TODO: Get from hospital profile
      createdBy: createdBy,
      updatedBy: createdBy,
      
      // Funding Information
      estimatedFunding: body.estimatedFunding || null,
      fundingCurrency: 'LKR',
      costPerUnit: body.costPerUnit || null,
      fundingNote: body.fundingNote || null,
    }

    console.log("🏥 Creating new medicine shortage:", body.medicineName)
    console.log("📄 Document to insert:", shortageDoc)

    // Insert the shortage
    const result = await shortageCollection.insertOne(shortageDoc)
    
    console.log("✅ Insert successful! Insert ID:", result.insertedId)
    console.log("🆔 Our custom ID:", shortageId)

    return NextResponse.json({
      success: true,
      message: "Medicine shortage created successfully",
      data: {
        id: shortageId,
        hospitalId: hospitalId
      }
    })

  } catch (error) {
    console.error("❌ Create shortage error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create shortage",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
