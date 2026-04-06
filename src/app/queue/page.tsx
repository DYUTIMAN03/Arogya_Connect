'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';

const CLINIC_ID = process.env.NEXT_PUBLIC_CLINIC_ID || '00000000-0000-0000-0000-000000000001';

// Demo data for offline/fallback
const demoQueue = [
  { id: '1', position: 1, priority: 'P1', joined_at: new Date(Date.now() - 22 * 60000).toISOString(), status: 'waiting', visit: { patient: { full_name: 'Ramesh Kumar', age: 62, gender: 'M', village: 'Nadiad' }, triage_records: [{ priority: 'P1', confidence: 0.91, reasoning: 'Chest pain — hard override' }] } },
  { id: '2', position: 2, priority: 'P2', joined_at: new Date(Date.now() - 18 * 60000).toISOString(), status: 'called', visit: { patient: { full_name: 'Savitaben Patel', age: 54, gender: 'F', village: 'Anand' }, triage_records: [{ priority: 'P2', confidence: 0.82, reasoning: 'Breathlessness, hypertension' }] } },
  { id: '3', position: 3, priority: 'P2', joined_at: new Date(Date.now() - 11 * 60000).toISOString(), status: 'waiting', visit: { patient: { full_name: 'Arjun Khanna', age: 34, gender: 'M', village: 'Kheda' }, triage_records: [{ priority: 'P2', confidence: 0.78, reasoning: 'Fever 3 days, body ache' }] } },
  { id: '4', position: 4, priority: 'P3', joined_at: new Date(Date.now() - 7 * 60000).toISOString(), status: 'waiting', visit: { patient: { full_name: 'Lata Modi', age: 29, gender: 'F', village: 'Nadiad' }, triage_records: [{ priority: 'P3', confidence: 0.94, reasoning: 'Routine ANC check' }] } },
  { id: '5', position: 5, priority: 'P3', joined_at: new Date(Date.now() - 4 * 60000).toISOString(), status: 'consult', visit: { patient: { full_name: 'Vijay Rathod', age: 45, gender: 'M', village: 'Kathlal' }, triage_records: [{ priority: 'P3', confidence: 0.88, reasoning: 'Mild cough' }] } },
];

const vitalsMap: Record<string, string> = {
  'Ramesh Kumar': 'BP 158/96 · SpO2 94%',
  'Savitaben Patel': 'BP 132/84 · SpO2 97%',
  'Arjun Khanna': 'Temp 102.4°F · BP 120/78',
  'Lata Modi': 'BP 118/76 · Normal',
  'Vijay Rathod': 'BP 124/80 · Normal',
};

const complaintMap: Record<string, string> = {
  'Ramesh Kumar': 'Chest pain, shortness of breath',
  'Savitaben Patel': 'Breathlessness, no fever',
  'Arjun Khanna': 'Fever 3 days, body ache',
  'Lata Modi': 'Routine ANC check, 28 weeks',
  'Vijay Rathod': 'Cough 2 weeks, mild',
};

const avatarColors = ['linear-gradient(135deg,#ef4444,#f97316)', 'linear-gradient(135deg,#f59e0b,#eab308)', 'linear-gradient(135deg,#6366f1,#8b5cf6)', 'linear-gradient(135deg,#10b981,#059669)', 'linear-gradient(135deg,#8b5cf6,#6366f1)'];

function getWaitMins(joined_at: string) {
  return Math.floor((Date.now() - new Date(joined_at).getTime()) / 60000);
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2);
}

