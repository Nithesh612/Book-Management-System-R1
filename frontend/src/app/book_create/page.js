'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

const GENRE_CONFIG = {
  'Fiction': {
    icon: 'bi-stars',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    spine: '#4338CA',
    accent: '#A5B4FC',
    badgeBg: 'rgba(99, 102, 241, 0.15)',
    badgeColor: '#6366F1',
    border: 'rgba(99, 102, 241, 0.25)'
  },
  'Non-Fiction': {
    icon: 'bi-journal-text',
    gradient: 'linear-gradient(135deg, #0284C7 0%, #0D9488 100%)',
    spine: '#0369A1',
    accent: '#7DD3FC',
    badgeBg: 'rgba(2, 132, 199, 0.15)',
    badgeColor: '#0284C7',
    border: 'rgba(2, 132, 199, 0.25)'
  },
  'Technology': {
    icon: 'bi-cpu-fill',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    spine: '#1E40AF',
    accent: '#93C5FD',
    badgeBg: 'rgba(59, 130, 246, 0.15)',
    badgeColor: '#2563EB',
    border: 'rgba(59, 130, 246, 0.25)'
  },
  'Science': {
    icon: 'bi-radioactive',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    spine: '#047857',
    accent: '#6EE7B7',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    badgeColor: '#059669',
    border: 'rgba(16, 185, 129, 0.25)'
  },
  'Biography': {
    icon: 'bi-person-badge-fill',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    spine: '#B45309',
    accent: '#FDE68A',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    badgeColor: '#D97706',
    border: 'rgba(245, 158, 11, 0.25)'
  },
  'Fantasy': {
    icon: 'bi-magic',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
    spine: '#BE185D',
    accent: '#FBCFE8',
    badgeBg: 'rgba(236, 72, 153, 0.15)',
    badgeColor: '#DB2777',
    border: 'rgba(236, 72, 153, 0.25)'
  },
  'Mystery': {
    icon: 'bi-incognito',
    gradient: 'linear-gradient(135deg, #64748B 0%, #334155 100%)',
    spine: '#1E293B',
    accent: '#CBD5E1',
    badgeBg: 'rgba(100, 116, 139, 0.15)',
    badgeColor: '#475569',
    border: 'rgba(100, 116, 139, 0.25)'
  },
  'Self-Help': {
    icon: 'bi-lightbulb-fill',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
    spine: '#0891B2',
    accent: '#A5F3FC',
    badgeBg: 'rgba(6, 182, 212, 0.15)',
    badgeColor: '#0891B2',
    border: 'rgba(6, 182, 212, 0.25)'
  }
};

const PRESET_PRICES = [299, 499, 799, 1299, 1999];

