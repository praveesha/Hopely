"use client";

import React, { useEffect, useState } from "react";

type Medicine = {
  id: string;
  hospitalId: string;
  medicineName: string;
  genericName: string;
  urgencyLevel: string;
  quantityNeeded: number;
  unit: string;
  description: string;
  datePosted: string;
  expirationDate: string;
  status: string;
};

const MedicineShortagesPage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:9090/medicineShortages");
      const data = await res.json();
      setMedicines(data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded-lg p-2 mb-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Medicine Shortages</h1>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">ID</th>
              <th className="p-2">Hospital ID</th>
              <th className="p-2">Medicine</th>
              <th className="p-2">Generic Name</th>
              <th className="p-2">Urgency</th>
              <th className="p-2">Quantity Needed</th>
              <th className="p-2">Unit</th>
              <th className="p-2">Description</th>
              <th className="p-2">Posted Date</th>
              <th className="p-2">Expiration</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((m, index) => (
              <tr key={index} className="text-center">
                <td className="p-2">{m.id}</td>
                <td className="p-2">{m.hospitalId}</td>
                <td className="p-2">{m.medicineName}</td>
                <td className="p-2">{m.genericName}</td>
                <td className="p-2">{m.urgencyLevel}</td>
                <td className="p-2">{m.quantityNeeded}</td>
                <td className="p-2">{m.unit}</td>
                <td className="p-2">{m.description}</td>
                <td className="p-2">{new Date(m.datePosted).toLocaleDateString()}</td>
                <td className="p-2">{m.expirationDate}</td>
                <td className="p-2">{m.status}</td>
              </tr>
            ))}
            {medicines.length === 0 && (
              <tr>
                <td colSpan={11} className="p-2 text-gray-500 text-center">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicineShortagesPage;
