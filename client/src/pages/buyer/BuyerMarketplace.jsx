import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Search, Filter, ShoppingCart, MapPin, Star,
  Package, Truck, Clock, CheckCircle, ArrowRight,
  TrendingUp, Leaf, ChevronDown, X, ShieldCheck
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchCrops, fetchPrediction, fetchTraceability } from '../../api/client';


function PriceTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip-panel">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <strong>₨ {p.value}</strong>
        </p>
      ))}
    </div>
  );
}


function ProductCard({ listing, onSelect }) {
  const jitColors = {
    'Harvest Triggered': { badge: 'badge-green', dot: 'var(--agro-green)' },
    'Awaiting Order':    { badge: 'badge-amber', dot: 'var(--agro-amber)' },
  };
  const statusStyle = jitColors[listing.jit_status] || { badge: 'badge-muted', dot: 'var(--text-muted)' };

  return (
    <div className="product-card" onClick={() => onSelect(listing)} id={`product-${listing.id}`}>

      <div className="product-card-top-row">
        <span className={`badge ${statusStyle.badge}`}>
          <span className="status-dot" style={{ background: statusStyle.dot }} />
          {listing.jit_status}
        </span>
        {listing.organic && <span className="badge badge-green"><Leaf size={12} className="badge-icon-inline" /> Organic</span>}
      </div>


      <div className="product-emoji">{listing.icon}</div>


      <h3 className="product-card-title">{listing.crop_name}</h3>

      <div className="product-card-origin">
        <MapPin size={11} />
        {listing.origin}
      </div>


      <div className="product-card-rating-row">
        <div className="product-card-stars">
          {[1,2,3,4,5].map(s => (
            <Star key={s} size={11} fill={s <= Math.floor(listing.rating) ? '#f59e0b' : 'none'} color="#f59e0b" />
          ))}
        </div>
        <span className="product-card-rating-text">{listing.rating} ({listing.orders} orders)</span>
      </div>


      <div className="product-card-price-row">
        <div>
          <div className="product-price">₨ {listing.price_per_kg}</div>
          <div className="product-unit">per kg</div>
        </div>
        <div className="product-card-avail-col">
          <div className="product-card-avail-qty">
            {listing.available_kg.toLocaleString()} kg
          </div>
          <div className="product-card-avail-label">available</div>
        </div>
      </div>


      <div className="product-card-footer-row">
        <div className="product-card-delivery-col">
          <Truck size={11} />
          {listing.delivery_days}d delivery
        </div>
        <span className="badge badge-muted">{listing.grade}</span>
      </div>
    </div>
  );
}


function OrderModal({ listing, onClose }) {
  const [qty, setQty] = useState(50);
  if (!listing) return null;

  const total = qty * listing.price_per_kg;

  return (
    <div className="order-modal-overlay">
      <div className="order-modal-content">

        <div className="order-modal-header">
          <div>
            <div className="order-modal-title-row">
              <span className="order-modal-icon">{listing.icon}</span>
              <h2 className="order-modal-title">
                {listing.crop_name}
              </h2>
            </div>
            <div className="order-modal-subtitle">
              <MapPin size={12} />
              {listing.origin} · Farmer: {listing.farmer_name}
            </div>
          </div>
          <button id="order-modal-close" onClick={onClose} className="btn btn-ghost order-modal-close-btn">
            <X size={20} />
          </button>
        </div>


        <div className="buyer-modal-grid">
          {[
            ['Grade', listing.grade],
            ['Packaging', listing.packaging],
            ['Delivery', `${listing.delivery_days} days`],
          ].map(([k, v]) => (
            <div key={k} className="order-modal-grid-item">
              <div className="order-modal-grid-label">{k}</div>
              <div className="order-modal-grid-val">{v}</div>
            </div>
          ))}
        </div>


        <div className="order-qty-section">
          <label className="order-qty-label">
            Order Quantity (kg)
          </label>
          <div className="order-qty-controls">
            <button id="order-qty-minus" className="btn btn-outline btn-sm" onClick={() => setQty(q => Math.max(10, q - 10))}>−</button>
            <input
              id="order-qty-input"
              type="number"
              className="input order-qty-input"
              value={qty}
              onChange={e => setQty(Math.max(10, Math.min(listing.available_kg, +e.target.value)))}
            />
            <button id="order-qty-plus" className="btn btn-outline btn-sm" onClick={() => setQty(q => Math.min(listing.available_kg, q + 10))}>+</button>
          </div>
          <p className="order-qty-hint">
            Max available: {listing.available_kg.toLocaleString()} kg
          </p>
        </div>


        <div className="order-total-panel">
          <div>
            <div className="order-total-label">Order Total</div>
            <div className="order-total-val">
              ₨ {total.toLocaleString('en-LK')}
            </div>
          </div>
          <div className="order-total-calc">
            <div>{qty} kg × ₨ {listing.price_per_kg}</div>
            <div>Harvest: {new Date(listing.harvest_date).toLocaleDateString('en-LK', { month: 'short', day: 'numeric' })}</div>
          </div>
        </div>


        <div className="order-trust-panel">
          <CheckCircle size={16} className="order-trust-icon" />
          <div>
            <div className="order-trust-title">JIT Harvest Alert</div>
            <div className="order-trust-desc">
              This advance payment triggers the farmer's JIT Harvest Alert.
            </div>
          </div>
        </div>


        <button id="order-place-btn" className="btn btn-primary btn-lg order-place-btn">
          Place Advance Order - ₨ {total.toLocaleString('en-LK')}
        </button>
      </div>
    </div>
  );
}


