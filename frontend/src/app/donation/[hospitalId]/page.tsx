"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Donations/Navbar";
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
    <div className="min-h-screen bg-[#FFFAF0]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-green-700 hover:underline mb-4"
        >
          ← Back to Hospitals
        </button>

        <header className="mb-6">
          <h1 className="text-3xl font-bold text-green-700">{hospitalName}</h1>
          <p className="text-gray-700 mt-2">
            Current medicine shortages and funding progress.
          </p>
        </header>

        {!loaded && !errMsg && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse p-4 rounded-xl bg-white border border-stone-200"
              >
                <div className="h-5 w-2/3 bg-stone-200 rounded mb-3" />
                <div className="h-3 w-1/3 bg-stone-200 rounded mb-2" />
                <div className="h-3 w-1/2 bg-stone-200 rounded mb-3" />
                <div className="h-2 w-full bg-stone-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {errMsg && (
          <div className="mt-4 p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
            {errMsg}
          </div>
        )}

        {loaded && !errMsg && (
          <div className="mt-6">
            {shortages.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">
                  No active medicine shortages at this time
                </div>
                <div className="text-gray-400 text-sm mt-2">
                  Check back later for updates
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {shortages.map((shortage) => {
                const progress = donationProgress[shortage.id];
                const totalDonated = progress?.total_donated || 0;
                const donationCount = progress?.donation_count || 0;
                const estimatedFunding = shortage.estimatedFunding || 0;

                return (
                  <div
                    key={shortage.id}
                    className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="p-5 border-b border-gray-100">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {shortage.medicineName}
                          </h3>
                          {shortage.genericName && (
                            <p className="text-sm text-gray-600">
                              ({shortage.genericName})
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(
                            shortage.urgencyLevel
                          )}`}
                        >
                          {shortage.urgencyLevel}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">
                            Quantity Needed:
                          </span>
                          <div className="font-semibold text-gray-800">
                            {shortage.quantityNeeded.toLocaleString()}{" "}
                            {shortage.unit}
                          </div>
                        </div>
                        {estimatedFunding > 0 && (
                          <div>
                            <span className="text-gray-500">
                              Estimated Cost:
                            </span>
                            <div className="font-semibold text-gray-800">
                              {formatCurrency(estimatedFunding)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Section */}
                    {estimatedFunding > 0 && (
                      <div className="p-4 bg-gray-50">
                        <DonationProgress
                          totalDonated={totalDonated}
                          estimatedFunding={estimatedFunding}
                          showPercentage={true}
                          showAmounts={true}
                          className="mb-3"
                        />
                        <div className="text-xs text-gray-600">
                          {donationCount} donation
                          {donationCount !== 1 ? "s" : ""} received
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {shortage.description && (
                      <div className="p-4">
                        <p className="text-sm text-gray-600">
                          {shortage.description}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="p-4 border-t border-gray-100">
                      <button
                        onClick={() => goDonate(shortage)}
                        className="w-full px-4 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition duration-200 flex items-center justify-center space-x-2"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        <span>Donate Now</span>
                      </button>
                    </div>

                    {/* Additional Info */}
                    <div className="px-4 pb-4">
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>
                          Posted:{" "}
                          {new Date(shortage.datePosted).toLocaleDateString()}
                        </span>
                        {shortage.expirationDate && (
                          <span>
                            Expires:{" "}
                            {new Date(
                              shortage.expirationDate
                            ).toLocaleDateString()}
                          </span>
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
