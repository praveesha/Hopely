/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";

interface Admin {
  name: string;
  photo: string;
}

const Topbar: React.FC = () => {
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    // Replace this with your backend API call later
    const fetchAdmin = async () => {
      try {
        // Example: const res = await fetch("/api/admin/me");
        // const data = await res.json();
        const data: Admin = {
          name: "Admin name", // temporary placeholder
          photo: "https://via.placeholder.com/40",
        };
        setAdmin(data);
      } catch (error) {
        console.error("Failed to fetch admin info:", error);
      }
    };

    fetchAdmin();
  }, []);

  return (
    <header className="w-full flex items-center justify-between bg-white shadow p-4">
      {/* Logo + Title */}
      <div className="flex items-center justify-center space-x-2 mb-4 pt-2">
        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-orange-400 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-xl">H</span>
        </div>
        <span className="text-3xl font-bold bg-gradient-to-r from-green-500 to-orange-400 bg-clip-text text-transparent">
          Hopely
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <span className="text-green-600 pr-4 text-lg ">
          {new Date().toLocaleDateString()}
        </span>

        {/* Admin Info */}
        <div className="flex items-center space-x-6">
          <img
            src={admin?.photo || "https://via.placeholder.com/40"}
            alt="admin"
            className="w-10 h-10 rounded-full"
          />
          <div>
          <span className="font-medium text-green-600">{admin?.name || "Admin"}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
