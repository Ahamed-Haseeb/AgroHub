import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Package, ArrowRight, Loader2, ShoppingCart } from 'lucide-react';
import { fetchOrderById } from '../api/client';

export default function OrderConfirmation() {
  const { id } = useParams();
  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrderById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="order-confirm-page">
        <div className="container">
          <div className="order-confirm-loading">
            <Loader2 size={32} className="animate-spin" color="var(--primary)" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="order-confirm-page">
        <div className="container">
          <div className="order-confirm-card">
            <h2>Order not found</h2>
            <Link to="/" className="btn btn-primary">Go Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const statusColor = {
    pending: 'var(--amber)',
    paid: 'var(--primary)',
    failed: 'var(--red)',
  };

  return (
    <div className="order-confirm-page">
      <div className="container">
        <div className="order-confirm-card">
          <div className="order-confirm-icon">
            <CheckCircle size={56} color="var(--primary)" strokeWidth={1.5} />
          </div>

          <h1 className="order-confirm-title">Order Placed!</h1>
          <p className="order-confirm-subtitle">
            Your order has been received and is being processed.
          </p>

          <div className="order-confirm-number">
            <Package size={16} />
            <span>Order #{order.order_number}</span>
          </div>

          <div className="order-confirm-details">
            <h3 className="order-confirm-section-title">Items Ordered</h3>
            {order.items.map((item, i) => (
              <div key={i} className="order-confirm-item">
                <span>{item.crop_name} × {item.quantity_kg}kg</span>
                <span>₨{item.subtotal.toFixed(2)}</span>
              </div>
            ))}
            <div className="cart-summary-divider" />
            <div className="order-confirm-item order-confirm-total">
              <span>Total</span>
              <span>₨{order.total_amount.toFixed(2)}</span>
            </div>
          </div>

          <div className="order-confirm-meta">
            <div className="order-confirm-meta-row">
              <span>Payment</span>
              <span>{order.payment.method === 'cod' ? 'Cash on Delivery' : order.payment.method === 'bank_transfer' ? 'Bank Transfer' : 'Card Payment'}</span>
            </div>
            <div className="order-confirm-meta-row">
              <span>Payment Status</span>
              <span style={{ color: statusColor[order.payment.status], fontWeight: 600, textTransform: 'capitalize' }}>
                {order.payment.status}
              </span>
            </div>
            <div className="order-confirm-meta-row">
              <span>Delivery</span>
              <span>{order.delivery.district}</span>
            </div>
            <div className="order-confirm-meta-row">
              <span>Status</span>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{order.status}</span>
            </div>
          </div>

          <div className="order-confirm-actions">
            <Link to="/" className="btn btn-primary">
              <ShoppingCart size={16} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
