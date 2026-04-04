import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ResetPasswordAliasPage({ searchParams }) {
  const params = await searchParams;
  const token = params?.token || params?.resetToken;

  if (token) {
    redirect(`/reset-password/${token}`);
  }

  return (
    <main className="shell page-section narrow-shell">
      <section className="panel">
        <p className="section-kicker">Password reset</p>
        <h1>Reset token required</h1>
        <p className="hero-copy">Open your reset link from email, or request a fresh one below.</p>
        <Link href="/forgot-password" className="primary-link">
          Request reset link
        </Link>
      </section>
    </main>
  );
}
