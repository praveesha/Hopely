"use client";

import React, { useState } from "react";

type MedicineRequest = {
  id: number;
  hospitalName: string;
  medicine: string;
  price: string;
  status: "Pending" | "Accepted" | "Rejected";
};

const HospitalsPage = () => {
  const [pendingRequests, setPendingRequests] = useState<MedicineRequest[]>([
    {
      id: 1,
      hospitalName: "St. Mary’s Hospital",
      medicine: "Paracetamol",
      price: "Rs.1000",
      status: "Pending",
    },
    {
      id: 2,
      hospitalName: "City General",
      medicine: "Vitamin C Tablets",
      price: "Rs.500",
      status: "Pending",
    },
    {
      id: 3,
      hospitalName: "Green Valley Clinic",
      medicine: "Insulin",
      price: "Rs.2500",
      status: "Pending",
    },
  ]);

  const [acceptedRequests, setAcceptedRequests] = useState<MedicineRequest[]>([]);
  const [rejectedRequests, setRejectedRequests] = useState<MedicineRequest[]>([]);

  const handleAccept = (request: MedicineRequest) => {
    setPendingRequests(pendingRequests.filter((r) => r.id !== request.id));
    setAcceptedRequests([...acceptedRequests, { ...request, status: "Accepted" }]);
  };

  const handleReject = (request: MedicineRequest) => {
    setPendingRequests(pendingRequests.filter((r) => r.id !== request.id));
    setRejectedRequests([...rejectedRequests, { ...request, status: "Rejected" }]);
  };

  const renderTable = (title: string, data: MedicineRequest[], showActions = false) => (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6 w-full">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 ">ID</th>
            <th className="p-2 ">Hospital Name</th>
            <th className="p-2 ">Medicine</th>
            <th className="p-2 ">Price</th>
            <th className="p-2 ">Status</th>
            {showActions && <th className="p-2 ">Action</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((req) => (
            <tr key={req.id} className="text-center">
              <td className="p-2 ">{req.id}</td>
              <td className="p-2 ">{req.hospitalName}</td>
              <td className="p-2 ">{req.medicine}</td>
              <td className="p-2 ">{req.price}</td>
              <td className="p-2 ">{req.status}</td>
              {showActions && (
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleAccept(req)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(req)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              )}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={showActions ? 6 : 5} className="p-2 text-gray-500">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6">
      {renderTable("Main Medicine Requests", pendingRequests, true)}
      <div className="grid grid-cols-2 gap-6">
        {renderTable("Accepted Requests", acceptedRequests)}
        {renderTable("Rejected Requests", rejectedRequests)}
      </div>
    </div>
  );
};

export default HospitalsPage;
