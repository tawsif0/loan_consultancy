const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const db = require("./config/db");

const app = express();

// ======================
// HARDCODED CONFIGURATION
// ======================
const config = {
  port: 5000,
  environment: "production",
  cors: {
    allowedOrigins: [
      "https://loan.arbeittechnology.com",
      "https://www.loan.arbeittechnology.com",
      ...(process.env.NODE_ENV === "development"
        ? ["http://localhost:3000"]
        : []),
    ],
    allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
    maxAge: 86400,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
  },
  jwt: {
    secret: "2hsfhodsijfiosj",
  },
};
// ======================

// Security Middleware
app.use(helmet());
app.disable("x-powered-by");

// Enhanced CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || config.cors.allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  methods: config.cors.allowedMethods,
  allowedHeaders: config.cors.allowedHeaders,
  exposedHeaders: config.cors.exposedHeaders,
  credentials: true,
  maxAge: config.cors.maxAge,
  optionsSuccessStatus: 204, // Changed to 204 for preflight
};

// Special preflight handler for auth route
app.options("/api/auth/login", cors(corsOptions), (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", config.cors.allowedOrigins[0]);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.status(204).end(); // 204 No Content for OPTIONS
});

// Apply CORS to all routes
app.use(cors(corsOptions));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: "Too many requests from this IP, please try again later",
  skip: (req) => req.method === "OPTIONS",
});

// Middleware
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // More concise logging

// Apply rate limiting
app.use("/api/", apiLimiter);

// Routes
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    cors: {
      allowedOrigins: config.cors.allowedOrigins,
      methods: config.cors.allowedMethods,
    },
  });
});

// Database Connection
db.getConnection()
  .then((conn) => {
    console.log("✅ Database connected");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.message.includes("CORS")) {
    return res.status(403).json({
      error: "Forbidden",
      message: "Cross-origin request denied",
      details: config.environment === "development" ? err.message : undefined,
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
    message: config.environment === "development" ? err.message : undefined,
  });
});

// Server Startup
const server = app.listen(config.port, () => {
  console.log(`
  🚀 Server running on port ${config.port}
  🛡️  Environment: ${config.environment}
  🌐 Allowed Origins: ${config.cors.allowedOrigins.join(", ")}
  ⏱️  Rate Limit: ${config.rateLimit.maxRequests} req/${
    config.rateLimit.windowMs / 60000
  }min
  `);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});
