'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import axios from 'axios';

const BookCreate = () => {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [genre, setGenre] = useState("");
    const [price, setPrice] = useState("");
    const [errors, setErrors] = useState({});
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        
        if (!title) newErrors.title = 'Title is required';
        if (!author) newErrors.author = 'Author is required';
        if (!genre) newErrors.genre = 'Genre is required';
        if (!price) newErrors.price = 'Price is required';
        if (price && isNaN(Number(price))) newErrors.price = 'Price must be a number';
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            const bookobj = { title, author, genre, price: Number(price) };
            axios.post("http://localhost:5000/books", bookobj)
                .then((response) => {
                    alert("Saved");
                    router.push("/book_read/");
                })
                .catch((err) => { console.log(err); })
        }
    };

    return (
        <div className="container mt-4">
            <h2>Add New Book</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input className={`form-control ${errors.title ? 'is-invalid' : ''}`} type='text' name='title' value={title} onChange={(e) => { setTitle(e.target.value) }}></input>
                    {errors.title && <div className="invalid-feedback d-block">{errors.title}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Genre</label>
                    <input className={`form-control ${errors.genre ? 'is-invalid' : ''}`} type='text' name='genre' value={genre} onChange={(e) => { setGenre(e.target.value) }}></input>
                    {errors.genre && <div className="invalid-feedback d-block">{errors.genre}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Author</label>
                    <input className={`form-control ${errors.author ? 'is-invalid' : ''}`} type='text' name='author' value={author} onChange={(e) => { setAuthor(e.target.value) }}></input>
                    {errors.author && <div className="invalid-feedback d-block">{errors.author}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input className={`form-control ${errors.price ? 'is-invalid' : ''}`} type='number' name='price' value={price} onChange={(e) => { setPrice(e.target.value) }}></input>
                    {errors.price && <div className="invalid-feedback d-block">{errors.price}</div>}
                </div>
                <button type="submit" className="btn btn-primary me-2">Submit</button>
                <Link className="btn btn-primary" href="/book_read">Home</Link>
            </form>
        </div>
    )
}

export default BookCreate