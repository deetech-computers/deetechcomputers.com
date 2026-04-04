import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="shell page-section">
      <section className="panel">
        <p className="section-kicker">Contact</p>
        <h1>Support workflows can now be rebuilt on native app flows.</h1>
        <p className="hero-copy">
          The backend support endpoints are still available. This page now belongs to
          the standalone app foundation and is ready for the next UX pass.
        </p>
        <div className="hero-actions">
          <Link href="/messages" className="primary-link">Open messages</Link>
          <a href="mailto:deetechcomputers01@gmail.com" className="ghost-link">Email support</a>
          <a href="https://wa.me/233591755964" target="_blank" rel="noreferrer" className="ghost-link">WhatsApp</a>
          <Link href="/faq" className="ghost-link">FAQ</Link>
        </div>
      </section>
    </main>
  );
}
