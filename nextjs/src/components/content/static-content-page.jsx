"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import "./static-content-page-desktop.css";
import "./static-content-page-mobile.css";

function PolicyContentBlock({ block }) {
  return (
    <article className="policy-content-block">
      {block.title ? <h3>{block.title}</h3> : null}
      {block.paragraphs?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {block.items?.length ? (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {block.extraTitle ? <h4>{block.extraTitle}</h4> : null}
      {block.extraItems?.length ? (
        <ul>
          {block.extraItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {block.note ? <p className="policy-content-note">{block.note}</p> : null}
    </article>
  );
}

export default function StaticContentPage({ page }) {
  const router = useRouter();
  const pageTitle = page?.title || "Policy";

  return (
    <main className="policy-standalone">
      <header className="policy-standalone__mobile-bar">
        <button type="button" className="policy-standalone__mobile-back" onClick={() => router.back()} aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="policy-standalone__mobile-title">Policy Details</span>
        <Link href="/contact" className="policy-standalone__mobile-icon" aria-label="Contact support">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2.5c4 0 7.25 3.18 7.25 7.1 0 4.94-5.66 10.83-6.31 11.48a1.33 1.33 0 0 1-1.88 0C10.41 20.43 4.75 14.54 4.75 9.6 4.75 5.68 8 2.5 12 2.5Zm0 4.2a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Z" fill="currentColor" />
          </svg>
        </Link>
      </header>

      <header className="policy-standalone__hero" role="banner">
        <div className="shell policy-standalone__hero-inner">
          <h1>{pageTitle}</h1>
          <p className="policy-standalone__crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>{pageTitle}</span>
          </p>
        </div>
      </header>

      <article className="shell page-section policy-content policy-content--standalone">
        <p className="policy-kicker">{page.kicker}</p>
        <p className="policy-intro">{page.intro}</p>
        {page.meta ? <p className="policy-meta">{page.meta}</p> : null}

        {page.highlights?.length ? (
          <div className="policy-highlight-grid">
            {page.highlights.map((item) => (
              <article key={item.title} className="policy-highlight">
                {item.label ? <span>{item.label}</span> : null}
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        ) : null}

        {page.quickFacts?.length ? (
          <div className="policy-fact-strip">
            {page.quickFacts.map((fact) => (
              <div key={fact.label} className="policy-fact-strip__item">
                <strong>{fact.value}</strong>
                <span>{fact.label}</span>
              </div>
            ))}
          </div>
        ) : null}

        {page.sections?.map((section) => {
          const isCallout = section.title === "Important Information";
          return (
            <section
              key={section.title}
              className={isCallout ? "policy-content-section policy-content-section--callout" : "policy-content-section"}
            >
              <h2>{section.title}</h2>
              {section.blocks?.map((block) => (
                <PolicyContentBlock key={block.title || block.paragraphs?.[0]} block={block} />
              ))}
              {section.points?.length ? (
                <ul className="policy-point-list">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
              {section.note ? <p className="policy-content-note">{section.note}</p> : null}
            </section>
          );
        })}

        {page.cta ? (
          <section className="policy-content-section policy-content-section--cta">
            <h2>{page.cta.title}</h2>
            <p>{page.cta.description}</p>
            {page.cta.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="policy-cta-actions">
              {page.cta.links?.map((link) =>
                link.external ? (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                )
              )}
              {page.cta.href && page.cta.label ? <Link href={page.cta.href}>{page.cta.label}</Link> : null}
            </div>
          </section>
        ) : null}
      </article>
    </main>
  );
}
