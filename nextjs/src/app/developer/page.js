import Image from "next/image";
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
        <section className="developer-profile-intro">
          <div className="developer-profile-intro__photo">
            <Image
              src="/developer/daniel-carta.jpg"
              alt="Daniel Adjei Mensah"
              width={860}
              height={1147}
              priority
            />
          </div>
          <div className="developer-profile-intro__copy">
            <h2>Daniel Adjei Mensah</h2>
            <p>
              I&apos;m a web developer who builds practical, reliable digital products — from clean interfaces to the systems that keep them running behind the scenes.
            </p>
          </div>
        </section>

        <section className="policy-content-section">
          <h2>About This Project</h2>
          <p>
            DEETECH COMPUTERS is a full e-commerce platform for laptops, desktops, phones, and accessories in Ghana. Shoppers can browse products, build a cart, and check out using several payment options including Mobile Money, Hubtel, and bank transfer. Every order is tracked from checkout through delivery, with an account area for order history and an admin system behind the scenes to manage products, orders, and customers.
          </p>
          <p>
            It&apos;s built end to end with React, Next.js, and MongoDB — the storefront customers see and the systems that keep it running.
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
      </article>
    </main>
  );
}
