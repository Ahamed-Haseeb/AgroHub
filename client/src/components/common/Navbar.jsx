import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Search, ShoppingCart, Menu, X, User } from 'lucide-react';


export default function Navbar({ cartCount = 3 }) {
  const [category, setCategory] = useState('All');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header>
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-row">
            <Link to="/" className="navbar-logo">
              <Leaf size={20} color="var(--primary)" />
              <span>AgroHub</span>
            </Link>

            <div className="navbar-search">
              <select
                className="navbar-search-select"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option>All</option>
                <option>Vegetables</option>
                <option>Root Crops</option>
                <option>Greens</option>
                <option>Spices</option>
              </select>
              <input
                className="navbar-search-input"
                type="text"
                placeholder="Search AgroHub"
              />
              <button className="navbar-search-btn">
                <Search size={16} />
              </button>
            </div>

            <div className="navbar-actions">
              <button
                className="navbar-mobile-search-btn"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <Link to="/login" className="navbar-account">
                <span className="navbar-account-greeting">Hello, Sign in</span>
                <span className="navbar-account-label">
                  <User size={18} className="navbar-account-icon" />
                  <span className="navbar-account-text">Account</span>
                </span>
              </Link>

              <Link to="/" className="navbar-cart">
                <ShoppingCart size={20} />
                <span className="navbar-cart-label">Cart</span>
                {cartCount > 0 && (
                  <span className="navbar-cart-badge">{cartCount}</span>
                )}
              </Link>

              <button
                className="navbar-hamburger"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileSearchOpen && (
        <div className="navbar-mobile-search">
          <div className="navbar-mobile-search-inner">
            <input
              type="text"
              className="auth-input"
              placeholder="Search fresh produce..."
              autoFocus
            />
            <button className="btn btn-primary btn-sm" onClick={() => setMobileSearchOpen(false)}>
              <Search size={14} />
            </button>
          </div>
        </div>
      )}


      {mobileMenuOpen && (
        <>
          <div className="navbar-mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
          <div className="navbar-mobile-menu">
            <div className="navbar-mobile-menu-header">
              <Link to="/" className="navbar-logo" onClick={() => setMobileMenuOpen(false)}>
                <Leaf size={18} color="var(--primary)" />
                <span>AgroHub</span>
              </Link>
              <button
                className="navbar-hamburger navbar-hamburger-menu-open"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <Link to="/login" className="navbar-mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
              <User size={18} /> Sign In / Register
            </Link>
            <Link to="/" className="navbar-mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
              <ShoppingCart size={18} /> Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
          </div>
        </>
      )}
    </header>
  );
}
