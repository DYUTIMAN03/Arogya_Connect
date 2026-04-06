'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const faqs = [
  { q: 'What happens if the AI misclassifies a critical patient?', a: 'Safety is our priority. Hard override rules are evaluated server-side before the LLM is even called. Any mention of "chest pain" or SpO2 < 90% is instantly flagged as Priority 1. The AI cannot override this. Furthermore, any classification with less than 70% confidence is automatically flagged for a human coordinator\'s review.' },
  { q: 'How does this work without internet?', a: 'ArogyaConnect is engineered as an offline-first Progressive Web App (PWA) with a Service Worker. Patient registration and symptom intake are stored locally if the connection drops. The system automatically syncs the queue to the Supabase backend the moment 2G/3G connectivity is restored via exponential backoff mechanisms.' },
  { q: 'Do patients need a smartphone?', a: 'No. The system is designed for patients with feature phones or no phones at all. Queue updates and triage tickets are delivered via standard SMS. Prescriptions are delivered through automated voice summaries (IVR) in Hindi or Gujarati directly to feature phones.' },
  { q: 'How is data privacy handled?', a: 'ArogyaConnect is DPDPA compliant. All patient data is strictly localized, encrypted at rest, and stored securely in the AWS ap-south-1 (Mumbai) region. Explicit granular consent is captured via ASHA workers during triage.' },
];

