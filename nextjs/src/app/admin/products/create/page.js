import AdminShell from "@/components/admin/admin-shell";
import AdminManager from "@/components/admin/admin-manager";
import "../product-editor-desktop.css";
import "../product-editor-mobile.css";

export default function AdminCreateProductPage() {
  return (
    <div className="admin-product-editor-route">
      <AdminShell>
        <AdminManager type="products" productMode="create" />
      </AdminShell>
    </div>
  );
}
