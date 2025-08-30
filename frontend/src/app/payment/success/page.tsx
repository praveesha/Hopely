"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200 flex items-center justify-center p-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for your generous donation. Your payment has been processed
          successfully.
        </p>

        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order ID:</p>
            <p className="font-mono text-sm text-gray-800">{orderId}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-gradient-to-r from-green-400 to-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-500 hover:to-green-600 transition-all duration-200"
          >
            Return to Home
          </Link>

          <Link
            href="/donation"
            className="block w-full border-2 border-green-400 text-green-600 py-3 px-6 rounded-lg font-semibold hover:bg-green-50 transition-all duration-200"
          >
            Make Another Donation
          </Link>
        </div>
      </div>
    </div>
  );
}