export default function BookCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Fiction');
  const [customGenre, setCustomGenre] = useState('');
  const [isCustomGenre, setIsCustomGenre] = useState(false);
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Active genre styling
  const activeGenreName = isCustomGenre ? (customGenre.trim() || 'Custom') : genre;
  const genreTheme = GENRE_CONFIG[activeGenreName] || {
    icon: 'bi-bookmark-fill',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    spine: '#3730A3',
    accent: '#C7D2FE',
    badgeBg: 'rgba(99, 102, 241, 0.15)',
    badgeColor: '#6366F1',
    border: 'rgba(99, 102, 241, 0.25)'
  };

  const handleSelectGenre = (g) => {
    setIsCustomGenre(false);
    setGenre(g);
    if (errors.genre) {
      setErrors((prev) => ({ ...prev, genre: undefined }));
    }
  };

  const handleCustomGenreClick = () => {
    setIsCustomGenre(true);
    if (errors.genre) {
      setErrors((prev) => ({ ...prev, genre: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!title.trim()) newErrors.title = 'Please enter a book title';
    if (!author.trim()) newErrors.author = 'Please enter author name';
    
    const finalGenre = isCustomGenre ? customGenre.trim() : genre.trim();
    if (!finalGenre) newErrors.genre = 'Please choose or type a genre';

    if (!price || Number(price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setIsSubmitting(true);
        const payload = {
          title: title.trim(),
          author: author.trim(),
          genre: finalGenre,
          price: Number(price)
        };
        await axios.post(`${API_BASE_URL}/books`, payload);
        router.push('/book_read');
      } catch (err) {
        console.error('Failed to create book:', err);
        alert('Failed to save book: ' + (err.response?.data?.error || err.message));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div style={{ maxWidth: '1160px', margin: '0 auto', paddingTop: '4px', paddingBottom: '40px' }}>
      
      {/* ── Breadcrumb & Page Header ────────────────────────── */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 pb-1">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
            <Link href="/book_read" className="text-decoration-none" style={{ color: 'var(--text-muted)' }}>
              <i className="bi bi-house-door me-1"></i>Catalogue
            </Link>
            <span>/</span>
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>New Book</span>
          </div>

          <div className="d-flex align-items-center gap-2.5">
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: 0 }}>
              Add New Book
            </h1>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.12))',
                color: '#6366F1',
                padding: '2px 8px',
                borderRadius: '20px',
                border: '1px solid rgba(99,102,241,0.25)'
              }}
            >
              <i className="bi bi-sparkles me-1"></i>Publication Studio
            </span>
          </div>

          <p className="mb-0 text-muted" style={{ fontSize: '13px', marginTop: '3px' }}>
            Fill in the details below to add a new book to your library catalogue
          </p>
        </div>

        <div>
          <Link
            href="/book_read"
            className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 shadow-sm"
            style={{
              borderRadius: '10px',
              padding: '7px 15px',
              fontSize: '13px',
              fontWeight: 600,
              background: '#FFFFFF',
              borderColor: 'var(--border-subtle)'
            }}
          >
            <i className="bi bi-arrow-left"></i>
            Back to Catalogue
          </Link>
        </div>
      </div>

      {/* ── Main 2-Column Grid (Equal Height Aligned) ───────── */}
      <div className="row g-4 align-items-stretch">
        
        {/* ── Left Column: Form Details ───────────────────────── */}
        <div className="col-12 col-lg-7 d-flex flex-column">
          <div
            className="shadow-sm h-100 d-flex flex-column"
            style={{
              background: '#FFFFFF',
              borderRadius: '18px',
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden'
            }}
          >
            {/* Form Header */}
            <div
              style={{
                padding: '16px 22px',
                background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)',
                borderBottom: '1px solid #E2E8F0'
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                  }}
                >
                  <i className="bi bi-book-half"></i>
                </div>
                <div>
                  <h5 style={{ margin: 0, fontWeight: 700, color: 'var(--text-primary)', fontSize: '15px' }}>
                    Book Information
                  </h5>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Provide metadata for indexing & search
                  </span>
                </div>
              </div>
            </div>

            {/* Form Fields Body */}
            <div className="d-flex flex-column flex-grow-1 justify-content-between p-4">
              <form onSubmit={handleSubmit} noValidate className="d-flex flex-column flex-grow-1 justify-content-between">
                <div>
                  {/* 1. Title */}
                  <div className="mb-3">
                    <label htmlFor="bookTitle" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '5px', display: 'block' }}>
                      Book Title <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <div className="position-relative">
                      <i
                        className="bi bi-journal-bookmark-fill position-absolute"
                        style={{
                          left: '13px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: title.trim() ? '#6366F1' : '#94A3B8',
                          fontSize: '15px'
                        }}
                      />
                      <input
                        id="bookTitle"
                        type="text"
                        className="form-control"
                        placeholder="e.g. Clean Code: A Handbook of Agile Software"
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                        }}
                        style={{
                          paddingLeft: '38px',
                          height: '44px',
                          borderRadius: '11px',
                          fontSize: '13.5px',
                          border: errors.title ? '1.5px solid #EF4444' : '1px solid #CBD5E1'
                        }}
                      />
                    </div>
                    {errors.title && (
                      <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                        <i className="bi bi-exclamation-circle-fill"></i> {errors.title}
                      </div>
                    )}
                  </div>

                  {/* 2. Author */}
                  <div className="mb-3">
                    <label htmlFor="bookAuthor" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '5px', display: 'block' }}>
                      Author Name <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <div className="position-relative">
                      <i
                        className="bi bi-person-fill position-absolute"
                        style={{
                          left: '13px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: author.trim() ? '#6366F1' : '#94A3B8',
                          fontSize: '16px'
                        }}
                      />
                      <input
                        id="bookAuthor"
                        type="text"
                        className="form-control"
                        placeholder="e.g. Robert C. Martin"
                        value={author}
                        onChange={(e) => {
                          setAuthor(e.target.value);
                          if (errors.author) setErrors((prev) => ({ ...prev, author: undefined }));
                        }}
                        style={{
                          paddingLeft: '38px',
                          height: '44px',
                          borderRadius: '11px',
                          fontSize: '13.5px',
                          border: errors.author ? '1.5px solid #EF4444' : '1px solid #CBD5E1'
                        }}
                      />
                    </div>
                    {errors.author && (
                      <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                        <i className="bi bi-exclamation-circle-fill"></i> {errors.author}
                      </div>
                    )}
                  </div>

                  {/* 3. Genre Selector */}
                  <div className="mb-3">
                    <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '7px', display: 'block' }}>
                      Genre / Category <span style={{ color: '#EF4444' }}>*</span>
                    </label>

                    <div className="d-flex flex-wrap gap-2 mb-2">
                      {Object.keys(GENRE_CONFIG).map((g) => {
                        const isSelected = !isCustomGenre && genre === g;
                        const conf = GENRE_CONFIG[g];
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => handleSelectGenre(g)}
                            style={{
                              border: isSelected ? `1.5px solid ${conf.border || '#6366F1'}` : '1px solid #E2E8F0',
                              background: isSelected ? conf.badgeBg : '#F8FAFC',
                              color: isSelected ? conf.badgeColor : '#475569',
                              fontWeight: isSelected ? 700 : 500,
                              borderRadius: '9px',
                              padding: '5px 11px',
                              fontSize: '12px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <i className={`bi ${conf.icon}`}></i>
                            {g}
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        onClick={handleCustomGenreClick}
                        style={{
                          border: isCustomGenre ? '1.5px solid #6366F1' : '1px dashed #CBD5E1',
                          background: isCustomGenre ? 'rgba(99, 102, 241, 0.12)' : '#FFFFFF',
                          color: isCustomGenre ? '#6366F1' : '#64748B',
                          fontWeight: isCustomGenre ? 700 : 500,
                          borderRadius: '9px',
                          padding: '5px 11px',
                          fontSize: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          cursor: 'pointer'
                        }}
                      >
                        <i className="bi bi-plus-circle"></i>
                        Custom
                      </button>
                    </div>

                    {isCustomGenre && (
                      <div className="position-relative mt-2">
                        <i
                          className="bi bi-tags-fill position-absolute"
                          style={{
                            left: '13px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#6366F1',
                            fontSize: '14px'
                          }}
                        />
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Type custom genre name..."
                          value={customGenre}
                          onChange={(e) => setCustomGenre(e.target.value)}
                          autoFocus
                          style={{
                            paddingLeft: '36px',
                            height: '40px',
                            borderRadius: '9px',
                            fontSize: '13px',
                            border: '1.5px solid #6366F1',
                            background: '#F8FAFC'
                          }}
                        />
                      </div>
                    )}

                    {errors.genre && (
                      <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                        <i className="bi bi-exclamation-circle-fill"></i> {errors.genre}
                      </div>
                    )}
                  </div>

                  {/* 4. Price & Presets */}
                  <div className="mb-3">
                    <label htmlFor="bookPrice" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '5px', display: 'block' }}>
                      Price (INR ₹) <span style={{ color: '#EF4444' }}>*</span>
                    </label>

                    <div className="position-relative mb-2">
                      <span
                        className="position-absolute d-flex align-items-center justify-content-center"
                        style={{
                          left: '13px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: price ? '#10B981' : '#94A3B8',
                          fontWeight: 800,
                          fontSize: '15px'
                        }}
                      >
                        ₹
                      </span>
                      <input
                        id="bookPrice"
                        type="number"
                        min="1"
                        step="0.01"
                        className="form-control"
                        placeholder="499.00"
                        value={price}
                        onChange={(e) => {
                          setPrice(e.target.value);
                          if (errors.price) setErrors((prev) => ({ ...prev, price: undefined }));
                        }}
                        style={{
                          paddingLeft: '34px',
                          height: '44px',
                          borderRadius: '11px',
                          fontSize: '14px',
                          fontWeight: 600,
                          border: errors.price ? '1.5px solid #EF4444' : '1px solid #CBD5E1'
                        }}
                      />
                    </div>

                    {/* Preset quick buttons */}
                    <div className="d-flex align-items-center gap-1.5 flex-wrap">
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Presets:
                      </span>
                      {PRESET_PRICES.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => {
                            setPrice(String(p));
                            if (errors.price) setErrors((prev) => ({ ...prev, price: undefined }));
                          }}
                          style={{
                            border: Number(price) === p ? '1px solid #10B981' : '1px solid #E2E8F0',
                            background: Number(price) === p ? 'rgba(16, 185, 129, 0.12)' : '#F8FAFC',
                            color: Number(price) === p ? '#059669' : '#64748B',
                            fontWeight: 600,
                            borderRadius: '7px',
                            padding: '2px 8px',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                        >
                          ₹{p}
                        </button>
                      ))}
                    </div>

                    {errors.price && (
                      <div style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                        <i className="bi bi-exclamation-circle-fill"></i> {errors.price}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit & Cancel Actions */}
                <div
                  className="d-flex align-items-center gap-3 pt-3"
                  style={{ borderTop: '1px solid #F1F5F9', marginTop: '16px' }}
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn d-inline-flex align-items-center justify-content-center gap-2 text-white"
                    style={{
                      background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                      border: 'none',
                      borderRadius: '11px',
                      padding: '10px 22px',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle" style={{ fontSize: '16px' }}></i>
                        Save Book
                      </>
                    )}
                  </button>

                  <Link
                    href="/book_read"
                    className="btn btn-light"
                    style={{
                      borderRadius: '11px',
                      padding: '10px 16px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#64748B',
                      background: '#F1F5F9',
                      border: '1px solid #E2E8F0'
                    }}
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ── Right Column: Live Interactive 3D Showcase (Equal Height) ─── */}
        <div className="col-12 col-lg-5 d-flex flex-column">
          <div
            className="shadow-sm h-100 d-flex flex-column justify-content-between"
            style={{
              borderRadius: '18px',
              background: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden'
            }}
          >
            {/* Live Preview Header */}
            <div
              className="d-flex align-items-center justify-content-between"
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #F1F5F9',
                background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)'
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10B981',
                    boxShadow: '0 0 8px #10B981',
                    display: 'inline-block'
                  }}
                />
                <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: '#1E293B' }}>
                  LIVE 3D PREVIEW
                </span>
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: genreTheme.badgeColor || '#6366F1',
                  background: genreTheme.badgeBg || 'rgba(99, 102, 241, 0.15)',
                  border: `1px solid ${genreTheme.border || 'rgba(99,102,241,0.25)'}`,
                  padding: '2px 9px',
                  borderRadius: '20px'
                }}
              >
                <i className={`bi ${genreTheme.icon} me-1`}></i>
                {activeGenreName}
              </span>
            </div>

            {/* 3D Visual Book Mockup Stage (Flex Centered) */}
            <div
              className="d-flex align-items-center justify-content-center flex-grow-1"
              style={{
                padding: '30px 20px',
                background: 'radial-gradient(circle at center, #EEF2FF 0%, #F8FAFC 70%)',
                borderBottom: '1px solid #F1F5F9',
                perspective: '1000px',
                minHeight: '260px'
              }}
            >
              {/* 3D Realistic Book */}
              <div
                style={{
                  width: '160px',
                  minHeight: '220px',
                  borderRadius: '6px 14px 14px 6px',
                  background: genreTheme.gradient,
                  boxShadow: '0 18px 32px rgba(0, 0, 0, 0.2), -5px 0 10px rgba(0,0,0,0.1)',
                  borderLeft: `5px solid ${genreTheme.spine}`,
                  padding: '16px 13px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  transform: 'rotateY(-12deg) rotateX(4deg)',
                  transition: 'transform 0.3s ease',
                  overflow: 'hidden'
                }}
              >
                {/* Book Gloss Light Texture */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.25) 0%, transparent 12%, transparent 85%, rgba(0,0,0,0.18) 100%)',
                    pointerEvents: 'none'
                  }}
                />

                {/* Top: Genre Badge */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(4px)',
                      color: '#FFFFFF',
                      fontSize: '9.5px',
                      fontWeight: 700,
                      padding: '3px 7px',
                      borderRadius: '5px',
                      letterSpacing: '0.02em',
                      border: '1px solid rgba(255,255,255,0.25)'
                    }}
                  >
                    <i className={`bi ${genreTheme.icon}`}></i>
                    {activeGenreName}
                  </div>
                </div>

                {/* Middle/Bottom: Title & Author */}
                <div style={{ position: 'relative', zIndex: 2, marginTop: 'auto' }}>
                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      lineHeight: '1.25',
                      letterSpacing: '-0.01em',
                      margin: 0,
                      textShadow: '0 2px 4px rgba(0,0,0,0.35)',
                      wordBreak: 'break-word',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {title.trim() || 'Your Book Title'}
                  </p>

                  <div className="d-flex align-items-center justify-content-between mt-2 pt-1" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.25)' }}>
                    <small
                      style={{
                        fontSize: '10px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '90px'
                      }}
                    >
                      {author.trim() || 'Author Name'}
                    </small>

                    <span style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}>
                      PRO
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata Summary Readout (Bottom Pinned) */}
            <div style={{ padding: '18px 20px' }}>
              <div
                style={{
                  background: '#F8FAFC',
                  borderRadius: '13px',
                  border: '1px solid #E2E8F0',
                  padding: '13px 16px'
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Category</span>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>
                    {activeGenreName}
                  </span>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Author</span>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>
                    {author.trim() || '—'}
                  </span>
                </div>

                <div
                  className="d-flex justify-content-between align-items-center pt-2 mt-2"
                  style={{ borderTop: '1px solid #E2E8F0' }}
                >
                  <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Catalog Price</span>
                  <span
                    style={{
                      fontSize: '17px',
                      fontWeight: 800,
                      color: '#059669',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    {price && Number(price) > 0
                      ? `₹${Number(price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : '₹0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
