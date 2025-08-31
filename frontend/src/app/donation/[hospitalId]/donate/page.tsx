"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Navigation from "../../../../components/Navigation";
import DonationProgress from "../../../../components/DonationProgress";
import { formatCurrency } from "../../../../lib/donationUtils";

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
  const shortageId = useMemo(() => sp?.get("shortage_id") ?? null, [sp]);
  const estimatedFunding = useMemo(
    () => parseFloat(sp?.get("estimated_funding") ?? "0"),
    [sp]
  );

  const [form, setForm] = useState<PayForm>({
    donorCity: "Colombo",
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [currentProgress, setCurrentProgress] = useState<{
    total_donated: number;
    donation_count: number;
  } | null>(null);

  // Load current donation progress
  useEffect(() => {
    if (shortageId) {
      const loadProgress = async () => {
        try {
          const response = await fetch(
            `/api/donations/by-shortage/${shortageId}`
          );
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
              setCurrentProgress({
                total_donated: result.data.total_donated,
                donation_count: result.data.donation_count,
              });
            }
          }
        } catch (error) {
          console.warn("Failed to load donation progress:", error);
        }
      };
      loadProgress();
    }
  }, [shortageId]);

  // Calculate remaining funding needed
  const remainingFunding = useMemo(() => {
    if (estimatedFunding > 0 && currentProgress) {
      return Math.max(0, estimatedFunding - currentProgress.total_donated);
    }
    return null;
  }, [estimatedFunding, currentProgress]);

  // Check if donation amount is valid
  const amountValidation = useMemo(() => {
    if (!form.amount) return { isValid: true, message: null };

    if (form.amount < 100) {
      return { isValid: false, message: "Minimum donation amount is LKR 100" };
    }

    if (remainingFunding !== null) {
      if (remainingFunding <= 0) {
        return {
          isValid: false,
          message:
            "This shortage is already fully funded! Thank you for your interest.",
        };
      }

      if (form.amount > remainingFunding) {
        return {
          isValid: false,
          message: `Amount exceeds remaining need of LKR ${remainingFunding.toLocaleString()}. Please enter a smaller amount.`,
        };
      }

      // Show helpful message if close to the limit
      if (form.amount > remainingFunding * 0.8) {
        return {
          isValid: true,
          message: `This will cover most of the remaining need (LKR ${remainingFunding.toLocaleString()} remaining)`,
        };
      }
    }

    return { isValid: true, message: null };
  }, [form.amount, remainingFunding]);

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

      // Check funding validation
      if (!amountValidation.isValid) {
        setErr(amountValidation.message || "Invalid donation amount");
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
          shortage_id: shortageId, // Use the actual shortage ID
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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Universal Navigation */}
      <Navigation />

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#143f3f]/5 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-amber-400/8 rounded-full mix-blend-multiply filter blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-yellow-300/6 rounded-full mix-blend-multiply filter blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-8 pt-32">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[#143f3f] hover:text-emerald-600 font-medium mb-8 px-4 py-2 rounded-full hover:bg-[#143f3f]/10 transition-all duration-300"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#143f3f]/10 backdrop-blur-sm rounded-full text-[#143f3f] text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-[#143f3f] rounded-full animate-pulse"></div>
            Make a Donation
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-[#143f3f] mb-6 leading-tight">
            Support{" "}
            <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
              {hospitalName}
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Your contribution will help purchase{" "}
            <span className="font-semibold text-[#143f3f]">{medicine}</span> for
            patients in need.
          </p>
        </header>

        {/* Donation Progress Section */}
        {estimatedFunding > 0 && currentProgress && (
          <div className="mb-12">
            <div className="glass rounded-3xl p-8 border border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-[#143f3f] mb-2">
                  Funding Progress
                </h3>
                <p className="text-gray-600">
                  See how close we are to our goal
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <DonationProgress
                  totalDonated={currentProgress.total_donated}
                  estimatedFunding={estimatedFunding}
                  showPercentage={true}
                  showAmounts={true}
                  className="mb-4"
                />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    {currentProgress.donation_count} donation
                    {currentProgress.donation_count !== 1 ? "s" : ""} received
                    so far
                  </span>
                  {remainingFunding !== null && (
                    <span
                      className={`font-medium ${
                        remainingFunding <= 0
                          ? "text-green-600"
                          : "text-amber-600"
                      }`}
                    >
                      {remainingFunding <= 0
                        ? "✅ Fully Funded!"
                        : `${formatCurrency(remainingFunding)} remaining`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Donation Form */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-xl bg-white border border-stone-200">
            <h2 className="font-medium text-gray-800">Amount</h2>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {PRESETS.map((v) => {
                const isDisabled =
                  remainingFunding !== null && v > remainingFunding;
                return (
                  <button
                    key={v}
                    onClick={() => setForm({ ...form, amount: v })}
                    disabled={isDisabled}
                    className={`px-3 py-2 rounded-lg text-sm border ${
                      form.amount === v
                        ? "bg-green-600 text-white border-green-600"
                        : isDisabled
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-stone-300 text-gray-700 hover:bg-green-50"
                    }`}
                  >
                    LKR {v.toLocaleString()}
                  </button>
                );
              })}
            </div>
            <div className="mt-3">
              <input
                type="number"
                min={100}
                max={remainingFunding || undefined}
                step={100}
                className={`w-full p-2 border rounded-lg text-gray-900 placeholder-gray-500 ${
                  !amountValidation.isValid
                    ? "border-red-300 focus:border-red-500"
                    : "border-stone-300"
                }`}
                placeholder={
                  remainingFunding !== null && remainingFunding > 0
                    ? `Custom amount (Max: LKR ${remainingFunding.toLocaleString()})`
                    : "Custom amount (LKR)"
                }
                value={form.amount ?? ""}
                onChange={(e) =>
                  setForm({ ...form, amount: Number(e.target.value) })
                }
              />
              <div className="mt-1 text-xs">
                {amountValidation.message ? (
                  <p
                    className={
                      amountValidation.isValid
                        ? "text-blue-600"
                        : "text-red-600"
                    }
                  >
                    {amountValidation.message}
                  </p>
                ) : (
                  <p className="text-gray-500">Minimum LKR 100</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200">
            <h2 className="font-medium text-gray-800">Your details</h2>
            <div className="mt-3 space-y-3">
              <input
                className="w-full p-2 border border-stone-300 rounded-lg text-gray-900 placeholder-gray-500"
                placeholder="Your name (required) *"
                value={form.donorName ?? ""}
                onChange={(e) =>
                  setForm({ ...form, donorName: e.target.value })
                }
                required
              />
              <input
                type="email"
                className="w-full p-2 border border-stone-300 rounded-lg text-gray-900 placeholder-gray-500"
                placeholder="Your email (required) *"
                value={form.donorEmail ?? ""}
                onChange={(e) =>
                  setForm({ ...form, donorEmail: e.target.value })
                }
                required
              />
              <input
                type="tel"
                className="w-full p-2 border border-stone-300 rounded-lg text-gray-900 placeholder-gray-500"
                placeholder="Your phone number (required) *"
                value={form.donorPhone ?? ""}
                onChange={(e) =>
                  setForm({ ...form, donorPhone: e.target.value })
                }
                required
              />
              <input
                className="w-full p-2 border border-stone-300 rounded-lg text-gray-900 placeholder-gray-500"
                placeholder="Your address (optional)"
                value={form.donorAddress ?? ""}
                onChange={(e) =>
                  setForm({ ...form, donorAddress: e.target.value })
                }
              />
              <input
                className="w-full p-2 border border-stone-300 rounded-lg text-gray-900 placeholder-gray-500"
                placeholder="Your city (optional)"
                value={form.donorCity ?? ""}
                onChange={(e) =>
                  setForm({ ...form, donorCity: e.target.value })
                }
              />
              <textarea
                className="w-full p-2 border border-stone-300 rounded-lg text-gray-900 placeholder-gray-500"
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
                disabled={
                  busy ||
                  !form.amount ||
                  form.amount < 100 ||
                  !amountValidation.isValid
                }
                onClick={handlePayment}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  busy ||
                  !form.amount ||
                  form.amount < 100 ||
                  !amountValidation.isValid
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {busy
                  ? "Processing…"
                  : remainingFunding !== null && remainingFunding <= 0
                  ? "Fully Funded"
                  : "Donate now with PayHere"}
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
