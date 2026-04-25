import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ResetPasswordAliasPage({ searchParams }) {
  const params = await searchParams;
  const token = params?.token || params?.resetToken;

  if (token) {
    redirect(`/reset-password/${token}`);
  }

  return (
    <main className="shell page-section auth-page">
      <section className="auth-shell">
        <div className="auth-panel auth-panel--form">
          <p className="section-kicker">Password reset</p>
          <h1>Reset link required.</h1>
          <p className="auth-lead">Open the secure reset link from your email, or request a fresh one if the link is missing or expired.</p>
          <Link href="/forgot-password" className="primary-link auth-submit">
            Request reset link
          </Link>
        </div>
        <aside className="auth-panel auth-panel--story" aria-label="Reset link help">
          <span className="auth-badge">Need help?</span>
          <h2>Reset links are sent to protect your account from unwanted password changes.</h2>
          <div className="auth-benefits">
            <p><strong>Use the newest link</strong><span>If you requested multiple resets, open the latest email.</span></p>
            <p><strong>Check spam</strong><span>Your email provider may move automated messages there.</span></p>
          </div>
        </aside>
      </section>
    </main>
  );
}
