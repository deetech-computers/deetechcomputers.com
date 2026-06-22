import AdminShell from "@/components/admin/admin-shell";
import AdminDashboard from "@/components/admin/admin-dashboard";
import "./admin-dashboard.css";
import "./admin-dashboard-mobile.css";

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <AdminDashboard />
    </AdminShell>
  );
}
