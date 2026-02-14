const mysql = require("mysql2/promise");
require("dotenv").config();

// Create connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "book_management_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection (IMMEDIATELY INVOKED)
(async () => {
    try {
        const connection = await db.getConnection();
        console.log("MySQL connected successfully");
        connection.release();
    } catch (err) {
        console.error("MySQL connection failed:", err.message);
    }
})();

// ✅ EXPORT the pool
module.exports = db;
