// backend/src/controllers/orderController.js
import Order from "../models/Order.js";
import OrderAttemptLog from "../models/OrderAttemptLog.js";
import Product from "../models/Product.js";
import DiscountCode from "../models/DiscountCode.js";
import Affiliate from "../models/Affiliate.js";
import Referral from "../models/Referral.js";
import crypto from "crypto";
import { createOrderSchema, createGuestOrderSchema } from "../validators/orderSchemas.js";
import {
  ADMIN_EMAIL,
  BACKEND_PUBLIC_URL,
  FRONTEND_URL,
  HUBTEL_CALLBACK_TOKEN,
  HUBTEL_STATUS_TOKEN,
} from "../config/env.js";
import { sendOrderNotification, sendOrderConfirmation } from "../utils/emailService.js";
import { initiateHubtelCheckout } from "../utils/hubtelService.js";
import { deleteStoredMedia } from "../utils/mediaStorage.js";
import { getProductPricing } from "../utils/productPricing.js";

async function processOrderItems(orderItems, session) {
  let total = 0;
  const processedItems = [];

  for (const item of orderItems) {
    const qty = Number(item?.qty);
    if (!Number.isInteger(qty) || qty < 1) {
      throw new Error("Invalid order quantity");
    }

    const product = session
      ? await Product.findById(item.product).session(session)
      : await Product.findById(item.product);
    if (!product) throw new Error(`Product not found: ${item.product}`);

    const currentStock = Number(
      product.countInStock ??
        product.get?.("stock_quantity") ??
        product.get?.("stock") ??
        product.stock_quantity ??
        product.stock ??
        0
    );
    const safeStock = Number.isFinite(currentStock) ? Math.max(0, currentStock) : 0;
    if (safeStock < qty) {
      throw new Error(`Not enough stock for ${product.name}`);
    }

    const price = Number(getProductPricing(product).currentPrice || 0);

    total += qty * price;
    processedItems.push({
      product: product._id,
      qty,
      price,
    });
  }

  return { total, processedItems };
}

function getHubtelCheckoutUrl(response) {
  const direct = String(response?.data?.checkoutDirectUrl || "").trim();
  const checkout = String(response?.data?.checkoutUrl || "").trim();
  return direct || checkout || "";
}

function resolvePublicBaseUrl() {
  const backend = String(BACKEND_PUBLIC_URL || "").trim().replace(/\/+$/, "");
  if (backend) return backend;
  return "http://127.0.0.1:5000";
}

function resolveRequestBaseUrl(req) {
  const forwardedProto = String(req?.headers?.["x-forwarded-proto"] || "")
    .split(",")[0]
    .trim();
  const forwardedHost = String(req?.headers?.["x-forwarded-host"] || "")
    .split(",")[0]
    .trim();
  const host = forwardedHost || String(req?.headers?.host || "").trim();
  if (!host) return "";
  const proto = forwardedProto || (String(req?.protocol || "").trim() || "https");
  return `${proto}://${host}`.replace(/\/+$/, "");
}

function resolvePublicBaseUrlFromRequest(req) {
  const configured = resolvePublicBaseUrl();
  if (configured && !configured.includes("127.0.0.1")) return configured;
  const derived = resolveRequestBaseUrl(req);
  return derived || configured;
}

function resolveFrontendBaseUrl(frontendOriginRaw, req) {
  const requested = String(frontendOriginRaw || "").trim().replace(/\/+$/, "");
  if (/^https?:\/\//i.test(requested)) {
    return requested;
  }
  const frontend = String(FRONTEND_URL || "").split(",")[0].trim().replace(/\/+$/, "");
  if (frontend) return frontend;
  const originHeader = String(req?.headers?.origin || "").trim().replace(/\/+$/, "");
  if (/^https?:\/\//i.test(originHeader)) {
    return originHeader;
  }
  return "http://localhost:3000";
}

function normalizeGhanaMobile(raw) {
  const compact = String(raw || "").replace(/[\s-]/g, "").trim();
  if (!compact) return "";
  if (/^233\d{9}$/.test(compact)) {
    return `+${compact}`;
  }
  if (/^\+233\d{9}$/.test(compact)) {
    return compact;
  }
  if (/^0\d{9}$/.test(compact)) {
    return compact;
  }
  return compact;
}

