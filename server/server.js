require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./config/db");

app.use(cors());
app.use(express.json());

// Mount the applications route, including the new /download endpoint
app.use("/api/applications", require("./routes/applicationRoutes"));

// Authentication routes
app.use("/api/auth", require("./routes/authRoutes"));

// Test DB connection
db.getConnection()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection failed:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
