const express = require("express");
const cors = require("cors");
require("dotenv").config({ quiet: true });
const bookRoutes = require("./routes/books");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS configuration for local and hosted frontends
const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or Postman)
        if (!origin || allowedOrigins.includes(origin)) {
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
app.use("/users", userRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error("Internal Server Error:", err.stack || err.message);
    res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});