"use client";

import Link from "next/link";

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

function MobilePersonalIcon({ name }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
  };
  const paths = {
    arrowLeft: (
      <>
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </>
    ),
    camera: (
      <>
        <path d="M4 8h3l2-3h6l2 3h3v11H4V8Z" />
        <circle cx="12" cy="13" r="3" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </>
    ),
    phone: (
      <>
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 0 20" />
        <path d="M12 2a15.3 15.3 0 0 0 0 20" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    person: (
      <>
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    chevronRight: <path d="m9 18 6-6-6-6" />,
  };

  return (
    <svg className="account-mobile-personal__icon" viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {paths[name] || paths.chevronRight}
    </svg>
  );
}

export default function MobilePersonalInfo({ form, onFieldChange, onSubmit, submitting }) {
  return (
    <section className="account-mobile-personal" aria-label="Personal Information">
      <header className="account-mobile-personal__head">
        <Link href="/account">
          <MobilePersonalIcon name="arrowLeft" />
          <span>Account</span>
        </Link>
        <h1>Personal Information</h1>
        <span className="account-mobile-personal__section-icon" aria-hidden="true">
          <MobilePersonalIcon name="person" />
        </span>
      </header>

      <div className="account-mobile-personal__body">
        <section className="account-mobile-personal__identity">
          <div className="account-mobile-personal__avatar" aria-hidden="true">
            {getInitials(form)}
            <span><MobilePersonalIcon name="camera" /></span>
          </div>
          <strong>{getDisplayName(form)}</strong>
          <p>{form.email || "Email not available"}</p>
        </section>

        <form id="account-mobile-personal-form" className="account-mobile-personal__form" onSubmit={onSubmit}>
          <label>
            <span>First Name</span>
            <input value={form.firstName} onChange={(event) => onFieldChange("firstName", event.target.value)} required />
          </label>
          <label>
            <span>Last Name</span>
            <input value={form.lastName} onChange={(event) => onFieldChange("lastName", event.target.value)} required />
          </label>
          <label>
            <span>Email Address</span>
            <div className="account-mobile-personal__readonly">
              <input value={form.email} readOnly disabled />
              <MobilePersonalIcon name="lock" />
            </div>
            <small>Email cannot be changed after account verification.</small>
          </label>
          <label>
            <span>Phone Number</span>
            <div className="account-mobile-personal__phone">
              <MobilePersonalIcon name="phone" />
              <input value={form.phone} onChange={(event) => onFieldChange("phone", event.target.value)} required />
            </div>
          </label>
        </form>

        <section className="account-mobile-personal__preferences">
          <h2>Preferences</h2>
          <Link href="/account?tab=personal">
            <MobilePersonalIcon name="globe" />
            <span>Display Language</span>
            <strong>English</strong>
            <MobilePersonalIcon name="chevronRight" />
          </Link>
          <Link href="/account?tab=notifications">
            <MobilePersonalIcon name="bell" />
            <span>Notification Settings</span>
            <MobilePersonalIcon name="chevronRight" />
          </Link>
        </section>
      </div>

      <div className="account-mobile-personal__submit">
        <button type="submit" form="account-mobile-personal-form" disabled={submitting}>
          {submitting ? "Updating..." : "Update Changes"}
        </button>
      </div>
    </section>
  );
}
