import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";

export const runtime = "nodejs";        // ensure Node, not Edge
export const dynamic = "force-dynamic"; // no caching in dev

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db
      .collection("hospitals")
      .find({})
      .project({ name: 1, location: 1, hospitalId: 1 }) // <-- include hospitalId
      .toArray();

    const out = docs.map((d: any) => ({
      _id: d?._id ? String(d._id) : undefined,
      name: d?.name ?? "",
      location: d?.location ?? "",
      hospitalId: d?.hospitalId ?? "",
    }));

    return NextResponse.json(out, { status: 200 });
  } catch (e: any) {
    console.error("[api/hospitals] error:", e);
    return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
  }
}
