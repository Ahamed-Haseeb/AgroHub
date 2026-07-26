import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cart, removeItem, updateQty, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please sign in to checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <ShoppingCart size={64} strokeWidth={1} color="var(--text-muted)" />
            <h2 className="cart-empty-title">Your cart is empty</h2>
            <p className="cart-empty-text">Browse our fresh produce and add items to get started.</p>
            <Link to="/" className="btn btn-primary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
          <span className="cart-count-label">{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="cart-layout">
          <div className="cart-items-section">
            {cart.map(item => (
              <div key={item.listing_id} className="cart-item">
                <div className="cart-item-image">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.crop_name} />
                  ) : (
                    <div className="cart-item-placeholder">{item.crop_name[0]}</div>
                  )}
                </div>

                <div className="cart-item-info">
                  <Link to={`/product/${item.listing_id}`} className="cart-item-name">
                    {item.crop_name}
                  </Link>
                  <div className="cart-item-meta">
                    {item.farmer_name} · {item.origin}
                    {item.organic && <span className="badge badge-primary" style={{ marginLeft: 8, fontSize: 11 }}>Organic</span>}
                  </div>
                  <div className="cart-item-price-per">₨{item.price_per_kg.toFixed(2)}/kg</div>
                </div>

                <div className="cart-item-qty">
                  <button
                    className="cart-qty-btn"
                    onClick={() => updateQty(item.listing_id, Math.max(0.1, item.quantity_kg - (item.quantity_kg >= 10 ? 5 : item.quantity_kg >= 1 ? 0.5 : 0.1)))}
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="number"
                    className="cart-qty-input"
                    value={item.quantity_kg}
                    min={0.1}
                    max={Math.min(1000, item.available_kg)}
                    step={0.1}
                    onChange={e => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) updateQty(item.listing_id, val);
                    }}
                  />
                  <span className="cart-qty-unit">kg</span>
                  <button
                    className="cart-qty-btn"
                    onClick={() => updateQty(item.listing_id, Math.min(Math.min(1000, item.available_kg), item.quantity_kg + (item.quantity_kg >= 10 ? 5 : item.quantity_kg >= 1 ? 0.5 : 0.1)))}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="cart-item-subtotal">
                  ₨{(item.price_per_kg * item.quantity_kg).toFixed(2)}
                </div>

                <button
                  className="cart-item-remove"
                  onClick={() => removeItem(item.listing_id)}
                  aria-label="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
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
            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <span>₨{cartTotal.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary cart-checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout <ArrowRight size={16} />
            </button>
            <Link to="/" className="cart-continue-link">
              <ArrowLeft size={14} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
