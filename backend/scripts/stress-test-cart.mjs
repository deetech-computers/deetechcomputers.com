import { MongoMemoryServer } from "mongodb-memory-server";

// This must run before ANY of our app modules are imported, since
// config/env.js validates these at import time.
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-for-cart-stress-test";
process.env.FRONTEND_URL = "http://localhost:3000";

let failures = 0;
function assert(cond, msg) {
  if (!cond) {
    failures += 1;
    console.error("FAIL:", msg);
  } else {
    console.log("ok:  ", msg);
  }
}

async function main() {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongod.getUri();

  const mongoose = (await import("mongoose")).default;
  await mongoose.connect(process.env.MONGO_URI);

  const jwt = (await import("jsonwebtoken")).default;
  const { default: createApp } = await import("../src/app.js");
  const { default: User } = await import("../src/models/User.js");
  const { default: Product } = await import("../src/models/Product.js");
  const { default: Cart } = await import("../src/models/Cart.js");
  const { JWT_SECRET, JWT_EXPIRES_IN } = await import("../src/config/env.js");

  const app = await createApp();
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;

  function tokenFor(user) {
    return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  async function makeUser(i) {
    return User.create({
      name: `Stress User ${i}`,
      email: `stress-user-${i}@example.com`,
      password: "password123",
    });
  }

  async function makeProduct(i, stock = 1000) {
    return Product.create({
      name: `Stress Product ${i}`,
      description: "test",
      brand: "TestBrand",
      category: "laptops",
      price: 100,
      countInStock: stock,
    });
  }

  async function cartRequest(method, path, token, body) {
    const res = await fetch(`${base}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    let json = null;
    try {
      json = await res.json();
    } catch {
      json = null;
    }
    return { status: res.status, json };
  }

  // ========================================================================
  // TEST 1: the exact reported scenario - rapid "+" clicks on the SAME item.
  // Fires N concurrent POST /api/cart/:productId requests with different
  // qty values, exactly like mashing the quantity stepper. Before the fix
  // this could silently store a stale qty with zero errors. After the fix,
  // every request either succeeds and reflects SOME valid attempted qty
  // (last one processed wins, deterministically, no data loss), and the
  // final DB state must match one of the ACTUAL attempted values.
  // ========================================================================
  console.log("\n-- Test 1: rapid concurrent quantity clicks on the same cart line --");
  {
    const user = await makeUser("rapid-click");
    const product = await makeProduct("rapid-click");
    const token = tokenFor(user);
    const N = 40;
    const attempts = Array.from({ length: N }, (_, i) => i + 1); // qty 1..40

    const results = await Promise.all(
      attempts.map((qty) => cartRequest("POST", `/api/cart/${product._id}`, token, { qty }))
    );

    const serverErrors = results.filter((r) => r.status >= 500);
    const okResults = results.filter((r) => r.status === 200);

    assert(serverErrors.length === 0, `no 500s under ${N} concurrent same-line writes (got ${serverErrors.length})`);
    assert(okResults.length === N, `all ${N} requests got a 200 (got ${okResults.length})`);

    const finalCart = await Cart.findOne({ user: user._id });
    const finalQty = finalCart.items.find((it) => String(it.product) === String(product._id))?.qty;
    assert(
      attempts.includes(finalQty),
      `final stored qty (${finalQty}) is one of the actually-attempted values 1-${N}, not a corrupted/impossible value`
    );
    console.log(`   (final qty landed on ${finalQty} - which specific one is inherently nondeterministic under true concurrency, but it must be real)`);
  }

  // ========================================================================
  // TEST 2: mixed concurrent operations on the SAME user's cart - add line
  // A, update line A, add line B, remove line B, all firing at once. Proves
  // operations on DIFFERENT lines of the same cart document don't clobber
  // each other (the old find->mutate->save pattern was vulnerable to this
  // even when the lineKeys differed, since it read/wrote the WHOLE document).
  // ========================================================================
  console.log("\n-- Test 2: concurrent operations across DIFFERENT lines of the same cart --");
  {
    const user = await makeUser("mixed-ops");
    const productA = await makeProduct("mixed-a");
    const productB = await makeProduct("mixed-b");
    const productC = await makeProduct("mixed-c");
    const token = tokenFor(user);

    // Seed line B so we can remove it concurrently with adds to A and C.
    await cartRequest("POST", `/api/cart/${productB._id}`, token, { qty: 5 });

    const ops = [
      cartRequest("POST", `/api/cart/${productA._id}`, token, { qty: 2 }),
      cartRequest("DELETE", `/api/cart/${productB._id}`, token),
      cartRequest("POST", `/api/cart/${productC._id}`, token, { qty: 3 }),
      cartRequest("POST", `/api/cart/${productA._id}`, token, { qty: 7 }), // second write to A
    ];
    const results = await Promise.all(ops);
    assert(results.every((r) => r.status < 500), "no 500s across mixed concurrent operations on different lines");

    const finalCart = await Cart.findOne({ user: user._id });
    const hasA = finalCart.items.some((it) => String(it.product) === String(productA._id));
    const hasB = finalCart.items.some((it) => String(it.product) === String(productB._id));
    const hasC = finalCart.items.some((it) => String(it.product) === String(productC._id));
    assert(hasA, "line A survives (wasn't wiped out by the concurrent remove of line B)");
    assert(!hasB, "line B was actually removed");
    assert(hasC, "line C survives (wasn't wiped out by concurrent writes to A)");
  }

  // ========================================================================
  // TEST 3: 150 concurrent DIFFERENT users, each doing several rapid cart
  // operations at once - proves the system holds up under broad concurrent
  // load and that unrelated users' carts never cross-contaminate.
  // ========================================================================
  console.log("\n-- Test 3: 150 concurrent users, each with their own cart, each doing 3 rapid ops --");
  {
    const USERS = 150;
    const setup = await Promise.all(
      Array.from({ length: USERS }, async (_, i) => {
        const user = await makeUser(`bulk-${i}`);
        const product = await makeProduct(`bulk-${i}`);
        return { user, product, token: tokenFor(user) };
      })
    );

    // Fire in batches of 30 users (90 simultaneous requests per batch) -
    // 450 truly-simultaneous loopback connections trips this local test
    // machine's connection limits (an artifact of testing 150 users from a
    // single process on one box, not a real production constraint), but
    // 90-at-once is already far more concurrent than any realistic burst
    // and still exercises the exact same race-prone code path.
    const BATCH_SIZE = 30;
    const start = Date.now();
    const allResults = [];
    for (let i = 0; i < setup.length; i += BATCH_SIZE) {
      const batch = setup.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async ({ product, token }) => {
          // Each "user" rapid-fires 3 operations on their own line, same
          // pattern as test 1 but distributed across many independent carts.
          return Promise.all([
            cartRequest("POST", `/api/cart/${product._id}`, token, { qty: 1 }),
            cartRequest("POST", `/api/cart/${product._id}`, token, { qty: 2 }),
            cartRequest("POST", `/api/cart/${product._id}`, token, { qty: 3 }),
          ]);
        })
      );
      allResults.push(...batchResults);
    }
    const wallMs = Date.now() - start;

    const flat = allResults.flat();
    const serverErrors = flat.filter((r) => r.status >= 500);
    const rateLimited = flat.filter((r) => r.status === 429);
    const okCount = flat.filter((r) => r.status === 200).length;

    console.log(`   ${USERS} users x 3 ops = ${flat.length} total requests in ${wallMs}ms`);
    console.log(`   200 OK: ${okCount}, 429 rate-limited: ${rateLimited.length}, 5xx errors: ${serverErrors.length}`);
    assert(serverErrors.length === 0, "zero server errors across 150 concurrent users' rapid operations");

    // Verify cross-user isolation: every user's final cart must contain
    // ONLY their own product, with a valid (1, 2, or 3) qty.
    let crossContamination = 0;
    let invalidQty = 0;
    const carts = await Cart.find({ user: { $in: setup.map((s) => s.user._id) } });
    const cartByUser = new Map(carts.map((c) => [String(c.user), c]));
    for (const { user, product } of setup) {
      const cart = cartByUser.get(String(user._id));
      if (!cart) continue;
      for (const item of cart.items) {
        if (String(item.product) !== String(product._id)) crossContamination += 1;
        if (![1, 2, 3].includes(item.qty)) invalidQty += 1;
      }
    }
    assert(crossContamination === 0, "zero cross-user contamination (every cart only contains its own user's product)");
    assert(invalidQty === 0, "every final qty is one of the genuinely-attempted values (no corrupted state)");
  }

  // ========================================================================
  // TEST 4: 150 concurrent users at the DATABASE layer, bypassing HTTP and
  // the (correctly-functioning) per-IP rate limiter entirely, each firing
  // 5 rapid concurrent writes - this is the real apples-to-apples version
  // of "150 concurrent users" the rate limiter artificially throttled in
  // test 3, proving the atomic fix holds at true scale.
  // ========================================================================
  console.log("\n-- Test 4: 150 concurrent users at the DB layer (bypassing HTTP/rate-limit), 5 rapid ops each --");
  {
    const { upsertCartLine } = await import("../src/controllers/cartController.js");
    const USERS = 150;
    const setup = await Promise.all(
      Array.from({ length: USERS }, async (_, i) => {
        const user = await makeUser(`db-${i}`);
        const product = await makeProduct(`db-${i}`);
        return { user, product };
      })
    );

    const start = Date.now();
    await Promise.all(
      setup.map(({ user, product }) => {
        const lineKey = `${product._id}::base`;
        const writes = [1, 2, 3, 4, 5].map((qty) =>
          upsertCartLine(user._id, lineKey, product._id, qty, { ram: "", storage: "" })
        );
        return Promise.all(writes);
      })
    );
    const wallMs = Date.now() - start;
    console.log(`   ${USERS} users x 5 concurrent writes = ${USERS * 5} total DB operations in ${wallMs}ms`);

    let crossContamination = 0;
    let invalidQty = 0;
    let missing = 0;
    const carts = await Cart.find({ user: { $in: setup.map((s) => s.user._id) } });
    const cartByUser = new Map(carts.map((c) => [String(c.user), c]));
    for (const { user, product } of setup) {
      const cart = cartByUser.get(String(user._id));
      if (!cart || cart.items.length === 0) {
        missing += 1;
        continue;
      }
      for (const item of cart.items) {
        if (String(item.product) !== String(product._id)) crossContamination += 1;
        if (![1, 2, 3, 4, 5].includes(item.qty)) invalidQty += 1;
      }
    }
    assert(missing === 0, "every one of the 150 users ended up with a cart line (nothing vanished)");
    assert(crossContamination === 0, "zero cross-user contamination at full 150-user concurrency");
    assert(invalidQty === 0, "every final qty is a genuinely-attempted value at full 150-user concurrency");
  }

  console.log("\n===================================");
  if (failures > 0) {
    console.error(`${failures} assertion(s) FAILED`);
    server.close();
    await mongoose.disconnect();
    await mongod.stop();
    process.exit(1);
  } else {
    console.log("All assertions passed.");
  }

  server.close();
  await mongoose.disconnect();
  await mongod.stop();
}

main().catch((err) => {
  console.error("Script error:", err);
  process.exit(1);
});
