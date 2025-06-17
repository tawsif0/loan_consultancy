const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Find user in database
    const [users] = await pool.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    // 2. Verify user exists
    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3. Validate password
    const isValid = await bcrypt.compare(password, users[0].password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 4. Generate JWT token (with hardcoded secret)
    const token = jwt.sign(
      {
        id: users[0].id,
        // Add any additional claims here
        role: users[0].role || "user",
      },
      "2hsfhodsijfiosj", // Hardcoded secret
      {
        expiresIn: "1h",
        algorithm: "HS256", // Explicitly specify algorithm
      }
    );

    // 5. Send successful response
    res.json({
      token,
      user: {
        id: users[0].id,
        username: users[0].username,
        // Exclude password from response
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      error: "Authentication failed",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
