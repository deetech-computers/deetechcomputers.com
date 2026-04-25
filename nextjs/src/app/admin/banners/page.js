import AdminShell from "@/components/admin/admin-shell";
import AdminManager from "@/components/admin/admin-manager";

export default function AdminBannersPage() {
  return (
    <AdminShell>
      <AdminManager type="banners" />
    </AdminShell>
  );
}
