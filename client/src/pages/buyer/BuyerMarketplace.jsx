import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  AreaChart, Area, XAxis, YAxis,
  Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Package, Clock, CheckCircle, Truck, MapPin,
  ShoppingCart, TrendingUp, LogOut, LayoutDashboard,
  ClipboardList, Settings, Leaf, Menu, ArrowRight,
  Eye, ChevronDown, ChevronUp, ShieldCheck
} from 'lucide-react';
import { fetchMyOrders, fetchTraceability, fetchPrediction } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const getInitials = (name) => {
  const parts = (name || '').split(' ');
  if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (name || '??').substring(0, 2).toUpperCase();
};

const STATUS_FLOW = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
const STATUS_ICONS = {
  Pending: Clock,
  Confirmed: CheckCircle,
  Processing: Package,
  Shipped: Truck,
  Delivered: CheckCircle,
  Cancelled: Clock,
};

function StatusStepper({ current }) {
  const idx = STATUS_FLOW.indexOf(current);
  return (
    <div className="buyer-dash-stepper">
      {STATUS_FLOW.map((step, i) => {
        const Icon = STATUS_ICONS[step];
        const done = i < idx;
        const active = i === idx;
        return (
          <div key={step} className={`stepper-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
            <div className={`stepper-dot ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
              {done ? <CheckCircle size={12} /> : <Icon size={12} />}
            </div>
            <span className="stepper-label">{step}</span>
            {i < STATUS_FLOW.length - 1 && <div className={`stepper-line ${done ? 'done' : ''}`} />}
          </div>
        );
      })}
    </div>
  );
}

function OrderDetailPanel({ order }) {
  const [showTrace, setShowTrace] = useState(false);

  const { data: traceSteps = [] } = useQuery({
    queryKey: ['traceability', order._id],
    queryFn: () => fetchTraceability(order._id),
    enabled: showTrace,
  });

  return (
    <div className="buyer-dash-order-detail animate-fade-in">
      <StatusStepper current={order.status} />

      <div className="buyer-dash-order-items">
        {order.items?.map((item, i) => (
          <div key={i} className="buyer-dash-order-item">
            <div className="buyer-dash-item-info">
              <div className="fw-600">{item.crop_name}</div>
              <div className="text-muted" style={{ fontSize: 12 }}>{item.farmer_name}</div>
            </div>
            <div className="buyer-dash-item-nums">
              <span>{item.quantity_kg} kg × ₨ {item.price_per_kg}</span>
              <span className="fw-600">₨ {item.subtotal?.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="buyer-dash-order-meta">
        <span>Payment: {order.payment?.method?.replace('_', ' ')}</span>
        <span>Delivery: {order.delivery?.district}</span>
        {order.delivery?.phone && <span>Phone: {order.delivery.phone}</span>}
      </div>

      <button
        className="btn btn-outline btn-sm"
        onClick={() => setShowTrace(!showTrace)}
        style={{ marginTop: 'var(--sp-3)' }}
      >
        <MapPin size={14} /> {showTrace ? 'Hide' : 'Show'} Traceability
      </button>

      {showTrace && traceSteps.length > 0 && (
        <div className="buyer-dash-trace animate-fade-in">
          {traceSteps.map((step, i) => {
            const isActive = !step.done && (i === 0 || traceSteps[i - 1].done);
            return (
              <div key={i} className="buyer-dash-trace-step">
                <div className={`timeline-dot ${step.done ? 'done' : isActive ? 'active' : ''}`}>
                  {step.done && <CheckCircle size={8} color="#fff" />}
                </div>
                <div style={{ opacity: step.done || isActive ? 1 : 0.4 }}>
                  <div className="fw-600" style={{ fontSize: 13 }}>{step.step}</div>
                  <div className="text-muted" style={{ fontSize: 11 }}>{step.date} · {step.location}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

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

const sidebarItems = [
  { id: 'orders', label: 'My Orders', icon: <ClipboardList size={18} /> },
  { id: 'tracking', label: 'Tracking', icon: <Truck size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

export default function BuyerDashboard() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: myOrders = [], isLoading } = useQuery({
    queryKey: ['myOrders'],
    queryFn: fetchMyOrders,
    enabled: !!user,
  });

  const { data: prediction } = useQuery({
    queryKey: ['prediction', 'ONION_BIG_LK'],
    queryFn: () => fetchPrediction('ONION_BIG_LK'),
  });

  const filteredOrders = statusFilter === 'all'
    ? myOrders
    : myOrders.filter(o => o.status === statusFilter);

  const totalSpent = myOrders.reduce((s, o) => s + (o.total_amount || 0), 0);
  const pendingCount = myOrders.filter(o => o.status === 'Pending' || o.status === 'Confirmed').length;
  const shippedCount = myOrders.filter(o => o.status === 'Shipped').length;
  const deliveredCount = myOrders.filter(o => o.status === 'Delivered').length;

  // orders in transit = not pending, not delivered, not cancelled
  const inTransitOrders = myOrders.filter(o =>
    ['Confirmed', 'Processing', 'Shipped'].includes(o.status)
  );

  return (
    <>
      <div className="dash-mobile-header">
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Leaf size={18} /> AgroHub
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="dash-mobile-menu-btn">
          <Menu size={20} />
        </button>
      </div>

      <div className="dashboard-layout">
        <aside className={`dashboard-sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className="sidebar-logo" style={{ textDecoration: 'none' }}>
            <Leaf size={20} color="var(--bg-white)" />
            AgroHub
          </Link>

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

          <Link to="/" className="sidebar-nav-item sidebar-shop-link">
            <ShoppingCart size={18} />
            Shop Now
            {cartCount > 0 && <span className="sidebar-cart-count">{cartCount}</span>}
          </Link>

          <div className="sidebar-user">
            <div className="sidebar-avatar">{user ? getInitials(user.name) : '??'}</div>
            <div>
              <div className="sidebar-user-name">{user?.name || 'Loading...'}</div>
              <div className="sidebar-user-role">{user?.role || 'Buyer'}</div>
            </div>
          </div>

          <button className="sidebar-logout" onClick={() => {
            logout();
            window.location.href = '/login';
          }}>
            <LogOut size={16} />
            Log out
          </button>
        </aside>

        <main className="dashboard-main">

          {/* -- Orders Tab -- */}
          {activeTab === 'orders' && (
            <div className="animate-fade-in">
              <div className="dash-header">
                <div>
                  <h1 className="dash-page-title">My Orders</h1>
                  <p className="dash-page-date">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                  <ShoppingCart size={16} /> Shop Now
                </button>
              </div>

              <div className="dash-metric-grid" style={{ marginBottom: 'var(--sp-6)' }}>
                {[
                  { label: 'Total Spent', value: `₨ ${totalSpent.toLocaleString('en-LK', { minimumFractionDigits: 2 })}` },
                  { label: 'Total Orders', value: myOrders.length },
                  { label: 'In Transit', value: pendingCount + shippedCount },
                  { label: 'Delivered', value: deliveredCount },
                ].map(m => (
                  <div key={m.label} className="dash-metric-card">
                    <div className="dash-metric-label">{m.label}</div>
                    <div className="dash-metric-value">{m.value}</div>
                  </div>
                ))}
              </div>

              <div className="buyer-dash-filter-row">
                {['all', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map(s => (
                  <button
                    key={s}
                    className={`chip ${statusFilter === s ? 'active' : ''}`}
                    onClick={() => setStatusFilter(s)}
                  >
                    {s === 'all' ? 'All Orders' : s}
                    {s !== 'all' && (
                      <span className="chip-count">
                        {myOrders.filter(o => o.status === s).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {isLoading ? (
                <div style={{ padding: 'var(--sp-10)', textAlign: 'center', color: 'var(--text-muted)' }}>Loading orders...</div>
              ) : filteredOrders.length === 0 ? (
                <div className="buyer-dash-empty">
                  <Package size={48} strokeWidth={1} color="var(--border)" />
                  <p>No orders found.</p>
                  <Link to="/" className="btn btn-primary">Browse Products</Link>
                </div>
              ) : (
                <div className="buyer-dash-orders-list">
                  {filteredOrders.map(order => (
                    <div key={order._id} className="buyer-dash-order-card">
                      <div
                        className="buyer-dash-order-header"
                        onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                      >
                        <div>
                          <div className="buyer-dash-order-num">{order.order_number}</div>
                          <div className="buyer-dash-order-date">
                            <Clock size={12} />
                            {new Date(order.createdAt).toLocaleDateString('en-LK', {
                              year: 'numeric', month: 'short', day: 'numeric'
                            })}
                            <span className="buyer-dash-items-count">
                              · {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <div className="buyer-dash-order-right">
                          <span className={`status-badge status-${order.status?.toLowerCase()}`}>{order.status}</span>
                          <div className="buyer-dash-order-total">
                            ₨ {order.total_amount?.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                          </div>
                          {expandedOrder === order._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>

                      {expandedOrder === order._id && <OrderDetailPanel order={order} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* -- Tracking Tab -- */}
          {activeTab === 'tracking' && (
            <div className="animate-fade-in">
              <h1 className="dash-page-title">Order Tracking</h1>
              <p className="dash-page-date">Orders currently in transit</p>

              {inTransitOrders.length === 0 ? (
                <div className="buyer-dash-empty">
                  <Truck size={48} strokeWidth={1} color="var(--border)" />
                  <p>No orders in transit right now.</p>
                </div>
              ) : (
                <div className="buyer-dash-orders-list">
                  {inTransitOrders.map(order => (
                    <div key={order._id} className="buyer-dash-order-card">
                      <div className="buyer-dash-order-header" style={{ cursor: 'default' }}>
                        <div>
                          <div className="buyer-dash-order-num">{order.order_number}</div>
                          <div className="buyer-dash-order-date">
                            <Clock size={12} />
                            {new Date(order.createdAt).toLocaleDateString('en-LK', {
                              year: 'numeric', month: 'short', day: 'numeric'
                            })}
                          </div>
                        </div>
                        <div className="buyer-dash-order-right">
                          <span className={`status-badge status-${order.status?.toLowerCase()}`}>{order.status}</span>
                          <div className="buyer-dash-order-total">
                            ₨ {order.total_amount?.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                      <OrderDetailPanel order={order} />
                    </div>
                  ))}
                </div>
              )}

              <div className="buyer-dash-sidebar-cards">
                <div className="chart-container">
                  <div className="chart-title">
                    <TrendingUp size={14} className="chart-icon" />
                    Big Onion - Price Trend
                  </div>
                  <div className="chart-subtitle-small">SARIMA 12-week forecast</div>
                  <ResponsiveContainer width="100%" height={130}>
                    {prediction ? (
                      <AreaChart data={prediction.forecast.slice(0, 12)} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="buyerPriceGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="week_label" tick={{ fill: '#6b8f6b', fontSize: 9 }} axisLine={false} tickLine={false} interval={2} />
                        <YAxis tick={{ fill: '#6b8f6b', fontSize: 9 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<PriceTooltip />} />
                        <Area type="monotone" dataKey="price" name="₨/kg" stroke="#22c55e" strokeWidth={1.5} fill="url(#buyerPriceGrad)" />
                      </AreaChart>
                    ) : (
                      <div style={{ height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 12 }}>Loading...</div>
                    )}
                  </ResponsiveContainer>
                </div>

                <div className="card buyer-direct-card">
                  <h4 className="buyer-direct-title">
                    <ShieldCheck size={18} className="buyer-direct-icon" /> Why Buy Direct?
                  </h4>
                  {[
                    ['Fresh harvest guarantee', '24–72hr'],
                    ['Full traceability', 'Farm to door'],
                    ['Fair to farmers', '+42% gain'],
                    ['Zero hidden fees', 'Direct pricing'],
                  ].map(([a, b]) => (
                    <div key={a} className="buyer-direct-row">
                      <span className="buyer-direct-label">
                        <CheckCircle size={11} color="var(--primary)" className="buyer-direct-check" />
                        {a}
                      </span>
                      <span className="buyer-direct-value">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* -- Settings Tab -- */}
          {activeTab === 'settings' && (
            <div className="animate-fade-in">
              <h1 className="dash-page-title">Settings</h1>
              <p className="dash-page-date">Account preferences</p>

              <div className="dash-info-card dash-settings-card">
                <h3 className="dash-settings-title">Profile</h3>
                {[
                  ['Full Name', user?.name || 'Loading...'],
                  ['Email', user?.email || 'Loading...'],
                  ['District', user?.district || 'Not set'],
                  ['Role', user?.role || 'Buyer'],
                  ['Phone', user?.phone || 'Not set'],
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
