"use client";


import { useMedicineRequests } from "@/app/hooks/useMedicineRequests";

const RequestsTable: React.FC = () => {
  const { requests } = useMedicineRequests();

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-sm font-medium mb-2 text-black">Medicine Requests</h2>
      <table className="w-full text-sm text-left text-black">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-2 py-1">Hospital</th>
            <th className="px-2 py-1">Medicine</th>
            <th className="px-2 py-1">Price</th>
            <th className="px-2 py-1">Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="border-b">
              <td className="px-2 py-1">{req.hospitalName}</td>
              <td className="px-2 py-1">{req.medicine}</td>
              <td className="px-2 py-1">{req.price}</td>
              <td className="px-2 py-1">
                {req.status === "Pending" && (
                  <span className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">
                    Pending
                  </span>
                )}
                {req.status === "Accepted" && (
                  <span className="bg-green-200 text-green-800 px-2 py-0.5 rounded">
                    Accepted
                  </span>
                )}
                {req.status === "Rejected" && (
                  <span className="bg-red-200 text-red-800 px-2 py-0.5 rounded">
                    Rejected
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsTable;
