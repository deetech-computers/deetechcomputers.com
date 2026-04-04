"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const categories = [
  { value: "all", label: "All Questions" },
  { value: "ordering", label: "Ordering" },
  { value: "payment", label: "Payment" },
  { value: "delivery", label: "Delivery" },
  { value: "warranty", label: "Warranty and Returns" },
  { value: "account", label: "Account" },
  { value: "affiliates", label: "Affiliates" },
  { value: "support", label: "Support" },
];

const items = [
  ["ordering", "How do I place an order?", 'You can place an order directly on our website by selecting your desired product, clicking "Add to Cart," and completing checkout. You can also contact us on WhatsApp for direct assistance.'],
  ["ordering", "Can I order without creating an account?", "Yes. You can check out as a guest, but creating an account helps with order tracking, history, and faster checkout."],
  ["ordering", "How do I know my order was successful?", "After placing your order, you will receive a confirmation message or email. Our team may also contact you to verify before delivery."],
  ["payment", "What payment methods do you accept?", "We accept mobile money (MTN and Telecel), Hubtel payments, and bank transfers. In-person payment at our Kumasi office is also available for verified customers."],
  ["payment", "Is payment required before delivery?", "Yes. Full payment is required before delivery for online orders. For bulk or verified repeat customers, partial payment options may be available."],
  ["payment", "Is my payment information secure?", "Yes. Payments are processed through trusted channels such as Hubtel and official mobile money APIs. DEETECH COMPUTERS does not store your financial details."],
  ["delivery", "Do you offer nationwide delivery?", "Yes. We deliver to all regions of Ghana through trusted logistics partners. Delivery time is typically 8 to 24 hours depending on location."],
  ["delivery", "How much does delivery cost?", "Delivery is free for most orders. In rare cases such as remote areas or special product types, a small delivery fee may apply and will be communicated before payment."],
  ["delivery", "Can I track my delivery?", "Yes. Once shipped, you receive a tracking update or a call from our delivery agent with estimated delivery time."],
  ["warranty", "Do you provide warranty on products?", "Yes. Laptops and electronics come with warranty periods depending on brand and product type. Warranty covers manufacturing defects."],
  ["warranty", "Can I return or exchange a product?", "Yes. You can return or exchange a product within the allowed return window if it is defective or not as described, and still in acceptable condition."],
  ["warranty", "What items are not eligible for return?", "Items damaged by customer misuse, software issues caused by user actions, and accessories without manufacturing faults are not eligible for return."],
  ["account", "Why should I create a DEETECH account?", "An account helps you manage orders, track delivery, save favorite products, and use faster checkout on future purchases."],
  ["account", "I forgot my password. What should I do?", "Use the Forgot Password page or the reset option on the login page, then follow the secure reset instructions sent to your email."],
  ["affiliates", "How does the DEETECH Affiliate Program work?", "Affiliates earn commission for qualified sales through their referral links. Visit the Affiliates page to start."],
  ["affiliates", "When and how do affiliates get paid?", "Affiliate commissions are processed through mobile money or bank transfer once sales are confirmed and cleared."],
  ["support", "How do I contact customer support?", "Contact support via email at deetechcomputers01@gmail.com, WhatsApp at +233 591755964, or phone at +233 509673406."],
  ["support", "What are your working hours?", "Our support and delivery team are available Monday to Saturday, 8:00 AM to 7:00 PM. Sunday responses may be delayed."],
  ["support", "Where is DEETECH COMPUTERS located?", "Our main office is in Kumasi, serving Ashanti Region and customers across Ghana through nationwide delivery."],
].map(([category, question, answer]) => ({ category, question, answer }));

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openQuestions, setOpenQuestions] = useState({});

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((item) => {
      const categoryMatch = activeCategory === "all" || item.category === activeCategory;
      const text = `${item.question} ${item.answer}`.toLowerCase();
      const searchMatch = !normalizedQuery || text.includes(normalizedQuery);
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, query]);

  return (
    <main className="shell page-section content-page">
      <section className="panel content-hero">
        <p className="section-kicker">FAQ</p>
        <h1>FAQ and Help Center</h1>
        <p className="hero-copy">Find detailed answers to questions about orders, payments, delivery, warranty, and support.</p>
        <input
          className="field faq-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for answers..."
          aria-label="Search FAQ answers"
        />
      </section>

      <section className="faq-actions-grid">
        <Link href="/orders" className="panel faq-action-card">
          <h2>Track Your Order Status</h2>
          <p>Check your order status and delivery updates.</p>
        </Link>
        <a href="https://wa.me/233591755964" target="_blank" rel="noreferrer" className="panel faq-action-card">
          <h2>Live Support Chat</h2>
          <p>Get instant help from our support team.</p>
        </a>
        <div className="panel faq-action-card">
          <h2>Policy Guides</h2>
          <p>Read our warranty and return policies.</p>
          <div className="stack-actions">
            <Link href="/warranty" className="ghost-link">Warranty Terms</Link>
            <Link href="/return-refund" className="ghost-link">Return and Refund</Link>
          </div>
        </div>
      </section>

      <section className="faq-categories">
        {categories.map((category) => (
          <button
            key={category.value}
            type="button"
            className={activeCategory === category.value ? "ghost-button faq-chip active" : "ghost-button faq-chip"}
            onClick={() => setActiveCategory(category.value)}
          >
            {category.label}
          </button>
        ))}
      </section>

      <section className="faq-results-meta">
        <span>{visibleItems.length} {visibleItems.length === 1 ? "question" : "questions"} found</span>
      </section>

      <section className="faq-list">
        {visibleItems.map((item) => {
          const isOpen = Boolean(openQuestions[item.question]);
          return (
            <article key={item.question} className={isOpen ? "panel faq-item open" : "panel faq-item"}>
              <button
                type="button"
                className="faq-question"
                onClick={() =>
                  setOpenQuestions((current) => ({ ...current, [item.question]: !current[item.question] }))
                }
              >
                <span>{item.question}</span>
                <span>{isOpen ? "-" : "+"}</span>
              </button>
              {isOpen ? (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                  {item.question === "I forgot my password. What should I do?" ? (
                    <Link href="/forgot-password" className="primary-link">
                      Open Forgot Password
                    </Link>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </section>

      <section className="panel content-cta">
        <h2>Still Need Help?</h2>
        <p>Our support team is available for payment, delivery, order, and technical assistance.</p>
        <div className="hero-actions">
          <a href="mailto:deetechcomputers01@gmail.com" className="primary-link">Email Support</a>
          <a href="https://wa.me/233591755964" target="_blank" rel="noreferrer" className="ghost-link">WhatsApp Chat</a>
          <a href="tel:+233591755964" className="ghost-link">Phone Call</a>
        </div>
      </section>
    </main>
  );
}
