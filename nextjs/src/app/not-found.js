import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell page-section">
      <section className="panel">
        <h1>Page not found</h1>
        <p>This frontend no longer relies on legacy HTML route mapping.</p>
        <Link href="/" className="primary-link">
          Return home
        </Link>
      </section>
    </main>
  );
}
