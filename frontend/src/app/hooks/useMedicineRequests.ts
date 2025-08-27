"use client";

import { useState } from "react";

export type MedicineRequest = {
  id: number;
  hospitalName: string;
  medicine: string;
  price: string;
  status: "Pending" | "Accepted" | "Rejected";
};

export const useMedicineRequests = () => {
  const [requests, setRequests] = useState<MedicineRequest[]>([
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

  const handleAccept = (request: MedicineRequest) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === request.id ? { ...r, status: "Accepted" } : r
      )
    );
  };

  const handleReject = (request: MedicineRequest) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === request.id ? { ...r, status: "Rejected" } : r
      )
    );
  };

  return {
    requests,
    handleAccept,
    handleReject,
  };
};
