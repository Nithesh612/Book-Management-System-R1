const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all books
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM books");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single book by ID
router.get("/:id", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM books WHERE id = ?", [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create new book
router.post("/", async (req, res) => {
    try {
        const { title, author, genre, price } = req.body;
        const [result] = await db.query(
            "INSERT INTO books (title, author, genre, price) VALUES (?, ?, ?, ?)",
            [title, author, genre, price]
        );
        res.status(201).json({ id: result.insertId, title, author, genre, price });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update book
router.put("/:id", async (req, res) => {
    try {
        const { title, author, genre, price } = req.body;
        await db.query(
            "UPDATE books SET title = ?, author = ?, genre = ?, price = ? WHERE id = ?",
            [title, author, genre, price, req.params.id]
        );
        res.json({ id: req.params.id, title, author, genre, price });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE book
router.delete("/:id", async (req, res) => {
    try {
        await db.query("DELETE FROM books WHERE id = ?", [req.params.id]);
        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
