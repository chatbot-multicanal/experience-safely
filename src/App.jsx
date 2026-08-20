import React, { useContext, useState, useEffect, useRef } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import TouristView from './views/TouristView';
import ProviderView from './views/ProviderView';
import AdminView from './views/AdminView';
import ChatBot from './components/ChatBot';
import AuthModal from './components/AuthModal';
import ProviderRegisterModal from './components/ProviderRegisterModal';
import LegalModal from './components/LegalModal';
import { ShieldCheck, Compass, Briefcase, Settings2, Lock, LogOut, ShieldAlert, User, Building2, CheckCircle2 } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0d182a',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            background: 'rgba(255, 107, 77, 0.1)',
            border: '1px solid rgba(255, 107, 77, 0.3)',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '500px'
          }}>
            <h2 style={{ color: '#FF6B4D', marginBottom: '16px', fontSize: '1.6rem' }}>Experience Safely</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '16px', lineHeight: '1.5' }}>
              Iniciando la plataforma en modo seguro...
            </p>
            {this.state.error && (
              <pre style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', color: '#ff6b6b', fontSize: '0.75rem', textAlign: 'left', overflowX: 'auto', marginBottom: '20px' }}>
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              style={{
                background: 'linear-gradient(135deg, #00C2B3, #00a89b)',
                color: '#fff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '30px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              🔄 Recargar Aplicación
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const context = useContext(AppContext) || {};
  const { 
    currentProfile = 'tourist', 
    changeProfile = () => {}, 
    siteDesign = { title: 'Experience Safely', slogan: 'The Safest Way to Experience Yucatán', accentColor: '#FF6B4D', logo: null, backgroundImage: null }, 
    auth = { isAdminLoggedIn: false, isProviderLoggedIn: false }, 
    login = () => {}, 
    logout = () => {},
    language = 'es',
    t = (k) => k,
    toggleLanguage = () => {},
    touristUser = null,
    logoutTourist = () => {}
  } = context;

  // Local login state
  const [password, setPassword] = useState('');
  const [providerEmail, setProviderEmail] = useState('');
  const [providerPass, setProviderPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showProviderRegModal, setShowProviderRegModal] = useState(false);
  const [showTouristAuthModal, setShowTouristAuthModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalTab, setLegalTab] = useState('privacy');
  const previousProfileRef = useRef(currentProfile);

  // Track profile changes to remember where the user came from
  useEffect(() => {
    return () => { previousProfileRef.current = currentProfile; };
  }, [currentProfile]);

  // Dynamic CSS Variables Injector
  useEffect(() => {
    const accent = siteDesign?.accentColor || '#FF6B4D';
    document.documentElement.style.setProperty('--color-coral', accent);
    // Generate a subtle glow color based on accent color
    const glow = accent + '33'; // Add alpha
    document.documentElement.style.setProperty('--color-coral-glow', glow);
  }, [siteDesign?.accentColor]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    
    const profileToLogin = currentProfile; // 'admin' or 'provider'
    const result = login(profileToLogin, password);
    
    if (result && result.success) {
      setPassword('');
      setLoginError('');
    } else {
      setLoginError(result?.error || (language === 'es' ? 'Error al iniciar sesión.' : 'Login failed.'));
    }
  };

  const handleCancelLogin = () => {
    setPassword('');
    setLoginError('');
    changeProfile(previousProfileRef.current || 'tourist');
  };

  // Determine if the current view should be locked by login gate
  const isLocked = 
    (currentProfile === 'admin' && !auth?.isAdminLoggedIn) ||
    (currentProfile === 'provider' && !auth?.isProviderLoggedIn);

  // Safe split title
  const titleText = siteDesign?.title || 'Experience Safely';
  const sloganText = siteDesign?.slogan || 'The Safest Way to Experience Yucatán';
  const titleParts = titleText.split(' ');
  const titleFirst = titleParts[0] || 'Experience';
  const titleRest = titleParts.slice(1).join(' ') || 'Safely';

  return (
    <div 
      className="app-container"
      style={{
        backgroundImage: `linear-gradient(rgba(13, 24, 42, 0.45), rgba(13, 24, 42, 0.55)), url("${siteDesign?.backgroundImage || 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&q=80&w=1920'}")`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        minHeight: '100vh',
        position: 'relative'
      }}
    >

      {/* DEMO Ribbon */}
      <div style={{
        position: 'fixed',
        top: '18px',
        right: '-35px',
        background: 'linear-gradient(135deg, #FF6B4D, #ff4526)',
        color: '#fff',
        padding: '6px 40px',
        fontSize: '0.7rem',
        fontWeight: '800',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        transform: 'rotate(45deg)',
        zIndex: 9999,
        boxShadow: '0 2px 12px rgba(255, 107, 77, 0.5)',
        pointerEvents: 'none'
      }}>
        DEMO
      </div>
      <header className="header">
        <div className="header-content">
          <div className="brand" style={{ cursor: 'pointer' }} onClick={() => changeProfile('tourist')}>
            {/* Custom Logo Image or Default SVG Icon */}
            {siteDesign?.logo ? (
              <img 
                src={siteDesign?.logo || '/Logo - Experience Safely.png'} 
                alt="Logo" 
                style={{ 
                  width: '46px', 
                  height: '46px', 
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 8px rgba(0, 194, 179, 0.35))'
                }} 
              />
            ) : (
              <svg 
                viewBox="0 0 100 100" 
                width="45" 
                height="45" 
                style={{ filter: 'drop-shadow(0px 2px 6px rgba(0, 194, 179, 0.3))' }}
              >
                {/* Outer circular gradient border */}
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-coral)" strokeWidth="6" />
                
                {/* Star on top right quadrant */}
                <path 
                  d="M 68 28 L 71 36 L 79 39 L 71 42 L 68 50 L 65 42 L 57 39 L 65 36 Z" 
                  fill="var(--color-gold)" 
                />
                
                {/* Road / Current S-curve path */}
                <path 
                  d="M 28 65 C 28 65, 38 75, 48 65 C 58 55, 38 45, 52 32 C 60 25, 68 32, 68 32" 
                  fill="none" 
                  stroke="var(--color-teal-light)" 
                  strokeWidth="7" 
                  strokeLinecap="round"
                />
                
                {/* Secondary S-line to simulate road width */}
                <path 
                  d="M 31 68 C 31 68, 40 78, 49 68 C 58 58, 41 48, 54 35" 
                  fill="none" 
                  stroke="var(--color-teal-dark)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                />
              </svg>
            )}

            <div className="brand-text">
              <span className="brand-name">
                {titleFirst} <span style={{ color: 'var(--color-coral)' }}>{titleRest}</span>
              </span>
              <span className="brand-slogan">{sloganText}</span>
            </div>
          </div>

          {/* Right Header Navigation Panel */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            
            {/* Session Indicator for Admin / Provider */}
            {currentProfile === 'admin' && auth?.isAdminLoggedIn && (
              <span style={{ fontSize: '0.75rem', background: 'rgba(255, 107, 77, 0.15)', color: 'var(--color-coral)', border: '1px solid rgba(255, 107, 77, 0.3)', padding: '6px 12px', borderRadius: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {t('adminSession')}
              </span>
            )}
            {currentProfile === 'provider' && auth?.isProviderLoggedIn && (
              <span style={{ fontSize: '0.75rem', background: 'rgba(0, 194, 179, 0.15)', color: 'var(--color-teal-light)', border: '1px solid rgba(0, 194, 179, 0.3)', padding: '6px 12px', borderRadius: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {t('providerSession')}
              </span>
            )}

            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '15px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '700',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            >
              🌐 {language === 'es' ? 'ES | EN' : 'EN | ES'}
            </button>

            {/* Direct Tourist Login / Register Button */}
            {currentProfile === 'tourist' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setShowTouristAuthModal(true)}
                  style={{
                    background: 'linear-gradient(135deg, #00C2B3, #00a89b)',
                    border: 'none',
                    color: '#fff',
                    padding: '7px 16px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 10px rgba(0, 194, 179, 0.4)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <User size={15} />
                  {touristUser && touristUser.name && touristUser.name !== 'Turista' && touristUser.name !== 'Turista Google'
                    ? `👤 ${touristUser.name.split(' ')[0]}` 
                    : (language === 'es' ? '🔑 Ingresar / Registrarse' : '🔑 Sign In / Register')}
                </button>

                {touristUser && touristUser.name && touristUser.name !== 'Turista' && touristUser.name !== 'Turista Google' && (
                  <button 
                    onClick={logoutTourist} 
                    title={language === 'es' ? 'Cerrar sesión' : 'Log out'}
                    style={{
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '50%', padding: '6px', cursor: 'pointer',
                      color: 'rgba(255,255,255,0.5)', display: 'flex', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,77,77,0.2)'; e.currentTarget.style.color = '#ff6b6b'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                  >
                    <LogOut size={13} />
                  </button>
                )}
              </div>
            )}

            {/* Profile Switcher */}
            <div className="profile-switcher">
              <button 
                className={`profile-btn ${currentProfile === 'tourist' ? 'active' : ''}`}
                onClick={() => changeProfile('tourist')}
              >
                <Compass size={14} /> {t('navTourist')}
              </button>
              <button 
                className={`profile-btn ${currentProfile === 'provider' ? 'active' : ''}`}
                onClick={() => changeProfile('provider')}
              >
                <Briefcase size={14} /> {t('navProvider')}
              </button>
              <button 
                className={`profile-btn ${currentProfile === 'admin' ? 'active' : ''}`}
                onClick={() => changeProfile('admin')}
              >
                <Settings2 size={14} /> {t('navAdmin')}
              </button>
            </div>

            {/* Logout Button */}
            {((currentProfile === 'admin' && auth?.isAdminLoggedIn) || 
              (currentProfile === 'provider' && auth?.isProviderLoggedIn)) && (
              <button 
                onClick={() => logout(currentProfile)}
                className="btn btn-outline btn-sm"
                style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '4px', borderColor: 'var(--color-coral)', color: 'var(--color-coral)' }}
                title={t('logout')}
              >
                <LogOut size={14} /> {language === 'es' ? 'Salir' : 'Exit'}
              </button>
            )}

          </div>
        </div>
      </header>

      {/* Main Page Layout Container */}
      <main className="main-content">
        {isLocked ? (
          currentProfile === 'provider' ? (
            /* PROFESSIONAL PARTNER PORTAL GATE */
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }} className="animate-fade-in">
              <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '36px', border: '1px solid rgba(0, 194, 179, 0.25)', borderRadius: '24px', background: 'linear-gradient(180deg, rgba(21, 38, 63, 0.98), rgba(13, 24, 42, 0.99))' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'inline-flex', background: 'rgba(0, 194, 179, 0.15)', color: '#00C2B3', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
                    <Building2 size={36} />
                  </div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', margin: '0 0 6px' }}>
                    {language === 'es' ? 'Portal de Socio / Experiencia' : 'Partner / Experience Portal'}
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', margin: 0 }}>
                    {language === 'es' ? 'Ingresa con las credenciales de tu empresa o registra tu experiencia.' : 'Sign in with agency credentials or register your experience.'}
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">{language === 'es' ? 'Correo de la Empresa' : 'Company Email'}</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="contacto@aventurasmayas.mx"
                      value={providerEmail}
                      onChange={(e) => setProviderEmail(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">{t('loginPrompt')}</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ width: '100%' }}
                    />
                  </div>

                  {loginError && (
                    <div style={{ background: 'rgba(255, 107, 77, 0.1)', color: 'var(--color-coral)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 107, 77, 0.2)', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldAlert size={14} /> {loginError}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                    <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={handleCancelLogin}>
                      {t('loginCancel')}
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                      {language === 'es' ? 'Ingresar al Panel' : 'Sign In to Dashboard'}
                    </button>
                  </div>
                </form>

                {/* Partner Registration Callout */}
                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 12px' }}>
                    {language === 'es' ? '¿Aún no eres socio verificado de Experience Safely?' : 'Not a verified partner of Experience Safely yet?'}
                  </p>
                  <button
                    onClick={() => setShowProviderRegModal(true)}
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'center', background: 'rgba(255, 200, 87, 0.1)', color: '#FFC857', border: '1px solid rgba(255, 200, 87, 0.3)' }}
                  >
                    {language === 'es' ? 'Registrar Mi Experiencia (Pendiente Aprobación ⏳)' : 'Register My Experience (Pending Approval ⏳)'}
                  </button>
                </div>

                <div style={{ marginTop: '16px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                  🔑 {language === 'es' ? 'Contraseña de verificación' : 'Verification password'}: <strong style={{ color: 'var(--color-gold)' }}>nohayimposible2026</strong>
                </div>

              </div>
            </div>
          ) : (
            /* ADMIN ACCESS GATE */
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }} className="animate-fade-in">
              <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '36px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'inline-flex', background: 'rgba(255, 107, 77, 0.15)', color: 'var(--color-coral)', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
                    <Lock size={32} />
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>
                    {language === 'es' ? 'Acceso de Administrador' : 'Administrator Access'}
                  </h2>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
                    {language === 'es' ? 'Ingreso exclusivo para supervisión y auditoría del sistema.' : 'Exclusive access for system supervision and auditing.'}
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">{t('loginPrompt')}</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  {loginError && (
                    <div style={{ background: 'rgba(255, 107, 77, 0.1)', color: 'var(--color-coral)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 107, 77, 0.2)', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldAlert size={14} /> {loginError}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={handleCancelLogin}>
                      {t('loginCancel')}
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                      {language === 'es' ? 'Verificar' : 'Verify'}
                    </button>
                  </div>
                </form>

                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed var(--color-border)', fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                  🔑 {language === 'es' ? 'Contraseña demo' : 'Demo password'}: <strong style={{ color: 'var(--color-gold)' }}>nohayimposible2026</strong>
                </div>

              </div>
            </div>
          )
        ) : (
          // RENDER VIEWS AS USUAL
          <>
            {currentProfile === 'tourist' && <TouristView />}
            {currentProfile === 'provider' && <ProviderView />}
            {currentProfile === 'admin' && <AdminView />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong>© 2026 {titleText}.</strong> {t('footerRights')}
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem' }}>
            <button 
              onClick={() => { setLegalTab('terms'); setShowLegalModal(true); }}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', padding: 0 }}
            >
              {language === 'es' ? 'Términos de Garantía' : 'Warranty Terms'}
            </button>
            <button 
              onClick={() => { setLegalTab('privacy'); setShowLegalModal(true); }}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', padding: 0 }}
            >
              {language === 'es' ? 'Aviso de Privacidad' : 'Privacy Policy'}
            </button>
            <button 
              onClick={() => { setLegalTab('restrictions'); setShowLegalModal(true); }}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', padding: 0 }}
            >
              {language === 'es' ? 'Soporte de Seguridad & Derechos' : 'Security Support & Rights'}
            </button>
          </div>
        </div>
      </footer>

      {/* ChatBot - Only visible for tourists */}
      {currentProfile === 'tourist' && <ChatBot />}

      {/* Provider Register Modal */}
      <ProviderRegisterModal
        isOpen={showProviderRegModal}
        onClose={() => setShowProviderRegModal(false)}
      />

      {/* Tourist Auth Modal for direct login from header */}
      <AuthModal
        isOpen={showTouristAuthModal}
        onClose={() => setShowTouristAuthModal(false)}
        onSuccess={() => setShowTouristAuthModal(false)}
      />

      {/* Legal Modal */}
      <LegalModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        initialTab={legalTab}
        language={language}
      />

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
