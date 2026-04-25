import AdminShell from "@/components/admin/admin-shell";
import AdminManager from "@/components/admin/admin-manager";

export default function AdminProductsPage() {
  return (
    <AdminShell>
      <AdminManager type="products" />
    </AdminShell>
  );
}
