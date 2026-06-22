import AdminShell from "@/components/admin/admin-shell";
import AdminManager from "@/components/admin/admin-manager";
import "./discounts-desktop.css";
import "./discounts-mobile.css";

export default function AdminDiscountsPage() {
  return (
    <div className="admin-discounts-route">
      <AdminShell>
        <AdminManager type="discounts" />
      </AdminShell>
    </div>
  );
}
