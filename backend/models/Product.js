const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // A unique, URL-safe identifier - same idea as Shopify's "Handle" column.
    // Used to match rows in a CSV back to the correct product on re-import,
    // so editing a spreadsheet and re-uploading it updates existing products
    // instead of creating duplicates.
    handle: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Electronics",
        "Home & Kitchen",
        "Fashion",
        "Health Care",
        "Accessories",
        "Beauty",
        "Other",
      ],
    },
    image: {
      type: String, // URL to image (Cloudinary etc. later)
      default: "",
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Turns "Wireless Earbuds Pro!" into "wireless-earbuds-pro" - same rules
// Shopify uses for handles: lowercase, letters/numbers/dashes only.
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// If no handle was given (e.g. created through the normal admin form,
// not a CSV import), generate one from the name automatically.
productSchema.pre("validate", async function () {
  if (!this.handle && this.name) {
    let base = slugify(this.name);
    let candidate = base;
    let counter = 1;

    // Handles must be unique - if "wireless-earbuds" is taken, try
    // "wireless-earbuds-2", "wireless-earbuds-3", etc.
    const Product = mongoose.model("Product");
    while (await Product.findOne({ handle: candidate, _id: { $ne: this._id } })) {
      counter += 1;
      candidate = `${base}-${counter}`;
    }

    this.handle = candidate;
  }
});

module.exports = mongoose.model("Product", productSchema);