function TraceabilityPanel({ steps = [] }) {
  if (!steps.length) return null;
  return (
    <div className="chart-container chart-container-fit">
      <div className="chart-title chart-title-spaced"><MapPin size={16} className="badge-icon-inline" /> Order Traceability</div>
      <div className="chart-subtitle">Big Onion · Order #ALERT001</div>
      <div className="timeline timeline-spaced">
        {steps.map((step, i) => {
          const isActive = !step.done && (i === 0 || steps[i - 1].done);
          return (
            <div key={step.step} className="timeline-item">
              <div className={`timeline-dot ${step.done ? 'done' : isActive ? 'active' : ''}`}>
                {step.done && <CheckCircle size={8} color="#fff" className="timeline-icon-check" />}
              </div>
              <div style={{
                opacity: step.done || isActive ? 1 : 0.45,
                transition: 'var(--transition-base)'
              }}>
                <div className="timeline-content-flex">
                  <span className={`timeline-status ${step.done ? 'text-green' : isActive ? 'text-amber' : ''}`}>
                    {step.step}
                  </span>
                  {isActive && <span className="badge badge-amber timeline-badge-next">Next</span>}
                </div>
                <div className="timeline-time">
                  {step.date} · {step.location}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="timeline-desc">
        Updates automatically via farmer's mobile app.
      </div>
    </div>
  );
}


const categories = ['All', 'Vegetables', 'Root Crops', 'Fruits', 'Organic'];

export default function BuyerMarketplace() {
  const [search,        setSearch]        = useState('');
  const [activeCategory, setCategory]    = useState('All');
  const [sortBy,        setSortBy]        = useState('default');
  const [selectedItem,  setSelectedItem]  = useState(null);
  const [cartCount,     setCartCount]     = useState(0);

  const { data: cropListings = [] } = useQuery({ queryKey: ['crops'], queryFn: fetchCrops });
  const { data: prediction } = useQuery({ queryKey: ['prediction', 'ONION_BIG_LK'], queryFn: () => fetchPrediction('ONION_BIG_LK') });
  const { data: traceabilitySteps = [] } = useQuery({ queryKey: ['traceability', 'ALERT001'], queryFn: () => fetchTraceability('ALERT001') });

  const filtered = cropListings
    .filter(l =>
      (activeCategory === 'All' || l.category === activeCategory || (activeCategory === 'Organic' && l.organic)) &&
      (search === '' || l.crop_name.toLowerCase().includes(search.toLowerCase()) || l.origin.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) =>
      sortBy === 'price-asc'  ? a.price_per_kg - b.price_per_kg :
      sortBy === 'price-desc' ? b.price_per_kg - a.price_per_kg :
      sortBy === 'qty'        ? b.available_kg - a.available_kg : 0
    );

  return (
    <div className="buyer-page">

      <div className="buyer-hero">
        <div className="container">
          <div className="buyer-hero-header">
            <div>
              <div className="hero-eyebrow buyer-hero-eyebrow">
                <ShoppingCart size={18} className="buyer-hero-icon" /> D2C Marketplace
              </div>
              <h1 className="buyer-hero-title">
                Fresh From the{' '}
                <span className="gradient-text">Farm</span>
              </h1>
              <p className="buyer-hero-desc">
                Farm-to-doorstep in 24–72 hours. No intermediaries. No markup chains.
              </p>
            </div>

            <button id="buyer-cart-btn" className="btn btn-primary buyer-cart-btn">
              <ShoppingCart size={18} />
              Cart
              {cartCount > 0 && (
                <span className="buyer-cart-badge">{cartCount}</span>
              )}
            </button>
          </div>


          <div className="buyer-controls">

            <div className="buyer-search-wrap">
              <Search size={15} color="var(--text-muted)" className="buyer-search-icon" />
              <input
                id="marketplace-search"
                className="input buyer-search-input"
                placeholder="Search crops, origin, farmer..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <select
              id="marketplace-sort"
              className="input select buyer-sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="qty">Most Available</option>
            </select>
          </div>


          <div className="chip-row buyer-chips">
            {categories.map(cat => (
              <button
                key={cat}
                id={`cat-chip-${cat.toLowerCase().replace(' ', '-')}`}
                className={`chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>


      <div className="container buyer-content">
        <div className="buyer-layout-grid">


          <div>

            <div className="buyer-listings-header">
              <p className="buyer-listings-count">
                <strong>{filtered.length}</strong> listings found
              </p>
              <div className="buyer-filter-badges">
                {['Harvest Triggered', 'Organic'].map(filter => (
                  filtered.some(l => l.jit_status === filter || (filter === 'Organic' && l.organic)) &&
                  <span key={filter} className={`badge ${filter === 'Harvest Triggered' ? 'badge-green' : 'badge-muted'}`}>
                    {filter}
                  </span>
                ))}
              </div>
            </div>


            <div className="buyer-product-grid">
              {filtered.map((listing, i) => (
                <ProductCard
                  key={listing.id}
                  listing={listing}
                  onSelect={(l) => { setSelectedItem(l); setCartCount(c => c + 1); }}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="buyer-empty">
                <div className="buyer-empty-icon">
                  <Search size={48} strokeWidth={1} color="var(--border-default)" />
                </div>
                <p>No listings found for "{search}"</p>
              </div>
            )}
          </div>


          <div className="buyer-sidebar">

            <div className="chart-container">
              <div className="chart-title">
                <TrendingUp size={14} className="chart-icon" />
                Big Onion - Price Trend
              </div>
              <div className="chart-subtitle-small">
                SARIMA 12-week forecast
              </div>
              <ResponsiveContainer width="100%" height={130}>
                {prediction ? (
                <AreaChart
                  data={prediction.forecast.slice(0, 12)}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="buyerPriceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week_label" tick={{ fill: '#6b8f6b', fontSize: 9 }} axisLine={false} tickLine={false} interval={2} />
                  <YAxis tick={{ fill: '#6b8f6b', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<PriceTooltip />} />
                  <Area type="monotone" dataKey="price" name="₨/kg" stroke="#22c55e" strokeWidth={1.5} fill="url(#buyerPriceGrad)" />
                </AreaChart>
                ) : (
                  <div className="buyer-chart-loading">Loading forecast...</div>
                )}
              </ResponsiveContainer>
              <div className="buyer-chart-meta">
                <span>Current: <strong className="buyer-chart-highlight">₨ {prediction?.forecast?.[0]?.price ?? '-'}</strong></span>
                <span>12-wk avg: <strong className="buyer-chart-highlight-primary">₨ {prediction ? Math.round(prediction.forecast.slice(0, 12).reduce((s, w) => s + w.price, 0) / 12) : '-'}</strong></span>
              </div>
            </div>


            <TraceabilityPanel steps={traceabilitySteps} />


            <div className="card buyer-direct-card">
              <h4 className="buyer-direct-title">
                <ShieldCheck size={18} className="buyer-direct-icon" /> Why Buy Direct?
              </h4>
              {[
                ['Fresh harvest guarantee', '24–72hr delivery'],
                ['Full traceability',       'Farm to doorstep'],
                ['Fair to farmers',         '+42% price gain'],
                ['Zero hidden fees',        'Direct pricing'],
              ].map(([a, b]) => (
                <div key={a} className="buyer-direct-row">
                  <span className="buyer-direct-label">
                    <CheckCircle size={11} color="var(--agro-green-light)" className="buyer-direct-check" />
                    {a}
                  </span>
                  <span className="buyer-direct-value">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {selectedItem && (
        <OrderModal listing={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
