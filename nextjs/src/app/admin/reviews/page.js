import AdminShell from "@/components/admin/admin-shell";
import AdminManager from "@/components/admin/admin-manager";
import "./reviews-desktop.css";
import "./reviews-mobile.css";

export default function AdminReviewsPage() {
  return (
    <div className="admin-reviews-route">
      <AdminShell>
        <AdminManager type="reviews" />
      </AdminShell>
    </div>
  );
}
