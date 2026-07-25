import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Leaf, TrendingUp, Truck, Shield,
  BarChart2, Zap, CheckCircle, Globe, Users,
  AlertTriangle, Sprout, ShoppingCart, Bell
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchStats } from '../api/client';

function useCountUp(target, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const numeric = parseFloat(target.replace(/[^0-9.]/g, ''));
    if (!numeric) return;
    let startTime = null;
    const animate = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * numeric));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [start, target, duration]);
  return value;
}


function StatCard({ stat, visible }) {
  const count = useCountUp(stat.value, 1800, visible);
  const prefix = stat.value.startsWith('₨') ? '₨ ' : '';
  const suffix = stat.value.includes('%') ? '%' : stat.value.includes('M') ? 'M' : stat.value.includes(',') ? '' : '';
  const displayVal = prefix + (isNaN(parseFloat(stat.value.replace(/[^0-9.]/g, ''))) ? stat.value : (count.toLocaleString('en-LK') + suffix));
  const label2 = stat.unit;

  return (
    <div className={`stat-card stat-card-animated ${visible ? '' : 'hidden'}`}>

      <div className="stat-value">
        {prefix}{isNaN(parseFloat(stat.value.replace(/[^0-9.]/g, ''))) ? stat.value : count.toLocaleString('en-LK') + suffix}
        {label2 && <span className="stat-card-unit">{label2}</span>}
      </div>
      <div className="stat-label">{stat.label}</div>
    </div>
  );
}


const features = [
  {
    icon: <BarChart2 size={28} color="#22c55e" />,
    title: 'AI Predictive Market Hub',
    desc: 'Price forecasts using SARIMA and GARCH models predict lean-season spikes weeks ahead, so farmers know when to hold and when to sell.',
    color: 'var(--agro-green)',
    badge: 'ML-Powered',
  },
  {
    icon: <Zap size={28} color="#f59e0b" />,
    title: 'JIT Harvest Intelligence',
    desc: 'Nothing gets harvested without a confirmed buyer. The system sends harvest alerts only after the buyer\'s advance payment clears.',
    color: 'var(--agro-amber)',
    badge: 'Real-Time',
  },
  {
    icon: <Globe size={28} color="#60a5fa" />,
    title: 'D2C Marketplace',
    desc: 'Consumers and exporters buy directly from verified farmers. Every order is tracked from field to doorstep, no middlemen involved.',
    color: 'var(--agro-blue)',
    badge: 'Direct Access',
  },
];

const howItWorks = [
  { step: '01', title: 'Plant Smart',     desc: 'AI analyzes national import gaps and recommends the highest-yield, highest-price crops for your region.', icon: <Sprout size={32} strokeWidth={1.5} /> },
  { step: '02', title: 'Buyer Orders',    desc: 'Urban consumer or exporter places an advance order and payment is confirmed on AgroHub marketplace.',     icon: <ShoppingCart size={32} strokeWidth={1.5} /> },
  { step: '03', title: 'Harvest Alert',   desc: 'JIT engine matches order to your farm and sends a push notification: "Harvest Window: July 10–11."',       icon: <Bell size={32} strokeWidth={1.5} /> },
  { step: '04', title: 'Deliver Fresh',   desc: 'Produce in ventilated crates reaches the buyer within 24–72 hours. Zero intermediaries. Maximum price.',    icon: <Truck size={32} strokeWidth={1.5} /> },
];

