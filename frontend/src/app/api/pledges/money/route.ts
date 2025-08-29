import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../../lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hospitalId, hospitalName, medicine, amount, currency, donorName, donorEmail, note } = body ?? {};
    if (!hospitalId || !amount || Number(amount) <= 0) {
      return NextResponse.json({ error: "hospitalId and positive amount are required" }, { status: 400 });
    }
    const db = await getDb();
    const doc = {
      type: "money",
      hospitalId: String(hospitalId),
      hospitalName: hospitalName ?? "",
      medicine: medicine ?? "",
      amount: Number(amount),
      currency: currency ?? "LKR",
      donorName: donorName ?? "",
      donorEmail: donorEmail ?? "",
      note: note ?? "",
      createdAt: new Date(),
      status: "RECORDED", // placeholder; replace with GATEWAY status when integrated
    };
    const res = await db.collection("money_donations").insertOne(doc as any);
    return NextResponse.json({ ok: true, id: String(res.insertedId) }, { status: 201 });
  } catch (e: any) {
    console.error("[api/pledges/money] error:", e);
    return NextResponse.json({ error: e?.message ?? "Internal error" }, { status: 500 });
  }
}
