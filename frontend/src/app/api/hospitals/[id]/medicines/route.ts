import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "../../../../../lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// try to treat an id as Mongo ObjectId
function asObjectId(id: string) {
  try { return new ObjectId(id); } catch { return null; }
}

function toNum(v: any, d = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
}

function normalize(doc: any) {
  const medicine =
    doc.medicineName ?? doc.name ?? doc.medicine ?? "Unknown";
  const available =
    toNum(doc.availableStock ?? doc.quantityAvailable ?? doc.available ?? 0);
  const needed =
    toNum(doc.quantityNeeded ?? doc.needed ?? doc.required ?? 0);
  const lack = Math.max(needed - available, 0);

  return {
    _id: doc?._id ? String(doc._id) : undefined,
    medicine: String(medicine),
    available,
    needed,
    lack,
    unit: doc.unit ?? "",
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const raw = decodeURIComponent(params.id);

    // We accept either a hospitals._id OR a hospitals.hospitalId
    let hospitalIdForQuery: string | null = null;

    // If looks like an ObjectId, resolve hospital.hospitalId
    const oid = asObjectId(raw);
    if (oid) {
      const h = await db.collection("hospitals").findOne(
        { _id: oid },
        { projection: { hospitalId: 1 } }
      );
      if (h?.hospitalId) hospitalIdForQuery = String(h.hospitalId);
    }

    // Otherwise use the given string as hospitalId directly
    if (!hospitalIdForQuery) hospitalIdForQuery = raw;

    // Now fetch shortages by hospitalId
    const col = db.collection("medicine_shortages");
    const docs = await col
      .find({ $or: [{ hospitalId: hospitalIdForQuery }, { hospital_id: hospitalIdForQuery }] })
      .project({
        medicineName: 1,
        name: 1,
        medicine: 1,
        availableStock: 1,
        quantityAvailable: 1,
        available: 1,
        quantityNeeded: 1,
        needed: 1,
        required: 1,
        unit: 1,
      })
      .toArray();

    const items = docs.map(normalize);
    return NextResponse.json(items, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}
