'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const roles = [
  { key: 'coordinator', label: '🏥 Coordinator', name: 'Sunita Chaudhary', role: 'Clinic Coordinator', href: '/coordinator', color: '#1a6cf0' },
  { key: 'doctor', label: '🩺 Doctor', name: 'Dr. Meera Joshi', role: 'General Medicine', href: '/doctor', color: '#06c17a' },
  { key: 'asha', label: '👩‍⚕️ ASHA Worker', name: 'Priya Asha', role: 'ASHA Worker · Nadiad', href: '/triage', color: '#f59e0b' },
  { key: 'patient', label: '👤 Patient', name: 'Ramesh Kumar', role: 'Patient', href: '/queue', color: '#8b5cf6' },
  { key: 'admin', label: '⚙️ Admin', name: 'Admin', role: 'System Admin', href: '/admin', color: '#64748b' },
];

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>
      <div style={{ width: '100%', maxWidth: 440, padding: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: 'var(--brand)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px' }}>⚕</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 800 }}>ArogyaConnect</div>
          <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>Rural Teleconsultation System</div>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 20 }}>Sign In</div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }} onClick={() => router.push('/coordinator')}>
            Send OTP →
          </button>

          <div style={{ margin: '20px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>— or demo as —</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {roles.map(r => (
              <button key={r.key} className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }} onClick={() => router.push(r.href)}>
                <span>{r.label}</span>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)' }}>{r.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--muted)' }}>
          DPDPA Compliant · Data stored in AWS ap-south-1 Mumbai
        </div>
      </div>
    </div>
  );
}
