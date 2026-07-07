import React from 'react';
import { Star, Truck } from 'lucide-react';

export default function ProductCard({ listing, onAddToCart }) {
  const filledStars = Math.round(listing.rating);

  return (
    <div className="product-card">
      <div className="product-card-image">
        <img src={listing.image} alt={listing.crop_name} />
      </div>

      <div className="product-card-body">
        <div className="product-card-badges">
          {listing.organic && <span className="badge badge-green">🌿 Organic</span>}
          <span className="badge badge-muted">{listing.grade}</span>
        </div>

        <div className="product-card-name">{listing.crop_name}</div>
        <div className="product-card-farmer">By {listing.farmer_name} • {listing.origin}</div>

        <div className="product-card-rating">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} fill={i < filledStars ? '#d4a24e' : 'none'} color={i < filledStars ? '#d4a24e' : 'var(--border)'} />
            ))}
          </span>
          <span>({listing.orders} orders)</span>
        </div>

        <div className="product-card-price">
          ₨ {listing.price_per_kg}<span className="unit">/kg</span>
        </div>

        <div className="product-card-avail">{listing.available_kg.toLocaleString()} kg available</div>

        <div className="product-card-delivery">
          <Truck size={12} />
          Get it in {listing.delivery_days} day{listing.delivery_days > 1 ? 's' : ''}
        </div>
      </div>

      <div className="product-card-footer">
        <button className="btn btn-primary btn-block" onClick={() => onAddToCart?.(listing)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
