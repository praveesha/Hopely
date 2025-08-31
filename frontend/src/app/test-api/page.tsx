"use client";

import { useEffect, useState } from "react";

export default function TestApiPage() {
  const [shortageData, setShortageData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testGetShortages = async () => {
    setLoading(true);
    setError(null);

    try {
      // Test with the hospital ID from the dashboard
      const response = await fetch("/api/shortages/CGH_001");
      const data = await response.json();
      console.log("API Response:", data);
      setShortageData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Test error:", err);
    } finally {
      setLoading(false);
    }
  };

  const testCreateShortage = async () => {
    setLoading(true);
    setError(null);

    try {
      const testShortage = {
        medicineName: "Test Medicine",
        genericName: "Test Generic",
        urgencyLevel: "HIGH",
        quantityNeeded: 100,
        unit: "tablets",
        description: "Test shortage for API debugging",
        expirationDate: "2026-12-31",
      };

      const response = await fetch("/api/shortages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testShortage),
      });

      const data = await response.json();
      console.log("Create Response:", data);
      setShortageData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Create error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>

      <div className="space-y-4 mb-8">
        <button
          onClick={testCreateShortage}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Loading..." : "Test Create Shortage"}
        </button>

        <button
          onClick={testGetShortages}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 ml-4"
        >
          {loading ? "Loading..." : "Test Get Shortages"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {shortageData && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">API Response:</h2>
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(shortageData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
