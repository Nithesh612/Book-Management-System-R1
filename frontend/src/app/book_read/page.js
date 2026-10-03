'use client';
import Link from 'next/link';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

// Genre color styling helper
const GENRE_COLOR_MAP = {
    'DC Comics': { bg: 'rgba(99, 102, 241, 0.12)', color: '#6366F1', border: 'rgba(99, 102, 241, 0.25)', gradient: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)' },
    'Marvel Comics': { bg: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', border: 'rgba(239, 68, 68, 0.25)', gradient: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)' },
    'Marvel': { bg: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', border: 'rgba(239, 68, 68, 0.25)', gradient: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)' },
    'Finance': { bg: 'rgba(16, 185, 129, 0.12)', color: '#10B981', border: 'rgba(16, 185, 129, 0.25)', gradient: 'linear-gradient(135deg, #10B981 0%, #047857 100%)' },
    'Fantasy': { bg: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6', border: 'rgba(139, 92, 246, 0.25)', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)' },
    'Fiction': { bg: 'rgba(14, 165, 233, 0.12)', color: '#0EA5E9', border: 'rgba(14, 165, 233, 0.25)', gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)' },
    'Non-Fiction': { bg: 'rgba(100, 116, 139, 0.12)', color: '#64748B', border: 'rgba(100, 116, 139, 0.25)', gradient: 'linear-gradient(135deg, #64748B 0%, #334155 100%)' },
    'Self-Help': { bg: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B', border: 'rgba(245, 158, 11, 0.25)', gradient: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)' },
    'Dystopian': { bg: 'rgba(71, 85, 105, 0.12)', color: '#475569', border: 'rgba(71, 85, 105, 0.25)', gradient: 'linear-gradient(135deg, #475569 0%, #1E293B 100%)' },
    'Classic': { bg: 'rgba(20, 184, 166, 0.12)', color: '#14B8A6', border: 'rgba(20, 184, 166, 0.25)', gradient: 'linear-gradient(135deg, #14B8A6 0%, #0F766E 100%)' },
    'Technology': { bg: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6', border: 'rgba(59, 130, 246, 0.25)', gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)' },
    'Mystery': { bg: 'rgba(236, 72, 153, 0.12)', color: '#EC4899', border: 'rgba(236, 72, 153, 0.25)', gradient: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)' },
};

const getGenreStyle = (genre) => {
    return GENRE_COLOR_MAP[genre] || {
        bg: 'rgba(79, 70, 229, 0.12)',
        color: '#4F46E5',
        border: 'rgba(79, 70, 229, 0.25)',
        gradient: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)'
    };
};

const PRICE_RANGES = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under ₹300', value: 'under_300', filter: (p) => p < 300 },
    { label: '₹300 - ₹500', value: '300_500', filter: (p) => p >= 300 && p <= 500 },
    { label: '₹500 - ₹1,000', value: '500_1000', filter: (p) => p > 500 && p <= 1000 },
    { label: 'Above ₹1,000', value: 'above_1000', filter: (p) => p > 1000 }
];

const SORT_OPTIONS = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Title: A → Z', value: 'title_asc' },
    { label: 'Title: Z → A', value: 'title_desc' },
    { label: 'Author: A → Z', value: 'author_asc' }
];

