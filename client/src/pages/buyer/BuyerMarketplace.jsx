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
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)', padding: 'var(--space-3)',
      fontSize: 'var(--text-sm)', boxShadow: 'var(--shadow-lg)'
    }}>
      <p style={{ fontWeight: 700, marginBottom: 4, color: 'var(--text-primary)' }}>{label}</p>
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

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
        <span className={`badge ${statusStyle.badge}`}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: statusStyle.dot, display: 'inline-block' }} />
          {listing.jit_status}
        </span>
        {listing.organic && <span className="badge badge-green"><Leaf size={12} style={{ display: 'inline', marginRight: 4 }} /> Organic</span>}
      </div>


      <div className="product-emoji">{listing.icon}</div>


      <h3 style={{
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: 'var(--text-lg)', marginBottom: 'var(--space-1)'
      }}>{listing.crop_name}</h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginBottom: 'var(--space-3)' }}>
        <MapPin size={11} />
        {listing.origin}
      </div>


      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', gap: 2 }}>
          {[1,2,3,4,5].map(s => (
            <Star key={s} size={11} fill={s <= Math.floor(listing.rating) ? '#f59e0b' : 'none'} color="#f59e0b" />
          ))}
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{listing.rating} ({listing.orders} orders)</span>
      </div>


      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-end', marginBottom: 'var(--space-4)'
      }}>
        <div>
          <div className="product-price">₨ {listing.price_per_kg}</div>
          <div className="product-unit">per kg</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
            {listing.available_kg.toLocaleString()} kg
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>available</div>
        </div>
      </div>


      <div style={{
        paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border-subtle)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 11 }}>
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
    <div style={{
      position: 'fixed', inset: 0, zIndex: 'var(--z-modal)',
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(6px)', padding: 'var(--space-4)'
    }}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)',
        width: '100%', maxWidth: 520,
        animation: 'scaleIn 0.25s ease both'
      }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 4 }}>
              <span style={{ fontSize: 32 }}>{listing.icon}</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 800 }}>
                {listing.crop_name}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
              <MapPin size={12} />
              {listing.origin} · Farmer: {listing.farmer_name}
            </div>
          </div>
          <button id="order-modal-close" onClick={onClose} className="btn btn-ghost" style={{ padding: 6 }}>
            <X size={20} />
          </button>
        </div>


        <div className="buyer-modal-grid" style={{ marginBottom: 'var(--space-6)' }}>
          {[
            ['Grade', listing.grade],
            ['Packaging', listing.packaging],
            ['Delivery', `${listing.delivery_days} days`],
          ].map(([k, v]) => (
            <div key={k} style={{
              background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3)', textAlign: 'center'
            }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{k}</div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{v}</div>
            </div>
          ))}
        </div>


        <div style={{ marginBottom: 'var(--space-5)' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
            Order Quantity (kg)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button id="order-qty-minus" className="btn btn-outline btn-sm" onClick={() => setQty(q => Math.max(10, q - 10))}>−</button>
            <input
              id="order-qty-input"
              type="number"
              className="input"
              value={qty}
              onChange={e => setQty(Math.max(10, Math.min(listing.available_kg, +e.target.value)))}
              style={{ textAlign: 'center', fontWeight: 700 }}
            />
            <button id="order-qty-plus" className="btn btn-outline btn-sm" onClick={() => setQty(q => Math.min(listing.available_kg, q + 10))}>+</button>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
            Max available: {listing.available_kg.toLocaleString()} kg
          </p>
        </div>


        <div style={{
          background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.20)',
          borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 'var(--space-5)'
        }}>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Total</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-2xl)', color: 'var(--agro-green-light)' }}>
              ₨ {total.toLocaleString('en-LK')}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            <div>{qty} kg × ₨ {listing.price_per_kg}</div>
            <div>Harvest: {new Date(listing.harvest_date).toLocaleDateString('en-LK', { month: 'short', day: 'numeric' })}</div>
          </div>
        </div>


        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11, color: 'var(--text-muted)', marginBottom: 'var(--space-5)'
        }}>
          <CheckCircle size={12} color="var(--agro-green-light)" />
          This advance payment triggers the farmer's JIT Harvest Alert.
        </div>


        <button id="order-place-btn" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
          Place Advance Order - ₨ {total.toLocaleString('en-LK')}
        </button>
      </div>
    </div>
  );
}


