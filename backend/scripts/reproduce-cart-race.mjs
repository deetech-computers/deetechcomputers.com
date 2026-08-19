import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import Cart from "../src/models/Cart.js";

// Reproduces the reported "Cart sync issue detected. Refreshing cart."
// toast by simulating what actually happens when a user rapid-clicks the
// quantity +/- buttons: multiple concurrent addToCart-style writes hitting
// the SAME cart document at once, exactly as the real controller does it
// (fetch -> mutate in memory -> save()).

async function simulateAddToCart(userId, productId, qty) {
  // This mirrors cartController.addToCart's exact fetch-then-save sequence.
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = new Cart({ user: userId, items: [] });

  const lineKey = `${productId}::base`;
  const existingItem = cart.items.find((item) => String(item.lineKey || "") === lineKey);
  if (existingItem) {
    existingItem.qty = qty;
  } else {
    cart.items.push({ product: productId, qty, lineKey, selectedUpgrades: { ram: "", storage: "" } });
  }

  await cart.save(); // <-- this is where VersionError throws under concurrency
}

async function main() {
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  const userId = new mongoose.Types.ObjectId();
  const productId = new mongoose.Types.ObjectId();

  // Seed an initial cart so there's a real document with items to be raced.
  await Cart.create({ user: userId, items: [{ product: productId, qty: 1, lineKey: `${productId}::base`, selectedUpgrades: { ram: "", storage: "" } }] });

  console.log("Reproducing: 5 concurrent quantity updates to the SAME cart item (simulating rapid +/- clicks)...\n");

  const attempts = [2, 3, 4, 5, 6]; // what 5 rapid clicks of "+" would each try to set
  const results = await Promise.allSettled(attempts.map((qty) => simulateAddToCart(userId, productId, qty)));

  let succeeded = 0;
  let versionErrors = 0;
  let otherErrors = 0;
  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      succeeded += 1;
      console.log(`  attempt qty=${attempts[i]}: SUCCEEDED`);
    } else {
      const isVersionError = r.reason?.name === "VersionError" || /No matching document found for id.*version/i.test(String(r.reason?.message || ""));
      if (isVersionError) versionErrors += 1;
      else otherErrors += 1;
      console.log(`  attempt qty=${attempts[i]}: FAILED - ${r.reason?.name}: ${r.reason?.message}`);
    }
  });

  console.log(`\n${succeeded}/5 succeeded, ${versionErrors} VersionError(s), ${otherErrors} other error(s)`);

  const finalCart = await Cart.findOne({ user: userId });
  console.log("Final stored qty:", finalCart.items[0].qty);

  console.log("\n===================================");
  if (versionErrors > 0) {
    console.log(`CONFIRMED: ${versionErrors} concurrent request(s) failed with Mongoose VersionError.`);
    console.log("This is exactly the kind of failure that trips the frontend's");
    console.log('reconciliation path and can surface "Cart sync issue detected."');
  } else {
    console.log("No VersionError reproduced in this run.");
  }

  await mongoose.disconnect();
  await mongod.stop();
}

main().catch((err) => {
  console.error("Script error:", err);
  process.exit(1);
});
