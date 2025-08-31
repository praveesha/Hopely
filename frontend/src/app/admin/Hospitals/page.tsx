"use client";

import React, { useEffect, useState } from "react";

type Hospital = {
  id: string;
  name: string;
  location: string;
};

const HospitalsPage = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await fetch("http://localhost:9095/hospitals");
        const data = await res.json();
        setHospitals(data);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading hospitals...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hospitals</h1>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Hospital ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Location</th>
          </tr>
        </thead>
        <tbody>
          {hospitals.length > 0 ? (
            hospitals.map((hospital, index) => (
              <tr key={index} className="text-center">
                <td className="p-2">{hospital.id}</td>
                <td className="p-2">{hospital.name}</td>
                <td className="p-2">{hospital.location}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="p-4 text-gray-500">
                No hospitals found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HospitalsPage;
