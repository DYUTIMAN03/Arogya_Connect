'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

const doctors = [
  { initials: 'DP', name: 'Dr. Priya Sharma', spec: 'General Medicine', patients: 8, status: 'Available', color: '#06c17a' },
  { initials: 'DA', name: 'Dr. Anil Verma', spec: 'Pediatrics', patients: 12, status: 'In Consult', color: '#f59e0b' },
  { initials: 'DS', name: 'Dr. Sunita Rao', spec: 'OB-GYN', patients: 5, status: 'Offline', color: '#6b7280' },
  { initials: 'DR', name: 'Dr. Rajesh Gupta', spec: 'Orthopedics', patients: 8, status: 'Available', color: '#06c17a' },
];

const flaggedCases = [
  { name: 'Ramesh Kumar', priority: 'P1', complaint: 'Chest pain with breathlessness since 2 hours', confidence: 92, review: false },
  { name: 'Sita Devi', priority: 'P2', complaint: 'High fever with vomiting since yesterday', confidence: 65, review: true },
  { name: 'Lakshmi Narayan', priority: 'P2', complaint: 'Fall injury with knee pain, unable to walk', confidence: 65, review: true },
];

export default function CoordinatorPage() {
  const [cases, setCases] = useState(flaggedCases);
  const [reviewModal, setReviewModal] = useState<any>(null);
  const [toasts, setToasts] = useState<{id:number,msg:string,type:string}[]>([]);
  let tid = 0;

  const toast = (msg: string, type = '') => {
    const id = ++tid;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  const escalate = (name: string) => {
    setCases(c => c.map(x => x.name === name ? { ...x, priority: 'P1', review: false } : x));
    toast(`${name} escalated to P1 ✓`, 'error');
  };

  const confirm = (name: string) => {
    setCases(c => c.filter(x => x.name !== name));
    toast(`${name} confirmed ✓`, 'success');
  };

  return (
    <div className="app">
      <Navbar />
      <div className="content fade-in">
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 700 }}>Clinic Coordinator</div>
          <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>Monitor queue, review flagged triage cases, and manage doctor availability.</div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">👥</div>
            <div className="stat-val">5</div>
            <div className="stat-label">In Queue</div>
          </div>
          <div className="stat-card amber">
            <div className="stat-icon amber">⚠</div>
            <div className="stat-val">2</div>
            <div className="stat-label">Flagged Cases</div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon green">🩺</div>
            <div className="stat-val">2</div>
            <div className="stat-label">Doctors Available</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">⏱</div>
            <div className="stat-val">22 min</div>
            <div className="stat-label">Avg Wait</div>
          </div>
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          {/* Flagged Triage Review */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">🚩 Flagged Triage Review</div>
                <div className="card-sub">Cases with AI confidence &lt;70% are auto-flagged for manual review by coordinator.</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cases.map((c, i) => (
                <div key={c.name} style={{
                  padding: 16, borderRadius: 10, border: `1px solid ${c.priority === 'P1' ? 'rgba(239,68,68,.2)' : 'rgba(245,158,11,.2)'}`,
                  background: c.priority === 'P1' ? 'var(--p1-bg)' : 'var(--p2-bg)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</span>
                      <span className={`priority-badge ${c.priority === 'P1' ? 'p1-badge' : 'p2-badge'}`}>
                        <span className={c.priority === 'P1' ? 'p1-dot' : 'p2-dot'}></span>
                        {c.priority === 'P1' ? 'Critical' : 'High'}
                      </span>
                    </div>
                    {c.review && <span className="badge badge-amber" style={{ background: '#fef9c3', color: '#92400e' }}>⚠ Needs Review</span>}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>{c.complaint}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>🤖</span> AI Confidence: <strong style={{ color: c.confidence < 70 ? 'var(--warn)' : 'var(--accent)' }}>{c.confidence}%</strong>
                  </div>
                  {c.review && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <button className="action-btn" onClick={() => confirm(c.name)}>👁 Confirm</button>
                      <button className="btn btn-danger btn-sm" onClick={() => escalate(c.name)}>Escalate to P1</button>
                    </div>
                  )}
                </div>
              ))}
              {cases.length === 0 && <div className="empty-state"><div className="es-icon">✅</div><h3>All Cases Reviewed</h3><p>No pending flagged triage cases.</p></div>}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Doctor Availability */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">👨‍⚕️ Doctor Availability</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {doctors.map(doc => (
                  <div key={doc.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="avatar" style={{ background: doc.color, width: 36, height: 36, fontSize: 12 }}>{doc.initials}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{doc.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{doc.spec} · {doc.patients} patients today</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {doc.status === 'Offline' && <button className="action-btn btn-sm" style={{ fontSize: 11 }} onClick={() => toast(`Notifying ${doc.name}…`)}>Notify</button>}
                      <span className={`badge ${doc.status === 'Available' ? 'badge-green' : doc.status === 'In Consult' ? 'badge-amber' : ''}`}
                        style={doc.status === 'Offline' ? { background: '#f3f4f6', color: 'var(--muted)' } : {}}>
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Summary */}
            <div className="card">
              <div className="card-header"><div className="card-title">📊 Today's Summary</div></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, textAlign: 'center' }}>
                <div><div style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800 }}>31</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>Total Consulted</div></div>
                <div><div style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800, color: 'var(--warn)' }}>4</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>Referred</div></div>
                <div><div style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800, color: 'var(--danger)' }}>2</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>Escalated</div></div>
              </div>
            </div>

            {/* Recent Follow-up */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">Recent Follow-up Activity</div>
                <div className="card-sub">Last 2 hours</div>
              </div>
              <div className="followup-item">
                <div className="followup-icon wa">💬</div>
                <div className="followup-text">
                  <div className="followup-name">Savitaben Patel</div>
                  <div className="followup-msg">Prescription PDF sent via WhatsApp · Amoxicillin 500mg × 5 days</div>
                </div>
                <span className="followup-status fs-sent">Delivered</span>
              </div>
              <div className="followup-item">
                <div className="followup-icon sms">📱</div>
                <div className="followup-text">
                  <div className="followup-name">Mohan Tiwari</div>
                  <div className="followup-msg">24hr check-in SMS sent · Replied "3" (Worse) — escalated ⚠</div>
                </div>
                <span className="followup-status fs-failed">Escalated</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}</span><span>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
