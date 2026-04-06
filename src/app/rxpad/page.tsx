'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

const rxTemplates = [
  { name: 'Aspirin 325mg', dose: '1 tablet — once daily after food', dur: '7 days' },
  { name: 'Atorvastatin 40mg', dose: '1 tablet — at bedtime', dur: '30 days' },
  { name: 'Amlodipine 5mg', dose: '1 tablet — once daily morning', dur: '30 days' },
  { name: 'Metformin 500mg', dose: '1 tablet — twice daily after meals', dur: '30 days' },
  { name: 'Paracetamol 650mg', dose: '1 tablet — thrice daily after food', dur: '5 days' },
  { name: 'Amoxicillin 500mg', dose: '1 capsule — thrice daily', dur: '7 days' },
];

export default function RxPadPage() {
  const [rxItems, setRxItems] = useState([rxTemplates[0], rxTemplates[1]]);
  const [rxInput, setRxInput] = useState('');
  const [notes, setNotes] = useState('');
  const [patient, setPatient] = useState('Savitaben Patel');
  const [toasts, setToasts] = useState<{id:number,msg:string,type:string}[]>([]);
  let tid = 0;
  const toast = (msg: string, type = '') => {
    const id = ++tid;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  const addRx = (item?: typeof rxTemplates[0]) => {
    const name = item ? item.name : rxInput.trim();
    if (!name) return;
    setRxItems(r => [...r, item || { name, dose: '1 tablet — as prescribed', dur: '5 days' }]);
    setRxInput('');
    toast(`${name} added to prescription`);
  };

  const submit = () => {
    toast('📲 Prescription PDF sent via WhatsApp', 'success');
    setTimeout(() => toast('📱 24hr check-in scheduled for tomorrow'), 800);
  };

  return (
    <div className="app">
      <Navbar />
      <div className="content fade-in">
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 700 }}>Rx Pad</div>
          <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>Digital prescription with WhatsApp delivery and PDF generation.</div>
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          {/* Prescription Builder */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">📋 Prescription Builder</div>
              <span className="badge badge-blue">Dr. Meera Joshi</span>
            </div>

            <div className="form-group">
              <label className="form-label">Patient</label>
              <select className="form-input form-select" value={patient} onChange={e => setPatient(e.target.value)}>
                <option>Savitaben Patel</option>
                <option>Ramesh Kumar</option>
                <option>Arjun Khanna</option>
                <option>Lata Modi</option>
              </select>
            </div>

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
              <button className="btn btn-outline btn-sm" onClick={() => addRx()}>+ Add</button>
            </div>

            <div style={{ marginTop: 12 }}>
              <label className="form-label">Doctor's Notes</label>
              <textarea className="form-input" rows={3} placeholder="Advice, dietary instructions, follow-up plan…" value={notes} onChange={e => setNotes(e.target.value)}></textarea>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button className="btn btn-success" style={{ flex: 1, justifyContent: 'center' }} onClick={submit}>✅ Submit & Send via WhatsApp</button>
              <button className="btn btn-outline btn-sm" onClick={() => toast('PDF generated ✓', 'success')}>📄 PDF</button>
            </div>
          </div>

          {/* Quick Templates */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card">
              <div className="card-header"><div className="card-title">⚡ Common Medications</div></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rxTemplates.map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{t.dose}</div>
                    </div>
                    <button className="action-btn" onClick={() => addRx(t)}>+ Add</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="card">
              <div className="card-header"><div className="card-title">📄 Prescription Preview</div></div>
              <div style={{ padding: 16, background: 'var(--bg)', borderRadius: 10, border: '1px solid var(--border)', fontSize: 13, lineHeight: 1.8 }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>ArogyaConnect PHC</div>
                <div style={{ color: 'var(--muted)', marginBottom: 12, fontSize: 12 }}>Dr. Meera Joshi · General Medicine<br />Date: {new Date().toLocaleDateString('en-IN')}</div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Patient: {patient}</div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                  {rxItems.map((r, i) => (
                    <div key={i} style={{ marginBottom: 6 }}>
                      <strong>Rx {i + 1}:</strong> {r.name}<br />
                      <span style={{ color: 'var(--muted)', fontSize: 12 }}>{r.dose} · {r.dur}</span>
                    </div>
                  ))}
                </div>
                {notes && <div style={{ marginTop: 10, borderTop: '1px solid var(--border)', paddingTop: 8, color: 'var(--muted)', fontSize: 12 }}><strong>Notes:</strong> {notes}</div>}
              </div>
            </div>
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
