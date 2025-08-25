import { Home, Database, Heart, Users, Settings } from "lucide-react";

const Sidebar = () => {
  const menus = [
    { name: "Overview", icon: Home },
    { name: "Hospitals", icon: Users },
    { name: "Medicine Requests", icon: Database },
    { name: "Donations", icon: Heart },
    { name: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-gradient-to-br from-green-100 to-green-500 text-black flex flex-col">
      <div className="p-8 text-4xl font-bold font-sans bg-gradient-to-r from-orange-500 to-green-700 bg-clip-text text-transparent">Admin</div>
      <nav className="flex-1 px-4 space-y-2">
        {menus.map((item, idx) => (
          <button
            key={idx}
            className="flex items-center w-full p-2 rounded hover:bg-green-500 transition"
          >
            <item.icon className="h-5 w-5 mr-2" />
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
