import AdminShell from "@/components/admin/admin-shell";
import AdminManager from "@/components/admin/admin-manager";

export default async function AdminEditProductPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id || "";

  return (
    <AdminShell>
      <AdminManager type="products" productMode="edit" productId={id} />
    </AdminShell>
  );
}
