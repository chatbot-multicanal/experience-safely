import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { X, ShieldCheck, FileText, Lock, AlertTriangle, Scale, CheckCircle2, Phone, HelpCircle, Mail, MapPin, MessageSquare } from 'lucide-react';

export default function LegalModal({ isOpen, onClose, initialTab = 'privacy', language = 'es' }) {
  const { siteDesign = {} } = useContext(AppContext) || {};
  const [activeTab, setActiveTab] = useState(initialTab);

  const contactEmail = siteDesign?.contactEmail?.trim() || 'contacto@experiencesafely.com';
  const salesEmail = siteDesign?.salesEmail?.trim() || 'ventas@experiencesafely.com';
  const contactPhone = siteDesign?.contactPhone?.trim() || '+52 1 990 230 5070';
  const contactLocation = siteDesign?.contactLocation?.trim() || 'Mérida, Yucatán, México';
  const cleanPhone = contactPhone.replace(/[^0-9+]/g, '');

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '16px',
      animation: 'chatbot-slide-up 0.3s ease-out'
    }} onClick={onClose}>
      <div style={{
        width: '100%', maxWidth: '720px', maxHeight: '85vh',
        background: 'linear-gradient(180deg, rgba(21, 38, 63, 0.99), rgba(13, 24, 42, 1))',
        borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.7), 0 0 80px rgba(0, 194, 179, 0.08)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative'
      }} onClick={e => e.stopPropagation()}>

        {/* Close Button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '20px', right: '20px',
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '10px', padding: '8px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
          zIndex: 2, transition: 'all 0.2s'
        }}>
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{
          padding: '28px 32px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(180deg, rgba(0, 194, 179, 0.08), transparent)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Scale size={24} style={{ color: '#00C2B3' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', margin: 0 }}>
              {language === 'es' ? 'Marco Legal y Políticas de Seguridad' : 'Legal Framework & Safety Policies'}
            </h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
            Experience Safely Yucatán — Cumplimiento normativo y LFPDPPP
          </p>
        </div>

        {/* Tabs Bar */}
        <div style={{
          display: 'flex', padding: '12px 32px 0', gap: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(13, 24, 42, 0.5)'
        }}>
          {[
            { id: 'contact', icon: Phone, label: language === 'es' ? 'Contacto' : 'Contact' },
            { id: 'privacy', icon: Lock, label: language === 'es' ? 'Avisos de Privacidad' : 'Privacy Notices' },
            { id: 'faq', icon: HelpCircle, label: language === 'es' ? 'Preguntas Frecuentes' : 'FAQ' },
            { id: 'terms', icon: ShieldCheck, label: language === 'es' ? 'Términos de Garantía' : 'Warranty Terms' },
            { id: 'restrictions', icon: AlertTriangle, label: language === 'es' ? 'Derechos y Restricciones' : 'User Rights & Limits' },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none', border: 'none',
                  padding: '10px 14px', cursor: 'pointer',
                  fontSize: '0.82rem', fontWeight: '600',
                  color: isActive ? '#00C2B3' : 'rgba(255,255,255,0.5)',
                  borderBottom: isActive ? '2px solid #00C2B3' : '2px solid transparent',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div style={{
          padding: '24px 32px', overflowY: 'auto', flex: 1,
          color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.88rem', lineHeight: '1.7'
        }}>

          {/* TAB 0: CONTACTO */}
          {activeTab === 'contact' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'rgba(0, 194, 179, 0.08)', border: '1px solid rgba(0, 194, 179, 0.25)', padding: '16px', borderRadius: '16px', color: '#00C2B3', fontSize: '0.85rem' }}>
                📞 <strong>Canales Oficiales de Atención y Soporte 24/7 de Experience Safely</strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ background: 'rgba(13, 24, 42, 0.6)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#00C2B3', marginBottom: '8px' }}>
                    <Mail size={20} />
                    <strong style={{ fontSize: '0.95rem' }}>Correos Oficiales</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6' }}>
                    ✉️ <a href={`mailto:${contactEmail}`} style={{ color: '#00C2B3', textDecoration: 'underline' }}>{contactEmail}</a><br />
                    ✉️ <a href={`mailto:${salesEmail}`} style={{ color: '#00C2B3', textDecoration: 'underline' }}>{salesEmail}</a>
                  </p>
                </div>

                <div style={{ background: 'rgba(13, 24, 42, 0.6)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FF6B4D', marginBottom: '8px' }}>
                    <MessageSquare size={20} />
                    <strong style={{ fontSize: '0.95rem' }}>WhatsApp & Llamadas</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6' }}>
                    💬 <strong>WhatsApp:</strong> <a href={`https://wa.me/${cleanPhone.replace('+', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#FF6B4D', fontWeight: '700' }}>{contactPhone}</a><br />
                    📞 <strong>Llamadas:</strong> <a href={`tel:${cleanPhone}`} style={{ color: '#FF6B4D', fontWeight: '700' }}>{contactPhone}</a>
                  </p>
                </div>
              </div>

              <div style={{ background: 'rgba(13, 24, 42, 0.6)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FFC857', marginBottom: '8px' }}>
                  <MapPin size={20} />
                  <strong style={{ fontSize: '0.95rem' }}>Oficina Central</strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6' }}>
                  📍 <strong>{contactLocation}</strong><br />
                  🕒 Horarios de atención: Lunes a Domingo de 7:00 AM a 10:00 PM (Hora Centro México).
                </p>
              </div>
            </div>
          )}

          {/* TAB: PREGUNTAS FRECUENTES (FAQ) */}
          {activeTab === 'faq' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(0, 194, 179, 0.08)', border: '1px solid rgba(0, 194, 179, 0.25)', padding: '12px 16px', borderRadius: '12px', color: '#00C2B3', fontSize: '0.8rem' }}>
                ❓ Resuelve de inmediato tus dudas sobre reservaciones, garantías de seguridad y pases.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: 'rgba(13, 24, 42, 0.6)', padding: '14px 16px', borderRadius: '12px', borderLeft: '3px solid #00C2B3' }}>
                  <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>
                    1. ¿Cómo recibo mi boleto / pase de seguridad digital?
                  </strong>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>
                    Inmediatamente al confirmar tu reserva, la plataforma genera tu boleto digital con código QR de seguridad y código alfanumérico único. Puedes descargarlo en pantalla o mostrarlo desde tu teléfono al llegar.
                  </p>
                </div>

                <div style={{ background: 'rgba(13, 24, 42, 0.6)', padding: '14px 16px', borderRadius: '12px', borderLeft: '3px solid #FF6B4D' }}>
                  <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>
                    2. ¿Qué pasa si hay mal clima o lluvia severa el día del tour?
                  </strong>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>
                    Tu reservación cuenta con la Garantía Safely contra Mal Tiempo. Si la capitanía de puerto o las autoridades suspenden actividades, se reprograma sin penalización o se reembolsa el 100% de tu dinero.
                  </p>
                </div>

                <div style={{ background: 'rgba(13, 24, 42, 0.6)', padding: '14px 16px', borderRadius: '12px', borderLeft: '3px solid #FFC857' }}>
                  <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>
                    3. ¿El equipo de protección (chalecos salvavidas) viene incluido?
                  </strong>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>
                    Sí. Todas las experiencias y cenotes auditados por Experience Safely incluyen chalecos salvavidas certificados y equipo verificado sin costo adicional.
                  </p>
                </div>

                <div style={{ background: 'rgba(13, 24, 42, 0.6)', padding: '14px 16px', borderRadius: '12px', borderLeft: '3px solid #00C2B3' }}>
                  <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>
                    4. ¿Cómo sé que un operador o hacienda está verificado?
                  </strong>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5' }}>
                    Cada experiencia cuenta con el sello de auditoría de seguridad activa y guías certificados en primeros auxilios validados por la plataforma.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: AVISO DE PRIVACIDAD INTEGRAL */}
          {activeTab === 'privacy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(0, 194, 179, 0.08)', border: '1px solid rgba(0, 194, 179, 0.25)', padding: '14px 18px', borderRadius: '14px', color: '#00C2B3', fontSize: '0.85rem' }}>
                📄 <strong>AVISO DE PRIVACIDAD INTEGRAL</strong> — Cumplimiento normativo y protección de datos personales.
              </div>

              <p style={{ margin: 0, lineHeight: '1.7', textAlign: 'justify' }}>
                <strong>Experience Safely</strong>, con domicilio en <strong>{contactLocation}</strong>, es responsable del tratamiento de los datos personales que recabe a través de su sitio web, aplicación, formularios, representantes, canales de mensajería, puntos de venta, eventos y medios electrónicos relacionados con la plataforma.
              </p>

              <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: '8px 0 2px', fontWeight: '700' }}>
                1. Datos Personales Recabados
              </h4>
              <p style={{ margin: 0, lineHeight: '1.7', textAlign: 'justify' }}>
                Los datos personales que podremos recabar incluyen: nombre, correo electrónico, teléfono, país, ciudad, idioma, datos de cuenta, datos de reservación, historial de reservas, mensajes, preferencias, datos de pago, facturación, información técnica del dispositivo, cookies, ubicación cuando sea autorizada, comentarios, calificaciones y datos necesarios para atención al cliente.
              </p>

              <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: '8px 0 2px', fontWeight: '700' }}>
                2. Datos de Salud & Necesidades de Accesibilidad
              </h4>
              <p style={{ margin: 0, lineHeight: '1.7', textAlign: 'justify' }}>
                En caso de que una experiencia lo requiera, podremos solicitar datos relacionados con salud, movilidad, alergias, restricciones físicas o necesidades de accesibilidad, únicamente para proteger la seguridad del usuario, adaptar el servicio o atender emergencias.
              </p>

              <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: '8px 0 2px', fontWeight: '700' }}>
                3. Finalidades Primarias del Tratamiento
              </h4>
              <p style={{ margin: 0, lineHeight: '1.7', textAlign: 'justify' }}>
                Sus datos serán utilizados para crear y administrar cuentas, gestionar reservas, pagos, confirmaciones, cancelaciones, reembolsos, facturación, soporte, comunicación con proveedores, seguridad, prevención de fraude, atención de quejas, cumplimiento legal y mejora de la plataforma.
              </p>

              <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: '8px 0 2px', fontWeight: '700' }}>
                4. Finalidades Secundarias & Oposición
              </h4>
              <p style={{ margin: 0, lineHeight: '1.7', textAlign: 'justify' }}>
                También podremos usar sus datos para enviar promociones, recomendaciones, encuestas, beneficios, comunicaciones comerciales, análisis estadístico y mejora de servicios. Usted puede oponerse a estas finalidades escribiendo a <a href={`mailto:${contactEmail}`} style={{ color: '#00C2B3', textDecoration: 'underline' }}>{contactEmail}</a>.
              </p>

              <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: '8px 0 2px', fontWeight: '700' }}>
                5. Transferencia de Datos
              </h4>
              <p style={{ margin: 0, lineHeight: '1.7', textAlign: 'justify' }}>
                Podremos compartir sus datos con proveedores de experiencias, transportistas, hoteles, operadores turísticos, procesadores de pago, servicios tecnológicos, facturación, soporte, analítica y autoridades competentes cuando sea necesario para prestar el servicio o cumplir obligaciones legales.
              </p>

              <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: '8px 0 2px', fontWeight: '700' }}>
                6. Derechos ARCO y Revocación del Consentimiento
              </h4>
              <p style={{ margin: 0, lineHeight: '1.7', textAlign: 'justify' }}>
                Usted puede ejercer sus derechos de acceso, rectificación, cancelación y oposición, así como revocar su consentimiento o limitar el uso de sus datos, enviando solicitud a <a href={`mailto:${contactEmail}`} style={{ color: '#00C2B3', textDecoration: 'underline' }}>{contactEmail}</a>.
              </p>

              <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: '8px 0 2px', fontWeight: '700' }}>
                7. Medidas de Seguridad
              </h4>
              <p style={{ margin: 0, lineHeight: '1.7', textAlign: 'justify' }}>
                Experience Safely implementará medidas razonables de seguridad para proteger los datos personales contra pérdida, alteración, uso indebido, acceso no autorizado o divulgación indebida.
              </p>

              <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: '8px 0 2px', fontWeight: '700' }}>
                8. Actualizaciones del Aviso de Privacidad
              </h4>
              <p style={{ margin: 0, lineHeight: '1.7', textAlign: 'justify' }}>
                Este Aviso de Privacidad podrá actualizarse por cambios legales, operativos, tecnológicos o comerciales. La versión vigente estará disponible en <a href="https://experiencesafely.com" target="_blank" rel="noopener noreferrer" style={{ color: '#00C2B3', textDecoration: 'underline' }}>https://experiencesafely.com</a>.
              </p>

              <div style={{ background: 'rgba(13, 24, 42, 0.6)', border: '1px solid rgba(0,194,179,0.3)', padding: '12px 16px', borderRadius: '12px', marginTop: '8px', fontSize: '0.82rem', color: '#00C2B3', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>☑️</span> <span>Acepto observaciones, Términos y Aviso de Privacidad Integral.</span>
              </div>
            </div>
          )}

          {/* TAB 2: TÉRMINOS DE GARANTÍA */}
          {activeTab === 'terms' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(255, 107, 77, 0.08)', border: '1px solid rgba(255, 107, 77, 0.2)', padding: '12px 16px', borderRadius: '12px', color: '#FF6B4D', fontSize: '0.8rem' }}>
                🛡️ Garantía Total Safely: Cobertura contra mal tiempo, guías certificados y equipo verificado.
              </div>

              <h3 style={{ color: '#fff', fontSize: '1rem', margin: '8px 0 4px' }}>1. Certificación de Proveedores</h3>
              <p style={{ margin: 0 }}>
                Todas las empresas y haciendas listadas en la plataforma han pasado por la auditoría de seguridad local de Experience Safely, garantizando guías certificados en primeros auxilios y chalecos salvavidas inspeccionados.
              </p>

              <h3 style={{ color: '#fff', fontSize: '1rem', margin: '8px 0 4px' }}>2. Política de Cancelación y Reembolsos</h3>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li><strong>Cancelación Gratuita:</strong> Hasta 24 horas antes del inicio de la experiencia con reembolso del 100%.</li>
                <li><strong>Garantía por Mal Clima:</strong> Si las autoridades locales o puertos cierran por condiciones meteorológicas (lluvia severa, tormenta), se reprograma sin costo o se realiza reembolso total inmediato.</li>
                <li><strong>No Show:</strong> Si el usuario no se presenta a la hora pactada sin previo aviso, el boleto perderá su validez.</li>
              </ul>

              <h3 style={{ color: '#fff', fontSize: '1rem', margin: '8px 0 4px' }}>3. Emisión de Boleto Digital</h3>
              <p style={{ margin: 0 }}>
                Al completar la reserva se emite un pase de seguridad con código de autenticidad único. El turista debe presentar este código digital al momento de abordar o ingresar al establecimiento.
              </p>
            </div>
          )}

          {/* TAB 3: DERECHOS Y RESTRICCIONES */}
          {activeTab === 'restrictions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(255, 200, 87, 0.08)', border: '1px solid rgba(255, 200, 87, 0.2)', padding: '12px 16px', borderRadius: '12px', color: '#FFC857', fontSize: '0.8rem' }}>
                ⚠️ Normas ambientales y código de conducta para visitantes de cenotes y haciendas de Yucatán.
              </div>

              <h3 style={{ color: '#fff', fontSize: '1rem', margin: '8px 0 4px' }}>1. Protección Ambiental Obligatoria (Cenotes y Cavernas)</h3>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li><strong>Bloqueadores biodegradables únicamente:</strong> Está estrictamente prohibido ingresar a los cenotes con bloqueadores solares convencionales, cremas, repelentes químicos o perfumes.</li>
                <li><strong>Ducharse antes de ingresar:</strong> Es requisito obligatorio ducharse en las instalaciones antes de entrar al agua del cenote para preservar el ecosistema acuífero subterráneo.</li>
                <li><strong>Uso obligatorio de chaleco salvavidas:</strong> En cenotes de cueva y semiabiertos se exige el uso del chaleco durante la estancia en el agua.</li>
              </ul>

              <h3 style={{ color: '#fff', fontSize: '1rem', margin: '8px 0 4px' }}>2. Derechos del Usuario</h3>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li>Recibir el servicio contratado en las condiciones de seguridad descritas.</li>
                <li>Contar con guía capacitado e instructivos en su idioma (Español / Inglés).</li>
                <li>Acceso a canal directo de soporte 24/7 y mediación de la plataforma ante disputas.</li>
              </ul>

              <h3 style={{ color: '#fff', fontSize: '1rem', margin: '8px 0 4px' }}>3. Cancelación por Estado Inadecuado y Seguridad del Grupo</h3>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li><strong>Cancelación por Estado Inadecuado:</strong> Por la seguridad del propio usuario, del grupo y del personal, si una persona se presenta en estado de ebriedad, bajo la influencia de sustancias psicotrópicas o mostrando conducta hostil/inadecuada, el guía o el establecimiento cancelará su participación de inmediato sin derecho a reembolso.</li>
                <li><strong>Prohibición de sustancias:</strong> Está estrictamente prohibido consumir bebidas alcohólicas o sustancias tóxicas durante las actividades acuáticas o de aventura en cenotes y cavernas.</li>
                <li><strong>Cuidado del Ecosistema:</strong> Prohibido extraer estalactitas, estalagmitas o alterar flora y fauna local. Los prestadores de servicio se reservan el derecho de admisión ante el incumplimiento de estas normas.</li>
              </ul>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 32px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(13, 24, 42, 0.8)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} style={{ color: '#00C2B3' }} />
            {language === 'es' ? 'Documento legalmente válido en México' : 'Legally binding document in Mexico'}
          </div>
          <button onClick={onClose} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
            {language === 'es' ? 'Entendido y Aceptar' : 'Acknowledge & Accept'}
          </button>
        </div>

      </div>
    </div>
  );
}
