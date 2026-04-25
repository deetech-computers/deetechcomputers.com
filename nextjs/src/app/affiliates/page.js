"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/providers/toast-provider";
import { useAuth } from "@/hooks/use-auth";
import { API_BASE, SITE_URL } from "@/lib/config";
import { formatCurrency } from "@/lib/format";
import { requestJson } from "@/lib/http";
import { requestWithToken } from "@/lib/resource";

function formatDate(value) {
  if (!value) return "Pending";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "Pending";
  }
}

function formatDateTime(value) {
  if (!value) return "Pending";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "Pending";
  }
}

function formatMonth(value) {
  if (!value) return "This month";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "This month";
  }
}

function shortOrderId(referral) {
  const id = referral?.order?._id || referral?.order || referral?._id || "";
  return id ? `#${String(id).slice(-8).toUpperCase()}` : "Pending";
}

function normalizeStats(stats = {}) {
  return {
    totalReferrals: Number(stats.totalReferrals || 0),
    pendingReferrals: Number(stats.pendingReferrals || 0),
    deliveredReferrals: Number(stats.deliveredReferrals || 0),
    cancelledReferrals: Number(stats.cancelledReferrals || 0),
    pendingCommission: Number(stats.pendingCommission || 0),
    earnedCommission: Number(stats.earnedCommission || 0),
  };
}

function referralStatusLabel(status) {
  if (status === "earned") return "Earned";
  if (status === "cancelled") return "Cancelled";
  return "Pending";
}

