import AdminShell from "@/components/admin/admin-shell";
import AdminManager from "@/components/admin/admin-manager";
import "./messages-desktop.css";
import "./messages-mobile.css";

export default function AdminMessagesPage() {
  return (
    <div className="admin-messages-route">
      <AdminShell>
        <AdminManager type="messages" />
      </AdminShell>
    </div>
  );
}
