'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MAIN_NAV_ITEMS = [
  {
    href: '/book_read',
    icon: 'bi-grid-1x2-fill',
    label: 'Dashboard',
    badge: 'Library',
    match: (p) => p === '/' || p.startsWith('/book_read') || p.startsWith('/book_details'),
  },
  {
    href: '/book_create',
    icon: 'bi-plus-circle-fill',
    label: 'Add New Book',
    badge: '+ New',
    match: (p) => p.startsWith('/book_create'),
  },
];

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile drawer state
  const [collapsed, setCollapsed] = useState(false); // Desktop mini sidebar state
  const pathname = usePathname();

  // Load sidebar preference from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bookshelf_sidebar_collapsed');
      if (saved !== null) {
        setCollapsed(saved === 'true');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const nextState = !prev;
      try {
        localStorage.setItem('bookshelf_sidebar_collapsed', String(nextState));
      } catch (e) {
        console.error(e);
      }
      return nextState;
    });
  };

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

  return (
    <>
      {/* ── Mobile overlay ─────────────────────────────── */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* ── Sidebar (Next-Gen SaaS Redesign) ───────────── */}
      <aside
        className={`app-sidebar${sidebarOpen ? ' open' : ''}${collapsed ? ' collapsed' : ''}`}
        aria-label="Sidebar navigation"
      >
        {/* Brand & Collapse Toggle */}
        <div className="sidebar-brand-wrapper">
          <Link href="/book_read" className="sidebar-brand" title="BookShelf Pro Management">
            <div className="sidebar-brand-icon">
              <i className="bi bi-book-half"></i>
            </div>
            <div className="sidebar-brand-text">
              <div className="d-flex align-items-center gap-1.5">
                <span className="sidebar-brand-name">BookShelf</span>
                <span
                  style={{
                    fontSize: '9.5px',
                    fontWeight: 800,
                    background: 'rgba(99, 102, 241, 0.25)',
                    color: '#A5B4FC',
                    padding: '1px 6px',
                    borderRadius: '6px',
                    border: '1px solid rgba(99, 102, 241, 0.35)',
                    letterSpacing: '0.04em'
                  }}
                >
                  PRO
                </span>
              </div>
              <span className="sidebar-brand-sub">Library System</span>
            </div>
          </Link>

          {/* Collapse Toggle Button (Expanded State) */}
          <button
            type="button"
            onClick={toggleCollapse}
            className="sidebar-collapse-btn"
            title="Collapse Sidebar (Mini Mode)"
          >
            <i className="bi bi-chevron-left"></i>
          </button>
        </div>

        {/* Mini Expand Button (Visible only when Collapsed) */}
        <div className="px-2">
          <button
            type="button"
            onClick={toggleCollapse}
            className="sidebar-collapse-btn-mini"
            title="Expand Sidebar"
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>

        {/* Nav links */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main Menu</div>
          {MAIN_NAV_ITEMS.map((item) => {
            const isActive = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link${isActive ? ' active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <i className={`bi ${item.icon} sidebar-link-icon`}></i>
                {!collapsed && <span>{item.label}</span>}
                {item.badge && !collapsed && (
                  <span className="sidebar-badge">{item.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user" title={collapsed ? "Nithesh Kumar • Administrator" : undefined}>
            <div className="sidebar-user-avatar-wrap">
              <div className="sidebar-user-avatar">N</div>
              <div className="sidebar-user-online-badge"></div>
            </div>
            {!collapsed && (
              <>
                <div className="sidebar-user-info">
                  <span className="sidebar-user-name">Nithesh Kumar</span>
                  <span className="sidebar-user-role">Administrator</span>
                </div>
                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-none sidebar-user-dots"
                  style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', border: 'none', background: 'transparent' }}
                  title="System Settings"
                >
                  <i className="bi bi-gear-fill"></i>
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────── */}
      <main className={`app-main${collapsed ? ' sidebar-collapsed' : ''}`}>
        <div className="page-content">
          {children}
        </div>
      </main>
    </>
  );
}
