import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "../../../../../lib/mongodb"; // <- 5x .. to reach src/lib/mongo

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeObjectId(id: string) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

function pick(obj: any, keys: string[], fallback?: any) {
  for (const k of keys) {
    if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
  }
  return fallback;
}

function toNumber(v: any, d = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
}

function normalize(doc: any) {
  const name = pick(doc, ["medicine", "name", "medicineName", "medicine_name"], "");
  const available = toNumber(pick(doc, ["available", "availableStock", "stock", "inStock", "current", "available_count"], 0), 0);
  const needed = toNumber(pick(doc, ["needed", "required", "neededCount", "requested", "target", "need"], 0), 0);
  const lack = Math.max(needed - available, 0);

  return {
    _id: doc?._id ? String(doc._id) : undefined,
    medicine: String(name || "Unknown"),
    available,
    needed,
    lack,
  };
}

async function fetchFromCollection(db: any, collName: string, id: string) {
  const col = db.collection(collName);

  // try by ObjectId first, then by string/name fields
  const oid = safeObjectId(id);
  const byId = oid
    ? {
        $or: [
          { hospitalId: oid },
          { hospital_id: oid },
          { "hospital._id": oid },
        ],
      }
    : null;

  const byString = {
    $or: [
      { hospitalId: id },
      { hospital_id: id },
      { hospital: id },
      { hospitalName: id },
      { "hospital.name": id },
    ],
  };

  const filter = byId ? { $or: [byId, byString] } : byString;

  const docs = await col
    .find(filter)
    .project({ medicine: 1, name: 1, medicineName: 1, available: 1, availableStock: 1, stock: 1, inStock: 1, current: 1, available_count: 1, needed: 1, required: 1, neededCount: 1, requested: 1, target: 1, need: 1 })
    .toArray();

  return docs.map(normalize);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDb();
    const id = decodeURIComponent(params.id);

    // try medicine_shortages first, then shortages
    let items = await fetchFromCollection(db, "medicine_shortages", id);
    if (items.length === 0) {
      items = await fetchFromCollection(db, "shortages", id);
    }

    return NextResponse.json(items, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}
