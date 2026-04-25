"use client";

import Link from "next/link";

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
  const pageTitle = page?.title || "Policy";

  return (
    <main className="policy-standalone">
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

        {page.sections?.map((section) => (
          <section key={section.title} className="policy-content-section">
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
        ))}

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
