const Product = require("../models/Product");
const Category = require("../models/Category");
const { stringify } = require("csv-stringify/sync");
const { parse } = require("csv-parse/sync");
const fs = require("fs/promises");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function hasImageSignature(filePath) {
  const handle = await fs.open(filePath, "r");
  try {
    const buffer = Buffer.alloc(12);
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
    if (bytesRead < 3) return false;
    const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    const isPng = bytesRead >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    const isGif = bytesRead >= 6 && (buffer.subarray(0, 6).toString() === "GIF87a" || buffer.subarray(0, 6).toString() === "GIF89a");
    const isWebp = bytesRead >= 12 && buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP";
    return isJpeg || isPng || isGif || isWebp;
  } finally {
    await handle.close();
  }
}

// @route  GET /api/products
// @desc   Get all products (supports ?category=Electronics and ?keyword=search)
// @access Public
const getProducts = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (typeof req.query.keyword === "string" && req.query.keyword.trim()) {
      // Search as literal text. User input must never be interpreted as a
      // MongoDB regular expression, which could make an expensive query.
      filter.name = { $regex: escapeRegex(req.query.keyword.trim().slice(0, 80)), $options: "i" };
    }

    if (req.query.deals === "1") {
      filter.$expr = { $gt: ["$compareAtPrice", "$price"] };
    }

    const { page, limit } = req.query;
    if (!page && !limit) {
      const products = await Product.find(filter).sort({ createdAt: -1 });
      return res.json(products);
    }
    const currentPage = Math.max(1, Number.parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 20));
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip((currentPage - 1) * pageSize).limit(pageSize),
      Product.countDocuments(filter),
    ]);
    res.json({ items: products, pagination: { page: currentPage, limit: pageSize, total, pages: Math.ceil(total / pageSize) } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/products/:id
// @desc   Get single product by id
// @access Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/products
// @desc   Create a new product
// @access Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, compareAtPrice, category, image, stock, handle } = req.body;

    if (!name || !description || price === undefined || price === null || !category) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    if (typeof category !== "string") return res.status(400).json({ message: "Choose a valid category" });
    if (compareAtPrice !== undefined && compareAtPrice !== null && compareAtPrice !== "" && (Number.isNaN(Number(compareAtPrice)) || Number(compareAtPrice) < Number(price))) {
      return res.status(400).json({ message: "Compare-at price must be greater than the sale price" });
    }
    const categoryExists = await Category.exists({ name: category.trim() });
    if (!categoryExists) return res.status(400).json({ message: "Choose a valid category" });

    const product = await Product.create({
      handle,
      name,
      description,
      price,
      compareAtPrice: compareAtPrice === "" || compareAtPrice === undefined ? null : Number(compareAtPrice),
      category,
      image,
      stock,
      createdBy: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/products/:id
// @desc   Update a product
// @access Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const allowedFields = ["handle", "name", "description", "price", "compareAtPrice", "category", "image", "stock"];
    const updates = Object.fromEntries(
      allowedFields.filter((field) => req.body[field] !== undefined).map((field) => [field, req.body[field]])
    );
    if (updates.category !== undefined) {
      if (typeof updates.category !== "string") return res.status(400).json({ message: "Choose a valid category" });
      const categoryExists = await Category.exists({ name: updates.category.trim() });
      if (!categoryExists) return res.status(400).json({ message: "Choose a valid category" });
      updates.category = updates.category.trim();
    }
    Object.assign(product, updates);
    if (product.compareAtPrice === "") product.compareAtPrice = null;
    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  DELETE /api/products/:id
// @desc   Delete a product
// @access Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/products/export
// @desc   Download all products as a CSV file (same idea as Shopify's
//         Products -> Export). Open this in Excel/Google Sheets, edit it,
//         and re-import it to bulk-update products.
// @access Private/Admin
const exportProductsCSV = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    const rows = products.map((p) => ({
      Handle: p.handle,
      Name: p.name,
      Description: p.description,
      Price: p.price,
      CompareAtPrice: p.compareAtPrice || "",
      Category: p.category,
      Image: p.image || "",
      Stock: p.stock,
    }));

    const csv = stringify(rows, { header: true });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=products-export.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/products/import
// @desc   Bulk create/update products from an uploaded CSV file.
//         Matches each row to an existing product by its Handle column -
//         same mechanism Shopify uses for "Overwrite products with
//         matching handles". Rows with a new/blank handle create new
//         products; rows whose handle already exists get updated instead.
// @access Private/Admin
const importProductsCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No CSV file provided" });
  }

  let records;
  try {
    records = parse(req.file.buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
  } catch {
    return res.status(400).json({ message: "Could not parse this CSV file. Check its format." });
  }

  const validCategories = (await Category.find({}).select("name")).map((category) => category.name);
  let created = 0;
  let updated = 0;
  const failed = [];

  for (let i = 0; i < records.length; i++) {
    const row = records[i];
    const rowNumber = i + 2; // +2 because row 1 is the header and CSVs are 1-indexed

    try {
      const name = row.Name?.trim();
      const description = row.Description?.trim();
      const price = Number(row.Price);
      const compareAtPrice = row.CompareAtPrice?.trim() ? Number(row.CompareAtPrice) : null;
      const category = row.Category?.trim();
      const stock = Number(row.Stock);
      const image = row.Image?.trim() || "";
      const handle = row.Handle?.trim().toLowerCase();

      if (!name || !description || !category) {
        failed.push({ row: rowNumber, reason: "Missing Name, Description, or Category" });
        continue;
      }
      if (Number.isNaN(price) || price < 0) {
        failed.push({ row: rowNumber, reason: "Price must be a valid number" });
        continue;
      }
      if (compareAtPrice !== null && (Number.isNaN(compareAtPrice) || compareAtPrice < price)) {
        failed.push({ row: rowNumber, reason: "Compare-at price must be empty or greater than the sale price" });
        continue;
      }
      if (Number.isNaN(stock) || stock < 0) {
        failed.push({ row: rowNumber, reason: "Stock must be a valid number" });
        continue;
      }
      if (!validCategories.includes(category)) {
        failed.push({
          row: rowNumber,
          reason: `Category must be one of: ${validCategories.join(", ")}`,
        });
        continue;
      }

      const existing = handle ? await Product.findOne({ handle }) : null;

      if (existing) {
        existing.name = name;
        existing.description = description;
        existing.price = price;
        existing.compareAtPrice = compareAtPrice;
        existing.category = category;
        existing.stock = stock;
        existing.image = image;
        await existing.save();
        updated += 1;
      } else {
        await Product.create({
          handle: handle || undefined, // let the model auto-generate one if blank
          name,
          description,
          price,
          compareAtPrice,
          category,
          stock,
          image,
          createdBy: req.user._id,
        });
        created += 1;
      }
    } catch (error) {
      failed.push({ row: rowNumber, reason: error.message });
    }
  }

  res.json({ created, updated, failed, totalRows: records.length });
};
// @desc   Upload a product image file, returns its URL to save on the product
// @access Private/Admin
const uploadProductImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image file provided" });
  }

  try {
    if (!(await hasImageSignature(req.file.path))) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({ message: "The uploaded file is not a valid image." });
    }
    // Path the frontend can use directly: server.js serves /uploads as static files
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    await fs.unlink(req.file.path).catch(() => {});
    res.status(400).json({ message: "Could not verify the uploaded image." });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  exportProductsCSV,
  importProductsCSV,
};
