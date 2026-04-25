const API_BASE = (process.env.STAGING_API_BASE || "http://localhost:5000/api").replace(/\/+$/, "");
const FRONTEND_BASE = (process.env.STAGING_FRONTEND_BASE || "").replace(/\/+$/, "");

const USER_EMAIL = process.env.SMOKE_USER_EMAIL || "";
const USER_PASSWORD = process.env.SMOKE_USER_PASSWORD || "";
const ADMIN_EMAIL = process.env.SMOKE_ADMIN_EMAIL || "";
const ADMIN_PASSWORD = process.env.SMOKE_ADMIN_PASSWORD || "";

let failures = 0;
const REQUEST_TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS || 12000);

function pass(name, detail = "") {
  console.log(`PASS: ${name}${detail ? ` - ${detail}` : ""}`);
}

function fail(name, detail = "") {
  failures += 1;
  console.error(`FAIL: ${name}${detail ? ` - ${detail}` : ""}`);
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const url = `${API_BASE}${path}`;
  let res;
  try {
    res = await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    const cause = err?.cause?.message ? ` | cause: ${err.cause.message}` : "";
    throw new Error(`request failed: ${url} | ${err?.message || err}${cause}`);
  } finally {
    clearTimeout(timer);
  }
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { res, data };
}

async function loginOrRegisterUser() {
  const email = USER_EMAIL || `smoke_${Date.now()}@example.com`;
  const password = USER_PASSWORD || "SmokeTest!123";
  const name = "Smoke User";

  const login = await request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (login.res.ok && login.data?.token) {
    return { email, password, token: login.data.token, user: login.data };
  }

  const register = await request("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!register.res.ok || !register.data?.token) {
    throw new Error(`Unable to login/register smoke user (${email})`);
  }

  return { email, password, token: register.data.token, user: register.data };
}

async function loginAdminIfConfigured() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return null;
  const login = await request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!login.res.ok || !login.data?.token) {
    throw new Error("Admin login failed for smoke discount race");
  }
  return { token: login.data.token };
}

function buildAuthOrderPayload(productId, clientOrderRef, discountCode = "") {
  return {
    orderItems: [{ product: productId, qty: 1 }],
    paymentMethod: "mtn",
    deliveryRegion: "Greater Accra",
    mobileNumber: "0240000000",
    shippingName: "Smoke User",
    shippingEmail: "smoke@example.com",
    shippingAddress: "Spintex Road",
    shippingCity: "Accra",
    clientOrderRef,
    paymentScreenshotUrl: "/uploads/smoke-proof.png",
    discountCode: discountCode || undefined,
  };
}

function buildGuestOrderPayload(productId, clientOrderRef, discountCode = "") {
  return {
    orderItems: [{ product: productId, qty: 1 }],
    paymentMethod: "mtn",
    deliveryRegion: "Greater Accra",
    mobileNumber: "0240000001",
    guestName: "Smoke Guest",
    guestEmail: "smoke.guest@example.com",
    guestAddress: "Tema",
    guestCity: "Accra",
    guestNotes: "smoke test",
    clientOrderRef,
    paymentScreenshotUrl: "/uploads/smoke-proof.png",
    discountCode: discountCode || undefined,
  };
}

function pickInStockProduct(products = [], excludeId = "") {
  return (products || []).find(
    (p) =>
      Number(p?.countInStock || 0) >= 1 &&
      String(p?._id || "") !== String(excludeId || "")
  );
}

function pickProductWithMinStock(products = [], minStock = 1, excludeIds = []) {
  const excluded = new Set((excludeIds || []).map((v) => String(v || "")));
  return (products || []).find((p) => {
    const id = String(p?._id || "");
    return Number(p?.countInStock || 0) >= Number(minStock || 1) && !excluded.has(id);
  });
}

