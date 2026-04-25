"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { requestJson } from "@/lib/http";
import { requestWithToken } from "@/lib/resource";
import { useAuth } from "@/hooks/use-auth";
import { API_BASE } from "@/lib/config";

const contactCards = [
  {
    title: "Address",
    detail: "Kumasi Adum, Asempa Building",
    subdetail: "Kumasi Bantama",
    icon: "location",
  },
  {
    title: "Phone",
    detail: "+233 509673406",
    subdetail: "+233 591755964",
    icon: "phone",
  },
  {
    title: "Email",
    detail: "deetechcomputers01@gmail.com",
    subdetail: "Replies during working hours",
    icon: "mail",
  },
];

const shopLocations = [
  {
    id: "bantama-shop-nhis",
    label: "Bantama Shop (NHIS)",
    mapQuery: "Kumasi Bantama NHIS, Ghana",
  },
  {
    id: "adum-shop",
    label: "Adum Shop",
    mapQuery: "Kumasi Adum Asempa Building, Ghana",
  },
];

function ContactIcon({ name }) {
  if (name === "location") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.5c4 0 7.25 3.18 7.25 7.1 0 4.94-5.66 10.83-6.31 11.48a1.33 1.33 0 0 1-1.88 0C10.41 20.43 4.75 14.54 4.75 9.6 4.75 5.68 8 2.5 12 2.5Zm0 4.2a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Z" fill="currentColor" />
      </svg>
    );
  }
  if (name === "phone") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.62 3.52c.4-.4 1-.54 1.53-.36l2.24.75c.57.19.95.7.95 1.3l.02 2.16a1.5 1.5 0 0 1-.44 1.06l-1.13 1.12a16.27 16.27 0 0 0 4.67 4.66l1.12-1.12c.28-.28.66-.44 1.06-.44h2.16c.6 0 1.11.38 1.3.95l.75 2.24c.18.53.04 1.13-.36 1.53l-1.5 1.5a2.66 2.66 0 0 1-2.55.68c-3.58-.93-6.85-3.14-9.47-5.76-2.62-2.62-4.83-5.89-5.76-9.47a2.66 2.66 0 0 1 .68-2.55l1.5-1.5Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5.5h16A1.5 1.5 0 0 1 21.5 7v10A1.5 1.5 0 0 1 20 18.5H4A1.5 1.5 0 0 1 2.5 17V7A1.5 1.5 0 0 1 4 5.5Zm0 2v.32l8 5.33 8-5.33V7.5H4Zm16 9V9.63l-7.58 5.06a.75.75 0 0 1-.84 0L4 9.63v6.87h16Z" fill="currentColor" />
    </svg>
  );
}

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const { isAuthenticated, status: authStatus, token } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(shopLocations[0]?.id || "");
  const [loadingMyTickets, setLoadingMyTickets] = useState(false);
  const [myTickets, setMyTickets] = useState([]);

  const fullName = useMemo(
    () => `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
    [form.firstName, form.lastName]
  );
  const activeLocation =
    shopLocations.find((location) => location.id === selectedLocation) || shopLocations[0];
  const latestTicket = myTickets[0] || null;
  const hasExistingSupportThread = isAuthenticated && myTickets.length > 0;

  useEffect(() => {
    if (authStatus !== "ready" || !isAuthenticated || !token) {
      setMyTickets([]);
      setLoadingMyTickets(false);
      return;
    }
    setLoadingMyTickets(true);
    requestWithToken(`${API_BASE}/support/my`, token)
      .then((payload) => {
        setMyTickets(Array.isArray(payload) ? payload : []);
      })
      .catch(() => {
        setMyTickets([]);
      })
      .finally(() => setLoadingMyTickets(false));
  }, [authStatus, isAuthenticated, token]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim() || !form.subject.trim() || !form.message.trim()) {
      setStatus({ type: "error", text: "Please complete every required field before sending your message." });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "", text: "" });

    try {
      await requestJson("/api/support", {
        method: "POST",
        body: JSON.stringify({
          name: fullName,
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: `${form.message.trim()}\n\nPhone: ${form.phone.trim()}`,
        }),
      });

      setStatus({ type: "success", text: "Your message has been sent. Our team will get back to you as soon as possible." });
      setForm(initialForm);
    } catch (error) {
      setStatus({ type: "error", text: error?.message || "We could not send your message right now. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="policy-standalone">
      <header className="policy-standalone__hero" role="banner">
        <div className="shell policy-standalone__hero-inner">
          <h1>Contact Support Team</h1>
          <p className="policy-standalone__crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>Contact Support Team</span>
          </p>
        </div>
      </header>

      <article className="shell page-section policy-content policy-content--standalone contact-page-simple">
        <section className="contact-page-simple__map">
          <div className="contact-map-selector" role="tablist" aria-label="Select shop location">
            {shopLocations.map((location) => (
              <button
                key={location.id}
                type="button"
                className={location.id === activeLocation.id ? "contact-map-selector__button is-active" : "contact-map-selector__button"}
                onClick={() => setSelectedLocation(location.id)}
                aria-pressed={location.id === activeLocation.id}
              >
                {location.label}
              </button>
            ))}
          </div>
          <section className="contact-map contact-map--simple">
            <iframe
              title="DEETECH location map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(activeLocation.mapQuery)}&z=14&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </section>
        </section>

        <section className="contact-page-simple__layout">
          <div className="contact-page-simple__left">
            <h2>Contact Us</h2>
            <p>
              If you need any help, please contact us or send us a message. We are sure that you can receive our reply
              as soon as possible.
            </p>
            <div className="contact-info-simple">
              {contactCards.map((item) => (
                <article key={item.title} className="contact-info-simple__item">
                  <span className="contact-info-simple__icon">
                    <ContactIcon name={item.icon} />
                  </span>
                  <div className="contact-info-simple__copy">
                    <strong>{item.detail}</strong>
                    <span>{item.subdetail}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="contact-page-simple__right">
            <h2>Get in touch with us</h2>
            <p>If you have any question, please don&apos;t hesitate to send us a message.</p>

            {loadingMyTickets ? (
              <div className="panel contact-support-preview">
                <p>Loading your latest support request...</p>
              </div>
            ) : hasExistingSupportThread ? (
              <div className="panel contact-support-preview">
                <p className="policy-kicker">Support Conversation Active</p>
                <h3>Continue from your account messages</h3>
                <p>
                  You already opened a support request. To keep replies in one place, continue the conversation from
                  your account.
                </p>
                {latestTicket ? (
                  <div className="contact-support-preview__latest">
                    <strong>{latestTicket.subject || "Support request"}</strong>
                    <p>
                      Status: <span>{latestTicket.status || "new"}</span>
                    </p>
                    <p>
                      Latest update:{" "}
                      {new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(latestTicket.updatedAt || latestTicket.createdAt || Date.now()))}
                    </p>
                  </div>
                ) : null}
                <div className="account-dashboard__actions">
                  <Link href="/account?tab=messages" className="contact-support-preview__cta">
                    Continue Chat in Account
                  </Link>
                </div>
              </div>
            ) : (
              <form className="contact-form contact-form--simple" onSubmit={handleSubmit}>
                <label className="contact-form__field">
                  <input
                    className="field"
                    value={fullName}
                    onChange={(event) => {
                      const raw = event.target.value;
                      const parts = raw.trimStart().split(/\s+/);
                      updateField("firstName", parts.shift() || "");
                      updateField("lastName", parts.join(" "));
                    }}
                    placeholder="Your Name*"
                  />
                </label>
                <label className="contact-form__field">
                  <input
                    className="field"
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="Your Email*"
                  />
                </label>
                <label className="contact-form__field">
                  <input className="field" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="Phone Number*" />
                </label>
                <label className="contact-form__field">
                  <input className="field" value={form.subject} onChange={(event) => updateField("subject", event.target.value)} placeholder="Subject*" />
                </label>
                <label className="contact-form__field">
                  <textarea
                    className="field contact-form__textarea"
                    rows="7"
                    value={form.message}
                    onChange={(event) => updateField("message", event.target.value)}
                    placeholder="Explain your request details here"
                  />
                </label>

                {status.text ? (
                  <p className={status.type === "success" ? "contact-form__status is-success" : "contact-form__status is-error"}>
                    {status.text}
                  </p>
                ) : null}

                <button type="submit" className="contact-form__submit contact-form__submit--simple" disabled={submitting}>
                  {submitting ? "Sending..." : "Submit your Request"}
                </button>
              </form>
            )}
          </div>
        </section>
      </article>
    </main>
  );
}
