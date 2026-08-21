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
  const [address, setAddress] = useState('');
  const [operatingHours, setOperatingHours] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!companyName || !rfc || !email) return;
    
    addAuditLog('provider', `Nueva solicitud de registro de empresa: "${companyName}" (RFC: ${rfc}, Dirección: ${address}, Horarios: ${operatingHours}) - PENDIENTE DE APROBACIÓN`);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setCompanyName('');
    setRfc('');
    setPhone('');
    setEmail('');
    setContactName('');
    setAddress('');
    setOperatingHours('');
    setComment('');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(8, 15, 27, 0.65)', backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '16px',
      animation: 'chatbot-slide-up 0.3s ease-out'
    }} onClick={handleClose}>
      <div 
        className="glass-modal"
        style={{
          width: '100%', maxWidth: '480px',
          overflow: 'hidden', position: 'relative'
        }} 
        onClick={e => e.stopPropagation()}
      >

        <button onClick={handleClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px', padding: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)'
        }}>
          <X size={18} />
        </button>

        {isSubmitted ? (
          <div style={{ padding: '36px 28px', textAlign: 'center' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(0, 194, 179, 0.15)', border: '2px solid #00C2B3',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              color: '#00C2B3'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: '0 0 8px' }}>
              {language === 'es' ? '¡Solicitud de Socio Registrada!' : 'Application Submitted!'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', marginBottom: '16px' }}>
              {language === 'es' 
                ? 'Tu empresa ha quedado registrada en la Bitácora de Auditoría del Panel Administrador en estado '
                : 'Your application has been logged into Admin Audit Panel as '}
              <strong style={{ color: '#FFC857' }}>
                {language === 'es' ? 'PENDIENTE DE APROBACIÓN ⏳' : 'PENDING APPROVAL ⏳'}
              </strong>.
            </p>

            {/* Summary Box */}
            <div style={{
              background: 'rgba(13, 24, 42, 0.7)', border: '1px solid rgba(0, 194, 179, 0.25)',
              padding: '14px', borderRadius: '14px', textAlign: 'left', fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.85)', marginBottom: '20px', lineHeight: '1.6'
            }}>
              <div>🏢 <strong>Empresa:</strong> {companyName} (RFC: {rfc})</div>
              <div>👤 <strong>Contacto:</strong> {contactName} ({phone} / {email})</div>
              {address && <div>📍 <strong>Dirección:</strong> {address}</div>}
              {operatingHours && <div>🕒 <strong>Horarios:</strong> {operatingHours}</div>}
              {comment && <div>💬 <strong>Comentarios:</strong> {comment}</div>}
            </div>

            {/* Direct Action Buttons for Immediate Alert */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <a
                href={`https://wa.me/5219902305070?text=${encodeURIComponent(`Hola Experience Safely, he enviado una solicitud de registro de Empresa Socio:\n\n*Empresa:* ${companyName}\n*RFC:* ${rfc}\n*Representante:* ${contactName}\n*Tel:* ${phone}\n*Email:* ${email}\n*Dirección:* ${address}\n*Horarios:* ${operatingHours}\n*Notas:* ${comment}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  background: '#25D366', color: '#fff', padding: '12px', borderRadius: '12px',
                  fontWeight: '700', textDecoration: 'none', fontSize: '0.85rem'
                }}
              >
                💬 {language === 'es' ? 'Enviar Notificación Inmediata por WhatsApp' : 'Send WhatsApp Alert'}
              </a>

              <a
                href={`mailto:ventas@experiencesafely.com?subject=${encodeURIComponent(`Nueva Solicitud de Socio: ${companyName}`)}&body=${encodeURIComponent(`Solicitud de Afiliación:\n\nEmpresa: ${companyName}\nRFC: ${rfc}\nRepresentante: ${contactName}\nTeléfono: ${phone}\nCorreo: ${email}\nDirección: ${address}\nHorarios: ${operatingHours}\nComentarios: ${comment}`)}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)',
                  padding: '10px', borderRadius: '12px', fontWeight: '600', textDecoration: 'none', fontSize: '0.82rem'
                }}
              >
                ✉️ {language === 'es' ? 'Enviar Copia por Correo a Administración' : 'Send Email Copy'}
              </a>
            </div>

            <button onClick={handleClose} className="btn btn-outline" style={{ width: '100%' }}>
              {language === 'es' ? 'Cerrar Ventana' : 'Close Window'}
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

              {/* Dirección */}
              <div>
                <label className="form-label">{language === 'es' ? 'Dirección Física / Comercial' : 'Business Address'}</label>
                <input 
                  type="text" className="form-input" required
                  placeholder="Ej. Calle 60 #450 x 53 y 55, Centro, Mérida, Yucatán"
                  value={address} onChange={e => setAddress(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Horario */}
              <div>
                <label className="form-label">{language === 'es' ? 'Horario de Atención / Operativo' : 'Operating Hours'}</label>
                <input 
                  type="text" className="form-input" required
                  placeholder="Ej. Lunes a Domingo de 8:00 AM a 6:00 PM"
                  value={operatingHours} onChange={e => setOperatingHours(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Comentario */}
              <div>
                <label className="form-label">{language === 'es' ? 'Comentarios / Notas para Auditoría' : 'Comments / Audit Notes'}</label>
                <textarea 
                  className="form-input" rows="2"
                  placeholder="Ej. Contamos con 3 embarcaciones con certificación de Capitanía de Puerto y guías certificados..."
                  value={comment} onChange={e => setComment(e.target.value)}
                  style={{ width: '100%', resize: 'vertical', minHeight: '60px' }}
                />
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
