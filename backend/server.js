require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const sanitizeRequest = require("./middleware/sanitize");

function validateStartupConfig() {
  const secret = process.env.JWT_SECRET || "";
  if (secret.length < 32 || /replace_this|change_me|secret/i.test(secret)) {
    throw new Error("JWT_SECRET must be a unique, cryptographically random value of at least 32 characters.");
  }
}

const app = express();

// Middleware
app.use(
  helmet({
    // Product images are requested by the frontend on a different local origin
    // during development, so they must be allowed to load cross-origin.
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
); // sets secure HTTP headers (hides tech stack, blocks some attack classes)

// Only allow requests from your actual frontend, not any website on the internet.
// Falls back to the local dev URL if FRONTEND_URL isn't set in .env.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" })); // caps request body size - blocks huge payload attacks
app.use(sanitizeRequest); // strips NoSQL injection operators from body/query/params
app.use("/uploads", express.static(require("path").join(__dirname, "uploads"))); // serves uploaded product images

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
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

const PORT = process.env.PORT || 5000;

async function startServer() {
  validateStartupConfig();
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error(`Server startup failed: ${error.message}`);
  process.exit(1);
});
