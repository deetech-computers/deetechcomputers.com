import Link from "next/link";

const capabilityStats = [
  { value: "24+", label: "Product Lines" },
  { value: "2500+", label: "Devices Delivered" },
  { value: "99%", label: "Satisfied Customers" },
];

const missionCards = [
  {
    title: "Our Vision",
    body: "To be the trusted Ghanaian tech destination for laptops, gadgets, accessories, and dependable after-sales support.",
    icon: "vision",
  },
  {
    title: "Our Mission",
    body: "To make quality technology easier to access through honest guidance, fast delivery, secure payment options, and support that actually responds.",
    icon: "mission",
  },
];

const companyStats = [
  { value: "35+", label: "Trusted Supply Partners" },
  { value: "8+", label: "Years Serving Customers" },
  { value: "99%", label: "Satisfied Customers" },
  { value: "24+", label: "Core Categories" },
];

const team = [
  { name: "DEETECH Support", role: "Customer Guidance", accent: "is-gold" },
  { name: "Sales Desk", role: "Orders & Product Matching", accent: "is-cream" },
  { name: "Tech Desk", role: "Setup & Device Checks", accent: "is-sand" },
  { name: "Delivery Team", role: "Nationwide Fulfilment", accent: "is-white" },
];

const categoryTicker = [
  "Laptops",
  "Desktops",
  "Accessories",
  "Networking",
  "Gaming",
  "Storage",
  "Monitors",
  "Smart Devices",
];

function AboutIcon({ name }) {
  if (name === "vision") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4c5.72 0 10 6.2 10 8s-4.28 8-10 8S2 14 2 12s4.28-8 10-8Zm0 2C7.9 6 4.6 10.14 4.1 12 4.6 13.86 7.9 18 12 18s7.4-4.14 7.9-6C19.4 10.14 16.1 6 12 6Zm0 2.25A3.75 3.75 0 1 1 8.25 12 3.75 3.75 0 0 1 12 8.25Zm0 2A1.75 1.75 0 1 0 13.75 12 1.75 1.75 0 0 0 12 10.25Z" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5 4.75 6.2v5.43c0 5.07 2.91 8.74 7.25 9.87 4.34-1.13 7.25-4.8 7.25-9.87V6.2L12 2.5Zm0 2.23 5.25 2.68v4.22c0 4.01-2.16 6.85-5.25 7.87-3.09-1.02-5.25-3.86-5.25-7.87V7.41L12 4.73Zm-1.02 9.9-1.86-1.87-1.42 1.42 3.28 3.28 5.41-5.41-1.42-1.42-3.99 4Z" fill="currentColor" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <main className="shell page-section">
      <section className="checkout-hero about-hero">
        <h1>About Us</h1>
        <p className="checkout-hero__crumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>About Us</span>
        </p>
      </section>

      <section className="about-shell">
        <section className="about-story">
          <div className="about-story__gallery" aria-hidden="true">
            <div className="about-story__panel about-story__panel--tall is-dark">
              <img src="/logo.png" alt="" className="about-story__logo" />
            </div>
            <div className="about-story__panel about-story__panel--small is-cream">
              <span>Laptops</span>
            </div>
            <div className="about-story__panel about-story__panel--small is-sand">
              <span>Gadgets</span>
            </div>
            <div className="about-story__badge">DEETECH</div>
            <span className="about-story__spark about-story__spark--one" />
            <span className="about-story__spark about-story__spark--two" />
          </div>

          <div className="about-story__content">
            <p className="about-story__eyebrow">About Us</p>
            <h2>Your trusted plug for laptops, gadgets, and reliable tech support.</h2>
            <p>
              DEETECH COMPUTERS helps students, creators, professionals, and businesses find the
              right devices without guesswork. From laptops and monitors to accessories and smart
              gadgets, we focus on practical tech, honest recommendations, and fast support.
            </p>

            <div className="about-story__stats">
              {capabilityStats.map((item) => (
                <article key={item.label} className="about-story__stat">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </article>
              ))}
            </div>

            <div className="about-story__actions">
              <Link href="/products" className="primary-link">Browse Products</Link>
              <Link href="/contact" className="ghost-link">Contact Us</Link>
            </div>
          </div>
        </section>

        <section className="about-values">
          {missionCards.map((item) => (
            <article key={item.title} className="about-value-card">
              <span className="about-value-card__icon">
                <AboutIcon name={item.icon} />
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="about-showcase">
          <div className="about-showcase__media">
            <div className="about-showcase__screen">
              <div className="about-showcase__device about-showcase__device--primary">
                <span />
              </div>
              <div className="about-showcase__device about-showcase__device--secondary">
                <span />
              </div>
              <button type="button" className="about-showcase__play" aria-label="Play DEETECH story preview">
                <span />
              </button>
            </div>
          </div>

          <div className="about-showcase__stats">
            {companyStats.map((item) => (
              <article key={item.label} className="about-showcase__stat">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="about-team">
          <div className="about-team__intro">
            <p>Our Team</p>
            <h2>
              Meet the people behind
              <span> every order, update, and delivery.</span>
            </h2>
          </div>

          <div className="about-team__grid">
            {team.map((member) => (
              <article key={member.name} className="about-team__card">
                <div className={`about-team__portrait ${member.accent}`}>
                  <img src="/logo.png" alt="" />
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </article>
            ))}
          </div>

          <div className="about-team__ticker" aria-label="DEETECH categories">
            {categoryTicker.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
