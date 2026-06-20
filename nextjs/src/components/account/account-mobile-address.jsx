"use client";

import Link from "next/link";
import { GHANA_REGIONS } from "@/lib/checkout";

function getDisplayName(form) {
  const first = String(form?.firstName || "").trim();
  const last = String(form?.lastName || "").trim();
  return `${first} ${last}`.trim() || form?.name || "DEETECH Customer";
}

function MobileAddressIcon({ name }) {
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
    pin: (
      <>
        <path d="M12 21s7-5.1 7-11a7 7 0 0 0-14 0c0 5.9 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </>
    ),
    plusShield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="M12 8v6" />
        <path d="M9 11h6" />
      </>
    ),
    chevronDown: (
      <>
        <path d="m6 9 6 6 6-6" />
        <path d="m9 9 3 3 3-3" />
      </>
    ),
  };

  return (
    <svg className="account-mobile-address__icon" viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {paths[name] || paths.pin}
    </svg>
  );
}

export default function MobileAddress({ form, onFieldChange, onSubmit, submitting }) {
  const displayName = getDisplayName(form);
  const street = String(form?.address || "").trim() || "No street address added";
  const cityRegion = [form?.city, form?.region].filter(Boolean).join(", ");
  const addressLine = cityRegion ? `${cityRegion}, Ghana` : "Add city and region";

  return (
    <section className="account-mobile-address" aria-label="Manage Address">
      <header className="account-mobile-address__head">
        <Link href="/account" aria-label="Back to account">
          <MobileAddressIcon name="arrowLeft" />
        </Link>
        <div>
          <span>Account</span>
          <h1>Manage Address</h1>
        </div>
      </header>

      <form id="account-mobile-address-form" className="account-mobile-address__body" onSubmit={onSubmit}>
        <section className="account-mobile-address__section">
          <h2>Default Address</h2>
          <article className="account-mobile-address__preview">
            <span className="account-mobile-address__pin" aria-hidden="true">
              <MobileAddressIcon name="pin" />
            </span>
            <div className="account-mobile-address__preview-copy">
              <strong>{displayName}</strong>
              <p>{street}</p>
              <p>{addressLine}</p>
              <b>{form?.phone || "Add phone number"}</b>
            </div>
          </article>
        </section>

        <section className="account-mobile-address__section">
          <h2>Add New Details</h2>
          <div className="account-mobile-address__grid">
            <label>
              <span>First Name</span>
              <input value={form.firstName} onChange={(event) => onFieldChange("firstName", event.target.value)} placeholder="e.g. Kwame" required />
            </label>
            <label>
              <span>Last Name</span>
              <input value={form.lastName} onChange={(event) => onFieldChange("lastName", event.target.value)} placeholder="e.g. Mensah" required />
            </label>
            <label className="is-full">
              <span>Street Address</span>
              <input value={form.address} onChange={(event) => onFieldChange("address", event.target.value)} placeholder="House number and street name" required />
            </label>
            <label>
              <span>City</span>
              <input value={form.city} onChange={(event) => onFieldChange("city", event.target.value)} placeholder="e.g. Accra" required />
            </label>
            <label>
              <span>Region</span>
              <div className="account-mobile-address__select">
                <select value={form.region} onChange={(event) => onFieldChange("region", event.target.value)} required>
                  <option value="">Select</option>
                  {GHANA_REGIONS.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                <MobileAddressIcon name="chevronDown" />
              </div>
            </label>
            <label className="is-full">
              <span>Phone Number</span>
              <div className="account-mobile-address__phone">
                <em>+233</em>
                <input value={form.phone} onChange={(event) => onFieldChange("phone", event.target.value)} placeholder="24 000 0000" required />
              </div>
            </label>
            <label className="is-full">
              <span>Email Address</span>
              <div className="account-mobile-address__readonly">
                <input value={form.email} readOnly disabled />
                <MobileAddressIcon name="lock" />
              </div>
              <small>Email is linked to your account security and cannot be changed here.</small>
            </label>
          </div>
        </section>
      </form>

      <div className="account-mobile-address__submit">
        <button type="submit" form="account-mobile-address-form" disabled={submitting}>
          <MobileAddressIcon name="plusShield" />
          <span>{submitting ? "Saving..." : "Add Address"}</span>
        </button>
      </div>
    </section>
  );
}
