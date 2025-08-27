"use client";

import React, { useState } from "react";

type Donation = {
  id: number;
  donorName: string;
  medicine: string;
  requestId: number;
  amount: string;
  status: "Pending" | "Accepted" | "Rejected";
};

const DonationsPage = () => {
  const [pendingDonations, setPendingDonations] = useState<Donation[]>([
    {
      id: 1,
      donorName: "Alice",
      medicine: "Paracetamol",
      requestId: 101,
      amount: "Rs.1000",
      status: "Pending",
    },
    {
      id: 2,
      donorName: "Bob",
      medicine: "Vitamin C Tablets",
      requestId: 102,
      amount: "Rs.500",
      status: "Pending",
    },
    {
      id: 3,
      donorName: "Charlie",
      medicine: "Insulin",
      requestId: 103,
      amount: "Rs.2500",
      status: "Pending",
    },
  ]);

  const [acceptedDonations, setAcceptedDonations] = useState<Donation[]>([]);
  const [rejectedDonations, setRejectedDonations] = useState<Donation[]>([]);

  const handleAccept = (donation: Donation) => {
    setPendingDonations(pendingDonations.filter((d) => d.id !== donation.id));
    setAcceptedDonations([...acceptedDonations, { ...donation, status: "Accepted" }]);
  };

  const handleReject = (donation: Donation) => {
    setPendingDonations(pendingDonations.filter((d) => d.id !== donation.id));
    setRejectedDonations([...rejectedDonations, { ...donation, status: "Rejected" }]);
  };

  const renderTable = (title: string, data: Donation[], showActions = false, type?: "accepted" | "rejected") => (
    <div className="bg-white shadow-md rounded-lg p-2 mb-6 w-full">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">ID</th>
            <th className="p-2">Donor Name</th>
            <th className="p-2">Medicine</th>
            <th className="p-2">Request ID</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Status</th>
            {showActions && <th className="p-2">Action</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((donation) => (
            <tr
              key={donation.id}
              className={`text-center ${
                type === "accepted" ? "bg-green-100" : type === "rejected" ? "bg-red-100" : ""
              }`}
            >
              <td className="p-2">{donation.id}</td>
              <td className="p-2">{donation.donorName}</td>
              <td className="p-2">{donation.medicine}</td>
              <td className="p-2">{donation.requestId}</td>
              <td className="p-2">{donation.amount}</td>
              <td className="p-2">{donation.status}</td>
              {showActions && (
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleAccept(donation)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(donation)}
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
              <td colSpan={showActions ? 7 : 6} className="p-2 text-gray-500">
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
      {renderTable("Main Donations", pendingDonations, true)}
      <div className="grid grid-cols-2 gap-6">
        {renderTable("Accepted Donations", acceptedDonations, false, "accepted")}
        {renderTable("Rejected Donations", rejectedDonations, false, "rejected")}
      </div>
    </div>
  );
};

export default DonationsPage;
