"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { requestJson } from "@/lib/http";

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

const supportHighlights = [
  {
    title: "Free Shipping",
    detail: "Free shipping for most qualifying orders across Ghana.",
    icon: "box",
  },
  {
    title: "Flexible Payment",
    detail: "Multiple secure payment options including mobile money and bank transfer.",
    icon: "wallet",
  },
  {
    title: "24x7 Support",
    detail: "Support guidance is always available, with faster replies during working hours.",
    icon: "headset",
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
  if (name === "mail") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5.5h16A1.5 1.5 0 0 1 21.5 7v10A1.5 1.5 0 0 1 20 18.5H4A1.5 1.5 0 0 1 2.5 17V7A1.5 1.5 0 0 1 4 5.5Zm0 2v.32l8 5.33 8-5.33V7.5H4Zm16 9V9.63l-7.58 5.06a.75.75 0 0 1-.84 0L4 9.63v6.87h16Z" fill="currentColor" />
      </svg>
    );
  }
  if (name === "box") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.75 20 6.9v10.2l-8 4.15-8-4.15V6.9l8-4.15Zm0 1.68L6.3 7.37 12 10.33l5.7-2.96L12 4.43Zm-6.2 4.3v7.56l5.45 2.83v-7.56L5.8 8.73Zm6.95 10.39 5.45-2.83V8.73l-5.45 2.83v7.56Z" fill="currentColor" />
      </svg>
    );
  }
  if (name === "wallet") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 5h12.5A2.5 2.5 0 0 1 20 7.5V9h-2V7.5a.5.5 0 0 0-.5-.5H5a1.5 1.5 0 1 0 0 3h13.5A2.5 2.5 0 0 1 21 12.5v4A2.5 2.5 0 0 1 18.5 19H6A4 4 0 0 1 6 11h13v6H6a.5.5 0 0 1-.5-.5v-4A.5.5 0 0 1 6 12h11v-1H5a3.5 3.5 0 0 1 0-7Zm11.5 8a1 1 0 1 0 0 2h1a1 1 0 1 0 0-2h-1Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3a8.5 8.5 0 0 1 6.74 13.68l1.78 3.06a.75.75 0 0 1-1 1.04l-3.29-1.45A8.5 8.5 0 1 1 12 3Zm-3 7.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm3 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm3 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z" fill="currentColor" />
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
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(shopLocations[0]?.id || "");

  const fullName = useMemo(
    () => `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
    [form.firstName, form.lastName]
  );
  const activeLocation =
    shopLocations.find((location) => location.id === selectedLocation) || shopLocations[0];

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
    <main className="shell page-section">
      <section className="checkout-hero contact-hero">
        <h1>Contact Us</h1>
        <p className="checkout-hero__crumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>Contact Us</span>
        </p>
      </section>

      <section className="contact-shell">
        <div className="contact-layout">
          <section className="contact-form-panel">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form__intro">
                <p className="contact-form__eyebrow">Support Form</p>
                <h2>Tell us what you need help with.</h2>
                <p>Orders, payments, delivery questions, warranty support, and product guidance all come through here.</p>
              </div>

              <div className="contact-form__grid">
                <label className="contact-form__field">
                  <span>First Name *</span>
                  <input className="field" value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} placeholder="Ex. John" />
                </label>
                <label className="contact-form__field">
                  <span>Last Name *</span>
                  <input className="field" value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} placeholder="Ex. Doe" />
                </label>
                <label className="contact-form__field">
                  <span>Email *</span>
                  <input className="field" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="example@gmail.com" />
                </label>
                <label className="contact-form__field">
                  <span>Phone *</span>
                  <input className="field" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="Enter Phone Number" />
                </label>
              </div>

              <label className="contact-form__field">
                <span>Subject *</span>
                <input className="field" value={form.subject} onChange={(event) => updateField("subject", event.target.value)} placeholder="Enter here.." />
              </label>

              <label className="contact-form__field">
                <span>Your Message *</span>
                <textarea className="field contact-form__textarea" rows="7" value={form.message} onChange={(event) => updateField("message", event.target.value)} placeholder="Enter here.." />
              </label>

              {status.text ? (
                <p className={status.type === "success" ? "contact-form__status is-success" : "contact-form__status is-error"}>
                  {status.text}
                </p>
              ) : null}

              <button type="submit" className="contact-form__submit" disabled={submitting}>
                {submitting ? "Sending..." : "Send a Message"}
              </button>
            </form>
          </section>

          <aside className="contact-visual">
            <div className="contact-visual__frame">
              <img src="/logo.png" alt="DEETECH Computers" className="contact-visual__logo" />
              <div className="contact-visual__content">
                <p className="contact-visual__eyebrow">Support That Responds</p>
                <h2>We help with orders, payments, delivery, warranty, and product questions.</h2>
                <p>Message us and our team will guide you quickly through the best next step for your issue or request.</p>
                <div className="contact-visual__meta">
                  <span>Kumasi Adum, Asempa Building</span>
                  <span>Mon - Sat, 8:00 AM - 7:00 PM</span>
                </div>
              </div>
              <div className="contact-visual__actions">
                <a href="https://wa.me/233591755964" target="_blank" rel="noreferrer" className="contact-visual__link">
                  WhatsApp Us
                </a>
                <a href="mailto:deetechcomputers01@gmail.com" className="contact-visual__link is-light">
                  Email Support
                </a>
              </div>
              <span className="contact-visual__spark contact-visual__spark--one" aria-hidden="true" />
              <span className="contact-visual__spark contact-visual__spark--two" aria-hidden="true" />
            </div>
          </aside>
        </div>

        <section className="contact-cards">
          {contactCards.map((item) => (
            <article key={item.title} className="contact-card">
              <span className="contact-card__icon">
                <ContactIcon name={item.icon} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <span>{item.subdetail}</span>
            </article>
          ))}
        </section>

        <section className="contact-map-section">
          <div className="contact-map-section__intro">
            <p className="contact-map-section__eyebrow">Visit a Branch</p>
            <h2>Find the DEETECH location that works best for you.</h2>
          </div>
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

        <section className="contact-map">
          <iframe
            title="DEETECH location map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(activeLocation.mapQuery)}&z=14&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
        </section>

        <section className="contact-highlights">
          {supportHighlights.map((item) => (
            <article key={item.title} className="contact-highlight">
              <span className="contact-highlight__icon">
                <ContactIcon name={item.icon} />
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
