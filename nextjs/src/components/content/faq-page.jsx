"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const items = [
  ["What types of products do you offer?", "We offer laptops, desktops, monitors, accessories, networking gear, printers, gaming devices, and selected mobile devices based on current stock and verified quality."],
  ["How do I place an order?", "You can place an order directly on our website by selecting your preferred product, adding it to cart, and completing checkout. You can also contact us on WhatsApp if you want direct assistance before placing the order."],
  ["How do I know my order was successful?", "After placing your order, you will receive a confirmation message or email. Our team may also contact you to verify the order before delivery or collection."],
  ["Do you offer any discounts or promotions?", "Yes. We run seasonal promotions, bundle offers, affiliate campaigns, and selected product discounts. Active offers are usually visible on the products page and during checkout."],
  ["How can I provide feedback about my experience?", "You can send feedback through our contact page, WhatsApp, email, or messages area. We take customer reviews and service feedback seriously because they help us improve delivery and support."],
  ["What payment methods do you accept?", "We accept MTN Mobile Money, Telecel Cash, Hubtel payments, bank transfers, and in-person payment at our Kumasi office for verified customers."],
  ["Is payment required before delivery?", "Most orders require payment confirmation before dispatch. In approved cases, in-person payment or specially verified arrangements may be allowed depending on the product and delivery plan."],
  ["Is my payment information secure?", "Yes. Payments are handled through trusted channels such as Hubtel and official mobile money or bank transfer processes. DEETECH COMPUTERS does not store your financial card or wallet details."],
  ["Do you offer nationwide delivery?", "Yes. We deliver to all regions of Ghana through trusted logistics partners. Delivery usually takes about 8 to 24 hours depending on location and product readiness."],
  ["How much does delivery cost?", "Delivery is free for most orders. In rare cases such as remote destinations or special product types, a small delivery fee may apply and will be communicated before payment is completed."],
  ["Do you offer customer support?", "Yes. DEETECH support is available for product questions, order help, payment issues, warranty guidance, and after-sales assistance through phone, email, and WhatsApp."],
  ["How do I track my order?", "Once your order is confirmed, you can open the Track Order page from your account to follow the progress from order placed to delivery."],
  ["Can I track my delivery?", "Yes. Once your order has been shipped, you will receive a tracking update or a call from our delivery team with the expected delivery timeline."],
  ["Can I order without creating an account?", "Yes. Guest checkout is available, but creating an account gives you easier order history, wishlist access, and tracking for each purchase."],
  ["Why should I create a DEETECH account?", "A DEETECH account helps you manage orders, track delivery, save favorite products, and enjoy a faster checkout experience on future purchases."],
  ["I forgot my password. What should I do?", "Use the Forgot Password option on the login page and follow the secure reset instructions sent to your email address."],
  ["Do you provide warranty on products?", "Yes. Laptops and electronics come with warranty periods depending on the product type and brand. Warranty coverage applies to eligible manufacturing defects under the stated terms."],
  ["Can I return or exchange a product?", "Yes. You can return or exchange an item within the approved return window if it is defective, not as described, and still in acceptable condition."],
  ["What items are not eligible for return?", "Products damaged through customer misuse, software issues caused by user actions, and accessories without manufacturing faults are not eligible for return."],
  ["How does the DEETECH Affiliate Program work?", "Affiliates earn commission on qualified sales completed through their referral links or codes. You can visit the Affiliates page to learn more and get started."],
  ["When and how do affiliates get paid?", "Affiliate commissions are processed through mobile money or bank transfer once qualifying sales are confirmed and cleared."],
  ["How do I contact customer support?", "You can contact us by email at deetechcomputers01@gmail.com, on WhatsApp at +233 591755964, or by phone at +233 509673406."],
  ["What are your working hours?", "Our support and delivery team are available Monday to Saturday from 8:00 AM to 7:00 PM. Sunday responses may be delayed."],
  ["Where is DEETECH COMPUTERS located?", "Our main office is in Kumasi, and we serve customers across Ashanti Region and the rest of Ghana through nationwide delivery."],
].map(([question, answer]) => ({ question, answer }));

function SupportIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M44 18c8.3 0 15 6.3 15 14 0 4.3-2.1 8.3-5.6 10.9V50l-7.5-4.2c-.6.1-1.3.2-1.9.2-8.3 0-15-6.3-15-14s6.7-14 15-14Z" fill="#c89a33" />
      <path d="M28 12C16.4 12 7 20.5 7 31c0 5.9 2.8 11.3 7.5 14.9V55l10.3-5.8c1 .2 2.1.3 3.2.3 11.6 0 21-8.5 21-19S39.6 12 28 12Z" fill="#fff" stroke="#184f27" strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx="22" cy="31" r="2.6" fill="#184f27" />
      <circle cx="29" cy="31" r="2.6" fill="#184f27" />
      <circle cx="36" cy="31" r="2.6" fill="#184f27" />
    </svg>
  );
}

export default function FaqPage() {
  const [openQuestion, setOpenQuestion] = useState(items[1]?.question || items[0]?.question || "");

  const visibleItems = useMemo(() => items, []);

  return (
    <main className="shell page-section content-page">
      <section className="faq-showcase">
        <div className="faq-showcase__intro">
          <p className="section-kicker">FAQs</p>
          <h1>
            Question? <span>Look here.</span>
          </h1>
        </div>

        <div className="faq-showcase__layout">
          <section className="faq-showcase__list">
            {visibleItems.map((item) => {
              const isOpen = openQuestion === item.question;
              return (
                <article key={item.question} className={isOpen ? "faq-card is-open" : "faq-card"}>
                  <button
                    type="button"
                    className="faq-card__question"
                    onClick={() => setOpenQuestion((current) => (current === item.question ? "" : item.question))}
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>
                    <span className="faq-card__toggle" aria-hidden="true">
                      {isOpen ? "-" : "+"}
                    </span>
                  </button>
                  {isOpen ? (
                    <div className="faq-card__answer">
                      <p>{item.answer}</p>
                      {item.question === "How do I track my order?" ? (
                        <Link href="/orders" className="faq-track-link">
                          Open Track Order
                        </Link>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </section>

          <aside className="faq-support-card">
            <div className="faq-support-card__icon">
              <SupportIcon />
            </div>
            <h2>You have different questions?</h2>
            <p>Our team will answer all your questions. We ensure a quick response.</p>
            <Link href="/contact" className="faq-support-card__button">
              Contact Us
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
