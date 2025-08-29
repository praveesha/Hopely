import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb"; 

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function serialize(doc: any) {
  return { _id: doc?._id ? String(doc._id) : undefined, name: doc?.name, location: doc?.location };
}

export async function GET() {
  try {
    const db = await getDb();
    const col = db.collection("hospitals");
    const docs = await col.find({}).project({ name: 1, location: 1 }).toArray();
    return NextResponse.json(docs.map(serialize), { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}
