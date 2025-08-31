"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Navigation from "../../../components/Navigation";
import DonationProgress, {
  MiniDonationProgress,
} from "../../../components/DonationProgress";
import { MedicineShortage } from "../../../models/MedicineRequest";
import { DonationAPI } from "../../../lib/donationApi";
import { formatCurrency } from "../../../lib/donationUtils";

export default function HospitalDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const hospitalId = String(params?.hospitalId ?? "");
  const hospitalName = useMemo(
    () => searchParams?.get("name") ?? "Hospital",
    [searchParams]
  );

  const [shortages, setShortages] = useState<MedicineShortage[]>([]);
  const [donationProgress, setDonationProgress] = useState<
    Record<string, { total_donated: number; donation_count: number }>
  >({});
  const [loaded, setLoaded] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!hospitalId) return;
    (async () => {
      try {
        // Fetch shortages for this hospital using the proper API
        const res = await fetch(
          `/api/shortages/${encodeURIComponent(hospitalId)}`,
          {
            cache: "no-store",
          }
        );
        const payload = await res.json();

        if (res.ok && payload.success && Array.isArray(payload.data)) {
          const shortagesData = payload.data;
          setShortages(shortagesData);

          // Fetch donation progress for each shortage
          const progressPromises = shortagesData.map(
            async (shortage: MedicineShortage) => {
              const donationData = await DonationAPI.getDonationsByShortage(
                shortage.id
              );
              return {
                shortageId: shortage.id,
                progress: donationData.success ? donationData.data : null,
              };
            }
          );

          const progressResults = await Promise.all(progressPromises);
          const progressMap: Record<
            string,
            { total_donated: number; donation_count: number }
          > = {};

          progressResults.forEach(({ shortageId, progress }) => {
            if (progress) {
              progressMap[shortageId] = {
                total_donated: progress.total_donated,
                donation_count: progress.donation_count,
              };
            }
          });

          setDonationProgress(progressMap);
          setErrMsg(null);
        } else {
          setShortages([]);
          setErrMsg(payload.message || "Failed to load medicine shortages");
        }
      } catch (e) {
        setShortages([]);
        setErrMsg(String(e));
      } finally {
        setLoaded(true);
      }
    })();
  }, [hospitalId]);

  const goDonate = (shortage: MedicineShortage) => {
    const qs = new URLSearchParams({
      m: shortage.medicineName,
      n: hospitalName,
      shortage_id: shortage.id,
      estimated_funding: shortage.estimatedFunding?.toString() || "0",
    }).toString();
    router.push(`/donation/${encodeURIComponent(hospitalId)}/donate?${qs}`);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "CRITICAL":
        return "bg-red-100 text-red-800 border-red-200";
      case "HIGH":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

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

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 pt-32">
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
          Back to Hospitals
        </button>

        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#143f3f]/10 backdrop-blur-sm rounded-full text-[#143f3f] text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-[#143f3f] rounded-full animate-pulse"></div>
            Medicine Shortages
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold text-[#143f3f] mb-6 leading-tight">
            {hospitalName}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Current medicine shortages and funding progress. Your donation
            directly helps patients get the care they need.
          </p>
        </header>

        {/* Loading State */}
        {!loaded && !errMsg && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="glass rounded-3xl p-8 border border-gray-200 animate-pulse"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="h-6 w-48 bg-gray-200 rounded-2xl mb-3" />
                    <div className="h-4 w-32 bg-gray-200 rounded-xl" />
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </div>
                  <div>
                    <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full mb-4" />
                <div className="h-12 w-full bg-gray-200 rounded-2xl" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {errMsg && (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="glass p-8 text-red-700 bg-red-50/80 border border-red-200 rounded-3xl backdrop-blur-sm text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-500"
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
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Unable to Load Medicine Shortages
              </h3>
              <p>{errMsg}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {loaded && !errMsg && (
          <div className="mt-8">
            {shortages.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-12 h-12 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#143f3f] mb-3">
                  All Set!
                </h3>
                <p className="text-gray-600 text-lg">
                  No active medicine shortages at this time
                </p>
                <p className="text-gray-500 mt-2">
                  Check back later for updates from this hospital
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {shortages.map((shortage) => {
                const progress = donationProgress[shortage.id];
                const totalDonated = progress?.total_donated || 0;
                const donationCount = progress?.donation_count || 0;
                const estimatedFunding = shortage.estimatedFunding || 0;
                const progressPercentage =
                  estimatedFunding > 0
                    ? Math.min((totalDonated / estimatedFunding) * 100, 100)
                    : 0;

                return (
                  <div
                    key={shortage.id}
                    className="group glass rounded-3xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
                  >
                    {/* Header */}
                    <div className="p-8 pb-6">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#143f3f] to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
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
                                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z"
                                />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-[#143f3f] mb-1 group-hover:text-emerald-600 transition-colors duration-300">
                                {shortage.medicineName}
                              </h3>
                              {shortage.genericName && (
                                <p className="text-sm text-gray-600 font-medium">
                                  Generic: {shortage.genericName}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full border ${getUrgencyColor(
                            shortage.urgencyLevel
                          )}`}
                        >
                          {shortage.urgencyLevel}
                        </span>
                      </div>

                      {/* Medicine Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <div className="text-sm text-gray-500 mb-1">
                            Quantity Needed
                          </div>
                          <div className="text-lg font-bold text-[#143f3f]">
                            {shortage.quantityNeeded.toLocaleString()}{" "}
                            <span className="text-sm font-medium text-gray-600">
                              {shortage.unit}
                            </span>
                          </div>
                        </div>
                        {estimatedFunding > 0 && (
                          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4">
                            <div className="text-sm text-gray-500 mb-1">
                              Estimated Cost
                            </div>
                            <div className="text-lg font-bold text-amber-700">
                              {formatCurrency(estimatedFunding)}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {shortage.description && (
                        <div className="bg-blue-50 rounded-2xl p-4 mb-6">
                          <div className="text-sm text-gray-500 mb-2">
                            Details
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {shortage.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Progress Section */}
                    {estimatedFunding > 0 && (
                      <div className="px-8 pb-6">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100">
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-sm font-semibold text-gray-700">
                              Funding Progress
                            </div>
                            <div className="text-sm text-gray-500">
                              {donationCount} donation
                              {donationCount !== 1 ? "s" : ""} received
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-600">
                                {formatCurrency(totalDonated)} raised
                              </span>
                              <span className="text-sm font-medium text-gray-600">
                                {formatCurrency(estimatedFunding)} goal
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                                style={{ width: `${progressPercentage}%` }}
                              >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500">
                                {progressPercentage.toFixed(1)}% complete
                              </span>
                              {estimatedFunding > totalDonated && (
                                <span className="text-xs text-amber-600 font-medium">
                                  {formatCurrency(
                                    estimatedFunding - totalDonated
                                  )}{" "}
                                  remaining
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="px-8 pb-8">
                      <button
                        onClick={() => goDonate(shortage)}
                        className="w-full group/btn relative px-6 py-4 bg-gradient-to-r from-[#143f3f] via-emerald-600 to-[#143f3f] text-white rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                      >
                        <div className="relative z-10 flex items-center justify-center gap-3">
                          <svg
                            className="w-6 h-6 group-hover/btn:scale-110 transition-transform duration-200"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                          </svg>
                          <span>Donate Now</span>
                          <svg
                            className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-200"
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
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                      </button>
                    </div>

                    {/* Footer Info */}
                    <div className="px-8 pb-6 border-t border-gray-100 pt-6">
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <div className="flex items-center gap-2">
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Posted:{" "}
                          {new Date(shortage.datePosted).toLocaleDateString()}
                        </div>
                        {shortage.expirationDate && (
                          <div className="flex items-center gap-2">
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
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Expires:{" "}
                            {new Date(
                              shortage.expirationDate
                            ).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