export default function LandingPage() {
  const { data: platformStats = [] } = useQuery({ queryKey: ['stats'], queryFn: fetchStats });
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.2 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-enter">

      <section className="hero" id="hero">
        <div className="hero-bg-grain" />
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        <div className="container hero-content">
          <div className="hero-content-inner">
            <div className="hero-eyebrow">
              Sri Lanka's Direct Farm-to-Consumer Platform
            </div>


            <h1 className="hero-title">
              From Farm to{' '}
              <span className="gradient-text">You</span>,<br />
              Without the{' '}
              <span className="hero-underline-wrap">
                Middleman
                <svg
                  className="hero-underline-svg"
                  viewBox="0 0 300 6" preserveAspectRatio="none"
                >
                  <path d="M0,3 Q75,0 150,3 Q225,6 300,3" stroke="#16a34a" strokeWidth="2.5" fill="none" opacity="0.7" />
                </svg>
              </span>
            </h1>

            <p className="hero-subtitle">
              Sri Lanka loses <strong className="text-highlight-amber">30-40% of produce</strong> to
              post-harvest waste and middlemen. AgroHub cuts both out with price forecasting,
              just-in-time harvesting, and direct buyer-farmer orders.
            </p>


            <div className="hero-cta-group">
              <Link to="/farmer" className="btn btn-primary btn-xl" id="hero-farmer-cta">
                I'm a Farmer
                <ArrowRight size={20} />
              </Link>
              <Link to="/buyer" className="btn btn-outline btn-xl" id="hero-buyer-cta">
                Browse Marketplace
              </Link>
            </div>


            <div className="hero-trust-row">
              {[
                { icon: <CheckCircle size={15} />, text: '2,847 Farmers Onboarded' },
                { icon: <Shield size={15} />,       text: 'Advance Payment Protected' },
                { icon: <Truck size={15} />,        text: '24–72hr JIT Delivery' },
              ].map(({ icon, text }) => (
                <div key={text} className="hero-trust-item">
                  <span className="hero-trust-icon">{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>


          <div className="hero-ghost-div" />
        </div>


        <div className="hero-scroll-indicator">
          <span>Scroll to explore</span>
          <div className="hero-scroll-line" />
        </div>
      </section>


      <section className="section-sm section-stats-wrapper" id="stats" ref={statsRef}>
        <div className="container">
          <div className="landing-stats-grid">
            {platformStats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} visible={statsVisible} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="features">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Core Platform</span>
            <h2 className="section-title">
              Predict. Harvest.{' '}
              <span className="gradient-text">Deliver.</span>
            </h2>
            <p className="section-desc section-desc-center">
              Three modules that work together: price forecasting tells farmers when to sell,
              JIT alerts tell them when to harvest, and the marketplace connects them directly to buyers.
            </p>
          </div>

          <div className="landing-features-grid">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="feature-card"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="feature-icon">
                  {f.icon}
                </div>
                <div className="feature-card-icon-wrap">
                  <span className="badge badge-green feature-card-badge">
                    {f.badge}
                  </span>
                </div>
                <h3 className="feature-card-title">{f.title}</h3>
                <p className="feature-card-desc">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">How It Works</span>
            <h2 className="section-title">
              From Order to Delivery in{' '}
              <span className="gradient-text">4 Steps</span>
            </h2>
          </div>

          <div className="landing-steps-grid">

            <div className="steps-connector" />

            {howItWorks.map((item, i) => (
              <div key={item.step} className="step-card" style={{ animationDelay: `${i * 0.12}s` }}>

                <div className="step-icon-wrap">
                  {item.icon}
                </div>
                <div className="step-number">{item.step}</div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-desc">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="problem-section">
        <div className="container text-center-wrapper">
          <div className="problem-alert-pill">
            <AlertTriangle size={18} color="var(--agro-amber-light)" />
            <span className="problem-alert-text">
              The Problem We're Solving
            </span>
          </div>
          <h2 className="problem-headline">
            Sri Lanka loses{' '}
            <span className="text-highlight-amber">LKR 18B+</span>{' '}
            annually
          </h2>
          <p className="problem-desc">
            to post-harvest waste and middlemen markups.
            AgroHub fixes that.
          </p>
          <div className="problem-cta-group">
            <Link to="/farmer" className="btn btn-primary btn-lg" id="mid-farmer-cta">
              Join as a Farmer <ArrowRight size={18} />
            </Link>
            <Link to="/buyer" className="btn btn-outline btn-lg" id="mid-buyer-cta">
              Shop Direct
            </Link>
          </div>
        </div>
      </section>


      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Get Started</span>
            <h2 className="section-title">Choose Your Role</h2>
          </div>
          <div className="landing-roles-grid">

            <Link to="/farmer" className="role-link" id="role-farmer-card">
              <div className="card role-card-farmer">
                <div className="role-icon-farmer">
                  <Sprout size={64} strokeWidth={1.5} />
                </div>
                <h3 className="role-title">
                  I'm a Farmer
                </h3>
                <p className="role-desc">
                  Get crop recommendations, price forecasts, harvest alerts, and sell directly to buyers with no middlemen.
                </p>
                <div className="btn btn-primary role-btn">
                  Open Farmer Dashboard <ArrowRight size={16} />
                </div>
              </div>
            </Link>


            <Link to="/buyer" className="role-link" id="role-buyer-card">
              <div className="card role-card-buyer">
                <div className="role-icon-buyer">
                  <ShoppingCart size={64} strokeWidth={1.5} />
                </div>
                <h3 className="role-title">
                  I'm a Buyer
                </h3>
                <p className="role-desc">
                  Browse fresh produce with full traceability. Place advance orders, track delivery, and get the best direct-farm prices.
                </p>
                <div className="btn btn-outline role-btn">
                  Browse Marketplace <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
