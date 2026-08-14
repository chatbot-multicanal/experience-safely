import React, { useState } from 'react';
import { X, UserPlus, Check, ArrowRight } from 'lucide-react';

export default function GoogleAccountPickerModal({ isOpen, onClose, onSelectAccount }) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  if (!isOpen) return null;

  const defaultAccounts = [
    {
      id: 'acc-1',
      name: 'Carlos Ramírez',
      email: 'carlos.ramirez@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      initials: 'CR',
      color: '#4285F4'
    },
    {
      id: 'acc-2',
      name: 'María Alejandra Pech',
      email: 'maria.pech@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      initials: 'MP',
      color: '#EA4335'
    },
    {
      id: 'acc-3',
      name: 'John Smith (Traveler)',
      email: 'john.smith.yucatan@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      initials: 'JS',
      color: '#FBBC05'
    }
  ];

  const handleSelect = (account) => {
    setSelectedId(account.id);
    setTimeout(() => {
      onSelectAccount(account);
      onClose();
    }, 400);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) return;
    
    let formattedEmail = customEmail.trim();
    if (!formattedEmail.includes('@')) {
      formattedEmail += '@gmail.com';
    }

    const customAccount = {
      id: 'custom-' + Date.now(),
      name: customName.trim(),
      email: formattedEmail,
      avatar: null,
      initials: customName.trim().charAt(0).toUpperCase(),
      color: '#34A853'
    };

    onSelectAccount(customAccount);
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
        <div style={{ padding: '28px 28px 16px 28px', textAlign: 'center', borderBottom: '1px solid #f1f3f4' }}>
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
            Elige una cuenta
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#5f6368', margin: 0 }}>
            para ir a <strong style={{ color: '#00C2B3' }}>Experience Safely</strong>
          </p>

          <button onClick={onClose} style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', cursor: 'pointer', color: '#5f6368', padding: '4px'
          }}>
            <X size={20} />
          </button>
        </div>

        {/* Account List or Custom Input */}
        <div style={{ padding: '16px 24px 24px 24px' }}>
          {!showCustomInput ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {defaultAccounts.map(acc => (
                  <div
                    key={acc.id}
                    onClick={() => handleSelect(acc)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: selectedId === acc.id ? '2px solid #4285F4' : '1px solid #e8eaed',
                      background: selectedId === acc.id ? 'rgba(66, 133, 244, 0.08)' : '#fff',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { if (selectedId !== acc.id) e.currentTarget.style.background = '#f8f9fa'; }}
                    onMouseLeave={e => { if (selectedId !== acc.id) e.currentTarget.style.background = '#fff'; }}
                  >
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: acc.color, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '700', fontSize: '0.9rem', flexShrink: 0
                    }}>
                      {acc.initials}
                    </div>

                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontWeight: '600', fontSize: '0.92rem', color: '#202124' }}>{acc.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#5f6368', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{acc.email}</div>
                    </div>

                    {selectedId === acc.id && (
                      <Check size={18} color="#4285F4" />
                    )}
                  </div>
                ))}
              </div>

              {/* Button to add another account */}
              <div
                onClick={() => setShowCustomInput(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 16px',
                  marginTop: '12px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  border: '1px dashed #dadce0',
                  color: '#1a73e8',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: '#e8f0fe', color: '#1a73e8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <UserPlus size={18} />
                </div>
                <span>Ingresar con tu propia cuenta @gmail.com</span>
              </div>
            </>
          ) : (
            /* Custom Account Form */
            <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#202124', marginBottom: '2px' }}>
                Escribe tu Nombre y Correo de Google:
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#5f6368', marginBottom: '4px' }}>
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #dadce0',
                    borderRadius: '8px', fontSize: '0.9rem', outline: 'none'
                  }}
                  autoFocus
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#5f6368', marginBottom: '4px' }}>
                  Correo de Gmail (@gmail.com) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@gmail.com"
                  value={customEmail}
                  onChange={e => setCustomEmail(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #dadce0',
                    borderRadius: '8px', fontSize: '0.9rem', outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  style={{
                    flex: 1, padding: '10px', background: '#f1f3f4', border: 'none',
                    borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#3c4043'
                  }}
                >
                  Volver
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2, padding: '10px', background: '#1a73e8', color: '#fff',
                    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                  }}
                >
                  Continuar <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Privacy Info */}
        <div style={{ padding: '12px 24px', background: '#f8f9fa', fontSize: '0.72rem', color: '#5f6368', borderTop: '1px solid #f1f3f4', textAlign: 'center' }}>
          Para continuar, Google compartirá tu nombre, dirección de correo electrónico y foto de perfil con Experience Safely.
        </div>
      </div>
    </div>
  );
}
