"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_BASE_ORDERS } from "@/lib/config";
import { requestJson } from "@/lib/http";
import { writeLastOrder } from "@/lib/order-confirmation";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";

export default function CheckoutPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "cash",
  });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!items.length) {
      setMessage("Your cart is empty.");
      return;
    }
    setSubmitting(true);
    setMessage("");
    const payload = {
      orderItems: items.map((item) => ({
        product: item.productId || item._id,
        name: item.name,
        qty: Number(item.qty || 1),
        price: Number(item.price || 0),
        image: item.image || "",
      })),
      shippingAddress: {
        address: form.address,
        city: form.city,
        phone: form.phone,
      },
      paymentMethod: form.paymentMethod,
      itemsPrice: subtotal,
      totalPrice: subtotal,
      customerName: form.name,
      email: form.email,
      phone: form.phone,
    };

    try {
      const endpoint = token ? API_BASE_ORDERS : `${API_BASE_ORDERS}/guest`;
      const response = await requestJson(endpoint, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: JSON.stringify(payload),
      });
      writeLastOrder({
        reference: response?._id || response?.reference || response?.orderNumber || "N/A",
        items: payload.orderItems.map((item) => ({
          name: item.name,
          quantity: item.qty,
          price: item.price,
        })),
        subtotal,
        total: subtotal,
        shipping: 0,
        paymentMethod: form.paymentMethod,
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        date: new Date().toISOString(),
      });
      clearCart();
      router.push("/thankyou");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="shell page-section narrow-shell">
      <section className="panel">
        <p className="section-kicker">Checkout</p>
        <h1>Standalone checkout route</h1>
        <form className="auth-form" onSubmit={onSubmit}>
          <input className="field" value={form.name} onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))} placeholder="Full name" required />
          <input className="field" type="email" value={form.email} onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))} placeholder="Email" required />
          <input className="field" value={form.phone} onChange={(e) => setForm((c) => ({ ...c, phone: e.target.value }))} placeholder="Phone number" required />
          <input className="field" value={form.address} onChange={(e) => setForm((c) => ({ ...c, address: e.target.value }))} placeholder="Address" required />
          <input className="field" value={form.city} onChange={(e) => setForm((c) => ({ ...c, city: e.target.value }))} placeholder="City" required />
          <select className="field" value={form.paymentMethod} onChange={(e) => setForm((c) => ({ ...c, paymentMethod: e.target.value }))}>
            <option value="cash">Cash on delivery</option>
            <option value="momo">Mobile money</option>
            <option value="card">Card</option>
          </select>
          <p className="hero-copy">Order total: {subtotal.toFixed(2)}</p>
          {message ? <p className="hero-copy">{message}</p> : null}
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "Placing order..." : "Place order"}
          </button>
        </form>
      </section>
    </main>
  );
}
