const Product = require("../models/Product");
const { stringify } = require("csv-stringify/sync");
const { parse } = require("csv-parse/sync");

// @route  GET /api/products
// @desc   Get all products (supports ?category=Electronics and ?keyword=search)
// @access Public
const getProducts = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.keyword) {
      filter.name = { $regex: req.query.keyword, $options: "i" }; // case-insensitive search
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
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
    const { name, description, price, category, image, stock, handle } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const product = await Product.create({
      handle,
      name,
      description,
      price,
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

    Object.assign(product, req.body); // overwrite only the fields sent in body
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

  const validCategories = Product.schema.path("category").enumValues;
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

  // Path the frontend can use directly: server.js serves /uploads as static files
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
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
