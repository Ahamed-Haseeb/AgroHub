import React, { useState } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Legend
} from 'recharts';
import {
  Leaf, LayoutDashboard, BarChart2, Bell, Package,
  TrendingUp, AlertTriangle, CheckCircle, ChevronRight,
  Sprout, ShoppingCart, Star, Zap, Info
} from 'lucide-react';
import { mockPrediction, cropAdvisory, harvestAlerts, availableCrops } from '../../data/mockData';

// ── Custom Tooltip for SARIMA Chart ──
function SarimaTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
      fontSize: 'var(--text-sm)',
      boxShadow: 'var(--shadow-lg)'
    }}>
      <p style={{ fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>₨ {p.value?.toLocaleString('en-LK')}</strong>
        </p>
      ))}
      {payload[0]?.payload?.lean_season && (
        <div style={{
          marginTop: 6, paddingTop: 6,
          borderTop: '1px solid var(--border-subtle)',
          color: 'var(--agro-amber-light)',
          fontSize: 11, fontWeight: 600
        }}>
          ⚡ LEAN SEASON — High Volatility
        </div>
      )}
    </div>
  );
}

// ── Sidebar nav config ──
const sidebarItems = [
  { id: 'overview',    label: 'Overview',        icon: <LayoutDashboard size={16} /> },
  { id: 'advisor',     label: 'Crop Advisor',     icon: <Sprout size={16} /> },
  { id: 'forecast',    label: 'Price Forecast',   icon: <BarChart2 size={16} /> },
  { id: 'alerts',      label: 'Harvest Alerts',   icon: <Bell size={16} /> },
  { id: 'packaging',   label: 'Packaging',        icon: <Package size={16} /> },
  { id: 'my-listings', label: 'My Listings',      icon: <ShoppingCart size={16} /> },
];

// ── Packaging Checklist ──
const packagingItems = [
  { id: 'p1', label: 'Ventilated plastic crates confirmed', required: true },
  { id: 'p2', label: 'Produce sorted by grade (A/A+)', required: true },
  { id: 'p3', label: 'Weight verified against order qty', required: true },
  { id: 'p4', label: 'Harvest timestamp logged', required: true },
  { id: 'p5', label: 'Crate ID / batch label attached', required: true },
  { id: 'p6', label: 'Cold chain pickup notified', required: false },
];

