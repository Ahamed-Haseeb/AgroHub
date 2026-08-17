import { Leaf } from 'lucide-react';
import { FaXTwitter, FaLinkedinIn, FaGithub, FaEnvelope } from 'react-icons/fa6';

const socialLinks = [
  { Icon: FaXTwitter, href: '#', label: 'Twitter' },
  { Icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
  { Icon: FaGithub, href: '#', label: 'GitHub' },
  { Icon: FaEnvelope, href: '#', label: 'Email' },
];

const navLinks = [
  { label: 'Marketplace', href: '#' },
  { label: 'About', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Contact', href: '#' },
];

const legalLinks = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Cookies', href: '#' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-brand-logo">
              <Leaf size={18} color="var(--primary)" />
              <span>AgroHub</span>
            </div>
            <p className="footer-brand-desc">
              Farm-to-buyer commerce with real-time pricing and traceable supply chains.
            </p>
          </div>

          <nav className="footer-nav" aria-label="Footer navigation">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} className="footer-link">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="footer-socials">
            {socialLinks.map(({ Icon, href, label }) => (
              <a key={label} href={href} className="footer-social-icon" aria-label={label}>
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <p>© 2026 AgroHub (Pvt) Ltd.</p>
          <div className="footer-legal">
            {legalLinks.map((link, i) => (
              <span key={link.label}>
                <a href={link.href} className="footer-legal-link">{link.label}</a>
                {i < legalLinks.length - 1 && <span className="footer-legal-sep">·</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
