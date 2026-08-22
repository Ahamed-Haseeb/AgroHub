import React from 'react';
import { TrendingUp } from 'lucide-react';

function MiniRadialProgress({ value, color = "var(--primary)" }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="48" height="48" style={{ transform: 'rotate(-90deg)' }}>
        <circle 
          cx="24" cy="24" r={radius} 
          stroke="var(--border-default)" strokeWidth="4" fill="none" 
        />
        <circle 
          cx="24" cy="24" r={radius} 
          stroke={color} strokeWidth="4" fill="none" 
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset} 
          strokeLinecap="round" 
        />
      </svg>
      <div style={{ position: 'absolute', fontSize: '11px', fontWeight: 800, color: 'var(--text-primary)' }}>
        {value}%
      </div>
    </div>
  );
}

export default function AdvisorTab({ cropAdvisory, getCropColor }) {
  return (
    <div className="animate-fade-in">
      <h1 className="dash-page-title">Crop Advisor</h1>
      <p className="dash-page-date">Market recommendations based on national import gaps</p>

      <div className="dash-info-banner advisor-banner">
        <TrendingUp size={22} color="var(--primary)" />
        <div>
          <div className="advisor-banner-title">
            Market Analysis — {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
          <p className="advisor-banner-text">
            Based on CMC wholesale data and SARIMA models for Q3 2026, these crops show the highest ROI for Dambulla.
          </p>
        </div>
      </div>

      <div className="advisor-card-list">
        {cropAdvisory.map(item => {
          const color = getCropColor(item.crop);
          return (
          <div key={item.advisory_id} className="dash-info-card advisor-card">
            <div className="advisor-card-icon" style={{ background: 'transparent' }}>
              <MiniRadialProgress 
                value={parseInt(item.roi_estimate.replace(/[^0-9]/g, '')) || 0} 
                color={color.text} 
              />
            </div>
            <div className="advisor-card-content">
              <div className="advisor-card-header">
                <h3 className="advisor-card-title">{item.crop}</h3>
                <span className={`badge ${item.urgency === 'high' ? 'badge-green' : item.urgency === 'medium' ? 'badge-amber' : 'badge-muted'}`}>
                  {item.urgency === 'high' ? 'Top Pick' : item.urgency === 'medium' ? 'Recommended' : 'Stable'}
                </span>
              </div>
              <p className="advisor-card-desc">{item.reason}</p>
              <div className="advisor-card-metrics">
                {[['ROI', item.roi_estimate, 'var(--primary)'], ['Risk', item.risk, item.risk === 'Low' ? 'var(--primary)' : 'var(--amber)'], ['Season', item.season, 'var(--text-body)']].map(([k, v, c]) => (
                  <div key={k}>
                    <div className="dash-detail-label">{k}</div>
                    <div className="advisor-card-metric-val" style={{ color: c }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <button className="btn btn-outline btn-sm">Select</button>
          </div>
          );
        })}
      </div>
    </div>
  );
}
