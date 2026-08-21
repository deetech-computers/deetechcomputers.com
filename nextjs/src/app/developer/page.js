import Link from "next/link";
import "@/components/content/static-content-page-desktop.css";
import "@/components/content/static-content-page-mobile.css";
import "./developer-desktop.css";
import "./developer-mobile.css";

const PORTFOLIO_URL = "https://iamdanieladjeimensah.vercel.app";

export default function DeveloperPage() {
  return (
    <main className="policy-standalone developer-page">
      <header className="policy-standalone__hero" role="banner">
        <div className="shell policy-standalone__hero-inner">
          <h1>Developer</h1>
          <p className="policy-standalone__crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Developer</span>
          </p>
        </div>
      </header>

      <article className="shell page-section policy-content policy-content--standalone developer-profile">
        <section className="policy-content-section">
          <h2>About This Project</h2>
          <p>
            DEETECH COMPUTERS is an e-commerce platform for laptops, desktops, phones, and accessories in Ghana, with secure checkout, order tracking, and a full admin system. Built and maintained by Daniel Adjei Mensah.
          </p>
        </section>

        <section className="policy-content-section policy-content-section--cta developer-portfolio-cta">
          <h2>Want to Know More About Me?</h2>
          <p>See my full portfolio, projects, and experience.</p>
          <div className="policy-cta-actions">
            <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer">
              Click Here
            </a>
          </div>
        </section>

        <section className="policy-content-section developer-contact-section">
          <h2>Contact</h2>
          <div className="policy-cta-actions developer-contact-actions">
            <a href="mailto:cartadaniel01@gmail.com">cartadaniel01@gmail.com</a>
            <a href="tel:+2330509673406">+233 050 967 3406</a>
          </div>
        </section>
      </article>
    </main>
  );
}