function AffiliateIcon({ type }) {
  const paths = {
    referrals: "M7 13a4 4 0 1 1 8 0M4 21a7 7 0 0 1 14 0M17 11h5M19.5 8.5v5",
    pending: "M12 6v6l4 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    paid: "M4 7h16M6 7v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M9 11h6M10 15h4",
    lifetime: "M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-8",
    cancelled: "M7 7l10 10M17 7 7 17M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    success: "M5 13l4 4L19 7M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    tier: "M4 17 10 5l4 8 6-3-6 9-4-8-6-1Z",
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d={paths[type] || paths.referrals} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const AFFILIATE_STEPS = [
  {
    icon: "🎁",
    title: "Get Your Code",
    text: "Register as an affiliate and receive your unique 6-character referral code.",
  },
  {
    icon: "📣",
    title: "Share Your Code",
    text: "Share with friends, family, or on social media and WhatsApp.",
  },
  {
    icon: "💸",
    title: "Earn & Level Up",
    text: "Earn 5% commission and unlock tier rewards as you grow.",
  },
];

const AFFILIATE_TIERS = [
  {
    tier: "Bronze Tier",
    deals: "8 Deals",
    points: [
      "Priority Support Access",
      "Exclusive Marketing Materials",
      "5% Commission Rate",
    ],
  },
  {
    tier: "Silver Tier",
    deals: "18 Deals",
    points: [
      "All Bronze Benefits",
      "Faster Payout Processing",
      "Advanced Analytics Dashboard",
      "5% Commission Rate",
    ],
  },
  {
    tier: "Gold Tier",
    deals: "35 Deals",
    points: [
      "All Silver Benefits",
      "Monthly Gift Rewards",
      "Premium 1-on-1 Support",
      "Early Access to New Products",
      "5% Commission Rate",
    ],
  },
];

const AFFILIATE_FAQ = [
  {
    q: "Does my commission rate decrease when I tier up?",
    a: "No. Your commission rate stays at 5% unless admin increases it during promos or special events. Tiers add bonuses and rewards on top of your earnings.",
  },
  {
    q: "What are the Gold Tier monthly gifts?",
    a: "Gold Tier affiliates receive special monthly gift rewards. These can include tech accessories, exclusive merchandise, or bonus cash rewards.",
  },
  {
    q: "How do I level up through tiers?",
    a: "You level up automatically based on delivered deals: 8 deals for Bronze, 18 for Silver, and 35 for Gold.",
  },
  {
    q: "How are commissions paid?",
    a: "Commissions are paid instantly via mobile money to your registered Ghana number after qualifying delivery confirmation.",
  },
  {
    q: "Is there any cost to join?",
    a: "No. Joining is free. There are no registration fees.",
  },
  {
    q: "Can I track my referrals and tier progress?",
    a: "Yes. After registration, your affiliate dashboard shows referrals, earnings, and live tier progress.",
  },
];

export default function AffiliatesPage() {
  const { isAuthenticated, status, token } = useAuth();
  const { pushToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [settings, setSettings] = useState(null);

  const affiliate = dashboard?.affiliate || null;
  const stats = normalizeStats(dashboard?.stats);
  const referrals = Array.isArray(dashboard?.referrals) ? dashboard.referrals : [];
  const code = affiliate?.code || "";
  const thresholds = dashboard?.settings?.tierThresholds || settings?.tierThresholds || {};
  const commissionRate = Number(affiliate?.commissionRate || dashboard?.settings?.defaultCommissionRate || settings?.defaultCommissionRate || 5);
  const tier = affiliate?.tier || "starter";
  const lifetimeGenerated = referrals.reduce((sum, referral) => sum + Number(referral?.orderAmount || 0), 0);
  const successRate = stats.totalReferrals ? Math.round((stats.deliveredReferrals / stats.totalReferrals) * 100) : 0;
  const nextBronzeCount = Math.max(0, Number(thresholds.bronze || 5) - stats.deliveredReferrals);
  const lastReferral = referrals[0] || null;
  const referralLink = code ? `${SITE_URL}/checkout?affiliate=${encodeURIComponent(code)}` : SITE_URL;
  const nextTierGoal = useMemo(() => {
    const delivered = stats.deliveredReferrals;
    if (delivered < Number(thresholds.bronze || 5)) return { label: "Bronze", target: Number(thresholds.bronze || 5) };
    if (delivered < Number(thresholds.silver || 15)) return { label: "Silver", target: Number(thresholds.silver || 15) };
    if (delivered < Number(thresholds.gold || 30)) return { label: "Gold", target: Number(thresholds.gold || 30) };
    return { label: "Gold", target: delivered || 1 };
  }, [thresholds.bronze, thresholds.silver, thresholds.gold, stats.deliveredReferrals]);
  const goldTarget = Math.max(1, Number(thresholds.gold || 30));
  const tierTrackProgress = Math.min(100, Math.round((stats.deliveredReferrals / goldTarget) * 100));
  const monthlyEarned = useMemo(() => {
    const earned = referrals.filter((referral) => referral?.status === "earned");
    const rows = new Map();
    for (const referral of earned) {
      const date = referral.paidAt || referral.updatedAt || referral.createdAt;
      const label = formatMonth(date);
      rows.set(label, Number(rows.get(label) || 0) + Number(referral.commissionAmount || 0));
    }
    return Array.from(rows.entries()).map(([label, amount]) => ({ label, amount }));
  }, [referrals]);
  const statusAnalytics = [
    { label: "Pending", value: stats.pendingReferrals, max: Math.max(1, stats.totalReferrals), tone: "pending" },
    { label: "Earned", value: stats.deliveredReferrals, max: Math.max(1, stats.totalReferrals), tone: "earned" },
    { label: "Cancelled", value: stats.cancelledReferrals, max: Math.max(1, stats.totalReferrals), tone: "cancelled" },
  ];

  async function loadAffiliate() {
    setLoading(true);
    try {
      const publicSettings = await requestJson(`${API_BASE}/affiliates/settings`);
      setSettings(publicSettings);

      if (token) {
        const profile = await requestWithToken(`${API_BASE}/affiliates/me`, token);
        setDashboard(profile);
      } else {
        setDashboard(null);
      }
    } catch (error) {
      pushToast(error.message || "Could not load affiliate details", "warning");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status === "loading") return;
    loadAffiliate();
  }, [status, token]);

  async function handleRegister() {
    if (!token) {
      pushToast("Login first to join the affiliate program", "info");
      return;
    }
    setJoining(true);
    try {
      await requestWithToken(`${API_BASE}/affiliates/register`, token, { method: "POST" });
      pushToast("Affiliate profile created successfully", "success");
      await loadAffiliate();
    } catch (error) {
      pushToast(error.message || "Could not create affiliate profile", "warning");
    } finally {
      setJoining(false);
    }
  }

  async function copyText(value, label) {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      pushToast(`${label} copied`, "success");
    } catch {
      pushToast(`Could not copy ${label.toLowerCase()}`, "warning");
    }
  }

  return (
    <main className="shell page-section">
      <section className="cart-hero affiliate-hero">
        <p className="affiliate-hero__eyebrow">DEETECH Partner Program</p>
        <h1>Affiliates</h1>
        <p className="cart-hero__crumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Affiliates</span>
        </p>
        <p className="affiliate-hero__copy">
          Share your code, help customers buy the right tech, and earn commission when referred orders are confirmed and delivered.
        </p>
      </section>

      <section className="panel affiliate-layout">
        <div className="affiliate-main">
          {loading ? (
            <div className="affiliate-loading">Loading affiliate dashboard...</div>
          ) : !isAuthenticated ? (
            <>
              <section className="affiliate-join-card">
                <div>
                  <span className="affiliate-badge">Login required</span>
                  <h2>Join and track your referrals from one place.</h2>
                  <p>
                    Sign in to create your DEETECH affiliate code, copy your referral link, and watch pending commissions turn into earned commissions after delivery.
                  </p>
                </div>
                <Link href="/login" className="affiliate-primary">Login to continue</Link>
              </section>

              <section className="panel affiliate-learn">
                <header className="affiliate-learn__header">
                  <h2>How It Works</h2>
                  <p>Three simple steps to start earning.</p>
                </header>

                <div className="affiliate-learn__steps">
                  {AFFILIATE_STEPS.map((step, index) => (
                    <article key={step.title} className="affiliate-learn__step">
                      <span className="affiliate-learn__step-index" aria-hidden="true">{index + 1}</span>
                      <span className="affiliate-learn__step-icon" aria-hidden="true">{step.icon}</span>
                      <strong>{step.title}</strong>
                      <p>{step.text}</p>
                    </article>
                  ))}
                </div>

                <div className="affiliate-learn__commission">
                  <h3>Simple 5% Commission + Tier Rewards System</h3>
                  <p>Your commission starts at 5% and can increase up to 10% during admin promotions.</p>
                  <div className="affiliate-learn__commission-grid">
                    <div className="affiliate-learn__rate">5%<span>Lifetime Base Rate</span></div>
                    <ul>
                      <li>5% for everyone. No tier reductions.</li>
                      <li>Instant payouts for all tiers.</li>
                      <li>Unlock premium rewards as you grow.</li>
                    </ul>
                  </div>
                  <p className="affiliate-learn__note">
                    <strong>Important:</strong> If a buyer does not enter your affiliate code at checkout, commission cannot be tracked on-site and will not appear in detailed stats.
                  </p>
                </div>

                <div className="affiliate-learn__tiers">
                  <h3>Tier Rewards & Benefits</h3>
                  <div className="affiliate-learn__tier-grid">
                    {AFFILIATE_TIERS.map((item, index) => {
                      const medal = index === 0 ? "🥉" : index === 1 ? "🥈" : "🏆";
                      const tone = index === 0 ? "bronze" : index === 1 ? "silver" : "gold";
                      return (
                      <article key={item.tier} className={`affiliate-learn__tier-card is-${tone}`}>
                        <h4><span aria-hidden="true">{medal}</span>{item.tier}</h4>
                        <p className="affiliate-learn__tier-deals">{item.deals}</p>
                        <ul>
                          {item.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      </article>
                    )})}
                  </div>
                </div>

                <div className="affiliate-learn__examples">
                  <h3>Sample Earnings (5% Commission)</h3>
                  <div className="affiliate-learn__example-grid">
                    <article><span>Basic Laptop</span><strong>GHC 2,500 -&gt; GHC 125</strong></article>
                    <article><span>Gaming PC</span><strong>GHC 4,000 -&gt; GHC 200</strong></article>
                    <article><span>Premium Setup</span><strong>GHC 6,000 -&gt; GHC 300</strong></article>
                  </div>
                  <p>Plus tier bonuses on top of these commissions.</p>
                </div>

                <div className="affiliate-learn__bottom-grid">
                <div className="affiliate-learn__why">
                  <h3>Why Join?</h3>
                  <ul>
                    <li>5% guaranteed base commission (can increase up to 10%).</li>
                    <li>Instant tracking and mobile money payouts.</li>
                    <li>Quality tech products that customers trust.</li>
                    <li>No caps on earnings.</li>
                  </ul>
                </div>

                <div className="affiliate-learn__journey">
                  <h3>Your Journey to Gold Tier</h3>
                  <p>Start with 5%, grow your earnings, and unlock premium rewards.</p>
                  <div className="affiliate-learn__journey-grid">
                    <article><strong>🎯 Starter Tier</strong><span>5% Commission - You start here</span></article>
                    <article><strong>🥉 Bronze Tier</strong><span>8 Deals - Priority support - Marketing materials</span></article>
                    <article><strong>🥈 Silver Tier</strong><span>18 Deals - Faster payouts - Advanced dashboard</span></article>
                    <article><strong>🏆 Gold Tier</strong><span>35 Deals - Monthly gifts - Premium support - Early access</span></article>
                  </div>
                </div>
                </div>

                <div className="affiliate-learn__faq">
                  <h3>Quick FAQ</h3>
                  {AFFILIATE_FAQ.map((item) => (
                    <details key={item.q} className="affiliate-learn__faq-item">
                      <summary>{item.q}</summary>
                      <p>{item.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            </>
          ) : !dashboard?.isAffiliate ? (
            <section className="affiliate-join-card">
              <div>
                <span className="affiliate-badge">Open for partners</span>
                <h2>Start earning with DEETECH referrals.</h2>
                <p>
                  New partners start at {Number(settings?.defaultCommissionRate || 5)}% commission. Referrals are recorded when a customer uses your code at checkout, then move to earned when the order is delivered.
                </p>
              </div>
              <button type="button" className="affiliate-primary" onClick={handleRegister} disabled={joining}>
                {joining ? "Creating..." : "Create affiliate code"}
              </button>
            </section>
          ) : (
            <>
              <section className="affiliate-command">
                <div className="affiliate-command__intro">
                  <span className="affiliate-badge">{tier} tier</span>
                  <h2>Your affiliate hub is active.</h2>
                  <p>
                    Use your code during checkout or share the link. Pending referrals update after entry, and earned commissions update when delivery is confirmed.
                  </p>
                </div>

                <div className="affiliate-code-card">
                  <span>Your Code</span>
                  <strong>{code}</strong>
                  <div className="affiliate-code-card__actions">
                    <button type="button" onClick={() => copyText(code, "Affiliate code")}>Copy code</button>
                    <button type="button" onClick={() => copyText(referralLink, "Referral link")}>Copy link</button>
                  </div>
                </div>
              </section>

              <section className="affiliate-tier-card">
                <div className="affiliate-tier-card__head">
                  <div>
                    <h2><span className="affiliate-tier-card__icon"><AffiliateIcon type="tier" /></span>{tier.charAt(0).toUpperCase() + tier.slice(1)} Tier</h2>
                    <p>{tier === "starter" ? `Need ${nextBronzeCount} delivered deals for Bronze tier.` : `${nextTierGoal.label} target: ${nextTierGoal.target} delivered deals.`}</p>
                  </div>
                  <span className="affiliate-tier-pill">{tier}</span>
                </div>
                <strong className="affiliate-tier-card__amount">{formatCurrency(stats.earnedCommission)}</strong>
                <div className="affiliate-tier-track" aria-hidden="true">
                  <span style={{ width: `${tierTrackProgress}%` }} />
                </div>
                <div className="affiliate-tier-milestones">
                  <span className="is-active">Starter</span>
                  <span>Bronze ({Number(thresholds.bronze || 5)})</span>
                  <span>Silver ({Number(thresholds.silver || 15)})</span>
                  <span>Gold ({Number(thresholds.gold || 30)})</span>
                </div>
              </section>

              <section className="affiliate-stats">
                <article className="is-green">
                  <span><i className="affiliate-stat-icon"><AffiliateIcon type="referrals" /></i>Total Referrals</span>
                  <strong>{stats.totalReferrals}</strong>
                  <small>{stats.deliveredReferrals} successful - {stats.pendingReferrals} pending</small>
                </article>
                <article className="is-gold">
                  <span><i className="affiliate-stat-icon"><AffiliateIcon type="pending" /></i>Pending Commission</span>
                  <strong>{formatCurrency(stats.pendingCommission)}</strong>
                  <small>Awaiting delivery completion</small>
                </article>
                <article className="is-emerald">
                  <span><i className="affiliate-stat-icon"><AffiliateIcon type="paid" /></i>Total Paid Out</span>
                  <strong>{formatCurrency(stats.earnedCommission)}</strong>
                  <small>Approved commissions</small>
                </article>
                <article className="is-blue">
                  <span><i className="affiliate-stat-icon"><AffiliateIcon type="lifetime" /></i>Lifetime Generated</span>
                  <strong>{formatCurrency(lifetimeGenerated)}</strong>
                  <small>Pending + paid-out orders</small>
                </article>
                <article className="is-amber">
                  <span><i className="affiliate-stat-icon"><AffiliateIcon type="cancelled" /></i>Cancelled Referrals</span>
                  <strong>{stats.cancelledReferrals}</strong>
                  <small>Orders not completed</small>
                </article>
                <article className="is-green">
                  <span><i className="affiliate-stat-icon"><AffiliateIcon type="success" /></i>Success Rate</span>
                  <strong>{successRate}%</strong>
                  <small>Referral conversion</small>
                </article>
              </section>

              <section className="affiliate-insights-grid">
                <article className="panel affiliate-breakdown">
                  <h2>Referral Breakdown</h2>
                  <dl>
                    <div><dt>Total Referrals</dt><dd>{stats.totalReferrals}</dd></div>
                    <div><dt>Successful Referrals</dt><dd>{stats.deliveredReferrals}</dd></div>
                    <div><dt>Pending Approval</dt><dd>{stats.pendingReferrals}</dd></div>
                    <div><dt>Cancelled Referrals</dt><dd>{stats.cancelledReferrals}</dd></div>
                    <div><dt>Last Referral</dt><dd>{formatDateTime(lastReferral?.createdAt)}</dd></div>
                  </dl>
                </article>

                <article className="panel affiliate-benefits">
                  <h2>Your Tier Benefits</h2>
                  <div className="affiliate-benefit-card">
                    <span className="affiliate-benefit-card__icon"><AffiliateIcon type="tier" /></span>
                    <div>
                      <strong>{tier.charAt(0).toUpperCase() + tier.slice(1)} Tier</strong>
                      <p>You're earning {commissionRate}% commission on every qualified sale.</p>
                      <small>Active benefits: {commissionRate}% commission rate, live tracking, and delivery-based earning confirmation.</small>
                    </div>
                  </div>
                  <p className="affiliate-benefits__note">
                    Need {Math.max(0, nextTierGoal.target - stats.deliveredReferrals)} delivered deals for {nextTierGoal.label} tier.
                  </p>
                </article>
              </section>

              <section className="affiliate-analytics-grid">
                <article className="affiliate-analytics">
                  <h2>Referral Status Analytics</h2>
                  {statusAnalytics.map((item) => (
                    <div key={item.label} className={`affiliate-analytics__row is-${item.tone}`}>
                      <span>{item.label}</span>
                      <div><i style={{ width: `${Math.round((item.value / item.max) * 100)}%` }} /></div>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </article>

                <article className="affiliate-analytics">
                  <h2>Monthly Earned Commission</h2>
                  {monthlyEarned.length ? monthlyEarned.map((item) => (
                    <div key={item.label} className="affiliate-analytics__row is-earned">
                      <span>{item.label}</span>
                      <div><i style={{ width: "100%" }} /></div>
                      <strong>{formatCurrency(item.amount)}</strong>
                    </div>
                  )) : (
                    <p className="affiliate-muted">No earned commission yet. Delivered referrals will appear here by month.</p>
                  )}
                </article>
              </section>

              <section className="affiliate-referrals panel affiliate-earning-history">
                <div className="affiliate-referrals__head">
                  <div>
                    <h2>Earning History</h2>
                    <p>
                      Track each referred order, the customer, order amount, commission, status, and date in one clean view.
                    </p>
                  </div>
                  <Link href="/products" className="ghost-link">Share products</Link>
                </div>

                {referrals.length ? (
                  <div className="affiliate-earning-history__scroll" role="region" aria-label="Affiliate earning history" tabIndex={0}>
                    <table className="affiliate-earning-table">
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Customer</th>
                          <th>Order Amount</th>
                          <th>Commission</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {referrals.map((referral) => (
                          <tr key={referral._id}>
                            <td>{shortOrderId(referral)}</td>
                            <td>
                              <strong>{referral.customerName || "Customer"}</strong>
                              <span>{referral.affiliateCode || code}</span>
                            </td>
                            <td>{formatCurrency(referral.orderAmount)}</td>
                            <td>{formatCurrency(referral.commissionAmount)}</td>
                            <td>
                              <span className={`affiliate-status is-${referral.status || "pending"}`}>
                                {referralStatusLabel(referral.status)}
                              </span>
                            </td>
                            <td>{formatDateTime(referral.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="affiliate-empty">
                    <h3>No referrals yet</h3>
                    <p>Share your code or referral link. New orders will appear here as pending first, then earned after delivery.</p>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
