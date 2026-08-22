import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Zap, Info } from 'lucide-react';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="dash-tooltip">
      <p className="dash-tooltip-title">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} className="dash-tooltip-item" style={{ color: p.color }}>
          {p.name}: <strong>₨ {p.value?.toLocaleString('en-LK')}</strong>
        </p>
      ))}
    </div>
  );
}

export default function AnalyticsTab({ prediction, selectedCrop, setSelectedCrop, availableCrops }) {
  const garchRisk = prediction?.garch_metrics?.risk_score ?? 0;
  const riskColor = garchRisk >= 70 ? 'var(--red)' : garchRisk >= 45 ? 'var(--amber)' : 'var(--primary)';
  const riskLabel = garchRisk >= 70 ? 'High Risk' : garchRisk >= 45 ? 'Moderate Risk' : 'Low Risk';

  return (
    <div className="animate-fade-in">
      {!prediction ? (
        <div style={{ padding: 'var(--sp-10)', textAlign: 'center', color: 'var(--text-muted)' }}>Loading analytics...</div>
      ) : (
      <>
      <div className="dash-header dash-header-spaced">
        <div>
          <h1 className="dash-page-title">Analytics</h1>
          <p className="dash-page-date">SARIMA + GARCH model outputs · Weekly LKR/kg</p>
        </div>
        <select className="input select dash-crop-select" value={selectedCrop} onChange={e => setSelectedCrop(e.target.value)}>
          {availableCrops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="dash-metric-grid dash-metric-grid-spaced">
        {[
          { label: 'GARCH(1,1) Volatility', value: `${(prediction.garch_metrics.current_volatility * 100).toFixed(1)}%`, sub: 'Current σ', color: 'var(--blue)', pct: prediction.garch_metrics.current_volatility * 300, gaugeClass: 'gauge-amber' },
          { label: 'Risk Score', value: `${garchRisk}/100`, sub: riskLabel, color: riskColor, pct: garchRisk, gaugeClass: garchRisk >= 70 ? 'gauge-red' : garchRisk >= 45 ? 'gauge-amber' : 'gauge-green' },
          { label: 'Forecast Confidence', value: `${(prediction.garch_metrics.forecast_confidence * 100).toFixed(0)}%`, sub: 'Model accuracy', color: 'var(--primary)', pct: prediction.garch_metrics.forecast_confidence * 100, gaugeClass: 'gauge-green' },
        ].map(card => (
          <div key={card.label} className="dash-metric-card">
            <div className="dash-metric-label" style={{ color: card.color }}>{card.label}</div>
            <div className="dash-metric-value">{card.value}</div>
            <div className="dash-metric-sub">{card.sub}</div>
            <div className="gauge-bar"><div className={`gauge-fill ${card.gaugeClass}`} style={{ width: `${Math.min(card.pct, 100)}%` }} /></div>
          </div>
        ))}
      </div>

      <div className="dash-chart-card dash-chart-card-spaced">
        <div className="dash-chart-title">52-Week SARIMA Forecast — {prediction.crop_name}</div>
        <div className="dash-chart-meta">
          <span className="dash-chart-model">{prediction.model} · 95% CI</span>
          <span className="badge badge-amber"><Zap size={12} style={{ display: 'inline', marginRight: 4 }} /> Lean: Weeks 21–29, 49–52</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={prediction.forecast} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="sarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="week_label" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} interval={3} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₨${v}`} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="upper_ci" name="Upper CI" stroke="var(--border-hover)" strokeWidth={1} fill="none" strokeDasharray="4 2" />
            <Area type="monotone" dataKey="price" name="Forecast (₨/kg)" stroke="var(--primary)" strokeWidth={2.5} fill="url(#sarGrad)"
              dot={props => {
                if (!props.payload.lean_season) return null;
                return <circle key={props.key} cx={props.cx} cy={props.cy} r={4} fill="var(--amber)" stroke="var(--amber-light)" strokeWidth={1.5} />;
              }}
            />
            <Area type="monotone" dataKey="lower_ci" name="Lower CI" stroke="var(--border-hover)" strokeWidth={1} fill="none" strokeDasharray="4 2" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="dash-chart-card">
        <div className="dash-chart-title">GARCH(1,1) Volatility Surface</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={prediction.garch_metrics.volatility_history} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="week" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => (v * 100).toFixed(0) + '%'} />
            <Tooltip formatter={v => [(v * 100).toFixed(1) + '%', 'Volatility (σ)']} contentStyle={{ background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13 }} />
            <Bar dataKey="sigma" radius={[4, 4, 0, 0]}>
              {prediction.garch_metrics.volatility_history.map((entry, index) => (
                <rect key={`bar-${index}`} fill={entry.sigma > 0.25 ? 'var(--amber)' : entry.sigma > 0.18 ? 'var(--primary)' : 'var(--primary-light)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="dash-info-banner dash-info-banner-mt">
          <Info size={14} color="var(--primary)" className="dash-info-icon" />
          <p className="dash-info-text">
            <strong>Market Recommendation: </strong>{prediction.garch_metrics.recommendation}
          </p>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
