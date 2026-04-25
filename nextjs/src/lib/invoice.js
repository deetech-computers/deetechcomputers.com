import { formatCurrency } from "@/lib/format";

const SUPPORT_PHONE = "+233 591755964";
const SUPPORT_EMAIL = "deetechcomputers01@gmail.com";
const COMPANY_NAME = "DEETECH COMPUTERS";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDateTime(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function buildEstimatedDelivery(order) {
  if (order?.estimatedDeliveryDate) {
    return formatDateTime(order.estimatedDeliveryDate);
  }
  const base = order?.paidAt || order?.createdAt || order?.date;
  if (!base) return "N/A";
  const date = new Date(base);
  if (Number.isNaN(date.getTime())) return "N/A";
  return formatDateTime(new Date(date.getTime() + 24 * 60 * 60 * 1000));
}

function paymentLabel(value) {
  if (value === "mtn") return "MTN Mobile Money";
  if (value === "vodafone") return "Telecel Cash";
  if (value === "bank") return "Bank Transfer";
  if (value === "hubtel") return "Hubtel";
  return value || "N/A";
}

function normalizeItems(order, summary) {
  const sourceItems = Array.isArray(summary?.items)
    ? summary.items
    : Array.isArray(order?.orderItems)
      ? order.orderItems
      : [];

  return sourceItems.map((item) => {
    const product = item?.product || {};
    const quantity = Number(item?.quantity || item?.qty || 1);
    const unitPrice = Number(item?.price || product?.price || 0);
    const lineTotal = Math.max(0, quantity * unitPrice);
    return {
      name: product?.name || item?.name || "Product",
      quantity,
      lineTotal,
    };
  });
}

export function buildInvoiceHtml(order, summary) {
  const items = normalizeItems(order, summary);
  const subtotal =
    Number(summary?.subtotal || 0) > 0
      ? Number(summary.subtotal || 0)
      : Number(order?.itemsPrice || order?.subtotal || order?.totalPrice || order?.total || 0);
  const shipping = Number(summary?.shipping ?? order?.shippingPrice ?? order?.shipping ?? 0);
  const discountAmount = Number(summary?.discountAmount ?? order?.discountAmount ?? 0);
  const total = Number(summary?.total ?? order?.totalPrice ?? order?.total ?? 0);
  const orderId = order?.orderId || order?.orderNumber || order?.reference || order?._id || "N/A";
  const orderDate = formatDateTime(order?.date || order?.createdAt || order?.updatedAt);
  const estimatedDelivery = buildEstimatedDelivery(order);
  const customerEmail =
    order?.shippingEmail ||
    order?.guestEmail ||
    order?.email ||
    order?.user?.email ||
    "N/A";
  const customerPhone =
    order?.mobileNumber ||
    order?.phone ||
    order?.paymentMobileNumber ||
    order?.shippingAddress?.phone ||
    "N/A";
  const deliveryAddress = [
    order?.shippingAddress,
    order?.shippingCity,
    order?.deliveryRegion,
    order?.guestAddress,
    order?.guestCity,
    order?.address,
    order?.city,
    order?.shippingAddress?.address,
    order?.shippingAddress?.city,
    order?.shippingAddress?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const rowsHtml = items.length
    ? items
        .map(
          (item) => `
            <tr>
              <td style="padding:8px 4px;border-bottom:1px solid #e5e7eb;">${escapeHtml(item.name)}</td>
              <td style="padding:8px 4px;border-bottom:1px solid #e5e7eb;text-align:center;">${escapeHtml(item.quantity)}</td>
              <td style="padding:8px 4px;border-bottom:1px solid #e5e7eb;text-align:right;">${escapeHtml(formatCurrency(item.lineTotal))}</td>
            </tr>
          `
        )
        .join("")
    : `<tr><td colspan="3" style="padding:8px 4px;border-bottom:1px solid #e5e7eb;text-align:center;">No items listed</td></tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmed – DEETECH #${escapeHtml(orderId)}</title>
  <style>
    @media (prefers-color-scheme: dark) {
      body { background:#121212 !important; color:#e5e7eb !important; }
      .invoice-wrap { background:#1f2937 !important; border-color:#374151 !important; }
      .table-head { background:#111827 !important; }
      .muted { color:#d1d5db !important; }
    }
    body {
      margin:0;
      padding:20px 12px;
      background:#f3f4f6;
      font-family:Arial, Helvetica, sans-serif;
      color:#111827;
    }
    .invoice-wrap {
      max-width:360px;
      margin:0 auto;
      background:#ffffff;
      border:1px solid #d1d5db;
    }
    .pad { padding:18px; }
    .center { text-align:center; }
    .muted { color:#4b5563; }
    .header {
      border-bottom:2px dashed #d1d5db;
    }
    .brand {
      font-size:28px;
      font-weight:800;
      letter-spacing:1px;
      margin:4px 0 2px;
    }
    .receipt-title {
      border-top:1px dashed #d1d5db;
      border-bottom:1px dashed #d1d5db;
      margin-top:12px;
      padding:8px 0;
      font-weight:700;
      letter-spacing:1px;
      text-transform:uppercase;
    }
    .order-row {
      display:flex;
      justify-content:space-between;
      gap:12px;
      border-bottom:2px solid #111827;
      padding-bottom:8px;
      margin-bottom:12px;
      font-size:12px;
      font-weight:700;
    }
    table { width:100%; border-collapse:collapse; font-size:12px; }
    .table-head {
      background:#f9fafb;
      border-top:1px solid #111827;
      border-bottom:1px solid #111827;
      font-weight:700;
    }
    .totals {
      border-top:2px solid #111827;
      margin-top:12px;
      padding-top:8px;
      font-size:12px;
    }
    .totals .line {
      display:flex;
      justify-content:space-between;
      gap:10px;
      margin:6px 0;
    }
    .totals .grand {
      border-top:1px solid #111827;
      margin-top:8px;
      padding-top:8px;
      font-size:15px;
      font-weight:800;
    }
    .box {
      border:1px solid #dbeafe;
      border-left:4px solid #0d56da;
      background:#eff6ff;
      padding:10px;
      margin-top:12px;
      font-size:11px;
      line-height:1.45;
    }
    .footer-note {
      border-top:1px dashed #d1d5db;
      margin-top:12px;
      padding-top:10px;
      font-size:10px;
      line-height:1.5;
    }
  </style>
</head>
<body>
  <div class="invoice-wrap">
    <div class="pad header center">
      <div class="brand">DEETECH</div>
      <div class="muted" style="font-size:11px;font-weight:600;">COMPUTERS & ELECTRONICS</div>
      <div class="muted" style="font-size:10px;margin-top:4px;">${escapeHtml(SUPPORT_PHONE)} | ${escapeHtml(SUPPORT_EMAIL)}</div>
      <div class="receipt-title">Order Confirmation</div>
    </div>

    <div class="pad">
      <p style="margin:0 0 10px;font-size:12px;line-height:1.5;">
        Hi ${escapeHtml(order?.name || order?.user?.name || "Customer")},<br />
        <strong>Thank you for your order.</strong> We are preparing it and will update you shortly.
      </p>

      <div class="order-row">
        <span>ORDER #${escapeHtml(orderId)}</span>
        <span>${escapeHtml(orderDate)}</span>
      </div>

      <table>
        <thead class="table-head">
          <tr>
            <th style="padding:8px 4px;text-align:left;">Item Description</th>
            <th style="padding:8px 4px;text-align:center;">Qty</th>
            <th style="padding:8px 4px;text-align:right;">Amount</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>

      <div class="totals">
        <div class="line"><span>Subtotal:</span><strong>${escapeHtml(formatCurrency(subtotal))}</strong></div>
        <div class="line"><span>Delivery Fee:</span><strong>${shipping === 0 ? "FREE" : escapeHtml(formatCurrency(shipping))}</strong></div>
        <div class="line"><span>Coupon Discount:</span><strong>-${escapeHtml(formatCurrency(discountAmount))}</strong></div>
        <div class="line grand"><span>Total:</span><span>${escapeHtml(formatCurrency(total))}</span></div>
      </div>

      <div class="box">
        <div><strong>Payment Method:</strong> ${escapeHtml(paymentLabel(order?.paymentMethod))}</div>
        <div><strong>Estimated Delivery:</strong> ${escapeHtml(estimatedDelivery)}</div>
        <div><strong>Customer Email:</strong> ${escapeHtml(customerEmail)}</div>
        <div><strong>Customer Phone:</strong> ${escapeHtml(customerPhone)}</div>
        <div><strong>Delivery Address:</strong> ${escapeHtml(deliveryAddress || "N/A")}</div>
      </div>

      <div class="footer-note center muted">
        THANK YOU FOR YOUR PURCHASE<br />
        Please keep this receipt for your records.<br />
        &copy; ${new Date().getFullYear()} ${escapeHtml(COMPANY_NAME)}
      </div>
    </div>
  </div>
</body>
</html>`;
}

export function downloadInvoiceHtml(order, summary) {
  if (typeof window === "undefined" || !order) return;
  const html = buildInvoiceHtml(order, summary);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  const orderId = order?.orderId || order?.orderNumber || order?.reference || order?._id || "order";
  anchor.href = url;
  anchor.download = `deetech-invoice-${orderId}.html`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}
