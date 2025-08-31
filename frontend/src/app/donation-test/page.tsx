"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

declare global {
  interface Window {
    payhere: any;
  }
}

export default function DonatePage() {
  const params = useParams();
  const shortageId = params.shortageId as string;

  const [donationData, setDonationData] = useState({
    donorName: "",
    email: "",
    phone: "",
    address: "",
    city: "Colombo",
    amount: 1000,
  });

  const handlePayment = async () => {
    try {
      console.log("🚀 Starting payment process...");

      // Validate form data
      if (
        !donationData.donorName ||
        !donationData.email ||
        !donationData.phone
      ) {
        alert("Please fill in all required fields");
        return;
      }

      // 1. Generate order ID
      const orderId = `ORDER_${Date.now()}`;
      console.log("📝 Order ID:", orderId);

      // 2. Check environment variables
      const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID;
      if (!merchantId) {
        console.error("❌ PAYHERE_MERCHANT_ID not found");
        alert("Payment configuration error: Merchant ID missing");
        return;
      }

      // 3. Store donation data in database FIRST
      console.log("💾 Storing donation data in database...");
      const donationResponse = await fetch("/api/donations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          shortage_id: shortageId,
          hospital_id: "CGH_001", // You can make this dynamic later
          donor_name: donationData.donorName,
          donor_email: donationData.email,
          donor_phone: donationData.phone,
          donor_address: donationData.address,
          donor_city: donationData.city,
          amount: donationData.amount,
          merchant_id: merchantId,
        }),
      });

      if (!donationResponse.ok) {
        const errorText = await donationResponse.text();
        console.error("❌ Failed to store donation data:", errorText);
        alert("Failed to save donation information. Please try again.");
        return;
      }

      const donationResult = await donationResponse.json();
      console.log("✅ Donation data stored:", donationResult);

      // 4. Get hash from your API
      console.log("🔐 Requesting hash generation...");
      const hashResponse: Response = await fetch(
        "/api/payments/generate-hash",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            merchant_id: merchantId,
            order_id: orderId,
            amount: donationData.amount.toFixed(2),
            currency: "LKR",
          }),
        }
      );

      if (!hashResponse.ok) {
        const errorText = await hashResponse.text();
        console.error("❌ Hash generation failed:", errorText);
        alert(
          "Payment initialization failed. Please check your PayHere configuration."
        );
        return;
      }

      const { hash }: { hash: string } = await hashResponse.json();
      console.log("✅ Hash received:", hash.substring(0, 8) + "...");

      // 5. Check if PayHere is loaded
      if (!window.payhere) {
        console.error("❌ PayHere script not loaded");
        alert(
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
        items: `Donation for medical shortage`,
        amount: donationData.amount.toFixed(2),
        currency: "LKR",
        hash: hash,
        first_name: donationData.donorName.split(" ")[0] || "Anonymous",
        last_name: donationData.donorName.split(" ")[1] || "Donor",
        email: donationData.email,
        phone: donationData.phone,
        address: donationData.address,
        city: donationData.city,
        country: "Sri Lanka",
      };

      console.log("💳 Starting PayHere payment...");

      // 7. Start payment
      window.payhere.startPayment(payment);
    } catch (error) {
      console.error("❌ Payment error:", error);
      alert(
        `Payment failed to initialize: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  // Add PayHere event handlers
  useEffect(() => {
    if (typeof window !== "undefined" && window.payhere) {
      window.payhere.onCompleted = function (orderId: string) {
        console.log("Payment completed. OrderID:", orderId);
        // Redirect to success page or show success message
        window.location.href = `/payment/success?orderId=${orderId}`;
      };

      window.payhere.onDismissed = function () {
        console.log("Payment dismissed");
        alert("Payment was cancelled");
      };

      window.payhere.onError = function (error: string) {
        console.log("Error:", error);
        alert("Payment error: " + error);
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Make a Donation
          </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePayment();
            }}
            className="space-y-6"
          >
            {/* Donor Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={donationData.donorName}
                onChange={(e) =>
                  setDonationData({
                    ...donationData,
                    donorName: e.target.value,
                  })
                }
                placeholder="Enter your full name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={donationData.email}
                onChange={(e) =>
                  setDonationData({ ...donationData, email: e.target.value })
                }
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={donationData.phone}
                onChange={(e) =>
                  setDonationData({ ...donationData, phone: e.target.value })
                }
                placeholder="Enter your phone number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                required
                value={donationData.address}
                onChange={(e) =>
                  setDonationData({ ...donationData, address: e.target.value })
                }
                placeholder="Enter your address"
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                required
                value={donationData.city}
                onChange={(e) =>
                  setDonationData({ ...donationData, city: e.target.value })
                }
                placeholder="Enter your city"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount (LKR)
              </label>
              <input
                type="number"
                required
                min="100"
                step="0.01"
                value={donationData.amount}
                onChange={(e) =>
                  setDonationData({
                    ...donationData,
                    amount: parseFloat(e.target.value),
                  })
                }
                placeholder="Enter amount in LKR"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Donate Now - LKR {donationData.amount.toFixed(2)}
            </button>
          </form>

          {/* Info Section */}
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">
              💳 Secure Payment with PayHere
            </h3>
            <p className="text-sm text-green-700">
              Your donation will be processed securely through PayHere. You can
              pay using Visa, MasterCard, or mobile payment methods.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
