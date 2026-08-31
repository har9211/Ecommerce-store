const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  exportProductsCSV,
  importProductsCSV,
} = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const uploadCsv = require("../middleware/uploadCsv");

// Public routes — anyone can browse products
router.get("/", getProducts);

// Private/Admin routes
router.post("/", protect, adminOnly, createProduct);
router.post("/upload", protect, adminOnly, upload.single("image"), uploadProductImage);
router.get("/export", protect, adminOnly, exportProductsCSV);
router.post("/import", protect, adminOnly, uploadCsv.single("file"), importProductsCSV);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

// Public - kept below the routes above so Express doesn't treat words like
// "upload", "export", "import" as an :id value
router.get("/:id", getProductById);

module.exports = router;
