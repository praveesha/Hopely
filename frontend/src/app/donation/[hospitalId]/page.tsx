"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Donations/Navbar";

type Shortage = {
  _id?: string;
  medicine: string;
  available: number;
  needed: number;
  lack: number;
  unit?: string;
};

export default function HospitalDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const hospitalId = String(params?.hospitalId ?? "");
  const hospitalName = useMemo(
    () => searchParams?.get("name") ?? "Hospital",
    [searchParams]
  );

  const [items, setItems] = useState<Shortage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!hospitalId) return;
    (async () => {
      try {
        const res = await fetch(`/api/hospitals/${encodeURIComponent(hospitalId)}/medicines`, { cache: "no-store" });
        const payload = await res.json().catch(() => null);
        if (res.ok && Array.isArray(payload)) {
          setItems(payload);
          setErrMsg(null);
        } else {
          setItems([]);
          setErrMsg(typeof payload?.error === "string" ? payload.error : "Failed to load medicine requests");
        }
      } catch (e) {
        setItems([]);
        setErrMsg(String(e));
      } finally {
        setLoaded(true);
      }
    })();
  }, [hospitalId]);

  const onParcel = (m: Shortage) => {
    // TODO: implement
    console.log("[parcel]", hospitalId, m);
  };
  const onMoney = (m: Shortage) => {
    // TODO: implement
    console.log("[money]", hospitalId, m);
  };

  return (
    <div className="min-h-screen bg-[#FFFAF0]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <button onClick={() => router.back()} className="text-sm text-green-700 hover:underline">
          ← Back
        </button>

        <header className="mt-2 mb-4">
          <h1 className="text-2xl font-semibold text-green-700">{hospitalName}</h1>
          <p className="text-gray-700 mt-2">Requested medicines and current availability.</p>
        </header>

        {!loaded && !errMsg && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse px-4 py-3 rounded-xl bg-white border border-stone-200">
                <div className="h-4 w-2/3 bg-stone-200 rounded" />
                <div className="h-3 w-1/3 bg-stone-200 rounded mt-2" />
                <div className="h-3 w-1/2 bg-stone-200 rounded mt-2" />
              </div>
            ))}
          </div>
        )}

        {errMsg && (
          <div className="mt-3 p-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded">{errMsg}</div>
        )}

        {loaded && !errMsg && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.length === 0 && <div className="text-sm text-gray-600">No medicine requests for this hospital yet.</div>}

            {items.map((m) => (
              <div key={m._id ?? m.medicine} className="p-4 rounded-xl bg-white shadow-sm border border-stone-200">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-gray-800">{m.medicine}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      Available: <span className="font-medium text-gray-700">{m.available}</span>
                      {" • "}
                      Needed: <span className="font-medium text-gray-700">{m.needed}</span>
                      {" • "}
                      Lack:{" "}
                      <span className={m.lack > 0 ? "font-semibold text-red-600" : "font-semibold text-green-600"}>
                        {m.lack}
                      </span>
                      {m.unit ? ` • ${m.unit}` : ""}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button onClick={() => onParcel(m)} className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition text-sm">
                    Parcel
                  </button>
                  <button onClick={() => onMoney(m)} className="px-3 py-2 rounded-lg border border-green-600 text-green-700 hover:bg-green-50 transition text-sm">
                    Money
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
