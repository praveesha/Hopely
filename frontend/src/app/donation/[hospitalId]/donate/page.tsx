"use client";

import { useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Navbar from "../../../../components/Donations/Navbar";

type PayForm = {
  donorName?: string;
  donorEmail?: string;
  amount?: number;
  note?: string;
};

const PRESETS = [500, 1000, 2500, 5000];

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function DonatePage() {
  const params = useParams();
  const hospitalId = (params as { hospitalId?: string })?.hospitalId ?? "";
  const sp = useSearchParams();
  const router = useRouter();

  const hospitalName = useMemo(() => sp?.get("n") ?? "Hospital", [sp]);
  const medicine = useMemo(() => sp?.get("m") ?? "General support", [sp]);

  const [form, setForm] = useState<PayForm>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true); setErr(null);
    try {
      const res = await fetch("/api/pledges/money", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalId,
          hospitalName,
          medicine,
          amount: Number(form.amount ?? 0),
          currency: "LKR",
          donorName: form.donorName,
          donorEmail: form.donorEmail,
          note: form.note,
        }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) throw new Error(payload?.error ?? "Payment failed");
      setDone(true);
    } catch (e: any) {
      setErr(e?.message ?? String(e));
    } finally {
      setBusy(false);
    }
  };

  if (!hospitalId) {
    return <div className="p-6">Invalid URL: missing hospital id.</div>;
  }

  return (
    <div className="min-h-screen bg-[#FFFAF0]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <button onClick={() => router.back()} className="text-sm text-green-700 hover:underline">
          ← Back
        </button>

        <h1 className="mt-2 text-2xl font-semibold text-green-700">Donate to {hospitalName}</h1>
        <p className="text-gray-700 mt-1">
          Your contribution will help us purchase <span className="font-medium">{medicine}</span> for the hospital.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-xl bg-white border border-stone-200">
            <h2 className="font-medium text-gray-800">Amount</h2>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {PRESETS.map((v) => (
                <button
                  key={v}
                  onClick={() => setForm({ ...form, amount: v })}
                  className={`px-3 py-2 rounded-lg text-sm border ${
                    form.amount === v ? "bg-green-600 text-white border-green-600" : "border-stone-300 text-gray-700 hover:bg-green-50"
                  }`}
                >
                  LKR {v.toLocaleString()}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <input
                type="number"
                min={100}
                step={100}
                className="w-full p-2 border border-stone-300 rounded-lg !placeholder:text-gray-900/90"
                placeholder="Custom amount (LKR)"
                value={form.amount ?? ""}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
              />
              <p className="text-xs text-gray-500 mt-1">Minimum LKR 100</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200">
            <h2 className="font-medium text-gray-800">Your details</h2>
            <div className="mt-3 space-y-3">
              <input
                className="w-full p-2 border border-stone-300 rounded-lg !placeholder:text-gray-900/90"
                placeholder="Your name (optional)"
                value={form.donorName ?? ""}
                onChange={(e) => setForm({ ...form, donorName: e.target.value })}
              />
              <input
                className="w-full p-2 border border-stone-300 rounded-lg !placeholder:text-gray-900/90"
                placeholder="Your email (optional)"
                value={form.donorEmail ?? ""}
                onChange={(e) => setForm({ ...form, donorEmail: e.target.value })}
              />
              <textarea
                className="w-full p-2 border border-stone-300 rounded-lg !placeholder:text-gray-900/90"
                rows={3}
                placeholder="Note (optional)"
                value={form.note ?? ""}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>

            {err && <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 p-2 rounded">{err}</div>}

            <div className="mt-4 flex gap-2">
              <button
                disabled={busy || !form.amount || form.amount < 100}
                onClick={submit}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
              >
                {busy ? "Processing…" : "Donate now"}
              </button>
              <div className="text-xs text-gray-500 self-center">
                (demo checkout — stored in DB)
              </div>
            </div>

            {done && (
              <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
                Thank you! Your donation has been recorded.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
