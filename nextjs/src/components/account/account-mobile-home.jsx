"use client";

import Link from "next/link";

const MOBILE_ACCOUNT_ITEMS = [
  { id: "personal", label: "Personal Information", href: "/account?tab=personal", icon: "person" },
  { id: "orders", label: "My Orders", href: "/account?tab=orders", icon: "bag" },
  { id: "address", label: "Manage Address", href: "/account?tab=address", icon: "pin" },
  { id: "messages", label: "Messages / Requests", href: "/account?tab=messages", icon: "mail", supportOnly: true },
  { id: "notifications", label: "Notifications", href: "/account?tab=notifications", icon: "bell" },
  { id: "affiliates", label: "Affiliates", href: "/account?tab=affiliates", icon: "users" },
  { id: "wishlist", label: "Wishlist", href: "/account?tab=wishlist", icon: "heart" },
  { id: "reviews", label: "Reviews", href: "/account?tab=reviews", icon: "review" },
  { id: "password", label: "Password Manager", href: "/account?tab=password", icon: "lock" },
  { id: "admin", label: "Admin", href: "/admin", icon: "shield", adminOnly: true },
];

function getDisplayName(profile) {
  const first = String(profile?.firstName || "").trim();
  const last = String(profile?.lastName || "").trim();
  return `${first} ${last}`.trim() || profile?.name || profile?.email?.split("@")?.[0] || "DEETECH Customer";
}

function getInitials(profile) {
  const name = getDisplayName(profile);
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
  return initials.toUpperCase() || "DC";
}


function MobileAccountIcon({ name }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
  };
  const paths = {
    chevronRight: <path d="m9 18 6-6-6-6" />,
    person: (
      <>
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    bag: (
      <>
        <path d="M6 8h12l-1 13H7L6 8Z" />
        <path d="M9 8a3 3 0 0 1 6 0" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s7-5.1 7-11a7 7 0 0 0-14 0c0 5.9 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 7 9-7" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />,
    review: (
      <>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
        <path d="M8 8h8" />
        <path d="M8 12h5" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
      </>
    ),
  };

  return (
    <svg className="account-mobile-home__icon" viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {paths[name] || paths.person}
    </svg>
  );
}

export default function MobileAccountHome({
  profile,
  isAdmin,
  hasSupportTickets,
  unreadNotifications,
  supportTicketsCount,
  onLogout,
}) {
  const displayName = getDisplayName(profile);
  const menuItems = MOBILE_ACCOUNT_ITEMS.filter((item) => {
    if (item.supportOnly && !hasSupportTickets) return false;
    return !item.adminOnly || isAdmin;
  });

  return (
    <section className="account-mobile-home" aria-label="Mobile account menu">
      <div className="account-mobile-home__body">
        <nav className="account-mobile-home__breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>My Account</span>
        </nav>
        <h1>My Account</h1>

        <article className="account-mobile-home__profile">
          <div className="account-mobile-home__avatar" aria-hidden="true">
            {profile?.avatarUrl ? <img src={profile.avatarUrl} alt="" /> : getInitials(profile)}
          </div>
          <div className="account-mobile-home__identity">
            <strong>{displayName}</strong>
            <span>{profile?.email || "Customer account"}</span>
          </div>
        </article>

        <div className="account-mobile-home__menu">
          {menuItems.map((item) => {
            const badge = item.id === "messages" && supportTicketsCount > 0
              ? `${supportTicketsCount} new`
              : item.id === "notifications" && unreadNotifications > 0
                ? unreadNotifications
                : "";
            return (
              <Link key={item.id} href={item.href} className="account-mobile-home__item">
                <MobileAccountIcon name={item.icon} />
                <span>{item.label}</span>
                {badge ? <em>{badge}</em> : null}
                <MobileAccountIcon name="chevronRight" />
              </Link>
            );
          })}
          <button type="button" className="account-mobile-home__item account-mobile-home__item--logout" onClick={onLogout}>
            <MobileAccountIcon name="logout" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </section>
  );
}
