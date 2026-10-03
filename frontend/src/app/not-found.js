'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '75vh', padding: '40px 20px' }}
    >
      <div
        className="shadow-sm text-center"
        style={{
          maxWidth: '560px',
          width: '100%',
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid var(--border-subtle)',
          padding: '44px 32px 40px',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Top Status Pill */}
        <div className="d-inline-flex align-items-center gap-2 mb-4">
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: 800,
              background: 'rgba(99, 102, 241, 0.12)',
              color: '#6366F1',
              padding: '4px 12px',
              borderRadius: '20px',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              letterSpacing: '0.04em'
            }}
          >
            <i className="bi bi-compass me-1"></i> HTTP 404 • ROUTE NOT FOUND
          </span>
        </div>

        {/* 404 Hero Illustration & Typography */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <h1
            style={{
              fontSize: '84px',
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.05em',
              background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}
          >
            404
          </h1>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
              color: '#6366F1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              margin: '12px auto 0',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.2)'
            }}
          >
            <i className="bi bi-book-half"></i>
          </div>
        </div>

        <h3
          style={{
            fontSize: '20px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '8px'
          }}
        >
          Page or Catalogue Record Not Found
        </h3>

        <p
          className="text-muted"
          style={{
            fontSize: '13.5px',
            lineHeight: '1.55',
            maxWidth: '420px',
            margin: '0 auto 28px'
          }}
        >
          The page or book resource you are looking for might have been removed, had its ID changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="d-flex flex-wrap align-items-center justify-content-center gap-3">
          <Link
            href="/book_read"
            className="btn text-white d-inline-flex align-items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '11px 22px',
              fontSize: '13.5px',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
              textDecoration: 'none'
            }}
          >
            <i className="bi bi-arrow-left"></i> Return to Catalogue
          </Link>

          <Link
            href="/book_create"
            className="btn btn-light d-inline-flex align-items-center gap-2"
            style={{
              borderRadius: '12px',
              padding: '11px 18px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#475569',
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              textDecoration: 'none'
            }}
          >
            <i className="bi bi-plus-circle"></i> Add New Book
          </Link>
        </div>
      </div>
    </div>
  );
}
