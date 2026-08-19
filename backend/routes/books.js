const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all books
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM books ORDER BY id DESC");
        res.json(rows);
    } catch (error) {
        console.error("GET /books error:", error);
        res.status(500).json({ error: "Failed to fetch books" });
    }
});

// GET single book by ID
router.get("/:id", async (req, res) => {
    try {
        const bookId = Number(req.params.id);
        if (isNaN(bookId) || bookId <= 0) {
            return res.status(400).json({ error: "Invalid book ID" });
        }

        const [rows] = await db.query("SELECT * FROM books WHERE id = ?", [bookId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error("GET /books/:id error:", error);
        res.status(500).json({ error: "Failed to fetch book" });
    }
});

// POST create new book (with input validation)
router.post("/", async (req, res) => {
    try {
        const { title, author, genre, price } = req.body;

        // Validation
        if (!title || !title.trim()) {
            return res.status(400).json({ error: "Book title is required" });
        }
        if (!author || !author.trim()) {
            return res.status(400).json({ error: "Author name is required" });
        }
        if (!genre || !genre.trim()) {
            return res.status(400).json({ error: "Genre is required" });
        }
        if (price == null || isNaN(Number(price)) || Number(price) <= 0) {
            return res.status(400).json({ error: "A valid positive price is required" });
        }

        const [result] = await db.query(
            "INSERT INTO books (title, author, genre, price) VALUES (?, ?, ?, ?)",
            [title.trim(), author.trim(), genre.trim(), Number(price)]
        );

        res.status(201).json({ 
            id: result.insertId, 
            title: title.trim(), 
            author: author.trim(), 
            genre: genre.trim(), 
            price: Number(price) 
        });
    } catch (error) {
        console.error("POST /books error:", error);
        res.status(500).json({ error: "Failed to create book" });
    }
});

// PUT update book (with input validation)
router.put("/:id", async (req, res) => {
    try {
        const bookId = Number(req.params.id);
        if (isNaN(bookId) || bookId <= 0) {
            return res.status(400).json({ error: "Invalid book ID" });
        }

        const { title, author, genre, price } = req.body;

        // Validation
        if (!title || !title.trim()) {
            return res.status(400).json({ error: "Book title is required" });
        }
        if (!author || !author.trim()) {
            return res.status(400).json({ error: "Author name is required" });
        }
        if (!genre || !genre.trim()) {
            return res.status(400).json({ error: "Genre is required" });
        }
        if (price == null || isNaN(Number(price)) || Number(price) <= 0) {
            return res.status(400).json({ error: "A valid positive price is required" });
        }

        const [result] = await db.query(
            "UPDATE books SET title = ?, author = ?, genre = ?, price = ? WHERE id = ?",
            [title.trim(), author.trim(), genre.trim(), Number(price), bookId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Book not found to update" });
        }

        res.json({ id: bookId, title: title.trim(), author: author.trim(), genre: genre.trim(), price: Number(price) });
    } catch (error) {
        console.error("PUT /books/:id error:", error);
        res.status(500).json({ error: "Failed to update book" });
    }
});

// DELETE book
router.delete("/:id", async (req, res) => {
    try {
        const bookId = Number(req.params.id);
        if (isNaN(bookId) || bookId <= 0) {
            return res.status(400).json({ error: "Invalid book ID" });
        }

        const [result] = await db.query("DELETE FROM books WHERE id = ?", [bookId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Book not found to delete" });
        }

        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error("DELETE /books/:id error:", error);
        res.status(500).json({ error: "Failed to delete book" });
    }
});

module.exports = router;