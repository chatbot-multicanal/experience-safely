import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const context = useContext(AppContext) || {};
  const { t = (k) => k, registerTourist, loginTourist, loginWithGoogle, siteDesign, language = 'es' } = context;

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

  // Helper to decode Google OAuth JWT Credential
  const parseGoogleJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  // Initialize & Render Official Native Google Sign-In Button (gsi/client)
  useEffect(() => {
    if (!isOpen) return;

    const clientId = siteDesign?.googleClientId?.trim() || '349285752255-bqt54uh1ks66q8i0i851r2dbiupia2tn.apps.googleusercontent.com';

    if (clientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          auto_select: false,
          callback: (response) => {
            const payload = parseGoogleJwt(response.credential);
            if (payload) {
              loginWithGoogle({
                id: payload.sub,
                name: payload.name || payload.given_name,
                email: payload.email,
                avatar: payload.picture
              });
              onSuccess?.();
              onClose();
            }
          }
        });

        const targetDiv = document.getElementById('googleBtnDiv');
        if (targetDiv) {
          targetDiv.innerHTML = '';
          window.google.accounts.id.renderButton(targetDiv, {
            theme: 'filled_blue',
            size: 'large',
            width: '320',
            text: 'continue_with',
            shape: 'pill',
            logo_alignment: 'left'
          });
        }
      } catch (e) {
        console.error("Error initializing Google Identity Services:", e);
      }
    }
  }, [isOpen, siteDesign?.googleClientId]);

  const promptGoogleEmail = () => {
    const userEmail = prompt(
      language === 'es'
        ? 'Ingresa tu dirección de correo de Google (@gmail.com) para continuar:'
        : 'Enter your Google email address (@gmail.com) to continue:'
    );
    if (userEmail && userEmail.trim()) {
      const namePart = userEmail.split('@')[0];
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      loginWithGoogle({ name: formattedName, email: userEmail.trim() });
      onSuccess?.();
      onClose();
    }
  };

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
    if (password.length < 6) { setError(t('authPassLength')); return; }

    setLoading(true);
    setTimeout(() => {
      const result = registerTourist({ name, email, phone, password });
      setLoading(false);
      if (result.success) { resetForm(); onSuccess?.(); onClose(); }
      else { setError(t(result.error)); }
    }, 500);
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
      zIndex: 10000,
      padding: '16px',
      animation: 'chatbot-slide-up 0.25s ease-out'
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

          {/* High-Reliability Google Sign-In Button */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => {
                const clientId = siteDesign?.googleClientId?.trim() || '349285752255-bqt54uh1ks66q8i0i851r2dbiupia2tn.apps.googleusercontent.com';
                
                // Try official Google Identity Services prompt first
                if (clientId && window.google?.accounts?.id) {
                  try {
                    window.google.accounts.id.initialize({
                      client_id: clientId,
                      callback: (response) => {
                        const payload = parseGoogleJwt(response.credential);
                        if (payload) {
                          loginWithGoogle({
                            id: payload.sub,
                            name: payload.name || payload.given_name,
                            email: payload.email,
                            avatar: payload.picture
                          });
                          onSuccess?.();
                          onClose();
                        }
                      }
                    });
                    window.google.accounts.id.prompt((notification) => {
                      if (notification.isNotDisplayed() || notification.isSkippedMoment() || notification.isDismissedMoment()) {
                        // Fallback to seamless Google Email Prompt
                        promptGoogleEmail();
                      }
                    });
                    return;
                  } catch (e) {
                    console.warn("Google gsi prompt blocked, opening fallback", e);
                  }
                }
                
                // Fallback to seamless Google Email Prompt
                promptGoogleEmail();
              }}
              style={{
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
                color: '#3c4043',
                transition: 'all 0.2s',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t('authGoogle')}
            </button>
            
            <div id="googleBtnDiv" style={{ display: 'none' }}></div>
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            margin: '16px 0', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            {t('authOrDivider')}
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{
              background: 'rgba(255, 107, 107, 0.12)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '16px',
              color: '#ff6b6b',
              fontSize: '0.8rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{t('authEmail')}</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                    placeholder="tu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{t('authPassword')}</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    style={{ paddingLeft: '38px', paddingRight: '38px' }}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 0
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{
                width: '100%', marginTop: '8px', padding: '12px', fontWeight: '700',
                background: 'linear-gradient(135deg, #00C2B3, #00a89b)', border: 'none', borderRadius: '12px'
              }}>
                {loading ? t('authLoading') : t('authBtnLogin')}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{t('authName')}</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                    placeholder="Ej. Juan Pérez"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{t('authEmail')}</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                    placeholder="tu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{t('authPhone')}</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    type="tel"
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                    placeholder="+52 999 123 4567"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{t('authPassword')}</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    style={{ paddingLeft: '38px', paddingRight: '38px' }}
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{t('authConfirmPass')}</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                    placeholder="Repite tu contraseña"
                    value={confirmPass}
                    onChange={e => setConfirmPass(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{
                width: '100%', marginTop: '8px', padding: '12px', fontWeight: '700',
                background: 'linear-gradient(135deg, #00C2B3, #00a89b)', border: 'none', borderRadius: '12px'
              }}>
                {loading ? t('authLoading') : t('authBtnRegister')}
              </button>
            </form>
          )}

          {/* Privacy Note */}
          <p style={{
            fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)',
            textAlign: 'center', marginTop: '16px', lineHeight: '1.4'
          }}>
            {language === 'es' ? 'Al continuar, aceptas nuestros ' : 'By continuing, you agree to our '}
            <span style={{ color: '#00C2B3', textDecoration: 'underline' }}>
              {language === 'es' ? 'Términos de Garantía' : 'Warranty Terms'}
            </span>
            {language === 'es' ? ' y el ' : ' & '}
            <span style={{ color: '#00C2B3', textDecoration: 'underline' }}>
              {language === 'es' ? 'Aviso de Privacidad' : 'Privacy Policy'}
            </span>.
          </p>
        </div>
      </div>
    </div>
  );
}
