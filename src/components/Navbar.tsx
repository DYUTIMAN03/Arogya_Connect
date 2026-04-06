'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navLinks = [
  { href: '/register', label: 'Register', icon: '👤' },
  { href: '/queue', label: 'Queue', icon: '📋', badge: true },
  { href: '/doctor', label: 'Doctor', icon: '🩺' },
  { href: '/teleconsult', label: 'Teleconsult', icon: '📹' },
  { href: '/rxpad', label: 'Rx Pad', icon: '💊' },
  { href: '/coordinator', label: 'Coordinator', icon: '🏥' },
  { href: '/admin', label: 'Admin', icon: '⚙️' },
  { href: '/analytics', label: 'Analytics', icon: '📊' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [queueCount, setQueueCount] = useState(3);
  const toastRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string, type = '') => {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    const icons: Record<string, string> = { success: '✅', warn: '⚠️', error: '❌', '': 'ℹ️' };
    el.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
    const container = document.getElementById('toastContainer');
    if (!container) return;
    container.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; el.style.transition = '.3s'; setTimeout(() => el.remove(), 300); }, 3500);
  };

  useEffect(() => {
    setTimeout(() => showToast('🔴 Live: Supabase Realtime connected · Nadiad PHC'), 800);
    setTimeout(() => showToast('🚨 P1 Alert: Ramesh Kumar — chest pain', 'error'), 2500);
  }, []);

  return (
    <>
      <header className="header-nav">
        <div className="nav-left">
          <Link href="/" className="logo-box">
            <div className="logo-icon">⚕</div>
            <div>
              <div className="logo-name">ArogyaConnect</div>
            </div>
          </Link>
          <nav className="nav">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-item ${pathname === link.href || pathname.startsWith(link.href + '/') ? 'active' : ''}`}
              >
                {link.icon} {link.label}
                {link.badge && queueCount > 0 && (
                  <span className="nav-badge">{queueCount}</span>
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="nav-right">
          <div style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 12, fontWeight: 700, cursor: 'pointer', background: 'var(--brand)', color: '#fff' }}>EN</div>
          <div className="notif-btn" onClick={() => router.push('/coordinator')}>
            🔔
            <div className="notif-dot"></div>
          </div>
          <div className="user-pill" onClick={() => router.push('/admin')}>
            <div className="avatar" style={{ background: 'linear-gradient(135deg,#1a6cf0,#06c17a)' }}>SC</div>
            <div className="user-info">
              <span className="user-name">Sunita Chaudhary</span>
              <span className="user-role">Clinic Coordinator</span>
            </div>
          </div>
        </div>
      </header>
      <div id="toastContainer" className="toast-container" ref={toastRef}></div>
    </>
  );
}
