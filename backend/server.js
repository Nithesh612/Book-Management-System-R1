const express = require("express");
const cors = require("cors");
require("dotenv").config({ quiet: true });
const bookRoutes = require("./routes/books");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration allowing localhost on any port & production frontend
const allowedOrigins = [
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin or matching localhost/127.0.0.1 on any port
        if (!origin || allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS policy violation: origin not allowed"));
        }
    },
    credentials: true
}));

app.use(express.json());

// Health check & default route
app.get("/", (req, res) => {
    res.json({ message: "Server is running smoothly", status: "OK" });
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "healthy" });
});

// API Routes
app.use("/books", bookRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error("Internal Server Error:", err.stack || err.message);
    res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});