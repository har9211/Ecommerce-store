const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const { calculateDeliveryPrice } = require("../config/commerce");

// @route  POST /api/orders
// @desc   Create a new order from the cart
// @access Private
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    if (paymentMethod !== "COD") {
      return res.status(400).json({ message: "Online payments are not available yet. Please use Cash on Delivery." });
    }

    const requestedItems = new Map();
    for (const item of orderItems) {
      const productId = item.product || item.productId;
      const quantity = Number(item.quantity);
      if (!productId || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: "Each order item needs a product and a whole-number quantity." });
      }
      requestedItems.set(productId.toString(), (requestedItems.get(productId.toString()) || 0) + quantity);
    }

    let order;
    const reservedItems = [];
    try {
      // Conditional atomic updates work on standalone MongoDB and prevent two
      // simultaneous checkouts from selling the same stock. We compensate the
      // reservation if order creation fails after a product has been reserved.
      const products = await Product.find({ _id: { $in: [...requestedItems.keys()] } });
      if (products.length !== requestedItems.size) {
        throw Object.assign(new Error("One or more products are no longer available."), { statusCode: 400 });
      }
      const productById = new Map(products.map((product) => [product._id.toString(), product]));
      const verifiedItems = [];
      let itemsPrice = 0;
      for (const [productId, quantity] of requestedItems) {
        const product = productById.get(productId);
        const reservation = await Product.updateOne(
          { _id: product._id, stock: { $gte: quantity } },
          { $inc: { stock: -quantity, unitsSold: quantity } }
        );
        if (reservation.modifiedCount !== 1) {
          throw Object.assign(new Error(`${product.name} does not have enough stock.`), { statusCode: 400 });
        }
        reservedItems.push({ productId: product._id, quantity });
        verifiedItems.push({ product: product._id, name: product.name, image: product.image, price: product.price, quantity });
        itemsPrice += product.price * quantity;
      }

      const deliveryPrice = calculateDeliveryPrice(itemsPrice);
      order = await Order.create({
        user: req.user._id,
        orderItems: verifiedItems,
        shippingAddress,
        paymentMethod: "COD",
        itemsPrice,
        deliveryPrice,
        totalPrice: itemsPrice + deliveryPrice,
      });
    } catch (error) {
      if (!order && reservedItems.length) {
        await Promise.allSettled(reservedItems.map(({ productId, quantity }) =>
          Product.updateOne({ _id: productId }, { $inc: { stock: quantity, unitsSold: -quantity } })
        ));
      }
      throw error;
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// @route  GET /api/orders/myorders
// @desc   Get logged-in user's own orders
// @access Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/orders/:id
// @desc   Get single order by id (owner or admin only)
// @access Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/orders
// @desc   Get all orders (admin)
// @access Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const { page, limit } = req.query;
    if (!page && !limit) {
      const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
      return res.json(orders);
    }
    const currentPage = Math.max(1, Number.parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 20));
    const [orders, total] = await Promise.all([
      Order.find({}).populate("user", "name email").sort({ createdAt: -1 }).skip((currentPage - 1) * pageSize).limit(pageSize),
      Order.countDocuments({}),
    ]);
    res.json({ items: orders, pagination: { page: currentPage, limit: pageSize, total, pages: Math.ceil(total / pageSize) } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/orders/:id/status
// @desc   Update order status (admin)
// @access Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const transitions = {
      Placed: ["Processing", "Cancelled"],
      Processing: ["Shipped", "Cancelled"],
      Shipped: ["Delivered"],
      Delivered: [],
      Cancelled: [],
    };
    const nextStatus = req.body.status;
    if (!transitions[order.status]?.includes(nextStatus)) {
      return res.status(400).json({ message: `Cannot change an order from ${order.status} to ${nextStatus}.` });
    }
    order.status = nextStatus;
    const updated = await order.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/orders/:id/fulfill
// @desc   Mark an order as fulfilled (admin has packed/shipped it)
// @access Private/Admin
const fulfillOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "A cancelled order cannot be fulfilled." });
    }

    order.fulfillmentStatus = "Fulfilled";
    order.fulfilledAt = new Date();
    const updated = await order.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/orders/stats/summary
// @desc   Aggregate numbers for the admin analytics dashboard
// @access Private/Admin
const getAnalyticsSummary = async (req, res) => {
  try {
    const orders = await Order.find({});
    const [productCount, customerCount] = await Promise.all([
      Product.countDocuments({}),
      User.countDocuments({ role: "customer" }),
    ]);

    const totalRevenue = orders
      .filter((o) => o.isPaid || o.paymentMethod === "COD")
      .reduce((sum, o) => sum + o.totalPrice, 0);

    const totalOrders = orders.length;

    const ordersByStatus = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});

    // Group revenue by calendar day for the last 14 days, for a trend chart
    const revenueByDay = {};
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const key = day.toISOString().slice(0, 10); // "YYYY-MM-DD"
      revenueByDay[key] = 0;
    }
    orders.forEach((o) => {
      const key = new Date(o.createdAt).toISOString().slice(0, 10);
      if (key in revenueByDay) {
        revenueByDay[key] += o.totalPrice;
      }
    });

    res.json({
      totalRevenue,
      totalOrders,
      ordersByStatus,
      revenueByDay,
      productCount,
      customerCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  fulfillOrder,
  getAnalyticsSummary,
};
