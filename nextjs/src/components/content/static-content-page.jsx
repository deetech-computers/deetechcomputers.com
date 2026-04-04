import Link from "next/link";

function ContentBlock({ block }) {
  return (
    <article className="content-block">
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
      {block.note ? <p className="content-note">{block.note}</p> : null}
    </article>
  );
}

function CtaLinks({ cta }) {
  if (cta.links?.length) {
    return (
      <div className="hero-actions">
        {cta.links.map((link) =>
          link.external ? (
            <a
              key={link.href}
              href={link.href}
              className={link.secondary ? "ghost-link" : "primary-link"}
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
            </a>
          ) : (
            <Link key={link.href} href={link.href} className={link.secondary ? "ghost-link" : "primary-link"}>
              {link.label}
            </Link>
          )
        )}
      </div>
    );
  }

  if (cta.href && cta.label) {
    return (
      <Link href={cta.href} className="primary-link">
        {cta.label}
      </Link>
    );
  }

  return null;
}

export default function StaticContentPage({ page }) {
  return (
    <main className="shell page-section content-page">
      <section className="panel content-hero">
        <p className="section-kicker">{page.kicker}</p>
        <h1>{page.title}</h1>
        <p className="hero-copy">{page.intro}</p>
        {page.meta ? <p className="content-meta">{page.meta}</p> : null}
        {page.highlights?.length ? (
          <div className="content-highlight-grid">
            {page.highlights.map((highlight) => (
              <article key={highlight.title} className="content-highlight">
                <span>{highlight.title}</span>
                <h2>{highlight.title}</h2>
                <p>{highlight.description}</p>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      {page.sections?.map((section) => (
        <section key={section.title} className="panel content-section">
          <h2>{section.title}</h2>
          {section.blocks?.length ? (
            <div className="content-grid">
              {section.blocks.map((block) => (
                <ContentBlock key={block.title || block.paragraphs?.[0]} block={block} />
              ))}
            </div>
          ) : null}
          {section.points?.length ? (
            <div className="content-points">
              {section.points.map((point) => (
                <div key={point}>{point}</div>
              ))}
            </div>
          ) : null}
          {section.note ? <p className="content-note">{section.note}</p> : null}
        </section>
      ))}

      {page.cta ? (
        <section className="panel content-cta">
          <h2>{page.cta.title}</h2>
          <p>{page.cta.description}</p>
          {page.cta.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="content-meta">
              {paragraph}
            </p>
          ))}
          <CtaLinks cta={page.cta} />
        </section>
      ) : null}
    </main>
  );
}
