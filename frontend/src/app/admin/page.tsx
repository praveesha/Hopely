import MetricsCards from "@/components/admin/MetricsCards";
import Graphs from "@/components/admin/Graphs";
import RequestsTable from "@/components/admin/RequestsTable";
import DonationsTable from "@/components/admin/DonationsTable";

export default function AdminPage() {
  return (
    <>
      <MetricsCards />
      <Graphs />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RequestsTable />
        <DonationsTable />
      </div>
    </>
  );
}
