"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";
import gsap from "gsap";

// Genre color styling helper
const GENRE_COLOR_MAP = {
    'DC Comics': { bg: 'rgba(99, 102, 241, 0.12)', color: '#6366F1', border: 'rgba(99, 102, 241, 0.25)', gradient: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)', badge: '#EEF2FF' },
    'Marvel Comics': { bg: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', border: 'rgba(239, 68, 68, 0.25)', gradient: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)', badge: '#FEF2F2' },
    'Marvel': { bg: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', border: 'rgba(239, 68, 68, 0.25)', gradient: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)', badge: '#FEF2F2' },
    'Finance': { bg: 'rgba(16, 185, 129, 0.12)', color: '#10B981', border: 'rgba(16, 185, 129, 0.25)', gradient: 'linear-gradient(135deg, #10B981 0%, #047857 100%)', badge: '#ECFDF5' },
    'Fantasy': { bg: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6', border: 'rgba(139, 92, 246, 0.25)', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', badge: '#F5F3FF' },
    'Fiction': { bg: 'rgba(14, 165, 233, 0.12)', color: '#0EA5E9', border: 'rgba(14, 165, 233, 0.25)', gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)', badge: '#F0F9FF' },
    'Non-Fiction': { bg: 'rgba(100, 116, 139, 0.12)', color: '#64748B', border: 'rgba(100, 116, 139, 0.25)', gradient: 'linear-gradient(135deg, #64748B 0%, #334155 100%)', badge: '#F8FAFC' },
    'Self-Help': { bg: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', border: 'rgba(245, 158, 11, 0.25)', gradient: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)', badge: '#FFFBEB' },
    'Dystopian': { bg: 'rgba(71, 85, 105, 0.12)', color: '#475569', border: 'rgba(71, 85, 105, 0.25)', gradient: 'linear-gradient(135deg, #475569 0%, #1E293B 100%)', badge: '#F1F5F9' },
    'Classic': { bg: 'rgba(20, 184, 166, 0.12)', color: '#14B8A6', border: 'rgba(20, 184, 166, 0.25)', gradient: 'linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)', badge: '#F0FDFA' },
    'Technology': { bg: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6', border: 'rgba(59, 130, 246, 0.25)', gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', badge: '#EFF6FF' },
    'Mystery': { bg: 'rgba(236, 72, 153, 0.12)', color: '#EC4899', border: 'rgba(236, 72, 153, 0.25)', gradient: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)', badge: '#FDF2F8' },
};

const getGenreStyle = (genre) => {
    return GENRE_COLOR_MAP[genre] || {
        bg: 'rgba(79, 70, 229, 0.12)',
        color: '#4F46E5',
        border: 'rgba(79, 70, 229, 0.25)',
        gradient: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
        badge: '#EEF2FF'
    };
};

