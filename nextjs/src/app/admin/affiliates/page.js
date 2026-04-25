import AdminShell from "@/components/admin/admin-shell";
import AdminManager from "@/components/admin/admin-manager";

export default function AdminAffiliatesPage() {
  return (
    <AdminShell>
      <AdminManager type="affiliates" />
    </AdminShell>
  );
}
