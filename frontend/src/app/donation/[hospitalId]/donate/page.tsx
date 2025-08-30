"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Navbar from "../../../../components/Donations/Navbar";

declare global {
  interface Window {
    payhere: any;
  }
}

type PayForm = {
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  donorAddress?: string;
  donorCity?: string;
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

  const [form, setForm] = useState<PayForm>({
    donorCity: "Colombo",
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handlePayment = async () => {
    setBusy(true);
    setErr(null);

    try {
      console.log("🚀 Starting payment process...");

      // Validate form data
      if (!form.donorName || !form.donorEmail || !form.donorPhone) {
        setErr("Please fill in all required fields (Name, Email, Phone)");
        return;
      }

      if (!form.amount || form.amount < 100) {
        setErr("Please enter a donation amount of at least LKR 100");
        return;
      }

      // 1. Generate order ID
      const orderId = `ORDER_${Date.now()}`;
      console.log("📝 Order ID:", orderId);

      // 2. Check environment variables
      const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID;
      if (!merchantId) {
        console.error("❌ PAYHERE_MERCHANT_ID not found");
        setErr("Payment configuration error: Merchant ID missing");
        return;
      }

      // 3. Store donation data in database FIRST
      console.log("💾 Storing donation data in database...");
      const donationResponse = await fetch("/api/donations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          shortage_id: `${hospitalId}_${medicine}`,
          hospital_id: hospitalId,
          donor_name: form.donorName,
          donor_email: form.donorEmail,
          donor_phone: form.donorPhone,
          donor_address: form.donorAddress || "",
          donor_city: form.donorCity || "Colombo",
          amount: form.amount,
          merchant_id: merchantId,
          medicine_name: medicine,
          hospital_name: hospitalName,
          note: form.note,
        }),
      });

      if (!donationResponse.ok) {
        const errorText = await donationResponse.text();
        console.error("❌ Failed to store donation data:", errorText);
        setErr("Failed to save donation information. Please try again.");
        return;
      }

      const donationResult = await donationResponse.json();
      console.log("✅ Donation data stored:", donationResult);

      // 4. Get hash from API
      console.log("🔐 Requesting hash generation...");
      const hashResponse = await fetch("/api/payments/generate-hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant_id: merchantId,
          order_id: orderId,
          amount: form.amount.toFixed(2),
          currency: "LKR",
        }),
      });

      if (!hashResponse.ok) {
        const errorText = await hashResponse.text();
        console.error("❌ Hash generation failed:", errorText);
        setErr(
          "Payment initialization failed. Please check your PayHere configuration."
        );
        return;
      }

      const { hash } = await hashResponse.json();
      console.log("✅ Hash received:", hash.substring(0, 8) + "...");

      // 5. Check if PayHere is loaded
      if (!window.payhere) {
        console.error("❌ PayHere script not loaded");
        setErr(
          "Payment system not loaded. Please refresh the page and try again."
        );
        return;
      }

      // 6. Prepare payment object
      const payment = {
        sandbox: process.env.NEXT_PUBLIC_PAYHERE_SANDBOX === "true",
        merchant_id: merchantId,
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
        notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/notify`,
        order_id: orderId,
        items: `Donation for ${medicine} at ${hospitalName}`,
        amount: form.amount.toFixed(2),
        currency: "LKR",
        hash: hash,
        first_name: form.donorName?.split(" ")[0] || "Anonymous",
        last_name: form.donorName?.split(" ")[1] || "Donor",
        email: form.donorEmail,
        phone: form.donorPhone,
        address: form.donorAddress || "Not provided",
        city: form.donorCity || "Colombo",
        country: "Sri Lanka",
      };

      console.log("💳 Starting PayHere payment...");

      // 7. Start payment
      window.payhere.startPayment(payment);
    } catch (error) {
      console.error("❌ Payment error:", error);
      setErr(
        `Payment failed to initialize: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setBusy(false);
    }
  };

  // Add PayHere event handlers
  useEffect(() => {
    if (typeof window !== "undefined" && window.payhere) {
      window.payhere.onCompleted = function (orderId: string) {
        console.log("Payment completed. OrderID:", orderId);
        window.location.href = `/payment/success?orderId=${orderId}`;
      };

      window.payhere.onDismissed = function () {
        console.log("Payment dismissed");
        setErr("Payment was cancelled");
      };

      window.payhere.onError = function (error: string) {
        console.log("Error:", error);
        setErr("Payment error: " + error);
      };
    }
  }, []);

  if (!hospitalId) {
    return <div className="p-6">Invalid URL: missing hospital id.</div>;
  }

  return (
    <div className="min-h-screen bg-[#FFFAF0]">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-green-700 hover:underline"
        >
          ← Back
        </button>

        <h1 className="mt-2 text-2xl font-semibold text-green-700">
          Donate to {hospitalName}
        </h1>
        <p className="text-gray-700 mt-1">
          Your contribution will help us purchase{" "}
          <span className="font-medium">{medicine}</span> for the hospital.
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
                    form.amount === v
                      ? "bg-green-600 text-white border-green-600"
                      : "border-stone-300 text-gray-700 hover:bg-green-50"
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
                onChange={(e) =>
                  setForm({ ...form, amount: Number(e.target.value) })
                }
              />
              <p className="text-xs text-gray-500 mt-1">Minimum LKR 100</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200">
            <h2 className="font-medium text-gray-800">Your details</h2>
            <div className="mt-3 space-y-3">
              <input
                className="w-full p-2 border border-stone-300 rounded-lg !placeholder:text-gray-900/90"
                placeholder="Your name (required) *"
                value={form.donorName ?? ""}
                onChange={(e) =>
                  setForm({ ...form, donorName: e.target.value })
                }
                required
              />
              <input
                type="email"
                className="w-full p-2 border border-stone-300 rounded-lg !placeholder:text-gray-900/90"
                placeholder="Your email (required) *"
                value={form.donorEmail ?? ""}
                onChange={(e) =>
                  setForm({ ...form, donorEmail: e.target.value })
                }
                required
              />
              <input
                type="tel"
                className="w-full p-2 border border-stone-300 rounded-lg !placeholder:text-gray-900/90"
                placeholder="Your phone number (required) *"
                value={form.donorPhone ?? ""}
                onChange={(e) =>
                  setForm({ ...form, donorPhone: e.target.value })
                }
                required
              />
              <input
                className="w-full p-2 border border-stone-300 rounded-lg !placeholder:text-gray-900/90"
                placeholder="Your address (optional)"
                value={form.donorAddress ?? ""}
                onChange={(e) =>
                  setForm({ ...form, donorAddress: e.target.value })
                }
              />
              <input
                className="w-full p-2 border border-stone-300 rounded-lg !placeholder:text-gray-900/90"
                placeholder="Your city (optional)"
                value={form.donorCity ?? ""}
                onChange={(e) =>
                  setForm({ ...form, donorCity: e.target.value })
                }
              />
              <textarea
                className="w-full p-2 border border-stone-300 rounded-lg !placeholder:text-gray-900/90"
                rows={3}
                placeholder="Note (optional)"
                value={form.note ?? ""}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>

            {err && (
              <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 p-2 rounded">
                {err}
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button
                disabled={busy || !form.amount || form.amount < 100}
                onClick={handlePayment}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
              >
                {busy ? "Processing…" : "Donate now with PayHere"}
              </button>
              <div className="text-xs text-gray-500 self-center">
                (Secure payment via PayHere)
              </div>
            </div>

            {/* Payment info */}
            <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm">
              💳 Your payment will be processed securely through PayHere. You
              can pay using Visa, MasterCard, or mobile payment methods.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