const BookList = () => {
    const [bookdata, setBookData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Filters & controls state
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [selectedPriceRange, setSelectedPriceRange] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    
    // Export dropdown state
    const [exportOpen, setExportOpen] = useState(false);
    const [exportScope, setExportScope] = useState('filtered'); // 'filtered' | 'all'
    const exportRef = useRef(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Details View modal state
    const [viewModal, setViewModal] = useState({ open: false, book: null });

    // Delete modal state
    const [deleteModal, setDeleteModal] = useState({ open: false, book: null, isDeleting: false });

    // Toast notification state
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const fetchBooks = (showRefresh = false) => {
        if (showRefresh) setIsRefreshing(true);
        else setLoading(true);
        setError(null);

        axios.get(`${API_BASE_URL}/books`)
            .then((response) => {
                setBookData(Array.isArray(response.data) ? response.data : []);
                setLoading(false);
                setIsRefreshing(false);
                if (showRefresh) showToast("Catalogue updated successfully!");
            })
            .catch((err) => {
                setError(err.response?.data?.error || err.message || "Failed to connect to backend server");
                setLoading(false);
                setIsRefreshing(false);
            });
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    // Close export dropdown when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (exportRef.current && !exportRef.current.contains(event.target)) {
                setExportOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset pagination when filter criteria change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedGenre, selectedPriceRange, sortBy, pageSize]);

    // Handle book deletion
    const confirmDelete = async () => {
        if (!deleteModal.book) return;
        setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
        try {
            await axios.delete(`${API_BASE_URL}/books/${deleteModal.book.id}`);
            setBookData((prev) => prev.filter((b) => b.id !== deleteModal.book.id));
            setDeleteModal({ open: false, book: null, isDeleting: false });
            showToast(`Deleted "${deleteModal.book.title}" successfully`);
        } catch (err) {
            alert("Failed to delete book: " + (err.response?.data?.error || err.message));
            setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
        }
    };

    // Calculate dynamic genre list and counts
    const genreStats = useMemo(() => {
        const counts = { All: bookdata.length };
        bookdata.forEach((b) => {
            const g = b.genre || 'Uncategorized';
            counts[g] = (counts[g] || 0) + 1;
        });
        const uniqueGenres = Object.keys(counts).filter((g) => g !== 'All').sort();
        return { list: ['All', ...uniqueGenres], counts };
    }, [bookdata]);

    // Filter and Sort Books
    const filteredBooks = useMemo(() => {
        let result = bookdata.filter((book) => {
            // Search filter
            const query = searchTerm.toLowerCase().trim();
            const matchesSearch = !query || 
                book.title?.toLowerCase().includes(query) ||
                book.author?.toLowerCase().includes(query) ||
                book.genre?.toLowerCase().includes(query) ||
                String(book.id).includes(query);

            // Genre filter
            const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;

            // Price filter
            let matchesPrice = true;
            const priceVal = Number(book.price) || 0;
            const activeRange = PRICE_RANGES.find((r) => r.value === selectedPriceRange);
            if (activeRange && activeRange.filter) {
                matchesPrice = activeRange.filter(priceVal);
            }

            return matchesSearch && matchesGenre && matchesPrice;
        });

        // Sorting
        result.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return Number(b.id) - Number(a.id);
                case 'oldest':
                    return Number(a.id) - Number(b.id);
                case 'price_asc':
                    return (Number(a.price) || 0) - (Number(b.price) || 0);
                case 'price_desc':
                    return (Number(b.price) || 0) - (Number(a.price) || 0);
                case 'title_asc':
                    return (a.title || '').localeCompare(b.title || '');
                case 'title_desc':
                    return (b.title || '').localeCompare(a.title || '');
                case 'author_asc':
                    return (a.author || '').localeCompare(b.author || '');
                default:
                    return 0;
            }
        });

        return result;
    }, [bookdata, searchTerm, selectedGenre, selectedPriceRange, sortBy]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredBooks.length / pageSize) || 1;
    const paginatedBooks = useMemo(() => {
        if (pageSize === -1) return filteredBooks;
        const start = (currentPage - 1) * pageSize;
        return filteredBooks.slice(start, start + pageSize);
    }, [filteredBooks, currentPage, pageSize]);

    // Summary calculations
    const totalRevenue = useMemo(() => {
        return bookdata.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
    }, [bookdata]);

    const avgPrice = useMemo(() => {
        if (!bookdata.length) return 0;
        return Math.round(totalRevenue / bookdata.length);
    }, [bookdata, totalRevenue]);

    const authorCount = useMemo(() => {
        return [...new Set(bookdata.map((b) => b.author?.trim()).filter(Boolean))].length;
    }, [bookdata]);

    const genreCount = useMemo(() => {
        return genreStats.list.length > 1 ? genreStats.list.length - 1 : 0;
    }, [genreStats]);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (searchTerm.trim()) count++;
        if (selectedGenre !== 'All') count++;
        if (selectedPriceRange !== 'all') count++;
        if (sortBy !== 'newest') count++;
        return count;
    }, [searchTerm, selectedGenre, selectedPriceRange, sortBy]);

    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedGenre('All');
        setSelectedPriceRange('all');
        setSortBy('newest');
    };

    // ══════════════════════════════════════════════════════
    // EXPORT FUNCTIONS (CSV / EXCEL / PDF / CLIPBOARD)
    // ══════════════════════════════════════════════════════
    const handleExport = (format) => {
        setExportOpen(false);
        const dataset = exportScope === 'all' ? bookdata : filteredBooks;
        
        if (!dataset.length) {
            alert("No records to export!");
            return;
        }

        const dateStr = new Date().toISOString().slice(0, 10);
        const filePrefix = `books_${exportScope}_${dateStr}`;

        if (format === 'csv') {
            const headers = ["ID", "Title", "Author", "Genre", "Price (INR)"];
            const rows = dataset.map((b) => [
                b.id,
                `"${(b.title || '').replace(/"/g, '""')}"`,
                `"${(b.author || '').replace(/"/g, '""')}"`,
                `"${(b.genre || '').replace(/"/g, '""')}"`,
                Number(b.price || 0).toFixed(2)
            ]);
            const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `${filePrefix}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast(`Exported ${dataset.length} books as CSV`);
        } else if (format === 'excel') {
            const tableHtml = `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                <head>
                    <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Books Library</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
                    <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
                    <style>
                        th { background-color: #4F46E5; color: #FFFFFF; font-weight: bold; padding: 10px; font-family: sans-serif; font-size: 13px; text-align: left; }
                        td { padding: 8px; border: 1px solid #E2E8F0; font-family: sans-serif; font-size: 12px; }
                        .num { text-align: right; color: #059669; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <table>
                        <thead>
                            <tr>
                                <th>#ID</th>
                                <th>Book Title</th>
                                <th>Author</th>
                                <th>Genre</th>
                                <th>Price (INR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${dataset.map((b) => `
                                <tr>
                                    <td>${b.id}</td>
                                    <td>${b.title}</td>
                                    <td>${b.author || '—'}</td>
                                    <td>${b.genre || 'General'}</td>
                                    <td class="num">${Number(b.price || 0).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
                </html>
            `;
            const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `${filePrefix}.xls`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast(`Exported ${dataset.length} books as Excel (.xls)`);
        } else if (format === 'pdf') {
            const printWindow = window.open('', '_blank');
            const totalVal = dataset.reduce((a, b) => a + (Number(b.price) || 0), 0);
            const genresCount = [...new Set(dataset.map((b) => b.genre).filter(Boolean))].length;

            const printContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>BookShelf — Library Catalogue Report</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 30px; color: #0F172A; }
                        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #4F46E5; padding-bottom: 14px; margin-bottom: 24px; }
                        .brand { font-size: 24px; font-weight: 800; color: #4F46E5; letter-spacing: -0.02em; }
                        .meta { font-size: 12px; color: #64748B; margin-top: 4px; }
                        .badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; background: #EEF2FF; color: #4F46E5; }
                        .stats-grid { display: flex; gap: 16px; margin-bottom: 24px; }
                        .stat-card { flex: 1; padding: 14px 18px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; }
                        .stat-val { font-size: 20px; font-weight: 800; color: #0F172A; }
                        .stat-lbl { font-size: 11.5px; color: #64748B; font-weight: 500; margin-top: 2px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12.5px; }
                        th { background-color: #F1F5F9; color: #475569; font-weight: 700; text-align: left; padding: 10px 12px; border-bottom: 2px solid #CBD5E1; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
                        td { padding: 9px 12px; border-bottom: 1px solid #E2E8F0; }
                        tr:nth-child(even) { background-color: #FAFAFA; }
                        .genre-tag { padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; background: #EEF2FF; color: #4F46E5; }
                        .price-tag { font-weight: 700; color: #059669; }
                        .footer { margin-top: 30px; padding-top: 14px; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; font-size: 11px; color: #94A3B8; }
                        @media print {
                            body { padding: 0; }
                            @page { margin: 1.5cm; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div>
                            <div class="brand">BookShelf</div>
                            <div class="meta">Official Book Catalogue & Inventory Report</div>
                        </div>
                        <div style="text-align: right;">
                            <span class="badge">Scope: ${exportScope === 'all' ? 'Full Library' : 'Filtered Selection'}</span>
                            <div class="meta" style="margin-top: 6px;">Generated: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        </div>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-val">${dataset.length}</div>
                            <div class="stat-lbl">Included Titles</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-val">₹${totalVal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                            <div class="stat-lbl">Combined Value</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-val">${genresCount}</div>
                            <div class="stat-lbl">Distinct Genres</div>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th style="width: 45px;">#ID</th>
                                <th>Book Title</th>
                                <th>Author</th>
                                <th>Genre</th>
                                <th style="text-align: right;">Price (INR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${dataset.map((b) => `
                                <tr>
                                    <td>#${b.id}</td>
                                    <td><strong>${b.title}</strong></td>
                                    <td>${b.author || '—'}</td>
                                    <td><span class="genre-tag">${b.genre || 'General'}</span></td>
                                    <td class="price-tag" style="text-align: right;">₹${Number(b.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="footer">
                        <span>BookShelf Management System • Confidential Inventory</span>
                        <span>Page 1 of 1</span>
                    </div>

                    <script>
                        window.onload = function() {
                            window.print();
                        };
                    </script>
                </body>
                </html>
            `;
            printWindow.document.write(printContent);
            printWindow.document.close();
            showToast(`Generating PDF Print View for ${dataset.length} books`);
        } else if (format === 'copy') {
            const headers = ["ID", "Title", "Author", "Genre", "Price (INR)"];
            const tsvRows = dataset.map((b) => [b.id, b.title, b.author || '', b.genre || '', b.price || '0'].join("\t"));
            const tsvContent = [headers.join("\t"), ...tsvRows].join("\n");
            navigator.clipboard.writeText(tsvContent).then(() => {
                showToast(`Copied ${dataset.length} rows to clipboard! Ready to paste in Excel.`);
            }).catch(() => {
                alert("Failed to copy to clipboard");
            });
        }
    };

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-primary mb-3" style={{ width: '3.5rem', height: '3.5rem', borderWidth: '3px' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="fw-bold text-dark mb-1">Loading Book Catalogue</h5>
                <p className="text-muted small">Fetching latest database records...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: '680px', margin: '40px auto 60px' }}>
                <div
                    className="shadow-sm"
                    style={{
                        background: '#FFFFFF',
                        borderRadius: '24px',
                        border: '1px solid var(--border-subtle)',
                        overflow: 'hidden',
                        textAlign: 'center'
                    }}
                >
                    {/* Top Status Banner */}
                    <div
                        style={{
                            padding: '12px 20px',
                            background: 'linear-gradient(135deg, #FEF2F2 0%, #FFF1F2 100%)',
                            borderBottom: '1px solid #FEE2E2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div className="d-flex align-items-center gap-2">
                            <span
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: '#EF4444',
                                    boxShadow: '0 0 8px #EF4444',
                                    display: 'inline-block'
                                }}
                            />
                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#DC2626', letterSpacing: '0.06em' }}>
                                503 SERVICE UNAVAILABLE • API OFFLINE
                            </span>
                        </div>

                        <span
                            style={{
                                fontSize: '10.5px',
                                fontWeight: 700,
                                color: '#991B1B',
                                background: '#FEE2E2',
                                padding: '2px 8px',
                                borderRadius: '6px'
                            }}
                        >
                            Express & MySQL
                        </span>
                    </div>

                    {/* Visual Beacon & Typography */}
                    <div style={{ padding: '36px 28px 24px' }}>
                        <div
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '22px',
                                background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
                                color: '#EF4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '34px',
                                margin: '0 auto 20px',
                                boxShadow: '0 12px 28px rgba(239, 68, 68, 0.22)',
                                border: '1px solid rgba(239, 68, 68, 0.25)'
                            }}
                        >
                            <i className="bi bi-database-fill-slash"></i>
                        </div>

                        <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                            Unable to Connect to Database API
                        </h3>

                        <p className="text-muted" style={{ fontSize: '13.5px', maxWidth: '490px', margin: '0 auto 24px', lineHeight: '1.5' }}>
                            The frontend could not establish a connection to the backend server at{' '}
                            <code style={{ color: '#6366F1', background: '#EEF2FF', padding: '2px 6px', borderRadius: '6px', fontSize: '12px' }}>
                                {API_BASE_URL}
                            </code>
                            . Check if the server is running.
                        </p>

                        {/* Diagnostics Terminal Card */}
                        <div
                            style={{
                                background: '#0F172A',
                                borderRadius: '14px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                textAlign: 'left',
                                overflow: 'hidden',
                                marginBottom: '24px'
                            }}
                        >
                            {/* Mac-style traffic lights header */}
                            <div
                                className="d-flex align-items-center justify-content-between"
                                style={{
                                    padding: '9px 14px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                                }}
                            >
                                <div className="d-flex align-items-center gap-1.5">
                                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
                                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
                                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                                </div>
                                <span style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.5)', fontFamily: 'monospace' }}>
                                    network_diagnostic.log
                                </span>
                            </div>

                            {/* Log Content */}
                            <div style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '12px', lineHeight: '1.6' }}>
                                <div style={{ color: 'rgba(255, 255, 255, 0.45)' }}>
                                    <span style={{ color: '#A5B4FC' }}>[TARGET]</span> {API_BASE_URL}/books
                                </div>
                                <div style={{ color: '#F87171', marginTop: '4px' }}>
                                    <span style={{ color: '#EF4444' }}>[ERROR]</span> {error || 'ERR_CONNECTION_REFUSED'}
                                </div>
                                <div style={{ color: 'rgba(255, 255, 255, 0.45)', marginTop: '4px' }}>
                                    <span style={{ color: '#FBBF24' }}>[STATUS]</span> Backend process not responding on port 5000
                                </div>
                            </div>
                        </div>

                        {/* Troubleshooting Quick Steps */}
                        <div
                            style={{
                                background: '#F8FAFC',
                                borderRadius: '14px',
                                border: '1px solid #E2E8F0',
                                padding: '14px 18px',
                                textAlign: 'left',
                                marginBottom: '28px'
                            }}
                        >
                            <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                                Quick Troubleshooting Steps
                            </div>
                            <div className="d-flex flex-column gap-1.5" style={{ fontSize: '12.5px', color: '#334155' }}>
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-check2-circle text-primary"></i>
                                    <span>Ensure MySQL service is active in XAMPP or Cloud DB.</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <i className="bi bi-check2-circle text-primary"></i>
                                    <span>Run <code style={{ fontSize: '11.5px', background: '#E2E8F0', padding: '1px 5px', borderRadius: '4px' }}>npm run dev</code> inside <code style={{ fontSize: '11.5px' }}>backend/</code> folder.</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex align-items-center justify-content-center gap-3">
                            <button
                                type="button"
                                className="btn text-white d-inline-flex align-items-center gap-2"
                                onClick={() => fetchBooks(true)}
                                style={{
                                    background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '11px 24px',
                                    fontSize: '13.5px',
                                    fontWeight: 700,
                                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                                    cursor: 'pointer'
                                }}
                            >
                                <i className="bi bi-arrow-clockwise" style={{ fontSize: '16px' }}></i>
                                Try Connecting Again
                            </button>

                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={() => window.location.reload()}
                                style={{
                                    borderRadius: '12px',
                                    padding: '11px 18px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#64748B',
                                    background: '#F1F5F9',
                                    border: '1px solid #E2E8F0'
                                }}
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '60px' }}>
            {/* ── Toast Notification ────────────────────────────── */}
            {toastMessage && (
                <div 
                    className="position-fixed bottom-0 end-0 p-3" 
                    style={{ zIndex: 1090, maxWidth: '380px' }}
                >
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

            {/* ── Top Header & Actions ───────────────────────────── */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <h2 className="mb-0" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                            Book Library
                        </h2>
                        <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 fw-bold" style={{ fontSize: '11px' }}>
                            {bookdata.length} Titles
                        </span>
                    </div>
                    <p className="mb-0 text-muted" style={{ fontSize: '13.5px' }}>
                        Manage, filter, search, organize, and export your catalogue collection
                    </p>
                </div>

                <div className="d-flex align-items-center gap-2">
                    {/* Refresh Button */}
                    <button 
                        type="button" 
                        onClick={() => fetchBooks(true)} 
                        className="btn btn-light border bg-white shadow-xs px-3 py-2 text-secondary d-flex align-items-center gap-2"
                        style={{ borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}
                        title="Refresh library"
                    >
                        <i className={`bi bi-arrow-clockwise ${isRefreshing ? 'spin-animation' : ''}`}></i>
                        <span>Refresh</span>
                    </button>

                    {/* ── Export Dropdown ── */}
                    <div className="position-relative" ref={exportRef}>
                        <button
                            type="button"
                            onClick={() => setExportOpen((prev) => !prev)}
                            className="btn btn-light border bg-white shadow-xs px-3 py-2 text-secondary d-flex align-items-center gap-2"
                            style={{ borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}
                        >
                            <i className="bi bi-download text-primary"></i>
                            <span>Export Data</span>
                            <i className={`bi bi-chevron-${exportOpen ? 'up' : 'down'} text-muted ms-1`} style={{ fontSize: '11px' }}></i>
                        </button>

                        {exportOpen && (
                            <div 
                                className="dropdown-menu show shadow-lg border-0 p-2 position-absolute end-0 mt-1" 
                                style={{ borderRadius: '14px', width: '260px', zIndex: 1050, background: '#FFFFFF', border: '1px solid #E2E8F0' }}
                            >
                                <div className="px-3 py-1.5 mb-1 border-bottom">
                                    <small className="text-muted fw-bold text-uppercase d-block" style={{ fontSize: '10.5px', letterSpacing: '0.05em' }}>
                                        Export Scope
                                    </small>
                                    <div className="d-flex gap-1 mt-1">
                                        <button
                                            type="button"
                                            onClick={() => setExportScope('filtered')}
                                            className={`btn btn-sm py-0.5 px-2 flex-fill ${exportScope === 'filtered' ? 'btn-primary' : 'btn-light border'}`}
                                            style={{ borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}
                                        >
                                            Filtered ({filteredBooks.length})
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setExportScope('all')}
                                            className={`btn btn-sm py-0.5 px-2 flex-fill ${exportScope === 'all' ? 'btn-primary' : 'btn-light border'}`}
                                            style={{ borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}
                                        >
                                            All ({bookdata.length})
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleExport('csv')}
                                    className="dropdown-item d-flex align-items-center gap-2.5 px-3 py-2 rounded-2"
                                    style={{ fontSize: '13px', fontWeight: 500 }}
                                >
                                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                                        <i className="bi bi-filetype-csv"></i>
                                    </div>
                                    <div>
                                        <span className="d-block fw-semibold text-dark">Export as CSV</span>
                                        <small className="text-muted" style={{ fontSize: '10.5px' }}>Standard spreadsheet (.csv)</small>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleExport('excel')}
                                    className="dropdown-item d-flex align-items-center gap-2.5 px-3 py-2 rounded-2"
                                    style={{ fontSize: '13px', fontWeight: 500 }}
                                >
                                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                                        <i className="bi bi-file-earmark-excel-fill"></i>
                                    </div>
                                    <div>
                                        <span className="d-block fw-semibold text-dark">Export to Excel</span>
                                        <small className="text-muted" style={{ fontSize: '10.5px' }}>Microsoft Excel format (.xls)</small>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleExport('pdf')}
                                    className="dropdown-item d-flex align-items-center gap-2.5 px-3 py-2 rounded-2"
                                    style={{ fontSize: '13px', fontWeight: 500 }}
                                >
                                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                                        <i className="bi bi-file-earmark-pdf-fill"></i>
                                    </div>
                                    <div>
                                        <span className="d-block fw-semibold text-dark">Print / Save as PDF</span>
                                        <small className="text-muted" style={{ fontSize: '10.5px' }}>Formatted report printable view</small>
                                    </div>
                                </button>

                                <div className="border-top my-1"></div>

                                <button
                                    type="button"
                                    onClick={() => handleExport('copy')}
                                    className="dropdown-item d-flex align-items-center gap-2.5 px-3 py-2 rounded-2"
                                    style={{ fontSize: '13px', fontWeight: 500 }}
                                >
                                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                                        <i className="bi bi-clipboard-check"></i>
                                    </div>
                                    <div>
                                        <span className="d-block fw-semibold text-dark">Copy to Clipboard</span>
                                        <small className="text-muted" style={{ fontSize: '10.5px' }}>Paste directly into Sheets</small>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Add Book Button */}
                    <Link 
                        href="/book_create" 
                        className="btn btn-primary px-3 py-2 shadow-sm d-flex align-items-center gap-2 fw-semibold" 
                        style={{ borderRadius: '10px', fontSize: '13.5px' }}
                    >
                        <i className="bi bi-plus-circle-fill"></i>
                        <span>Add New Book</span>
                    </Link>
                </div>
            </div>

            {/* ── Metric Summary Cards (Compact Premium Layout) ── */}
            <div className="row g-3 mb-4">
                {/* Total Titles Card */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div 
                        className="card border-0 shadow-sm p-3 position-relative overflow-hidden stat-metric-card h-100" 
                        style={{ 
                            borderRadius: '16px', 
                            background: 'linear-gradient(145deg, #FFFFFF 0%, #F5F7FF 100%)', 
                            border: '1px solid #E0E7FF',
                            boxShadow: '0 2px 8px rgba(79, 70, 229, 0.04)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <i 
                            className="bi bi-book-half position-absolute" 
                            style={{ right: '-6px', bottom: '-10px', fontSize: '58px', color: '#6366F1', opacity: 0.07, pointerEvents: 'none' }}
                            aria-hidden="true"
                        />
                        <div className="d-flex align-items-center justify-content-between position-relative" style={{ zIndex: 1 }}>
                            <div className="d-flex align-items-center gap-3 min-w-0">
                                <div style={{ 
                                    width: '46px', 
                                    height: '46px', 
                                    borderRadius: '12px', 
                                    background: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)', 
                                    color: '#FFFFFF', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    fontSize: '20px',
                                    boxShadow: '0 4px 10px rgba(99, 102, 241, 0.25)',
                                    flexShrink: 0
                                }}>
                                    <i className="bi bi-journal-bookmark-fill"></i>
                                </div>
                                <div className="min-w-0">
                                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: '#6366F1', textTransform: 'uppercase', display: 'block' }}>
                                        Total Titles
                                    </span>
                                    <h4 className="mb-0 fw-bold" style={{ color: '#0F172A', fontSize: '22px', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                                        {bookdata.length}
                                    </h4>
                                </div>
                            </div>
                            <span 
                                className="badge flex-shrink-0 ms-2" 
                                style={{ 
                                    background: 'rgba(99, 102, 241, 0.1)', 
                                    color: '#4338CA', 
                                    fontSize: '11px', 
                                    fontWeight: 600, 
                                    borderRadius: '20px', 
                                    padding: '4px 9px',
                                    border: '1px solid rgba(99, 102, 241, 0.18)'
                                }}
                            >
                                In Library
                            </span>
                        </div>
                    </div>
                </div>

                {/* Catalogue Value Card */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div 
                        className="card border-0 shadow-sm p-3 position-relative overflow-hidden stat-metric-card h-100" 
                        style={{ 
                            borderRadius: '16px', 
                            background: 'linear-gradient(145deg, #FFFFFF 0%, #F0FDF4 100%)', 
                            border: '1px solid #DCFCE7',
                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.04)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <i 
                            className="bi bi-graph-up-arrow position-absolute" 
                            style={{ right: '-6px', bottom: '-10px', fontSize: '58px', color: '#10B981', opacity: 0.07, pointerEvents: 'none' }}
                            aria-hidden="true"
                        />
                        <div className="d-flex align-items-center justify-content-between position-relative" style={{ zIndex: 1 }}>
                            <div className="d-flex align-items-center gap-3 min-w-0">
                                <div style={{ 
                                    width: '46px', 
                                    height: '46px', 
                                    borderRadius: '12px', 
                                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', 
                                    color: '#FFFFFF', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    fontSize: '20px',
                                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.25)',
                                    flexShrink: 0
                                }}>
                                    <i className="bi bi-currency-rupee"></i>
                                </div>
                                <div className="min-w-0">
                                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: '#059669', textTransform: 'uppercase', display: 'block' }}>
                                        Catalogue Value
                                    </span>
                                    <h4 className="mb-0 fw-bold" style={{ color: '#0F172A', fontSize: '22px', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                                        ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                    </h4>
                                </div>
                            </div>
                            <span 
                                className="badge flex-shrink-0 ms-2" 
                                style={{ 
                                    background: 'rgba(16, 185, 129, 0.12)', 
                                    color: '#047857', 
                                    fontSize: '11px', 
                                    fontWeight: 600, 
                                    borderRadius: '20px', 
                                    padding: '4px 9px',
                                    border: '1px solid rgba(16, 185, 129, 0.2)'
                                }}
                            >
                                Avg ₹{avgPrice}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Distinct Genres Card */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div 
                        className="card border-0 shadow-sm p-3 position-relative overflow-hidden stat-metric-card h-100" 
                        style={{ 
                            borderRadius: '16px', 
                            background: 'linear-gradient(145deg, #FFFFFF 0%, #ECFEFF 100%)', 
                            border: '1px solid #CFFAFE',
                            boxShadow: '0 2px 8px rgba(6, 182, 212, 0.04)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <i 
                            className="bi bi-tags-fill position-absolute" 
                            style={{ right: '-6px', bottom: '-10px', fontSize: '58px', color: '#06B6D4', opacity: 0.07, pointerEvents: 'none' }}
                            aria-hidden="true"
                        />
                        <div className="d-flex align-items-center justify-content-between position-relative" style={{ zIndex: 1 }}>
                            <div className="d-flex align-items-center gap-3 min-w-0">
                                <div style={{ 
                                    width: '46px', 
                                    height: '46px', 
                                    borderRadius: '12px', 
                                    background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', 
                                    color: '#FFFFFF', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    fontSize: '20px',
                                    boxShadow: '0 4px 10px rgba(6, 182, 212, 0.25)',
                                    flexShrink: 0
                                }}>
                                    <i className="bi bi-tags-fill"></i>
                                </div>
                                <div className="min-w-0">
                                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: '#0891B2', textTransform: 'uppercase', display: 'block' }}>
                                        Genres
                                    </span>
                                    <h4 className="mb-0 fw-bold" style={{ color: '#0F172A', fontSize: '22px', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                                        {genreCount}
                                    </h4>
                                </div>
                            </div>
                            <span 
                                className="badge flex-shrink-0 ms-2" 
                                style={{ 
                                    background: 'rgba(6, 182, 212, 0.12)', 
                                    color: '#0e7490', 
                                    fontSize: '11px', 
                                    fontWeight: 600, 
                                    borderRadius: '20px', 
                                    padding: '4px 9px',
                                    border: '1px solid rgba(6, 182, 212, 0.2)'
                                }}
                            >
                                Categories
                            </span>
                        </div>
                    </div>
                </div>

                {/* Authors Card */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div 
                        className="card border-0 shadow-sm p-3 position-relative overflow-hidden stat-metric-card h-100" 
                        style={{ 
                            borderRadius: '16px', 
                            background: 'linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 100%)', 
                            border: '1px solid #FEF3C7',
                            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.04)',
                            transition: 'all 0.22s ease'
                        }}
                    >
                        <i 
                            className="bi bi-people-fill position-absolute" 
                            style={{ right: '-6px', bottom: '-10px', fontSize: '58px', color: '#F59E0B', opacity: 0.07, pointerEvents: 'none' }}
                            aria-hidden="true"
                        />
                        <div className="d-flex align-items-center justify-content-between position-relative" style={{ zIndex: 1 }}>
                            <div className="d-flex align-items-center gap-3 min-w-0">
                                <div style={{ 
                                    width: '46px', 
                                    height: '46px', 
                                    borderRadius: '12px', 
                                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', 
                                    color: '#FFFFFF', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    fontSize: '20px',
                                    boxShadow: '0 4px 10px rgba(245, 158, 11, 0.25)',
                                    flexShrink: 0
                                }}>
                                    <i className="bi bi-people-fill"></i>
                                </div>
                                <div className="min-w-0">
                                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: '#D97706', textTransform: 'uppercase', display: 'block' }}>
                                        Authors
                                    </span>
                                    <h4 className="mb-0 fw-bold" style={{ color: '#0F172A', fontSize: '22px', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                                        {authorCount}
                                    </h4>
                                </div>
                            </div>
                            <span 
                                className="badge flex-shrink-0 ms-2" 
                                style={{ 
                                    background: 'rgba(245, 158, 11, 0.14)', 
                                    color: '#B45309', 
                                    fontSize: '11px', 
                                    fontWeight: 600, 
                                    borderRadius: '20px', 
                                    padding: '4px 9px',
                                    border: '1px solid rgba(245, 158, 11, 0.2)'
                                }}
                            >
                                Creators
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════
               FILTER & TOOLBAR CARD
               ══════════════════════════════════════════════════════ */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '18px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <div className="p-3 p-md-4">
                    {/* Row 1: Search, Price Range Filter & Sort Select */}
                    <div className="row g-3 align-items-center">
                        {/* Search Input with Guaranteed No-Overlap */}
                        <div className="col-12 col-md-6 col-lg-6">
                            <div className="position-relative d-flex align-items-center">
                                <i 
                                    className="bi bi-search position-absolute text-muted" 
                                    style={{ 
                                        left: '16px', 
                                        top: '50%', 
                                        transform: 'translateY(-50%)', 
                                        fontSize: '15px', 
                                        zIndex: 10, 
                                        pointerEvents: 'none',
                                        color: '#94A3B8'
                                    }}
                                ></i>
                                <input
                                    type="text"
                                    className="form-control custom-search-input shadow-none"
                                    placeholder="Search by title, author, or genre..."
                                    style={{
                                        paddingLeft: '48px',
                                        paddingRight: searchTerm ? '40px' : '16px'
                                    }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button 
                                        type="button" 
                                        onClick={() => setSearchTerm('')} 
                                        className="btn btn-link text-muted position-absolute p-0" 
                                        style={{ 
                                            right: '14px', 
                                            top: '50%', 
                                            transform: 'translateY(-50%)', 
                                            zIndex: 10, 
                                            textDecoration: 'none', 
                                            fontSize: '15px' 
                                        }}
                                    >
                                        <i className="bi bi-x-circle-fill"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div className="col-6 col-md-3 col-lg-3">
                            <div className="position-relative">
                                <select
                                    className="form-select custom-select-control shadow-none"
                                    value={selectedPriceRange}
                                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                                >
                                    {PRICE_RANGES.map((r) => (
                                        <option key={r.value} value={r.value}>{r.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="col-6 col-md-3 col-lg-3">
                            <div className="position-relative">
                                <select
                                    className="form-select custom-select-control shadow-none"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    {SORT_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Genre Filter Chips Rail (Horizontal Scrollable) */}
                    <div className="mt-3 pt-3 border-top">
                        <div className="genre-chip-rail">
                            {genreStats.list.map((g) => {
                                const isSelected = selectedGenre === g;
                                const gStyle = getGenreStyle(g);
                                const count = genreStats.counts[g] || 0;

                                    return (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setSelectedGenre(g)}
                                            className={`btn btn-sm text-nowrap d-flex align-items-center gap-2 genre-chip-btn ${isSelected ? 'active' : ''}`}
                                            style={{
                                                borderRadius: '24px',
                                                fontSize: '12.5px',
                                                fontWeight: isSelected ? 700 : 500,
                                                padding: '6px 14px',
                                                background: isSelected 
                                                    ? (g === 'All' ? 'var(--primary, #4F46E5)' : gStyle.gradient)
                                                    : '#F8FAFC',
                                                color: isSelected ? '#FFFFFF' : '#475569',
                                                border: isSelected ? '1px solid transparent' : '1px solid #E2E8F0',
                                                boxShadow: isSelected ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none'
                                            }}
                                        >
                                            <span>{g}</span>
                                            <span 
                                                className="badge rounded-pill"
                                                style={{
                                                    fontSize: '10.5px',
                                                    padding: '2px 7px',
                                                    background: isSelected ? 'rgba(255, 255, 255, 0.28)' : '#E2E8F0',
                                                    color: isSelected ? '#FFFFFF' : '#64748B',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>


                </div>
            </div>

            {/* ══════════════════════════════════════════════════════
               BOOK CONTENT (TABLE VIEW OR GRID CARDS VIEW)
               ══════════════════════════════════════════════════════ */}
            {filteredBooks.length === 0 ? (
                /* Empty state */
                <div className="card border-0 shadow-sm text-center py-5 px-3 mb-5" style={{ borderRadius: '18px', background: '#FFFFFF' }}>
                    <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'rgba(79, 70, 229, 0.08)', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', margin: '0 auto 16px' }}>
                        <i className="bi bi-book"></i>
                    </div>
                    <h5 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                        {activeFilterCount > 0 ? 'No matching books found' : 'No books in library'}
                    </h5>
                    <p className="text-muted small mb-3" style={{ maxWidth: '420px', margin: '0 auto' }}>
                        {activeFilterCount > 0 
                            ? 'We couldn\'t find any book matching your active filter criteria. Try clearing some filters or searching for something else.' 
                            : 'Your library is currently empty. Start building your collection by adding your first book.'}
                    </p>
                    {activeFilterCount > 0 ? (
                        <div>
                            <button className="btn btn-primary px-4 py-2 btn-sm fw-semibold" onClick={clearAllFilters} style={{ borderRadius: '10px' }}>
                                <i className="bi bi-arrow-counterclockwise me-1"></i> Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <div>
                            <Link href="/book_create" className="btn btn-primary px-4 py-2 btn-sm fw-semibold" style={{ borderRadius: '10px' }}>
                                <i className="bi bi-plus-lg me-1"></i> Add First Book
                            </Link>
                        </div>
                    )}
                </div>
            ) : (
                /* ── Premium Unified Table & Pagination Card ── */
                <div className="modern-table-card mb-4">
                    <div className="table-responsive">
                        <table className="table align-middle modern-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '64px' }}>#</th>
                                    <th>Book Details</th>
                                    <th>Author</th>
                                    <th>Genre</th>
                                    <th>Price</th>
                                    <th className="text-end" style={{ width: '180px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedBooks.map((book, idx) => {
                                    const gStyle = getGenreStyle(book.genre);
                                    const rowNumber = (currentPage - 1) * pageSize + idx + 1;
                                    const authorInitial = (book.author || 'A').trim().charAt(0).toUpperCase();

                                    return (
                                        <tr key={book.id}>
                                            {/* Row # */}
                                            <td>
                                                <span className="fw-bold font-monospace" style={{ fontSize: '12px', color: '#94A3B8' }}>
                                                    {String(rowNumber).padStart(2, '0')}
                                                </span>
                                            </td>

                                            {/* Book Details */}
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div 
                                                        className="book-spine-thumb text-white" 
                                                        style={{ background: gStyle.gradient }}
                                                        title={`Genre: ${book.genre || 'General'}`}
                                                    >
                                                        <i className="bi bi-book-half text-white" style={{ color: '#FFFFFF', fontSize: '20px' }}></i>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <span 
                                                            className="fw-bold text-dark d-block text-truncate" 
                                                            style={{ fontSize: '14.5px', lineHeight: '1.3', maxWidth: '320px' }}
                                                        >
                                                            {book.title}
                                                        </span>
                                                        <div className="d-flex align-items-center gap-2 mt-1">
                                                            <span 
                                                                className="badge font-monospace" 
                                                                style={{ 
                                                                    background: '#F1F5F9', 
                                                                    color: '#64748B', 
                                                                    fontSize: '11px', 
                                                                    fontWeight: 600,
                                                                    padding: '2px 7px',
                                                                    borderRadius: '6px'
                                                                }}
                                                            >
                                                                #{book.id}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Author */}
                                            <td>
                                                <div className="d-flex align-items-center" style={{ gap: '12px' }}>
                                                    <div className="author-avatar" title={book.author || 'Author'}>
                                                        {authorInitial}
                                                    </div>
                                                    <span className="fw-semibold text-truncate" style={{ fontSize: '13.5px', color: '#334155', maxWidth: '200px' }}>
                                                        {book.author || '—'}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Genre Pill */}
                                            <td>
                                                <span 
                                                    className="genre-status-pill"
                                                    style={{
                                                        background: gStyle.bg,
                                                        color: gStyle.color,
                                                        border: `1px solid ${gStyle.border}`
                                                    }}
                                                >
                                                    <span className="genre-status-dot" style={{ background: gStyle.color }}></span>
                                                    <span>{book.genre || 'General'}</span>
                                                </span>
                                            </td>

                                            {/* Price */}
                                            <td>
                                                <div className="price-chip">
                                                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#059669', marginRight: '2px' }}>₹</span>
                                                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                                                        {Number(book.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="text-end">
                                                <div className="d-flex align-items-center justify-content-end gap-2">
                                                    <button 
                                                        type="button"
                                                        onClick={() => setViewModal({ open: true, book })}
                                                        className="btn-action-view"
                                                        title="View Book Specification"
                                                    >
                                                        <i className="bi bi-eye-fill"></i>
                                                        <span>View</span>
                                                    </button>

                                                    <Link 
                                                        href={`/book_edit/${book.id}`}
                                                        className="btn-action-edit"
                                                        title="Edit Book Details"
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteModal({ open: true, book, isDeleting: false })}
                                                        className="btn-action-delete"
                                                        title="Delete Book"
                                                    >
                                                        <i className="bi bi-trash3-fill"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Integrated Modern Pagination Footer */}
                    <div className="table-pagination-footer d-flex flex-wrap align-items-center justify-content-between gap-3">
                        <div className="d-flex align-items-center">
                            <span className="text-muted" style={{ fontSize: '13px' }}>
                                Showing <strong className="text-dark">{pageSize === -1 ? 1 : (currentPage - 1) * pageSize + 1}</strong> to <strong className="text-dark">{pageSize === -1 ? filteredBooks.length : Math.min(currentPage * pageSize, filteredBooks.length)}</strong> of <strong className="text-dark">{filteredBooks.length}</strong> books
                            </span>
                        </div>

                        {pageSize !== -1 && totalPages > 1 && (
                            <div className="d-flex align-items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="page-num-pill"
                                    title="Previous Page"
                                >
                                    <i className="bi bi-chevron-left"></i>
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                    .map((p, idx, arr) => (
                                        <React.Fragment key={p}>
                                            {idx > 0 && arr[idx - 1] !== p - 1 && (
                                                <span className="px-1 text-muted" style={{ fontSize: '12px' }}>•••</span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setCurrentPage(p)}
                                                className={`page-num-pill ${currentPage === p ? 'active' : ''}`}
                                            >
                                                {p}
                                            </button>
                                        </React.Fragment>
                                    ))}

                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="page-num-pill"
                                    title="Next Page"
                                >
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════
               BOOK DETAILS QUICK VIEW MODAL
               ══════════════════════════════════════════════════════ */}
            {viewModal.open && viewModal.book && (
                <div 
                    className="modal fade show d-block" 
                    tabIndex="-1" 
                    style={{ background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)', zIndex: 1060 }}
                >
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '520px' }}>
                        <div className="modal-content border-0 shadow-lg overflow-hidden" style={{ borderRadius: '22px', background: '#FFFFFF' }}>
                            {(() => {
                                const gStyle = getGenreStyle(viewModal.book.genre);
                                return (
                                    <>
                                        {/* Modal Header Banner */}
                                        <div className="p-4 text-white position-relative overflow-hidden" style={{ background: gStyle.gradient }}>
                                            <i 
                                                className="bi bi-book-half position-absolute" 
                                                style={{ right: '-10px', bottom: '-20px', fontSize: '110px', opacity: 0.15, pointerEvents: 'none' }}
                                                aria-hidden="true"
                                            />
                                            <div className="d-flex align-items-start justify-content-between position-relative" style={{ zIndex: 1 }}>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div style={{
                                                        width: '52px',
                                                        height: '66px',
                                                        borderRadius: '10px',
                                                        background: 'rgba(255, 255, 255, 0.2)',
                                                        backdropFilter: 'blur(8px)',
                                                        border: '1px solid rgba(255, 255, 255, 0.4)',
                                                        color: '#FFFFFF',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '26px',
                                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                                                    }}>
                                                        <i className="bi bi-book-half"></i>
                                                    </div>
                                                    <div>
                                                        <span className="badge rounded-pill mb-1" style={{ background: 'rgba(255, 255, 255, 0.25)', color: '#FFFFFF', fontSize: '11px', fontWeight: 600 }}>
                                                            {viewModal.book.genre || 'General'}
                                                        </span>
                                                        <h5 className="mb-0 fw-bold text-white" style={{ letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                                                            {viewModal.book.title}
                                                        </h5>
                                                    </div>
                                                </div>
                                                <button 
                                                    type="button" 
                                                    className="btn-close btn-close-white shadow-none" 
                                                    onClick={() => setViewModal({ open: false, book: null })}
                                                    aria-label="Close"
                                                />
                                            </div>
                                        </div>

                                        {/* Modal Body with Specifications Grid */}
                                        <div className="p-4">
                                            <div className="row g-3 mb-4">
                                                <div className="col-6">
                                                    <div className="p-3 rounded-3 bg-light border">
                                                        <span className="text-muted d-block small mb-1">Catalog ID</span>
                                                        <span className="fw-bold font-monospace text-dark">#{viewModal.book.id}</span>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="p-3 rounded-3 bg-light border">
                                                        <span className="text-muted d-block small mb-1">Retail Price</span>
                                                        <span className="fw-bold text-success fs-5">
                                                            ₹{Number(viewModal.book.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="p-3 rounded-3 bg-light border">
                                                        <span className="text-muted d-block small mb-1">Author</span>
                                                        <span className="fw-bold text-dark">{viewModal.book.author || '—'}</span>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="p-3 rounded-3 bg-light border">
                                                        <span className="text-muted d-block small mb-1">Stock Status</span>
                                                        <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                                                            In Stock • Available
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Modal Footer Action Buttons */}
                                            <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                                                <Link
                                                    href={`/book_details/${viewModal.book.id}`}
                                                    className="btn btn-outline-primary btn-sm px-3 py-2 fw-semibold d-flex align-items-center gap-1.5"
                                                    style={{ borderRadius: '10px' }}
                                                >
                                                    <i className="bi bi-box-arrow-up-right"></i>
                                                    <span>Full Page View</span>
                                                </Link>

                                                <div className="d-flex align-items-center gap-2">
                                                    <Link
                                                        href={`/book_edit/${viewModal.book.id}`}
                                                        className="btn btn-light border btn-sm px-3 py-2 text-secondary fw-semibold d-flex align-items-center gap-1.5"
                                                        style={{ borderRadius: '10px' }}
                                                    >
                                                        <i className="bi bi-pencil-square text-info"></i>
                                                        <span>Edit</span>
                                                    </Link>
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-primary btn-sm px-4 py-2 fw-semibold"
                                                        onClick={() => setViewModal({ open: false, book: null })}
                                                        style={{ borderRadius: '10px' }}
                                                    >
                                                        Done
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════
               DELETE CONFIRMATION MODAL
               ══════════════════════════════════════════════════════ */}
            {deleteModal.open && (
                <div 
                    className="modal fade show d-block" 
                    tabIndex="-1" 
                    style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 1060 }}
                >
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '440px' }}>
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                            <div className="p-4 text-center">
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto 16px' }}>
                                    <i className="bi bi-trash3-fill"></i>
                                </div>
                                
                                <h5 className="fw-bold text-dark mb-1">Delete Book Entry?</h5>
                                <p className="text-muted small mb-3">
                                    Are you sure you want to remove <strong className="text-dark">&ldquo;{deleteModal.book?.title}&rdquo;</strong> from your library? This action cannot be undone.
                                </p>

                                <div className="p-3 bg-light rounded-3 text-start mb-3" style={{ fontSize: '12.5px' }}>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="text-muted">Author:</span>
                                        <span className="fw-semibold text-dark">{deleteModal.book?.author}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="text-muted">Genre:</span>
                                        <span className="fw-semibold text-dark">{deleteModal.book?.genre}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Price:</span>
                                        <span className="fw-bold text-success">₹{Number(deleteModal.book?.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button 
                                        type="button" 
                                        className="btn btn-light border flex-fill py-2 fw-semibold" 
                                        onClick={() => setDeleteModal({ open: false, book: null, isDeleting: false })}
                                        disabled={deleteModal.isDeleting}
                                        style={{ borderRadius: '10px' }}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-danger flex-fill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2" 
                                        onClick={confirmDelete}
                                        disabled={deleteModal.isDeleting}
                                        style={{ borderRadius: '10px' }}
                                    >
                                        {deleteModal.isDeleting ? (
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

export default BookList;
