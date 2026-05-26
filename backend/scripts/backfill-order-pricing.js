import mongoose from "mongoose";
import dotenv from "dotenv";

import connectDB from "../src/config/db.js";
import Order from "../src/models/Order.js";

dotenv.config();

const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.argv.includes("--force");

function roundMoney(value) {
  return Number(Math.max(0, Number(value || 0)).toFixed(2));
}

function getLineItemsPrice(order) {
  const items = Array.isArray(order?.orderItems) ? order.orderItems : [];
  return roundMoney(
    items.reduce(
      (sum, item) => sum + Number(item?.price || 0) * Number(item?.qty || 0),
      0
    )
  );
}

function buildLegacySafePricing(order) {
  const totalPrice = roundMoney(order?.totalPrice || 0);
  const itemsPrice = roundMoney(getLineItemsPrice(order));
  const discountAmount = roundMoney(order?.discountAmount || 0);
  const discountedItemsPrice = roundMoney(Math.max(0, itemsPrice - discountAmount));

  // Preserve whatever total was historically charged instead of retroactively
  // applying new delivery rules to old orders.
  const inferredShipping = roundMoney(Math.max(0, totalPrice - discountedItemsPrice));

  return {
    itemsPrice,
    shippingPrice: inferredShipping,
    discountedItemsPrice,
  };
}

async function run() {
  await connectDB();

  const query = FORCE
    ? {}
    : {
        $or: [
          { itemsPrice: { $exists: false } },
          { discountedItemsPrice: { $exists: false } },
          { shippingPrice: { $exists: false } },
          { itemsPrice: 0 },
          { discountedItemsPrice: 0 },
        ],
      };

  const orders = await Order.find(query).select(
    "_id totalPrice discountAmount itemsPrice shippingPrice discountedItemsPrice orderItems createdAt"
  );

  if (!orders.length) {
    console.log("No orders need pricing backfill.");
    await mongoose.connection.close();
    return;
  }

  const updates = [];
  let changed = 0;

  for (const order of orders) {
    const pricing = buildLegacySafePricing(order);
    const currentItemsPrice = roundMoney(order?.itemsPrice || 0);
    const currentShippingPrice = roundMoney(order?.shippingPrice || 0);
    const currentDiscountedItemsPrice = roundMoney(order?.discountedItemsPrice || 0);

    const needsUpdate =
      currentItemsPrice !== pricing.itemsPrice ||
      currentShippingPrice !== pricing.shippingPrice ||
      currentDiscountedItemsPrice !== pricing.discountedItemsPrice;

    if (!needsUpdate) continue;
    changed += 1;

    updates.push({
      updateOne: {
        filter: { _id: order._id },
        update: {
          $set: {
            itemsPrice: pricing.itemsPrice,
            shippingPrice: pricing.shippingPrice,
            discountedItemsPrice: pricing.discountedItemsPrice,
          },
        },
      },
    });
  }

  console.log(`Matched ${orders.length} orders, ${changed} need updates.`);

  if (!changed) {
    await mongoose.connection.close();
    return;
  }

  if (DRY_RUN) {
    console.log("Dry run only. No database changes were written.");
    await mongoose.connection.close();
    return;
  }

  const result = await Order.bulkWrite(updates, { ordered: false });
  console.log(`Updated ${Number(result?.modifiedCount || 0)} orders.`);

  await mongoose.connection.close();
}

run().catch(async (error) => {
  console.error("Order pricing backfill failed:", error?.message || error);
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  process.exit(1);
});
