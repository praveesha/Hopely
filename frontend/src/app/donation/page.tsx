"use client";

import { useEffect, useState } from "react";
import Navigation from "../../components/Navigation";

type Hospital = {
  _id?: string;
  name?: string;
  location?: string;
  hospitalId?: string;
};

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

      {/* Page content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 pt-32">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#143f3f]/10 backdrop-blur-sm rounded-full text-[#143f3f] text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-[#143f3f] rounded-full animate-pulse"></div>
            Healthcare Support
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-[#143f3f] mb-6 leading-tight">
            Make a{" "}
            <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
              Donation
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Your generous donations are crucial for us to sustain our efforts.
            Choose a hospital below to see their current medicine shortages and
            make a direct impact on patient care.
          </p>
        </header>

        <section className="mt-8">
          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search hospitals by name or location..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#143f3f] focus:border-transparent shadow-sm transition-all duration-300"
              />
            </div>
          </div>

          {/* Status Messages */}
          {!loaded && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-3 text-gray-600">
                <svg
                  className="animate-spin w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Loading hospitals…
              </div>
            </div>
          )}

          {errMsg && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="glass p-6 text-red-700 bg-red-50/80 border border-red-200 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {errMsg}
                </div>
              </div>
            </div>
          )}

          {/* Hospital Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {!loaded && !errMsg && (
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="glass rounded-3xl p-8 border border-gray-200 animate-pulse"
                  >
                    <div className="h-6 w-2/3 bg-gray-200 rounded-2xl mb-4" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded-xl mb-3" />
                    <div className="h-3 w-1/3 bg-gray-200 rounded-lg" />
                  </div>
                ))}
              </>
            )}

            {filteredHospitals.map((h) => {
              const id = h.hospitalId ?? h._id ?? (h.name || "unknown");
              const href = `/donation/${encodeURIComponent(
                id
              )}?name=${encodeURIComponent(h.name ?? "Hospital")}`;
              return (
                <a
                  key={id}
                  href={href}
                  className="group glass rounded-3xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#143f3f] to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>

                  <h3 className="text-xl font-bold text-[#143f3f] mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                    {h.name}
                  </h3>

                  {h.location && (
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {h.location}
                    </div>
                  )}

                  {h.hospitalId && (
                    <div className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded-lg inline-block mb-4">
                      ID: {h.hospitalId}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-emerald-600 font-medium group-hover:gap-4 transition-all duration-300">
                    <span>View Medicine Needs</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Empty State */}
          {loaded &&
            !errMsg &&
            filteredHospitals.length === 0 &&
            hospitals.length > 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No hospitals found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms to find hospitals in your
                  area.
                </p>
              </div>
            )}

          {loaded && !errMsg && hospitals.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No hospitals registered
              </h3>
              <p className="text-gray-500">
                Check back later as more hospitals join our platform.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
