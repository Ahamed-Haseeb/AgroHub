import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const filterGroups = [
  { key: 'origins', title: 'Origin District', options: ['Dambulla', 'Nuwara Eliya', 'Badulla'] },
  { key: 'grades', title: 'Grade', options: ['A+', 'A', 'B'] },
  { key: 'certifications', title: 'Certification', options: ['Organic', 'Conventional'] },
];

export default function FilterSidebar({ filters, onFilterChange, onPriceChange, priceRange }) {
  const [expanded, setExpanded] = useState({ origins: true, grades: true, certifications: true, price: true });
  const toggleGroup = key => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <aside className="filter-sidebar">
      {filterGroups.map(group => (
        <div className="filter-group" key={group.key}>
          <div className="filter-group-title" onClick={() => toggleGroup(group.key)}>
            <span>{group.title}</span>
            {expanded[group.key] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
          {expanded[group.key] && (
            <div>
              {group.options.map(option => {
                const checked = (filters[group.key] || []).includes(option);
                return (
                  <label className="filter-option" key={option}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onFilterChange(group.key, option)}
                    />
                    {option}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      ))}

      <div className="filter-group">
        <div className="filter-group-title" onClick={() => toggleGroup('price')}>
          <span>Price Range</span>
          {expanded.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
        {expanded.price && (
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Min ₨</label>
              <input
                type="number" className="input" placeholder="0"
                value={priceRange?.min || ''}
                onChange={e => onPriceChange('min', e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Max ₨</label>
              <input
                type="number" className="input" placeholder="999"
                value={priceRange?.max || ''}
                onChange={e => onPriceChange('max', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
