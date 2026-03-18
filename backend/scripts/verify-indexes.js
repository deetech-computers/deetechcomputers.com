import mongoose from "mongoose";
import connectDB from "../src/config/db.js";
import Order from "../src/models/Order.js";

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`OK: ${message}`);
}

async function cleanupDuplicateClientOrderRefs() {
  const duplicates = await Order.aggregate([
    {
      $match: {
        clientOrderRef: { $exists: true, $type: "string" },
      },
    },
    {
      $group: {
        _id: "$clientOrderRef",
        ids: { $push: "$_id" },
        count: { $sum: 1 },
      },
    },
    {
      $match: {
        count: { $gt: 1 },
      },
    },
  ]);

  if (!duplicates.length) {
    ok("No duplicate clientOrderRef values found");
    return;
  }

  let unsetCount = 0;
  for (const dup of duplicates) {
    const docs = await Order.find({ _id: { $in: dup.ids } })
      .sort({ createdAt: -1, _id: -1 })
      .select("_id clientOrderRef createdAt");

    const keep = docs[0];
    const toUnset = docs.slice(1).map((d) => d._id);
    if (!toUnset.length) continue;

    const update = await Order.updateMany(
      { _id: { $in: toUnset } },
      { $unset: { clientOrderRef: 1 } }
    );
    unsetCount += Number(update.modifiedCount || 0);
    ok(
      `Duplicate clientOrderRef "${dup._id}" cleaned: kept ${keep?._id}, unset ${toUnset.length}`
    );
  }

  ok(`Total duplicate rows cleaned: ${unsetCount}`);
}

async function run() {
  const checkOnly = process.argv.includes("--check-only");
  const skipCleanup = process.argv.includes("--skip-cleanup");

  await connectDB();
  ok("MongoDB connected");

  if (!checkOnly && !skipCleanup) {
    await cleanupDuplicateClientOrderRefs();
  }

  if (!checkOnly) {
    await Order.syncIndexes();
    ok("Order indexes synced");
  }

  const indexes = await Order.collection.indexes();
  const clientOrderRefIndex = indexes.find((idx) => idx?.key?.clientOrderRef === 1 && idx.unique);

  if (!clientOrderRefIndex) {
    fail("Missing unique clientOrderRef index");
  } else {
    ok(`Found unique clientOrderRef index: ${clientOrderRefIndex.name}`);
  }

  const partial = clientOrderRefIndex?.partialFilterExpression;
  const hasPartial =
    partial &&
    partial.clientOrderRef &&
    partial.clientOrderRef.$exists === true &&
    partial.clientOrderRef.$type === "string";

  if (!hasPartial) {
    fail("clientOrderRef unique index exists but partialFilterExpression is incorrect");
  } else {
    ok("clientOrderRef partialFilterExpression verified");
  }

  await mongoose.connection.close();
  ok("MongoDB connection closed");
}

run().catch(async (err) => {
  fail(err?.message || String(err));
  try {
    await mongoose.connection.close();
  } catch {}
});
