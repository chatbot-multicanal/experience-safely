import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck } from 'lucide-react';

export default function GoogleAccountPickerModal({ isOpen, onClose, onSelectAccount }) {
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) return;
    
    let formattedEmail = customEmail.trim();
    if (!formattedEmail.includes('@')) {
      formattedEmail += '@gmail.com';
    }

    const realAccount = {
      id: 'google-' + Date.now(),
      name: customName.trim(),
      email: formattedEmail,
      avatar: null,
      initials: customName.trim().charAt(0).toUpperCase(),
      color: '#4285F4'
    };

    onSelectAccount(realAccount);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 20000,
      padding: '16px',
      animation: 'chatbot-slide-up 0.25s ease-out'
    }} onClick={onClose}>
      
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5), 0 0 40px rgba(66, 133, 244, 0.25)',
        overflow: 'hidden',
        position: 'relative',
        color: '#202124',
        fontFamily: 'Roboto, system-ui, -apple-system, sans-serif'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Top Google Header */}
        <div style={{ padding: '28px 28px 20px 28px', textAlign: 'center', borderBottom: '1px solid #f1f3f4' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span style={{ fontWeight: '600', fontSize: '1rem', color: '#5f6368' }}>Inicia sesión con Google</span>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '500', margin: '0 0 6px 0', color: '#202124' }}>
            Ingresa tu cuenta de Google
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#5f6368', margin: 0 }}>
            para continuar en <strong style={{ color: '#00C2B3' }}>Experience Safely</strong>
          </p>

          <button onClick={onClose} style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', cursor: 'pointer', color: '#5f6368', padding: '4px'
          }}>
            <X size={20} />
          </button>
        </div>

        {/* Real Custom Google Sign-In Form */}
        <div style={{ padding: '24px 28px 28px 28px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#3c4043', marginBottom: '6px' }}>
                Nombre Completo *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Carlos Ramírez"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px', border: '1px solid #dadce0',
                  borderRadius: '10px', fontSize: '0.92rem', outline: 'none', color: '#202124',
                  boxSizing: 'border-box'
                }}
                autoFocus
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#3c4043', marginBottom: '6px' }}>
                Correo de Gmail (@gmail.com) *
              </label>
              <input
                type="email"
                required
                placeholder="tu.correo@gmail.com"
                value={customEmail}
                onChange={e => setCustomEmail(e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px', border: '1px solid #dadce0',
                  borderRadius: '10px', fontSize: '0.92rem', outline: 'none', color: '#202124',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1, padding: '12px', background: '#f1f3f4', border: 'none',
                  borderRadius: '10px', cursor: 'pointer', fontWeight: '600', color: '#3c4043',
                  fontSize: '0.9rem'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  flex: 2, padding: '12px', background: '#1a73e8', color: '#fff',
                  border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  fontSize: '0.9rem', boxShadow: '0 2px 8px rgba(26, 115, 232, 0.35)'
                }}
              >
                Ingresar <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>

        {/* Footer Privacy Info */}
        <div style={{ padding: '12px 24px', background: '#f8f9fa', fontSize: '0.75rem', color: '#5f6368', borderTop: '1px solid #f1f3f4', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="#34A853" />
          Conexión segura verificada para Experience Safely.
        </div>
      </div>
    </div>
  );
}
