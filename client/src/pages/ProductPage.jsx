import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Star, Truck, ShoppingCart, Minus, Plus, Leaf, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { fetchCropById } from '../api/client';
import '../styles/components/Product/product.css';

export default function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const { data: crop, isLoading, error } = useQuery({
    queryKey: ['crop', id],
    queryFn: () => fetchCropById(id)
  });

  if (isLoading) return <div className="product-page">Loading...</div>;
  if (error || !crop) return <div className="product-page">Product not found</div>;

  const stockClass = crop.available_kg > 100 ? 'stock-high' : crop.available_kg > 10 ? 'stock-med' : 'stock-low';
  const stockText = crop.available_kg > 100 ? 'In Stock' : crop.available_kg > 10 ? 'Low Stock' : 'Only few left';

  const handleQtyChange = (newQty) => {
    const val = Math.max(0.1, Math.min(1000, crop.available_kg, newQty));
    setQty(Number(val.toFixed(2)));
  };

  const handleAddToCart = () => {
    addItem({ ...crop, quantity_kg: qty });
    toast.success('Added to cart');
  };

  return (
    <div className="product-page">
      <div className="product-breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight size={16} />
        <Link to={`/category/${crop.category?.toLowerCase() || 'all'}`}>{crop.category}</Link>
        <ChevronRight size={16} />
        <span>{crop.crop_name}</span>
      </div>

      <div className="product-hero">
        <div className="product-image-wrap">
          <div className="product-image-badges">
            {crop.organic && <span className="badge badge-green"><Leaf size={14} className="badge-icon-inline"/> Organic</span>}
            <span className="badge badge-primary">{crop.grade} Grade</span>
          </div>
          {crop.image_url ? (
            <img src={crop.image_url} alt={crop.crop_name} />
          ) : (
            <div style={{width:'100%', height:'100%', background:'linear-gradient(135deg, var(--primary-light), var(--bg-surface))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'80px'}}>
              🌾
            </div>
          )}
        </div>

        <div className="product-info">
          <h1 className="product-title">{crop.crop_name}</h1>
          
          <div className="product-rating">
            <span className="product-rating-stars" style={{display:'flex'}}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.round(crop.rating || 0) ? '#b8741a' : 'none'} color={i < Math.round(crop.rating || 0) ? '#b8741a' : 'var(--border)'} />
              ))}
            </span>
            <span>{crop.rating} ({crop.orders} orders)</span>
          </div>

          <div className="product-price-row">
            <div className="product-price">₨ {crop.price_per_kg}<span>/kg</span></div>
          </div>

          <div className={`product-stock ${stockClass}`}>
            <span className="stock-dot"></span>
            {stockText} ({crop.available_kg} kg available)
          </div>

          <div className="product-action-card">
            <div className="product-qty-group">
              <span className="product-qty-label">Quantity (kg)</span>
              <div className="product-qty">
                <button className="product-qty-btn" onClick={() => handleQtyChange(qty - 1)}><Minus size={18} /></button>
                <input 
                  type="number" 
                  className="product-qty-input" 
                  value={qty} 
                  onChange={(e) => handleQtyChange(parseFloat(e.target.value) || 0.1)}
                  step="0.1"
                  min="0.1"
                  max={Math.min(1000, crop.available_kg)}
                />
                <button className="product-qty-btn" onClick={() => handleQtyChange(qty + 1)}><Plus size={18} /></button>
              </div>
              <div className="product-qty-helper">Min 100g · Max 1 ton</div>
            </div>

            <div className="product-subtotal">
              <span>Subtotal</span>
              <span>₨ {(crop.price_per_kg * qty).toFixed(2)}</span>
            </div>

            <button className="product-add-btn" onClick={handleAddToCart}>
              <ShoppingCart size={20} />
              Add to Cart
            </button>

            <div className="product-delivery">
              <Truck size={16} />
              Estimated delivery in {crop.delivery_days} day{crop.delivery_days > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      <div className="product-details-grid">
        <div className="product-detail-card">
          <span className="detail-label">Origin</span>
          <span className="detail-value">{crop.origin}</span>
        </div>
        <div className="product-detail-card">
          <span className="detail-label">District</span>
          <span className="detail-value">{crop.district}</span>
        </div>
        <div className="product-detail-card">
          <span className="detail-label">Harvest Date</span>
          <span className="detail-value">{crop.harvest_date ? new Date(crop.harvest_date).toLocaleDateString() : 'N/A'}</span>
        </div>
        <div className="product-detail-card">
          <span className="detail-label">Packaging</span>
          <span className="detail-value">{crop.packaging}</span>
        </div>
        <div className="product-detail-card">
          <span className="detail-label">Category</span>
          <span className="detail-value">{crop.category}</span>
        </div>
        <div className="product-detail-card">
          <span className="detail-label">JIT Status</span>
          <span className="detail-value">{crop.jit_status ? 'Available' : 'N/A'}</span>
        </div>
      </div>

      <div className="product-farmer-card">
        <div className="farmer-avatar">
          {crop.farmer_name?.charAt(0) || 'F'}
        </div>
        <div className="farmer-info">
          <h3>{crop.farmer_name}</h3>
          <p><MapPin size={14} style={{display:'inline', verticalAlign:'text-bottom'}}/> {crop.district}</p>
        </div>
      </div>
    </div>
  );
}
