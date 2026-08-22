import React from 'react';
import { AlertTriangle, Bell, CheckCircle } from 'lucide-react';

export default function OrdersTab({ harvestAlerts, activeOrders, updateOrderStatus, refetchOrders }) {
  return (
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
          <thead><tr><th>Order #</th><th>Items</th><th>Buyer</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
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
  );
}
