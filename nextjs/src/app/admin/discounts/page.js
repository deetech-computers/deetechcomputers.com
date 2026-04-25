import AdminShell from "@/components/admin/admin-shell";
import AdminManager from "@/components/admin/admin-manager";

export default function AdminDiscountsPage() {
  return (
    <AdminShell>
      <AdminManager type="discounts" />
    </AdminShell>
  );
}
