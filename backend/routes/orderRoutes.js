const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  markOrderPaid,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// IMPORTANT: specific routes like "/myorders" must be declared BEFORE
// the dynamic "/:id" route, or Express will try to match "myorders"
// as if it were an :id value.

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/", protect, adminOnly, getAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/pay", protect, markOrderPaid);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;
