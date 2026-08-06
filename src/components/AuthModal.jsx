import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const context = useContext(AppContext) || {};
  const { t = (k) => k, registerTourist, loginTourist, loginWithGoogle, siteDesign } = context;

  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setName(''); setEmail(''); setPhone('');
    setPassword(''); setConfirmPass('');
    setError(''); setShowPassword(false);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError('');
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      loginWithGoogle();
      setLoading(false);
      onSuccess?.();
      onClose();
    }, 800);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError(t('authFieldsRequired')); return; }
    setLoading(true);
    setTimeout(() => {
      const result = loginTourist(email, password);
      setLoading(false);
      if (result.success) { resetForm(); onSuccess?.(); onClose(); }
      else { setError(t(result.error)); }
    }, 500);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirmPass) { setError(t('authFieldsRequired')); return; }
    if (password !== confirmPass) { setError(t('authPassMismatch')); return; }
    setLoading(true);
    setTimeout(() => {
      const result = registerTourist({ name, email, phone, password });
      setLoading(false);
      if (result.success) { resetForm(); onSuccess?.(); onClose(); }
      else { setError(t(result.error)); }
    }, 500);
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 14px 14px 44px',
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  };

  const iconStyle = {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(255,255,255,0.35)',
    pointerEvents: 'none'
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '16px',
      animation: 'chatbot-slide-up 0.3s ease-out'
    }} onClick={onClose}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'linear-gradient(180deg, rgba(21, 38, 63, 0.98), rgba(13, 24, 42, 0.99))',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6), 0 0 80px rgba(0, 194, 179, 0.06)',
        overflow: 'hidden',
        position: 'relative'
      }} onClick={e => e.stopPropagation()}>

        {/* Close button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px', padding: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
          display: 'flex', zIndex: 2, transition: 'all 0.2s'
        }}>
          <X size={18} />
        </button>

        {/* Header with Logo */}
        <div style={{
          padding: '32px 32px 20px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(0, 194, 179, 0.08), transparent)'
        }}>
          {siteDesign?.logo ? (
            <img src={siteDesign.logo} alt="Logo" style={{ height: '50px', objectFit: 'contain', marginBottom: '16px' }} />
          ) : (
            <ShieldCheck size={40} style={{ color: '#00C2B3', marginBottom: '12px' }} />
          )}
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
            {t('authTitle')}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            {t('authSubtitle')}
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', margin: '0 32px', borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '3px'
        }}>
          {['login', 'register'].map(tab => (
            <button key={tab} onClick={() => switchTab(tab)} style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: '10px',
              fontFamily: 'inherit', fontWeight: '600', fontSize: '0.8rem',
              cursor: 'pointer', transition: 'all 0.25s',
              background: activeTab === tab
                ? 'linear-gradient(135deg, #00C2B3, #00a89b)'
                : 'transparent',
              color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.5)',
              boxShadow: activeTab === tab ? '0 2px 8px rgba(0, 194, 179, 0.3)' : 'none'
            }}>
              {tab === 'login' ? t('authTabLogin') : t('authTabRegister')}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div style={{ padding: '24px 32px 32px' }}>

          {/* Google Button */}
          <button onClick={handleGoogleLogin} disabled={loading} style={{
            width: '100%',
            padding: '13px',
            background: '#fff',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            fontSize: '0.88rem',
            fontWeight: '600',
            fontFamily: 'inherit',
            color: '#333',
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            opacity: loading ? 0.7 : 1
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {t('authGoogle')}
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            margin: '20px 0', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            {t('authOrDivider')}
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: '10px', marginBottom: '16px',
              background: 'rgba(255, 77, 77, 0.1)', border: '1px solid rgba(255, 77, 77, 0.3)',
              color: '#ff6b6b', fontSize: '0.8rem', textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={activeTab === 'login' ? handleLogin : handleRegister}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* Name - register only */}
              {activeTab === 'register' && (
                <div style={{ position: 'relative' }}>
                  <User size={18} style={iconStyle} />
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder={t('authName')} style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'rgba(0, 194, 179, 0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(0, 194, 179, 0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              )}

              {/* Email */}
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={iconStyle} />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder={t('authEmail')} style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'rgba(0, 194, 179, 0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(0, 194, 179, 0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Phone - register only */}
              {activeTab === 'register' && (
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={iconStyle} />
                  <input
                    type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder={t('authPhone')} style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'rgba(0, 194, 179, 0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(0, 194, 179, 0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              )}

              {/* Password */}
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={iconStyle} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder={t('authPassword')} style={{ ...inputStyle, paddingRight: '44px' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(0, 194, 179, 0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(0, 194, 179, 0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.35)', padding: '4px', display: 'flex'
                }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Confirm Password - register only */}
              {activeTab === 'register' && (
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={iconStyle} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
                    placeholder={t('authConfirmPass')} style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = 'rgba(0, 194, 179, 0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(0, 194, 179, 0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading} style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #00C2B3, #00a89b)',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '0.95rem',
                fontWeight: '700',
                fontFamily: 'inherit',
                cursor: loading ? 'wait' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 16px rgba(0, 194, 179, 0.3)',
                marginTop: '4px',
                opacity: loading ? 0.7 : 1,
                letterSpacing: '0.02em'
              }}>
                {loading ? '...' : (activeTab === 'login' ? t('authBtnLogin') : t('authBtnRegister'))}
              </button>
            </div>
          </form>

          {/* Switch tab link */}
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
            {activeTab === 'login' ? t('authNoAccount') : t('authHasAccount')}{' '}
            <button onClick={() => switchTab(activeTab === 'login' ? 'register' : 'login')} style={{
              background: 'none', border: 'none', color: '#00C2B3',
              cursor: 'pointer', fontWeight: '600', fontFamily: 'inherit', fontSize: '0.8rem',
              textDecoration: 'underline', padding: 0
            }}>
              {activeTab === 'login' ? t('authRegisterLink') : t('authLoginLink')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
