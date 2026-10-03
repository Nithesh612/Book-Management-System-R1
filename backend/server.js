const express = require("express");
const cors = require("cors");
require("dotenv").config({ quiet: true });
const bookRoutes = require("./routes/books");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration allowing localhost, all Vercel domains, and production frontend
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin) return callback(null, true);

        // Allow any localhost / 127.0.0.1 on any port
        if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }

        // Allow any Vercel domain (*.vercel.app)
        if (/\.vercel\.app$/.test(new URL(origin).hostname)) {
            return callback(null, true);
        }

        // Allow explicit FRONTEND_URL if specified
        if (process.env.FRONTEND_URL) {
            const configuredOrigins = process.env.FRONTEND_URL.split(',').map(u => u.trim().replace(/\/$/, ''));
            if (configuredOrigins.includes(origin.replace(/\/$/, ''))) {
                return callback(null, true);
            }
        }

        // Default allow for seamless deployment
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
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