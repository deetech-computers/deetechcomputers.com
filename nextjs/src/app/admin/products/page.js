import AdminShell from "@/components/admin/admin-shell";
import AdminManager from "@/components/admin/admin-manager";
import "./products-desktop.css";
import "./products-mobile.css";

export default function AdminProductsPage() {
  return (
    <div className="admin-products-list-route">
      <AdminShell>
        <AdminManager type="products" />
      </AdminShell>
    </div>
  );
}
