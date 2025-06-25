const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost", // Use 'localhost' instead of IP
  user: "loancons_data",
  password: "Arbeit123@@",
  database: "loancons_data",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  socketPath: "/var/lib/mysql/mysql.sock", // Add this line for cPanel
});

module.exports = pool;
