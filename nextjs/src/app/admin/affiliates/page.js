import AdminShell from "@/components/admin/admin-shell";
import AdminManager from "@/components/admin/admin-manager";
import "./affiliates-desktop.css";
import "./affiliates-mobile.css";

export default function AdminAffiliatesPage() {
  return (
    <div className="admin-affiliates-route">
      <AdminShell>
        <AdminManager type="affiliates" />
      </AdminShell>
    </div>
  );
}
