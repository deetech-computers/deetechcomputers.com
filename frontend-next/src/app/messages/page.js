"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AccountNav from "@/components/account/account-nav";
import { API_BASE_SUPPORT } from "@/lib/config";
import { requestJson } from "@/lib/http";
import { useAuth } from "@/hooks/use-auth";

export default function MessagesPage() {
  const { token, user, isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [statusText, setStatusText] = useState("");

  useEffect(() => {
    if (!token) return;
    requestJson(`${API_BASE_SUPPORT}/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((payload) => setItems(Array.isArray(payload) ? payload : []))
      .catch((err) => setStatusText(err.message));
  }, [token]);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!message.trim() || !token) return;
    setStatusText("Sending...");
    try {
      await requestJson(API_BASE_SUPPORT, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: user?.name || "Customer",
          email: user?.email || "",
          subject: "Website Chat",
          message: message.trim(),
        }),
      });
      setMessage("");
      setStatusText("Message sent.");
      const payload = await requestJson(`${API_BASE_SUPPORT}/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(Array.isArray(payload) ? payload : []);
    } catch (err) {
      setStatusText(err.message);
    }
  };

  return (
    <main className="shell page-section">
      <section className="panel">
        <AccountNav />
        <p className="section-kicker">Support inbox</p>
        <h1>Messages without the old contact page runtime</h1>
        {!isAuthenticated ? (
          <div className="stack-actions">
            <p className="hero-copy">Login is required to view your support messages.</p>
            <Link href="/login" className="primary-link">Go to login</Link>
          </div>
        ) : (
          <>
            <form className="auth-form" onSubmit={onSubmit}>
              <textarea className="field" rows="5" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write a message to support" />
              {statusText ? <p className="hero-copy">{statusText}</p> : null}
              <button className="primary-button" type="submit">Send message</button>
            </form>
            <div className="data-list">
              {items.map((item) => (
                <article key={item._id} className="data-item">
                  <strong>{item.subject || "Support request"}</strong>
                  <p className="muted">{item.status || "new"}</p>
                  <p>{item.message || item.response || "No message content"}</p>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
