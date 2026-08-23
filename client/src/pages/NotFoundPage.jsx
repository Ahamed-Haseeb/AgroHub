import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'var(--space-10) 0' }}>
      <ShieldAlert size={64} color="var(--agro-green)" style={{ marginBottom: 'var(--space-6)' }} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 900, marginBottom: 'var(--space-3)' }}>
        404 - Page Not Found
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-lg)', maxWidth: '400px', marginBottom: 'var(--space-8)' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <ArrowLeft size={18} />
        Back to Home
      </Link>
    </div>
  );
}
