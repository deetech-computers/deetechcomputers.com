import AdminNav from "./admin-nav";

export default function AdminShell({ children }) {
  return (
    <main className="shell page-section">
      <div className="admin-layout">
        <AdminNav />
        <div>{children}</div>
      </div>
    </main>
  );
}
