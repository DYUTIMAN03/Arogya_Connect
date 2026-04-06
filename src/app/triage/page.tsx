'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

const symptoms = ['Chest Pain', 'Fever', 'Breathlessness', 'Headache', 'Vomiting', 'Weakness', 'Dizziness', 'Abdominal Pain', 'Cough', 'Rash'];
const langs = ['हिन्दी', 'English', 'ગુજરાતી', 'मराठी', 'தமிழ்'];

const triageProfiles = [
  { p: 'P1', label: 'Immediate — Potential life-threatening', cls: 'triage-p1', color: '#ef4444', conf: 0.91, reasoning: 'Hard override triggered: chest pain keyword detected. Rule chest pain = P1 executed before LLM call. SpO2 94% adds additional urgency.', flags: ['Chest Pain', 'Low SpO2 94%', 'Hard Override', 'Age > 60'] },
  { p: 'P2', label: 'Moderate Urgency — Attention within 30–60 min', cls: 'triage-p2', color: '#f59e0b', conf: 0.82, reasoning: 'Breathlessness without fever or acute chest pain. Moderate urgency. Hypertension in known conditions adds risk.', flags: ['Breathlessness', 'Hypertension', 'No Fever'] },
  { p: 'P3', label: 'Low Urgency — Stable, can wait', cls: 'triage-p3', color: '#06c17a', conf: 0.88, reasoning: 'Mild, self-limiting presentation. Low severity self-rating. Vitals within normal range. No red flags detected.', flags: ['Mild Symptoms', 'Normal Vitals', 'Low Severity'] },
];

