"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Donations/Navbar";

type Hospital = { _id?: string; name?: string; location?: string };

export default function DonationPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [query, setQuery] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        console.log("[donation] GET /api/hospitals");
        const res = await fetch("/api/hospitals", { cache: "no-store" });
        const payload = await res.json().catch(() => null);
        console.log("[donation] status:", res.status, "payload:", payload);

        if (res.ok && Array.isArray(payload)) {
          setHospitals(payload);
          setFilteredHospitals(payload);
          setErrMsg(null);
        } else {
          setHospitals([]);
          setFilteredHospitals([]);
          setErrMsg(
            typeof (payload as any)?.error === "string"
              ? (payload as any).error
              : "Failed to load hospitals"
          );
        }
      } catch (e) {
        console.error("[donation] fetch failed:", e);
        setHospitals([]);
        setFilteredHospitals([]);
        setErrMsg(String(e));
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    setFilteredHospitals(
      hospitals.filter((h) =>
        (h.name ?? "").toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, hospitals]);

  return (
    <div className="min-h-screen bg-[#FFFAF0]">
      {/* Top navigation (sticky) */}
      <Navbar />

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold text-green-700">Make a Donation</h1>
          <p className="text-gray-700 mt-2">
            Your generous donations are crucial for us to sustain our efforts, and we deeply
            appreciate any assistance you can offer. Thank you!
          </p>
        </header>

        <section className="mt-2">
          <h2 className="text-lg font-semibold text-green-600">Hospital List</h2>

          <input
            type="text"
            placeholder="Search hospitals..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mt-3 w-full p-2 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* status / errors */}
          {!loaded && (
            <div className="mt-3 text-sm text-gray-600">Loading hospitals…</div>
          )}
          {errMsg && (
            <div className="mt-3 p-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
              {errMsg}
            </div>
          )}

          {/* List */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {!loaded && !errMsg && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse px-4 py-3 rounded-xl bg-white border border-stone-200">
                  <div className="h-4 w-2/3 bg-stone-200 rounded" />
                  <div className="h-3 w-1/3 bg-stone-200 rounded mt-2" />
                </div>
            ))}
            </div>
          )}

            {filteredHospitals.map((h) => {
              const id = h._id ?? `${h.name}-${h.location ?? ""}`;
              const href = `/donation/${encodeURIComponent(id)}?name=${encodeURIComponent(h.name ?? "Hospital")}`;
              return (
                <a
                  key={id}
                  href={href}
                  className="block px-4 py-3 rounded-xl bg-white text-gray-700 shadow-sm border border-stone-200 hover:shadow transition"
                >
                  <div className="font-medium">{h.name}</div>
                  {h.location && <div className="text-sm text-gray-500">{h.location}</div>}
                </a>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
