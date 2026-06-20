"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/format";

function getSuccessRate(summary) {
  const total = Number(summary?.referrals || 0);
  const delivered = Number(summary?.deliveredReferrals || 0);
  return total ? Math.round((delivered / total) * 100) : 0;
}

function getLifetimeGenerated(summary) {
  return Number(summary?.pendingCommission || 0) + Number(summary?.earned || 0);
}

function MobileAffiliateIcon({ name }) {
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
    info: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </>
    ),
    copy: (
      <>
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <rect x="2" y="2" width="13" height="13" rx="2" />
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
    receipt: (
      <>
        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
      </>
    ),
    money: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M6 9v.01" />
        <path d="M18 15v.01" />
      </>
    ),
    box: (
      <>
        <path d="M21 8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </>
    ),
    xCircle: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </>
    ),
    badge: (
      <>
        <path d="M12 3 14.4 8l5.5.8-4 3.9.9 5.5L12 15.6 7.1 18.2l.9-5.5-4-3.9 5.5-.8L12 3Z" />
      </>
    ),
    wallet: (
      <>
        <path d="M20 7H5a3 3 0 0 0 0 6h15v6H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h13v3" />
        <path d="M16 13h4" />
      </>
    ),
    bank: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 10h14" />
        <path d="M6 10v8" />
        <path d="M10 10v8" />
        <path d="M14 10v8" />
        <path d="M18 10v8" />
        <path d="M4 18h16" />
      </>
    ),
    external: (
      <>
        <path d="M15 3h6v6" />
        <path d="M10 14 21 3" />
        <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
      </>
    ),
  };

  return (
    <svg className="account-mobile-affiliates__icon" viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {paths[name] || paths.info}
    </svg>
  );
}

export default function MobileAffiliates({ summary }) {
  const commissionRate = Number(summary?.commissionRate || 0);
  const tier = summary?.tier || "starter";
  const referralCode = summary?.code || "Not created";
  const statCards = [
    { label: "Referrals", value: Number(summary?.referrals || 0), icon: "users" },
    { label: "Pending", value: formatCurrency(Number(summary?.pendingCommission || 0)), icon: "receipt", tone: "gold" },
    { label: "Paid", value: formatCurrency(Number(summary?.earned || 0)), icon: "money" },
    { label: "Lifetime", value: formatCurrency(getLifetimeGenerated(summary)), icon: "box" },
    { label: "Cancelled", value: Number(summary?.cancelledReferrals || 0), icon: "xCircle", tone: "danger" },
    { label: "Success Rate", value: `${getSuccessRate(summary)}%`, icon: "badge" },
  ];

  const handleCopy = async () => {
    if (!summary?.code || typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(summary.code);
    } catch {
      // Copy is helpful, but the account remains usable if browser permission fails.
    }
  };

  return (
    <section className="account-mobile-affiliates" aria-label="Affiliates">
      <header className="account-mobile-affiliates__head">
        <Link href="/account" aria-label="Back to account">
          <MobileAffiliateIcon name="arrowLeft" />
        </Link>
        <div>
          <span>Account</span>
          <h1>Affiliates</h1>
        </div>
        <Link href="/affiliates" aria-label="Affiliate information">
          <MobileAffiliateIcon name="info" />
        </Link>
      </header>

      <div className="account-mobile-affiliates__body">
        <section className="account-mobile-affiliates__hero">
          <div className="account-mobile-affiliates__hero-top">
            <span>{summary?.isAffiliate ? "Active member" : "Not active yet"}</span>
            <div>
              <small>Commission</small>
              <strong>{commissionRate ? `${commissionRate}%` : "N/A"}</strong>
            </div>
          </div>
          <p>Referral Code</p>
          <div className="account-mobile-affiliates__code">
            <strong>{referralCode}</strong>
            <button type="button" onClick={handleCopy} disabled={!summary?.code}>
              <MobileAffiliateIcon name="copy" />
              <span>Copy</span>
            </button>
          </div>
          <div className="account-mobile-affiliates__tier">
            <span>Current Tier</span>
            <strong>{tier}</strong>
          </div>
        </section>

        <section className="account-mobile-affiliates__section">
          <h2>Performance Stats</h2>
          <div className="account-mobile-affiliates__stats">
            {statCards.map((card) => (
              <article key={card.label} className={card.tone ? `is-${card.tone}` : ""}>
                <MobileAffiliateIcon name={card.icon} />
                <span>{card.label}</span>
                <strong>{card.value}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="account-mobile-affiliates__payout">
          <div className="account-mobile-affiliates__payout-head">
            <h2>Payout Summary</h2>
            <MobileAffiliateIcon name="wallet" />
          </div>
          <div className="account-mobile-affiliates__balance">
            <div>
              <span>Available Balance</span>
              <strong>{formatCurrency(Number(summary?.pendingCommission || 0))}</strong>
            </div>
            <div>
              <span>Next Payout</span>
              <strong>Pending</strong>
            </div>
          </div>
          <h3>Settlement Bank</h3>
          <div className="account-mobile-affiliates__bank">
            <span><MobileAffiliateIcon name="bank" /></span>
            <div>
              <strong>Managed on Affiliate Page</strong>
              <p>Review payout settings</p>
            </div>
            <Link href="/affiliates">Edit</Link>
          </div>
          <p>Payout details and deeper referral history are managed on the full affiliate page.</p>
        </section>

        <section className="account-mobile-affiliates__invite">
          <MobileAffiliateIcon name="badge" />
          <div>
            <strong>Invite and Earn More</strong>
            <p>Share your referral code to grow commissions from qualified DEETECH purchases.</p>
          </div>
        </section>
      </div>

      <div className="account-mobile-affiliates__submit">
        <Link href="/affiliates">
          <MobileAffiliateIcon name="external" />
          <span>Open Affiliate Page</span>
        </Link>
      </div>
    </section>
  );
}
