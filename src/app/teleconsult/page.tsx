'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';

const soapData = {
  name: 'Ramesh Kumar',
  age: 58,
  priority: 'P1',
  clinic: 'Sundarpur PHC via PHC Tablet — WebRTC',
  subjective: 'Chest pain with breathlessness since 2 hours',
  objective: 'Temp: 98.6°F, HR: 110bpm, BP: 160/95, SpO2: 91%',
  assessment: 'Chest Pain, Difficulty Breathing',
  plan: 'To be filled during consultation...',
  flags: ['Chest Pain', 'SpO2 91%', 'Hard Override P1'],
};

const initialMessages = [
  { type: 'system', text: 'Patient connected via PHC tablet — Sundarpur clinic', time: '10:02 AM' },
  { type: 'patient', text: 'Doctor sahab, chest mein bahut dard ho raha hai', time: '10:03 AM' },
  { type: 'doctor', text: 'Since when are you experiencing this pain?', time: '10:03 AM' },
  { type: 'patient', text: 'Subah se hai, saans lene mein bhi takleef hai', time: '10:04 AM' },
  { type: 'doctor', text: 'I see. Has the pain spread to your arm or jaw?', time: '10:04 AM' },
];

export default function TeleconsultPage() {
  const [callSecs, setCallSecs] = useState(272);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState<'soap' | 'chat'>('soap');

  useEffect(() => {
    const iv = setInterval(() => setCallSecs(s => s + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  const fmt = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  const sendMsg = () => {
    if (!chatInput.trim()) return;
    setMessages(m => [...m, { type: 'doctor', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setChatInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Navbar />
      <div className="teleconsult-layout" style={{ flex: 1, overflow: 'hidden' }}>

        {/* Video Area */}
        <div className="video-area">
          <div className="video-main">
            {/* Patient label */}
            <div className="video-patient-label" style={{ background: 'rgba(239,68,68,0.8)' }}>
              <span style={{ fontSize: 10, fontWeight: 700 }}>● CRITICAL</span>
              <span>Ramesh Kumar • {soapData.age}y</span>
            </div>

            {/* Main video placeholder */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, color: '#fff' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.2)' }}>
                <svg viewBox="0 0 24 24" width={40} height={40} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700 }}>Patient: Ramesh Kumar</div>
                <div style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>{soapData.clinic}</div>
                <div style={{ fontSize: 13, color: '#06c17a', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginTop: 8 }}>
                  <span className="live-dot"></span> Live — {fmt(callSecs)}
                </div>
              </div>
            </div>

            {/* PIP — Doctor camera */}
            <div className="video-pip">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)' }}>
                <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <span style={{ fontSize: 11 }}>You</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="video-controls">
            <button className={`video-ctrl-btn ${muted ? 'vcb-end' : 'vcb-default'}`} onClick={() => setMuted(m => !m)} title={muted ? 'Unmute' : 'Mute'}>
              {muted ? '🔇' : '🎙'}
            </button>
            <button className={`video-ctrl-btn ${camOff ? 'vcb-end' : 'vcb-default'}`} onClick={() => setCamOff(c => !c)} title="Camera">📷</button>
            <button className="video-ctrl-btn vcb-default" title="Share Screen">🖥</button>
            <button className="video-ctrl-btn vcb-default" title="Expand">⛶</button>
            <button className="video-ctrl-btn vcb-end" title="End Call" onClick={() => { if (confirm('End this consultation?')) window.location.href = '/queue'; }}>📵</button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
            <button onClick={() => setActiveTab('soap')} style={{ flex: 1, padding: '14px 0', fontSize: 13, fontWeight: activeTab === 'soap' ? 700 : 400, color: activeTab === 'soap' ? 'var(--brand)' : 'var(--muted)', background: 'none', border: 'none', borderBottom: activeTab === 'soap' ? '2px solid var(--brand)' : '2px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              📋 SOAP Brief
            </button>
            <button onClick={() => setActiveTab('chat')} style={{ flex: 1, padding: '14px 0', fontSize: 13, fontWeight: activeTab === 'chat' ? 700 : 400, color: activeTab === 'chat' ? 'var(--brand)' : 'var(--muted)', background: 'none', border: 'none', borderBottom: activeTab === 'chat' ? '2px solid var(--brand)' : '2px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              💬 Chat / Transcript
            </button>
          </div>

          {activeTab === 'soap' ? (
            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
              <div className="soap-section">
                <div className="soap-key">S (Subjective):</div>
                <div className="soap-val">{soapData.subjective}</div>
              </div>
              <div className="soap-divider"></div>
              <div className="soap-section">
                <div className="soap-key">O (Objective):</div>
                <div className="soap-val">{soapData.objective}</div>
              </div>
              <div className="soap-divider"></div>
              <div className="soap-section">
                <div className="soap-key">A (Assessment):</div>
                <div className="soap-val" style={{ color: 'var(--danger)', fontWeight: 600 }}>{soapData.assessment}</div>
              </div>
              <div className="soap-divider"></div>
              <div className="soap-section">
                <div className="soap-key">P (Plan):</div>
                <div className="soap-val" style={{ color: 'var(--muted)', fontStyle: 'italic' }}>{soapData.plan}</div>
              </div>
              <div className="soap-divider"></div>
              <div>
                <div className="soap-key">⚑ Flags</div>
                <div className="triage-flags" style={{ marginTop: 8 }}>
                  {soapData.flags.map(f => (
                    <span key={f} className="flag" style={f.includes('P1') ? { background: '#fef2f2', color: 'var(--danger)', fontWeight: 700 } : {}}>{f}</span>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 16, padding: 12, background: 'var(--p2-bg)', borderRadius: 8, border: '1px solid rgba(245,158,11,.2)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--warn)', marginBottom: 4 }}>⚠ AI Confidence: 91%</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>Hard override triggered. Chest pain = auto P1.</div>
              </div>
            </div>
          ) : (
            <>
              <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {messages.map((m, i) => (
                  <div key={i}>
                    {m.type === 'system' ? (
                      <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', background: '#f3f4f6', padding: '4px 12px', borderRadius: 6 }}>{m.text}<div style={{ marginTop: 2, fontSize: 10 }}>{m.time}</div></div>
                    ) : (
                      <div style={{ alignSelf: m.type === 'doctor' ? 'flex-end' : 'flex-start', display: 'flex', flexDirection: 'column', maxWidth: '85%' }}>
                        {m.type === 'patient' && <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 2 }}><strong>Patient:</strong> {m.text}</div>}
                        {m.type === 'doctor' && <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}><strong style={{ color: 'var(--brand)' }}>Doctor:</strong> {m.text}</div>}
                        <div style={{ fontSize: 10, color: 'var(--muted)', textAlign: m.type === 'doctor' ? 'right' : 'left' }}>{m.time}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="chat-input-row">
                <input className="chat-input" placeholder="Type a message…" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMsg()} />
                <button className="chat-send" onClick={sendMsg}>Send</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
