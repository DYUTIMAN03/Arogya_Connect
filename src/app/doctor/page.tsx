'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

const patients = [
  { id: '1', name: 'Ramesh Kumar', age: 62, gender: 'M', village: 'Nadiad', priority: 'P1', conf: 0.91, wait: 22, status: 'waiting', complaint: 'Chest pain, breathlessness', vitals: 'BP 158/96 · SpO2 94%', soap: { s: 'Chest pain with breathlessness since 2 hours', o: 'BP 158/96, HR 110bpm, Temp 98.6°F, SpO2 94%', a: 'Possible ACS. Hard override P1 triggered. Urgent cardiology review needed.', p: 'ECG, troponin, refer cardiology. Aspirin 325mg stat.' } },
  { id: '2', name: 'Savitaben Patel', age: 54, gender: 'F', village: 'Anand', priority: 'P2', conf: 0.82, wait: 18, status: 'called', complaint: 'Breathlessness, no fever', vitals: 'BP 132/84 · SpO2 97%', soap: { s: 'Shortness of breath for 2 days, no fever. Fatigue on exertion.', o: 'BP 132/84, SpO2 97%, HR 86bpm, Temp 98.4°F', a: 'Breathlessness likely cardiac/respiratory. Known hypertension.', p: 'ECG, CBC, BMP. Review Amlodipine dose. Follow-up 3 days.' } },
  { id: '3', name: 'Arjun Khanna', age: 34, gender: 'M', village: 'Kheda', priority: 'P2', conf: 0.78, wait: 11, status: 'waiting', complaint: 'Fever 3 days, body ache', vitals: 'Temp 102.4°F · BP 120/78', soap: { s: 'Fever for 3 days, body ache, mild headache. No cough.', o: 'Temp 102.4°F, BP 120/78, HR 98bpm, SpO2 99%', a: 'Viral fever vs dengue. 3-day duration warrants NS1 antigen test.', p: 'CBC, NS1 antigen, dengue serology. Paracetamol 650mg SOS.' } },
  { id: '4', name: 'Lata Modi', age: 29, gender: 'F', village: 'Nadiad', priority: 'P3', conf: 0.94, wait: 7, status: 'waiting', complaint: 'Routine ANC check, 28 weeks', vitals: 'BP 118/76 · Normal', soap: { s: 'Routine antenatal check at 28 weeks. No complaints.', o: 'BP 118/76, weight 65kg (+2kg), FHR 144bpm', a: 'Normal ANC at 28 weeks. Iron deficiency possible.', p: 'CBC, urine routine, Iron + Folic acid supplements. Next visit 4 weeks.' } },
];

const initials = (n: string) => n.split(' ').map(x => x[0]).join('').slice(0, 2);
const avatarColors = ['linear-gradient(135deg,#ef4444,#f97316)', 'linear-gradient(135deg,#f59e0b,#eab308)', 'linear-gradient(135deg,#6366f1,#8b5cf6)', 'linear-gradient(135deg,#10b981,#059669)'];

