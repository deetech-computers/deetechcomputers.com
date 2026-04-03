import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="shell page-section">
      <section className="panel">
        <p className="section-kicker">About</p>
        <h1>Deetech now has a frontend that can scale with the business.</h1>
        <p className="hero-copy">
          The project has been reset onto a JSX-first, Next.js-native foundation so
          future work can happen through reusable modules instead of static page duplication.
        </p>
        <div className="hero-actions">
          <Link href="/products" className="primary-link">Browse products</Link>
          <Link href="/contact" className="ghost-link">Contact support</Link>
          <Link href="/faq" className="ghost-link">Open FAQ</Link>
        </div>
      </section>
    </main>
  );
}
