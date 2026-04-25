import AdminShell from "@/components/admin/admin-shell";
import AdminManager from "@/components/admin/admin-manager";

export default function AdminCreateProductPage() {
  return (
    <AdminShell>
      <AdminManager type="products" productMode="create" />
    </AdminShell>
  );
}
