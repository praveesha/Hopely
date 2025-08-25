"use client";

import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";
import MetricsCards from "@/components/admin/MetricsCards";
import Graphs from "@/components/admin/Graphs";
import RequestsTable from "@/components/admin/RequestsTable";
import DonationsTable from "@/components/admin/DonationsTable";



export default function AdminPage() {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="p-4 space-y-6 overflow-auto">
          {/* KPI Cards */}
          <MetricsCards />

          {/* Graphs */}
          <Graphs />

          {/* Requests & Donations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RequestsTable />
            <DonationsTable />
          </div>

        </main>
      </div>
    </div>
  );
}