function TraceabilityPanel({ steps = [] }) {
  if (!steps.length) return null;
  return (
    <div className="chart-container" style={{ height: 'fit-content' }}>
      <div className="chart-title" style={{ marginBottom: 'var(--space-2)' }}><MapPin size={16} style={{ display: 'inline', marginRight: 6 }} /> Order Traceability</div>
      <div className="chart-subtitle">Big Onion · Order #ALERT001</div>
      <div className="timeline" style={{ marginTop: 'var(--space-5)' }}>
        {steps.map((step, i) => {
          const isActive = !step.done && (i === 0 || steps[i - 1].done);
          return (
            <div key={step.step} className="timeline-item">
              <div className={`timeline-dot ${step.done ? 'done' : isActive ? 'active' : ''}`}>
                {step.done && <CheckCircle size={8} color="#fff" style={{ position: 'absolute', inset: 0, margin: 'auto' }} />}
              </div>
              <div style={{
                opacity: step.done || isActive ? 1 : 0.45,
                transition: 'var(--transition-base)'
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', marginBottom: 2
                }}>
                  <span style={{
                    fontWeight: 600, fontSize: 'var(--text-sm)',
                    color: step.done ? 'var(--agro-green-light)' : isActive ? 'var(--agro-amber-light)' : 'var(--text-secondary)'
                  }}>{step.step}</span>
                  {isActive && <span className="badge badge-amber" style={{ fontSize: 9 }}>Next</span>}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {step.date} · {step.location}
                </div>
              </div>
            </div>
          );
        })}
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
    <div style={{ minHeight: '100vh', paddingTop: 72 }}>

      <div style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: 'var(--space-8) 0'
      }}>
        <div className="container">
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', marginBottom: 'var(--space-6)'
          }}>
            <div>
              <div className="hero-eyebrow" style={{ animation: 'none', display: 'inline-flex', marginBottom: 'var(--space-3)' }}>
                <ShoppingCart size={18} style={{ display: 'inline', marginRight: 6 }} /> D2C Marketplace
              </div>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)',
                fontWeight: 900, marginBottom: 'var(--space-2)'
              }}>
                Fresh From the{' '}
                <span className="gradient-text">Farm</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)' }}>
                Farm-to-doorstep in 24–72 hours. No intermediaries. No markup chains.
              </p>
            </div>

            <button id="buyer-cart-btn" className="btn btn-primary" style={{ position: 'relative' }}>
              <ShoppingCart size={18} />
              Cart
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: -8, right: -8,
                  width: 20, height: 20, background: 'var(--agro-amber)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800
                }}>{cartCount}</span>
              )}
            </button>
          </div>


          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>

            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                id="marketplace-search"
                className="input"
                placeholder="Search crops, origin, farmer..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 40 }}
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


          <div className="chip-row" style={{ marginTop: 'var(--space-4)' }}>
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


      <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-16)' }}>
        <div className="buyer-layout-grid">


          <div>

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 'var(--space-5)'
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> listings found
              </p>
              <div style={{ display: 'flex', gap: 6 }}>
                {['Harvest Triggered', 'Organic'].map(filter => (
                  filtered.some(l => l.jit_status === filter || (filter === 'Organic' && l.organic)) &&
                  <span key={filter} className={`badge ${filter === 'Harvest Triggered' ? 'badge-green' : 'badge-muted'}`}>
                    {filter}
                  </span>
                ))}
              </div>
            </div>


            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 'var(--space-5)'
            }}>
              {filtered.map((listing, i) => (
                <ProductCard
                  key={listing.id}
                  listing={listing}
                  onSelect={(l) => { setSelectedItem(l); setCartCount(c => c + 1); }}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--text-muted)' }}>
                <div style={{ marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'center' }}>
                  <Search size={48} strokeWidth={1} color="var(--border-default)" />
                </div>
                <p>No listings found for "{search}"</p>
              </div>
            )}
          </div>


          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

            <div className="chart-container">
              <div className="chart-title" style={{ fontSize: 'var(--text-base)', marginBottom: 4 }}>
                <TrendingUp size={14} style={{ display: 'inline', marginRight: 6, color: 'var(--agro-green-light)' }} />
                Big Onion - Price Trend
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
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
                  <div style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 12 }}>Loading forecast...</div>
                )}
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                <span>Current: <strong style={{ color: 'var(--agro-green-light)' }}>₨ {prediction?.forecast?.[0]?.price ?? '-'}</strong></span>
                <span>12-wk avg: <strong style={{ color: 'var(--text-primary)' }}>₨ {prediction ? Math.round(prediction.forecast.slice(0, 12).reduce((s, w) => s + w.price, 0) / 12) : '-'}</strong></span>
              </div>
            </div>


            <TraceabilityPanel steps={traceabilitySteps} />


            <div className="card" style={{ background: 'linear-gradient(145deg, rgba(22,163,74,0.08), var(--bg-card))' }}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-4)', fontSize: 'var(--text-base)' }}>
                <ShieldCheck size={18} style={{ display: 'inline', marginRight: 6, color: 'var(--agro-green-light)' }} /> Why Buy Direct?
              </h4>
              {[
                ['Fresh harvest guarantee', '24–72hr delivery'],
                ['Full traceability',       'Farm to doorstep'],
                ['Fair to farmers',         '+42% price gain'],
                ['Zero hidden fees',        'Direct pricing'],
              ].map(([a, b]) => (
                <div key={a} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: 'var(--space-2) 0',
                  borderBottom: '1px solid var(--border-subtle)',
                  fontSize: 'var(--text-sm)'
                }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    <CheckCircle size={11} color="var(--agro-green-light)" style={{ display: 'inline', marginRight: 6 }} />
                    {a}
                  </span>
                  <span style={{ color: 'var(--agro-green-light)', fontWeight: 600 }}>{b}</span>
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
