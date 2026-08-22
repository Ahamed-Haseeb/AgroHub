import React from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

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

export default function OverviewTab({ cropPrices, prediction, activeOrders, myListings, updateOrderStatus, refetchOrders }) {
  const pendingOrdersCount = activeOrders.filter(o => o.status === 'Pending').length;
  const activeOrdersCount = activeOrders.length;
  const totalRevenue = activeOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  
  const totalRating = myListings.reduce((sum, l) => sum + (l.rating || 0), 0);
  const avgRating = myListings.length ? (totalRating / myListings.length).toFixed(1) : 0;

  return (
    <div className="animate-fade-in">
      <div className="dash-header">
        <div>
          <h1 className="dash-page-title">Dashboard Overview</h1>
          <p className="dash-page-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <button className="dash-notify-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        </button>
      </div>

      <div className="dash-metric-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="dash-metric-card">
          <div className="dash-metric-label">Pending Orders</div>
          <div className="dash-metric-value">{pendingOrdersCount}</div>
        </div>
        <div className="dash-metric-card">
          <div className="dash-metric-label">Active Orders</div>
          <div className="dash-metric-value">{activeOrdersCount}</div>
        </div>
        <div className="dash-metric-card">
          <div className="dash-metric-label">Total Revenue</div>
          <div className="dash-metric-value">₨ {totalRevenue.toLocaleString('en-LK', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="dash-metric-card">
          <div className="dash-metric-label">Avg Rating</div>
          <div className="dash-metric-value">{avgRating}</div>
        </div>
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
              <tr><th>Order #</th><th>Items</th><th>Buyer</th><th>Total</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {activeOrders.map(order => (
                <tr key={order._id}>
                  <td className="fw-600">{order.order_number}</td>
                  <td>{order.items?.map(i => `${i.crop_name} (${i.quantity_kg}kg)`).join(', ')}</td>
                  <td>{order.buyer?.name || '—'}</td>
                  <td className="fw-600">₨{order.total_amount?.toFixed(2)}</td>
                  <td><span className={`status-badge status-${order.status?.toLowerCase()}`}>{order.status}</span></td>
                  <td>
                    {order.status === 'Pending' && (
                      <button className="btn btn-primary btn-sm" onClick={async () => { await updateOrderStatus(order._id, 'Confirmed'); refetchOrders(); }}>Confirm</button>
                    )}
                    {order.status === 'Confirmed' && (
                      <button className="btn btn-primary btn-sm" onClick={async () => { await updateOrderStatus(order._id, 'Processing'); refetchOrders(); }}>Process</button>
                    )}
                    {order.status === 'Processing' && (
                      <button className="btn btn-primary btn-sm" onClick={async () => { await updateOrderStatus(order._id, 'Shipped'); refetchOrders(); }}>Ship</button>
                    )}
                    {order.status === 'Shipped' && (
                      <button className="btn btn-primary btn-sm" onClick={async () => { await updateOrderStatus(order._id, 'Delivered'); refetchOrders(); }}>Delivered</button>
                    )}
                    {(order.status === 'Delivered' || order.status === 'Cancelled') && <span style={{color:'var(--text-muted)', fontSize: 13}}>Done</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