const BookDetails = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [book, setBook] = useState(null);
    const [relatedBooks, setRelatedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);

    const containerRef = useRef(null);
    const bookCoverRef = useRef(null);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${API_BASE_URL}/books/${id}`)
            .then((response) => {
                setBook(response.data);
                setLoading(false);

                // Fetch other books in the same genre for recommendations
                axios.get(`${API_BASE_URL}/books`)
                    .then((allRes) => {
                        if (Array.isArray(allRes.data)) {
                            const related = allRes.data
                                .filter((b) => b.id !== Number(id) && b.genre === response.data.genre)
                                .slice(0, 3);
                            setRelatedBooks(related);
                        }
                    })
                    .catch(() => {});
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    // GSAP Entrance Animation
    useEffect(() => {
        if (!loading && book && containerRef.current) {
            const ctx = gsap.context(() => {
                const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

                tl.from(".animate-header", {
                    opacity: 0,
                    y: -20,
                    duration: 0.6
                })
                .from(".animate-hero-card", {
                    opacity: 0,
                    scale: 0.96,
                    duration: 0.7,
                }, "-=0.3")
                .from(".animate-book-3d", {
                    opacity: 0,
                    x: -30,
                    rotationY: -15,
                    duration: 0.8,
                    ease: "back.out(1.4)"
                }, "-=0.5")
                .from(".animate-badge-item", {
                    opacity: 0,
                    y: 15,
                    stagger: 0.1,
                    duration: 0.5
                }, "-=0.4")
                .from(".animate-spec-card", {
                    opacity: 0,
                    y: 20,
                    stagger: 0.12,
                    duration: 0.6
                }, "-=0.3")
                .from(".animate-related", {
                    opacity: 0,
                    y: 25,
                    duration: 0.6
                }, "-=0.2");
            }, containerRef);

            return () => ctx.revert();
        }
    }, [loading, book]);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await axios.delete(`${API_BASE_URL}/books/${id}`);
            router.push("/book_read");
        } catch (err) {
            alert("Failed to delete book: " + (err.response?.data?.error || err.message));
            setIsDeleting(false);
        }
    };

    const handleCopyLink = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            showToast("Book specification link copied to clipboard!");
        }
    };

    const handlePrint = () => {
        if (typeof window !== "undefined") {
            window.print();
        }
    };

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-primary mb-3" style={{ width: '3.5rem', height: '3.5rem', borderWidth: '3px' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="fw-bold text-dark mb-1">Loading Book Details</h5>
                <p className="text-muted small">Fetching catalogue entry #{id}...</p>
            </div>
        );
    }

    if (!book) {
        return (
            <div style={{ maxWidth: '620px', margin: '50px auto 60px' }}>
                <div
                    className="shadow-sm text-center"
                    style={{
                        background: '#FFFFFF',
                        borderRadius: '24px',
                        border: '1px solid var(--border-subtle)',
                        padding: '40px 30px',
                        overflow: 'hidden'
                    }}
                >
                    <div className="d-inline-flex align-items-center gap-2 mb-3">
                        <span
                            style={{
                                fontSize: '11px',
                                fontWeight: 800,
                                background: 'rgba(239, 68, 68, 0.12)',
                                color: '#EF4444',
                                padding: '3px 10px',
                                borderRadius: '20px',
                                border: '1px solid rgba(239, 68, 68, 0.25)'
                            }}
                        >
                            404 • RECORD NOT FOUND
                        </span>
                    </div>

                    <div
                        style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
                            color: '#EF4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '30px',
                            margin: '0 auto 18px',
                            boxShadow: '0 8px 20px rgba(239, 68, 68, 0.2)'
                        }}
                    >
                        <i className="bi bi-journal-x"></i>
                    </div>

                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                        Publication #{id} Not Found
                    </h3>

                    <p className="text-muted" style={{ fontSize: '13.5px', maxWidth: '420px', margin: '0 auto 24px' }}>
                        This catalogue record does not exist or may have been deleted from the database.
                    </p>

                    <div className="d-flex align-items-center justify-content-center gap-3">
                        <Link
                            href="/book_read"
                            className="btn text-white d-inline-flex align-items-center gap-2"
                            style={{
                                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '10px 20px',
                                fontSize: '13.5px',
                                fontWeight: 700,
                                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                                textDecoration: 'none'
                            }}
                        >
                            <i className="bi bi-arrow-left"></i> Return to Catalogue
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const gStyle = getGenreStyle(book.genre);

    return (
        <div ref={containerRef} style={{ maxWidth: '1080px', margin: '0 auto', paddingBottom: '60px' }}>
            {/* ── Toast Notification ────────────────────────────── */}
            {toastMessage && (
                <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1090 }}>
                    <div className="toast show align-items-center text-white bg-dark border-0 shadow-lg" role="alert" style={{ borderRadius: '12px', background: '#0F172A' }}>
                        <div className="d-flex">
                            <div className="toast-body d-flex align-items-center gap-2 py-3 px-3">
                                <i className="bi bi-check-circle-fill text-success fs-5"></i>
                                <span style={{ fontSize: '13.5px', fontWeight: 500 }}>{toastMessage}</span>
                            </div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToastMessage(null)}></button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Header Breadcrumbs & Action Bar ───────────────── */}
            <div className="animate-header d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-1">
                <div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-1" style={{ fontSize: '13px' }}>
                            <li className="breadcrumb-item">
                                <Link href="/book_read" className="text-decoration-none text-muted">
                                    <i className="bi bi-house-door me-1"></i> Library
                                </Link>
                            </li>
                            <li className="breadcrumb-item">
                                <span className="text-muted">{book.genre || 'General'}</span>
                            </li>
                            <li className="breadcrumb-item active text-primary fw-semibold" aria-current="page">
                                Entry #{book.id}
                            </li>
                        </ol>
                    </nav>
                    <h2 className="mb-0 fw-bold" style={{ fontSize: '24px', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                        Book Specification
                    </h2>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <button
                        type="button"
                        onClick={handleCopyLink}
                        className="btn btn-light border bg-white shadow-xs px-3 py-2 text-secondary d-flex align-items-center gap-2"
                        style={{ borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}
                        title="Share Specification"
                    >
                        <i className="bi bi-share"></i>
                        <span>Share</span>
                    </button>

                    <button
                        type="button"
                        onClick={handlePrint}
                        className="btn btn-light border bg-white shadow-xs px-3 py-2 text-secondary d-flex align-items-center gap-2"
                        style={{ borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}
                        title="Print Spec Sheet"
                    >
                        <i className="bi bi-printer"></i>
                        <span>Print</span>
                    </button>

                    <Link 
                        href="/book_read" 
                        className="btn btn-light border bg-white shadow-xs px-3 py-2 text-secondary d-flex align-items-center gap-2"
                        style={{ borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}
                    >
                        <i className="bi bi-arrow-left"></i>
                        <span>Back</span>
                    </Link>
                </div>
            </div>

            {/* ── Main Showcase Hero Card ────────────────────────── */}
            <div 
                className="animate-hero-card card border-0 shadow-sm mb-4 overflow-hidden" 
                style={{ 
                    borderRadius: '24px', 
                    background: '#FFFFFF', 
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' 
                }}
            >
                {/* Hero Gradient Header */}
                <div 
                    className="p-4 p-md-5 text-white position-relative" 
                    style={{
                        background: 'linear-gradient(135deg, #070e24 0%, #101c44 45%, #1e1b4b 100%)',
                        borderBottom: '1px solid rgba(255,255,255,0.08)'
                    }}
                >
                    <div className="row g-4 align-items-center">
                        {/* 3D Book Cover Spine */}
                        <div className="col-12 col-md-auto d-flex justify-content-center justify-content-md-start">
                            <div 
                                ref={bookCoverRef}
                                className="animate-book-3d position-relative"
                                style={{
                                    width: '140px',
                                    height: '190px',
                                    borderRadius: '12px',
                                    background: gStyle.gradient,
                                    boxShadow: '0 18px 36px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.15)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    padding: '16px 14px',
                                    color: '#FFFFFF',
                                    transform: 'perspective(600px) rotateY(-8deg)',
                                    transition: 'transform 0.3s ease'
                                }}
                            >
                                <div className="d-flex justify-content-between align-items-start">
                                    <span style={{ fontSize: '11px', fontWeight: 800, opacity: 0.8, letterSpacing: '0.05em' }}>
                                        #{book.id}
                                    </span>
                                    <i className="bi bi-bookmark-fill" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}></i>
                                </div>

                                <div className="text-center my-auto">
                                    <i className="bi bi-book-half mb-2 d-block" style={{ fontSize: '32px' }}></i>
                                    <div 
                                        style={{ 
                                            fontSize: '13px', 
                                            fontWeight: 800, 
                                            lineHeight: '1.25',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {book.title}
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-end" style={{ fontSize: '10.5px', opacity: 0.85, borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '6px' }}>
                                    <span className="text-truncate" style={{ maxWidth: '90px' }}>{book.author}</span>
                                    <i className="bi bi-check2-circle"></i>
                                </div>
                            </div>
                        </div>

                        {/* Title & Metadata */}
                        <div className="col-12 col-md">
                            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                                <span 
                                    className="animate-badge-item badge px-3 py-1.5"
                                    style={{
                                        background: gStyle.bg,
                                        color: gStyle.color,
                                        border: `1px solid ${gStyle.border}`,
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: 700
                                    }}
                                >
                                    <i className="bi bi-tag-fill me-1"></i>
                                    {book.genre || 'General'}
                                </span>

                                <span className="animate-badge-item badge rounded-pill px-3 py-1.5 bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '11.5px', fontWeight: 600 }}>
                                    <i className="bi bi-check-circle-fill me-1"></i> In Stock & Catalogued
                                </span>

                                <span className="animate-badge-item text-white-50 font-monospace small">
                                    Record ID #{book.id}
                                </span>
                            </div>

                            <h1 className="fw-bold text-white mb-2" style={{ fontSize: '30px', letterSpacing: '-0.03em', lineHeight: '1.2' }}>
                                {book.title}
                            </h1>

                            <div className="d-flex flex-wrap align-items-center gap-4 text-white-50 mt-3" style={{ fontSize: '14.5px' }}>
                                <div className="d-flex align-items-center gap-2">
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                                        {(book.author || 'A').charAt(0).toUpperCase()}
                                    </div>
                                    <span>Author: <strong className="text-white">{book.author || 'Unknown'}</strong></span>
                                </div>

                                <div className="d-flex align-items-center gap-1.5">
                                    <i className="bi bi-currency-rupee text-success"></i>
                                    <span>Price: <strong className="text-success fw-bold">₹{Number(book.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Specification Grid */}
                <div className="p-4 p-md-5">
                    <h5 className="fw-bold mb-4" style={{ color: 'var(--text-primary)', fontSize: '16px' }}>
                        Catalogue Specification & Attributes
                    </h5>

                    <div className="row g-3 mb-4">
                        {/* Title Spec */}
                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="animate-spec-card p-3.5 rounded-3 h-100" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                <small className="text-muted text-uppercase fw-bold d-block mb-1.5" style={{ fontSize: '11px', letterSpacing: '0.04em' }}>
                                    <i className="bi bi-journal-text text-primary me-1"></i> Book Title
                                </small>
                                <span className="fw-bold d-block text-truncate" style={{ fontSize: '14.5px', color: 'var(--text-primary)' }} title={book.title}>
                                    {book.title}
                                </span>
                            </div>
                        </div>

                        {/* Author Spec */}
                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="animate-spec-card p-3.5 rounded-3 h-100" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                <small className="text-muted text-uppercase fw-bold d-block mb-1.5" style={{ fontSize: '11px', letterSpacing: '0.04em' }}>
                                    <i className="bi bi-person-fill text-info me-1"></i> Author
                                </small>
                                <span className="fw-bold d-block text-truncate" style={{ fontSize: '14.5px', color: 'var(--text-primary)' }} title={book.author}>
                                    {book.author || '—'}
                                </span>
                            </div>
                        </div>

                        {/* Genre Spec */}
                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="animate-spec-card p-3.5 rounded-3 h-100" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                                <small className="text-muted text-uppercase fw-bold d-block mb-1.5" style={{ fontSize: '11px', letterSpacing: '0.04em' }}>
                                    <i className="bi bi-tags-fill text-secondary me-1"></i> Category / Genre
                                </small>
                                <span className="fw-bold d-block" style={{ fontSize: '14.5px', color: gStyle.color }}>
                                    {book.genre || 'General'}
                                </span>
                            </div>
                        </div>

                        {/* Price Spec */}
                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="animate-spec-card p-3.5 rounded-3 h-100" style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                                <small className="text-success text-uppercase fw-bold d-block mb-1.5" style={{ fontSize: '11px', letterSpacing: '0.04em' }}>
                                    <i className="bi bi-currency-rupee me-1"></i> Retail Price
                                </small>
                                <span className="fw-bold text-success" style={{ fontSize: '18px' }}>
                                    ₹{Number(book.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons Toolbar */}
                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-4 border-top">
                        <div className="d-flex align-items-center gap-2">
                            <Link 
                                href={`/book_edit/${book.id}`} 
                                className="btn btn-primary px-4 py-2.5 d-flex align-items-center gap-2 fw-semibold shadow-sm"
                                style={{ borderRadius: '12px', fontSize: '13.5px' }}
                            >
                                <i className="bi bi-pencil-square"></i>
                                <span>Edit Book Details</span>
                            </Link>

                            <button
                                type="button"
                                onClick={() => setDeleteModalOpen(true)}
                                className="btn btn-outline-danger px-3.5 py-2.5 d-flex align-items-center gap-2 fw-semibold"
                                style={{ borderRadius: '12px', fontSize: '13.5px' }}
                            >
                                <i className="bi bi-trash3-fill"></i>
                                <span>Delete Book</span>
                            </button>
                        </div>

                        <Link 
                            href="/book_read" 
                            className="btn btn-light border px-4 py-2.5 text-secondary fw-semibold"
                            style={{ borderRadius: '12px', fontSize: '13.5px' }}
                        >
                            <i className="bi bi-grid-fill me-1.5 text-primary"></i>
                            <span>Back to Catalogue</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Related Books from Same Genre ──────────────────── */}
            {relatedBooks.length > 0 && (
                <div className="animate-related mt-5">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                            <h5 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)', fontSize: '17px' }}>
                                More from {book.genre}
                            </h5>
                            <small className="text-muted">Explore similar titles in your collection</small>
                        </div>
                        <Link href="/book_read" className="btn btn-link text-primary p-0 fw-semibold text-decoration-none small">
                            View All <i className="bi bi-arrow-right"></i>
                        </Link>
                    </div>

                    <div className="row g-3">
                        {relatedBooks.map((rel) => {
                            const relStyle = getGenreStyle(rel.genre);

                            return (
                                <div key={rel.id} className="col-12 col-md-4">
                                    <div 
                                        className="card border-0 shadow-sm p-3 h-100 book-grid-card" 
                                        style={{ borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0', transition: 'all 0.2s' }}
                                    >
                                        <div className="d-flex align-items-start gap-3 mb-2">
                                            <div style={{
                                                width: '36px',
                                                height: '46px',
                                                borderRadius: '8px',
                                                background: relStyle.gradient,
                                                color: '#FFFFFF',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '16px',
                                                flexShrink: 0
                                            }}>
                                                <i className="bi bi-book"></i>
                                            </div>
                                            <div className="flex-grow-1 min-w-0">
                                                <Link 
                                                    href={`/book_details/${rel.id}`}
                                                    className="fw-bold text-dark text-decoration-none d-block text-truncate" 
                                                    style={{ fontSize: '14px' }}
                                                >
                                                    {rel.title}
                                                </Link>
                                                <small className="text-muted d-block text-truncate" style={{ fontSize: '11.5px' }}>
                                                    By {rel.author}
                                                </small>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-auto">
                                            <span className="fw-bold text-success" style={{ fontSize: '13.5px' }}>
                                                ₹{Number(rel.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </span>
                                            <Link 
                                                href={`/book_details/${rel.id}`} 
                                                className="btn btn-sm btn-light border px-2.5 py-1 text-secondary"
                                                style={{ borderRadius: '6px', fontSize: '11.5px', fontWeight: 600 }}
                                            >
                                                View Spec
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Delete Confirmation Modal ──────────────────────── */}
            {deleteModalOpen && (
                <div 
                    className="modal fade show d-block" 
                    tabIndex="-1" 
                    style={{ background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1060 }}
                >
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '440px' }}>
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                            <div className="p-4 text-center">
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto 16px' }}>
                                    <i className="bi bi-trash3-fill"></i>
                                </div>
                                
                                <h5 className="fw-bold text-dark mb-1">Delete Book Specification?</h5>
                                <p className="text-muted small mb-3">
                                    Are you sure you want to permanently remove <strong className="text-dark">&ldquo;{book.title}&rdquo;</strong> from your library database?
                                </p>

                                <div className="p-3 bg-light rounded-3 text-start mb-3" style={{ fontSize: '12.5px' }}>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="text-muted">Author:</span>
                                        <span className="fw-semibold text-dark">{book.author}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="text-muted">Genre:</span>
                                        <span className="fw-semibold text-dark">{book.genre}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Price:</span>
                                        <span className="fw-bold text-success">₹{Number(book.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button 
                                        type="button" 
                                        className="btn btn-light border flex-fill py-2 fw-semibold" 
                                        onClick={() => setDeleteModalOpen(false)}
                                        disabled={isDeleting}
                                        style={{ borderRadius: '10px' }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-danger flex-fill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2" 
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        style={{ borderRadius: '10px' }}
                                    >
                                        {isDeleting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-trash3-fill"></i>
                                                Confirm Delete
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookDetails;
