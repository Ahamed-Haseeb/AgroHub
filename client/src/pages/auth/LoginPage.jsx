import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { loginUser } from '../../api/client';
import { brandStats } from '../../config/brandStats';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(form);
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('agrohub_token', data.token);
      storage.setItem('agrohub_user', JSON.stringify(data.user));

      if (data.user.role === 'farmer') {
        navigate('/farmer');
      } else {
        navigate('/buyer');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <Link to="/" className="auth-logo">
            <Leaf size={22} color="var(--primary)" />
            AgroHub
          </Link>

          <h1 className="auth-heading">Welcome back</h1>
          <p className="auth-subheading">
            Sign in to your account to manage your farm, track orders, and access market data.
          </p>

          {error && (
            <div className="auth-error-banner">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                className={`auth-input ${error && !form.email ? 'auth-input-error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="login-password">Password</label>
              <div className="auth-password-wrap">
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  className={`auth-input ${error && !form.password ? 'auth-input-error' : ''}`}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={set('password')}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPw(!showPw)}
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="auth-row">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <Link to="/" className="auth-link">Forgot password?</Link>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="auth-footer-text">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">Create one</Link>
          </p>
        </div>
      </div>

      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <h2 className="auth-brand-title">
            Farm-to-consumer,<br />without the middlemen
          </h2>
          <p className="auth-brand-desc">
            AgroHub connects 2,800+ Sri Lankan farmers directly to buyers.
            Real-time price forecasts. Just-in-time logistics. Zero waste.
          </p>

          <div className="auth-stats-grid">
            {brandStats.map(stat => (
              <div key={stat.label} className="auth-stat-pill">
                <div className="auth-stat-value">{stat.value}</div>
                <div className="auth-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
