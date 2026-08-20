const express = require("express");

const router = express.Router();

const products = [
  {
    id: 1,
    name: "Laptop",
    price: 50000,
    category: "Electronics"
  },
  {
    id: 2,
    name: "Phone",
    price: 25000,
    category: "Electronics"
  },
  {
    id: 3,
    name: "Headphones",
    price: 3000,
    category: "Accessories"
  }
];

router.get("/", (req, res) => {
  res.json(products);
});

module.exports = router;