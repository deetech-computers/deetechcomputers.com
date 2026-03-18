import nodemailer from "nodemailer";
import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  ADMIN_EMAIL,
  FRONTEND_URL,
  NODE_ENV,
} from "../config/env.js";
import logger from "./logger.js";

const COMPANY_NAME = "DEETECH COMPUTERS";
const SUPPORT_EMAIL = ADMIN_EMAIL || SMTP_USER || "support@deetech.local";
const SUPPORT_PHONE = "+233 59 175 5964";
const CURRENCY_SYMBOL = "GH₵";

let transporter = null;

function escapeHtml(input = "") {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function money(value) {
  const amount = Number(value || 0);
  return `${CURRENCY_SYMBOL}${amount.toFixed(2)}`;
}

function formatDateTime(value) {
  const date = value ? new Date(value) : new Date();
  return {
    date: date.toLocaleDateString("en-GB"),
    time: date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function paymentMethodLabel(method) {
  const map = {
    mtn: "MTN Mobile Money",
    vodafone: "Telecel (Vodafone) Cash",
    bank: "Bank Transfer",
    hubtel: "Hubtel",
  };
  return map[String(method || "").toLowerCase()] || (method || "N/A");
}

function orderItemsForEmail(items = []) {
  return items.map((item) => ({
    qty: Number(item.qty || item.quantity || 0),
    name: item.name || item.product?.name || String(item.product || "Product"),
    price: Number(item.price || 0),
  }));
}

function initTransporter() {
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    const t = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    t.verify((err) => {
      if (err) {
        logger.error("Email service initialization failed", { error: err.message });
      } else {
        logger.info("Email service initialized with SMTP");
      }
    });

    return t;
  }

  logger.warn("SMTP config missing. Email service disabled.");
  return null;
}

transporter = initTransporter();

async function sendEmail({ to, subject, html }) {
  if (!transporter) {
    logger.warn(`Skipping email to ${to} - no transporter configured.`);
    return;
  }

  try {
    await transporter.sendMail({
      from: `${COMPANY_NAME} <${SMTP_USER || SUPPORT_EMAIL}>`,
      to,
      subject,
      html,
    });
    logger.info(`Email sent to ${to} | Subject: ${subject}`);
  } catch (err) {
    logger.error("Failed to send email", {
      to,
      subject,
      error: err.message,
    });
  }
}

export async function sendPasswordResetEmail(to, resetUrl) {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;">
      <h2 style="margin:0 0 12px;">Password Reset Request</h2>
      <p style="margin:0 0 16px;">You requested a password reset for your account.</p>
      <p style="margin:0 0 16px;">
        <a href="${escapeHtml(resetUrl)}" style="background:#2563eb;color:#fff;text-decoration:none;padding:10px 16px;border-radius:6px;display:inline-block;">
          Reset Password
        </a>
      </p>
      <p style="margin:0;color:#6b7280;font-size:13px;">If you did not request this, you can ignore this email.</p>
    </div>
  `;

  await sendEmail({
    to,
    subject: "Password Reset Request",
    html,
  });
}

export async function sendOrderNotification(to, orderDetails = {}) {
  const items = orderItemsForEmail(orderDetails.orderItems || []);
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const created = formatDateTime(orderDetails.createdAt);
  const baseUrl = String(FRONTEND_URL || "").replace(/\/$/, "");
  const adminOrderUrl = baseUrl ? `${baseUrl}/Admin/orders.html` : "#";

  const orderItemsHtml = items
    .map(
      (item) => `
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px dashed #ddd;">
          <span>${escapeHtml(item.name)} (x${item.qty})</span>
          <strong>${money(item.price * item.qty)}</strong>
        </div>
      `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>New Order</title></head>
    <body style="margin:0;padding:20px 0;background:#f5f5f5;font-family:Arial,sans-serif;color:#333;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#d9534f 0%,#c9302c 100%);color:#fff;padding:24px 28px;text-align:center;">
          <h1 style="margin:0;font-size:24px;">NEW ORDER RECEIVED</h1>
          <div style="margin-top:6px;font-size:14px;">Order #${escapeHtml(orderDetails.id || "N/A")}</div>
        </div>
        <div style="padding:20px 28px;">
          <div style="background:#fff3cd;border-left:4px solid #ffc107;padding:12px 14px;border-radius:4px;margin-bottom:16px;">
            <strong>Action Required:</strong> Please review and process this order.
          </div>

          <h3 style="margin:0 0 10px;padding-bottom:8px;border-bottom:2px solid #007bff;">Customer Details</h3>
          <p style="margin:6px 0;"><strong>Name:</strong> ${escapeHtml(orderDetails.customerName || "N/A")}</p>
          <p style="margin:6px 0;"><strong>Email:</strong> ${escapeHtml(orderDetails.customerEmail || "N/A")}</p>
          <p style="margin:6px 0;"><strong>Phone:</strong> ${escapeHtml(orderDetails.mobileNumber || "N/A")}</p>
          <p style="margin:6px 0;"><strong>Date/Time:</strong> ${created.date} ${created.time}</p>

          <h3 style="margin:18px 0 10px;padding-bottom:8px;border-bottom:2px solid #007bff;">Order Details</h3>
          <p style="margin:6px 0;"><strong>Payment:</strong> ${escapeHtml(paymentMethodLabel(orderDetails.paymentMethod))}</p>
          <p style="margin:6px 0;"><strong>Address:</strong> ${escapeHtml(orderDetails.deliveryAddress || orderDetails.deliveryRegion || "N/A")}</p>
          <p style="margin:6px 0;"><strong>Status:</strong> ${escapeHtml(orderDetails.orderStatus || "pending")} | ${escapeHtml(orderDetails.paymentStatus || "pending")}</p>
          <p style="margin:6px 0;"><strong>Notes:</strong> ${escapeHtml(orderDetails.guestNotes || "None")}</p>
          ${
            orderDetails.paymentScreenshotUrl
              ? `<p style="margin:6px 0;"><strong>Payment Proof:</strong> <a href="${escapeHtml(baseUrl + orderDetails.paymentScreenshotUrl)}">View Uploaded Proof</a></p>`
              : ""
          }

          <h3 style="margin:18px 0 10px;padding-bottom:8px;border-bottom:2px solid #007bff;">Items (${items.length} items, ${totalQty} units)</h3>
          <div style="background:#f8f9fa;border-radius:6px;padding:10px 12px;">${orderItemsHtml || "<em>No items</em>"}</div>
          <div style="background:#e9ecef;padding:12px;border-radius:5px;margin-top:12px;font-size:18px;font-weight:bold;color:#d9534f;">
            Total: ${money(orderDetails.totalPrice)}
          </div>

          <div style="text-align:center;margin-top:18px;">
            <a href="${escapeHtml(adminOrderUrl)}" style="display:inline-block;background:#007bff;color:#fff;text-decoration:none;padding:10px 18px;border-radius:6px;font-weight:700;">
              View Full Order
            </a>
          </div>
        </div>
        <div style="background:#343a40;color:#fff;padding:16px 24px;text-align:center;font-size:12px;">
          <div>${new Date().getFullYear()} ${COMPANY_NAME} Admin Dashboard</div>
          <div style="margin-top:4px;">${escapeHtml(SUPPORT_EMAIL)} | ${escapeHtml(SUPPORT_PHONE)}</div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to,
    subject: `NEW ORDER #${orderDetails.id || "N/A"} - ACTION REQUIRED`,
    html,
  });
}

