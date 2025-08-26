"use client"; // required for hooks like usePathname

import { Home, Database, Heart, Users, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const menus = [
    { name: "Overview", icon: Home, path: "/admin" },
    { name: "Pending Admin Requests", icon: Users, path: "/admin/PendingAdmin" },
    { name: "Hospitals", icon: Users, path: "/admin/Hospitals" },
    { name: "Medicine Requests", icon: Database, path: "/admin/MedicineRequests" },
    { name: "Donations", icon: Heart, path: "/admin/Donations" },
    { name: "Settings", icon: Settings, path: "/admin/Settings" },
  ];

  return (
    <aside className="w-64 bg-gradient-to-br from-green-100 to-green-500 text-black flex flex-col">
      <div className="p-8 text-4xl font-bold font-sans bg-gradient-to-r from-orange-500 to-green-700 bg-clip-text text-transparent">
        Admin
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {menus.map((item, idx) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={idx}
              href={item.path}
              className={`flex items-center w-full p-2 rounded transition ${
                isActive ? "bg-green-600 text-white" : "hover:bg-green-500"
              }`}
            >
              <item.icon className="h-5 w-5 mr-2" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
