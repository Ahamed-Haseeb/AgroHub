import ProductCard from './ProductCard';

export default function ProductGrid({ listings, onAddToCart, totalCount, sortBy, onSortChange }) {
  return (
    <div>
      <div className="product-sort-bar">
        <span>1-{listings.length} of {totalCount} results</span>
        <select
          className="input select product-sort-select"
          value={sortBy || 'featured'}
          onChange={e => onSortChange?.(e.target.value)}
        >
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="qty">Most Available</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      <div className="product-grid">
        {listings.map(listing => (
          <ProductCard key={listing.listing_id} listing={listing} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
}
