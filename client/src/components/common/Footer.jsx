import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { FaXTwitter, FaLinkedinIn, FaGithub, FaEnvelope } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-surface)',
      borderTop: '1px solid var(--border-subtle)',
      padding: 'var(--space-16) 0 var(--space-8)',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: 'var(--space-10)',
          marginBottom: 'var(--space-12)'
        }}>
          {/* Brand */}
          <div>
            <div className="nav-logo" style={{ marginBottom: 'var(--space-4)' }}>
              <Leaf size={20} color="#22c55e" style={{ display: 'inline', marginRight: 8 }} />
              AgroHub
            </div>
            <p style={{
              color: 'var(--text-muted)', fontSize: 'var(--text-sm)',
              lineHeight: 1.7, maxWidth: 280
            }}>
              Eliminating Sri Lanka's 30–40% post-harvest waste rate through
              AI-powered direct-to-consumer agriculture and JIT logistics.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
              {[FaXTwitter, FaLinkedinIn, FaGithub, FaEnvelope].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', transition: 'var(--transition-base)'
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--agro-green-light)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>Platform</p>
            {['Farmer Dashboard', 'Buyer Marketplace', 'JIT Logistics', 'AI Price Engine', 'Traceability'].map(link => (
              <a key={link} href="#" style={{ display: 'block', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', transition: 'var(--transition-fast)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--agro-green-light)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >{link}</a>
            ))}
          </div>

          {/* Company */}
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>Company</p>
            {['About Us', 'Impact Report', 'Media Kit', 'Careers', 'Contact'].map(link => (
              <a key={link} href="#" style={{ display: 'block', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', transition: 'var(--transition-fast)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--agro-green-light)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >{link}</a>
            ))}
          </div>

          {/* Legal */}
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}>Legal</p>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Data Policy'].map(link => (
              <a key={link} href="#" style={{ display: 'block', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', transition: 'var(--transition-fast)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--agro-green-light)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >{link}</a>
            ))}
          </div>
        </div>

        <hr className="divider" />
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: 'var(--space-6)',
          flexWrap: 'wrap', gap: 'var(--space-4)'
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
            © 2026 AgroHub (Pvt) Ltd. All rights reserved. Built for Sri Lanka 🇱🇰
          </p>
          <p style={{ color: 'var(--text-disabled)', fontSize: 'var(--text-xs)' }}>
            Powered by <span style={{ color: 'var(--agro-green-light)' }}>SK</span> · FastAPI · SARIMA · GARCH
          </p>
        </div>
      </div>
    </footer>
  );
}
