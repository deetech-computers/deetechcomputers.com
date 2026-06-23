import AdminShell from "@/components/admin/admin-shell";
import AdminLogs from "@/components/admin/admin-logs";
import "./logs-desktop.css";
import "./logs-mobile.css";

export default function AdminLogsPage() {
  return (
    <div className="admin-logs-route">
      <AdminShell>
        <AdminLogs />
      </AdminShell>
    </div>
  );
}