export default function TriagePage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedLang, setSelectedLang] = useState('हिन्दी');
  const [complaint, setComplaint] = useState('');
  const [severity, setSeverity] = useState(5);
  const [bp, setBp] = useState('');
  const [temp, setTemp] = useState('');
  const [spo2, setSpo2] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState<typeof triageProfiles[0] | null>(null);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<{id:number,msg:string,type:string}[]>([]);
  let tid = 0;

  const toast = (msg: string, type = '') => {
    const id = ++tid;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(t => t.includes(tag) ? t.filter(x => x !== tag) : [...t, tag]);
  };

  const toggleVoice = () => {
    if (recording) { setRecording(false); return; }
    setRecording(true);
    toast('🎙 Recording… speak in selected language');
    setTimeout(() => {
      setRecording(false);
      setComplaint('सीने में दर्द है और सांस लेने में तकलीफ हो रही है (Chest pain and difficulty breathing)');
      setSelectedTags(t => [...new Set([...t, 'Chest Pain', 'Breathlessness'])]);
      toast('✓ Whisper transcription complete', 'success');
    }, 3000);
  };

  const runTriage = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));

    const hasChestPain = complaint.toLowerCase().includes('chest') || complaint.includes('सीने') || selectedTags.includes('Chest Pain');
    const spo2Num = parseInt(spo2);
    let idx = 2;
    if (hasChestPain || (!isNaN(spo2Num) && spo2Num < 90)) idx = 0;
    else if (severity >= 6 || selectedTags.includes('Breathlessness') || selectedTags.includes('Fever')) idx = 1;

    setResult(triageProfiles[idx]);
    setLoading(false);
    toast(`Triage complete — ${triageProfiles[idx].p} assigned`, idx === 0 ? 'error' : idx === 1 ? 'warn' : 'success');
  };

  const addToQueue = () => toast('Patient added to queue ✓', 'success');

  return (
    <div className="app">
      <Navbar />
      <div className="content fade-in">
        <div className="grid-2" style={{ alignItems: 'start' }}>
          {/* Triage Form */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">New Triage Assessment</div>
                <div className="card-sub">AI-assisted priority classification</div>
              </div>
            </div>

            {/* Review Warning */}
            <div className="alert-banner alert-warn">
              <span>⚠</span>
              <span><strong>Review Required:</strong> Mohan Tiwari's triage confidence is 0.64. Coordinator review needed.</span>
              <button className="btn btn-sm btn-outline" style={{ marginLeft: 'auto', fontSize: 11 }}>Review</button>
            </div>

            {/* Language */}
            <div className="form-group">
              <div className="form-label">Language <span>*</span></div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {langs.map(l => (
                  <span key={l} className={`lang-chip ${selectedLang === l ? 'sel' : ''}`} onClick={() => { setSelectedLang(l); toast(`Language set to ${l}`); }}>{l}</span>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Patient Age <span>*</span></label>
                <input className="form-input" type="number" placeholder="e.g. 54" value={age} onChange={e => setAge(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Gender <span>*</span></label>
                <select className="form-input form-select" value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="">Select</option>
                  <option>Female</option><option>Male</option><option>Other</option>
                </select>
              </div>
            </div>

            {/* Chief Complaint */}
            <div className="form-group">
              <label className="form-label">Chief Complaint <span>*</span></label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <textarea className="form-input" rows={2} placeholder="Describe symptoms in patient's own words…" value={complaint} onChange={e => setComplaint(e.target.value)} style={{ flex: 1, resize: 'vertical' }} />
                <button className={`voice-btn ${recording ? 'recording' : ''}`} onClick={toggleVoice} title="Voice input">{recording ? '⏹' : '🎙'}</button>
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>🎙 Tap mic to speak in selected language (Whisper API)</div>
            </div>

            {/* Symptom Tags */}
            <div className="form-group">
              <div className="form-label">Common Symptoms (tap to select)</div>
              <div className="symptom-tags">
                {symptoms.map(s => (
                  <span key={s} className={`symptom-tag ${selectedTags.includes(s) ? 'selected' : ''}`} onClick={() => toggleTag(s)}>{s}</span>
                ))}
              </div>
            </div>

            {/* Severity Slider */}
            <div className="form-group">
              <div className="form-label">Self-rated Severity (1 = mild, 10 = severe)</div>
              <input type="range" min={1} max={10} value={severity} onChange={e => setSeverity(+e.target.value)} className="form-input" style={{ padding: '8px 0' }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand)' }}>Severity: {severity}/10</div>
            </div>

            {/* Vitals */}
            <div className="form-group">
              <div className="form-label">Vitals (from PHC equipment)</div>
              <div className="form-row-3">
                <div>
                  <label className="form-label" style={{ fontWeight: 400, fontSize: 12 }}>BP (mmHg)</label>
                  <input className="form-input" placeholder="120/80" value={bp} onChange={e => setBp(e.target.value)} />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 400, fontSize: 12 }}>Temp (°F)</label>
                  <input className="form-input" placeholder="98.6" value={temp} onChange={e => setTemp(e.target.value)} />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 400, fontSize: 12 }}>SpO2 (%)</label>
                  <input className="form-input" placeholder="98" value={spo2} onChange={e => setSpo2(e.target.value)} />
                </div>
              </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} onClick={runTriage} disabled={loading}>
              {loading ? '⏳ Running AI Triage…' : '🧠 Run AI Triage'}
            </button>
          </div>

          {/* Right Panel */}
          <div>
            {/* Result */}
            {result && (
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-header">
                  <div className="card-title">Triage Result</div>
                  <span className="badge badge-blue">AI Assessment</span>
                </div>
                <div className={`triage-result ${result.cls}`}>
                  <div className="triage-header">
                    <div>
                      <div className="triage-level" style={{ color: result.color }}>{result.p}</div>
                      <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>{result.label}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>Confidence</div>
                      <div style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 700, color: result.color }}>{result.conf.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: `${result.conf * 100}%`, background: result.color }}></div>
                  </div>
                  <div className="triage-reasoning">{result.reasoning}</div>
                  <div className="triage-flags">
                    {result.flags.map(f => <span key={f} className="flag">{f}</span>)}
                    {result.p === 'P1' && <span className="flag" style={{ background: '#fef2f2', color: 'var(--p1)', fontWeight: 700 }}>🚨 Hard Override — P1</span>}
                    {result.conf < 0.70 && <span className="flag" style={{ background: '#fffbeb', color: 'var(--warn)' }}>⚠ Low Confidence</span>}
                  </div>
                </div>
                <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
                  <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={addToQueue}>➕ Add to Queue</button>
                  <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => toast('Priority override panel opened')}>Override Priority</button>
                </div>
              </div>
            )}

            {/* Hard Override Rules */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">⚠ Hard Override Rules</div>
                <span className="badge" style={{ background: '#fef2f2', color: 'var(--danger)' }}>Always P1</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: 'var(--p1-bg)', borderRadius: 8, fontSize: 13 }}><span>🫀</span><span>Chest pain → <strong>P1</strong> (no model override)</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: 'var(--p1-bg)', borderRadius: 8, fontSize: 13 }}><span>🩸</span><span>SpO2 &lt; 90% → <strong>P1</strong></span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: 'var(--p1-bg)', borderRadius: 8, fontSize: 13 }}><span>🤰</span><span>Active bleeding / obstetric emergency → <strong>P1</strong></span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: 'var(--p2-bg)', borderRadius: 8, fontSize: 13 }}><span>🧠</span><span>Confidence &lt; 70% → auto-escalate to <strong>P2</strong></span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : t.type === 'warn' ? '⚠️' : 'ℹ️'}</span><span>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
