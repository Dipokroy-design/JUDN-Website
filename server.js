const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/products", (req, res) => {
  res.sendFile(path.join(__dirname, "productPage.html"));
});

app.get("/cart", (req, res) => {
  res.sendFile(path.join(__dirname, "cart.html"));
});

app.get("/checkout", (req, res) => {
  res.sendFile(path.join(__dirname, "checkout.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin/index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 JUDN Website is running on http://localhost:${PORT}`);
  console.log(`📱 Admin Panel: http://localhost:${PORT}/admin`);
  console.log(`🛍️ Products: http://localhost:${PORT}/products`);
  console.log(`🛒 Cart: http://localhost:${PORT}/cart`);
  console.log(`💳 Checkout: http://localhost:${PORT}/checkout`);
});
