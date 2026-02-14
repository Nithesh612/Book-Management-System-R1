const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");
const bookRoutes = require("./routes/books");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.json({ message: "Working Fine..." });
});

app.use("/books", bookRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});