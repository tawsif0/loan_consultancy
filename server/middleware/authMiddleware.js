const jwt = require("jsonwebtoken");

// Hardcoded JWT secret (for development only)
const JWT_SECRET = "2hsfhodsijfiosj";

module.exports = (req, res, next) => {
  // 1. Extract token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "No authentication token provided",
    });
  }

  // 2. Get the token value
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"], // Explicit algorithm specification
      ignoreExpiration: false, // Ensure expiration is checked
    });

    // 4. Attach user data to request object
    req.user = {
      id: decoded.id,
      role: decoded.role || "user",
    };

    next();
  } catch (err) {
    // 5. Handle specific JWT errors
    let errorMessage = "Invalid token";

    if (err.name === "TokenExpiredError") {
      errorMessage = "Token expired";
    } else if (err.name === "JsonWebTokenError") {
      errorMessage = "Malformed token";
    }

    return res.status(401).json({
      error: "Unauthorized",
      message: errorMessage,
      // Only show details in development
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
