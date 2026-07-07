import React, { useState } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Leaf, LayoutDashboard, BarChart2, Bell, Package,
  AlertTriangle, CheckCircle, LogOut, Sprout, Info,
  Settings, TrendingUp, ClipboardList, Menu
} from 'lucide-react';
import { mockPrediction, cropAdvisory, harvestAlerts, availableCrops } from '../../data/mockData';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-white)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)', padding: '10px 14px',
      fontSize: 13, boxShadow: 'var(--shadow-lg)'
    }}>
      <p style={{ fontWeight: 700, marginBottom: 4, color: 'var(--text-heading)' }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <strong>₨ {p.value?.toLocaleString('en-LK')}</strong>
        </p>
      ))}
    </div>
  );
}

const sidebarItems = [
  { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'advisor', label: 'Crops', icon: <Sprout size={18} /> },
  { id: 'forecast', label: 'Analytics', icon: <BarChart2 size={18} /> },
  { id: 'alerts', label: 'Orders', icon: <ClipboardList size={18} /> },
  { id: 'packaging', label: 'Inventory', icon: <Package size={18} /> },
  { id: 'my-listings', label: 'Market', icon: <TrendingUp size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

const packagingItems = [
  { id: 'p1', label: 'Ventilated plastic crates confirmed', required: true },
  { id: 'p2', label: 'Produce sorted by grade (A/A+)', required: true },
  { id: 'p3', label: 'Weight verified against order qty', required: true },
  { id: 'p4', label: 'Harvest timestamp logged', required: true },
  { id: 'p5', label: 'Crate ID / batch label attached', required: true },
  { id: 'p6', label: 'Cold chain pickup notified', required: false },
];

const cropPrices = [
  { rank: 1, name: 'Big Onion', price: '₨ 310.50', change: '+3.2%', direction: 'positive', label: 'Sage', updated: 'Last updated Jul 6, 2026' },
  { rank: 2, name: 'Capsicum', price: '₨ 295.80', change: '-1.1%', direction: 'negative', label: 'Terracotta', updated: 'Last updated Jul 6, 2026' },
  { rank: 3, name: 'Carrot', price: '₨ 185.10', change: '+2.5%', direction: 'positive', label: 'Sage', updated: 'Last updated Jul 6, 2026' },
];

const activeOrders = [
  { id: '#ORD-1023', crop: 'Big Onion', quantity: '500 kg', status: 'Processing', statusClass: 'status-processing', price: '₨ 105,000' },
  { id: '#ORD-1022', crop: 'Capsicum', quantity: '200 kg', status: 'Shipped', statusClass: 'status-shipped', price: '₨ 59,160' },
  { id: '#ORD-1021', crop: 'Carrot', quantity: '350 kg', status: 'Completed', statusClass: 'status-completed', price: '₨ 50,750' },
  { id: '#ORD-1020', crop: 'Leeks', quantity: '180 kg', status: 'Processing', statusClass: 'status-processing', price: '₨ 29,700' },
];

const forecastChartData = [
  { month: 'Jul', onion: 90, capsicum: 80 },
  { month: 'Aug', onion: 120, capsicum: 110 },
  { month: 'Sep', onion: 180, capsicum: 140 },
  { month: 'Oct', onion: 240, capsicum: 200 },
  { month: 'Nov', onion: 280, capsicum: 310 },
  { month: 'Dec', onion: 350, capsicum: 340 },
];

export default function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCrop, setSelectedCrop] = useState('ONION_BIG_LK');
  const [checkedItems, setCheckedItems] = useState({});
  const [dispatchReady, setDispatchReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const prediction = mockPrediction;
  const allChecked = packagingItems.filter(i => i.required).every(i => checkedItems[i.id]);
  const toggleCheck = id => setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  const garchRisk = prediction.garch_metrics.risk_score;
  const riskColor = garchRisk >= 70 ? 'var(--red)' : garchRisk >= 45 ? 'var(--amber)' : 'var(--primary)';
  const riskLabel = garchRisk >= 70 ? 'High Risk' : garchRisk >= 45 ? 'Moderate Risk' : 'Low Risk';

  return (
    <>
      {/* Mobile header */}
      <div className="dash-mobile-header">
        <span><Leaf size={18} /> AgroHub</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: 'white' }}>
          <Menu size={20} />
        </button>
      </div>

      <div className="dashboard-layout">
        <aside className={`dashboard-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-logo">
            <Leaf size={20} color="var(--bg-white)" />
            AgroHub
          </div>

          <div className="sidebar-nav">
            {sidebarItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          <div className="sidebar-user">
            <div className="sidebar-avatar">SP</div>
            <div>
              <div className="sidebar-user-name">Suresh Perera</div>
              <div className="sidebar-user-role">Farmer</div>
            </div>
          </div>

          <button className="sidebar-logout">
            <LogOut size={16} />
            Log out
          </button>
        </aside>

        <main className="dashboard-main">
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              <div className="dash-header">
                <div>
                  <h1 className="dash-page-title">Dashboard Overview</h1>
                  <p className="dash-page-date">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <button className="dash-notify-btn"><Bell size={18} /></button>
              </div>

              <div className="dash-content">
                <div className="crop-price-stack">
                  {cropPrices.map(crop => (
                    <div key={crop.rank} className="crop-price-card">
                      <div className="crop-price-rank">{crop.rank}. {crop.name}</div>
                      <div className="crop-price-value">{crop.price}</div>
                      <div className="crop-price-change" style={{ color: crop.direction === 'positive' ? 'var(--primary)' : 'var(--amber)' }}>
                        {crop.change}, {crop.label}
                      </div>
                      <div className="crop-price-updated">{crop.updated}</div>
                    </div>
                  ))}
                </div>

                <div className="dash-chart-card">
                  <div className="dash-chart-title">Crop Price Forecast (Next 6 Months)</div>
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={forecastChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 13 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 13 }} axisLine={false} tickLine={false} tickFormatter={v => `₨${v}`} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 13, paddingTop: 8 }} iconType="plainline" />
                      <Line type="monotone" dataKey="onion" name="Big Onion" stroke="var(--primary)" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="capsicum" name="Capsicum" stroke="var(--primary)" strokeWidth={2.5} strokeDasharray="6 4" dot={false} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="orders-section">
                <div className="orders-card">
                  <div className="orders-title">Active Orders</div>
                  <table className="orders-table">
                    <thead>
                      <tr><th>Order ID</th><th>Crop</th><th>Quantity</th><th>Status</th><th>Price</th></tr>
                    </thead>
                    <tbody>
                      {activeOrders.map(order => (
                        <tr key={order.id}>
                          <td className="fw-600">{order.id}</td>
                          <td>{order.crop}</td>
                          <td>{order.quantity}</td>
                          <td><span className={`status-badge ${order.statusClass}`}>{order.status}</span></td>
                          <td className="fw-600">{order.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* CROPS */}
          {activeTab === 'advisor' && (
            <div className="animate-fade-in">
              <h1 className="dash-page-title">Crop Advisor</h1>
              <p className="dash-page-date">AI-powered recommendations based on national import gaps</p>

              <div className="dash-info-banner" style={{ marginTop: 28, marginBottom: 20 }}>
                <span style={{ fontSize: 22 }}>🤖</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>AI Analysis — July 2026</div>
                  <p style={{ color: 'var(--text-body)', fontSize: 14, lineHeight: 1.6 }}>
                    Based on CMC wholesale data and SARIMA models for Q3 2026, these crops show the highest ROI for Dambulla.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {cropAdvisory.map(item => (
                  <div key={item.id} className="dash-info-card" style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0
                    }}>{item.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700 }}>{item.crop}</h3>
                        <span className={`badge ${item.urgency === 'high' ? 'badge-green' : item.urgency === 'medium' ? 'badge-amber' : 'badge-muted'}`}>
                          {item.urgency === 'high' ? 'Top Pick' : item.urgency === 'medium' ? 'Recommended' : 'Stable'}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-body)', fontSize: 14, lineHeight: 1.6, marginBottom: 10 }}>{item.reason}</p>
                      <div style={{ display: 'flex', gap: 28 }}>
                        {[['ROI', item.roi_estimate, 'var(--primary)'], ['Risk', item.risk, item.risk === 'Low' ? 'var(--primary)' : 'var(--amber)'], ['Season', item.season, 'var(--text-body)']].map(([k, v, c]) => (
                          <div key={k}>
                            <div className="dash-detail-label">{k}</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: c }}>{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button className="btn btn-outline btn-sm">Select</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {activeTab === 'forecast' && (
            <div className="animate-fade-in">
              <div className="dash-header" style={{ marginBottom: 28 }}>
                <div>
                  <h1 className="dash-page-title">Analytics</h1>
                  <p className="dash-page-date">SARIMA + GARCH model outputs · Weekly LKR/kg</p>
                </div>
                <select className="input select" style={{ width: 180 }} value={selectedCrop} onChange={e => setSelectedCrop(e.target.value)}>
                  {availableCrops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="dash-metric-grid" style={{ marginBottom: 24 }}>
                {[
                  { label: 'GARCH(1,1) Volatility', value: `${(prediction.garch_metrics.current_volatility * 100).toFixed(1)}%`, sub: 'Current σ', color: 'var(--blue)', pct: prediction.garch_metrics.current_volatility * 300, gaugeClass: 'gauge-amber' },
                  { label: 'Risk Score', value: `${garchRisk}/100`, sub: riskLabel, color: riskColor, pct: garchRisk, gaugeClass: garchRisk >= 70 ? 'gauge-red' : garchRisk >= 45 ? 'gauge-amber' : 'gauge-green' },
                  { label: 'Forecast Confidence', value: `${(prediction.garch_metrics.forecast_confidence * 100).toFixed(0)}%`, sub: 'Model accuracy', color: 'var(--primary)', pct: prediction.garch_metrics.forecast_confidence * 100, gaugeClass: 'gauge-green' },
                ].map(card => (
                  <div key={card.label} className="dash-metric-card">
                    <div className="dash-metric-label" style={{ color: card.color }}>{card.label}</div>
                    <div className="dash-metric-value">{card.value}</div>
                    <div className="dash-metric-sub">{card.sub}</div>
                    <div className="gauge-bar"><div className={`gauge-fill ${card.gaugeClass}`} style={{ width: `${Math.min(card.pct, 100)}%` }} /></div>
                  </div>
                ))}
              </div>

              <div className="dash-chart-card" style={{ marginBottom: 24 }}>
                <div className="dash-chart-title">52-Week SARIMA Forecast — {prediction.crop_name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{prediction.model} · 95% CI</span>
                  <span className="badge badge-amber">⚡ Lean: Weeks 21–29, 49–52</span>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={prediction.forecast} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="sarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="week_label" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} interval={3} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₨${v}`} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="upper_ci" name="Upper CI" stroke="var(--border-hover)" strokeWidth={1} fill="none" strokeDasharray="4 2" />
                    <Area type="monotone" dataKey="price" name="Forecast (₨/kg)" stroke="var(--primary)" strokeWidth={2.5} fill="url(#sarGrad)"
                      dot={props => {
                        if (!props.payload.lean_season) return null;
                        return <circle key={props.key} cx={props.cx} cy={props.cy} r={4} fill="var(--amber)" stroke="var(--amber-light)" strokeWidth={1.5} />;
                      }}
                    />
                    <Area type="monotone" dataKey="lower_ci" name="Lower CI" stroke="var(--border-hover)" strokeWidth={1} fill="none" strokeDasharray="4 2" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="dash-chart-card">
                <div className="dash-chart-title">GARCH(1,1) Volatility Surface</div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={prediction.garch_metrics.volatility_history} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="week" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => (v * 100).toFixed(0) + '%'} />
                    <Tooltip formatter={v => [(v * 100).toFixed(1) + '%', 'Volatility (σ)']} contentStyle={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13 }} />
                    <Bar dataKey="sigma" radius={[4, 4, 0, 0]}>
                      {prediction.garch_metrics.volatility_history.map((entry, index) => (
                        <rect key={`bar-${index}`} fill={entry.sigma > 0.25 ? 'var(--amber)' : entry.sigma > 0.18 ? 'var(--primary)' : 'var(--primary-light)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="dash-info-banner" style={{ marginTop: 16 }}>
                  <Info size={14} color="var(--primary)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: 14, color: 'var(--text-body)', lineHeight: 1.6 }}>
                    <strong>AI Recommendation: </strong>{prediction.garch_metrics.recommendation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === 'alerts' && (
            <div className="animate-fade-in">
              <h1 className="dash-page-title">Orders</h1>
              <p className="dash-page-date">JIT harvest alerts and active order management</p>

              <div style={{ background: 'var(--amber-light)', border: '1px solid var(--amber)', borderRadius: 'var(--radius-md)', padding: 14, marginTop: 28, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertTriangle size={18} color="var(--amber)" />
                <p style={{ color: '#92400e', fontSize: 14 }}><strong>Policy:</strong> Harvest is triggered only after buyer payment is validated.</p>
              </div>

              {harvestAlerts.map(alert => (
                <div key={alert.id} className="dash-alert-card">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ fontSize: 32 }}>🧅</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <h3 style={{ fontSize: 17, fontWeight: 700 }}>{alert.crop} — {alert.id}</h3>
                        <span className="status-badge status-processing">Harvest Window</span>
                      </div>
                      <div className="dash-detail-grid" style={{ marginBottom: 14 }}>
                        {[['Buyer', alert.buyer], ['Quantity', `${alert.quantity_kg.toLocaleString()} kg`], ['Value', `₨ ${alert.order_value_lkr.toLocaleString('en-LK')}`], ['Window', alert.harvest_window]].map(([k, v]) => (
                          <div key={k} className="dash-detail-item">
                            <div className="dash-detail-label">{k}</div>
                            <div className="dash-detail-value">{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
                    <button className="btn btn-outline btn-sm">Reschedule</button>
                    <button className="btn btn-primary">✓ Confirm Harvest</button>
                  </div>
                </div>
              ))}

              <div className="orders-card" style={{ marginTop: 24 }}>
                <div className="orders-title">All Orders</div>
                <table className="orders-table">
                  <thead><tr><th>Order ID</th><th>Crop</th><th>Quantity</th><th>Status</th><th>Price</th></tr></thead>
                  <tbody>
                    {activeOrders.map(order => (
                      <tr key={order.id}>
                        <td className="fw-600">{order.id}</td>
                        <td>{order.crop}</td>
                        <td>{order.quantity}</td>
                        <td><span className={`status-badge ${order.statusClass}`}>{order.status}</span></td>
                        <td className="fw-600">{order.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* INVENTORY */}
          {activeTab === 'packaging' && (
            <div className="animate-fade-in">
              <h1 className="dash-page-title">Inventory & Packaging</h1>
              <p className="dash-page-date">Pre-dispatch checklist and compliance</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: 24, marginTop: 28 }}>
                <div className="dash-info-card" style={{ padding: 28 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Pre-Dispatch Checklist</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {packagingItems.map(item => (
                      <label
                        key={item.id}
                        htmlFor={`check-${item.id}`}
                        className={`dash-checklist-item ${checkedItems[item.id] ? 'checked' : ''}`}
                      >
                        <input
                          type="checkbox" id={`check-${item.id}`}
                          checked={!!checkedItems[item.id]}
                          onChange={() => toggleCheck(item.id)}
                          style={{ width: 18, height: 18, accentColor: 'var(--primary)', cursor: 'pointer' }}
                        />
                        <span className={`dash-checklist-label ${checkedItems[item.id] ? 'done' : ''}`}>{item.label}</span>
                        {item.required && <span className="badge badge-red" style={{ fontSize: 10 }}>Required</span>}
                        {checkedItems[item.id] && <CheckCircle size={16} color="var(--primary)" />}
                      </label>
                    ))}
                  </div>

                  <div style={{ marginTop: 20 }}>
                    <div className="dash-progress-bar">
                      <span>Progress</span>
                      <span className="fw-700 text-heading">{checkedCount}/{packagingItems.length}</span>
                    </div>
                    <div className="gauge-bar">
                      <div className={`gauge-fill ${allChecked ? 'gauge-green' : 'gauge-amber'}`}
                        style={{ width: `${(checkedCount / packagingItems.length) * 100}%` }} />
                    </div>
                  </div>

                  <button
                    className={`btn ${allChecked ? 'btn-primary' : 'btn-outline'} btn-block btn-lg`}
                    style={{ marginTop: 16 }}
                    disabled={!allChecked}
                    onClick={() => setDispatchReady(true)}
                  >
                    {allChecked ? '✓ Ready for Dispatch' : 'Complete All Required Items'}
                  </button>

                  {dispatchReady && (
                    <div style={{ marginTop: 12, background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', padding: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={16} color="var(--primary)" />
                      <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14 }}>Dispatch confirmed!</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { title: '📦 Crate Standard', text: 'Ventilated plastic crates (Type-3 HDPE), minimum 12% open area. Max: 25 kg/crate.' },
                    { title: '🌡️ Temperature', text: 'Post-harvest: 18–24°C. Cold chain transit: 8–12°C.' },
                    { title: '🏆 Compliance', text: 'Your score: 98/100. >95 = premium buyer placement.' },
                  ].map(c => (
                    <div key={c.title} className="dash-info-card" style={{ padding: 18 }}>
                      <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{c.title}</h4>
                      <p style={{ color: 'var(--text-body)', fontSize: 14, lineHeight: 1.6 }}>{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MARKET */}
          {activeTab === 'my-listings' && (
            <div className="animate-fade-in">
              <div className="dash-header" style={{ marginBottom: 28 }}>
                <div>
                  <h1 className="dash-page-title">My Listings</h1>
                  <p className="dash-page-date">Manage your active marketplace listings</p>
                </div>
                <button className="btn btn-primary"><Sprout size={16} /> Add Listing</button>
              </div>

              <div className="orders-card">
                <table className="orders-table">
                  <thead><tr><th>Crop</th><th>Quantity</th><th>Price</th><th>Status</th><th>Harvest Date</th><th></th></tr></thead>
                  <tbody>
                    {[
                      { name: '🧅 Big Onion', qty: '2,500 kg', price: '₨ 210/kg', status: 'Awaiting Order', statusClass: 'status-awaiting', harvest: 'Jul 10, 2026' },
                      { name: '🫑 Capsicum', qty: '600 kg', price: '₨ 320/kg', status: 'Harvest Triggered', statusClass: 'status-confirmed', harvest: 'Jul 8, 2026' },
                      { name: '🥕 Carrot', qty: '1,200 kg', price: '₨ 145/kg', status: 'Awaiting Order', statusClass: 'status-awaiting', harvest: 'Jul 12, 2026' },
                    ].map(l => (
                      <tr key={l.name}>
                        <td className="fw-600">{l.name}</td>
                        <td>{l.qty}</td>
                        <td className="fw-600 text-primary">{l.price}</td>
                        <td><span className={`status-badge ${l.statusClass}`}>{l.status}</span></td>
                        <td>{l.harvest}</td>
                        <td><button className="btn btn-ghost btn-sm">Edit</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeTab === 'settings' && (
            <div className="animate-fade-in">
              <h1 className="dash-page-title">Settings</h1>
              <p className="dash-page-date">Account preferences and configuration</p>

              <div className="dash-info-card" style={{ padding: 28, marginTop: 28, maxWidth: 600 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Profile</h3>
                {[
                  ['Full Name', 'Suresh Perera'],
                  ['Email', 'suresh.perera@agrohub.lk'],
                  ['Region', 'Dambulla, Matale District'],
                  ['Farm Size', '2.4 hectares'],
                  ['JIT Status', 'Active — Verified'],
                ].map(([k, v]) => (
                  <div key={k} className="dash-settings-row">
                    <span className="dash-settings-key">{k}</span>
                    <span className="dash-settings-value">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