export default function DoctorPage() {
  const [selected, setSelected] = useState<typeof patients[0] | null>(null);
  const [consultModal, setConsultModal] = useState(false);
  const [callSecs, setCallSecs] = useState(0);
  const [calling, setCalling] = useState(false);
  const [toasts, setToasts] = useState<{id:number,msg:string,type:string}[]>([]);
  let tid = 0;

  const toast = (msg: string, type = '') => {
    const id = ++tid;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  const startCall = (p: typeof patients[0]) => {
    setSelected(p);
    setConsultModal(true);
    setCallSecs(0);
    setCalling(true);
    const iv = setInterval(() => setCallSecs(s => s + 1), 1000);
    return () => clearInterval(iv);
  };

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="app">
      <Navbar />
      <div className="content fade-in">
        {/* Hero */}
        <div className="hero">
          <div className="hero-content">
            <div className="hero-title">Good morning, Dr. Meera 🌿<br />Nadiad PHC — Live</div>
            <div className="hero-sub">2 doctors on duty · {patients.length} patients waiting · Last sync 8s ago</div>
            <div className="hero-stats">
              <div className="hero-stat"><div className="hero-stat-val">92%</div><div className="hero-stat-label">Triage Accuracy</div></div>
              <div className="hero-stat"><div className="hero-stat-val">14m</div><div className="hero-stat-label">Avg Wait</div></div>
              <div className="hero-stat"><div className="hero-stat-val">28</div><div className="hero-stat-label">Consults Today</div></div>
            </div>
          </div>
          <div className="hero-art">🩺</div>
        </div>

        {/* P1 Alert */}
        <div className="alert-banner alert-danger">
          <span>🚨</span>
          <span><strong>P1 Alert:</strong> Ramesh Kumar (Q#1) flagged — chest pain. Requires immediate attention.</span>
          <button className="btn btn-sm btn-danger" style={{ marginLeft: 'auto' }} onClick={() => setSelected(patients[0])}>View Brief →</button>
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          {/* Patient List */}
          <div className="card">
            <div className="card-header">
              <div><div className="card-title">Waiting Patients</div><div className="card-sub">Sorted by priority · Live</div></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {patients.map((p, i) => (
                <div key={p.id} style={{ padding: '14px 0', borderBottom: i < patients.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, background: selected?.id === p.id ? 'var(--brand-light)' : 'transparent', borderRadius: selected?.id === p.id ? 8 : 0, paddingLeft: selected?.id === p.id ? 10 : 0 }} onClick={() => setSelected(p)}>
                  <div className="patient-avatar" style={{ background: avatarColors[i] }}>{initials(p.name)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="patient-name">{p.name}</span>
                      <span className={`priority-badge ${p.priority === 'P1' ? 'p1-badge' : p.priority === 'P2' ? 'p2-badge' : 'p3-badge'}`}>
                        <span className={p.priority === 'P1' ? 'p1-dot' : p.priority === 'P2' ? 'p2-dot' : 'p3-dot'}></span>
                        {p.priority}
                      </span>
                    </div>
                    <div className="patient-detail">{p.age} · {p.gender} · {p.complaint}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className={`wait-chip ${p.wait > 15 ? 'high' : ''}`}>⏱ {p.wait}m</div>
                    <div style={{ marginTop: 4 }}>
                      <span className={`status-chip ${p.status === 'called' ? 'status-called' : p.status === 'consult' ? 'status-consult' : 'status-waiting'}`}>
                        {p.status === 'called' ? 'Called' : p.status === 'consult' ? 'In Consult' : 'Waiting'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SOAP Brief Panel */}
          <div>
            {selected ? (
              <div className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title">{selected.name} — SOAP Brief</div>
                    <div className="card-sub">{selected.age} · {selected.gender} · {selected.village}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={`priority-badge ${selected.priority === 'P1' ? 'p1-badge' : selected.priority === 'P2' ? 'p2-badge' : 'p3-badge'}`}>
                      <span className={selected.priority === 'P1' ? 'p1-dot' : selected.priority === 'P2' ? 'p2-dot' : 'p3-dot'}></span>
                      {selected.priority}
                    </span>
                  </div>
                </div>

                <div className="vitals-grid" style={{ marginBottom: 16 }}>
                  <div className={`vital-box ${selected.vitals.includes('158') || selected.vitals.includes('132') ? 'alert' : ''}`}>
                    <div className="vital-val">{selected.vitals.split('·')[0]?.replace('BP ', '').trim()}</div>
                    <div className="vital-unit">mmHg</div><div className="vital-label">Blood Pressure</div>
                  </div>
                  <div className="vital-box"><div className="vital-val">98.6</div><div className="vital-unit">°F</div><div className="vital-label">Temperature</div></div>
                  <div className={`vital-box ${selected.priority === 'P1' ? 'alert' : ''}`}>
                    <div className="vital-val">{selected.vitals.includes('SpO2') ? selected.vitals.split('SpO2')[1]?.trim().replace('%', '') + '%' : '97%'}</div>
                    <div className="vital-unit">SpO2</div><div className="vital-label">Oxygen Sat.</div>
                  </div>
                  <div className="vital-box"><div className="vital-val">86</div><div className="vital-unit">bpm</div><div className="vital-label">Heart Rate</div></div>
                </div>

                <div className="soap-section"><div className="soap-key">S — Subjective</div><div className="soap-val">{selected.soap.s}</div></div>
                <div className="soap-divider"></div>
                <div className="soap-section"><div className="soap-key">O — Objective</div><div className="soap-val">{selected.soap.o}</div></div>
                <div className="soap-divider"></div>
                <div className="soap-section"><div className="soap-key">A — Assessment (AI)</div><div className="soap-val">{selected.soap.a}</div></div>
                <div className="soap-divider"></div>
                <div className="soap-section"><div className="soap-key">P — Plan Suggestions</div><div className="soap-val">{selected.soap.p}</div></div>

                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setSelected(null)}>✕ Close</button>
                  <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => window.location.href = '/teleconsult'}>🎥 Start Teleconsult</button>
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="empty-state">
                  <div className="es-icon">🩺</div>
                  <h3>Select a Patient</h3>
                  <p>Click on a patient from the waiting list to view their AI-generated SOAP brief and vitals.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
