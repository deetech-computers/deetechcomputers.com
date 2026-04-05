const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";
const EMAILJS_ADMIN_ORDER_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_ADMIN_ORDER_TEMPLATE_ID || "";
const EMAILJS_ORDER_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID || "";
const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL || "deetechcomputers01@gmail.com";
const ADMIN_FIRST_NAME = process.env.NEXT_PUBLIC_ADMIN_FIRST_NAME || "Daniel";
const ADMIN_LAST_NAME = process.env.NEXT_PUBLIC_ADMIN_LAST_NAME || "Adjei Mensah";
const ADMIN_PHONE = process.env.NEXT_PUBLIC_ADMIN_PHONE || "+233591755964";
const SUPPORT_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_NUMBER || "233591755964";
const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "deetechcomputers01@gmail.com";

function money(n) {
  return `GH₵ ${Number(n || 0).toFixed(2)}`;
}

export function canUseEmailJsOrders() {
  return Boolean(
    EMAILJS_SERVICE_ID &&
      EMAILJS_PUBLIC_KEY &&
      EMAILJS_ADMIN_ORDER_TEMPLATE_ID &&
      EMAILJS_ORDER_TEMPLATE_ID
  );
}

function buildOrderItemsForEmail(items) {
  return (items || []).map((item) => {
    const quantity = Number(item.quantity || item.qty || 1);
    const price = Number(item.price || 0);
    return {
      id: item.id || item.productId || item._id || "N/A",
      name: item.name || "Product",
      quantity,
      price,
      subtotal: quantity * price,
    };
  });
}

function sendEmailJsTemplate(templateId, templateParams) {
  return fetch(EMAILJS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: templateId,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: templateParams,
    }),
  }).then(async (response) => {
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(text || "EmailJS request failed");
    }
    return response.text().catch(() => "");
  });
}

export async function sendOrderEmailsViaEmailJs({
  savedOrder,
  items,
  customerName,
  customerEmail,
  customerPhone,
  address,
  city,
  paymentMethod,
  notes,
  websiteUrl,
  companyName,
}) {
  if (!canUseEmailJsOrders()) {
    return { skipped: true };
  }

  const orderId = savedOrder?._id || savedOrder?.id || savedOrder?.orderId || "N/A";
  const orderDate = new Date().toLocaleDateString("en-GB");
  const orderTime = new Date().toLocaleTimeString("en-GB");
  const orderItems = buildOrderItemsForEmail(items);
  const totalItems = orderItems.length;
  const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const orderTotal = Number(
    savedOrder?.totalPrice ??
      savedOrder?.total ??
      savedOrder?.grandTotal ??
      0
  );

  const orderItemsTableRows = orderItems
    .map(
      (item) => `<tr>
        <td width="50%" style="padding:8px 0 8px 5px; font-size:12px;">${item.name}</td>
        <td width="20%" align="center" style="padding:8px 0; font-size:12px;">${item.quantity}</td>
        <td width="30%" align="right" style="padding:8px 5px 8px 0; font-size:12px;">${money(
          item.subtotal
        )}</td>
      </tr>`
    )
    .join("");

  const orderItemsBlocks = orderItems
    .map(
      (item) => `
        <div style="margin-bottom: 12px; padding: 12px; background: #f8f9fa; border-radius: 5px; border-left: 4px solid #007bff;">
          <strong style="color: #333;">${item.name}</strong>
          <div style="font-size: 13px; color: #666; margin: 4px 0;">ID: ${item.id}</div>
          <div style="font-size: 13px;">
            <span style="color: #333;">Quantity:</span> ${item.quantity} x
            <span style="color: #333;">${money(item.price)}</span> =
            <strong style="color: #d9534f;">${money(item.subtotal)}</strong>
          </div>
        </div>`
    )
    .join("");

  const deliveryAddress = `${address || ""}, ${city || ""}`.replace(
    /^,\s*|\s*,\s*$/g,
    ""
  );

  const customerParams = {
    email: String(customerEmail || "").trim(),
    to_email: String(customerEmail || "").trim(),
    to_name: customerName || "Valued Customer",
    customer_name: customerName || "Customer",
    customer_email: String(customerEmail || "").trim(),
    customer_phone: customerPhone || "",
    order_id: String(orderId),
    order_subtotal: orderTotal.toFixed(2),
    order_total: orderTotal.toFixed(2),
    currency_symbol: "GH₵ ",
    order_items: orderItemsTableRows || "<tr><td colspan='3'>No items listed</td></tr>",
    order_date: orderDate,
    payment_method: paymentMethod || "Not specified",
    delivery_address: deliveryAddress,
    company_name: companyName || "DEETECH COMPUTERS",
    support_email: SUPPORT_EMAIL,
    support_phone: ADMIN_PHONE,
    current_year: new Date().getFullYear().toString(),
    website_url: websiteUrl,
    order_tracking_url: `${websiteUrl}/order-completed`,
    estimated_delivery: "24 hours Delivery",
    shipping_method: "Free Nationwide Delivery",
    subject: `Order Confirmation #${orderId} - DEETECH COMPUTERS`,
  };

  const adminFullName = `${ADMIN_FIRST_NAME} ${ADMIN_LAST_NAME}`.trim();
  const adminParams = {
    email: ADMIN_EMAIL,
    to_email: ADMIN_EMAIL,
    to_name: adminFullName,
    admin_name: adminFullName,
    order_id: String(orderId),
    customer_name: customerName || "Customer",
    customer_email: String(customerEmail || "").trim(),
    customer_phone: customerPhone || "",
    order_total: money(orderTotal),
    order_items: orderItemsBlocks || "<div>No items listed</div>",
    order_date: orderDate,
    order_time: orderTime,
    payment_method: paymentMethod || "Not specified",
    delivery_address: deliveryAddress,
    shipping_method: "Free Nationwide Delivery",
    subject: `NEW ORDER #${orderId} - ACTION REQUIRED`,
    customer_notes: notes || "No special instructions",
    order_status: "NEW ORDER",
    view_order_url: `${websiteUrl}/order-completed`,
    total_items: totalItems,
    total_quantity: totalQuantity,
    platform: "Website",
    order_urgency: "HIGH PRIORITY",
    action_required: "Process & Confirm",
    estimated_delivery: "Within 3-5 days",
    payment_status: "Pending",
    customer_address: deliveryAddress,
    support_email: SUPPORT_EMAIL,
    support_phone: ADMIN_PHONE,
    support_whatsapp: SUPPORT_WHATSAPP_NUMBER,
    website_url: websiteUrl,
  };

  const tasks = [
    sendEmailJsTemplate(EMAILJS_ADMIN_ORDER_TEMPLATE_ID, adminParams),
  ];

  if (customerEmail) {
    tasks.push(sendEmailJsTemplate(EMAILJS_ORDER_TEMPLATE_ID, customerParams));
  }

  await Promise.all(tasks);
  return { skipped: false };
}
