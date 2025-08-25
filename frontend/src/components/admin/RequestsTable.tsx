const requests = [
  { hospital: "Hospital A", medicine: "Paracetamol", quantity: 100, status: "Pending" },
  { hospital: "Hospital B", medicine: "Ibuprofen", quantity: 200, status: "Pending" },
  { hospital: "Hospital C", medicine: "Amoxicillin", quantity: 150, status: "Pending" },
];

const RequestsTable: React.FC = () => {
  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-sm font-medium mb-2 text-black">Pending Medicine Requests</h2>
      <table className="w-full text-sm text-left text-black">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-2 py-1">Hospital</th>
            <th className="px-2 py-1">Medicine</th>
            <th className="px-2 py-1">Quantity</th>
            <th className="px-2 py-1">Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req, idx) => (
            <tr key={idx} className="border-b">
              <td className="px-2 py-1">{req.hospital}</td>
              <td className="px-2 py-1">{req.medicine}</td>
              <td className="px-2 py-1">{req.quantity}</td>
              <td className="px-2 py-1">
                <span className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">
                  {req.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsTable;
