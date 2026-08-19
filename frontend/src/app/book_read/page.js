'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

const BookList = () => {
    const [bookdata, setBookData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const router = useRouter();

    const fetchBooks = () => {
        axios.get(`${API_BASE_URL}/books`)
            .then((response) => {
                setBookData(response.data);
                setLoading(false);
            })
            .catch((errmsg) => {
                console.error(errmsg);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleDelete = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                await axios.delete(`${API_BASE_URL}/books/${id}`);
                setBookData((prev) => prev.filter((b) => b.id !== id));
            } catch (err) {
                alert("Failed to delete book: " + (err.response?.data?.error || err.message));
            }
        }
    };

    // Filter books based on search term & genre
    const filteredBooks = useMemo(() => {
        return bookdata.filter((book) => {
            const matchesSearch = 
                book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.genre?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
            return matchesSearch && matchesGenre;
        });
    }, [bookdata, searchTerm, selectedGenre]);

    const genresList = useMemo(() => {
        const unique = [...new Set(bookdata.map((b) => b.genre).filter(Boolean))];
        return ['All', ...unique];
    }, [bookdata]);

    const totalRevenue = useMemo(() => {
        return bookdata.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
    }, [bookdata]);

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center py-5">
                <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted fw-semibold">Loading catalogue data...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* ── Page Header ───────────────────────────── */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div>
                    <h2 className="mb-1" style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                        Book Library
                    </h2>
                    <p className="mb-0 text-muted" style={{ fontSize: '13.5px' }}>
                        Manage, search, and organize your entire book catalogue
                    </p>
                </div>
                <Link href="/book_create" className="btn btn-primary px-3 py-2 shadow-sm" style={{ borderRadius: '10px' }}>
                    <i className="bi bi-plus-circle-fill me-1"></i>
                    Add New Book
                </Link>
            </div>

            {/* ── Stat Metric Cards ────────────────────────────── */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '14px', background: '#FFFFFF' }}>
                        <div className="d-flex align-items-center gap-3">
                            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(79, 70, 229, 0.1)', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                                <i className="bi bi-journal-bookmark-fill"></i>
                            </div>
                            <div>
                                <h4 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)', fontSize: '20px' }}>{bookdata.length}</h4>
                                <span className="text-muted" style={{ fontSize: '12px' }}>Total Titles</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '14px', background: '#FFFFFF' }}>
                        <div className="d-flex align-items-center gap-3">
                            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                                <i className="bi bi-currency-rupee"></i>
                            </div>
                            <div>
                                <h4 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)', fontSize: '20px' }}>
                                    ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                </h4>
                                <span className="text-muted" style={{ fontSize: '12px' }}>Catalogue Value</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '14px', background: '#FFFFFF' }}>
                        <div className="d-flex align-items-center gap-3">
                            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.1)', color: '#06B6D4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                                <i className="bi bi-tags-fill"></i>
                            </div>
                            <div>
                                <h4 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)', fontSize: '20px' }}>
                                    {genresList.length > 1 ? genresList.length - 1 : 0}
                                </h4>
                                <span className="text-muted" style={{ fontSize: '12px' }}>Distinct Genres</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '14px', background: '#FFFFFF' }}>
                        <div className="d-flex align-items-center gap-3">
                            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                                <i className="bi bi-people-fill"></i>
                            </div>
                            <div>
                                <h4 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)', fontSize: '20px' }}>
                                    {[...new Set(bookdata.map((b) => b.author).filter(Boolean))].length}
                                </h4>
                                <span className="text-muted" style={{ fontSize: '12px' }}>Authors</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main Book Table Card ─────────────────────────── */}
            <div className="card border-0 shadow-sm mb-5" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                {/* Search & Filter Header */}
                <div className="p-3 p-md-4 bg-white border-bottom">
                    <div className="row g-3 align-items-center justify-content-between">
                        {/* Search Input */}
                        <div className="col-12 col-md-5">
                            <div className="input-with-icon position-relative">
                                <i className="bi bi-search position-absolute text-muted" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)' }}></i>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by title, author, or genre..."
                                    style={{ paddingLeft: '38px', borderRadius: '10px', fontSize: '13.5px' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Genre Filter Pills */}
                        <div className="col-12 col-md-7 d-flex flex-wrap align-items-center justify-content-md-end gap-2">
                            <span className="text-muted me-1 small fw-semibold">Filter:</span>
                            {genresList.map((g) => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => setSelectedGenre(g)}
                                    className={`btn btn-sm ${selectedGenre === g ? 'btn-primary' : 'btn-light border'}`}
                                    style={{ borderRadius: '20px', fontSize: '12px', padding: '4px 12px' }}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table Content */}
                {filteredBooks.length === 0 ? (
                    <div className="text-center py-5 px-3">
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.08)', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px' }}>
                            <i className="bi bi-book"></i>
                        </div>
                        <h6 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                            {searchTerm || selectedGenre !== 'All' ? 'No matching books found' : 'No books in library'}
                        </h6>
                        <p className="text-muted small mb-3">
                            {searchTerm || selectedGenre !== 'All' ? 'Try adjusting your search query or genre filter' : 'Add your first book entry to get started.'}
                        </p>
                        {searchTerm || selectedGenre !== 'All' ? (
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => { setSearchTerm(''); setSelectedGenre('All'); }}>
                                Clear Filters
                            </button>
                        ) : (
                            <Link href="/book_create" className="btn btn-primary btn-sm">
                                <i className="bi bi-plus-lg me-1"></i> Add Book
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table align-middle table-hover mb-0">
                            <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                <tr>
                                    <th className="py-3 px-4 text-muted small text-uppercase fw-bold" style={{ width: '60px' }}>#</th>
                                    <th className="py-3 px-3 text-muted small text-uppercase fw-bold">Book Details</th>
                                    <th className="py-3 px-3 text-muted small text-uppercase fw-bold">Author</th>
                                    <th className="py-3 px-3 text-muted small text-uppercase fw-bold">Genre</th>
                                    <th className="py-3 px-3 text-muted small text-uppercase fw-bold">Price</th>
                                    <th className="py-3 px-4 text-muted small text-uppercase fw-bold text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBooks.map((book, idx) => (
                                    <tr key={book.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                        <td className="py-3 px-4 text-muted small fw-semibold">
                                            {idx + 1}
                                        </td>
                                        <td className="py-3 px-3">
                                            <div className="d-flex align-items-center gap-3">
                                                <div style={{
                                                    width: '38px',
                                                    height: '48px',
                                                    borderRadius: '6px',
                                                    background: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
                                                    color: '#FFFFFF',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '16px',
                                                    boxShadow: '0 2px 6px rgba(79, 70, 229, 0.25)',
                                                    flexShrink: 0
                                                }}>
                                                    <i className="bi bi-journal-text"></i>
                                                </div>
                                                <div>
                                                    <h6 className="mb-0 fw-bold" style={{ color: 'var(--text-primary)', fontSize: '14px' }}>
                                                        {book.title}
                                                    </h6>
                                                    <small className="text-muted" style={{ fontSize: '11.5px' }}>
                                                        Entry #{book.id}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-3 fw-medium text-secondary" style={{ fontSize: '13.5px' }}>
                                            {book.author || '—'}
                                        </td>
                                        <td className="py-3 px-3">
                                            <span style={{
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                background: 'rgba(79, 70, 229, 0.08)',
                                                color: '#4F46E5',
                                                border: '1px solid rgba(79, 70, 229, 0.2)'
                                            }}>
                                                {book.genre || 'General'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3">
                                            <span className="fw-bold text-success" style={{ fontSize: '14px' }}>
                                                ₹{Number(book.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-end">
                                            <Link 
                                                href={`/book_details/${book.id}`}
                                                className="btn btn-sm btn-outline-primary px-3 py-1 shadow-xs"
                                                style={{ borderRadius: '8px', fontSize: '12px' }}
                                            >
                                                <i className="bi bi-eye-fill me-1"></i> View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookList;
