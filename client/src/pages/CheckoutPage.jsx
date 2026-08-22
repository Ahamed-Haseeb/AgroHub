import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, Building2, Lock, Truck, ArrowLeft, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api/client';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when you receive your order' },
  { id: 'bank_transfer', label: 'Bank Transfer', icon: Building2, desc: 'Direct bank deposit' },
  { id: 'card', label: 'Card Payment', icon: CreditCard, desc: 'Visa, Mastercard accepted' },
];

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [delivery, setDelivery] = useState({
    district: user?.district || '',
    phone: user?.phone || '',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvv: '' });
  const [placing, setPlacing] = useState(false);

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async () => {
    if (!delivery.district.trim() || !delivery.phone.trim()) {
      toast.error('Please fill in delivery district and phone number');
      return;
    }

    if (paymentMethod === 'card' && (!cardInfo.number || !cardInfo.expiry || !cardInfo.cvv)) {
      toast.error('Please fill in all card details');
      return;
    }

    setPlacing(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          listing_id: item.listing_id,
          quantity_kg: item.quantity_kg,
        })),
        payment: { method: paymentMethod },
        delivery: {
          district: delivery.district,
          phone: delivery.phone,
          notes: delivery.notes,
        },
      };

      const result = await createOrder(orderData);
      toast.success('Order placed!');
      navigate(`/order-confirmation/${result._id}`);
      setTimeout(() => clearCart(), 100);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <button className="checkout-back" onClick={() => navigate('/cart')}>
          <ArrowLeft size={16} /> Back to Cart
        </button>

        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-layout">
          <div className="checkout-form-section">

            <div className="checkout-section">
              <h2 className="checkout-section-title">
                <Truck size={18} /> Delivery Information
              </h2>
              <div className="checkout-field-grid">
                <div className="checkout-field">
                  <label className="checkout-label">District</label>
                  <input
                    type="text"
                    className="auth-input"
                    value={delivery.district}
                    onChange={e => setDelivery(p => ({ ...p, district: e.target.value }))}
                    placeholder="e.g. Dambulla"
                  />
                </div>
                <div className="checkout-field">
                  <label className="checkout-label">Phone Number</label>
                  <input
                    type="tel"
                    className="auth-input"
                    value={delivery.phone}
                    onChange={e => setDelivery(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+94 77 123 4567"
                  />
                </div>
              </div>
              <div className="checkout-field">
                <label className="checkout-label">Delivery Notes (optional)</label>
                <textarea
                  className="auth-input checkout-textarea"
                  value={delivery.notes}
                  onChange={e => setDelivery(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Special instructions for delivery..."
                  rows={3}
                />
              </div>
            </div>

            <div className="checkout-section">
              <h2 className="checkout-section-title">
                <CreditCard size={18} /> Payment Method
              </h2>
              <div className="checkout-payment-options">
                {PAYMENT_METHODS.map(pm => {
                  const Icon = pm.icon;
                  return (
                    <button
                      key={pm.id}
                      className={`checkout-payment-option ${paymentMethod === pm.id ? 'active' : ''}`}
                      onClick={() => setPaymentMethod(pm.id)}
                    >
                      <Icon size={20} />
                      <div>
                        <div className="checkout-payment-label">{pm.label}</div>
                        <div className="checkout-payment-desc">{pm.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {paymentMethod === 'card' && (
                <div className="checkout-card-form">
                  <div className="checkout-field">
                    <label className="checkout-label">Card Number</label>
                    <input
                      type="text"
                      className="auth-input"
                      maxLength={19}
                      value={cardInfo.number}
                      onChange={e => {
                        const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                        const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
                        setCardInfo(p => ({ ...p, number: formatted }));
                      }}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="checkout-field-grid">
                    <div className="checkout-field">
                      <label className="checkout-label">Expiry</label>
                      <input
                        type="text"
                        className="auth-input"
                        maxLength={5}
                        value={cardInfo.expiry}
                        onChange={e => {
                          let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                          if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
                          setCardInfo(p => ({ ...p, expiry: val }));
                        }}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="checkout-field">
                      <label className="checkout-label">CVV</label>
                      <input
                        type="password"
                        className="auth-input"
                        maxLength={3}
                        value={cardInfo.cvv}
                        onChange={e => setCardInfo(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                        placeholder="•••"
                      />
                    </div>
                  </div>
                  <div className="checkout-card-notice">
                    <Lock size={12} /> This is a demo — no real payment will be processed.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="checkout-summary">
            <h3 className="cart-summary-title">Order Summary</h3>
            <div className="cart-summary-rows">
              {cart.map(item => (
                <div key={item.listing_id} className="cart-summary-row">
                  <span>{item.crop_name} × {item.quantity_kg}kg</span>
                  <span>₨{(item.price_per_kg * item.quantity_kg).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="cart-summary-divider" />
            <div className="cart-summary-row">
              <span>Delivery</span>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Free</span>
            </div>
            <div className="cart-summary-divider" />
            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <span>₨{cartTotal.toFixed(2)}</span>
            </div>
            <button
              className="btn btn-primary cart-checkout-btn"
              onClick={handlePlaceOrder}
              disabled={placing}
            >
              {placing ? <><Loader2 size={16} className="animate-spin" /> Placing Order...</> : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