export default function QueuePage() {
  const [queue, setQueue] = useState<any[]>([]);

  useEffect(() => {
    setQueue(demoQueue);
  }, []);
  const [soapModal, setSoapModal] = useState<any>(null);
  const [consultModal, setConsultModal] = useState<any>(null);
  const [referralModal, setReferralModal] = useState(false);
  const [rxItems, setRxItems] = useState([{ name: 'Aspirin 325mg', dose: '1 tablet — once daily after food', dur: '7 days' }, { name: 'Atorvastatin 40mg', dose: '1 tablet — at bedtime', dur: '30 days' }]);
  const [rxInput, setRxInput] = useState('');
  const [callSecs, setCallSecs] = useState(0);
  const [calling, setCalling] = useState(false);
  const [toasts, setToasts] = useState<{id:number,msg:string,type:string}[]>([]);
  let toastId = 0;

  const toast = (msg: string, type = '') => {
    const id = ++toastId;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3800);
  };

  useEffect(() => {
    let interval: any;
    if (calling) {
      interval = setInterval(() => setCallSecs(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [calling]);

  const startConsult = (entry: any) => {
    setConsultModal(entry);
    setCallSecs(0);
    setCalling(true);
  };

  const endCall = () => {
    setCalling(false);
    setConsultModal(null);
    toast('Call ended · Prescription saved', 'success');
  };

  const addRx = () => {
    if (!rxInput.trim()) return;
    setRxItems(r => [...r, { name: rxInput, dose: '1 tablet — as prescribed', dur: '5 days' }]);
    setRxInput('');
    toast(`${rxInput} added to prescription`);
  };

  const submit = () => {
    endCall();
    setTimeout(() => toast('📲 Prescription PDF sent via WhatsApp', 'success'), 600);
    setTimeout(() => toast('📱 24hr check-in scheduled for tomorrow'), 1200);
  };

  const fmt = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <div className="app">
      <Navbar />
      <div className="content fade-in">

        {/* P1 Alert */}
        <div className="alert-banner alert-danger">
          <span>🚨</span>
          <span><strong>Ramesh Kumar (P1)</strong> has been waiting 22 minutes. Chest pain flagged. Assign to available doctor immediately.</span>
          <button className="btn btn-sm btn-danger" style={{ marginLeft: 'auto' }} onClick={() => setSoapModal(demoQueue[0])}>View Brief</button>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Live Queue — Nadiad PHC</div>
              <div className="card-sub">{queue.length} patients waiting · <span style={{ color: 'var(--accent)', fontWeight: 600 }}>●</span> Live</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-outline btn-sm" onClick={() => window.location.href = '/register'}>+ Add Patient</button>
              <button className="btn btn-primary btn-sm" onClick={() => toast('Queue refreshed ✓', 'success')}>↻ Refresh</button>
            </div>
          </div>

          <table className="queue-table">
            <thead>
              <tr>
                <th>Pos</th><th>Patient</th><th>Chief Complaint</th><th>Priority</th><th>Vitals</th><th>Wait</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((entry, i) => {
                const name = entry.visit?.patient?.full_name || 'Unknown';
                const wait = getWaitMins(entry.joined_at);
                return (
                  <tr key={entry.id}>
                    <td><strong style={{ fontSize: 16, color: entry.priority === 'P1' ? 'var(--danger)' : 'var(--brand)' }}>#{entry.position}</strong></td>
                    <td>
                      <div className="patient-cell">
                        <div className="patient-avatar" style={{ background: avatarColors[i % avatarColors.length] }}>{getInitials(name)}</div>
                        <div>
                          <div className="patient-name">{name}</div>
                          <div className="patient-detail">{entry.visit?.patient?.age} · {entry.visit?.patient?.gender} · {entry.visit?.patient?.village}</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 13 }}>{complaintMap[name] || 'General complaint'}</span></td>
                    <td>
                      <span className={`priority-badge ${entry.priority === 'P1' ? 'p1-badge' : entry.priority === 'P2' ? 'p2-badge' : 'p3-badge'}`}>
                        <span className={`${entry.priority === 'P1' ? 'p1-dot' : entry.priority === 'P2' ? 'p2-dot' : 'p3-dot'}`}></span>
                        {entry.priority} · {entry.visit?.triage_records?.[0]?.confidence?.toFixed(2) || '0.91'}
                      </span>
                    </td>
                    <td><span style={{ fontSize: 12, color: entry.priority === 'P1' ? 'var(--danger)' : entry.priority === 'P2' ? 'var(--warn)' : 'var(--muted)' }}>{vitalsMap[name] || 'Normal'}</span></td>
                    <td><span className={`wait-chip ${wait > 20 ? 'high' : ''}`}>⏱ {wait}m</span></td>
                    <td>
                      <span className={`status-chip ${entry.status === 'called' ? 'status-called' : entry.status === 'consult' ? 'status-consult' : 'status-waiting'}`}>
                        {entry.status === 'called' ? 'Called' : entry.status === 'consult' ? 'In Consult' : 'Waiting'}
                      </span>
                    </td>
                    <td>
                      {i < 2 ? (
                        <button className="action-btn" onClick={() => i === 0 ? startConsult(entry) : setSoapModal(entry)}>
                          {i === 0 ? 'Start Call' : 'View Brief'}
                        </button>
                      ) : (
                        <button className="action-btn" onClick={() => setSoapModal(entry)}>View Brief</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SOAP Modal */}
      {soapModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSoapModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <div>
                <div className="modal-title">{soapModal.visit?.patient?.full_name} — SOAP Brief</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{soapModal.visit?.patient?.age} · {soapModal.visit?.patient?.gender} · {soapModal.visit?.patient?.village}</div>
              </div>
              <div className="close-btn" onClick={() => setSoapModal(null)}>✕</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span className={`priority-badge ${soapModal.priority === 'P1' ? 'p1-badge' : soapModal.priority === 'P2' ? 'p2-badge' : 'p3-badge'}`}>
                <span className={`${soapModal.priority === 'P1' ? 'p1-dot' : soapModal.priority === 'P2' ? 'p2-dot' : 'p3-dot'}`}></span>
                {soapModal.priority}
              </span>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>AI Confidence: {soapModal.visit?.triage_records?.[0]?.confidence?.toFixed(2)}</span>
              <span className="wait-chip" style={{ marginLeft: 'auto' }}>⏱ Waiting {getWaitMins(soapModal.joined_at)}m</span>
            </div>
            <div className="vitals-grid" style={{ marginBottom: 16 }}>
              <div className="vital-box alert"><div className="vital-val">132/84</div><div className="vital-unit">mmHg</div><div className="vital-label">Blood Pressure</div></div>
              <div className="vital-box"><div className="vital-val">98.4</div><div className="vital-unit">°F</div><div className="vital-label">Temperature</div></div>
              <div className="vital-box"><div className="vital-val">97%</div><div className="vital-unit">SpO2</div><div className="vital-label">Oxygen Sat.</div></div>
              <div className="vital-box"><div className="vital-val">86</div><div className="vital-unit">bpm</div><div className="vital-label">Heart Rate</div></div>
            </div>
            <div className="soap-section"><div className="soap-key">S — Subjective</div><div className="soap-val">{complaintMap[soapModal.visit?.patient?.full_name]}</div></div>
            <div className="soap-divider"></div>
            <div className="soap-section"><div className="soap-key">O — Objective</div><div className="soap-val">{vitalsMap[soapModal.visit?.patient?.full_name]} · Ambulatory</div></div>
            <div className="soap-divider"></div>
            <div className="soap-section"><div className="soap-key">A — Assessment (AI)</div><div className="soap-val">{soapModal.visit?.triage_records?.[0]?.reasoning}</div></div>
            <div className="soap-divider"></div>
            <div className="soap-section"><div className="soap-key">P — Plan Suggestions</div><div className="soap-val">Consider ECG, CBC, BMP. Review medications. Follow-up in 3 days if symptoms persist.</div></div>
            <div className="soap-divider"></div>
            <div className="soap-section">
              <div className="soap-key">⚑ Flags</div>
              <div className="triage-flags">
                <span className="flag">Chest Pain</span>
                <span className="flag">SpO2 Monitor</span>
                {soapModal.priority === 'P1' && <span className="flag" style={{ background: '#fef2f2', color: 'var(--p1)' }}>🚨 Hard Override</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setSoapModal(null)}>Close</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { setSoapModal(null); startConsult(soapModal); }}>🎥 Start Teleconsult</button>
            </div>
          </div>
        </div>
      )}

      {/* Consult Modal */}
      {consultModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && endCall()}>
          <div className="modal" style={{ maxWidth: 680 }}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Teleconsult — {consultModal.visit?.patient?.full_name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Dr. Meera Joshi · Daily.co WebRTC</div>
              </div>
              <div className="close-btn" onClick={endCall}>✕</div>
            </div>
            <div className="call-view">
              <div className="call-video-placeholder">
                <div className="call-avatar-lg">{getInitials(consultModal.visit?.patient?.full_name || 'RK')}</div>
                <div style={{ fontSize: 14, opacity: 0.7 }}>{consultModal.visit?.patient?.full_name} · {calling ? 'Live' : 'Connecting…'}</div>
                <div className="call-timer">{fmt(callSecs)}</div>
              </div>
            </div>
            <div className="call-controls">
              <button className="call-btn mute" title="Mute">🎙</button>
              <button className="call-btn video" title="Camera">📷</button>
              <button className="call-btn end" onClick={endCall} title="End call">📵</button>
            </div>
            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-header"><div className="card-title">Quick Prescription</div></div>
              <div>
                {rxItems.map((item, i) => (
                  <div key={i} className="rx-item">
                    <div><div className="rx-name">{item.name}</div><div className="rx-dose">{item.dose}</div></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="rx-dur">{item.dur}</div>
                      <button onClick={() => setRxItems(r => r.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <input className="form-input" placeholder="Add medicine name…" value={rxInput} onChange={e => setRxInput(e.target.value)} style={{ flex: 1 }} onKeyDown={e => e.key === 'Enter' && addRx()} />
                <button className="btn btn-outline btn-sm" onClick={addRx}>+ Add</button>
              </div>
              <div style={{ marginTop: 12 }}>
                <textarea className="form-input" rows={2} placeholder="Doctor's notes / advice…"></textarea>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button className="btn btn-success" style={{ flex: 1, justifyContent: 'center' }} onClick={submit}>✅ Submit & Send via WhatsApp</button>
                <button className="btn btn-outline btn-sm" onClick={() => { endCall(); setReferralModal(true); }}>🏥 Refer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Referral Modal */}
      {referralModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setReferralModal(false)}>
          <div className="modal" style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <div className="modal-title">Generate Referral</div>
              <div className="close-btn" onClick={() => setReferralModal(false)}>✕</div>
            </div>
            <div className="form-group">
              <label className="form-label">Refer to Facility</label>
              <select className="form-input form-select">
                <option>Nadiad Civil Hospital</option>
                <option>Anand District Hospital</option>
                <option>Ahmedabad Medical College</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Specialist Required</label>
              <select className="form-input form-select">
                <option>Cardiology</option><option>Pulmonology</option><option>General Surgery</option><option>Orthopaedics</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Reason for Referral</label>
              <textarea className="form-input" rows={3} placeholder="Clinical justification…"></textarea>
            </div>
            <div className="alert-banner alert-info"><span>ℹ</span><span>Referral PDF will include triage data, vitals, SOAP brief and current medications.</span></div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setReferralModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { toast('Referral PDF generated ✓', 'success'); setReferralModal(false); }}>Generate PDF →</button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : t.type === 'warn' ? '⚠️' : 'ℹ️'}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
