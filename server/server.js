require("dotenv").config();
const express = require("express");
const cors = require("cors");
const zakatRoutes = require("./routes/zakatRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({
  origin: "*", // allow all (you can restrict later)
}));
app.use(express.json());

// ✅ Root route (important for Render browser test)
app.get("/", (req, res) => {
  res.send("Zakat API is running 🚀");
});

// ✅ Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Server is running normally." });
});

// ✅ API routes
app.use("/api", zakatRoutes);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});