import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Leaf, Eye, EyeOff, ArrowRight, AlertCircle,
  Tractor, ShoppingBag, CheckCircle, ChevronLeft
} from 'lucide-react';
import { registerUser } from '../../api/client';
import { registerBrandStats } from '../../config/brandStats';

const districts = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
  'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', district: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    if (fieldErrors[key]) {
      setFieldErrors({ ...fieldErrors, [key]: '' });
    }
  };

  const selectRole = (r) => {
    setRole(r);
    setStep(2);
    setError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (role === 'farmer' && !form.district) errs.district = 'Select your district';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;
    if (!agreed) {
      setError('You must accept the terms to continue');
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role,
        phone: form.phone,
        district: form.district,
      });

      localStorage.setItem('agrohub_token', data.token);
      localStorage.setItem('agrohub_user', JSON.stringify(data.user));

      if (data.user.role === 'farmer') {
        navigate('/farmer');
      } else {
        navigate('/buyer');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
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

          <div className="auth-steps">
            <div className={`auth-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <span className="auth-step-dot">{step > 1 ? <CheckCircle size={14} /> : '1'}</span>
              Role
            </div>
            <div className={`auth-step-line ${step > 1 ? 'active' : ''}`} />
            <div className={`auth-step ${step >= 2 ? 'active' : ''}`}>
              <span className="auth-step-dot">2</span>
              Details
            </div>
          </div>

          {step === 1 && (
            <>
              <h1 className="auth-heading">Create your account</h1>
              <p className="auth-subheading">
                How will you use AgroHub? Pick your role to get started.
              </p>

              <div className="auth-role-grid">
                <div
                  className={`auth-role-card ${role === 'farmer' ? 'active' : ''}`}
                  onClick={() => selectRole('farmer')}
                >
                  <div className="auth-role-icon">
                    <Tractor size={24} />
                  </div>
                  <div className="auth-role-title">Farmer</div>
                  <div className="auth-role-desc">
                    Sell crops, get price forecasts, manage harvests
                  </div>
                </div>

                <div
                  className={`auth-role-card ${role === 'buyer' ? 'active' : ''}`}
                  onClick={() => selectRole('buyer')}
                >
                  <div className="auth-role-icon">
                    <ShoppingBag size={24} />
                  </div>
                  <div className="auth-role-title">Buyer</div>
                  <div className="auth-role-desc">
                    Order fresh produce, track deliveries, browse farms
                  </div>
                </div>
              </div>

              <p className="auth-footer-text">
                Already have an account?{' '}
                <Link to="/login" className="auth-link">Sign in</Link>
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <button
                type="button"
                className="auth-link auth-back-btn"
                onClick={() => setStep(1)}
              >
                <ChevronLeft size={14} /> Change role
              </button>

              <h1 className="auth-heading">
                {role === 'farmer' ? 'Farmer' : 'Buyer'} registration
              </h1>
              <p className="auth-subheading">
                Fill in your details to get started on AgroHub.
              </p>

              {error && (
                <div className="auth-error-banner">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="auth-field">
                  <label className="auth-label" htmlFor="reg-name">Full name</label>
                  <input
                    id="reg-name"
                    type="text"
                    className={`auth-input ${fieldErrors.name ? 'auth-input-error' : ''}`}
                    placeholder="Your full name"
                    value={form.name}
                    onChange={set('name')}
                    autoComplete="name"
                  />
                  {fieldErrors.name && <div className="auth-error-text">{fieldErrors.name}</div>}
                </div>

                <div className="auth-field">
                  <label className="auth-label" htmlFor="reg-email">Email address</label>
                  <input
                    id="reg-email"
                    type="email"
                    className={`auth-input ${fieldErrors.email ? 'auth-input-error' : ''}`}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={set('email')}
                    autoComplete="email"
                  />
                  {fieldErrors.email && <div className="auth-error-text">{fieldErrors.email}</div>}
                </div>

                <div className="auth-field-row">
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="reg-password">Password</label>
                    <div className="auth-password-wrap">
                      <input
                        id="reg-password"
                        type={showPw ? 'text' : 'password'}
                        className={`auth-input ${fieldErrors.password ? 'auth-input-error' : ''}`}
                        placeholder="Min. 6 characters"
                        value={form.password}
                        onChange={set('password')}
                        autoComplete="new-password"
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
                    {fieldErrors.password && <div className="auth-error-text">{fieldErrors.password}</div>}
                  </div>

                  <div className="auth-field">
                    <label className="auth-label" htmlFor="reg-confirm">Confirm password</label>
                    <div className="auth-password-wrap">
                      <input
                        id="reg-confirm"
                        type={showConfirm ? 'text' : 'password'}
                        className={`auth-input ${fieldErrors.confirmPassword ? 'auth-input-error' : ''}`}
                        placeholder="Re-enter password"
                        value={form.confirmPassword}
                        onChange={set('confirmPassword')}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="auth-password-toggle"
                        onClick={() => setShowConfirm(!showConfirm)}
                        tabIndex={-1}
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && <div className="auth-error-text">{fieldErrors.confirmPassword}</div>}
                  </div>
                </div>

                <div className="auth-field-row">
                  <div className="auth-field">
                    <label className="auth-label" htmlFor="reg-phone">Phone (optional)</label>
                    <input
                      id="reg-phone"
                      type="tel"
                      className="auth-input"
                      placeholder="+94 7X XXX XXXX"
                      value={form.phone}
                      onChange={set('phone')}
                      autoComplete="tel"
                    />
                  </div>

                  {role === 'farmer' ? (
                    <div className="auth-field">
                      <label className="auth-label" htmlFor="reg-district">District</label>
                      <select
                        id="reg-district"
                        className={`auth-input auth-select-none ${fieldErrors.district ? 'auth-input-error' : ''}`}
                        value={form.district}
                        onChange={set('district')}
                      >
                        <option value="">Select district</option>
                        {districts.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      {fieldErrors.district && <div className="auth-error-text">{fieldErrors.district}</div>}
                    </div>
                  ) : (
                    <div className="auth-field">
                      <label className="auth-label" htmlFor="reg-district">City (optional)</label>
                      <input
                        id="reg-district"
                        type="text"
                        className="auth-input"
                        placeholder="e.g. Colombo"
                        value={form.district}
                        onChange={set('district')}
                      />
                    </div>
                  )}
                </div>

                <div className="auth-terms">
                  <label className="auth-checkbox-label">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                    />
                    I agree to the <Link to="/" className="auth-link">Terms of Service</Link> and <Link to="/" className="auth-link">Privacy Policy</Link>
                  </label>
                </div>

                <button
                  type="submit"
                  className="auth-submit"
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Create account'}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>

              <p className="auth-footer-text">
                Already have an account?{' '}
                <Link to="/login" className="auth-link">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>

      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <h2 className="auth-brand-title">
            Join Sri Lanka's direct<br />agriculture network
          </h2>
          <p className="auth-brand-desc">
            Whether you grow it or buy it, AgroHub puts you
            in control. Fair prices, full traceability, and
            delivery in 24 to 72 hours.
          </p>

          <div className="auth-stats-grid">
            {registerBrandStats.map(stat => (
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
