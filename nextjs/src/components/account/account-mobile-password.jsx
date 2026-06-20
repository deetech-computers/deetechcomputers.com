"use client";

import Link from "next/link";
import { useState } from "react";

function MobilePasswordIcon({ name }) {
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
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    unlock: (
      <>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 7.5-2" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    refresh: (
      <>
        <path d="M21 12a9 9 0 0 1-15.5 6.3" />
        <path d="M3 12A9 9 0 0 1 18.5 5.7" />
        <path d="M18 2v4h-4" />
        <path d="M6 22v-4h4" />
      </>
    ),
    device: (
      <>
        <rect x="3" y="4" width="12" height="14" rx="2" />
        <path d="M8 22h8" />
        <path d="M20 8v10a2 2 0 0 1-2 2h-6" />
      </>
    ),
  };

  return (
    <svg className="account-mobile-password__icon" viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {paths[name] || paths.shield}
    </svg>
  );
}

function PasswordField({ label, value, field, onChange, placeholder }) {
  const [visible, setVisible] = useState(false);
  return (
    <label>
      <span>{label}</span>
      <div className="account-mobile-password__field">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(field, event.target.value)}
          placeholder={placeholder}
          required
        />
        <button type="button" onClick={() => setVisible((current) => !current)} aria-label={visible ? "Hide password" : "Show password"}>
          <MobilePasswordIcon name="eye" />
        </button>
      </div>
    </label>
  );
}

export default function MobilePasswordManager({
  currentPassword,
  newPassword,
  confirmPassword,
  onChange,
  onSubmit,
  submitting,
}) {
  return (
    <section className="account-mobile-password" aria-label="Password Manager">
      <header className="account-mobile-password__head">
        <Link href="/account" aria-label="Back to account">
          <MobilePasswordIcon name="arrowLeft" />
        </Link>
        <h1>Password Manager</h1>
        <MobilePasswordIcon name="shield" />
      </header>

      <div className="account-mobile-password__body">
        <section className="account-mobile-password__intro">
          <div className="account-mobile-password__seal">
            <MobilePasswordIcon name="unlock" />
            <span><MobilePasswordIcon name="lock" /></span>
          </div>
          <h2>Change Password</h2>
          <p>Enter your current password to verify your identity, then choose a strong new one.</p>
        </section>

        <form id="account-mobile-password-form" className="account-mobile-password__form" onSubmit={onSubmit}>
          <PasswordField
            label="Current Password"
            value={currentPassword}
            field="currentPassword"
            onChange={onChange}
            placeholder="Enter current password"
          />
          <PasswordField
            label="New Password"
            value={newPassword}
            field="newPassword"
            onChange={onChange}
            placeholder="Create a strong password"
          />
          <div className="account-mobile-password__strength" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <small>Min. 8 characters, 1 number, 1 special char.</small>
          <PasswordField
            label="Confirm New Password"
            value={confirmPassword}
            field="confirmPassword"
            onChange={onChange}
            placeholder="Repeat new password"
          />
          <button type="submit" disabled={submitting}>
            <span>{submitting ? "Updating..." : "Update Password"}</span>
            {!submitting ? <MobilePasswordIcon name="refresh" /> : null}
          </button>
          <Link href="/forgot-password">Forgot Password?</Link>
        </form>

        <section className="account-mobile-password__practices">
          <h2>Security Best Practices</h2>
          <article>
            <MobilePasswordIcon name="shield" />
            <div>
              <strong>Use a unique password</strong>
              <p>Don't reuse passwords across different accounts or platforms.</p>
            </div>
          </article>
          <article>
            <MobilePasswordIcon name="device" />
            <div>
              <strong>Monitor active sessions</strong>
              <p>Regularly check your login history to ensure no unauthorized access.</p>
            </div>
          </article>
        </section>
      </div>
    </section>
  );
}
