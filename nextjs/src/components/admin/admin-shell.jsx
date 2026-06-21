import AdminNav from "./admin-nav";

export default function AdminShell({ children }) {
  return (
    <main className="shell page-section admin-shell">
      <div className="admin-layout">
        <AdminNav />
        <div className="admin-main">{children}</div>
      </div>
    </main>
  );
}
