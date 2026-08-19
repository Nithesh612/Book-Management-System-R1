"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";

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

const BookEdit = () => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [genre, setGenre] = useState("");
    const [price, setPrice] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    useEffect(() => {
        axios.get(`${API_BASE_URL}/books/${id}`)
            .then((response) => {
                setTitle(response.data.title || "");
                setAuthor(response.data.author || "");
                setGenre(response.data.genre || "");
                setPrice(response.data.price != null ? String(response.data.price) : "");
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching book:", err);
                alert("Failed to load book data");
                router.push("/book_read");
            });
    }, [id, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!title.trim()) newErrors.title = 'Title is required';
        if (!author.trim()) newErrors.author = 'Author is required';
        if (!genre.trim()) newErrors.genre = 'Genre is required';
        if (!price || Number(price) <= 0) newErrors.price = 'Please provide a valid price';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                setIsSaving(true);
                const bookobj = { 
                    title: title.trim(), 
                    author: author.trim(), 
                    genre: genre.trim(), 
                    price: Number(price) 
                };
                await axios.put(`${API_BASE_URL}/books/${id}`, bookobj);
                router.push("/book_read/");
            } catch (err) {
                console.error(err);
                alert("Failed to update book: " + (err.response?.data?.error || err.message));
            } finally {
                setIsSaving(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted fw-semibold">Loading book details...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '40px' }}>
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2">
                <div>
                    <h2 className="mb-1" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                        Edit Book Entry
                    </h2>
                    <p className="mb-0 text-muted" style={{ fontSize: '13.5px' }}>
                        Update metadata and pricing for entry #{id}
                    </p>
                </div>
                <Link href="/book_read" className="btn btn-outline-secondary btn-sm shadow-sm">
                    <i className="bi bi-arrow-left"></i>
                    Back to Catalogue
                </Link>
            </div>

            <div className="row g-4 align-items-start">
                {/* Left Form */}
                <div className="col-12 col-lg-7">
                    <div className="form-card shadow-sm border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                        <div className="form-card-header p-4" style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)', borderBottom: '1px solid #E2E8F0' }}>
                            <div className="d-flex align-items-center gap-3">
                                <div style={{ 
                                    width: '44px', 
                                    height: '44px', 
                                    borderRadius: '12px', 
                                    background: '#F59E0B', 
                                    color: '#fff', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontSize: '20px',
                                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                                }}>
                                    <i className="bi bi-pencil-square"></i>
                                </div>
                                <div>
                                    <h5 className="mb-0" style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '16px' }}>Modify Details</h5>
                                    <span className="text-muted" style={{ fontSize: '12.5px' }}>Editing &ldquo;{title}&rdquo;</span>
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
                                                    padding: '4px 12px'
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
                                        disabled={isSaving} 
                                        className="btn btn-primary px-4 py-2"
                                        style={{ borderRadius: '10px' }}
                                    >
                                        {isSaving ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle-fill me-1"></i>
                                                Save Changes
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

                {/* Right Live Preview */}
                <div className="col-12 col-lg-5">
                    <div className="card border-0 shadow-sm p-4" style={{ 
                        borderRadius: '16px', 
                        background: 'linear-gradient(145deg, #1E293B 0%, #0F172A 100%)',
                        color: '#FFFFFF',
                        position: 'sticky',
                        top: '20px'
                    }}>
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <span className="badge bg-primary bg-opacity-25 text-primary-light border border-primary border-opacity-25" style={{ fontSize: '11px', padding: '5px 10px' }}>
                                <i className="bi bi-pencil me-1"></i> LIVE PREVIEW
                            </span>
                            <span className="text-muted small">ID #{id}</span>
                        </div>

                        {/* Visual 3D Book Graphic */}
                        <div className="text-center py-4 mb-3">
                            <div style={{
                                width: '130px',
                                height: '175px',
                                margin: '0 auto',
                                background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                                borderRadius: '6px 12px 12px 6px',
                                boxShadow: '0 16px 28px rgba(0,0,0,0.4), inset 4px 0 0 rgba(255,255,255,0.2)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                padding: '16px 12px',
                                borderLeft: '4px solid #1E40AF'
                            }}>
                                <div className="text-start">
                                    <span className="badge bg-white text-dark" style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px' }}>
                                        {genre || 'Genre'}
                                    </span>
                                </div>
                                <div>
                                    <p className="mb-0 text-white fw-bold" style={{ fontSize: '12px', lineHeight: '1.2', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                        {title || 'Book Title'}
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
                                <span className="text-muted" style={{ fontSize: '12.5px' }}>Price</span>
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

export default BookEdit;