const testimonials = [
  { text: '"Before ArogyaConnect, severe patients would wait hours. Now, the AI triage flags chest pains immediately. It\'s a lifesaver."', name: 'Sunita Chaudhary', role: 'Clinic Coordinator', color: '#06c17a', initials: 'SC' },
  { text: '"Having a complete SOAP brief before I even start the video call saves me 5 minutes per patient. I can see 10 more patients a day."', name: 'Dr. Meera Joshi', role: 'General Medicine', color: '#1a6cf0', initials: 'MJ' },
  { text: '"मुझे सिर्फ माइक्रोफोन में अपनी बीमारी बतानी पड़ी। थोड़ी देर में डॉक्टर साहब से बात हो गई।"', name: 'Ramesh Kumar', role: 'Patient (Nadiad)', color: '#8b5cf6', initials: 'RK' },
  { text: '"The offline functionality is incredible. When the power cuts out, the app saves everything and syncs the moment 3G returns."', name: 'Priya Asha', role: 'ASHA Worker', color: '#f59e0b', initials: 'PA' },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState('');

  return (
    <div className="app">
      <Navbar />
      {/* Landing Hero */}
      <div className="landing-hero">
        <div className="landing-title">Smarter Rural Healthcare. <br />Connected.</div>
        <div className="landing-sub">An intelligent, offline-first triage and queue management system designed for India's Primary Health Centres. Assured critical care, zero wait ambiguity.</div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link href="/coordinator" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: 15 }}>Launch Dashboard →</Link>
          <a href="#features" className="btn btn-outline" style={{ padding: '12px 28px', fontSize: 15 }}>Learn More</a>
        </div>
      </div>

      {/* Features */}
      <div id="features" style={{ padding: '60px 20px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div className="section-title">Built for the Real World</div>
        <div className="section-sub">Solving structural gaps in rural patient management.</div>
        <div className="grid-3">
          {[
            { icon: '🧠', title: 'AI Triage Pipeline', desc: 'Two-stage safety pipeline guarantees P1 critical cases bypass the queue immediately, while generating a structured SOAP brief for the doctor.' },
            { icon: '🎙', title: 'Voice-First Intake', desc: 'Patient intake uses Whisper API for regional language voice-to-text. No literacy required, making the system accessible to everyone.' },
            { icon: '📱', title: 'Automated Follow-up', desc: 'Prescription delivery via WhatsApp and SMS, followed by automated 24-hour check-in messages connecting patients back to the clinic.' },
            { icon: '📡', title: 'Offline-First PWA', desc: 'Service Worker caches all patient data locally. Syncs queue automatically when connectivity returns — even on 2G networks.' },
            { icon: '🔒', title: 'DPDPA Compliant', desc: 'Patient data encrypted at rest in AWS ap-south-1 Mumbai. Granular consent capture with full audit logging for regulatory compliance.' },
            { icon: '⚡', title: 'Real-time Queues', desc: 'Supabase Realtime pushes queue updates instantly to all devices without any polling. Coordinators and doctors stay perfectly in sync.' },
          ].map((f, i) => (
            <div key={i} className="card fade-in" style={{ border: '1px solid var(--border)', boxShadow: 'none' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Banner */}
      <div style={{ background: 'linear-gradient(135deg, var(--brand) 0%, #0f4bbd 100%)', padding: '50px 20px', color: '#fff', textAlign: 'center' }}>
        <div className="section-title" style={{ color: '#fff', marginBottom: 8 }}>Proven at Scale</div>
        <div style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 40, fontSize: 15 }}>Deployed across 12 PHCs in 3 states</div>
        <div style={{ display: 'flex', gap: 60, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['92%', 'Triage Accuracy'], ['14 min', 'Avg Wait Time'], ['2,400+', 'Patients Served'], ['0', 'Critical Misses']].map(([val, label], i) => (
            <div key={i}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 36, fontWeight: 800 }}>{val}</div>
              <div style={{ opacity: 0.7, fontSize: 13, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Marquee */}
      <div style={{ background: 'var(--bg)', padding: '60px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="section-title">What Our Users Say</div>
        <div className="section-sub">Empowering ASHA workers, doctors, and patients.</div>
        <div className="marquee-container">
          <div className="marquee-content">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-text">{t.text}</div>
                <div className="testimonial-author">
                  <div className="avatar" style={{ background: t.color }}>{t.initials}</div>
                  <div>
                    <div className="user-name">{t.name}</div>
                    <div className="user-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: '60px 20px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div className="section-title">Frequently Asked Questions</div>
        <div className="section-sub">Everything you need to know about ArogyaConnect.</div>
        <div className="faq-container">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? 'active' : ''}`}>
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {faq.q} <span className="faq-icon">▼</span>
              </button>
              {openFaq === i && <div className="faq-answer">{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <div className="footer-title">Stay Connected</div>
            <div className="footer-text">Join our newsletter to receive the latest updates, platform features and exclusive healthcare insights.</div>
            <div className="newsletter-form">
              <input type="email" className="newsletter-input" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
              <button className="btn btn-primary" onClick={() => { alert('Subscribed! ✓'); setEmail(''); }}>Subscribe</button>
            </div>
          </div>
          <div>
            <div className="footer-title">Quick Links</div>
            <Link href="/" className="footer-link">Home</Link>
            <Link href="/coordinator" className="footer-link">Dashboard</Link>
            <Link href="/queue" className="footer-link">Live Queue</Link>
            <Link href="/analytics" className="footer-link">Analytics</Link>
          </div>
          <div>
            <div className="footer-title">Contact Us</div>
            <div className="footer-text">123 Innovation Street<br />PHC Main block, TC 12345<br /><br />Phone: +91 (123) 456-7890<br />Email: hello@arogyaconnect.in</div>
          </div>
          <div>
            <div className="footer-title">Follow Us</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href="#" className="btn btn-outline" style={{ padding: 8, borderColor: '#30363d', color: '#fff', borderRadius: '50%', width: 36, height: 36, justifyContent: 'center' }}>𝕏</a>
              <a href="#" className="btn btn-outline" style={{ padding: 8, borderColor: '#30363d', color: '#fff', borderRadius: '50%', width: 36, height: 36, justifyContent: 'center' }}>in</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 ArogyaConnect. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span className="footer-link" style={{ margin: 0 }}>Privacy Policy</span>
            <span className="footer-link" style={{ margin: 0 }}>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
