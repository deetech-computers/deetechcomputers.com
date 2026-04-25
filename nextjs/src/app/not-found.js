"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <section className="not-found-shell shell" aria-labelledby="not-found-title">
        <div className="not-found-ornament not-found-ornament--left" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="not-found-ornament not-found-ornament--right" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="not-found-code" aria-hidden="true">
          <span className="not-found-code__digit">4</span>
          <span className="not-found-code__digit">0</span>
          <span className="not-found-code__digit">4</span>
        </div>

        <div className="not-found-copy">
          <h1 id="not-found-title">
            Oops! <span>Page not Found</span>
          </h1>
          <p>
            The page you are looking for cannot be found. Head back home and continue exploring laptops,
            gadgets, accessories, and more from DEETECH COMPUTERS.
          </p>
          <Link href="/" className="primary-link not-found-copy__cta">
            Go To Home Page
          </Link>
        </div>
      </section>
    </main>
  );
}
