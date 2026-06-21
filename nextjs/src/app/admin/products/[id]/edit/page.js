import AdminShell from "@/components/admin/admin-shell";
import AdminManager from "@/components/admin/admin-manager";
import "../../product-editor-desktop.css";
import "../../product-editor-mobile.css";

export default async function AdminEditProductPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id || "";

  return (
    <div className="admin-product-editor-route">
      <AdminShell>
        <AdminManager type="products" productMode="edit" productId={id} />
      </AdminShell>
    </div>
  );
}
