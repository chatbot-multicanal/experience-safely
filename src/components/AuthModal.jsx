import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import GoogleAccountPickerModal from './GoogleAccountPickerModal';

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

  // Consent Checkbox States for Registration
  const [acceptPrivacyNotice, setAcceptPrivacyNotice] = useState(false);
  const [acceptPromotions, setAcceptPromotions] = useState(false);
  const [acceptSensitiveData, setAcceptSensitiveData] = useState(true);
  const [acceptLocationData, setAcceptLocationData] = useState(true);

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
        console.warn("Error initializing Google gsi:", e);
      }
    }
  }, [isOpen, siteDesign?.googleClientId]);

  const [showGooglePicker, setShowGooglePicker] = useState(false);

  // Official Google OAuth 2.0 Account Picker Popup Handler
  const handleRealGoogleSignIn = () => {
    const clientId = siteDesign?.googleClientId?.trim() || '349285752255-bqt54uh1ks66q8i0i851r2dbiupia2tn.apps.googleusercontent.com';

    if (window.google?.accounts?.oauth2) {
      try {
        setLoading(true);
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          prompt: 'select_account',
          callback: async (tokenResponse) => {
            setLoading(false);
            if (tokenResponse && tokenResponse.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const userInfo = await res.json();
                if (userInfo && userInfo.email) {
                  loginWithGoogle({
                    id: userInfo.sub,
                    name: userInfo.name || userInfo.given_name || userInfo.email.split('@')[0],
                    email: userInfo.email,
                    avatar: userInfo.picture
                  });
                  onSuccess?.();
                  onClose();
                  return;
                }
              } catch (e) {
                console.error("Error fetching Google userinfo:", e);
              }
            } else if (tokenResponse && tokenResponse.error) {
              setShowGooglePicker(true);
            }
          }
        });
        tokenClient.requestAccessToken();
        return;
      } catch (e) {
        setLoading(false);
        console.warn("initTokenClient fallback trigger:", e);
      }
    }

    setShowGooglePicker(true);
  };

  const handleGoogleAccountSelected = (account) => {
    loginWithGoogle(account);
    setShowGooglePicker(false);
    onSuccess?.();
    onClose();
  };

  if (!isOpen && !showGooglePicker) return null;

  const resetForm = () => {
    setName(''); setEmail(''); setPhone('');
    setPassword(''); setConfirmPass('');
    setAcceptPrivacyNotice(false);
    setAcceptPromotions(false);
    setAcceptSensitiveData(true);
    setAcceptLocationData(true);
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
    if (!acceptPrivacyNotice) {
      setError(language === 'es' ? 'Debes aceptar el Aviso de Privacidad para registrarte.' : 'You must accept the Privacy Notice to register.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = registerTourist({ 
        name, email, phone, password,
        consents: {
          privacyNotice: acceptPrivacyNotice,
          promotions: acceptPromotions,
          sensitiveData: acceptSensitiveData,
          locationData: acceptLocationData
        }
      });
      setLoading(false);
      if (result.success) { resetForm(); onSuccess?.(); onClose(); }
      else { setError(t(result.error)); }
    }, 500);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(8, 15, 27, 0.65)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '16px',
      animation: 'chatbot-slide-up 0.25s ease-out'
    }} onClick={onClose}>
      <div 
        className="glass-modal"
        style={{
          width: '100%',
          maxWidth: '420px',
          overflow: 'hidden',
          position: 'relative'
        }} 
        onClick={e => e.stopPropagation()}
      >

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

          {/* High-Reliability Google Sign-In Button (Opens Official Google Account Selector) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={handleRealGoogleSignIn}
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

              {/* 4 REGISTRATION CONSENT CHECKBOXES */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                
                {/* 1. Aviso de Privacidad */}
                <div style={{
                  padding: '10px 12px', borderRadius: '10px',
                  background: 'rgba(0, 194, 179, 0.06)', border: '1px solid rgba(0, 194, 179, 0.2)',
                  fontSize: '0.76rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.4'
                }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={acceptPrivacyNotice}
                      onChange={e => setAcceptPrivacyNotice(e.target.checked)}
                      style={{ marginTop: '2px', accentColor: '#00C2B3', width: '15px', height: '15px' }}
                    />
                    <span>
                      {language === 'es' ? 'He leído y acepto el Aviso de Privacidad de Experience Safely.' : 'I have read and accept the Experience Safely Privacy Notice.'}
                    </span>
                  </label>
                </div>

                {/* 2. Promociones y Comunicaciones Comerciales */}
                <div style={{
                  padding: '10px 12px', borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '0.76rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.4'
                }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={acceptPromotions}
                      onChange={e => setAcceptPromotions(e.target.checked)}
                      style={{ marginTop: '2px', accentColor: '#00C2B3', width: '15px', height: '15px' }}
                    />
                    <span>
                      {language === 'es' ? 'Acepto recibir promociones, recomendaciones y comunicaciones comerciales de Experience Safely. Podré darme de baja en cualquier momento.' : 'I agree to receive promotions, recommendations and commercial communications from Experience Safely. I can unsubscribe at any time.'}
                    </span>
                  </label>
                </div>

                {/* 3. Datos Sensibles de Salud y Emergencias */}
                <div style={{
                  padding: '10px 12px', borderRadius: '10px',
                  background: 'rgba(0, 194, 179, 0.06)', border: '1px solid rgba(0, 194, 179, 0.2)',
                  fontSize: '0.76rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.4'
                }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={acceptSensitiveData}
                      onChange={e => setAcceptSensitiveData(e.target.checked)}
                      style={{ marginTop: '2px', accentColor: '#00C2B3', width: '15px', height: '15px' }}
                    />
                    <span>
                      {language === 'es' ? 'Autorizo el tratamiento de datos sensibles necesarios para seguridad, accesibilidad o atención de emergencias durante la experiencia.' : 'I authorize the processing of sensitive data necessary for safety, accessibility or emergency response during the experience.'}
                    </span>
                  </label>
                </div>

                {/* 4. Ubicación y Geolocalización */}
                <div style={{
                  padding: '10px 12px', borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '0.76rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.4'
                }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={acceptLocationData}
                      onChange={e => setAcceptLocationData(e.target.checked)}
                      style={{ marginTop: '2px', accentColor: '#00C2B3', width: '15px', height: '15px' }}
                    />
                    <span>
                      {language === 'es' ? 'Autorizo el uso de mi ubicación para mostrar experiencias cercanas, puntos de encuentro, rutas, asistencia y funciones de seguridad.' : 'I authorize the use of my location to show nearby experiences, meeting points, routes, assistance and safety features.'}
                    </span>
                  </label>
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

      <GoogleAccountPickerModal
        isOpen={showGooglePicker}
        onClose={() => setShowGooglePicker(false)}
        onSelectAccount={handleGoogleAccountSelected}
      />
    </div>
  );
}
