const cards = [
  { title: "Total Hospitals", value: 120, color: "bg-yellow-500" },
  { title: "Active Medicine Requests", value: 56, color: "bg-red-500" },
  { title: "Pending Donations", value: "$5,000", color: "bg-yellow-500" },
  { title: "Critical Shortages", value: 8, color: "bg-red-500" },
  { title: "System Status", value: "Operational", color: "bg-yellow-500" },
];

const MetricsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="p-4 rounded-xl shadow bg-gradient-to-r from-green-200 to-orange-100 text-transparent flex flex-col items-center justify-center  cursor-pointer transform transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <span className="text-sm font-medium text-black">{card.title}</span>
          <span className={`text-lg font-bold mt-2 ${card.color} text-black px-3 py-1 rounded`}>
            {card.value}
          </span>
       
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;
