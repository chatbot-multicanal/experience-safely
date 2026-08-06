import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock, AlertTriangle, Scale, CheckCircle2 } from 'lucide-react';

export default function LegalModal({ isOpen, onClose, initialTab = 'privacy', language = 'es' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'privacy' | 'terms' | 'restrictions'

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
            { id: 'privacy', icon: Lock, label: language === 'es' ? 'Aviso de Privacidad' : 'Privacy Policy' },
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

          {/* TAB 1: AVISO DE PRIVACIDAD */}
          {activeTab === 'privacy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(0, 194, 179, 0.08)', border: '1px solid rgba(0, 194, 179, 0.2)', padding: '12px 16px', borderRadius: '12px', color: '#00C2B3', fontSize: '0.8rem' }}>
                📄 Cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP - México).
              </div>

              <h3 style={{ color: '#fff', fontSize: '1rem', margin: '8px 0 4px' }}>1. Identidad y Domicilio del Responsable</h3>
              <p style={{ margin: 0 }}>
                <strong>Experience Safely Yucatán</strong> (en adelante "La Plataforma"), con domicilio operativo en Mérida, Yucatán, México, es responsable de recabar, usar, proteger y tratar sus datos personales.
              </p>

              <h3 style={{ color: '#fff', fontSize: '1rem', margin: '8px 0 4px' }}>2. Datos Personales Recabados</h3>
              <p style={{ margin: 0 }}>
                Para brindar nuestros servicios de reservación y emisión de boletos de garantía de seguridad, podemos solicitar:
              </p>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li>Nombre completo del titular de la reserva.</li>
                <li>Correo electrónico y número telefónico de contacto.</li>
                <li>Datos de facturación o identificación en caso de requerir comprobante fiscal.</li>
                <li>Información sobre alergias o condiciones médicas relevantes (únicamente en tours de aventura).</li>
              </ul>

              <h3 style={{ color: '#fff', fontSize: '1rem', margin: '8px 0 4px' }}>3. Finalidades del Tratamiento</h3>
              <p style={{ margin: 0 }}>
                <strong>Finalidades Primarias:</strong>
              </p>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li>Gestión, emisión y validación de boletos digitales de garantía con código QR.</li>
                <li>Coordinación directa con los operadores turísticos o haciendas reservadas.</li>
                <li>Atención de emergencias y validación de seguros de viajero incluidos en el tour.</li>
              </ul>

              <h3 style={{ color: '#fff', fontSize: '1rem', margin: '8px 0 4px' }}>4. Derechos ARCO</h3>
              <p style={{ margin: 0 }}>
                Usted tiene derecho a conocer qué datos tenemos (<strong>Acceso</strong>), solicitar su corrección (<strong>Rectificación</strong>), eliminar su registro (<strong>Cancelación</strong>) o oponerse a su uso (<strong>Oposición</strong>). Puede ejercer estos derechos escribiendo a <code>privacidad@experiencesafely.com</code>.
              </p>

              <h3 style={{ color: '#fff', fontSize: '1rem', margin: '8px 0 4px' }}>5. Transferencia de Datos</h3>
              <p style={{ margin: 0 }}>
                Sus datos personales únicamente se comparten con la empresa prestadora de servicio reservada (operador de tour, hotel o hacienda) para posibilitar la prestación del servicio contratado.
              </p>
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

              <h3 style={{ color: '#fff', fontSize: '1rem', margin: '8px 0 4px' }}>3. Restricciones y Derecho de Admisión</h3>
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li>Prohibido ingresar en estado de ebriedad o bajo el efecto de sustancias tóxicas.</li>
                <li>Prohibido extraer estalactitas, estalagmitas o alterar flora y fauna local.</li>
                <li>Los prestadores de servicio se reservan el derecho de denegar el acceso a personas que pongan en riesgo la seguridad del grupo.</li>
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
