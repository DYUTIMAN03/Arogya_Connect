'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

const followups = [
  { channel: 'wa', icon: '💬', name: 'Savitaben Patel', time: '10:22 AM', msg: 'Prescription PDF delivered via WhatsApp. Amoxicillin 500mg × 5 days', status: 'Sent', statusClass: 'fs-sent' },
  { channel: 'escalated', icon: '🚨', name: 'Mohan Tiwari', time: '9:54 AM', msg: '24hr check-in: replied "3 — Worse". Automatic escalation triggered. Coordinator notified.', status: 'Escalated', statusClass: 'fs-failed', escalated: true },
  { channel: 'ivr', icon: '📞', name: 'Anita Devi', time: '9:30 AM', msg: 'IVR prescription summary in Hindi delivered. Duration 1m 12s', status: 'Done', statusClass: 'fs-sent' },
  { channel: 'sms', icon: '📱', name: 'Vijay Rathod', time: 'Due 11:00 PM', msg: 'Medication reminder SMS scheduled — Cetirizine 10mg', status: 'Scheduled', statusClass: 'fs-pending' },
];

export default function FollowupPage() {
  const [escalateModal, setEscalateModal] = useState(false);
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
        <div className="grid-2" style={{ alignItems: 'start' }}>
          {/* Follow-up Queue */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Follow-up Queue</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span className="badge badge-blue">12 active</span>
                <span className="badge badge-red">1 escalated</span>
              </div>
            </div>
            <div className="tabs">
              <div className="tab active">All</div>
              <div className="tab">Pending</div>
              <div className="tab">Escalated</div>
            </div>
            <div>
              {followups.map((f, i) => (
                <div key={i} className="followup-item" style={f.escalated ? { background: '#fef2f2', borderRadius: 8, padding: 12 } : {}}>
                  <div className={`followup-icon ${f.escalated ? '' : f.channel}`} style={f.escalated ? { background: '#fecaca', fontSize: 20 } : {}}>
                    {f.icon}
                  </div>
                  <div className="followup-text">
                    <div className="followup-name">
                      {f.name} · <span style={{ fontSize: 11, color: f.escalated ? 'var(--danger)' : 'var(--muted)' }}>{f.escalated ? 'Escalated · ' : ''}{f.time}</span>
                    </div>
                    <div className="followup-msg">{f.msg}</div>
                  </div>
                  {f.escalated ? (
                    <button className="btn btn-danger btn-sm" onClick={() => setEscalateModal(true)}>Handle</button>
                  ) : (
                    <span className={`followup-status ${f.statusClass}`}>{f.status}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 24-hr Check-in & Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">24-hr Check-in Messages</div>
                <span className="badge badge-green">MSG91 Live</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ background: 'var(--bg)', borderRadius: 10, padding: 14, fontSize: 13 }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Check-in Template (WhatsApp)</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
                    "नमस्ते {'{name}'}जी, आज आपकी तबियत कैसी है?<br />
                    1 – ठीक हूँ<br />
                    2 – थोड़ा ठीक हूँ<br />
                    3 – बदतर हूँ<br />
                    Reply with 1, 2, or 3."
                  </div>
                </div>
                <div style={{ background: 'var(--bg)', borderRadius: 10, padding: 14, fontSize: 13 }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Escalation Logic</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
                    Reply "3" → notify coordinator + doctor in real-time<br />
                    No reply in 24h → SMS reminder → then IVR call<br />
                    2× no reply → flag to ASHA worker
                  </div>
                </div>
                <div style={{ background: 'var(--accent-light)', borderRadius: 10, padding: 14, fontSize: 13 }}>
                  <div style={{ fontWeight: 600, color: 'var(--accent)', marginBottom: 4 }}>✅ Today's Stats</div>
                  <div style={{ display: 'flex', gap: 20, marginTop: 6 }}>
                    <div><div style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 700 }}>24</div><div style={{ fontSize: 11, color: 'var(--muted)' }}>Messages Sent</div></div>
                    <div><div style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 700 }}>19</div><div style={{ fontSize: 11, color: 'var(--muted)' }}>Replied</div></div>
                    <div><div style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 700, color: 'var(--danger)' }}>1</div><div style={{ fontSize: 11, color: 'var(--muted)' }}>Escalated</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Escalation Modal */}
      {escalateModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setEscalateModal(false)}>
          <div className="modal" style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <div className="modal-title">⚠ Escalation — Mohan Tiwari</div>
              <div className="close-btn" onClick={() => setEscalateModal(false)}>✕</div>
            </div>
            <div className="alert-banner alert-danger"><span>🚨</span><span>Patient replied "3 — Worse" to 24hr check-in at 9:54 AM</span></div>
            <div className="soap-section" style={{ marginTop: 12 }}>
              <div className="soap-key">Last Consultation — Yesterday 3:10 PM</div>
              <div className="soap-val">Dr. Arun Shah · P3 · Fever, body ache · Prescribed Paracetamol 650mg × 3 days</div>
            </div>
            <div className="form-group" style={{ marginTop: 14 }}>
              <label className="form-label">Action</label>
              <select className="form-input form-select">
                <option>Schedule urgent teleconsult</option>
                <option>Dispatch ASHA worker</option>
                <option>Refer to nearest hospital</option>
                <option>IVR call patient now</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Note</label>
              <textarea className="form-input" rows={2} placeholder="Coordinator action note…"></textarea>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setEscalateModal(false)}>Dismiss</button>
              <button className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { toast('Action taken — ASHA worker dispatched ✓', 'success'); setEscalateModal(false); }}>Take Action</button>
            </div>
          </div>
        </div>
      )}

      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{t.type === 'success' ? '✅' : 'ℹ️'}</span><span>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
