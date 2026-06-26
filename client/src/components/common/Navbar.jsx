import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Menu, X, Bell, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/farmer') || location.pathname.startsWith('/buyer');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled || isDashboard ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-inner">
          {/* Logo */}
          <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
            <Leaf size={22} color="#22c55e" />
            AgroHub
          </Link>

          {/* Desktop Links */}
          {!isDashboard && (
            <ul className="nav-links">
              <li><a href="#features">Platform</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#stats">Impact</a></li>
            </ul>
          )}

          {/* Actions */}
          <div className="nav-actions">
            {isDashboard ? (
              <>
                <button
                  id="nav-alerts-btn"
                  className="btn btn-ghost btn-sm"
                  style={{ position: 'relative', padding: '8px' }}
                >
                  <Bell size={18} />
                  <span style={{
                    position: 'absolute', top: 4, right: 4,
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--agro-amber)', display: 'block'
                  }} />
                </button>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 12px 6px 8px',
                  cursor: 'pointer'
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--grad-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: '#fff'
                  }}>SP</div>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Suresh P.
                  </span>
                  <ChevronDown size={14} color="var(--text-muted)" />
                </div>
              </>
            ) : (
              <>
                <Link to="/buyer" className="btn btn-ghost btn-sm">Buyer Portal</Link>
                <Link to="/farmer" className="btn btn-primary btn-sm">Farmer Dashboard</Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            id="nav-mobile-toggle"
            className="btn btn-ghost"
            style={{ display: 'none' }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
