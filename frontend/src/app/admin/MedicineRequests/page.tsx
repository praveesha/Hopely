"use client";

import { useMedicineRequests } from "../../hooks/useMedicineRequests";

const MedicineRequestsPage = () => {
const { requests, handleAccept, handleReject } = useMedicineRequests();

const pendingRequests = requests.filter((r) => r.status === "Pending");
const acceptedRequests = requests.filter((r) => r.status === "Accepted");
const rejectedRequests = requests.filter((r) => r.status === "Rejected");


  const renderTable = (
    title: string,
    data: typeof pendingRequests,
    showActions = false,
    type?: "accepted" | "rejected"
  ) => (
    <div className="bg-white shadow-md rounded-lg p-2 mb-6 w-full">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">ID</th>
            <th className="p-2">Hospital Name</th>
            <th className="p-2">Medicine</th>
            <th className="p-2">Price</th>
            <th className="p-2">Status</th>
            {showActions && <th className="p-2">Action</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((req) => (
            <tr
              key={req.id}
              className={`text-center ${
                type === "accepted" ? "bg-green-100" : type === "rejected" ? "bg-red-100" : ""
              }`}
            >
              <td className="p-2">{req.id}</td>
              <td className="p-2">{req.hospitalName}</td>
              <td className="p-2">{req.medicine}</td>
              <td className="p-2">{req.price}</td>
              <td className="p-2">{req.status}</td>
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
        {renderTable("Accepted Requests", acceptedRequests, false, "accepted")}
        {renderTable("Rejected Requests", rejectedRequests, false, "rejected")}
      </div>
    </div>
  );
};

export default MedicineRequestsPage;
