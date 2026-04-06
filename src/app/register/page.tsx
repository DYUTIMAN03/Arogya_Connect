'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

const steps = [
  { num: 1, title: 'Details' },
  { num: 2, title: 'OTP' },
  { num: 3, title: 'Triage' },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Female');
  const [village, setVillage] = useState('');
  const [abha, setAbha] = useState('');
  const [conditions, setConditions] = useState('');
  const [consent, setConsent] = useState(false);
  const [otp, setOtp] = useState('');
  const [toasts, setToasts] = useState<{id:number,msg:string,type:string}[]>([]);
  let tid = 0;

  const toast = (msg: string, type = '') => {
    const id = ++tid;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  const sendOTP = async () => {
    if (!consent) { toast('Please confirm patient consent', 'error'); return; }
    if (!name || !phone) { toast('Name and phone are required', 'error'); return; }
    toast(`OTP sent to ${phone} via MSG91`, 'success');
    setStep(2);
  };

  const verifyOTP = () => {
    if (!otp) { toast('Enter the OTP', 'error'); return; }
    toast('OTP verified ✓', 'success');
    setStep(3);
  };

  const finish = () => {
    toast('Patient registered successfully! Redirecting to Triage…', 'success');
    setTimeout(() => window.location.href = '/triage', 1500);
  };

  return (
    <div className="app">
      <Navbar />
      <div className="content fade-in" style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 700 }}>Register New Patient</div>
          <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>Complete all steps to register the patient and run AI triage.</div>
        </div>

        {/* Progress Steps */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="progress-steps">
            {steps.map(s => (
              <div key={s.num} className={`step ${step > s.num ? 'done' : step === s.num ? 'active' : ''}`}>
                <div className="step-circle">{step > s.num ? '✓' : s.num}</div>
                <div className="step-label">{s.title}</div>
              </div>
            ))}
          </div>

          {/* Step 1 — Patient Details */}
          {step === 1 && (
            <div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name <span>*</span></label>
                  <input className="form-input" placeholder="Patient full name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone <span>*</span></label>
                  <input className="form-input" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input className="form-input" type="date" value={dob} onChange={e => setDob(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select className="form-input form-select" value={gender} onChange={e => setGender(e.target.value)}>
                    <option>Female</option><option>Male</option><option>Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Village / Town</label>
                <input className="form-input" placeholder="e.g. Nadiad, Kheda" value={village} onChange={e => setVillage(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">ABHA ID (optional)</label>
                <input className="form-input" placeholder="e.g. 12-3456-7890-1234" value={abha} onChange={e => setAbha(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Known Conditions</label>
                <input className="form-input" placeholder="Diabetes, Hypertension…" value={conditions} onChange={e => setConditions(e.target.value)} />
              </div>
              <div style={{ padding: 12, background: 'var(--brand-light)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--brand)', marginBottom: 16 }}>
                <strong>DPDPA Consent:</strong> Patient data is stored securely in Mumbai (AWS ap-south-1) and used only for care coordination. Patient may request deletion at any time.
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
                  I confirm patient has given verbal consent
                </label>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={sendOTP}>Send OTP →</button>
            </div>
          )}

          {/* Step 2 — OTP */}
          {step === 2 && (
            <div>
              <div className="alert-banner alert-info" style={{ marginBottom: 20 }}>
                <span>📱</span><span>OTP sent to <strong>{phone}</strong> via MSG91 WhatsApp & SMS</span>
              </div>
              <div className="form-group">
                <label className="form-label">Enter OTP <span>*</span></label>
                <input className="form-input" placeholder="Enter 6-digit OTP" value={otp} onChange={e => setOtp(e.target.value)} style={{ fontSize: 20, letterSpacing: 8, textAlign: 'center' }} maxLength={6} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={verifyOTP}>Verify OTP →</button>
              </div>
              <div style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: 'var(--muted)' }}>
                Didn't receive it? <span style={{ color: 'var(--brand)', cursor: 'pointer' }} onClick={() => toast('OTP resent ✓', 'success')}>Resend OTP</span>
              </div>
            </div>
          )}

          {/* Step 3 — Done */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Registration Complete!</div>
              <div style={{ color: 'var(--muted)', marginBottom: 24, fontSize: 14 }}>{name} has been registered successfully. Proceed to run the AI Triage assessment.</div>
              <div style={{ background: 'var(--accent-light)', borderRadius: 10, padding: 16, marginBottom: 20, textAlign: 'left' }}>
                <div style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>✅ Patient Summary</div>
                <div style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--text)' }}>
                  <div><strong>Name:</strong> {name}</div>
                  <div><strong>Phone:</strong> {phone}</div>
                  {village && <div><strong>Village:</strong> {village}</div>}
                  {conditions && <div><strong>Conditions:</strong> {conditions}</div>}
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 15 }} onClick={finish}>
                🧠 Run AI Triage →
              </button>
            </div>
          )}
        </div>
      </div>

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