async function run() {
  try {
    console.log(`Using API base: ${API_BASE}`);
    if (FRONTEND_BASE) {
      console.log(`Using frontend base: ${FRONTEND_BASE}`);
    }

    const health = await request("/health");
    if (health.res.ok && health.data?.status === "ok") pass("health");
    else fail("health", `status=${health.res.status}`);

    const healthDb = await request("/health/db");
    if (healthDb.res.ok && healthDb.data?.mongo) pass("health/db", healthDb.data.mongo);
    else fail("health/db", `status=${healthDb.res.status}`);

    const userSession = await loginOrRegisterUser();
    pass("auth login/register", userSession.email);

    const productsRes = await request("/products");
    if (!productsRes.res.ok || !Array.isArray(productsRes.data)) {
      fail("products fetch", `status=${productsRes.res.status}`);
      throw new Error("Cannot continue without products");
    } else {
      pass("products fetch", `${productsRes.data.length} products`);
    }

    const targetProduct = pickInStockProduct(productsRes.data);
    if (!targetProduct?._id) {
      fail("target product", "No product with stock >= 3 for smoke tests");
      throw new Error("No suitable product for smoke tests");
    }
    pass("target product", targetProduct._id);

    const wishlistAdd = await request(`/wishlist/${encodeURIComponent(targetProduct._id)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${userSession.token}` },
    });
    if (wishlistAdd.res.ok || wishlistAdd.res.status === 400) pass("wishlist add");
    else fail("wishlist add", `status=${wishlistAdd.res.status}`);

    const wishlistRemove = await request(`/wishlist/${encodeURIComponent(targetProduct._id)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${userSession.token}` },
    });
    if (wishlistRemove.res.ok) pass("wishlist remove");
    else fail("wishlist remove", `status=${wishlistRemove.res.status}`);

    const cartAdd = await request(`/cart/${encodeURIComponent(targetProduct._id)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userSession.token}`,
      },
      body: JSON.stringify({ qty: 1 }),
    });
    if (cartAdd.res.ok) pass("cart add");
    else fail("cart add", `status=${cartAdd.res.status}`);

    const cartRead = await request("/cart", {
      headers: { Authorization: `Bearer ${userSession.token}` },
    });
    if (cartRead.res.ok) pass("cart read");
    else fail("cart read", `status=${cartRead.res.status}`);

    const cartClear = await request("/cart", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${userSession.token}` },
    });
    if (cartClear.res.ok) pass("cart clear");
    else fail("cart clear", `status=${cartClear.res.status}`);

    const productStock = Number(targetProduct?.countInStock || 0);
    const idempotencyRef = `SMOKE-AUTH-${Date.now()}`;
    const payload = buildAuthOrderPayload(targetProduct._id, idempotencyRef);
    let orderA;
    let orderB;
    let mode = "concurrent";

    if (productStock >= 2) {
      [orderA, orderB] = await Promise.all([
        request("/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userSession.token}`,
          },
          body: JSON.stringify(payload),
        }),
        request("/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userSession.token}`,
          },
          body: JSON.stringify(payload),
        }),
      ]);
    } else {
      mode = "sequential-low-stock";
      orderA = await request("/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userSession.token}`,
        },
        body: JSON.stringify(payload),
      });
      orderB = await request("/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userSession.token}`,
        },
        body: JSON.stringify(payload),
      });
    }

    const idA = orderA?.data?.orderId || orderA?.data?.order?._id;
    const idB = orderB?.data?.orderId || orderB?.data?.order?._id;
    const authIdempotent =
      [200, 201].includes(orderA?.res?.status) &&
      [200, 201].includes(orderB?.res?.status) &&
      idA &&
      idB &&
      String(idA) === String(idB);
    if (authIdempotent) {
      pass(
        "auth order idempotency + concurrency",
        `${String(idA)} (${mode})`
      );
    } else {
      fail(
        "auth order idempotency + concurrency",
        `${orderA?.res?.status}/${orderB?.res?.status} (${mode})`
      );
    }

    // Use a fresh in-stock product for guest flow to avoid stock depletion from prior checks.
    const refreshedProducts = await request("/products");
    const guestProduct =
      pickInStockProduct(refreshedProducts.data, targetProduct._id) ||
      pickInStockProduct(refreshedProducts.data);
    if (!guestProduct?._id) {
      fail("guest checkout", "No in-stock product available after prior tests");
      throw new Error("No in-stock product available for guest checkout");
    }

    const guestRef = `SMOKE-GUEST-${Date.now()}`;
    const guestPayload = buildGuestOrderPayload(guestProduct._id, guestRef);
    const guestOrder = await request("/orders/guest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(guestPayload),
    });
    if ([200, 201].includes(guestOrder.res.status)) pass("guest checkout");
    else fail("guest checkout", `status=${guestOrder.res.status}`);

    if (ADMIN_EMAIL && ADMIN_PASSWORD) {
      const admin = await loginAdminIfConfigured();
      const generate = await request("/admin/discounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${admin.token}`,
        },
        body: JSON.stringify({ percent: 2, count: 1 }),
      });

      const code = generate.data?.codes?.[0];
      if (!generate.res.ok || !code) {
        fail("discount generate for race", `status=${generate.res.status}`);
      } else {
        pass("discount generate for race", code);
        // Ensure race test is not invalidated by stock depletion from prior smoke steps.
        const raceProductsRes = await request("/products");
        const raceProduct =
          pickProductWithMinStock(raceProductsRes.data, 2, [
            targetProduct?._id,
            guestProduct?._id,
          ]) ||
          pickProductWithMinStock(raceProductsRes.data, 2);

        if (!raceProduct?._id) {
          pass("discount race lock", "Skipped (no product with stock >= 2)");
        } else {
        const raceRefA = `SMOKE-DC-A-${Date.now()}`;
        const raceRefB = `SMOKE-DC-B-${Date.now()}`;
        const [g1, g2] = await Promise.all([
          request("/orders/guest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(buildGuestOrderPayload(raceProduct._id, raceRefA, code)),
          }),
          request("/orders/guest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(buildGuestOrderPayload(raceProduct._id, raceRefB, code)),
          }),
        ]);
        const statuses = [g1.res.status, g2.res.status];
        const validRace =
          statuses.filter((s) => s === 201 || s === 200).length === 1 &&
          statuses.filter((s) => s >= 400).length === 1;
        if (validRace) pass("discount race lock", statuses.join("/"));
        else {
          const msgA = String(g1?.data?.message || g1?.data?.error || "").trim();
          const msgB = String(g2?.data?.message || g2?.data?.error || "").trim();
          fail(
            "discount race lock",
            `${statuses.join("/")} | ${msgA || "no-message"} | ${msgB || "no-message"}`
          );
        }
        }
      }
    } else {
      pass("discount race lock", "Skipped (SMOKE_ADMIN_EMAIL/SMOKE_ADMIN_PASSWORD not set)");
    }

    if (FRONTEND_BASE) {
      const snapshotUrl = `${FRONTEND_BASE}/assets/data/products-snapshot.json`;
      try {
        const snapshotRes = await fetch(snapshotUrl);
        const snapshotData = await snapshotRes.json();
        const list = Array.isArray(snapshotData) ? snapshotData : snapshotData?.products;
        if (snapshotRes.ok && Array.isArray(list)) {
          pass("offline snapshot availability", `${list.length} records`);
        } else {
          fail("offline snapshot availability", `status=${snapshotRes.status}`);
        }
      } catch (err) {
        const cause = err?.cause?.message ? ` | cause: ${err.cause.message}` : "";
        fail(
          "offline snapshot availability",
          `${snapshotUrl} | ${err?.message || String(err)}${cause}`
        );
      }
    } else {
      pass("offline snapshot availability", "Skipped (STAGING_FRONTEND_BASE not set)");
    }
  } catch (err) {
    fail("smoke runner", err?.message || String(err));
    console.error("Hint:");
    console.error("- Ensure backend is running and reachable from this machine.");
    console.error("- If testing staging, set STAGING_API_BASE to full URL, e.g. https://api.example.com/api");
    console.error("- If local, start server first: npm run dev");
    console.error(`- Current API base used: ${API_BASE}`);
  }

  if (failures > 0) {
    console.error(`\nSmoke tests finished with ${failures} failure(s).`);
    process.exitCode = 1;
    return;
  }

  console.log("\nSmoke tests finished successfully.");
}

run();
