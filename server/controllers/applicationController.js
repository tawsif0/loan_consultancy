const pool = require("../config/db");

exports.submitApplication = async (req, res) => {
  try {
    const application = req.body;
    const [result] = await pool.query(
      "INSERT INTO loan_applications SET ?",
      application
    );
    res.status(201).json({ id: result.insertId, ...application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM loan_applications ORDER BY createdAt DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getApplicationById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM loan_applications WHERE id = ?",
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Application not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
