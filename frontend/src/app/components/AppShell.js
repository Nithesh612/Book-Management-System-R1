'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    href: '/book_read',
    icon: 'bi-collection-play-fill',
    label: 'Dashboard',
    match: (p) => p === '/' || p.startsWith('/book_read') || p.startsWith('/book_details'),
  },
  {
    href: '/book_create',
    icon: 'bi-journal-plus',
    label: 'Add New Book',
    match: (p) => p.startsWith('/book_create'),
  },
];

const PAGE_META = [
  {
    match: (p) => p.startsWith('/book_create'),
    title: 'Add New Book',
    sub: 'Fill in the details to add a new book to your library',
  },
  {
    match: (p) => p.startsWith('/book_edit'),
    title: 'Edit Book',
    sub: 'Update book information',
  },
  {
    match: (p) => p.startsWith('/book_details'),
    title: 'Book Details',
    sub: 'View complete information about this book',
  },
  {
    match: (p) => p === '/' || p.startsWith('/book_read'),
    title: 'Dashboard',
    sub: 'Manage and explore your entire book collection',
  },
];

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar overlay open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const pageMeta = PAGE_META.find((m) => m.match(pathname)) || {
    title: 'BookShelf',
    sub: 'Book Management System',
  };

  return (
    <>
      {/* ── Mobile overlay ─────────────────────────────── */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className={`app-sidebar${sidebarOpen ? ' open' : ''}`} aria-label="Sidebar navigation">
        {/* Brand */}
        <Link href="/book_read" className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <i className="bi bi-book-half"></i>
          </div>
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">BookShelf</span>
            <span className="sidebar-brand-sub">Management System</span>
          </div>
        </Link>

        <div className="sidebar-section-label">Navigation</div>

        {/* Nav links */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link${item.match(pathname) ? ' active' : ''}`}
            >
              <i className={`bi ${item.icon} sidebar-link-icon`}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">N</div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">Nithesh</span>
              <span className="sidebar-user-role">Administrator</span>
            </div>
            <i
              className="bi bi-three-dots-vertical"
              style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}
            ></i>
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────── */}
      <main className="app-main">
        <div className="page-content">
          {children}
        </div>
      </main>
    </>
  );
}
