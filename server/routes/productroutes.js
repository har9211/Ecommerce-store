const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products"
    });
  }
});

// POST create product
router.post("/", async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;

    const product = await Product.create({
      name,
      price,
      category,
      stock
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create product"
    });
  }
});

module.exports = router;