export async function sendOrderConfirmation(to, orderDetails = {}) {
  const items = orderItemsForEmail(orderDetails.orderItems || []);
  const created = formatDateTime(orderDetails.createdAt);
  const baseUrl = String(FRONTEND_URL || "").replace(/\/$/, "");
  const trackingUrl = baseUrl ? `${baseUrl}/orders.html?tab=orders` : "#";
  const subtotal = Number(orderDetails.totalPrice || 0);
  const rows = items
    .map((item) => {
      const lineTotal = item.qty * item.price;
      return `
        <tr>
          <td width="50%" style="padding:8px 0 8px 5px;border-bottom:1px dashed #ddd;">${escapeHtml(item.name)}</td>
          <td width="20%" align="center" style="padding:8px 0;border-bottom:1px dashed #ddd;">${item.qty}</td>
          <td width="30%" align="right" style="padding:8px 5px 8px 0;border-bottom:1px dashed #ddd;">${money(lineTotal)}</td>
        </tr>
      `;
    })
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Order Confirmed</title></head>
    <body style="margin:0;padding:20px 0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.4;color:#000;">
      <div style="max-width:340px;margin:0 auto;background:#fff;border:1px solid #ddd;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:2px dashed #ccc;">
          <tr><td align="center" style="padding:25px 20px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:2px solid #000;padding-bottom:15px;margin-bottom:15px;">
              <tr><td align="center" style="padding-bottom:8px;">
                <div style="font-size:28px;font-weight:bold;letter-spacing:1.5px;font-family:'Courier New',monospace;">DEETECH</div>
              </td></tr>
              <tr><td align="center">
                <div style="font-size:15px;font-weight:bold;margin-bottom:5px;">COMPUTERS & ELECTRONICS</div>
                <div style="font-size:11px;color:#666;margin-bottom:4px;">Quality Tech Solutions Since 2020</div>
                <div style="font-size:10px;color:#666;font-weight:500;">${escapeHtml(SUPPORT_PHONE)} | ${escapeHtml(SUPPORT_EMAIL)}</div>
              </td></tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px dashed #ccc;border-bottom:1px dashed #ccc;">
              <tr><td align="center" style="padding:8px 0;">
                <div style="font-size:18px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">ORDER CONFIRMATION</div>
                <div style="font-size:10px;color:#666;margin-top:4px;font-style:italic;">Thank you for choosing DEETECH</div>
              </td></tr>
            </table>
          </td></tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding:20px;">
            <p style="margin:0 0 10px;font-size:12px;line-height:1.5;">
              Hi ${escapeHtml(orderDetails.customerName || "Customer")},<br>
              <strong style="font-size:12.5px;">Thank you for trusting DEETECH with your tech needs!</strong>
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-bottom:2px solid #000;margin-bottom:18px;padding-bottom:12px;">
              <tr>
                <td width="50%" style="font-weight:bold;font-size:11.5px;">ORDER #${escapeHtml(orderDetails.id || "N/A")}</td>
                <td width="50%" align="right" style="font-size:10px;color:#666;font-weight:500;">${created.date}</td>
              </tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #000;border-bottom:1px solid #000;margin-bottom:0;background:#f9f9f9;">
              <tr>
                <td width="50%" style="padding:8px 0 8px 5px;"><strong style="font-size:11.5px;">ITEM DESCRIPTION</strong></td>
                <td width="20%" align="center" style="padding:8px 0;"><strong style="font-size:11.5px;">QTY</strong></td>
                <td width="30%" align="right" style="padding:8px 5px 8px 0;"><strong style="font-size:11.5px;">AMOUNT</strong></td>
              </tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:18px;font-size:12px;">
              ${rows}
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:2px solid #000;padding-top:12px;margin-bottom:18px;">
              <tr>
                <td width="70%" style="padding:4px 0;font-weight:500;">Subtotal:</td>
                <td width="30%" align="right" style="padding:4px 0;font-weight:500;">${money(subtotal)}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-weight:500;">Delivery Fee:</td>
                <td align="right" style="padding:4px 0;color:#28a745;font-weight:bold;font-size:12.5px;">FREE</td>
              </tr>
              <tr>
                <td colspan="2" style="border-top:1px solid #000;padding-top:10px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="font-size:13px;font-weight:bold;">TOTAL:</td>
                      <td align="right" style="font-size:16px;font-weight:bold;">${money(subtotal)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:18px;">
              <tr><td align="center" style="font-size:10px;font-weight:600;padding:5px;border:1px dashed #c3e6cb;background:#f8fff8;color:#28a745;">
                Free delivery included
              </td></tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #cfe2ff;border-left:4px solid #007bff;background:#f0f7ff;margin-bottom:18px;">
              <tr><td style="padding:12px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="50%" align="center" style="padding-right:10px;border-right:1px dashed #cfe2ff;">
                      <div style="font-size:10px;color:#666;font-weight:600;margin-bottom:4px;">ORDER STATUS</div>
                      <div style="font-size:12px;font-weight:bold;color:#28a745;margin-bottom:4px;">CONFIRMED</div>
                      <div style="font-size:10px;color:#666;font-weight:500;">Processing • Estimated: 4-24 hours</div>
                    </td>
                    <td width="50%" align="center" style="padding-left:10px;">
                      <div style="font-size:10px;color:#666;font-weight:600;margin-bottom:4px;">SUPPORT</div>
                      <div style="font-size:10px;color:#666;font-weight:500;margin-bottom:2px;">${escapeHtml(SUPPORT_PHONE)}</div>
                      <div style="font-size:10px;color:#666;font-weight:500;margin-bottom:4px;">${escapeHtml(SUPPORT_EMAIL)}</div>
                      <div style="font-size:9px;color:#666;margin-top:4px;font-weight:500;">We're here to help</div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="border-top:1px dashed #cfe2ff;padding-top:10px;">
                      <div style="font-size:10px;color:#666;text-align:center;font-weight:500;">
                        Track your order anytime via your account •
                        <a href="${escapeHtml(trackingUrl)}" style="color:#007bff;text-decoration:none;font-weight:600;">View order</a>
                      </div>
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px dashed #ccc;padding-top:12px;">
              <tr><td align="center">
                <div style="font-size:12px;font-weight:bold;margin-bottom:8px;">THANK YOU FOR YOUR PURCHASE!</div>
                <div style="font-size:11px;color:#666;margin-bottom:10px;font-style:italic;font-weight:500;">We appreciate your business and look forward to serving you</div>
                <div style="font-size:10px;color:#666;margin-bottom:12px;font-weight:500;">Please keep this receipt for your records.</div>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to,
    subject: `Order Confirmed - ${COMPANY_NAME} #${orderDetails.id || "N/A"}`,
    html,
  });
}

export const sendOrderConfirmationEmail = sendOrderConfirmation;

export function getEmailProviderInfo() {
  return {
    provider: "smtp_nodemailer",
    smtpHost: SMTP_HOST || "",
    smtpUser: SMTP_USER || "",
    hasTransporter: Boolean(transporter),
    frontendEmailJsActiveOnCheckout: true,
    environment: NODE_ENV,
  };
}
