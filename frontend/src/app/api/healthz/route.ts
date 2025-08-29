import { NextResponse } from "next/server";
import { getDb } from "../../../lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const collections = await db.listCollections().toArray();
    return NextResponse.json({
      ok: true,
      db: process.env.DB_NAME,
      collections: collections.map(c => c.name),
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}
