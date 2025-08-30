"use client";

import Link from "next/link";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-red-200 flex items-center justify-center p-6">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges have been made to your account.
        </p>

        <div className="space-y-3">
          <Link
            href="/donation"
            className="block w-full bg-gradient-to-r from-green-400 to-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-500 hover:to-green-600 transition-all duration-200"
          >
            Try Again
          </Link>

          <Link
            href="/"
            className="block w-full border-2 border-gray-400 text-gray-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
