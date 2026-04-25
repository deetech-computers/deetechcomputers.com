import AdminShell from "@/components/admin/admin-shell";
import AdminManager from "@/components/admin/admin-manager";

export default function AdminMessagesPage() {
  return (
    <AdminShell>
      <AdminManager type="messages" />
    </AdminShell>
  );
}
