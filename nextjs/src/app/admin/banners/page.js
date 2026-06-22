import AdminShell from "@/components/admin/admin-shell";
import AdminManager from "@/components/admin/admin-manager";
import "./banners-desktop.css";
import "./banners-mobile.css";

export default function AdminBannersPage() {
  return (
    <div className="admin-banners-route">
      <AdminShell>
        <AdminManager type="banners" />
      </AdminShell>
    </div>
  );
}
