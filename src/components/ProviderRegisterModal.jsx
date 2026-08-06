import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { X, Building2, FileText, Phone, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ProviderRegisterModal({ isOpen, onClose }) {
  const context = useContext(AppContext) || {};
  const { language = 'es', t = (k) => k, addAuditLog = () => {} } = context;

  const [companyName, setCompanyName] = useState('');
  const [rfc, setRfc] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!companyName || !rfc || !email) return;
    
    addAuditLog('provider', `Nueva solicitud de registro de empresa: "${companyName}" (RFC: ${rfc}) - PENDIENTE DE APROBACIÓN`);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setCompanyName('');
    setRfc('');
    setPhone('');
    setEmail('');
    setContactName('');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '16px',
      animation: 'chatbot-slide-up 0.3s ease-out'
    }} onClick={handleClose}>
      <div style={{
        width: '100%', maxWidth: '480px',
        background: 'linear-gradient(180deg, rgba(21, 38, 63, 0.98), rgba(13, 24, 42, 0.99))',
        borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)', overflow: 'hidden', position: 'relative'
      }} onClick={e => e.stopPropagation()}>

        <button onClick={handleClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px', padding: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)'
        }}>
          <X size={18} />
        </button>

        {isSubmitted ? (
          <div style={{ padding: '40px 32px', textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(0, 194, 179, 0.15)', border: '2px solid #00C2B3',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
              color: '#00C2B3'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: '0 0 10px' }}>
              {language === 'es' ? '¡Solicitud Registrada!' : 'Application Submitted!'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', marginBottom: '20px' }}>
              {language === 'es' 
                ? 'Tu empresa ha quedado en estado '
                : 'Your company is currently '}
              <strong style={{ color: '#FFC857' }}>
                {language === 'es' ? 'PENDIENTE DE APROBACIÓN ⏳' : 'PENDING APPROVAL ⏳'}
              </strong>
              {language === 'es'
                ? '. Nuestro equipo auditará tu RFC y certificaciones de seguridad antes de habilitar tu panel de socio.'
                : '. Our audit team will review your RFC and safety credentials before activating your partner account.'}
            </p>
            <button onClick={handleClose} className="btn btn-primary" style={{ width: '100%' }}>
              {language === 'es' ? 'Entendido' : 'Got it'}
            </button>
          </div>
        ) : (
          <div style={{ padding: '32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Building2 size={36} style={{ color: '#00C2B3', marginBottom: '8px' }} />
              <h2 style={{ fontSize: '1.2rem', color: '#fff', margin: '0 0 6px' }}>
                {language === 'es' ? 'Registro de Empresa Socio' : 'Partner Company Registration'}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                {language === 'es' ? 'Sujeto a auditoría y aprobación de seguridad' : 'Subject to safety audit and approval'}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="form-label">{language === 'es' ? 'Nombre Comercial de la Empresa' : 'Company Name'}</label>
                <input 
                  type="text" className="form-input" required
                  placeholder="Ej. Aventuras Mayas S.A."
                  value={companyName} onChange={e => setCompanyName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label className="form-label">{language === 'es' ? 'RFC o ID Fiscal' : 'Tax ID / RFC'}</label>
                <input 
                  type="text" className="form-input" required
                  placeholder="Ej. AMA190204XY9"
                  value={rfc} onChange={e => setRfc(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label className="form-label">{language === 'es' ? 'Nombre del Representante' : 'Representative Name'}</label>
                <input 
                  type="text" className="form-input" required
                  placeholder="Ej. Gabriel Pech"
                  value={contactName} onChange={e => setContactName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">{language === 'es' ? 'Correo de Contacto' : 'Email'}</label>
                  <input 
                    type="email" className="form-input" required
                    placeholder="contacto@empresa.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">{language === 'es' ? 'Teléfono' : 'Phone'}</label>
                  <input 
                    type="tel" className="form-input" required
                    placeholder="9991234567"
                    value={phone} onChange={e => setPhone(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 200, 87, 0.1)', border: '1px solid rgba(255, 200, 87, 0.3)',
                borderRadius: '10px', padding: '10px 12px', fontSize: '0.75rem', color: '#FFC857', marginTop: '4px'
              }}>
                ⏳ {language === 'es' 
                  ? 'Nota: Tras enviar la solicitud, el Administrador verificará tus datos antes de activar tu acceso.'
                  : 'Note: After submission, Admin will verify your credentials prior to activating partner access.'}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                {language === 'es' ? 'Enviar Solicitud de Socio' : 'Submit Partner Application'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
