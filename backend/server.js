require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(cors());          // allows React (different port) to call this API
app.use(express.json());  // allows server to read JSON in request body

// Test route - confirms server + DB are alive
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "myQuickKart-clone API is running",
    dbState: require("mongoose").connection.readyState, // 1 = connected
  });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
