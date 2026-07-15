import { useState  } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Leaf, LayoutDashboard, BarChart2, Bell, Package,
  AlertTriangle, CheckCircle, LogOut, Sprout, Info,
  Settings, TrendingUp, ClipboardList, Menu,
  Zap, Thermometer, ShieldCheck
} from 'lucide-react';
import {
  fetchPrediction, fetchAdvisory, fetchAlerts,
  fetchAvailableCrops, fetchOrders, fetchMarketPrices
} from '../../api/client';

const getCropColor = (name) => {
  const palettes = [
    { bg: 'rgba(234, 88, 12, 0.1)', text: '#ea580c' },
    { bg: 'rgba(168, 85, 247, 0.1)', text: '#a855f7' },
    { bg: 'rgba(37, 99, 235, 0.1)', text: '#2563eb' },
    { bg: 'rgba(22, 163, 74, 0.1)', text: '#16a34a' },
    { bg: 'rgba(217, 119, 6, 0.1)', text: '#d97706' },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palettes[Math.abs(hash) % palettes.length];
};

const getInitials = (name) => {
  const parts = name.split(' ');
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

function MiniRadialProgress({ value, color = "var(--primary)" }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="48" height="48" style={{ transform: 'rotate(-90deg)' }}>
        <circle 
          cx="24" cy="24" r={radius} 
          stroke="var(--border-default)" strokeWidth="4" fill="none" 
        />
        <circle 
          cx="24" cy="24" r={radius} 
          stroke={color} strokeWidth="4" fill="none" 
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset} 
          strokeLinecap="round" 
        />
      </svg>
      <div style={{ position: 'absolute', fontSize: '11px', fontWeight: 800, color: 'var(--text-primary)' }}>
        {value}%
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="dash-tooltip">
      <p className="dash-tooltip-title">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} className="dash-tooltip-item" style={{ color: p.color }}>
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



export default function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCrop, setSelectedCrop] = useState('ONION_BIG_LK');
  const [checkedItems, setCheckedItems] = useState({});
  const [dispatchReady, setDispatchReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const { data: prediction } = useQuery({
    queryKey: ['prediction', selectedCrop],
    queryFn: () => fetchPrediction(selectedCrop),
  });

  const { data: cropPrices = [] } = useQuery({
    queryKey: ['marketPrices'],
    queryFn: fetchMarketPrices,
  });

  const { data: cropAdvisory = [] } = useQuery({
    queryKey: ['advisory'],
    queryFn: fetchAdvisory,
  });

  const { data: harvestAlerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
  });

  const { data: availableCrops = [] } = useQuery({
    queryKey: ['availableCrops'],
    queryFn: fetchAvailableCrops,
  });

  const { data: activeOrders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  const allChecked = packagingItems.filter(i => i.required).every(i => checkedItems[i.id]);
  const toggleCheck = id => setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  // Guard: don't render analytics if prediction hasn't loaded yet
  const garchRisk = prediction?.garch_metrics?.risk_score ?? 0;
  const riskColor = garchRisk >= 70 ? 'var(--red)' : garchRisk >= 45 ? 'var(--amber)' : 'var(--primary)';
  const riskLabel = garchRisk >= 70 ? 'High Risk' : garchRisk >= 45 ? 'Moderate Risk' : 'Low Risk';

  return (
    <>

      <div className="dash-mobile-header">
        <span><Leaf size={18} /> AgroHub</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="dash-mobile-menu-btn">
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
                      <div className={`crop-price-change ${crop.direction}`}>
                        {crop.change}, {crop.label}
                      </div>
                      <div className="crop-price-updated">{crop.updated}</div>
                    </div>
                  ))}
                </div>

                <div className="dash-chart-card">
                  <div className="dash-chart-title">Crop Price Forecast (Next 6 Months)</div>
                  <ResponsiveContainer width="100%" height={320}>
                    {prediction ? (
                    <LineChart data={prediction.forecast.slice(0, 12)} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="week_label" tick={{ fill: 'var(--text-muted)', fontSize: 13 }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 13 }} axisLine={false} tickLine={false} tickFormatter={v => `₨${v}`} />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 13, paddingTop: 8 }} iconType="plainline" />
                      <Line type="monotone" dataKey="price" name="Forecast Price" stroke="var(--primary)" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
                    </LineChart>
                    ) : (
                      <div style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Loading forecast chart...</div>
                    )}
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
                        <tr key={order.order_number}>
                          <td className="fw-600">{order.order_number}</td>
                          <td>{order.crop}</td>
                          <td>{order.quantity}</td>
                          <td><span className={`status-badge ${order.status_class}`}>{order.status}</span></td>
                          <td className="fw-600">{order.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {activeTab === 'advisor' && (
            <div className="animate-fade-in">
              <h1 className="dash-page-title">Crop Advisor</h1>
              <p className="dash-page-date">Market recommendations based on national import gaps</p>

              <div className="dash-info-banner advisor-banner">
                <TrendingUp size={22} color="var(--primary)" />
                <div>
                  <div className="advisor-banner-title">Market Analysis — July 2026</div>
                  <p className="advisor-banner-text">
                    Based on CMC wholesale data and SARIMA models for Q3 2026, these crops show the highest ROI for Dambulla.
                  </p>
                </div>
              </div>

              <div className="advisor-card-list">
                {cropAdvisory.map(item => {
                  const color = getCropColor(item.crop);
                  return (
                  <div key={item.advisory_id} className="dash-info-card advisor-card">
                    <div className="advisor-card-icon" style={{ background: 'transparent' }}>
                      <MiniRadialProgress 
                        value={parseInt(item.roi_estimate.replace(/[^0-9]/g, '')) || 0} 
                        color={color.text} 
                      />
                    </div>
                    <div className="advisor-card-content">
                      <div className="advisor-card-header">
                        <h3 className="advisor-card-title">{item.crop}</h3>
                        <span className={`badge ${item.urgency === 'high' ? 'badge-green' : item.urgency === 'medium' ? 'badge-amber' : 'badge-muted'}`}>
                          {item.urgency === 'high' ? 'Top Pick' : item.urgency === 'medium' ? 'Recommended' : 'Stable'}
                        </span>
                      </div>
                      <p className="advisor-card-desc">{item.reason}</p>
                      <div className="advisor-card-metrics">
                        {[['ROI', item.roi_estimate, 'var(--primary)'], ['Risk', item.risk, item.risk === 'Low' ? 'var(--primary)' : 'var(--amber)'], ['Season', item.season, 'var(--text-body)']].map(([k, v, c]) => (
                          <div key={k}>
                            <div className="dash-detail-label">{k}</div>
                            <div className="advisor-card-metric-val" style={{ color: c }}>{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button className="btn btn-outline btn-sm">Select</button>
                  </div>
                  );
                })}
              </div>
            </div>
          )}


          {activeTab === 'forecast' && (
            <div className="animate-fade-in">
              {!prediction ? (
                <div style={{ padding: 'var(--sp-10)', textAlign: 'center', color: 'var(--text-muted)' }}>Loading analytics...</div>
              ) : (
              <>
              <div className="dash-header dash-header-spaced">
                <div>
                  <h1 className="dash-page-title">Analytics</h1>
                  <p className="dash-page-date">SARIMA + GARCH model outputs · Weekly LKR/kg</p>
                </div>
                <select className="input select dash-crop-select" value={selectedCrop} onChange={e => setSelectedCrop(e.target.value)}>
                  {availableCrops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="dash-metric-grid dash-metric-grid-spaced">
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

              <div className="dash-chart-card dash-chart-card-spaced">
                <div className="dash-chart-title">52-Week SARIMA Forecast — {prediction.crop_name}</div>
                <div className="dash-chart-meta">
                  <span className="dash-chart-model">{prediction.model} · 95% CI</span>
                  <span className="badge badge-amber"><Zap size={12} style={{ display: 'inline', marginRight: 4 }} /> Lean: Weeks 21–29, 49–52</span>
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
                <div className="dash-info-banner dash-info-banner-mt">
                  <Info size={14} color="var(--primary)" className="dash-info-icon" />
                  <p className="dash-info-text">
                    <strong>Market Recommendation: </strong>{prediction.garch_metrics.recommendation}
                  </p>
                </div>
              </div>
              </>
              )}
            </div>
          )}


          {activeTab === 'alerts' && (
            <div className="animate-fade-in">
              <h1 className="dash-page-title">Orders</h1>
              <p className="dash-page-date">JIT harvest alerts and active order management</p>

              <div className="dash-policy-banner">
                <AlertTriangle size={18} color="var(--amber)" />
                <p className="dash-policy-text"><strong>Policy:</strong> Harvest is triggered only after buyer payment is validated.</p>
              </div>

              {harvestAlerts.map(alert => (
                <div key={alert.alert_id} className="dash-alert-card">
                  <div className="dash-alert-layout">
                    <div className="dash-alert-icon"><Bell size={24} color="var(--primary)" /></div>
                    <div className="advisor-card-content">
                      <div className="dash-alert-header">
                        <h3 className="dash-alert-title">{alert.crop} — {alert.alert_id}</h3>
                        <span className="status-badge status-processing">Harvest Window</span>
                      </div>
                      <div className="dash-detail-grid dash-detail-grid-spaced">
                        {[['Buyer', alert.buyer], ['Quantity', `${alert.quantity_kg.toLocaleString()} kg`], ['Value', `₨ ${alert.order_value_lkr.toLocaleString('en-LK')}`], ['Window', alert.harvest_window]].map(([k, v]) => (
                          <div key={k} className="dash-detail-item">
                            <div className="dash-detail-label">{k}</div>
                            <div className="dash-detail-value">{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="dash-alert-actions">
                    <button className="btn btn-outline btn-sm">Reschedule</button>
                    <button className="btn btn-primary"><CheckCircle size={16} style={{ display: 'inline', marginRight: 8 }} /> Confirm Harvest</button>
                  </div>
                </div>
              ))}

              <div className="orders-card orders-card-spaced">
                <div className="orders-title">All Orders</div>
                <table className="orders-table">
                  <thead><tr><th>Order ID</th><th>Crop</th><th>Quantity</th><th>Status</th><th>Price</th></tr></thead>
                  <tbody>
                    {activeOrders.map(order => (
                      <tr key={order.order_number}>
                        <td className="fw-600">{order.order_number}</td>
                        <td>{order.crop}</td>
                        <td>{order.quantity}</td>
                        <td><span className={`status-badge ${order.status_class}`}>{order.status}</span></td>
                        <td className="fw-600">{order.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {activeTab === 'packaging' && (
            <div className="animate-fade-in">
              <h1 className="dash-page-title">Inventory & Packaging</h1>
              <p className="dash-page-date">Pre-dispatch checklist and compliance</p>

              <div className="dash-inventory-layout">
                <div className="dash-info-card dash-info-card-large">
                  <h3 className="dash-checklist-title">Pre-Dispatch Checklist</h3>
                  <div className="dash-checklist">
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
                          className="dash-checklist-checkbox"
                        />
                        <span className={`dash-checklist-label ${checkedItems[item.id] ? 'done' : ''}`}>{item.label}</span>
                        {item.required && <span className="badge badge-red badge-small">Required</span>}
                        {checkedItems[item.id] && <CheckCircle size={16} color="var(--primary)" />}
                      </label>
                    ))}
                  </div>

                  <div className="dash-progress-section">
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
                    className={`btn ${allChecked ? 'btn-primary' : 'btn-outline'} btn-block btn-lg dash-checklist-submit`}
                    disabled={!allChecked}
                    onClick={() => setDispatchReady(true)}
                  >
                    {allChecked ? <><CheckCircle size={16} style={{ display: 'inline', marginRight: 8 }} /> Ready for Dispatch</> : 'Complete All Required Items'}
                  </button>

                  {dispatchReady && (
                    <div className="dash-dispatch-success">
                      <CheckCircle size={16} color="var(--primary)" />
                      <span className="dash-dispatch-success-text">Dispatch confirmed!</span>
                    </div>
                  )}
                </div>

                <div className="advisor-card-list">
                  {[
                    { icon: <Package size={16} style={{ display: 'inline', marginRight: 8, color: 'var(--text-muted)' }} />, title: 'Crate Standard', text: 'Ventilated plastic crates (Type-3 HDPE), minimum 12% open area. Max: 25 kg/crate.' },
                    { icon: <Thermometer size={16} style={{ display: 'inline', marginRight: 8, color: 'var(--text-muted)' }} />, title: 'Temperature', text: 'Post-harvest: 18–24°C. Cold chain transit: 8–12°C.' },
                    { icon: <ShieldCheck size={16} style={{ display: 'inline', marginRight: 8, color: 'var(--text-muted)' }} />, title: 'Compliance', text: 'Your score: 98/100. >95 = premium buyer placement.' },
                  ].map(c => (
                    <div key={c.title} className="dash-info-card dash-info-item">
                      <h4 className="dash-info-item-title" style={{ display: 'flex', alignItems: 'center' }}>{c.icon}{c.title}</h4>
                      <p className="advisor-banner-text">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}


          {activeTab === 'my-listings' && (
            <div className="animate-fade-in">
              <div className="dash-header dash-header-spaced">
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
                      { name: 'Big Onion', qty: '2,500 kg', price: '₨ 210/kg', status: 'Awaiting Order', statusClass: 'status-awaiting', harvest: 'Jul 10, 2026' },
                      { name: 'Capsicum', qty: '600 kg', price: '₨ 320/kg', status: 'Harvest Triggered', statusClass: 'status-confirmed', harvest: 'Jul 8, 2026' },
                      { name: 'Carrot', qty: '1,200 kg', price: '₨ 145/kg', status: 'Awaiting Order', statusClass: 'status-awaiting', harvest: 'Jul 12, 2026' },
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


          {activeTab === 'settings' && (
            <div className="animate-fade-in">
              <h1 className="dash-page-title">Settings</h1>
              <p className="dash-page-date">Account preferences and configuration</p>

              <div className="dash-info-card dash-settings-card">
                <h3 className="dash-settings-title">Profile</h3>
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
