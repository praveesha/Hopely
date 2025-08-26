import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from "recharts";

const medicineData = [
  { name: "Paracetamol", requests: 120 },
  { name: "Ibuprofen", requests: 90 },
  { name: "Amoxicillin", requests: 75 },
  { name: "Bisacodyl", requests: 115 },
];

const donationsVsRequests = [
  { month: "Jan", donations: 20, requests: 30 },
  { month: "Feb", donations: 25, requests: 28 },
  { month: "Mar", donations: 40, requests: 35 },
  { month: "Apr", donations: 38, requests: 42 },
];

const Graphs: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <div className="p-4 bg-white rounded-xl shadow cursor-pointer transform transition-transform duration-200 hover:scale-101 active:scale-95">
        <h2 className="text-sm font-medium mb-2 text-black">Top Requested Medicines</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={medicineData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="requests" fill="#3AC74C" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className="p-4 bg-white rounded-xl shadow cursor-pointer transform transition-transform duration-200 hover:scale-101 active:scale-95">
        <h2 className="text-sm font-medium mb-2 text-black">Donations vs Requests</h2>
         <ResponsiveContainer width="100%" height={280}>
          <LineChart data={donationsVsRequests}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#374151" />
            <YAxis stroke="#374151" />
            
            <Line
              type="monotone"
              dataKey="donations"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: "#22c55e", stroke: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 2, fill: "#fff", stroke: "#22c55e" }}
              name="Donations"
            />
            <Line
              type="monotone"
              dataKey="requests"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: "#ef4444", stroke: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 2, fill: "#fff", stroke: "#ef4444" }}
              name="Requests"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Graphs;
