import React from 'react';
import { Sprout } from 'lucide-react';

export default function ListingsTab({ myListings }) {
  return (
    <div className="animate-fade-in">
      <div className="dash-header dash-header-spaced">
        <div>
          <h1 className="dash-page-title">My Listings</h1>
          <p className="dash-page-date">Manage your active marketplace listings</p>
        </div>
        <button className="btn btn-primary"><Sprout size={16} /> Add Listing</button>
      </div>

      <div className="orders-card">
        <table className="orders-table">
          <thead><tr><th>Crop</th><th>Quantity</th><th>Price</th><th>Status</th><th>Harvest Date</th><th></th></tr></thead>
          <tbody>
            {myListings.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>No active listings found.</td></tr>
            ) : (
              myListings.map(l => (
                <tr key={l.listing_id}>
                  <td className="fw-600">{l.crop_name}</td>
                  <td>{l.available_kg?.toLocaleString()} kg</td>
                  <td className="fw-600 text-primary">₨ {l.price_per_kg}/kg</td>
                  <td>
                    <span className={`status-badge ${l.jit_status === 'Harvest Triggered' ? 'status-confirmed' : 'status-awaiting'}`}>
                      {l.jit_status}
                    </span>
                  </td>
                  <td>{l.harvest_date}</td>
                  <td><button className="btn btn-ghost btn-sm">Edit</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
