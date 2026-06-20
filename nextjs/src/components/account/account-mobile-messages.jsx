"use client";

import Link from "next/link";
import { useRef } from "react";
import StableImage from "@/components/ui/stable-image";
import { API_BASE } from "@/lib/config";

const SUPPORT_WHATSAPP_LINK = "https://wa.me/message/WEYXKNNA6KXXL1";

function formatMessageTime(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "Recently";
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function resolveSupportImageUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw) || raw.startsWith("data:")) return raw;
  if (raw.startsWith("/")) return `${API_BASE}${raw}`;
  return `${API_BASE}/${raw.replace(/^\/+/, "")}`;
}

function getTicketStatus(ticket) {
  const status = String(ticket?.status || "open").trim();
  return status || "open";
}

function MobileMessagesIcon({ name }) {
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
    attach: (
      <>
        <path d="m21.4 11.6-8.5 8.5a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 1 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5" />
      </>
    ),
    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4 20-7Z" />
        <path d="M22 2 11 13" />
      </>
    ),
    external: (
      <>
        <path d="M15 3h6v6" />
        <path d="M10 14 21 3" />
        <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
      </>
    ),
    message: (
      <>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 7 9-7" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    checks: (
      <>
        <path d="m3 12 3 3 6-6" />
        <path d="m11 12 3 3 7-8" />
      </>
    ),
  };

  return (
    <svg className="account-mobile-messages__icon" viewBox="0 0 24 24" aria-hidden="true" {...common}>
      {paths[name] || paths.message}
    </svg>
  );
}

export default function MobileMessages({
  tickets,
  replyDraft,
  sendingReply,
  onReplyDraftChange,
  onSendReply,
}) {
  const formRef = useRef(null);
  const activeTicket = tickets[0] || null;
  const thread = Array.isArray(activeTicket?.messages) ? activeTicket.messages : [];
  const status = getTicketStatus(activeTicket);

  return (
    <section className="account-mobile-messages" aria-label="Messages">
      <header className="account-mobile-messages__head">
        <Link href="/account">
          <MobileMessagesIcon name="arrowLeft" />
          <span>Account</span>
        </Link>
        <h1>Messages</h1>
        <span className="account-mobile-messages__section-icon" aria-hidden="true">
          <MobileMessagesIcon name="mail" />
        </span>
      </header>

      {!activeTicket ? (
        <section className="account-mobile-messages__empty">
          <div className="account-mobile-messages__empty-mark" aria-hidden="true">
            <MobileMessagesIcon name="mail" />
            <span>0</span>
            <i><MobileMessagesIcon name="search" /></i>
          </div>
          <h2>Your inbox is clear</h2>
          <p>Reach out to support or start a new inquiry to see your messages here.</p>
        </section>
      ) : (
        <>
          <section className="account-mobile-messages__ticket">
            <div>
              <strong>{activeTicket.subject || "Support request"}</strong>
              <span>Ticket ID: #{activeTicket.ticketNumber || activeTicket._id || "request"}</span>
            </div>
            <em>{status}</em>
          </section>

          <div className="account-mobile-messages__thread">
            {thread.map((entry, index) => {
              const sender = String(entry?.sender || "user").toLowerCase() === "admin" ? "admin" : "user";
              const imageUrl = resolveSupportImageUrl(entry?.imageUrl);
              const text = String(entry?.text || "").trim();
              return (
                <article key={`${entry?.createdAt || "msg"}-${index}`} className={`account-mobile-messages__message is-${sender}`}>
                  <div className="account-mobile-messages__meta">
                    <span>{sender === "admin" ? "DEETECH Support" : "You"}</span>
                    <span>{formatMessageTime(entry?.createdAt)}</span>
                  </div>
                  {text ? <p>{text}</p> : null}
                  {imageUrl ? (
                    <a href={imageUrl} target="_blank" rel="noreferrer" className="account-mobile-messages__attachment">
                      <StableImage src={imageUrl} alt="Support attachment" width={220} height={140} />
                    </a>
                  ) : null}
                  {sender === "user" ? (
                    <div className="account-mobile-messages__read">
                      <MobileMessagesIcon name="checks" />
                      <span>Read</span>
                    </div>
                  ) : null}
                </article>
              );
            })}

            <a
              href={SUPPORT_WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="account-mobile-messages__whatsapp"
            >
              <span><MobileMessagesIcon name="message" /></span>
              <div>
                <strong>Prefer WhatsApp?</strong>
                <p>Chat with our agents instantly</p>
              </div>
              <MobileMessagesIcon name="external" />
            </a>
          </div>

          <form ref={formRef} className="account-mobile-messages__composer" onSubmit={onSendReply}>
            <div className="account-mobile-messages__input-wrap">
              <textarea
                value={replyDraft}
                onChange={(event) => onReplyDraftChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    formRef.current?.requestSubmit();
                  }
                }}
                placeholder="Type a message..."
                rows={1}
              />
              <button type="button" aria-label="Attach file" disabled>
                <MobileMessagesIcon name="attach" />
              </button>
            </div>
            <button type="submit" aria-label="Send message" disabled={sendingReply || !replyDraft.trim()}>
              <MobileMessagesIcon name="send" />
            </button>
          </form>
        </>
      )}
    </section>
  );
}
