import AdminShell from "@/components/admin/admin-shell";
import AdminManager from "@/components/admin/admin-manager";

export default function AdminReviewsPage() {
  return (
    <AdminShell>
      <AdminManager type="reviews" />
    </AdminShell>
  );
}
