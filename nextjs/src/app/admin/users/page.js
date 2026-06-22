import AdminShell from "@/components/admin/admin-shell";
import AdminManager from "@/components/admin/admin-manager";
import "./users-desktop.css";
import "./users-mobile.css";

export default function AdminUsersPage() {
  return (
    <div className="admin-users-route">
      <AdminShell>
        <AdminManager type="users" />
      </AdminShell>
    </div>
  );
}
