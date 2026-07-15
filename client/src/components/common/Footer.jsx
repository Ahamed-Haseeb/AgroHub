import { Leaf } from 'lucide-react';
import { FaXTwitter, FaLinkedinIn, FaGithub, FaEnvelope } from 'react-icons/fa6';

const socialIcons = [FaXTwitter, FaLinkedinIn, FaGithub, FaEnvelope];
const platformLinks = ['Farmer Dashboard', 'Buyer Marketplace', 'JIT Logistics', 'AI Price Engine', 'Traceability'];
const companyLinks = ['About Us', 'Impact Report', 'Media Kit', 'Careers', 'Contact'];
const legalLinks = ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Data Policy'];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-logo">
              <Leaf size={20} color="var(--primary)" />
              <span>AgroHub</span>
            </div>
            <p className="footer-brand-desc">
              AgroHub connects farmers directly to buyers. We use price forecasts and local logistics to cut post-harvest waste from 40% to near zero.
            </p>
            <div className="footer-socials">
              {socialIcons.map((Icon, i) => (
                <a key={i} href="#" className="footer-social-icon">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="footer-col-title">Platform</p>
            {platformLinks.map(link => (
              <a key={link} href="#" className="footer-link">{link}</a>
            ))}
          </div>
          <div>
            <p className="footer-col-title">Company</p>
            {companyLinks.map(link => (
              <a key={link} href="#" className="footer-link">{link}</a>
            ))}
          </div>
          <div>
            <p className="footer-col-title">Legal</p>
            {legalLinks.map(link => (
              <a key={link} href="#" className="footer-link">{link}</a>
            ))}
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <p>© 2026 AgroHub (Pvt) Ltd. All rights reserved. 🇱🇰</p>
        </div>
      </div>
    </footer>
  );
}
