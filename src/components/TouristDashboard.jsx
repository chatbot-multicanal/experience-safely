import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Ticket, Bell, MessageSquare, Star, Calendar, MapPin, 
  User, CheckCircle2, Clock, ShieldCheck, Send, ArrowLeft, ChevronRight
} from 'lucide-react';

export default function TouristDashboard({ onBackToCatalog }) {
  const context = useContext(AppContext) || {};
  const { 
    touristUser = null, 
    bookings = [], 
    experiences = [],
    language = 'es',
    t = (k) => k,
    addExperienceReview = () => {}
  } = context;

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'notifications' | 'chat' | 'reviews'
  const [selectedBookingForChat, setSelectedBookingForChat] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [chatInput, setChatInput] = useState('');
  
  // Review Modal State
  const [reviewModalExpId, setReviewModalExpId] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Filter bookings for the logged-in user
  const userBookings = bookings.filter(b => 
    b.touristEmail === touristUser?.email || 
    b.touristName === touristUser?.name ||
    touristUser?.provider === 'google' // Show all demo bookings for demo google user
  );

  const getExp = (expId) => experiences.find(e => e.id === expId) || {};

  const handleSendMessage = (bookingId) => {
    if (!chatInput.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => ({
      ...prev,
      [bookingId]: [...(prev[bookingId] || []), newMsg]
    }));
    setChatInput('');

    // Simulated provider response
    setTimeout(() => {
      const reply = {
        id: `msg-reply-${Date.now()}`,
        sender: 'provider',
        text: language === 'es' 
          ? '¡Hola! Gracias por contactarnos. Tu guía asignado estará listo en el punto de encuentro.'
          : 'Hello! Thank you for reaching out. Your assigned guide will be ready at the meeting point.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => ({
        ...prev,
        [bookingId]: [...(prev[bookingId] || []), reply]
      }));
    }, 1200);
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    if (!reviewModalExpId || !reviewComment) return;
    addExperienceReview(reviewModalExpId, {
      user: touristUser?.name || 'Turista Verificado',
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toLocaleDateString()
    });
    setReviewModalExpId(null);
    setReviewComment('');
    alert(language === 'es' ? '¡Gracias! Tu reseña ha sido publicada.' : 'Thank you! Your review has been published.');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', animation: 'fade-in 0.4s ease' }}>
      
      {/* Header Profile Info */}
      <div className="glass-card" style={{
        padding: '24px 32px',
        borderRadius: '20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        background: 'linear-gradient(135deg, rgba(13, 24, 42, 0.9), rgba(0, 194, 179, 0.08))',
        border: '1px solid rgba(0, 194, 179, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #00C2B3, #007A7B)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', fontWeight: '800', color: '#fff',
            boxShadow: '0 4px 16px rgba(0, 194, 179, 0.3)'
          }}>
            {touristUser?.name?.charAt(0)?.toUpperCase() || 'T'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, color: '#fff' }}>
                {touristUser?.name || 'Turista Experience Safely'}
              </h2>
              <span style={{
                background: 'rgba(0, 194, 179, 0.15)', color: '#00C2B3',
                padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '700'
              }}>
                ✓ Verified Tourist
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>
              {touristUser?.email || 'turista@experiencesafely.com'}
            </p>
          </div>
        </div>

        <button 
          onClick={onBackToCatalog}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} /> {language === 'es' ? 'Explorar Más Tours' : 'Explore More Tours'}
        </button>
      </div>

      {/* Tabs Bar */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '12px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'bookings', icon: Ticket, label: language === 'es' ? 'Mis Reservas & Pases' : 'My Bookings & Passes', count: userBookings.length },
          { id: 'calendar', icon: Calendar, label: language === 'es' ? 'Mi Calendario' : 'My Calendar' },
          { id: 'chat', icon: MessageSquare, label: language === 'es' ? 'Bandeja de Entrada' : 'Inbox / Messages' },
          { id: 'notifications', icon: Bell, label: language === 'es' ? 'Notificaciones' : 'Notifications', count: userBookings.length > 0 ? 2 : 0 },
          { id: 'profile', icon: User, label: language === 'es' ? 'Mi Información' : 'My Profile' },
          { id: 'reviews', icon: Star, label: language === 'es' ? 'Mis Reseñas' : 'My Reviews' },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: isActive ? 'linear-gradient(135deg, #00C2B3, #00a89b)' : 'rgba(255,255,255,0.04)',
                border: isActive ? 'none' : '1px solid rgba(255,255,255,0.08)',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                padding: '10px 18px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              {tab.label}
              {tab.count > 0 && (
                <span style={{
                  background: isActive ? '#fff' : '#FF6B4D',
                  color: isActive ? '#00C2B3' : '#fff',
                  borderRadius: '10px', padding: '1px 6px', fontSize: '0.7rem', fontWeight: '800'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {userBookings.length === 0 ? (
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center', borderRadius: '20px' }}>
              <Ticket size={48} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: '16px' }} />
              <h3 style={{ color: '#fff', margin: '0 0 8px' }}>
                {language === 'es' ? 'Aún no tienes reservas activas' : 'No active bookings yet'}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '24px' }}>
                {language === 'es' ? 'Explora nuestro catálogo de experiencias verificadas y vive Yucatán de forma totalmente segura.' : 'Explore our catalog of verified experiences and experience Yucatan safely.'}
              </p>
              <button onClick={onBackToCatalog} className="btn btn-primary">
                {language === 'es' ? 'Ver Experiencias Disponibles' : 'View Available Experiences'}
              </button>
            </div>
          ) : (
            userBookings.map(b => {
              const exp = getExp(b.experienceId);
              return (
                <div key={b.id} className="glass-card" style={{
                  padding: '24px', borderRadius: '20px',
                  display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center',
                  background: 'rgba(21, 38, 63, 0.7)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <img 
                    src={exp.image || '/hero_yucatan.jpg'} 
                    alt={b.experienceName} 
                    style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '12px' }}
                  />
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{
                        background: 'rgba(0, 194, 179, 0.15)', color: '#00C2B3',
                        padding: '2px 8px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: '700'
                      }}>
                        ✓ Garantía Safely Activa
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                        ID: #{b.id}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', margin: '0 0 6px' }}>
                      {b.experienceName}
                    </h3>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} style={{ color: '#00C2B3' }} /> {b.date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={14} style={{ color: '#00C2B3' }} /> {b.guests} {language === 'es' ? 'personas' : 'guests'}
                      </span>
                      <span style={{ fontWeight: '700', color: '#FF6B4D' }}>
                        ${b.totalPaid?.toLocaleString()} MXN
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={() => { setSelectedBookingForChat(b); setActiveTab('chat'); }}
                      className="btn btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <MessageSquare size={14} /> {language === 'es' ? 'Chat Proveedor' : 'Chat Provider'}
                    </button>

                    <button 
                      onClick={() => setReviewModalExpId(b.experienceId)}
                      className="btn btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,200,87,0.1)', color: '#FFC857', border: '1px solid rgba(255,200,87,0.3)' }}
                    >
                      <Star size={14} /> {language === 'es' ? 'Dejar Reseña' : 'Leave Review'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 1.5: CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="glass-card" style={{ padding: '28px', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} style={{ color: '#00C2B3' }} />
            {language === 'es' ? 'Mi Agenda de Experiencias Programadas' : 'My Scheduled Experiences Calendar'}
          </h3>

          {userBookings.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem' }}>
              {language === 'es' ? 'No tienes actividades programadas en el calendario.' : 'No scheduled activities in your calendar.'}
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {userBookings.map(b => (
                <div key={b.id} style={{
                  background: 'rgba(0, 194, 179, 0.08)', border: '1px solid rgba(0, 194, 179, 0.25)',
                  borderRadius: '16px', padding: '16px'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#00C2B3', fontWeight: '700', marginBottom: '4px' }}>
                    📅 {b.date}
                  </div>
                  <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem', marginBottom: '6px' }}>
                    {b.experienceName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                    👤 {b.guests} {language === 'es' ? 'personas' : 'guests'} • Pase #{b.id}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            {
              id: 1,
              title: language === 'es' ? '🛡️ Certificado de Garantía Emitido' : '🛡️ Safety Warranty Pass Issued',
              desc: language === 'es' ? 'Tu reserva cuenta con seguro contra mal clima y guía certificado en primeros auxilios.' : 'Your booking has bad weather protection and certified first-aid guide.',
              time: 'Hace 10 min'
            },
            {
              id: 2,
              title: language === 'es' ? '📍 Instrucciones de Punto de Encuentro' : '📍 Meeting Point Instructions',
              desc: language === 'es' ? 'Por favor llega 15 minutos antes con traje de baño y bloqueador biodegradable.' : 'Please arrive 15 minutes before with swimwear and biodegradable sunscreen.',
              time: 'Hace 1 hora'
            }
          ].map(n => (
            <div key={n.id} className="glass-card" style={{ padding: '16px 20px', borderRadius: '16px', borderLeft: '4px solid #00C2B3' }}>
              <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#fff', marginBottom: '4px' }}>{n.title}</div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>{n.desc}</div>
              <div style={{ fontSize: '0.7rem', color: '#00C2B3', marginTop: '6px' }}>{n.time}</div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: CHAT WITH PROVIDER */}
      {activeTab === 'chat' && (
        <div className="glass-card" style={{ padding: '24px', borderRadius: '20px', height: '480px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} style={{ color: '#00C2B3' }} /> 
            {language === 'es' ? 'Diálogo Directo con la Empresa Operadora' : 'Direct Chat with Tour Operator'}
          </h3>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '8px' }}>
            {(!selectedBookingForChat && userBookings.length > 0) && (
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                {language === 'es' ? 'Selecciona una reserva arriba o escribe directamente aquí:' : 'Select a booking above or type directly here:'}
              </p>
            )}

            {(chatMessages[selectedBookingForChat?.id || 'default'] || [
              { id: '1', sender: 'provider', text: language === 'es' ? '¡Hola! Bienvenido a Experience Safely. ¿Tienes alguna duda sobre tu viaje?' : 'Hi! Welcome to Experience Safely. Any questions about your upcoming tour?', timestamp: '10:00 AM' }
            ]).map(m => (
              <div key={m.id} style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '75%',
                padding: '10px 14px',
                borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                background: m.sender === 'user' ? 'linear-gradient(135deg, #FF6B4D, #e55a3f)' : 'rgba(255,255,255,0.08)',
                color: '#fff',
                fontSize: '0.85rem'
              }}>
                <div>{m.text}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.6, marginTop: '4px', textAlign: 'right' }}>{m.timestamp}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <input 
              type="text"
              className="form-input"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage(selectedBookingForChat?.id || 'default')}
              placeholder={language === 'es' ? 'Escribe una pregunta para la empresa...' : 'Type a question for the operator...'}
              style={{ flex: 1 }}
            />
            <button 
              onClick={() => handleSendMessage(selectedBookingForChat?.id || 'default')}
              className="btn btn-primary" 
              style={{ padding: '10px 16px' }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* TAB 4.5: PROFILE INFO */}
      {activeTab === 'profile' && (
        <div className="glass-card" style={{ padding: '28px', borderRadius: '20px', maxWidth: '600px' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#fff', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} style={{ color: '#00C2B3' }} />
            {language === 'es' ? 'Mi Información Personal & Configuración' : 'My Personal Information & Settings'}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="form-label">{language === 'es' ? 'Nombre Completo' : 'Full Name'}</label>
              <input 
                type="text" className="form-input" 
                value={touristUser?.name || ''} 
                readOnly
                style={{ width: '100%', opacity: 0.9 }}
              />
            </div>

            <div>
              <label className="form-label">{language === 'es' ? 'Correo Electrónico' : 'Email Address'}</label>
              <input 
                type="email" className="form-input" 
                value={touristUser?.email || ''} 
                readOnly
                style={{ width: '100%', opacity: 0.9 }}
              />
            </div>

            <div>
              <label className="form-label">{language === 'es' ? 'Teléfono Móvil (WhatsApp)' : 'Mobile Phone'}</label>
              <input 
                type="tel" className="form-input" 
                value={touristUser?.phone || '+52 999 123 4567'} 
                readOnly
                style={{ width: '100%', opacity: 0.9 }}
              />
            </div>

            <div style={{
              background: 'rgba(0, 194, 179, 0.08)', border: '1px solid rgba(0, 194, 179, 0.2)',
              borderRadius: '12px', padding: '12px 16px', fontSize: '0.8rem', color: '#00C2B3', marginTop: '8px'
            }}>
              ✓ {language === 'es' ? 'Cuenta verificada con protocolo de seguridad Safely' : 'Verified account under Safely protocol'}
            </div>
          </div>
        </div>
      )}
      {activeTab === 'reviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
            {language === 'es' ? 'Aquí se muestran tus reseñas enviadas sobre las experiencias vividas:' : 'Here are your submitted reviews for experiences:'}
          </p>

          <div className="glass-card" style={{ padding: '20px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontWeight: '700', color: '#fff' }}>Cenote Sagrado y Cavernas Mayas</span>
              <div style={{ color: '#FFC857', fontSize: '0.85rem' }}>⭐⭐⭐⭐⭐ (5/5)</div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              "¡Una experiencia increíble y súper segura! El guía nos dio equipo impecable y chalecos salvavidas certificados."
            </p>
          </div>
        </div>
      )}

      {/* Review Form Modal */}
      {reviewModalExpId && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '16px'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '28px', borderRadius: '20px', background: '#15263F' }}>
            <h3 style={{ color: '#fff', margin: '0 0 16px' }}>{language === 'es' ? 'Dejar Reseña del Servicio' : 'Leave Service Review'}</h3>
            <form onSubmit={handleRatingSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">{language === 'es' ? 'Calificación:' : 'Rating:'}</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} type="button" 
                      onClick={() => setReviewRating(star)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: star <= reviewRating ? '#FFC857' : 'rgba(255,255,255,0.2)' }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="form-label">{language === 'es' ? 'Tu Opinión:' : 'Your Feedback:'}</label>
                <textarea 
                  className="form-input" 
                  rows="3" 
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder={language === 'es' ? '¿Cómo fue la seguridad y atención del tour?' : 'How was the safety and service?'}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setReviewModalExpId(null)} className="btn btn-secondary" style={{ flex: 1 }}>
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {language === 'es' ? 'Publicar' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
