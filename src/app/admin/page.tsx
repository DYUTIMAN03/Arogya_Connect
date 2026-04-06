'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

const clinics = [
  { name: 'Sundarpur PHC', district: 'Lucknow', staff: 4, patients: 45, status: 'online', uptime: '99.2%' },
  { name: 'Rampur CHC', district: 'Barabanki', staff: 8, patients: 72, status: 'online', uptime: '98.7%' },
  { name: 'Lakhimpur PHC', district: 'Lakhimpur', staff: 3, patients: 28, status: 'degraded', uptime: '94.1%' },
  { name: 'Chandanpur SC', district: 'Sitapur', staff: 2, patients: 15, status: 'offline', uptime: '0%' },
];

const staff = [
  { initials: 'DP', name: 'Dr. Priya Sharma', role: 'Doctor', clinic: 'Sundarpur PHC', shift: 'Active · Morning', color: '#06c17a' },
  { initials: 'DA', name: 'Dr. Anil Verma', role: 'Doctor', clinic: 'Rampur CHC', shift: 'Active · Full Day', color: '#1a6cf0' },
  { initials: 'SD', name: 'Suman Devi', role: 'ASHA Worker', clinic: 'Sundarpur PHC', shift: 'Active · Morning', color: '#8b5cf6' },
  { initials: 'RK', name: 'Ravi Kumar', role: 'Coordinator', clinic: 'Lakhimpur PHC', shift: 'On Leave · Afternoon', color: '#f59e0b' },
  { initials: 'DS', name: 'Dr. Sunita Rao', role: 'Doctor', clinic: 'Rampur CHC', shift: 'Active · Morning', color: '#10b981' },
  { initials: 'PP', name: 'Priya Patel', role: 'ASHA Worker', clinic: 'Chandanpur SC', shift: 'Active · Morning', color: '#ec4899' },
];

const weeklyData = [42, 58, 51, 74, 63, 38, 22];
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const maxW = Math.max(...weeklyData);

const systemHealth = [
  { name: 'Supabase DB', lat: '12ms', ok: true },
  { name: 'WebRTC Gateway', lat: '43ms', ok: true },
  { name: 'Whisper STT API', lat: '330ms', ok: true },
  { name: 'SMS/WhatsApp (MSG91)', lat: '980ms', ok: true },
  { name: 'AI Triage (LLM)', lat: '1.2s', ok: false },
  { name: 'Storage (Cloudflare R2)', lat: '60ms', ok: true },
];

const compliance = [
  'Data in India (ap-south-1)', 'DPDPA 2023 Consent ✅', 'AES-256 Encryption ✅', 'ABHA Linkage (Optional)',
  'Stateless Whisper ✅', 'Audit Logging ✅', 'Session Timeout ✅', 'RLS Policies Active ✅',
];

export default function AdminPage() {
  const [toasts, setToasts] = useState<{id:number,msg:string,type:string}[]>([]);
  let tid = 0;
  const toast = (msg: string, type = '') => {
    const id = ++tid;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  return (
    <div className="app">
      <Navbar />
      <div className="content fade-in">
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 700 }}>Admin Panel</div>
          <div style={{ color: 'var(--warn)', fontSize: 14, marginTop: 4 }}>Multi-clinic management, staff roster, and system health monitoring.</div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">🏥</div>
            <div className="stat-val">4</div>
            <div className="stat-label">Total Clinics</div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon green">👥</div>
            <div className="stat-val">16</div>
            <div className="stat-label">Total Staff</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">🩺</div>
            <div className="stat-val">6</div>
            <div className="stat-label">Active Doctors</div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon green">⚡</div>
            <div className="stat-val" style={{ fontSize: 18 }}>Operational</div>
            <div className="stat-label">System Status</div>
          </div>
        </div>

        {/* Clinic Network */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header">
            <div className="card-title">🌐 Clinic Network</div>
          </div>
          <table className="queue-table">
            <thead>
              <tr><th>Clinic</th><th>District</th><th>Staff</th><th>Patients Today</th><th>Status</th><th>Uptime</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {clinics.map(c => (
                <tr key={c.name}>
                  <td><strong>{c.name}</strong></td>
                  <td style={{ color: 'var(--muted)' }}>{c.district}</td>
                  <td>{c.staff}</td>
                  <td><span style={{ color: c.patients > 50 ? 'var(--brand)' : 'var(--text)', fontWeight: c.patients > 50 ? 700 : 400 }}>{c.patients}</span></td>
                  <td>
                    <span style={{ color: c.status === 'online' ? 'var(--accent)' : c.status === 'degraded' ? 'var(--warn)' : 'var(--danger)', fontWeight: 600, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }}></span> {c.status}
                    </span>
                  </td>
                  <td style={{ color: c.status === 'offline' ? 'var(--danger)' : 'var(--muted)', fontWeight: 600 }}>{c.uptime}</td>
                  <td><button className="action-btn" onClick={() => toast(`Viewing ${c.name}…`)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid-2">
          {/* Staff Roster */}
          <div className="card">
            <div className="card-header"><div className="card-title">📋 Staff Roster</div></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {staff.map(s => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar" style={{ background: s.color, width: 30, height: 30, fontSize: 10 }}>{s.initials}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.role} · {s.clinic}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: s.shift.includes('Leave') ? 'var(--warn)' : 'var(--accent)' }}>{s.shift}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Chart */}
          <div className="card">
            <div className="card-header"><div className="card-title">📈 Weekly Patient Flow</div></div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160, paddingBottom: 4 }}>
              {weeklyData.map((val, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{val}</div>
                  <div style={{ width: '100%', background: 'var(--accent)', borderRadius: '4px 4px 0 0', height: `${(val / maxW) * 100}%`, minHeight: 4 }}></div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{weekDays[i]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="card" style={{ marginTop: 20 }}>
          <div className="card-header"><div className="card-title">🖥️ System Health</div></div>
          <div className="health-grid">
            {systemHealth.map(s => (
              <div key={s.name} className="health-item">
                <div>
                  <div className="health-name">{s.name}</div>
                  <div className="health-lat">Latency: {s.lat}</div>
                </div>
                <div className={s.ok ? 'health-ok' : 'health-warn'}>{s.ok ? '✓' : '⚠'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance */}
        <div className="card" style={{ marginTop: 20 }}>
          <div className="card-header"><div className="card-title">🔒 Compliance & Security</div></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
            {compliance.map(c => (
              <div key={c} style={{ padding: 10, background: 'var(--bg)', borderRadius: 8, fontSize: 12, color: 'var(--muted)', border: '1px solid var(--border)' }}>{c}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>ℹ️</span><span>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
