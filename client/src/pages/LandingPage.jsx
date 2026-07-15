import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Leaf, TrendingUp, Truck, Shield,
  BarChart2, Zap, CheckCircle, Globe, Users
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
    <div className="stat-card" style={{ animation: visible ? 'fadeInUp 0.6s ease both' : 'none' }}>
      <div style={{ fontSize: 28, marginBottom: 'var(--space-2)' }}>{stat.icon}</div>
      <div className="stat-value">
        {prefix}{isNaN(parseFloat(stat.value.replace(/[^0-9.]/g, ''))) ? stat.value : count.toLocaleString('en-LK') + suffix}
        {label2 && <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-muted)', marginLeft: 4 }}>{label2}</span>}
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
  { step: '01', title: 'Plant Smart',     desc: 'AI analyzes national import gaps and recommends the highest-yield, highest-price crops for your region.', icon: '🌱' },
  { step: '02', title: 'Buyer Orders',    desc: 'Urban consumer or exporter places an advance order and payment is confirmed on AgroHub marketplace.',     icon: '🛒' },
  { step: '03', title: 'Harvest Alert',   desc: 'JIT engine matches order to your farm and sends a push notification: "Harvest Window: July 10–11."',       icon: '🔔' },
  { step: '04', title: 'Deliver Fresh',   desc: 'Produce in ventilated crates reaches the buyer within 24–72 hours. Zero intermediaries. Maximum price.',    icon: '🚚' },
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
          <div style={{ maxWidth: 740 }}>
            <div className="hero-eyebrow">
              <span style={{ fontSize: 18 }}>🇱🇰</span>
              Sri Lanka's Direct Farm-to-Consumer Platform
            </div>


            <h1 className="hero-title">
              From Farm to{' '}
              <span className="gradient-text">You</span>,<br />
              Without the{' '}
              <span style={{
                position: 'relative',
                display: 'inline-block'
              }}>
                Middleman
                <svg
                  style={{ position: 'absolute', bottom: -6, left: 0, width: '100%', height: 6 }}
                  viewBox="0 0 300 6" preserveAspectRatio="none"
                >
                  <path d="M0,3 Q75,0 150,3 Q225,6 300,3" stroke="#16a34a" strokeWidth="2.5" fill="none" opacity="0.7" />
                </svg>
              </span>
            </h1>

            <p className="hero-subtitle">
              Sri Lanka loses <strong style={{ color: 'var(--agro-amber-light)' }}>30-40% of produce</strong> to
              post-harvest waste and middlemen. AgroHub cuts both out with price forecasting,
              just-in-time harvesting, and direct buyer-farmer orders.
            </p>


            <div className="hero-cta" style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <Link to="/farmer" className="btn btn-primary btn-xl" id="hero-farmer-cta">
                I'm a Farmer
                <ArrowRight size={20} />
              </Link>
              <Link to="/buyer" className="btn btn-outline btn-xl" id="hero-buyer-cta">
                Browse Marketplace
              </Link>
            </div>


            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-6)',
              marginTop: 'var(--space-10)', flexWrap: 'wrap'
            }}>
              {[
                { icon: <CheckCircle size={15} />, text: '2,847 Farmers Onboarded' },
                { icon: <Shield size={15} />,       text: 'Advance Payment Protected' },
                { icon: <Truck size={15} />,        text: '24–72hr JIT Delivery' },
              ].map(({ icon, text }) => (
                <div key={text} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  color: 'var(--text-muted)', fontSize: 'var(--text-sm)'
                }}>
                  <span style={{ color: 'var(--agro-green-light)' }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>


          <div style={{
            position: 'absolute', right: '5%', top: '50%',
            transform: 'translateY(-50%)',
            width: 340,
            display: 'none' // shown via media query simulation
          }} />
        </div>


        <div style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 8, color: 'var(--text-disabled)', fontSize: 'var(--text-xs)'
        }}>
          <span>Scroll to explore</span>
          <div style={{
            width: 1, height: 40,
            background: 'linear-gradient(to bottom, var(--border-default), transparent)'
          }} />
        </div>
      </section>


      <section className="section-sm" id="stats" ref={statsRef}
        style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)' }}>
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
            <p className="section-desc" style={{ margin: '0 auto' }}>
              Three modules that work together: price forecasting tells farmers when to sell,
              JIT alerts tell them when to harvest, and the marketplace connects them directly to buyers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)' }}>
            {features.map((f, i) => (
              <div
                key={f.title}
                className="feature-card"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="feature-icon">
                  {f.icon}
                </div>
                <div style={{ marginBottom: 'var(--space-2)' }}>
                  <span className={`badge badge-green`} style={{ marginBottom: 'var(--space-3)' }}>
                    {f.badge}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-xl)', fontWeight: 700,
                  marginBottom: 'var(--space-3)', color: 'var(--text-primary)'
                }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 'var(--text-sm)' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="how-it-works"
        style={{ background: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">How It Works</span>
            <h2 className="section-title">
              From Order to Delivery in{' '}
              <span className="gradient-text">4 Steps</span>
            </h2>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'var(--space-6)', position: 'relative'
          }}>

            <div style={{
              position: 'absolute',
              top: 36, left: '12%', right: '12%',
              height: 1,
              background: 'linear-gradient(90deg, var(--border-subtle), var(--border-default), var(--border-subtle))',
              zIndex: 0
            }} />

            {howItWorks.map((item, i) => (
              <div key={item.step}
                style={{
                  textAlign: 'center', position: 'relative', zIndex: 1,
                  animation: 'fadeInUp 0.5s ease both',
                  animationDelay: `${i * 0.12}s`
                }}>

                <div style={{
                  width: 72, height: 72,
                  borderRadius: '50%',
                  background: 'var(--bg-card)',
                  border: '2px solid var(--border-default)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 32, margin: '0 auto var(--space-5)',
                  transition: 'var(--transition-spring)',
                  boxShadow: 'var(--shadow-md)'
                }}>
                  {item.icon}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 800,
                  fontSize: 'var(--text-sm)', color: 'var(--agro-green)',
                  marginBottom: 'var(--space-2)', letterSpacing: '0.1em'
                }}>{item.step}</div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: 'var(--text-lg)', marginBottom: 'var(--space-3)'
                }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section style={{
        padding: 'var(--space-20) 0',
        background: 'linear-gradient(135deg, rgba(22,163,74,0.08) 0%, rgba(5,150,105,0.05) 100%)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)',
            background: 'rgba(217,119,6,0.1)',
            border: '1px solid rgba(217,119,6,0.25)',
            borderRadius: 'var(--radius-full)',
            padding: 'var(--space-2) var(--space-5)',
            marginBottom: 'var(--space-6)'
          }}>
            <span>⚠️</span>
            <span style={{ color: 'var(--agro-amber-light)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
              The Problem We're Solving
            </span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 900, marginBottom: 'var(--space-4)'
          }}>
            Sri Lanka loses{' '}
            <span style={{ color: 'var(--agro-amber-light)' }}>LKR 18B+</span>{' '}
            annually
          </h2>
          <p style={{
            fontSize: 'var(--text-xl)', color: 'var(--text-secondary)',
            maxWidth: 600, margin: '0 auto var(--space-10)',
            lineHeight: 1.7
          }}>
            to post-harvest waste and middlemen markups.
            AgroHub fixes that.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-6)', maxWidth: 800, margin: '0 auto' }}>

            <Link to="/farmer" style={{ textDecoration: 'none' }} id="role-farmer-card">
              <div className="card" style={{
                padding: 'var(--space-10)', textAlign: 'center', cursor: 'pointer',
                background: 'linear-gradient(145deg, rgba(22,163,74,0.08) 0%, var(--bg-card) 100%)',
                border: '1px solid rgba(22,163,74,0.20)'
              }}>
                <div style={{ fontSize: 64, marginBottom: 'var(--space-5)' }}>👨‍🌾</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
                  I'm a Farmer
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
                  Get crop recommendations, price forecasts, harvest alerts, and sell directly to buyers with no middlemen.
                </p>
                <div className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Open Farmer Dashboard <ArrowRight size={16} />
                </div>
              </div>
            </Link>


            <Link to="/buyer" style={{ textDecoration: 'none' }} id="role-buyer-card">
              <div className="card" style={{
                padding: 'var(--space-10)', textAlign: 'center', cursor: 'pointer',
                background: 'linear-gradient(145deg, rgba(37,99,235,0.06) 0%, var(--bg-card) 100%)',
                border: '1px solid rgba(37,99,235,0.20)'
              }}>
                <div style={{ fontSize: 64, marginBottom: 'var(--space-5)' }}>🛒</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
                  I'm a Buyer
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
                  Browse fresh produce with full traceability. Place advance orders, track delivery, and get the best direct-farm prices.
                </p>
                <div className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
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
