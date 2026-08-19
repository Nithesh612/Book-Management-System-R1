"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";

const BookDetails = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${API_BASE_URL}/books/${id}`)
            .then((response) => {
                setBook(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${book?.title}"?`)) {
            try {
                await axios.delete(`${API_BASE_URL}/books/${id}`);
                router.push("/book_read");
            } catch (err) {
                alert("Failed to delete book: " + (err.response?.data?.error || err.message));
            }
        }
    };

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted fw-semibold">Loading book information...</p>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="text-center py-5">
                <h5 className="text-danger fw-bold">Book Not Found</h5>
                <p className="text-muted">The requested book entry does not exist or has been deleted.</p>
                <Link href="/book_read" className="btn btn-primary btn-sm">
                    Back to Library
                </Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '850px', margin: '0 auto', paddingBottom: '40px' }}>
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2">
                <div>
                    <h2 className="mb-1" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                        Book Details
                    </h2>
                    <p className="mb-0 text-muted" style={{ fontSize: '13.5px' }}>
                        Detailed specification for entry #{id}
                    </p>
                </div>
                <Link href="/book_read" className="btn btn-outline-secondary btn-sm shadow-sm" style={{ borderRadius: '10px' }}>
                    <i className="bi bi-arrow-left me-1"></i>
                    Back to Library
                </Link>
            </div>

            {/* Main Detail Card */}
            <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '18px', background: '#FFFFFF' }}>
                {/* Hero Top Banner */}
                <div className="p-4 p-md-5 text-white position-relative" style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
                    borderBottom: '1px solid rgba(255,255,255,0.08)'
                }}>
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                        <span className="badge px-3 py-2" style={{
                            background: 'rgba(255, 255, 255, 0.12)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '0.04em'
                        }}>
                            <i className="bi bi-bookmark-check-fill me-1 text-info"></i> ENTRY #{id}
                        </span>

                        <span style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            padding: '4px 12px',
                            borderRadius: '20px',
                            background: 'rgba(99, 102, 241, 0.3)',
                            color: '#E0E7FF',
                            border: '1px solid rgba(165, 180, 252, 0.3)'
                        }}>
                            {book.genre || 'General'}
                        </span>
                    </div>

                    <h1 className="fw-bold mb-2" style={{ fontSize: '28px', letterSpacing: '-0.02em', lineHeight: '1.25' }}>
                        {book.title}
                    </h1>
                    <p className="text-white-50 mb-0 d-flex align-items-center gap-2" style={{ fontSize: '15px' }}>
                        <i className="bi bi-person-fill text-warning"></i>
                        <span>By <strong className="text-white">{book.author}</strong></span>
                    </p>
                </div>

                {/* Key Spec Grid */}
                <div className="p-4 p-md-5">
                    <div className="row g-3 mb-4">
                        <div className="col-12 col-md-4">
                            <div className="p-3 rounded-3" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                <small className="text-muted text-uppercase fw-bold d-block mb-1" style={{ fontSize: '11px' }}>
                                    <i className="bi bi-tag-fill text-primary me-1"></i> Genre
                                </small>
                                <span className="fw-bold" style={{ fontSize: '15px', color: 'var(--text-primary)' }}>
                                    {book.genre || '—'}
                                </span>
                            </div>
                        </div>

                        <div className="col-12 col-md-4">
                            <div className="p-3 rounded-3" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                <small className="text-muted text-uppercase fw-bold d-block mb-1" style={{ fontSize: '11px' }}>
                                    <i className="bi bi-person-badge-fill text-info me-1"></i> Author
                                </small>
                                <span className="fw-bold" style={{ fontSize: '15px', color: 'var(--text-primary)' }}>
                                    {book.author || '—'}
                                </span>
                            </div>
                        </div>

                        <div className="col-12 col-md-4">
                            <div className="p-3 rounded-3" style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                <small className="text-success text-uppercase fw-bold d-block mb-1" style={{ fontSize: '11px' }}>
                                    <i className="bi bi-currency-rupee me-1"></i> Price (INR)
                                </small>
                                <span className="fw-bold text-success" style={{ fontSize: '18px' }}>
                                    {book.price != null ? `₹${Number(book.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-3 border-top">
                        <div className="d-flex align-items-center gap-2">
                            <Link href={`/book_edit/${book.id}`} className="btn btn-primary px-4 py-2" style={{ borderRadius: '10px' }}>
                                <i className="bi bi-pencil-square me-1"></i>
                                Edit Book
                            </Link>

                            <button
                                type="button"
                                onClick={handleDelete}
                                className="btn btn-outline-danger px-3 py-2"
                                style={{ borderRadius: '10px' }}
                            >
                                <i className="bi bi-trash3-fill me-1"></i>
                                Delete
                            </button>
                        </div>

                        <Link href="/book_read" className="btn btn-light border px-3 py-2" style={{ borderRadius: '10px' }}>
                            <i className="bi bi-grid-fill me-1"></i>
                            Back to Catalogue
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;

