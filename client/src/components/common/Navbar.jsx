import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Search, ShoppingCart, Menu, X } from 'lucide-react';

const categories = ["Today's Harvest", 'Best Sellers', 'Organic', 'Root Crops', 'Spices', 'Export Grade', 'Deals'];

export default function Navbar({ cartCount = 3 }) {
  const [category, setCategory] = useState('All');

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
              <Link to="/" className="navbar-account">
                <span className="navbar-account-greeting">Hello, Sign in</span>
                <span className="navbar-account-label">Account</span>
              </Link>

              <Link to="/" className="navbar-cart">
                <ShoppingCart size={20} />
                <span className="navbar-cart-label">Cart</span>
                {cartCount > 0 && (
                  <span className="navbar-cart-badge">{cartCount}</span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="navbar-categories">
        <div className="navbar-categories-inner">
          {categories.map(label => (
            <Link key={label} to="/" className="navbar-cat-link">{label}</Link>
          ))}
        </div>
      </div>
    </header>
  );
}