function generateHubtelSafeReference() {
  return `dc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function sanitizeClientReference(raw) {
  return String(raw || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toHubtelClientReference(raw) {
  const cleaned = sanitizeClientReference(raw);
  // Hubtel rejects long client references; keep a conservative max length.
  if (cleaned && cleaned.length <= 36) return cleaned;
  if (cleaned) return cleaned.slice(0, 36);
  return generateHubtelSafeReference();
}

function getRequestIp(req) {
  return String(
    req?.headers?.["x-forwarded-for"] ||
      req?.ip ||
      req?.socket?.remoteAddress ||
      ""
  )
    .split(",")[0]
    .trim();
}

function getRequestUserAgent(req) {
  return String(req?.headers?.["user-agent"] || "").trim().slice(0, 500);
}

function countOrderItems(orderItems) {
  return (Array.isArray(orderItems) ? orderItems : []).reduce(
    (sum, item) => sum + Math.max(0, Number(item?.qty || 0)),
    0
  );
}

function buildOrderAttemptFingerprint({
  userId,
  guestEmail,
  shippingEmail,
  mobileNumber,
  paymentMethod,
  paymentFlow,
  orderItems,
}) {
  const items = (Array.isArray(orderItems) ? orderItems : [])
    .map((item) => ({
      product: String(item?.product || item?._id || "").trim(),
      qty: Number(item?.qty || 0),
    }))
    .filter((item) => item.product && Number.isFinite(item.qty))
    .sort((a, b) => {
      if (a.product === b.product) return a.qty - b.qty;
      return a.product.localeCompare(b.product);
    });

  const fingerprintSource = JSON.stringify({
    userId: String(userId || "").trim(),
    guestEmail: String(guestEmail || "").trim().toLowerCase(),
    shippingEmail: String(shippingEmail || "").trim().toLowerCase(),
    mobileNumber: String(mobileNumber || "").trim(),
    paymentMethod: String(paymentMethod || "").trim().toLowerCase(),
    paymentFlow: String(paymentFlow || "").trim().toLowerCase(),
    items,
  });

  return crypto.createHash("sha256").update(fingerprintSource).digest("hex").slice(0, 24);
}

async function writeOrderAttemptLog({
  req,
  order = null,
  user = null,
  scope = "system",
  stage,
  outcome,
  clientOrderRef = "",
  attemptFingerprint = "",
  paymentMethod = "",
  paymentFlow = "",
  itemCount = 0,
  totalPrice = 0,
  shippingEmail = "",
  guestEmail = "",
  mobileNumber = "",
  reason = "",
  metadata = undefined,
}) {
  try {
    await OrderAttemptLog.create({
      order: order?._id || order || undefined,
      user: user?._id || user || undefined,
      scope,
      stage,
      outcome,
      clientOrderRef: String(clientOrderRef || "").trim() || undefined,
      attemptFingerprint: String(attemptFingerprint || "").trim() || undefined,
      paymentMethod: String(paymentMethod || "").trim() || undefined,
      paymentFlow: String(paymentFlow || "").trim() || undefined,
      itemCount: Number.isFinite(Number(itemCount)) ? Number(itemCount) : 0,
      totalPrice: Number.isFinite(Number(totalPrice)) ? Number(totalPrice) : 0,
      shippingEmail: String(shippingEmail || "").trim().toLowerCase() || undefined,
      guestEmail: String(guestEmail || "").trim().toLowerCase() || undefined,
      mobileNumber: String(mobileNumber || "").trim() || undefined,
      ipAddress: getRequestIp(req) || undefined,
      userAgent: getRequestUserAgent(req) || undefined,
      reason: String(reason || "").trim() || undefined,
      metadata,
    });
  } catch (logError) {
    console.warn("Order attempt audit log skipped:", logError?.message || logError);
  }
}

function timingSafeEqualText(a, b) {
  const left = String(a || "");
  const right = String(b || "");
  if (!left || !right) return false;
  const leftHash = crypto.createHash("sha256").update(left).digest();
  const rightHash = crypto.createHash("sha256").update(right).digest();
  return crypto.timingSafeEqual(leftHash, rightHash);
}

function buildHubtelStatusToken(clientReference) {
  if (!HUBTEL_STATUS_TOKEN) {
    throw new Error("HUBTEL_STATUS_TOKEN is missing on the backend.");
  }
  const reference = String(clientReference || "").trim();
  if (!reference) return "";
  return crypto
    .createHmac("sha256", HUBTEL_STATUS_TOKEN)
    .update(reference)
    .digest("hex");
}

function buildHubtelCallbackUrl(baseUrl) {
  const trimmedBase = String(baseUrl || "").trim();
  if (!trimmedBase) return "";
  if (!HUBTEL_CALLBACK_TOKEN) {
    throw new Error("HUBTEL_CALLBACK_TOKEN is missing on the backend.");
  }
  return `${trimmedBase}?token=${encodeURIComponent(HUBTEL_CALLBACK_TOKEN)}`;
}

function buildHubtelResultUrl(baseUrl, clientReference, statusToken) {
  const trimmedBase = String(baseUrl || "").trim();
  if (!trimmedBase) return "";
  const query = new URLSearchParams({
    clientReference: String(clientReference || "").trim(),
    statusToken: String(statusToken || "").trim(),
  });
  return `${trimmedBase}?${query.toString()}`;
}

function parseEstimatedDeliveryInput(raw) {
  if (!raw) return null;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function defaultEstimatedDeliveryFrom(baseDateInput) {
  const base = new Date(baseDateInput || Date.now());
  if (Number.isNaN(base.getTime())) return null;
  return new Date(base.getTime() + 24 * 60 * 60 * 1000);
}

async function reserveStockAdjustments(adjustments = []) {
  const reserved = [];
  for (const adj of adjustments) {
    const qty = Number(adj?.qty || 0);
    if (!adj?.productId || !Number.isInteger(qty) || qty < 1) continue;

    const updated = await Product.findOneAndUpdate(
      { _id: adj.productId, countInStock: { $gte: qty } },
      { $inc: { countInStock: -qty, sold: qty } },
      { new: true }
    );
    if (!updated) {
      throw new Error("One or more items are out of stock. Please refresh and try again.");
    }
    reserved.push({ productId: adj.productId, qty });
  }
  return reserved;
}

async function rollbackStockAdjustments(adjustments = []) {
  for (const adj of adjustments) {
    const qty = Number(adj?.qty || 0);
    if (!adj?.productId || !Number.isInteger(qty) || qty < 1) continue;

    await Product.updateOne(
      { _id: adj.productId },
      { $inc: { countInStock: qty, sold: -qty } }
    );
  }
}

function buildOrderStockAdjustments(order) {
  const items = Array.isArray(order?.orderItems) ? order.orderItems : [];
  return items
    .map((item) => ({
      productId: item?.product?._id || item?.product,
      qty: Number(item?.qty || 0),
    }))
    .filter((item) => item.productId && Number.isInteger(item.qty) && item.qty > 0);
}

async function ensureOrderStockReserved(order) {
  if (!order || order.stockReserved) return false;
  const adjustments = buildOrderStockAdjustments(order);
  if (!adjustments.length) return false;
  await reserveStockAdjustments(adjustments);
  order.stockReserved = true;
  return true;
}

async function releaseOrderStockReservation(order) {
  if (!order) return false;
  const shouldAssumeLegacyReservedStock =
    !order.stockReserved &&
    order.orderStatus !== "cancelled" &&
    order.paymentStatus !== "failed";
  if (!order.stockReserved && !shouldAssumeLegacyReservedStock) return false;
  const adjustments = buildOrderStockAdjustments(order);
  if (!adjustments.length) {
    order.stockReserved = false;
    return false;
  }
  await rollbackStockAdjustments(adjustments);
  order.stockReserved = false;
  return true;
}

function buildRecentDuplicateWindowDate() {
  return new Date(Date.now() - 10 * 60 * 1000);
}

async function findRecentDuplicateOrder({
  userId = null,
  shippingEmail = "",
  guestEmail = "",
  attemptFingerprint = "",
}) {
  const fingerprint = String(attemptFingerprint || "").trim();
  if (!fingerprint) return null;

  const createdAt = { $gte: buildRecentDuplicateWindowDate() };
  const activeStates = {
    orderStatus: { $ne: "cancelled" },
    paymentStatus: { $ne: "failed" },
  };

  if (userId) {
    return Order.findOne({
      user: userId,
      attemptFingerprint: fingerprint,
      createdAt,
      ...activeStates,
    }).sort({ createdAt: -1 });
  }

  const emailConditions = [];
  const normalizedGuestEmail = String(guestEmail || "").trim().toLowerCase();
  const normalizedShippingEmail = String(shippingEmail || "").trim().toLowerCase();
  if (normalizedGuestEmail) emailConditions.push({ guestEmail: normalizedGuestEmail });
  if (normalizedShippingEmail) emailConditions.push({ shippingEmail: normalizedShippingEmail });
  if (!emailConditions.length) return null;

  return Order.findOne({
    attemptFingerprint: fingerprint,
    createdAt,
    ...activeStates,
    $or: emailConditions,
  }).sort({ createdAt: -1 });
}

async function applyDiscount(codeRaw, total, userId, session) {
  const code = String(codeRaw || "").trim().toUpperCase();
  if (!code) return { total, discount: null };

  const finder = DiscountCode.findOne({ code, used: false });
  const doc = session ? await finder.session(session) : await finder;

  if (!doc) {
    // Discount codes should never block order placement.
    return { total, discount: null };
  }

  const percent = doc.percent || 0;
  const discountAmount = (total * percent) / 100;
  const newTotal = Math.max(0, total - discountAmount);

  return {
    total: newTotal,
    discount: { code: doc.code, percent, amount: discountAmount, _id: doc._id, userId },
  };
}

async function consumeDiscountCode(discount, userId, orderId) {
  if (!discount?._id) return true;
  const updateDoc = {
    $set: {
      used: true,
      usedAt: new Date(),
      usedBy: userId || undefined,
    },
  };
  if (orderId) {
    updateDoc.$set.order = orderId;
  }
  const result = await DiscountCode.updateOne(
    { _id: discount._id, used: false },
    updateDoc
  );
  return Number(result?.modifiedCount || 0) > 0;
}

async function releaseDiscountCode(discount) {
  if (!discount?._id) return;
  await DiscountCode.updateOne(
    { _id: discount._id },
    { $set: { used: false }, $unset: { usedAt: 1, usedBy: 1, order: 1 } }
  );
}

async function removePaymentProofFile(rawUrl) {
  try {
    await deleteStoredMedia(rawUrl);
  } catch (err) {
    console.warn("Payment proof file cleanup skipped:", err?.message || err);
  }
}

function normalizeAffiliateCode(raw) {
  return String(raw || "").trim().toUpperCase();
}

async function findAffiliateByCodeFlexible(code, session = null) {
  const normalized = normalizeAffiliateCode(code);
  if (!normalized) return null;
  const query = Affiliate.findOne({
    isActive: true,
    $or: [{ code: normalized }, { affiliateCode: normalized }, { affiliate_code: normalized }],
  });
  return session ? query.session(session) : query;
}

async function findAffiliateByCodeAnyStatus(code, session = null) {
  const normalized = normalizeAffiliateCode(code);
  if (!normalized) return null;
  const query = Affiliate.findOne({
    $or: [{ code: normalized }, { affiliateCode: normalized }, { affiliate_code: normalized }],
  });
  return session ? query.session(session) : query;
}

function normalizeOrderStatus(order) {
  if (!order) return "pending";
  if (order.orderStatus === "cancelled" || order.paymentStatus === "failed") {
    return "cancelled";
  }
  if (order.orderStatus === "delivered" || order.isDelivered === true) {
    return "earned";
  }
  return "pending";
}

function pickOrderCustomer(order) {
  return {
    name: String(order.shippingName || order.guestName || "").trim(),
    email: String(order.shippingEmail || order.guestEmail || "").trim(),
  };
}

function buildOrderItemsForEmail(order) {
  const items = Array.isArray(order?.orderItems) ? order.orderItems : [];
  return items.map((item) => {
    const qty = Number(item?.qty || item?.quantity || 0);
    const price = Number(item?.price || 0);
    const productName =
      String(item?.name || "").trim() ||
      String(item?.product?.name || "").trim() ||
      String(item?.product || "").trim() ||
      "Product";
    return {
      qty,
      quantity: qty,
      price,
      name: productName,
      product: item?.product?._id || item?.product,
    };
  });
}

async function sendOrderEmailsBestEffort(order) {
  if (!order) return;
  const customer = pickOrderCustomer(order);
  const orderDetails = {
    id: String(order._id || ""),
    createdAt: order.createdAt || new Date(),
    customerName: customer.name || "Customer",
    customerEmail: customer.email || "",
    mobileNumber: String(order.mobileNumber || "").trim(),
    deliveryAddress: String(order.shippingAddress || order.guestAddress || "").trim(),
    deliveryRegion: String(order.deliveryRegion || order.shippingCity || order.guestCity || "").trim(),
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    guestNotes: String(order.guestNotes || "").trim(),
    paymentScreenshotUrl: String(order.paymentScreenshotUrl || "").trim(),
    totalPrice: Number(order.totalPrice || 0),
    orderItems: buildOrderItemsForEmail(order),
  };

  try {
    if (ADMIN_EMAIL) {
      await sendOrderNotification(ADMIN_EMAIL, orderDetails);
    }
    if (customer.email) {
      await sendOrderConfirmation(customer.email, orderDetails);
    }
  } catch (err) {
    console.warn("Backend order email send skipped:", err?.message || err);
  }
}

async function resolveAffiliateByCode(codeRaw, buyerUserId, session) {
  const code = normalizeAffiliateCode(codeRaw);
  if (!code) return null;

  try {
    const affiliate = await findAffiliateByCodeFlexible(code, session);

    // Affiliate code must never block checkout; ignore invalid/inactive codes.
    if (!affiliate) return null;

    // Prevent self-referral but continue order creation.
    if (buyerUserId && String(affiliate.user) === String(buyerUserId)) {
      return null;
    }

    return affiliate;
  } catch (err) {
    // Defensive fallback: never fail order flow because of affiliate lookup.
    console.warn("Affiliate lookup skipped:", err?.message || err);
    return null;
  }
}

async function reconcileAffiliateOnOrder(order) {
  if (!order) return order;
  let affiliate = null;

  if (order.affiliate) {
    affiliate = await Affiliate.findById(order.affiliate);
  }

  if (!affiliate) {
    const candidateCode = normalizeAffiliateCode(order.affiliateCode || order.affiliateCodeEntered);
    if (candidateCode) {
      affiliate = await resolveAffiliateByCode(candidateCode, order.user || null);
      if (!affiliate) {
        // Recovery path for historical orders that were created while code was valid.
        affiliate = await findAffiliateByCodeAnyStatus(candidateCode);
      }
    }
  }

  if (!affiliate) return order;

  const commissionRate = Number(
    order.affiliateCommissionRate > 0 ? order.affiliateCommissionRate : affiliate.commissionRate || 5
  );
  const commissionAmount = Number(
    ((Number(order.totalPrice || 0) * commissionRate) / 100).toFixed(2)
  );

  let changed = false;
  if (!order.affiliate || String(order.affiliate) !== String(affiliate._id)) {
    order.affiliate = affiliate._id;
    changed = true;
  }
  if (!normalizeAffiliateCode(order.affiliateCode)) {
    order.affiliateCode = affiliate.code;
    changed = true;
  }
  if (Number(order.affiliateCommissionRate || 0) <= 0) {
    order.affiliateCommissionRate = commissionRate;
    changed = true;
  }
  if (Number(order.affiliateCommissionAmount || 0) <= 0 && Number(order.totalPrice || 0) > 0) {
    order.affiliateCommissionAmount = commissionAmount;
    changed = true;
  }

  if (changed) {
    await order.save();
  }
  return order;
}

async function ensureReferralSyncedForOrder(order) {
  let current = order;
  if (!current) return null;
  current = await reconcileAffiliateOnOrder(current);
  if (current.affiliate) {
    await upsertReferralForOrder(current);
  }
  return current;
}

async function upsertReferralForOrder(order, session = null) {
  if (!order) return null;

  let affiliate = null;
  if (order.affiliate) {
    affiliate = await Affiliate.findById(order.affiliate);
  }

  if (!affiliate) {
    const fallbackCode = normalizeAffiliateCode(order.affiliateCode || order.affiliateCodeEntered);
    if (fallbackCode) {
      affiliate = await findAffiliateByCodeAnyStatus(fallbackCode, session);
      if (affiliate) {
        order.affiliate = affiliate._id;
      }
    }
  }

  if (!affiliate) return null;

  const resolvedCode = normalizeAffiliateCode(order.affiliateCode) || normalizeAffiliateCode(affiliate.code);
  const resolvedRate = Number(order.affiliateCommissionRate || affiliate.commissionRate || 5);
  const resolvedAmount = Number(
    (
      Number(order.affiliateCommissionAmount || 0) > 0
        ? Number(order.affiliateCommissionAmount || 0)
        : (Number(order.totalPrice || 0) * resolvedRate) / 100
    ).toFixed(2)
  );

  let orderChanged = false;
  if (!normalizeAffiliateCode(order.affiliateCode) && resolvedCode) {
    order.affiliateCode = resolvedCode;
    orderChanged = true;
  }
  if (Number(order.affiliateCommissionRate || 0) <= 0 && resolvedRate > 0) {
    order.affiliateCommissionRate = resolvedRate;
    orderChanged = true;
  }
  if (Number(order.affiliateCommissionAmount || 0) <= 0 && resolvedAmount >= 0) {
    order.affiliateCommissionAmount = resolvedAmount;
    orderChanged = true;
  }
  if (orderChanged) {
    await order.save();
  }

  const status = normalizeOrderStatus(order);
  const base = {
    affiliate: affiliate._id,
    order: order._id,
    affiliateCode: resolvedCode,
    commissionRate: resolvedRate,
    orderAmount: Number(order.totalPrice || 0),
    commissionAmount: resolvedAmount,
    status,
    customerName: pickOrderCustomer(order).name,
    customerEmail: pickOrderCustomer(order).email,
    paidAt: status === "earned" ? new Date() : null,
    cancelledAt: status === "cancelled" ? new Date() : null,
  };

  const update = {
    $set: {
      affiliate: base.affiliate,
      affiliateCode: base.affiliateCode,
      commissionRate: base.commissionRate,
      orderAmount: base.orderAmount,
      commissionAmount: base.commissionAmount,
      status: base.status,
      customerName: base.customerName,
      customerEmail: base.customerEmail,
      paidAt: base.paidAt,
      cancelledAt: base.cancelledAt,
    },
    $setOnInsert: {
      order: base.order,
    },
  };

  const op = Referral.findOneAndUpdate({ order: order._id }, update, {
    upsert: true,
    new: true,
  });

  return session ? op.session(session) : op;
}

// Create new order (authenticated)
export async function createOrder(req, res) {
  let payload = req.body;
  try {
    payload = req.body?.order ? JSON.parse(req.body.order) : req.body;
  } catch {
    await writeOrderAttemptLog({
      req,
      user: req.user,
      scope: "authenticated",
      stage: "failed",
      outcome: "invalid_payload",
      reason: "Invalid order payload",
    });
    res.status(400);
    throw new Error("Invalid order payload");
  }

  const { error } = createOrderSchema.validate(payload);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const {
    orderItems,
    paymentMethod,
    paymentFlow,
    deliveryRegion,
    mobileNumber,
    shippingName,
    shippingEmail,
    shippingAddress,
    shippingCity,
    clientOrderRef,
    frontendOrigin,
    paymentScreenshotUrl,
    discountCode,
    affiliateCode,
  } = payload;
  const submittedAffiliateCode = normalizeAffiliateCode(affiliateCode);

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }
  if (!deliveryRegion) {
    res.status(400);
    throw new Error("Delivery region is required");
  }
  if (!paymentMethod) {
    res.status(400);
    throw new Error("Payment method is required");
  }
  if (!mobileNumber) {
    res.status(400);
    throw new Error("Mobile number is required");
  }
  const screenshotUrl = String(paymentScreenshotUrl || "").trim();
  const requestedFlow = String(paymentFlow || "").toLowerCase().trim();
  const normalizedPaymentFlow =
    paymentMethod === "hubtel" &&
    (requestedFlow === "auto" || (!requestedFlow && !screenshotUrl))
      ? "auto"
      : "manual";

  if (normalizedPaymentFlow !== "auto" && !screenshotUrl) {
    res.status(400);
    throw new Error("Payment screenshot is required");
  }

  const cleanMobile = normalizeGhanaMobile(mobileNumber);
  if (!/^(\+233|0)[0-9]{9}$/.test(cleanMobile)) {
    res.status(400);
    throw new Error("Invalid mobile number. Use 0XXXXXXXXX or +233XXXXXXXXX format.");
  }
  const trimmedOrderRef = String(clientOrderRef || "").trim();
  const resolvedClientOrderRef =
    normalizedPaymentFlow === "auto"
      ? toHubtelClientReference(trimmedOrderRef)
      : trimmedOrderRef || undefined;
  const attemptFingerprint = buildOrderAttemptFingerprint({
    userId: req.user?._id,
    shippingEmail,
    mobileNumber: cleanMobile,
    paymentMethod,
    paymentFlow: normalizedPaymentFlow,
    orderItems,
  });

  await writeOrderAttemptLog({
    req,
    user: req.user,
    scope: "authenticated",
    stage: "received",
    outcome: "accepted",
    clientOrderRef: resolvedClientOrderRef || trimmedOrderRef,
    attemptFingerprint,
    paymentMethod,
    paymentFlow: normalizedPaymentFlow,
    itemCount: countOrderItems(orderItems),
    shippingEmail,
    mobileNumber: cleanMobile,
    metadata: {
      hasPaymentScreenshot: Boolean(screenshotUrl),
      deliveryRegion: String(deliveryRegion || "").trim(),
    },
  });

  if (trimmedOrderRef) {
    const existingOrder = await Order.findOne({
      user: req.user._id,
      clientOrderRef: resolvedClientOrderRef || trimmedOrderRef,
    }).sort({ createdAt: -1 });
    if (existingOrder) {
      await writeOrderAttemptLog({
        req,
        order: existingOrder,
        user: req.user,
        scope: "authenticated",
        stage: "duplicate_returned",
        outcome: "existing_order_returned",
        clientOrderRef: trimmedOrderRef,
        attemptFingerprint,
        paymentMethod,
        paymentFlow: normalizedPaymentFlow,
        itemCount: countOrderItems(orderItems),
        totalPrice: Number(existingOrder.totalPrice || 0),
        shippingEmail,
        mobileNumber: cleanMobile,
        reason: "Repeated clientOrderRef for authenticated checkout",
      });
      return res.status(200).json({
        message: "Order already submitted",
        order: existingOrder,
        orderId: existingOrder._id,
        checkoutUrl: existingOrder.paymentGatewayCheckoutUrl || undefined,
      });
    }
  }

  const existingFingerprintOrder = await findRecentDuplicateOrder({
    userId: req.user._id,
    shippingEmail,
    attemptFingerprint,
  });
  if (existingFingerprintOrder) {
    await writeOrderAttemptLog({
      req,
      order: existingFingerprintOrder,
      user: req.user,
      scope: "authenticated",
      stage: "duplicate_returned",
      outcome: "fingerprint_duplicate",
      clientOrderRef: existingFingerprintOrder.clientOrderRef,
      attemptFingerprint,
      paymentMethod,
      paymentFlow: normalizedPaymentFlow,
      itemCount: countOrderItems(orderItems),
      totalPrice: Number(existingFingerprintOrder.totalPrice || 0),
      shippingEmail,
      mobileNumber: cleanMobile,
      reason: "Recent matching checkout fingerprint returned existing order",
    });
    return res.status(200).json({
      message: "Order already submitted",
      order: existingFingerprintOrder,
      orderId: existingFingerprintOrder._id,
      checkoutUrl: existingFingerprintOrder.paymentGatewayCheckoutUrl || undefined,
    });
  }

  let reservedStock = [];
  let usedDiscount = null;
  try {
    const { total, processedItems } = await processOrderItems(orderItems);
    const discounted = await applyDiscount(discountCode, total, req.user?._id);
    const affiliate = await resolveAffiliateByCode(affiliateCode, req.user?._id);
    const commissionRate = Number(affiliate?.commissionRate || 5);
    const commissionAmount = affiliate
      ? Number(((discounted.total * commissionRate) / 100).toFixed(2))
      : 0;

    const stockAdjustments = processedItems.map((item) => ({
      productId: item.product,
      qty: Number(item.qty || 0),
    }));
    reservedStock = await reserveStockAdjustments(stockAdjustments);

    if (discounted.discount) {
      const consumed = await consumeDiscountCode(discounted.discount, req.user?._id, null);
      if (!consumed) {
        throw new Error("Discount code is no longer available");
      }
      usedDiscount = discounted.discount;
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems: processedItems,
      paymentMethod,
      paymentFlow: normalizedPaymentFlow,
      deliveryRegion,
      mobileNumber: cleanMobile,
      paymentMobileNumber:
        normalizedPaymentFlow === "auto" ? cleanMobile : undefined,
      shippingName,
      shippingEmail,
      shippingAddress,
      shippingCity,
      clientOrderRef: resolvedClientOrderRef,
      attemptFingerprint,
      totalPrice: discounted.total,
      paymentStatus: "pending",
      orderStatus: "pending",
      isDelivered: false,
      stockReserved: true,
      discountCode: discounted.discount?.code,
      discountPercent: discounted.discount?.percent,
      discountAmount: discounted.discount?.amount || 0,
      affiliateCodeEntered: submittedAffiliateCode || undefined,
      affiliateCode: affiliate?.code,
      affiliate: affiliate?._id,
      affiliateCommissionRate: affiliate ? commissionRate : 0,
      affiliateCommissionAmount: commissionAmount,
      paymentScreenshotUrl: normalizedPaymentFlow === "manual" ? screenshotUrl : "",
    });

    await writeOrderAttemptLog({
      req,
      order,
      user: req.user,
      scope: "authenticated",
      stage: "created",
      outcome: "order_created",
      clientOrderRef: order.clientOrderRef,
      attemptFingerprint,
      paymentMethod,
      paymentFlow: normalizedPaymentFlow,
      itemCount: countOrderItems(orderItems),
      totalPrice: Number(order.totalPrice || 0),
      shippingEmail: order.shippingEmail,
      mobileNumber: order.mobileNumber,
    });

    if (normalizedPaymentFlow === "auto") {
      if (Number(discounted.total || 0) <= 0) {
        throw new Error("Order total must be greater than zero for Hubtel automatic checkout.");
      }
      const clientReference = toHubtelClientReference(order.clientOrderRef || `ord_${order._id}`);
      const statusToken = buildHubtelStatusToken(clientReference);
      const backendBase = resolvePublicBaseUrlFromRequest(req);
      const frontendBase = resolveFrontendBaseUrl(frontendOrigin, req);
      const hubtel = await initiateHubtelCheckout({
        amount: discounted.total,
        description: `DEETECH Order ${order._id}`,
        clientReference,
        callbackUrl: buildHubtelCallbackUrl(`${backendBase}/api/orders/hubtel/callback`),
        returnUrl: buildHubtelResultUrl(`${frontendBase}/payment/success`, clientReference, statusToken),
        cancellationUrl: buildHubtelResultUrl(
          `${frontendBase}/payment/cancelled`,
          clientReference,
          statusToken
        ),
      });

      const checkoutUrl = getHubtelCheckoutUrl(hubtel);
      if (!checkoutUrl) {
        throw new Error("Hubtel did not return a checkout URL");
      }

      order.paymentGateway = "hubtel";
      order.paymentGatewayReference =
        String(hubtel?.data?.checkoutId || hubtel?.data?.transactionId || "").trim() || undefined;
      order.paymentGatewayCheckoutUrl = checkoutUrl;
      order.paymentGatewayStatus = "initiated";
      order.paymentGatewayPayload = hubtel;
      await order.save();

      await writeOrderAttemptLog({
        req,
        order,
        user: req.user,
        scope: "authenticated",
        stage: "gateway_initiated",
        outcome: "hubtel_checkout_ready",
        clientOrderRef: order.clientOrderRef,
        attemptFingerprint,
        paymentMethod,
        paymentFlow: normalizedPaymentFlow,
        itemCount: countOrderItems(orderItems),
        totalPrice: Number(order.totalPrice || 0),
        shippingEmail: order.shippingEmail,
        mobileNumber: order.mobileNumber,
        metadata: {
          gatewayReference: order.paymentGatewayReference,
        },
      });
    }

    if (usedDiscount) {
      await DiscountCode.updateOne(
        { _id: usedDiscount._id },
        { $set: { order: order._id } }
      );
    }
    try {
      await ensureReferralSyncedForOrder(order);
    } catch (referralError) {
      console.warn("Referral sync skipped:", referralError?.message || referralError);
    }

    if (normalizedPaymentFlow !== "auto") {
      try {
        const orderForEmail = await Order.findById(order._id).populate("orderItems.product", "name");
        await sendOrderEmailsBestEffort(orderForEmail || order);
      } catch (emailError) {
        console.warn("Order email dispatch skipped:", emailError?.message || emailError);
      }
    }

    return res.status(201).json({
      message: "Order created successfully",
      order,
      orderId: order?._id,
      paymentFlow: normalizedPaymentFlow,
      statusToken:
        normalizedPaymentFlow === "auto"
          ? buildHubtelStatusToken(order.clientOrderRef)
          : undefined,
      checkoutUrl: order.paymentGatewayCheckoutUrl || undefined,
    });
  } catch (err) {
    if (err?.code === 11000 && trimmedOrderRef) {
      const existingOrder = await Order.findOne({
        user: req.user._id,
        clientOrderRef: resolvedClientOrderRef || trimmedOrderRef,
      }).sort({ createdAt: -1 });
      if (existingOrder) {
        await writeOrderAttemptLog({
          req,
          order: existingOrder,
          user: req.user,
          scope: "authenticated",
          stage: "duplicate_returned",
          outcome: "unique_index_duplicate",
          clientOrderRef: trimmedOrderRef,
          attemptFingerprint,
          paymentMethod,
          paymentFlow: normalizedPaymentFlow,
          itemCount: countOrderItems(orderItems),
          totalPrice: Number(existingOrder.totalPrice || 0),
          shippingEmail,
          mobileNumber: cleanMobile,
          reason: "Duplicate clientOrderRef caught by unique index",
        });
        return res.status(200).json({
          message: "Order already submitted",
          order: existingOrder,
          orderId: existingOrder._id,
          checkoutUrl: existingOrder.paymentGatewayCheckoutUrl || undefined,
        });
      }
    }
    await writeOrderAttemptLog({
      req,
      user: req.user,
      scope: "authenticated",
      stage: "failed",
      outcome: "order_rejected",
      clientOrderRef: resolvedClientOrderRef || trimmedOrderRef,
      attemptFingerprint,
      paymentMethod,
      paymentFlow: normalizedPaymentFlow,
      itemCount: countOrderItems(orderItems),
      shippingEmail,
      mobileNumber: cleanMobile,
      reason: err?.message || "Order creation failed",
    });
    if (reservedStock.length) {
      await rollbackStockAdjustments(reservedStock);
    }
    if (usedDiscount) {
      await releaseDiscountCode(usedDiscount);
    }
    const statusCode =
      Number(err?.statusCode || 0) ||
      (res.statusCode >= 400 ? Number(res.statusCode) : 0) ||
      400;
    res.status(statusCode);
    throw new Error(err.message);
  }
}

// Create guest order (multipart)
export async function createGuestOrder(req, res) {
  let payload = {};
  try {
    payload = req.body.order ? JSON.parse(req.body.order) : req.body;
  } catch {
    await writeOrderAttemptLog({
      req,
      scope: "guest",
      stage: "failed",
      outcome: "invalid_payload",
      reason: "Invalid guest order payload",
    });
    res.status(400);
    throw new Error("Invalid order payload");
  }

  const { error } = createGuestOrderSchema.validate(payload);
  if (error) {
    res.status(400);
    throw new Error(error.details[0].message);
  }

  const {
    orderItems,
    paymentMethod,
    paymentFlow,
    deliveryRegion,
    mobileNumber,
    shippingName,
    shippingEmail,
    shippingAddress,
    shippingCity,
    guestName,
    guestEmail,
    guestAddress,
    guestCity,
    guestNotes,
    clientOrderRef,
    frontendOrigin,
    paymentScreenshotUrl,
    discountCode,
    affiliateCode,
  } = payload;
  const submittedAffiliateCode = normalizeAffiliateCode(affiliateCode);
  const trimmedOrderRef = String(clientOrderRef || "").trim();

  const screenshotUrl = String(paymentScreenshotUrl || "").trim();
  const requestedFlow = String(paymentFlow || "").toLowerCase().trim();
  const normalizedPaymentFlow =
    paymentMethod === "hubtel" &&
    (requestedFlow === "auto" || (!requestedFlow && !screenshotUrl))
      ? "auto"
      : "manual";
  const cleanMobile = normalizeGhanaMobile(mobileNumber);
  if (!/^(\+233|0)[0-9]{9}$/.test(cleanMobile)) {
    res.status(400);
    throw new Error("Invalid mobile number. Use 0XXXXXXXXX or +233XXXXXXXXX format.");
  }
  const resolvedClientOrderRef =
    normalizedPaymentFlow === "auto"
      ? toHubtelClientReference(trimmedOrderRef)
      : trimmedOrderRef || undefined;
  const attemptFingerprint = buildOrderAttemptFingerprint({
    guestEmail,
    shippingEmail,
    mobileNumber: cleanMobile,
    paymentMethod,
    paymentFlow: normalizedPaymentFlow,
    orderItems,
  });

  if (normalizedPaymentFlow !== "auto" && !screenshotUrl) {
    res.status(400);
    throw new Error("Payment screenshot is required");
  }

  if (trimmedOrderRef) {
    const existingGuestOrder = await Order.findOne({
      clientOrderRef: resolvedClientOrderRef || trimmedOrderRef,
      $or: [
        { guestEmail: String(guestEmail || "").trim() },
        { shippingEmail: String(shippingEmail || "").trim() },
      ],
    }).sort({ createdAt: -1 });
    if (existingGuestOrder) {
      await writeOrderAttemptLog({
        req,
        order: existingGuestOrder,
        scope: "guest",
        stage: "duplicate_returned",
        outcome: "existing_order_returned",
        clientOrderRef: trimmedOrderRef,
        attemptFingerprint,
        paymentMethod,
        paymentFlow: normalizedPaymentFlow,
        itemCount: countOrderItems(orderItems),
        totalPrice: Number(existingGuestOrder.totalPrice || 0),
        shippingEmail,
        guestEmail,
        mobileNumber: cleanMobile,
        reason: "Repeated clientOrderRef for guest checkout",
      });
      return res.status(200).json({
        message: "Order already submitted",
        order: existingGuestOrder,
        orderId: existingGuestOrder._id,
        checkoutUrl: existingGuestOrder.paymentGatewayCheckoutUrl || undefined,
      });
    }
  }

  const existingGuestFingerprintOrder = await findRecentDuplicateOrder({
    shippingEmail,
    guestEmail,
    attemptFingerprint,
  });
  if (existingGuestFingerprintOrder) {
    await writeOrderAttemptLog({
      req,
      order: existingGuestFingerprintOrder,
      scope: "guest",
      stage: "duplicate_returned",
      outcome: "fingerprint_duplicate",
      clientOrderRef: existingGuestFingerprintOrder.clientOrderRef,
      attemptFingerprint,
      paymentMethod,
      paymentFlow: normalizedPaymentFlow,
      itemCount: countOrderItems(orderItems),
      totalPrice: Number(existingGuestFingerprintOrder.totalPrice || 0),
      shippingEmail,
      guestEmail,
      mobileNumber: cleanMobile,
      reason: "Recent matching guest checkout fingerprint returned existing order",
    });
    return res.status(200).json({
      message: "Order already submitted",
      order: existingGuestFingerprintOrder,
      orderId: existingGuestFingerprintOrder._id,
      checkoutUrl: existingGuestFingerprintOrder.paymentGatewayCheckoutUrl || undefined,
    });
  }

  let reservedStock = [];
  let usedDiscount = null;
  try {
    await writeOrderAttemptLog({
      req,
      scope: "guest",
      stage: "received",
      outcome: "accepted",
      clientOrderRef: resolvedClientOrderRef || trimmedOrderRef,
      attemptFingerprint,
      paymentMethod,
      paymentFlow: normalizedPaymentFlow,
      itemCount: countOrderItems(orderItems),
      shippingEmail,
      guestEmail,
      mobileNumber: cleanMobile,
      metadata: {
        hasPaymentScreenshot: Boolean(screenshotUrl),
        deliveryRegion: String(deliveryRegion || "").trim(),
      },
    });

    const { total, processedItems } = await processOrderItems(orderItems);
    const discounted = await applyDiscount(discountCode, total, null);
    const affiliate = await resolveAffiliateByCode(affiliateCode, null);
    const commissionRate = Number(affiliate?.commissionRate || 5);
    const commissionAmount = affiliate
      ? Number(((discounted.total * commissionRate) / 100).toFixed(2))
      : 0;

    const stockAdjustments = processedItems.map((item) => ({
      productId: item.product,
      qty: Number(item.qty || 0),
    }));
    reservedStock = await reserveStockAdjustments(stockAdjustments);

    if (discounted.discount) {
      const consumed = await consumeDiscountCode(discounted.discount, null, null);
      if (!consumed) {
        throw new Error("Discount code is no longer available");
      }
      usedDiscount = discounted.discount;
    }

    const order = await Order.create({
      user: null,
      orderItems: processedItems,
      paymentMethod,
      paymentFlow: normalizedPaymentFlow,
      deliveryRegion,
      mobileNumber: cleanMobile,
      paymentMobileNumber:
        normalizedPaymentFlow === "auto" ? cleanMobile : undefined,
      shippingName: shippingName || guestName,
      shippingEmail: shippingEmail || guestEmail,
      shippingAddress: shippingAddress || guestAddress,
      shippingCity: shippingCity || guestCity,
      clientOrderRef: resolvedClientOrderRef,
      attemptFingerprint,
      totalPrice: discounted.total,
      paymentStatus: "pending",
      orderStatus: "pending",
      isDelivered: false,
      stockReserved: true,
      discountCode: discounted.discount?.code,
      discountPercent: discounted.discount?.percent,
      discountAmount: discounted.discount?.amount || 0,
      affiliateCodeEntered: submittedAffiliateCode || undefined,
      affiliateCode: affiliate?.code,
      affiliate: affiliate?._id,
      affiliateCommissionRate: affiliate ? commissionRate : 0,
      affiliateCommissionAmount: commissionAmount,
      guestName,
      guestEmail,
      guestAddress,
      guestCity,
      guestNotes,
      paymentScreenshotUrl: normalizedPaymentFlow === "manual" ? screenshotUrl : "",
    });

    await writeOrderAttemptLog({
      req,
      order,
      scope: "guest",
      stage: "created",
      outcome: "order_created",
      clientOrderRef: order.clientOrderRef,
      attemptFingerprint,
      paymentMethod,
      paymentFlow: normalizedPaymentFlow,
      itemCount: countOrderItems(orderItems),
      totalPrice: Number(order.totalPrice || 0),
      shippingEmail: order.shippingEmail,
      guestEmail: order.guestEmail,
      mobileNumber: order.mobileNumber,
    });

    if (normalizedPaymentFlow === "auto") {
      if (Number(discounted.total || 0) <= 0) {
        throw new Error("Order total must be greater than zero for Hubtel automatic checkout.");
      }
      const clientReference = toHubtelClientReference(order.clientOrderRef || `ord_${order._id}`);
      const statusToken = buildHubtelStatusToken(clientReference);
      const backendBase = resolvePublicBaseUrlFromRequest(req);
      const frontendBase = resolveFrontendBaseUrl(frontendOrigin, req);
      const hubtel = await initiateHubtelCheckout({
        amount: discounted.total,
        description: `DEETECH Guest Order ${order._id}`,
        clientReference,
        callbackUrl: buildHubtelCallbackUrl(`${backendBase}/api/orders/hubtel/callback`),
        returnUrl: buildHubtelResultUrl(`${frontendBase}/payment/success`, clientReference, statusToken),
        cancellationUrl: buildHubtelResultUrl(
          `${frontendBase}/payment/cancelled`,
          clientReference,
          statusToken
        ),
      });

      const checkoutUrl = getHubtelCheckoutUrl(hubtel);
      if (!checkoutUrl) {
        throw new Error("Hubtel did not return a checkout URL");
      }

      order.paymentGateway = "hubtel";
      order.paymentGatewayReference =
        String(hubtel?.data?.checkoutId || hubtel?.data?.transactionId || "").trim() || undefined;
      order.paymentGatewayCheckoutUrl = checkoutUrl;
      order.paymentGatewayStatus = "initiated";
      order.paymentGatewayPayload = hubtel;
      await order.save();

      await writeOrderAttemptLog({
        req,
        order,
        scope: "guest",
        stage: "gateway_initiated",
        outcome: "hubtel_checkout_ready",
        clientOrderRef: order.clientOrderRef,
        attemptFingerprint,
        paymentMethod,
        paymentFlow: normalizedPaymentFlow,
        itemCount: countOrderItems(orderItems),
        totalPrice: Number(order.totalPrice || 0),
        shippingEmail: order.shippingEmail,
        guestEmail: order.guestEmail,
        mobileNumber: order.mobileNumber,
        metadata: {
          gatewayReference: order.paymentGatewayReference,
        },
      });
    }

    if (usedDiscount) {
      await DiscountCode.updateOne(
        { _id: usedDiscount._id },
        { $set: { order: order._id } }
      );
    }
    try {
      await ensureReferralSyncedForOrder(order);
    } catch (referralError) {
      console.warn("Referral sync skipped:", referralError?.message || referralError);
    }

    if (normalizedPaymentFlow !== "auto") {
      try {
        const orderForEmail = await Order.findById(order._id).populate("orderItems.product", "name");
        await sendOrderEmailsBestEffort(orderForEmail || order);
      } catch (emailError) {
        console.warn("Order email dispatch skipped:", emailError?.message || emailError);
      }
    }

    return res.status(201).json({
      message: "Order created successfully",
      order,
      orderId: order?._id,
      paymentFlow: normalizedPaymentFlow,
      statusToken:
        normalizedPaymentFlow === "auto"
          ? buildHubtelStatusToken(order.clientOrderRef)
          : undefined,
      checkoutUrl: order.paymentGatewayCheckoutUrl || undefined,
    });
  } catch (err) {
    if (err?.code === 11000 && trimmedOrderRef) {
      const existingGuestOrder = await Order.findOne({
        clientOrderRef: resolvedClientOrderRef || trimmedOrderRef,
      }).sort({ createdAt: -1 });
      if (existingGuestOrder) {
        await writeOrderAttemptLog({
          req,
          order: existingGuestOrder,
          scope: "guest",
          stage: "duplicate_returned",
          outcome: "unique_index_duplicate",
          clientOrderRef: trimmedOrderRef,
          attemptFingerprint,
          paymentMethod,
          paymentFlow: normalizedPaymentFlow,
          itemCount: countOrderItems(orderItems),
          totalPrice: Number(existingGuestOrder.totalPrice || 0),
          shippingEmail,
          guestEmail,
          mobileNumber: cleanMobile,
          reason: "Duplicate clientOrderRef caught by unique index",
        });
        return res.status(200).json({
          message: "Order already submitted",
          order: existingGuestOrder,
          orderId: existingGuestOrder._id,
          checkoutUrl: existingGuestOrder.paymentGatewayCheckoutUrl || undefined,
        });
      }
    }
    await writeOrderAttemptLog({
      req,
      scope: "guest",
      stage: "failed",
      outcome: "order_rejected",
      clientOrderRef: resolvedClientOrderRef || trimmedOrderRef,
      attemptFingerprint,
      paymentMethod,
      paymentFlow: normalizedPaymentFlow,
      itemCount: countOrderItems(orderItems),
      shippingEmail,
      guestEmail,
      mobileNumber: cleanMobile,
      reason: err?.message || "Guest order creation failed",
    });
    if (reservedStock.length) {
      await rollbackStockAdjustments(reservedStock);
    }
    if (usedDiscount) {
      await releaseDiscountCode(usedDiscount);
    }
    const statusCode =
      Number(err?.statusCode || 0) ||
      (res.statusCode >= 400 ? Number(res.statusCode) : 0) ||
      400;
    res.status(statusCode);
    throw new Error(err.message);
  }
}

// Hubtel callback (public)
export async function handleHubtelCallback(req, res) {
  const callbackToken = String(req.query?.token || "").trim();
  if (!timingSafeEqualText(callbackToken, HUBTEL_CALLBACK_TOKEN)) {
    return res.status(401).json({ ok: false, message: "Unauthorized callback." });
  }

  const payload = req.body || {};
  const rawData = payload?.Data && typeof payload.Data === "object" ? payload.Data : {};
  const clientReference = String(
    payload?.ClientReference ||
      rawData?.ClientReference ||
      rawData?.clientReference ||
      rawData?.CheckoutId ||
      ""
  ).trim();

  if (!clientReference) {
    await writeOrderAttemptLog({
      req,
      scope: "system",
      stage: "callback",
      outcome: "ignored_missing_reference",
      reason: "Hubtel callback received without client reference",
    });
    return res.status(200).json({ ok: true, ignored: true });
  }

  const order = await Order.findOne({ clientOrderRef: clientReference }).sort({ createdAt: -1 });
  if (!order) {
    await writeOrderAttemptLog({
      req,
      scope: "system",
      stage: "callback",
      outcome: "ignored_missing_order",
      clientOrderRef: clientReference,
      reason: "Hubtel callback received for unknown order reference",
    });
    return res.status(200).json({ ok: true, ignored: true });
  }

  const responseCode = String(payload?.ResponseCode || "").trim();
  const statusText = String(rawData?.Status || payload?.Status || "").trim().toLowerCase();
  const wasPaidBefore = order.paymentStatus === "paid";
  const isSuccess = responseCode === "0000" && statusText === "success";

  order.paymentGateway = "hubtel";
  order.paymentGatewayStatus = statusText || responseCode || "unknown";
  order.paymentGatewayPayload = payload;

  if (isSuccess) {
    await ensureOrderStockReserved(order);
    order.paymentStatus = "paid";
    order.orderStatus = order.orderStatus === "pending" ? "processing" : order.orderStatus;
    if (!order.paidAt) order.paidAt = new Date();
    if (!order.estimatedDeliveryDate) {
      order.estimatedDeliveryDate = defaultEstimatedDeliveryFrom(order.paidAt);
    }
  } else if (statusText === "failed" || statusText === "cancelled" || responseCode === "1001") {
    await releaseOrderStockReservation(order);
    order.paymentStatus = "failed";
    order.orderStatus = "cancelled";
    order.isDelivered = false;
    order.deliveredAt = null;
  } else {
    order.paymentStatus = "pending";
  }

  await order.save();
  await writeOrderAttemptLog({
    req,
    order,
    user: order.user,
    scope: order.user ? "authenticated" : "guest",
    stage: "callback",
    outcome: isSuccess ? "paid" : order.paymentStatus,
    clientOrderRef: clientReference,
    paymentMethod: order.paymentMethod,
    paymentFlow: order.paymentFlow,
    itemCount: countOrderItems(order.orderItems),
    totalPrice: Number(order.totalPrice || 0),
    shippingEmail: order.shippingEmail,
    guestEmail: order.guestEmail,
    mobileNumber: order.mobileNumber,
    metadata: {
      gatewayStatus: order.paymentGatewayStatus,
    },
  });
  try {
    await ensureReferralSyncedForOrder(order);
  } catch (referralError) {
    console.warn("Referral sync skipped:", referralError?.message || referralError);
  }
  if (isSuccess && !wasPaidBefore) {
    try {
      const orderForEmail = await Order.findById(order._id).populate("orderItems.product", "name");
      await sendOrderEmailsBestEffort(orderForEmail || order);
    } catch (emailError) {
      console.warn("Order paid email dispatch skipped:", emailError?.message || emailError);
    }
  }

  return res.status(200).json({ ok: true });
}

// Hubtel status check (public by client order reference)
export async function getHubtelPaymentStatus(req, res) {
  const clientReference = String(req.params.clientReference || "").trim();
  const statusToken = String(req.query?.token || "").trim();
  if (!clientReference) {
    res.status(400);
    throw new Error("Client reference is required");
  }
  const expectedToken = buildHubtelStatusToken(clientReference);
  if (!timingSafeEqualText(statusToken, expectedToken)) {
    res.status(401);
    throw new Error("Unauthorized payment status request");
  }

  const order = await Order.findOne({ clientOrderRef: clientReference })
    .sort({ createdAt: -1 })
    .populate("orderItems.product", "name brand category images image");

  if (!order) {
    await writeOrderAttemptLog({
      req,
      scope: "system",
      stage: "status_check",
      outcome: "missing_order",
      clientOrderRef: clientReference,
      reason: "Hubtel status check requested for unknown order reference",
    });
    res.status(404);
    throw new Error("Order not found");
  }

  await writeOrderAttemptLog({
    req,
    order,
    user: order.user,
    scope: order.user ? "authenticated" : "guest",
    stage: "status_check",
    outcome: "status_returned",
    clientOrderRef: clientReference,
    paymentMethod: order.paymentMethod,
    paymentFlow: order.paymentFlow,
    itemCount: countOrderItems(order.orderItems),
    totalPrice: Number(order.totalPrice || 0),
    shippingEmail: order.shippingEmail,
    guestEmail: order.guestEmail,
    mobileNumber: order.mobileNumber,
  });

  return res.json({
    clientReference,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    paymentMethod: order.paymentMethod,
    paymentFlow: order.paymentFlow || "manual",
    order: {
      _id: order._id,
      createdAt: order.createdAt,
      paidAt: order.paidAt,
      totalPrice: order.totalPrice,
      discountCode: order.discountCode,
      discountPercent: order.discountPercent,
      discountAmount: order.discountAmount,
      shippingEmail: order.shippingEmail,
      guestEmail: order.guestEmail,
      mobileNumber: order.mobileNumber,
      shippingAddress: order.shippingAddress,
      guestAddress: order.guestAddress,
      shippingCity: order.shippingCity,
      guestCity: order.guestCity,
      paymentMethod: order.paymentMethod,
      orderItems: Array.isArray(order.orderItems)
        ? order.orderItems.map((item) => ({
            qty: item.qty,
            price: item.price,
            product: item.product
              ? {
                  name: item.product.name,
                  brand: item.product.brand,
                  category: item.product.category,
                  images: item.product.images,
                  image: item.product.image,
                }
              : null,
          }))
        : [],
    },
  });
}

// Get logged-in user's orders
export async function getMyOrders(req, res) {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate("orderItems.product", "name price brand category images image");
  res.json(orders);
}

// Get logged-in user's single order
export async function getMyOrderById(req, res) {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
    .populate("orderItems.product", "name price brand category images image");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json(order);
}

// Get all orders (admin only)
export async function getAllOrders(req, res) {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate("user", "name email")
    .populate("orderItems.product", "name price brand");
  res.json(orders);
}

export async function getRecentOrderAttempts(req, res) {
  const limit = Math.min(200, Math.max(1, Number(req.query?.limit || 50)));
  const clientOrderRef = String(req.query?.clientOrderRef || "").trim();
  const attemptFingerprint = String(req.query?.attemptFingerprint || "").trim();

  const query = {};
  if (clientOrderRef) query.clientOrderRef = clientOrderRef;
  if (attemptFingerprint) query.attemptFingerprint = attemptFingerprint;

  const attempts = await OrderAttemptLog.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("user", "name email")
    .populate("order", "_id paymentMethod paymentFlow paymentStatus orderStatus totalPrice createdAt");

  res.json(attempts);
}

// Mark order as paid (admin only)
export async function updateOrderToPaid(req, res) {
  let order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  await ensureOrderStockReserved(order);
  order.paymentStatus = "paid";
  order.paidAt = new Date();
  if (!order.estimatedDeliveryDate) {
    order.estimatedDeliveryDate = defaultEstimatedDeliveryFrom(order.paidAt);
  }

  await order.save();
  order = await ensureReferralSyncedForOrder(order);
  res.json(order);
}

// Mark order as delivered (admin only)
export async function updateOrderToDelivered(req, res) {
  let order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.isDelivered = true;
  order.deliveredAt = new Date();
  order.orderStatus = "delivered";

  await order.save();
  order = await ensureReferralSyncedForOrder(order);
  res.json(order);
}

// Update order status (admin only)
export async function updateOrderStatus(req, res) {
  const { status, estimatedDeliveryDate } = req.body;
  const allowed = ["pending", "processing", "shipped", "delivered", "cancelled"];
  const hasStatusUpdate = typeof status === "string" && status.trim().length > 0;
  if (hasStatusUpdate && !allowed.includes(status)) {
    res.status(400);
    throw new Error("Invalid order status");
  }

  let order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (hasStatusUpdate) {
    order.orderStatus = status;
    if (status === "pending") {
      order.paymentStatus = "pending";
    }
    if (["processing", "shipped", "delivered"].includes(status)) {
      await ensureOrderStockReserved(order);
      order.paymentStatus = "paid";
      if (!order.paidAt) order.paidAt = new Date();
      if (!order.estimatedDeliveryDate) {
        order.estimatedDeliveryDate = defaultEstimatedDeliveryFrom(order.paidAt);
      }
    }
    if (status === "cancelled") {
      await releaseOrderStockReservation(order);
      order.paymentStatus = "failed";
      order.isDelivered = false;
      order.deliveredAt = null;
    }
    if (status === "delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }
  }

  if (typeof estimatedDeliveryDate !== "undefined") {
    const parsedEstimate = parseEstimatedDeliveryInput(estimatedDeliveryDate);
    if (!parsedEstimate) {
      res.status(400);
      throw new Error("Invalid estimated delivery date");
    }
    order.estimatedDeliveryDate = parsedEstimate;
  }

  await order.save();
  order = await ensureReferralSyncedForOrder(order);
  res.json(order);
}

// Update payment status (admin only)
export async function updateOrderPaymentStatus(req, res) {
  const { paymentStatus, estimatedDeliveryDate } = req.body;
  const allowed = ["pending", "paid", "failed"];
  if (!allowed.includes(paymentStatus)) {
    res.status(400);
    throw new Error("Invalid payment status");
  }

  let order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.paymentStatus = paymentStatus;
  if (paymentStatus === "paid") {
    await ensureOrderStockReserved(order);
    if (!order.paidAt) order.paidAt = new Date();
    if (order.orderStatus === "pending") {
      order.orderStatus = "processing";
    }
    if (!order.estimatedDeliveryDate) {
      order.estimatedDeliveryDate = defaultEstimatedDeliveryFrom(order.paidAt);
    }
  }

  if (paymentStatus === "failed") {
    await releaseOrderStockReservation(order);
    order.orderStatus = "cancelled";
    order.isDelivered = false;
    order.deliveredAt = null;
  }

  if (paymentStatus === "pending") {
    order.paidAt = null;
    if (order.orderStatus === "delivered") {
      order.orderStatus = "processing";
      order.isDelivered = false;
      order.deliveredAt = null;
    }
  }

  if (typeof estimatedDeliveryDate !== "undefined") {
    const parsedEstimate = parseEstimatedDeliveryInput(estimatedDeliveryDate);
    if (!parsedEstimate) {
      res.status(400);
      throw new Error("Invalid estimated delivery date");
    }
    order.estimatedDeliveryDate = parsedEstimate;
  }

  await order.save();
  order = await ensureReferralSyncedForOrder(order);
  res.json(order);
}

// Delete order permanently (admin only)
export async function deleteOrder(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const orderId = order._id;
  const proofUrl = order.paymentScreenshotUrl;

  await releaseOrderStockReservation(order);

  // Remove linked referral history for this order only.
  await Referral.deleteOne({ order: orderId });

  // Release any discount code linked to this order so it can be reused.
  await DiscountCode.updateMany(
    { order: orderId },
    { $set: { used: false }, $unset: { usedAt: 1, usedBy: 1, order: 1 } }
  );

  await Order.deleteOne({ _id: orderId });
  await removePaymentProofFile(proofUrl);

  res.json({
    message: "Order deleted permanently",
    orderId,
  });
}

// Admin utility: reconcile affiliate links/referrals for existing orders
export async function resyncAffiliateReferrals(req, res) {
  const orders = await Order.find({
    $or: [
      { affiliate: { $exists: true, $ne: null } },
      { affiliateCode: { $exists: true, $ne: "" } },
      { affiliateCodeEntered: { $exists: true, $ne: "" } },
    ],
  }).sort({ createdAt: -1 });

  let scanned = 0;
  let linked = 0;
  let synced = 0;

  for (const order of orders) {
    scanned += 1;
    const beforeAffiliate = Boolean(order.affiliate);
    const updated = await ensureReferralSyncedForOrder(order);
    if (!beforeAffiliate && updated?.affiliate) linked += 1;
    if (updated?.affiliate) synced += 1;
  }

  return res.json({
    message: "Affiliate referral resync completed",
    scanned,
    linked,
    synced,
  });
}




