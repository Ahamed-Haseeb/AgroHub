import React from 'react';

export default function SettingsTab({ currentUser }) {
  return (
    <div className="animate-fade-in">
      <h1 className="dash-page-title">Settings</h1>
      <p className="dash-page-date">Account preferences and configuration</p>

      <div className="dash-info-card dash-settings-card">
        <h3 className="dash-settings-title">Profile</h3>
        {[
          ['Full Name', currentUser ? currentUser.name : 'Loading...'],
          ['Email', currentUser ? currentUser.email : 'Loading...'],
          ['Region', currentUser ? currentUser.district : 'Loading...'],
          ['Role', currentUser ? currentUser.role : 'Farmer'],
          ['JIT Status', 'Active — Verified'],
        ].map(([k, v]) => (
          <div key={k} className="dash-settings-row">
            <span className="dash-settings-key">{k}</span>
            <span className="dash-settings-value">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
