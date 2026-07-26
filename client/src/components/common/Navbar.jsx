import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Search, ShoppingCart, Menu, X, User, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ cartCount = 0 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (category !== 'All') params.append('category', category);
    
    navigate(`/?${params.toString()}`);
    setMobileSearchOpen(false);
  };

  return (
    <header>
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-row">
            <Link to="/" className="navbar-logo">
              <Leaf size={20} color="var(--primary)" />
              <span>AgroHub</span>
            </Link>

            <form className="navbar-search" onSubmit={handleSearch}>
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
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="navbar-search-btn">
                <Search size={16} />
              </button>
            </form>

            <div className="navbar-actions">
              <button
                className="navbar-mobile-search-btn"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {user ? (
                <div 
                  className="navbar-account dropdown-container"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <span className="navbar-account-greeting">Hello, {user.name.split(' ')[0]}</span>
                  <span className="navbar-account-label">
                    <User size={18} className="navbar-account-icon" />
                    <span className="navbar-account-text">Profile</span>
                  </span>

                  {dropdownOpen && (
                    <div className="navbar-dropdown">
                      <div className="navbar-dropdown-header">
                        <div className="navbar-dropdown-name">{user.name}</div>
                        <div className="navbar-dropdown-email">{user.email}</div>
                      </div>
                      <Link to={user.role === 'farmer' ? '/farmer' : '/buyer'} className="navbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <button 
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }} 
                        className="navbar-dropdown-item logout-btn"
                      >
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="navbar-account">
                  <span className="navbar-account-greeting">Hello, Sign in</span>
                  <span className="navbar-account-label">
                    <User size={18} className="navbar-account-icon" />
                    <span className="navbar-account-text">Account</span>
                  </span>
                </Link>
              )}

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
          <form className="navbar-mobile-search-inner" onSubmit={handleSearch}>
            <input
              type="text"
              className="auth-input"
              placeholder="Search fresh produce..."
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              <Search size={14} />
            </button>
          </form>
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
            {user ? (
              <Link to={user.role === 'farmer' ? '/farmer' : '/buyer'} className="navbar-mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
                <LayoutDashboard size={18} /> Dashboard
              </Link>
            ) : (
              <Link to="/login" className="navbar-mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
                <User size={18} /> Sign In / Register
              </Link>
            )}
            <Link to="/" className="navbar-mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>
              <ShoppingCart size={18} /> Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
          </div>
        </>
      )}
    </header>
  );
}
