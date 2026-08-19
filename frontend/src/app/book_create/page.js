'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

const GENRE_OPTIONS = [
    { label: 'Fiction', icon: 'bi-journal-bookmark' },
    { label: 'Non-Fiction', icon: 'bi-journal-text' },
    { label: 'Technology', icon: 'bi-cpu' },
    { label: 'Science', icon: 'bi-radioactive' },
    { label: 'Biography', icon: 'bi-person-badge' },
    { label: 'Fantasy', icon: 'bi-stars' },
    { label: 'Mystery', icon: 'bi-incognito' },
    { label: 'Self-Help', icon: 'bi-lightbulb' }
];

const BookCreate = () => {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [genre, setGenre] = useState("Fiction");
    const [price, setPrice] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!title.trim()) newErrors.title = 'Book title is required';
        if (!author.trim()) newErrors.author = 'Author name is required';
        if (!genre.trim()) newErrors.genre = 'Please select or enter a genre';
        if (!price || Number(price) <= 0) newErrors.price = 'Please enter a valid price greater than 0';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                setIsSubmitting(true);
                const bookobj = {
                    title: title.trim(),
                    author: author.trim(),
                    genre: genre.trim(),
                    price: Number(price)
                };
                await axios.post(`${API_BASE_URL}/books`, bookobj);
                router.push("/book_read/");
            } catch (err) {
                console.error("Failed to save book:", err);
                alert("Failed to save book: " + (err.response?.data?.error || err.message));
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '40px' }}>
            {/* ── Top Header Navigation ───────────────────────────── */}
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2">
                <div>
                    <h2 className="mb-1" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                        Add New Book
                    </h2>
                    <p className="mb-0 text-muted" style={{ fontSize: '13.5px' }}>
                        Fill in the details below to add a new book to your library catalogue
                    </p>
                </div>
                <Link href="/book_read" className="btn btn-outline-secondary btn-sm shadow-sm">
                    <i className="bi bi-arrow-left"></i>
                    Back to Catalogue
                </Link>
            </div>

            <div className="row g-4 align-items-start">
                {/* ── Left Column: Form Details ───────────────────────── */}
                <div className="col-12 col-lg-7">
                    <div className="form-card shadow-sm border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                        <div className="form-card-header p-4" style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)', borderBottom: '1px solid #E2E8F0' }}>
                            <div className="d-flex align-items-center gap-3">
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    background: 'var(--primary)',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px',
                                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                                }}>
                                    <i className="bi bi-book-half"></i>
                                </div>
                                <div>
                                    <h5 className="mb-0" style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '16px' }}>Book Information</h5>
                                    <span className="text-muted" style={{ fontSize: '12.5px' }}>Provide metadata for indexing & search</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <form onSubmit={handleSubmit} noValidate>
                                {/* Title Input */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{ fontSize: '13px' }} htmlFor="title">
                                        Book Title <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-with-icon">
                                        <i className="bi bi-journal-text input-icon"></i>
                                        <input
                                            id="title"
                                            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                            type="text"
                                            placeholder="e.g. Clean Code: A Handbook of Agile Software"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                    {errors.title && (
                                        <div className="invalid-feedback d-block mt-1">
                                            <i className="bi bi-exclamation-circle me-1"></i>
                                            {errors.title}
                                        </div>
                                    )}
                                </div>

                                {/* Author Input */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{ fontSize: '13px' }} htmlFor="author">
                                        Author Name <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-with-icon">
                                        <i className="bi bi-person-circle input-icon"></i>
                                        <input
                                            id="author"
                                            className={`form-control ${errors.author ? 'is-invalid' : ''}`}
                                            type="text"
                                            placeholder="e.g. Robert C. Martin"
                                            value={author}
                                            onChange={(e) => setAuthor(e.target.value)}
                                        />
                                    </div>
                                    {errors.author && (
                                        <div className="invalid-feedback d-block mt-1">
                                            <i className="bi bi-exclamation-circle me-1"></i>
                                            {errors.author}
                                        </div>
                                    )}
                                </div>

                                {/* Genre Quick Select & Custom Input */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{ fontSize: '13px' }}>
                                        Genre / Category <span className="text-danger">*</span>
                                    </label>
                                    <div className="d-flex flex-wrap gap-2 mb-2">
                                        {GENRE_OPTIONS.map((g) => (
                                            <button
                                                key={g.label}
                                                type="button"
                                                onClick={() => setGenre(g.label)}
                                                className={`btn btn-sm ${genre === g.label ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                style={{
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    padding: '4px 12px',
                                                    borderWidth: '1px'
                                                }}
                                            >
                                                <i className={`bi ${g.icon} me-1`}></i>
                                                {g.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="input-with-icon">
                                        <i className="bi bi-tags input-icon"></i>
                                        <input
                                            id="genre"
                                            className={`form-control ${errors.genre ? 'is-invalid' : ''}`}
                                            type="text"
                                            placeholder="Or type custom genre..."
                                            value={genre}
                                            onChange={(e) => setGenre(e.target.value)}
                                        />
                                    </div>
                                    {errors.genre && (
                                        <div className="invalid-feedback d-block mt-1">
                                            <i className="bi bi-exclamation-circle me-1"></i>
                                            {errors.genre}
                                        </div>
                                    )}
                                </div>

                                {/* Price Input */}
                                <div className="mb-4">
                                    <label className="form-label fw-bold" style={{ fontSize: '13px' }} htmlFor="price">
                                        Price (INR ₹) <span className="text-danger">*</span>
                                    </label>
                                    <div className="input-with-icon">
                                        <span className="input-icon fw-bold" style={{ fontSize: '15px' }}>₹</span>
                                        <input
                                            id="price"
                                            className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                            type="number"
                                            placeholder="499.00"
                                            min="1"
                                            step="0.01"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                    </div>
                                    {errors.price && (
                                        <div className="invalid-feedback d-block mt-1">
                                            <i className="bi bi-exclamation-circle me-1"></i>
                                            {errors.price}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="d-flex align-items-center gap-3 pt-3 border-top">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn btn-primary px-4 py-2"
                                        style={{ borderRadius: '10px' }}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle-fill me-1"></i>
                                                Save Book
                                            </>
                                        )}
                                    </button>
                                    <Link className="btn btn-outline-secondary px-3 py-2" href="/book_read" style={{ borderRadius: '10px' }}>
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* ── Right Column: Live Interactive Book Preview ──────── */}
                <div className="col-12 col-lg-5">
                    <div className="card border-0 shadow-sm p-4" style={{
                        borderRadius: '16px',
                        background: 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)',
                        color: '#FFFFFF',
                        position: 'sticky',
                        top: '20px'
                    }}>
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <span className="badge bg-primary bg-green-25 text-primary-light border border-primary border-opacity-25" style={{ fontSize: '11px', padding: '5px 10px' }}>
                                <i className="bi bi-eye me-1"></i> LIVE PREVIEW
                            </span>
                            <i className="bi bi-bookmark-star text-warning" style={{ fontSize: '18px' }}></i>
                        </div>

                        {/* Visual 3D Book Graphic */}
                        <div className="text-center py-4 mb-3">
                            <div style={{
                                width: '130px',
                                height: '175px',
                                margin: '0 auto',
                                background: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
                                borderRadius: '6px 12px 12px 6px',
                                boxShadow: '0 16px 28px rgba(0,0,0,0.4), inset 4px 0 0 rgba(255,255,255,0.2)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                padding: '16px 12px',
                                borderLeft: '4px solid #312E81'
                            }}>
                                <div className="text-start">
                                    <span className="badge bg-white text-dark" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px' }}>
                                        {genre || 'Genre'}
                                    </span>
                                </div>
                                <div>
                                    <p className="mb-0 text-white fw-bold" style={{ fontSize: '12px', lineHeight: '1.2', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                        {title || 'Your Book Title'}
                                    </p>
                                    <small className="text-white-50 mt-1 d-block" style={{ fontSize: '10px' }}>
                                        {author || 'Author Name'}
                                    </small>
                                </div>
                            </div>
                        </div>

                        {/* Summary Details */}
                        <div className="p-3 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-muted" style={{ fontSize: '12.5px' }}>Category</span>
                                <span className="fw-semibold" style={{ fontSize: '13px' }}>{genre || '—'}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-muted" style={{ fontSize: '12.5px' }}>Author</span>
                                <span className="fw-semibold" style={{ fontSize: '13px' }}>{author || '—'}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
                                <span className="text-muted" style={{ fontSize: '12.5px' }}>Estimated Price</span>
                                <span className="text-success fw-bold" style={{ fontSize: '16px' }}>
                                    {price ? `₹${Number(price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹0.00'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookCreate;

