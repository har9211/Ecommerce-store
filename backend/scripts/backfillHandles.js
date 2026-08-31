// One-time migration: gives every existing product a "handle" (the new
// unique slug field used for CSV import matching) if it doesn't have one
// already. Safe to run more than once - it skips products that already
// have a handle.
//
// Run this ONCE, before starting your server, if you had products in your
// database from before the CSV import/export feature was added:
//
//   node scripts/backfillHandles.js

require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const productsWithoutHandle = await Product.find({
    $or: [{ handle: { $exists: false } }, { handle: null }, { handle: "" }],
  });

  console.log(`Found ${productsWithoutHandle.length} product(s) missing a handle.`);

  for (const product of productsWithoutHandle) {
    let base = slugify(product.name);
    let candidate = base;
    let counter = 1;

    while (await Product.findOne({ handle: candidate, _id: { $ne: product._id } })) {
      counter += 1;
      candidate = `${base}-${counter}`;
    }

    product.handle = candidate;
    await product.save();
    console.log(`  "${product.name}" -> handle: "${candidate}"`);
  }

  console.log("Done.");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
