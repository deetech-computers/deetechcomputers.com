import AdminShell from "@/components/admin/admin-shell";
import AdminManager from "@/components/admin/admin-manager";

export default function AdminOrdersPage() {
  return (
    <AdminShell>
      <AdminManager type="orders" />
    </AdminShell>
  );
}
