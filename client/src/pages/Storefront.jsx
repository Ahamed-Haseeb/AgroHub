import { useState, useMemo  } from 'react';
import { Truck, Shield, Recycle, TrendingUp } from 'lucide-react';
import HeroBanner from '../components/storefront/HeroBanner';
import FilterSidebar from '../components/storefront/FilterSidebar';
import ProductGrid from '../components/storefront/ProductGrid';
import { cropListings } from '../data/mockData';

const trustItems = [
  { icon: <Truck size={20} />, text: 'Farm-to-Door in 24–72 hrs' },
  { icon: <Shield size={20} />, text: 'Advance Payment Protected' },
  { icon: <Recycle size={20} />, text: '38% Waste Eliminated' },
  { icon: <TrendingUp size={20} />, text: 'Farmers Earn +42% More' },
];

export default function Storefront() {
  const [sortBy, setSortBy] = useState('featured');
    const [filters, setFilters] = useState({ origins: [], grades: [], certifications: [] });
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const filtered = useMemo(() => {
    let list = [...cropListings];

    if (filters.origins.length > 0) {
      list = list.filter(l => filters.origins.some(o => l.origin.toLowerCase().includes(o.toLowerCase())));
    }
    if (filters.grades.length > 0) {
      list = list.filter(l => filters.grades.includes(l.grade));
    }
    if (filters.certifications.length > 0) {
      list = list.filter(l => {
        if (filters.certifications.includes('Organic') && l.organic) return true;
        if (filters.certifications.includes('Conventional') && !l.organic) return true;
        return false;
      });
    }
    if (priceRange.min !== '') list = list.filter(l => l.price_per_kg >= Number(priceRange.min));
    if (priceRange.max !== '') list = list.filter(l => l.price_per_kg <= Number(priceRange.max));

    switch (sortBy) {
      case 'price-asc': list.sort((a, b) => a.price_per_kg - b.price_per_kg); break;
      case 'price-desc': list.sort((a, b) => b.price_per_kg - a.price_per_kg); break;
      case 'qty': list.sort((a, b) => b.available_kg - a.available_kg); break;
      case 'rating': list.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return list;
  }, [filters, priceRange, sortBy]);

  const handleAddToCart = listing => console.log("Added to cart", listing);

  const handleFilterChange = (type, value) => {
    setFilters(prev => {
      const current = prev[type] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [type]: updated };
    });
  };

  const handlePriceChange = (field, value) => {
    setPriceRange(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="storefront-page">
      <div className="container">
        <HeroBanner />
      </div>

      <div className="container">
        <div className="storefront-content">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onPriceChange={handlePriceChange}
            priceRange={priceRange}
          />
          <div className="storefront-main">
            <ProductGrid
              listings={filtered}
              totalCount={cropListings.length}
              onAddToCart={handleAddToCart}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>
      </div>

      <div className="container">
        <div className="trust-strip">
          {trustItems.map(item => (
            <div key={item.text} className="trust-item">
              <div className="trust-item-icon">{item.icon}</div>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
