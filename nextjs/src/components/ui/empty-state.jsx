import Link from "next/link";

function EmptyIcon({ type = "cart" }) {
  if (type === "wishlist") {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M60 102 18 62c-11-10-11-29 0-40 10-10 27-10 38 0l4 4 4-4c11-10 28-10 38 0 11 11 11 30 0 40L60 102Z" fill="#9ea3b7" />
        <path d="M60 102V26l4-4c11-10 28-10 38 0 11 11 11 30 0 40L60 102Z" fill="#8f95aa" />
      </svg>
    );
  }

  if (type === "orders") {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <rect x="24" y="18" width="72" height="84" rx="14" fill="#a5abbe" />
        <rect x="34" y="34" width="52" height="7" rx="3.5" fill="#f2f4f8" />
        <rect x="34" y="50" width="52" height="7" rx="3.5" fill="#f2f4f8" />
        <rect x="34" y="66" width="36" height="7" rx="3.5" fill="#f2f4f8" />
        <circle cx="88" cy="84" r="14" fill="#0b1b59" />
        <path d="M88 77v14M81 84h14" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "reviews") {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M60 16l11 23 25 4-18 18 4 26-22-12-22 12 4-26-18-18 25-4 11-23Z" fill="#a5abbe" />
        <circle cx="60" cy="60" r="8" fill="#f3f5f8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <rect x="23" y="36" width="74" height="60" rx="12" fill="#a5abbe" />
      <rect x="16" y="28" width="74" height="60" rx="12" fill="#b7bccb" />
      <path d="M37 43V31c0-13 8-21 23-21s23 8 23 21v12" fill="none" stroke="#0b1b59" strokeWidth="8" strokeLinecap="round" />
      <circle cx="39" cy="43" r="6" fill="#f2f4f8" />
      <circle cx="81" cy="43" r="6" fill="#f2f4f8" />
      <circle cx="39" cy="43" r="3" fill="#0b1b59" />
      <circle cx="81" cy="43" r="3" fill="#0b1b59" />
    </svg>
  );
}

export default function EmptyState({
  icon = "cart",
  title,
  description,
  actionHref,
  actionLabel,
  actionVariant = "primary-link",
}) {
  return (
    <section className="panel empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        <EmptyIcon type={icon} />
      </div>
      {title ? <h2>{title}</h2> : null}
      {description ? <p className="hero-copy">{description}</p> : null}
      {actionHref && actionLabel ? (
        <Link href={actionHref} className={actionVariant}>
          {actionLabel}
        </Link>
      ) : null}
    </section>
  );
}

