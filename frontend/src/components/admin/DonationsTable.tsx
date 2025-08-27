const donations = [
  { donor: "John", amount: "200", medicine: "Paracetamol", status: "Approved" },
  { donor: "Mary", amount: "100", medicine: "Vitamin C", status: "Approved" },
  { donor: "Alex", amount: "300", medicine: "Peracitamol", status: "Pending" },
];

const DonationsTable: React.FC = () => {
  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-sm font-medium mb-2 text-black">Recent Donations</h2>
      <table className="w-full text-sm text-left text-black">
        <thead>
          <tr className="bg-gray-100 ">
            <th className="px-2 py-1 ">Donor</th>
            <th className="px-2 py-1">Amount</th>
            <th className="px-2 py-1">Medicine</th>
            <th className="px-2 py-1">Status</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((don, idx) => (
            <tr key={idx} className="border-b">
              <td className="px-2 py-1">{don.donor}</td>
              <td className="px-2 py-1">Rs. {don.amount}</td>
              <td className="px-2 py-1">{don.medicine}</td>
              <td className="px-2 py-1">
                <span
                  className={`px-2 py-0.5 rounded ${
                    don.status === "Approved"
                      ? "bg-green-200 text-green-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {don.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationsTable;
