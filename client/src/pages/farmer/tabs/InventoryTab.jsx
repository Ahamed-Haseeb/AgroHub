import React, { useState } from 'react';
import { CheckCircle, Package, Thermometer, ShieldCheck } from 'lucide-react';

const packagingItems = [
  { id: 'p1', label: 'Ventilated plastic crates confirmed', required: true },
  { id: 'p2', label: 'Produce sorted by grade (A/A+)', required: true },
  { id: 'p3', label: 'Weight verified against order qty', required: true },
  { id: 'p4', label: 'Harvest timestamp logged', required: true },
  { id: 'p5', label: 'Crate ID / batch label attached', required: true },
  { id: 'p6', label: 'Cold chain pickup notified', required: false },
];

export default function InventoryTab() {
  const [checkedItems, setCheckedItems] = useState({});
  const [dispatchReady, setDispatchReady] = useState(false);

  const allChecked = packagingItems.filter(i => i.required).every(i => checkedItems[i.id]);
  const toggleCheck = id => setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="animate-fade-in">
      <h1 className="dash-page-title">Inventory & Packaging</h1>
      <p className="dash-page-date">Pre-dispatch checklist and compliance</p>

      <div className="dash-inventory-layout">
        <div className="dash-info-card dash-info-card-large">
          <h3 className="dash-checklist-title">Pre-Dispatch Checklist</h3>
          <div className="dash-checklist">
            {packagingItems.map(item => (
              <label
                key={item.id}
                htmlFor={`check-${item.id}`}
                className={`dash-checklist-item ${checkedItems[item.id] ? 'checked' : ''}`}
              >
                <input
                  type="checkbox" id={`check-${item.id}`}
                  checked={!!checkedItems[item.id]}
                  onChange={() => toggleCheck(item.id)}
                  className="dash-checklist-checkbox"
                />
                <span className={`dash-checklist-label ${checkedItems[item.id] ? 'done' : ''}`}>{item.label}</span>
                {item.required && <span className="badge badge-red badge-small">Required</span>}
                {checkedItems[item.id] && <CheckCircle size={16} color="var(--primary)" />}
              </label>
            ))}
          </div>

          <div className="dash-progress-section">
            <div className="dash-progress-bar">
              <span>Progress</span>
              <span className="fw-700 text-heading">{checkedCount}/{packagingItems.length}</span>
            </div>
            <div className="gauge-bar">
              <div className={`gauge-fill ${allChecked ? 'gauge-green' : 'gauge-amber'}`}
                style={{ width: `${(checkedCount / packagingItems.length) * 100}%` }} />
            </div>
          </div>

          <button
            className={`btn ${allChecked ? 'btn-primary' : 'btn-outline'} btn-block btn-lg dash-checklist-submit`}
            disabled={!allChecked}
            onClick={() => setDispatchReady(true)}
          >
            {allChecked ? <><CheckCircle size={16} style={{ display: 'inline', marginRight: 8 }} /> Ready for Dispatch</> : 'Complete All Required Items'}
          </button>

          {dispatchReady && (
            <div className="dash-dispatch-success">
              <CheckCircle size={16} color="var(--primary)" />
              <span className="dash-dispatch-success-text">Dispatch confirmed!</span>
            </div>
          )}
        </div>

        <div className="advisor-card-list">
          {[
            { icon: <Package size={16} style={{ display: 'inline', marginRight: 8, color: 'var(--text-muted)' }} />, title: 'Crate Standard', text: 'Ventilated plastic crates (Type-3 HDPE), minimum 12% open area. Max: 25 kg/crate.' },
            { icon: <Thermometer size={16} style={{ display: 'inline', marginRight: 8, color: 'var(--text-muted)' }} />, title: 'Temperature', text: 'Post-harvest: 18–24°C. Cold chain transit: 8–12°C.' },
            { icon: <ShieldCheck size={16} style={{ display: 'inline', marginRight: 8, color: 'var(--text-muted)' }} />, title: 'Compliance', text: 'Your score: 98/100. >95 = premium buyer placement.' },
          ].map(c => (
            <div key={c.title} className="dash-info-card dash-info-item">
              <h4 className="dash-info-item-title" style={{ display: 'flex', alignItems: 'center' }}>{c.icon}{c.title}</h4>
              <p className="advisor-banner-text">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
