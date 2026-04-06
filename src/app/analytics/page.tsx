'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

const hourlyData = [3, 6, 12, 7, 5, 9, 11, 6, 4];
const hours = ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM'];
const maxVal = Math.max(...hourlyData);

const weeklyData = [42, 58, 51, 74, 63, 38, 22];
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const maxWeekly = Math.max(...weeklyData);

const severity = [
  { label: 'Critical', count: 1, color: '#ef4444', pct: 20 },
  { label: 'High', count: 2, color: '#f59e0b', pct: 40 },
  { label: 'Medium', count: 1, color: '#3b82f6', pct: 20 },
  { label: 'Low', count: 1, color: '#06c17a', pct: 20 },
];

function DonutChart({ segments }: { segments: typeof severity }) {
  let currentCumulative = 0;
  const r = 54, cx = 70, cy = 70, stroke = 22;
  const circ = 2 * Math.PI * r;

  const donuts = segments.map((s) => {
    const dash = (s.pct / 100) * circ;
    const offset = circ - currentCumulative * circ / 100;
    currentCumulative += s.pct;
    return { ...s, dash, offset };
  });

  return (
    <svg width={140} height={140} viewBox="0 0 140 140">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
      {donuts.map((d, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none"
          stroke={d.color} strokeWidth={stroke}
          strokeDasharray={`${d.dash} ${circ - d.dash}`}
          strokeDashoffset={d.offset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '70px 70px' }}
        />
      ))}
    </svg>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="app">
      <Navbar />
      <div className="content fade-in">
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 700 }}>Analytics Dashboard</div>
          <div style={{ color: 'var(--accent)', fontSize: 14, marginTop: 4 }}>Real-time overview of clinic queue and triage data.</div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">👥</div>
            <div className="stat-val">5</div>
            <div className="stat-label">Total Patients</div>
          </div>
          <div className="stat-card red">
            <div className="stat-icon red">🚨</div>
            <div className="stat-val">1</div>
            <div className="stat-label">Critical Cases</div>
          </div>
          <div className="stat-card amber">
            <div className="stat-icon amber">⏱</div>
            <div className="stat-val">18 min</div>
            <div className="stat-label">Avg Wait Time</div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon green">✅</div>
            <div className="stat-val">23</div>
            <div className="stat-label">Consulted Today</div>
          </div>
        </div>

        <div className="grid-2">
          {/* Patient Flow Bar Chart */}
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--accent)' }}>↗</span> Patient Flow (Today)
              </div>
            </div>
            <div style={{ paddingTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140, paddingBottom: 4 }}>
                {hourlyData.map((val, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ fontSize: 10, color: 'var(--muted)' }}>{val}</div>
                    <div style={{
                      width: '100%', background: 'var(--accent)', borderRadius: '4px 4px 0 0',
                      height: `${(val / maxVal) * 100}%`, minHeight: 4, transition: 'height .4s ease',
                      cursor: 'pointer'
                    }} onMouseEnter={e => (e.currentTarget.style.background = 'var(--brand)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
                    ></div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                {hours.map((h, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'var(--muted)' }}>{h}</div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                <span>Peak: 10AM (12 patients)</span>
                <span>Total: {hourlyData.reduce((a, b) => a + b, 0)} patients</span>
              </div>
            </div>
          </div>

          {/* Severity Donut */}
          <div className="card">
            <div className="card-header">
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--accent)' }}>↗</span> Severity Distribution
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', paddingTop: 12 }}>
              <DonutChart segments={severity} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {severity.map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: s.color, flexShrink: 0 }}></div>
                    <div style={{ fontSize: 13 }}>
                      <span style={{ fontWeight: 600 }}>{s.label}</span>
                      <span style={{ color: 'var(--muted)', marginLeft: 6 }}>({s.count})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Triage Accuracy */}
          <div className="card">
            <div className="card-header"><div className="card-title">📈 Triage Metrics</div></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'AI Accuracy', val: 92, color: 'var(--accent)' },
                { label: 'Hard Override Rate', val: 8, color: 'var(--danger)' },
                { label: 'Low Confidence Flags', val: 12, color: 'var(--warn)' },
                { label: 'Cases Escalated', val: 5, color: 'var(--brand)' },
              ].map(m => (
                <div key={m.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span>{m.label}</span><strong style={{ color: m.color }}>{m.val}%</strong>
                  </div>
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: `${m.val}%`, background: m.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Follow-up Stats */}
          <div className="card">
            <div className="card-header"><div className="card-title">📱 Follow-up Engine Stats</div></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { val: 24, label: 'Messages Sent', color: 'var(--brand)' },
                { val: 19, label: 'Replied', color: 'var(--accent)' },
                { val: 1, label: 'Escalated', color: 'var(--danger)' },
                { val: 4, label: 'Pending', color: 'var(--warn)' },
              ].map(s => (
                <div key={s.label} style={{ padding: 16, background: 'var(--bg)', borderRadius: 10, textAlign: 'center', border: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