export default function FarmerDashboard() {
  const [activeTab, setActiveTab]         = useState('overview');
  const [selectedCrop, setSelectedCrop]   = useState('ONION_BIG_LK');
  const [checkedItems, setCheckedItems]   = useState({});
  const [dispatchReady, setDispatchReady] = useState(false);

  const prediction = mockPrediction; // In prod: fetch from FastAPI
  const allChecked = packagingItems.filter(i => i.required).every(i => checkedItems[i.id]);

  const toggleCheck = (id) => setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));

  const leanData = prediction.forecast.filter(d => d.lean_season);
  const regularData = prediction.forecast.filter(d => !d.lean_season);

  // Color bars for GARCH
  const garchRisk = prediction.garch_metrics.risk_score;
  const riskColor = garchRisk >= 70 ? 'var(--agro-red-light)' : garchRisk >= 45 ? 'var(--agro-amber-light)' : 'var(--agro-green-light)';
  const riskLabel = garchRisk >= 70 ? 'High Risk' : garchRisk >= 45 ? 'Moderate Risk' : 'Low Risk';

  return (
    <div className="dashboard-layout" style={{ paddingTop: 0 }}>
      {/* ── SIDEBAR ── */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <Leaf size={18} color="#22c55e" style={{ display: 'inline', marginRight: 6 }} />
          AgroHub
        </div>

        {/* Farmer profile */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)',
          marginBottom: 'var(--space-4)'
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'var(--grad-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: '#fff', flexShrink: 0
          }}>SP</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Suresh Perera</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Dambulla, Matale</div>
          </div>
          <span className="badge badge-green" style={{ marginLeft: 'auto', fontSize: 10 }}>JIT</span>
        </div>

        <div className="sidebar-section-label">Navigation</div>
        {sidebarItems.map(item => (
          <button
            key={item.id}
            id={`sidebar-${item.id}`}
            onClick={() => setActiveTab(item.id)}
            className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
            {item.id === 'alerts' && harvestAlerts.length > 0 && (
              <span style={{
                marginLeft: 'auto', minWidth: 18, height: 18,
                background: 'var(--agro-amber)', borderRadius: 'var(--radius-full)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: '#fff'
              }}>{harvestAlerts.length}</span>
            )}
          </button>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-6)' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(22,163,74,0.1), rgba(5,150,105,0.06))',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div className="wave-bars" />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--agro-green-light)' }}>AI Active</span>
            </div>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              SARIMA model retrained.<br />
              Next forecast: Monday 06:00
            </p>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="dashboard-main">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="page-enter">
            <div className="dashboard-header">
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 800 }}>
                  Good evening, Suresh 👋
                </h1>
                <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
                  Monday, June 16, 2026 · Dambulla Region
                </p>
              </div>
              <button id="dashboard-add-listing" className="btn btn-primary">
                <Sprout size={16} /> New Listing
              </button>
            </div>

            {/* KPI Row */}
            <div className="dashboard-grid dashboard-grid-4" style={{ marginBottom: 'var(--space-6)' }}>
              {[
                { label: 'Active Listings', value: '3', icon: '🌱', trend: '+1 this week' },
                { label: 'Pending Orders', value: '2', icon: '📦', trend: 'LKR 210,000' },
                { label: 'Revenue (Jun)', value: '₨ 84K', icon: '💰', trend: '+23% vs May' },
                { label: 'Waste Rate', value: '0%', icon: '♻️', trend: 'JIT Protected' },
              ].map(kpi => (
                <div key={kpi.label} className="stat-card">
                  <div style={{ fontSize: 24 }}>{kpi.icon}</div>
                  <div className="stat-value">{kpi.value}</div>
                  <div className="stat-label">{kpi.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--agro-green-light)', marginTop: 2 }}>{kpi.trend}</div>
                </div>
              ))}
            </div>

            {/* Harvest Alert Banner */}
            {harvestAlerts.map(alert => (
              <div key={alert.id} className="harvest-alert" style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                  <div style={{ marginTop: 2 }}>
                    <div className="alert-indicator">
                      <div className="alert-ping" />
                      <div className="alert-dot" />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                      marginBottom: 'var(--space-2)'
                    }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)' }}>
                        🔔 JIT Harvest Alert — {alert.crop}
                      </span>
                      <span className="badge badge-amber">CONFIRMED</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
                      {alert.message}
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
                      {[
                        ['Buyer', alert.buyer],
                        ['Qty', `${alert.quantity_kg.toLocaleString()} kg`],
                        ['Order Value', `₨ ${alert.order_value_lkr.toLocaleString('en-LK')}`],
                        ['Window', alert.harvest_window],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</div>
                          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button id="alert-confirm-harvest" className="btn btn-amber btn-sm" style={{ flexShrink: 0 }}>
                    Confirm Harvest
                  </button>
                </div>
              </div>
            ))}

            {/* Mini SARIMA Chart */}
            <div className="chart-container">
              <div className="flex-between" style={{ marginBottom: 'var(--space-4)' }}>
                <div>
                  <div className="chart-title">Big Onion — Price Forecast</div>
                  <div className="chart-subtitle">SARIMA(3,1,2)(0,0,2)[52] · Next 52 weeks · LKR/kg</div>
                </div>
                <button
                  id="view-full-forecast"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setActiveTab('forecast')}
                >
                  Full Analysis <ChevronRight size={14} />
                </button>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={prediction.forecast} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="leanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#d97706" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,197,94,0.06)" />
                  <XAxis dataKey="week_label" tick={{ fill: '#6b8f6b', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                  <YAxis tick={{ fill: '#6b8f6b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₨${v}`} />
                  <Tooltip content={<SarimaTooltip />} />
                  <Area type="monotone" dataKey="upper_ci" stroke="none" fill="url(#priceGrad)" fillOpacity={0.2} name="Upper CI" />
                  <Area type="monotone" dataKey="price"    stroke="#22c55e" strokeWidth={2} fill="url(#priceGrad)" name="Forecast Price" />
                  <Area type="monotone" dataKey="lower_ci" stroke="none" fill="none" name="Lower CI" />
                  <ReferenceLine y={300} stroke="rgba(217,119,6,0.4)" strokeDasharray="4 3" label={{ value: 'Lean Season', fill: '#d97706', fontSize: 10 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── CROP ADVISOR TAB ── */}
        {activeTab === 'advisor' && (
          <div className="page-enter">
            <div className="dashboard-header">
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 800 }}>
                  Strategic Crop Advisor 🌿
                </h1>
                <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
                  AI-powered recommendations based on national import gaps and market forecasts
                </p>
              </div>
            </div>

            {/* Advisory Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(22,163,74,0.08) 0%, rgba(13,148,136,0.05) 100%)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)',
              marginBottom: 'var(--space-6)', display: 'flex',
              alignItems: 'flex-start', gap: 'var(--space-4)'
            }}>
              <div style={{ fontSize: 28, marginTop: 2 }}>🤖</div>
              <div>
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 6 }}>
                  AI Analysis — June 2026 Report
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
                  Based on CMC wholesale data, DOA import statistics, and SARIMA models for Q3 2026,
                  these crops show the highest ROI potential for your Dambulla region.
                  All forecasts account for GARCH volatility adjustments.
                </p>
              </div>
            </div>

            {/* Advisory Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {cropAdvisory.map((item, i) => (
                <div
                  key={item.id}
                  className="card"
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)',
                    borderColor: item.urgency === 'high' ? 'rgba(22,163,74,0.30)' :
                                 item.urgency === 'medium' ? 'rgba(217,119,6,0.20)' : 'var(--border-subtle)',
                    animation: `fadeInUp 0.4s ease ${i * 0.1}s both`
                  }}
                >
                  <div style={{
                    width: 64, height: 64, borderRadius: 'var(--radius-lg)',
                    background: 'var(--bg-muted)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: 36, flexShrink: 0
                  }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xl)' }}>
                        {item.crop}
                      </h3>
                      <span className={`badge ${item.urgency === 'high' ? 'badge-green' : item.urgency === 'medium' ? 'badge-amber' : 'badge-muted'}`}>
                        {item.urgency === 'high' ? 'Top Pick' : item.urgency === 'medium' ? 'Recommended' : 'Stable'}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7, marginBottom: 'var(--space-3)' }}>
                      {item.reason}
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
                      {[
                        ['Est. ROI', item.roi_estimate, 'var(--agro-green-light)'],
                        ['Risk Level', item.risk, item.risk === 'Low' ? 'var(--agro-green-light)' : 'var(--agro-amber-light)'],
                        ['Season', item.season, 'var(--text-secondary)'],
                      ].map(([k, v, c]) => (
                        <div key={k}>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{k}</div>
                          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: c }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button id={`advisor-select-${item.id}`} className="btn btn-outline btn-sm">
                    Select Crop
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PRICE FORECAST TAB ── */}
        {activeTab === 'forecast' && (
          <div className="page-enter">
            <div className="dashboard-header">
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 800 }}>
                  Predictive Market Hub 📊
                </h1>
                <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
                  SARIMA + GARCH model outputs · Weekly LKR/kg forecasts
                </p>
              </div>
              {/* Crop selector */}
              <select
                id="forecast-crop-select"
                className="input select"
                style={{ width: 200 }}
                value={selectedCrop}
                onChange={e => setSelectedCrop(e.target.value)}
              >
                {availableCrops.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* GARCH Metrics Row */}
            <div className="dashboard-grid dashboard-grid-3" style={{ marginBottom: 'var(--space-6)' }}>
              <div className="stat-card" style={{ borderColor: 'rgba(37,99,235,0.20)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ color: '#60a5fa', fontSize: 13, fontWeight: 700 }}>GARCH(1,1) Model</span>
                </div>
                <div className="stat-value" style={{ fontSize: 'var(--text-2xl)' }}>
                  {(prediction.garch_metrics.current_volatility * 100).toFixed(1)}%
                </div>
                <div className="stat-label">Current Volatility (σ)</div>
                <div className="gauge-bar" style={{ marginTop: 12 }}>
                  <div className="gauge-fill gauge-medium" style={{ width: `${prediction.garch_metrics.current_volatility * 300}%` }} />
                </div>
              </div>

              <div className="stat-card" style={{ borderColor: `rgba(217,119,6,0.20)` }}>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ color: riskColor, fontSize: 13, fontWeight: 700 }}>Risk Assessment</span>
                </div>
                <div className="stat-value" style={{ fontSize: 'var(--text-2xl)', background: 'none', WebkitTextFillColor: riskColor, color: riskColor }}>
                  {garchRisk}/100
                </div>
                <div className="stat-label">{riskLabel}</div>
                <div className="gauge-bar" style={{ marginTop: 12 }}>
                  <div className="gauge-fill gauge-high" style={{ width: `${garchRisk}%` }} />
                </div>
              </div>

              <div className="stat-card" style={{ borderColor: 'rgba(22,163,74,0.20)' }}>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ color: 'var(--agro-green-light)', fontSize: 13, fontWeight: 700 }}>Forecast Confidence</span>
                </div>
                <div className="stat-value" style={{ fontSize: 'var(--text-2xl)' }}>
                  {(prediction.garch_metrics.forecast_confidence * 100).toFixed(0)}%
                </div>
                <div className="stat-label">Model Accuracy</div>
                <div className="gauge-bar" style={{ marginTop: 12 }}>
                  <div className="gauge-fill gauge-low" style={{ width: `${prediction.garch_metrics.forecast_confidence * 100}%` }} />
                </div>
              </div>
            </div>

            {/* SARIMA Full Chart */}
            <div className="chart-container" style={{ marginBottom: 'var(--space-6)' }}>
              <div className="chart-title">52-Week SARIMA Price Forecast — {prediction.crop_name}</div>
              <div className="chart-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span>{prediction.model} · Confidence Interval: 95%</span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.25)',
                  borderRadius: 'var(--radius-full)', padding: '2px 8px',
                  fontSize: 11, color: 'var(--agro-amber-light)', fontWeight: 600
                }}>
                  ⚡ Lean Seasons: Weeks 21–29, 49–52
                </span>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={prediction.forecast} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sarmaGradFull" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ciGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.08} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,197,94,0.06)" />
                  <XAxis dataKey="week_label" tick={{ fill: '#6b8f6b', fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
                  <YAxis tick={{ fill: '#6b8f6b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₨${v}`} />
                  <Tooltip content={<SarimaTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: '#6b8f6b' }} />
                  <Area type="monotone" dataKey="upper_ci" name="Upper CI" stroke="rgba(34,197,94,0.3)" strokeWidth={1} fill="url(#ciGrad)" strokeDasharray="4 2" />
                  <Area type="monotone" dataKey="price"    name="SARIMA Forecast (₨/kg)" stroke="#22c55e" strokeWidth={2.5} fill="url(#sarmaGradFull)" dot={(props) => {
                    if (!props.payload.lean_season) return null;
                    return <circle key={props.key} cx={props.cx} cy={props.cy} r={4} fill="#d97706" stroke="#f59e0b" strokeWidth={1.5} />;
                  }} />
                  <Area type="monotone" dataKey="lower_ci" name="Lower CI" stroke="rgba(34,197,94,0.3)" strokeWidth={1} fill="none" strokeDasharray="4 2" />
                  <ReferenceLine y={400} stroke="rgba(217,119,6,0.6)" strokeDasharray="5 3" label={{ value: 'Peak Lean', fill: '#d97706', fontSize: 10, position: 'right' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* GARCH Volatility Chart */}
            <div className="chart-container">
              <div className="chart-title">GARCH(1,1) Volatility Surface</div>
              <div className="chart-subtitle">Conditional variance (σ) throughout the year — higher = more price risk</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={prediction.garch_metrics.volatility_history} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(34,197,94,0.06)" />
                  <XAxis dataKey="week" tick={{ fill: '#6b8f6b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b8f6b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => (v * 100).toFixed(0) + '%'} />
                  <Tooltip
                    formatter={(v) => [(v * 100).toFixed(1) + '%', 'Volatility (σ)']}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Bar dataKey="sigma" fill="#16a34a" radius={[3,3,0,0]}
                    label={false}
                    style={{ fill: 'url(#barGrad)' }}
                  >
                    {prediction.garch_metrics.volatility_history.map((entry, index) => (
                      <rect
                        key={`bar-${index}`}
                        fill={entry.sigma > 0.25 ? '#d97706' : entry.sigma > 0.18 ? '#059669' : '#16a34a'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{
                marginTop: 'var(--space-4)', padding: 'var(--space-4)',
                background: 'rgba(22,163,74,0.05)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <Info size={14} color="var(--agro-green-light)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <strong style={{ color: 'var(--text-primary)' }}>AI Recommendation: </strong>
                    {prediction.garch_metrics.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── HARVEST ALERTS TAB ── */}
        {activeTab === 'alerts' && (
          <div className="page-enter">
            <div className="dashboard-header">
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 800 }}>
                  JIT Harvest Alerts 🔔
                </h1>
                <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
                  Harvest ONLY when triggered. Zero waste guarantee.
                </p>
              </div>
            </div>

            <div style={{
              background: 'rgba(217,119,6,0.06)',
              border: '1px solid rgba(217,119,6,0.20)',
              borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)',
              marginBottom: 'var(--space-6)',
              display: 'flex', alignItems: 'center', gap: 'var(--space-3)'
            }}>
              <AlertTriangle size={20} color="var(--agro-amber)" />
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                <strong style={{ color: 'var(--agro-amber-light)' }}>AgroHub Policy:</strong> Crop status changes to "Harvest Triggered" only after advance buyer payment is validated. No speculative harvests.
              </p>
            </div>

            {harvestAlerts.map(alert => (
              <div key={alert.id} className="card-glow" style={{ marginBottom: 'var(--space-5)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)' }}>
                  <div style={{ fontSize: 40 }}>🧅</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xl)' }}>
                        {alert.crop} — Order #{alert.id}
                      </h3>
                      <span className="badge badge-amber">HARVEST WINDOW OPEN</span>
                    </div>
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: 'var(--space-4)', marginBottom: 'var(--space-5)'
                    }}>
                      {[
                        ['Buyer', alert.buyer],
                        ['Quantity', `${alert.quantity_kg.toLocaleString()} kg`],
                        ['Total Value', `₨ ${alert.order_value_lkr.toLocaleString('en-LK')}`],
                        ['Harvest By', alert.harvest_window],
                      ].map(([k, v]) => (
                        <div key={k} style={{
                          background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
                          padding: 'var(--space-3)'
                        }}>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{k}</div>
                          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <p style={{
                      background: 'rgba(217,119,6,0.08)',
                      border: '1px solid rgba(217,119,6,0.20)',
                      borderRadius: 'var(--radius-md)', padding: 'var(--space-3)',
                      fontSize: 'var(--text-sm)', color: 'var(--agro-amber-light)', fontWeight: 500
                    }}>
                      ⚡ {alert.message}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-5)' }}>
                  <button id={`alert-reject-${alert.id}`} className="btn btn-outline btn-sm">Request Rescheduling</button>
                  <button id={`alert-accept-${alert.id}`} className="btn btn-amber">
                    ✓ Confirm — Begin Harvest
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── PACKAGING CHECKLIST TAB ── */}
        {activeTab === 'packaging' && (
          <div className="page-enter">
            <div className="dashboard-header">
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 800 }}>
                  Packaging Mandate 📦
                </h1>
                <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
                  Complete this checklist before dispatch. Required for JIT compliance.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 'var(--space-6)' }}>
              {/* Checklist */}
              <div className="card-elevated">
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-xl)', marginBottom: 'var(--space-5)' }}>
                  Pre-Dispatch Checklist
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {packagingItems.map(item => (
                    <label
                      key={item.id}
                      htmlFor={`check-${item.id}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                        background: checkedItems[item.id] ? 'rgba(22,163,74,0.08)' : 'var(--bg-elevated)',
                        border: `1px solid ${checkedItems[item.id] ? 'rgba(22,163,74,0.25)' : 'var(--border-subtle)'}`,
                        borderRadius: 'var(--radius-md)', padding: 'var(--space-4)',
                        cursor: 'pointer', transition: 'var(--transition-base)'
                      }}
                    >
                      <input
                        type="checkbox"
                        id={`check-${item.id}`}
                        checked={!!checkedItems[item.id]}
                        onChange={() => toggleCheck(item.id)}
                        style={{ width: 18, height: 18, accentColor: 'var(--agro-green)', cursor: 'pointer' }}
                      />
                      <span style={{
                        flex: 1, fontSize: 'var(--text-sm)', fontWeight: 500,
                        color: checkedItems[item.id] ? 'var(--text-primary)' : 'var(--text-secondary)',
                        textDecoration: checkedItems[item.id] ? 'line-through' : 'none',
                        transition: 'var(--transition-fast)'
                      }}>{item.label}</span>
                      {item.required && <span className="badge badge-red" style={{ fontSize: 9 }}>Required</span>}
                      {checkedItems[item.id] && <CheckCircle size={16} color="var(--agro-green-light)" />}
                    </label>
                  ))}
                </div>

                <div style={{ marginTop: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                    <span>Completion</span>
                    <span style={{ color: allChecked ? 'var(--agro-green-light)' : 'var(--text-primary)', fontWeight: 700 }}>
                      {Object.values(checkedItems).filter(Boolean).length}/{packagingItems.length}
                    </span>
                  </div>
                  <div className="gauge-bar">
                    <div
                      className={`gauge-fill ${allChecked ? 'gauge-low' : 'gauge-medium'}`}
                      style={{ width: `${(Object.values(checkedItems).filter(Boolean).length / packagingItems.length) * 100}%`, transition: 'width 0.4s ease' }}
                    />
                  </div>
                </div>

                <button
                  id="packaging-dispatch-btn"
                  className={`btn ${allChecked ? 'btn-primary' : 'btn-outline'} btn-lg`}
                  style={{ width: '100%', marginTop: 'var(--space-5)', justifyContent: 'center' }}
                  disabled={!allChecked}
                  onClick={() => setDispatchReady(true)}
                >
                  {allChecked ? '✓ Ready for Dispatch' : 'Complete All Required Items'}
                </button>

                {dispatchReady && (
                  <div className="harvest-alert" style={{ marginTop: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={16} color="var(--agro-green-light)" />
                      <span style={{ color: 'var(--agro-green-light)', fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                        Dispatch confirmed! Logistics partner notified.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Packaging Guide */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="card">
                  <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
                    📦 Crate Standard
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
                    Use <strong style={{ color: 'var(--text-primary)' }}>ventilated plastic crates</strong> (Type-3 HDPE) with a minimum 12% open area.
                    Max load: <strong style={{ color: 'var(--text-primary)' }}>25 kg per crate.</strong>
                  </p>
                </div>
                <div className="card">
                  <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
                    🌡️ Temperature
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
                    Store at <strong style={{ color: 'var(--text-primary)' }}>18–24°C</strong> post-harvest.
                    Cold chain vehicle will maintain <strong style={{ color: 'var(--text-primary)' }}>8–12°C</strong> during transport.
                  </p>
                </div>
                <div className="card" style={{ background: 'rgba(22,163,74,0.04)' }}>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
                    🏆 JIT Compliance
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
                    Compliance score: <strong style={{ color: 'var(--agro-green-light)' }}>98/100</strong>.
                    Farmers with &gt;95 score receive premium buyer placement and advance order priority.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MY LISTINGS TAB ── */}
        {activeTab === 'my-listings' && (
          <div className="page-enter">
            <div className="dashboard-header">
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 800 }}>
                  My Crop Listings 🌾
                </h1>
                <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
                  Manage your active marketplace listings
                </p>
              </div>
              <button id="add-new-listing-btn" className="btn btn-primary">
                <Sprout size={16} /> Add Listing
              </button>
            </div>

            {[
              { name: 'Big Onion', icon: '🧅', qty: '2,500 kg', price: '₨ 210/kg', status: 'Awaiting Order', statusColor: 'badge-amber', harvest: 'Jul 10, 2026' },
              { name: 'Capsicum', icon: '🫑', qty: '600 kg', price: '₨ 320/kg', status: 'Harvest Triggered', statusColor: 'badge-green', harvest: 'Jul 8, 2026' },
            ].map((listing, i) => (
              <div key={listing.name} className="card" style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-5)' }}>
                <div style={{ fontSize: 36 }}>{listing.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 6 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{listing.name}</h3>
                    <span className={`badge ${listing.statusColor}`}>{listing.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    <span>Qty: <strong style={{ color: 'var(--text-primary)' }}>{listing.qty}</strong></span>
                    <span>Price: <strong style={{ color: 'var(--agro-green-light)' }}>{listing.price}</strong></span>
                    <span>Harvest: <strong style={{ color: 'var(--text-primary)' }}>{listing.harvest}</strong></span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <button id={`listing-edit-${i}`} className="btn btn-outline btn-sm">Edit</button>
                  <button id={`listing-view-${i}`} className="btn btn-ghost btn-sm">View</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
