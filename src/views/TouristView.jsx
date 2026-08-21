import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import AuthModal from '../components/AuthModal';
import TouristDashboard from '../components/TouristDashboard';
import ProviderRegisterModal from '../components/ProviderRegisterModal';
import { 
  Search, Calendar, Users, MapPin, Star, ShieldCheck, CheckCircle2, 
  ArrowLeft, CreditCard, Clock, Phone, Mail, Award, X, Sparkles, Ticket, Building2
} from 'lucide-react';

export default function TouristView() {
  const context = useContext(AppContext) || {};
  const { 
    experiences = [], 
    calendarAvailability = {}, 
    bookExperience = () => {}, 
    dates = [],
    language = 'es',
    t = (k) => k,
    categories = [],
    addExperienceReview = () => {},
    touristUser = null,
    bookings = [],
    siteDesign = {}
  } = context;
  
  // UI States
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'dashboard'
  const [showProviderRegModal, setShowProviderRegModal] = useState(false);
  const [selectedExpId, setSelectedExpId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterGuests, setFilterGuests] = useState(1);
  
  // Booking Form States
  const [bookingStep3Data, setBookingStep3Data] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingGuests, setBookingGuests] = useState(1);
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [selectedHours, setSelectedHours] = useState(4);
  const [touristName, setTouristName] = useState('');
  const [touristEmail, setTouristEmail] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Tarjeta de Crédito');
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1 = Details, 2 = Payment, 3 = Ticket
  const [successBooking, setSuccessBooking] = useState(null);

  // New Review Form States
  const [newRevAuthor, setNewRevAuthor] = useState('');
  const [newRevComment, setNewRevComment] = useState('');
  const [newRevRating, setNewRevRating] = useState(5);

  // Sync tourist user data from Google/Session
  React.useEffect(() => {
    if (touristUser) {
      if (touristUser.name) setTouristName(touristUser.name);
      if (touristUser.email) setTouristEmail(touristUser.email);
    }
  }, [touristUser]);

  const selectedExp = (experiences || []).find(e => e.id === selectedExpId);

  // Helper to fetch day price
  const getDisplayPrice = (exp) => {
    if (filterDate && calendarAvailability[exp.id]?.[filterDate]) {
      return calendarAvailability[exp.id][filterDate].price;
    }
    return exp.price;
  };

  const handleOpenDetail = (id) => {
    setSelectedExpId(id);
    setBookingDate(filterDate || (dates && dates[0]) || '');
    setBookingGuests(filterGuests || 1);
    setCheckoutStep(1);
    setShowCheckout(false);
  };

  const handleStartBooking = () => {
    if (!bookingDate) {
      alert(language === 'es' ? 'Por favor selecciona una fecha disponible en el calendario.' : 'Please select an available date on the calendar.');
      return;
    }
    if (!touristUser) {
      setShowAuthModal(true);
      return;
    }
    setShowCheckout(true);
    setCheckoutStep(1);
  };

  const handleConfirmBooking = () => {
    if (!touristName || !touristEmail) {
      alert(language === 'es' ? 'Por favor completa todos los campos.' : 'Please fill in all fields.');
      return;
    }
    
    if (checkoutStep === 1) {
      setCheckoutStep(2);
      return;
    }

    // Process simulation
    const result = bookExperience(selectedExp.id, bookingDate, bookingGuests, touristName, touristEmail, paymentMethod);
    if (result && result.success) {
      setSuccessBooking(result.booking);
      setCheckoutStep(3);
    } else {
      alert(`${language === 'es' ? 'Error al reservar' : 'Booking error'}: ${result?.error || 'Desconocido'}`);
    }
  };

  const handleCloseDetail = () => {
    setSelectedExpId(null);
    setSuccessBooking(null);
    setShowCheckout(false);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (newRevAuthor.trim() && newRevComment.trim()) {
      addExperienceReview(selectedExpId, {
        author: newRevAuthor.trim(),
        comment: newRevComment.trim(),
        rating: newRevRating,
        source: 'Turista Verificado'
      });
      setNewRevAuthor('');
      setNewRevComment('');
      setNewRevRating(5);
      alert(language === 'es' ? '¡Gracias por compartir tu reseña!' : 'Thank you for sharing your review!');
    }
  };

  // Filtering Logic
  const filteredExperiences = (experiences || []).filter(exp => {
    // 1. Category Filter
    if (filterCategory !== 'todos' && exp.category !== filterCategory) return false;
    
    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = exp.name.toLowerCase().includes(q);
      const matchDesc = exp.description.toLowerCase().includes(q);
      const matchLoc = exp.location.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchLoc) return false;
    }
    
    // 3. Date & Capacity Filter
    if (filterDate) {
      const slot = calendarAvailability[exp.id]?.[filterDate];
      if (slot) {
        const spotsLeft = slot.capacity - slot.booked;
        if (spotsLeft < filterGuests) return false;
      } else {
        if (exp.capacity < filterGuests) return false;
      }
    }
    
    return true;
  });

  return (
    <div className="tourist-view">
      {/* Top Banner Navigation for Logged Tourist / Provider Request */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '16px', flexWrap: 'wrap', gap: '12px'
      }}>
        {touristUser ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`btn ${activeTab === 'catalog' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.82rem', padding: '8px 16px' }}
            >
              {language === 'es' ? '🏖️ Catálogo de Tours' : '🏖️ Tours Catalog'}
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.82rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Ticket size={16} /> {language === 'es' ? 'Mis Reservas & Panel' : 'My Bookings & Panel'}
            </button>
          </div>
        ) : <div />}

        <button
          onClick={() => setShowProviderRegModal(true)}
          style={{
            background: 'rgba(255, 200, 87, 0.1)', border: '1px solid rgba(255, 200, 87, 0.3)',
            color: '#FFC857', padding: '6px 14px', borderRadius: '20px',
            fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto'
          }}
        >
          <Building2 size={14} />
          {language === 'es' ? '¿Eres Empresa de Tours? Registra tu Agencia' : 'Are you a Tour Company? Register Here'}
        </button>
      </div>

      {activeTab === 'dashboard' ? (
        <TouristDashboard onBackToCatalog={() => setActiveTab('catalog')} />
      ) : !selectedExp ? (
        // CATALOG / SEARCH MODE
        <>
          {/* Hero Banner */}
          <div className="hero-banner glass-card" style={{
            padding: '60px 40px',
            marginBottom: '40px',
            background: 'transparent',
            borderRadius: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background Media: Video Loop MP4 vs Ken Burns Animated Image */}
            {siteDesign?.heroMediaType === 'video' && siteDesign?.heroVideo ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                onError={(e) => {
                  console.warn("Video failed to play, switching fallback background");
                  e.currentTarget.style.display = 'none';
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 0
                }}
                src={siteDesign.heroVideo}
              />
            ) : null}

            {/* Ken Burns Animated Image (Default & Fallback) */}
            {(!siteDesign?.heroMediaType || siteDesign?.heroMediaType === 'image' || !siteDesign?.heroVideo) && (
              <div className="hero-ken-burns" style={{
                position: 'absolute',
                top: '-10%',
                left: '-10%',
                width: '120%',
                height: '120%',
                backgroundImage: `url("${siteDesign?.heroImage || '/hero_yucatan.jpg'}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                animation: 'kenBurns 25s ease-in-out infinite alternate',
                zIndex: 0
              }} />
            )}

            {/* Light semi-transparent overlay for text readability without darkening background */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(13, 24, 42, 0.45), rgba(21, 38, 63, 0.25))',
              zIndex: 1
            }} />
            <div className="hero-glow hero-glow-breathing" style={{
              position: 'absolute',
              top: '-50%',
              right: '-20%',
              width: '500px',
              height: '500px',
              background: 'radial-gradient(circle, rgba(0, 194, 179, 0.22) 0%, rgba(0,0,0,0) 70%)',
              pointerEvents: 'none',
              zIndex: 2
            }}></div>

            <div style={{ maxWidth: '700px', position: 'relative', zIndex: 2 }}>
              <div className="shimmer-badge animate-float" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#FF6B4D', padding: '7px 16px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '20px', boxShadow: '0 4px 16px rgba(255, 107, 77, 0.25)' }}>
                <Award size={14} /> {language === 'es' ? 'La forma más segura de vivir Yucatán' : 'The safest way to experience Yucatan'}
              </div>
              <h1 style={{ fontSize: '2.5rem', lineHeight: '1.2', marginBottom: '16px' }}>
                {language === 'es' ? 'Sentirse vivo con' : 'Feel alive with'}
                <br />
                <span style={{ color: '#00C2B3' }}>{language === 'es' ? 'Experiencias seguras' : 'Safe Experiences'}</span>
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', marginBottom: '32px' }}>
                {t('heroSubtitle')}
              </p>
            </div>

            {/* Global Search Bar */}
            <div className="search-bar glass-card animate-fade-in-up" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '20px',
              background: 'rgba(13, 24, 42, 0.9)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.15)',
              position: 'relative',
              zIndex: 2,
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
              alignItems: 'flex-end'
            }}>
              <div className="form-group" style={{ flex: '1 1 250px', marginBottom: 0 }}>
                <label className="form-label">{language === 'es' ? '¿Qué buscas?' : 'Search experiences'}</label>
                <div style={{ position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--color-text-muted)' }} />
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder={t('searchPlace')} 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '40px', width: '100%' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ flex: '1 1 160px', marginBottom: 0 }}>
                <label className="form-label">{language === 'es' ? 'Fecha de Visita' : 'Date of Visit'}</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--color-text-muted)', pointerEvents: 'none', zIndex: 1 }} />
                  <input 
                    type="date"
                    className="form-input"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    style={{ paddingLeft: '40px', width: '100%', colorScheme: 'dark' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ flex: '1 1 140px', marginBottom: 0 }}>
                <label className="form-label">{language === 'es' ? 'Personas' : 'Guests'}</label>
                <div style={{ position: 'relative' }}>
                  <Users size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--color-text-muted)' }} />
                  <select 
                    className="form-select"
                    value={filterGuests}
                    onChange={(e) => setFilterGuests(parseInt(e.target.value))}
                    style={{ paddingLeft: '40px', width: '100%' }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 15, 20].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? (language === 'es' ? 'persona' : 'guest') : (language === 'es' ? 'personas' : 'guests')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                className="btn btn-primary"
                onClick={() => {}}
                style={{ flex: '1 1 140px', height: '46px', fontWeight: '700' }}
              >
                {t('btnFilter')}
              </button>
            </div>
          </div>

          {/* Category Filter Pills Bar (Spaced cleanly without clipping) */}
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            overflowX: 'auto', 
            padding: '14px 8px 20px 8px', 
            marginTop: '24px', 
            marginBottom: '32px',
            alignItems: 'center'
          }}>
            {(categories || []).map(cat => {
              const label = language === 'es' 
                ? cat.label 
                : cat.id === 'todos' ? 'All' : cat.id === 'cenotes' ? 'Cenotes' : cat.id === 'haciendas' ? 'Haciendas' : cat.id === 'barcos' ? 'Boats & Marinas' : cat.id === 'holisticas' ? 'Wellness' : cat.id === 'restaurantes' ? 'Gastronomy' : cat.id === 'hoteles' ? 'Hotels' : cat.id === 'spas' ? 'Spas' : cat.label;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`btn btn-sm category-pill ${filterCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
                  style={{ whiteSpace: 'nowrap', borderRadius: '30px', padding: '10px 20px', fontSize: '0.85rem' }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Catalog Cards Grid */}
          {filteredExperiences.length === 0 ? (
            <div className="glass-card animate-fade-in-up" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>{t('noExpFound')}</p>
              <button className="btn btn-outline" onClick={() => { setSearchQuery(''); setFilterCategory('todos'); setFilterDate(''); }}>{t('btnClearFilters')}</button>
            </div>
          ) : (
            <div className="grid-cards">
              {filteredExperiences.map((exp, idx) => {
                const displayPrice = getDisplayPrice(exp);
                const isPackage = exp.pricingType === 'package';
                const staggerClass = `stagger-${(idx % 4) + 1}`;
                return (
                  <div key={exp.id} className={`glass-card animate-fade-in-up ${staggerClass}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Image / Category */}
                    <div className="card-img-wrapper" style={{ height: '200px', width: '100%' }}>
                      <div className="card-img-animated" style={{ background: `linear-gradient(to bottom, transparent, rgba(13,24,42,0.9)), url(${exp.image || '/branding_2.jpg'})` }} />
                      <span className="badge badge-teal" style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
                        {exp.category}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ display: 'flex', gap: '4px', color: 'var(--color-gold)', marginBottom: '8px' }}>
                        <Star size={14} fill="var(--color-gold)" style={{ color: 'var(--color-gold)' }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{exp.rating}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>({exp.reviewsCount} {t('reviewsCountLabel')})</span>
                      </div>
                      
                      <h3 style={{ fontSize: '1.15rem', marginBottom: '8px', lineHeight: '1.3' }}>{exp.name}</h3>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                        <MapPin size={12} /> {exp.location}, Yucatán
                      </div>

                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '16px', flex: 1 }}>
                        {exp.description}
                      </p>

                      {/* Safety Badges Preview */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                        {(exp.safetyBadges || []).slice(0, 2).map((b, i) => (
                          <span key={i} style={{ fontSize: '0.65rem', background: 'rgba(255, 107, 77, 0.08)', color: 'var(--color-coral)', border: '1px solid rgba(255, 107, 77, 0.2)', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                            {b}
                          </span>
                        ))}
                      </div>

                      {/* Pricing & CTA */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                        <div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>
                            {isPackage ? (language === 'es' ? 'Paquete Completo desde' : 'Package From') : (language === 'es' ? 'Entrada General desde' : 'Ticket From')}
                          </span>
                          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--color-text-light)' }}>
                            ${displayPrice.toLocaleString('es-MX')} <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>MXN</span>
                          </span>
                        </div>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          onClick={() => setSelectedExpId(exp.id)}
                          style={{ borderRadius: '10px', fontWeight: '700' }}
                        >
                          {t('btnViewDetails')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* DETAIL VIEW OF SELECTED EXPERIENCE */
        <div className="container" style={{ paddingTop: '20px', paddingBottom: '60px' }}>
            <button 
              className="btn btn-outline btn-sm" 
              onClick={() => setSelectedExpId(null)}
              style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <ArrowLeft size={16} /> {t('backToCatalog')}
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
              {/* Left Detail Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Hero Header Card */}
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                  <div style={{ height: '320px', position: 'relative' }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      backgroundImage: `linear-gradient(to bottom, transparent 30%, rgba(13,24,42,0.95)), url(${selectedExp.image || '/branding_1.jpg'})`,
                      backgroundSize: 'cover', backgroundPosition: 'center'
                    }} />
                    <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
                      <span className="badge badge-teal" style={{ marginBottom: '12px' }}>{selectedExp.category}</span>
                      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: '1.2', color: '#fff' }}>{selectedExp.name}</h1>
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                        <MapPin size={14} /> {selectedExp.location}, Yucatán
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ padding: '16px 24px', background: 'rgba(13, 24, 42, 0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      🔒 {language === 'es' ? 'Socio Verificado con Auditoría de Seguridad Activa' : 'Verified Partner with Active Safety Audit'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: 'var(--color-gold)' }}>
                      <Star size={16} fill="var(--color-gold)" style={{ color: 'var(--color-gold)' }} /> {selectedExp.rating} ({selectedExp.reviewsCount} {t('reviewsCountLabel')})
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="glass-card" style={{ padding: '24px' }}>
                  <h3 style={{ marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>{t('descriptionLabel')}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.7' }}>{selectedExp.description}</p>
                </div>

                {/* Observaciones & Recomendaciones de Seguridad */}
                <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(0, 194, 179, 0.4)', background: 'rgba(0, 194, 179, 0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-teal-light)', marginBottom: '16px' }}>
                    <ShieldCheck size={24} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0 }}>
                      📋 {language === 'es' ? 'Observaciones & Recomendaciones de Seguridad' : 'Safety Observations & Recommendations'}
                    </h3>
                  </div>
                  
                  <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', marginBottom: '16px', lineHeight: '1.6' }}>
                    {selectedExp.safetyDescription}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    {(selectedExp.safetyBadges || []).map((badge, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                        <CheckCircle2 size={15} className="text-teal" style={{ color: 'var(--color-teal-light)' }} />
                        <span>{badge}</span>
                      </div>
                    ))}
                  </div>

                  {/* Cuidados Recomendados para el Viajero */}
                  <div style={{ background: 'rgba(13, 24, 42, 0.6)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid #00C2B3' }}>
                    <h4 style={{ fontSize: '0.88rem', color: '#00C2B3', margin: '0 0 8px 0', fontWeight: '700' }}>
                      💡 {language === 'es' ? 'Cuidados Específicos para tu Visita:' : 'Important Visitor Care:'}
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                      <li>🌿 <strong>Preservación Ambiental:</strong> Utiliza únicamente protector solar y repelente 100% biodegradable. Pasa a la regadera previa antes de ingresar al agua.</li>
                      <li>🦺 <strong>Uso de Equipo:</strong> El uso del chaleco salvavidas certificado es obligatorio en zonas de cenotes y cuerpo de agua.</li>
                      <li>👟 <strong>Calzado Aconsejado:</strong> Se sugiere calzado acuático antiderrapante para senderos húmedos de piedra o escaleras.</li>
                      <li>⏰ <strong>Tolerancia:</strong> Presentarse 15 minutos antes de la hora de su reservación.</li>
                    </ul>
                  </div>
                </div>
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={20} fill="var(--color-gold)" style={{ color: 'var(--color-gold)' }} /> {t('reviewsTitle')}
                </h3>
                
                {/* Reviews List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  {(!selectedExp.reviews || selectedExp.reviews.length === 0) ? (
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>{t('noReviews')}</p>
                  ) : (
                    selectedExp.reviews.map((rev) => (
                      <div key={rev.id} style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>{rev.author}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                            {rev.source ? `${t('socialImport')} ${rev.source}` : t('verifiedTourist')} | {rev.date}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '2px', color: 'var(--color-gold)', marginBottom: '6px' }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={12} fill={i < rev.rating ? 'var(--color-gold)' : 'transparent'} style={{ color: 'var(--color-gold)' }} />
                          ))}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Verified Review System & Form */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px', marginTop: '24px' }}>
                  {(() => {
                    const hasVerifiedBooking = touristUser && (bookings || []).some(b => 
                      b.experienceId === selectedExp.id && 
                      (b.touristEmail === touristUser.email || touristUser.provider === 'google' || b.touristName === touristUser.name)
                    );

                    if (!hasVerifiedBooking) {
                      return (
                        <div style={{
                          background: 'rgba(13, 24, 42, 0.75)',
                          border: '1px solid rgba(0, 194, 179, 0.25)',
                          borderRadius: '16px',
                          padding: '24px 20px',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '10px'
                        }}>
                          <div style={{ background: 'rgba(0, 194, 179, 0.12)', color: '#00C2B3', padding: '10px', borderRadius: '50%', display: 'inline-flex' }}>
                            <ShieldCheck size={26} />
                          </div>
                          <h4 style={{ margin: 0, fontSize: '0.98rem', color: '#fff', fontWeight: '700' }}>
                            {language === 'es' ? 'Reseñas Reservadas a Turistas Verificados' : 'Verified Guest Reviews Only'}
                          </h4>
                          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', maxWidth: '460px', margin: 0, lineHeight: '1.5' }}>
                            {language === 'es' 
                              ? 'Para garantizar opiniones reales y proteger a la comunidad en Experience Safely, solo los turistas que hayan reservado y vivido esta experiencia pueden publicar su calificación.' 
                              : 'To guarantee authentic reviews and maintain trust, only travelers who have booked and completed this experience can submit a rating.'}
                          </p>
                          {!touristUser && (
                            <button 
                              type="button"
                              className="btn btn-outline btn-sm" 
                              onClick={() => setIsAuthOpen(true)} 
                              style={{ marginTop: '8px', fontSize: '0.8rem', borderRadius: '20px' }}
                            >
                              {language === 'es' ? '🔑 Iniciar Sesión para Publicar Opinión' : '🔑 Log In to Submit Review'}
                            </button>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                          <ShieldCheck size={18} color="#00C2B3" />
                          <h4 style={{ fontSize: '1rem', margin: 0 }}>{t('addReviewTitle')}</h4>
                          <span style={{ fontSize: '0.7rem', background: 'rgba(0,194,179,0.15)', color: '#00C2B3', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
                            {language === 'es' ? '✓ Reserva Verificada' : '✓ Verified Booking'}
                          </span>
                        </div>

                        <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                            <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column' }}>
                              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                                {t('reviewName')}
                              </label>
                              <input 
                                type="text" 
                                className="form-input" 
                                placeholder="Ej. Juan Pérez"
                                value={newRevAuthor || touristUser?.name || ''}
                                onChange={e => setNewRevAuthor(e.target.value)}
                                required
                                style={{ width: '100%', height: '42px', margin: 0 }}
                              />
                            </div>
                            <div style={{ flex: '0 0 160px', display: 'flex', flexDirection: 'column' }}>
                              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                                {t('reviewRating')}
                              </label>
                              <select 
                                className="form-select"
                                value={newRevRating}
                                onChange={e => setNewRevRating(Number(e.target.value))}
                                style={{ width: '100%', height: '42px', margin: 0 }}
                              >
                                <option value="5">⭐⭐⭐⭐⭐ 5/5</option>
                                <option value="4">⭐⭐⭐⭐ 4/5</option>
                                <option value="3">⭐⭐⭐ 3/5</option>
                                <option value="2">⭐⭐ 2/5</option>
                                <option value="1">⭐ 1/5</option>
                              </select>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                              {t('reviewComment')}
                            </label>
                            <textarea 
                              className="form-input" 
                              rows="3" 
                              style={{ width: '100%', resize: 'vertical', minHeight: '80px', margin: 0 }}
                              placeholder={language === 'es' ? 'Escribe aquí tu opinión sobre la seguridad, el servicio y tu experiencia...' : 'Write your comment here about safety, service and experience...'}
                              value={newRevComment}
                              onChange={e => setNewRevComment(e.target.value)}
                              required
                            />
                          </div>

                          <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start', padding: '10px 22px', fontWeight: '700' }}>
                            {t('btnSubmitReview')}
                          </button>
                        </form>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Right Booking Column */}
            <div>
              <div className="glass-card" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '1.2rem' }}>{language === 'es' ? 'Reserva tu experiencia' : 'Book experience'}</h3>
                
                {/* 1. Interactive Calendar Date Picker */}
                <div className="form-group">
                  <label className="form-label">{language === 'es' ? 'Selecciona Fecha' : 'Select Date'}</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', marginTop: '8px' }}>
                    {(dates || []).slice(0, 10).map((d) => {
                      const slot = calendarAvailability[selectedExp.id]?.[d] || { price: selectedExp.price, capacity: selectedExp.capacity, booked: 0 };
                      const spotsLeft = slot.capacity - slot.booked;
                      const isSoldOut = spotsLeft <= 0;
                      const isSelected = bookingDate === d;
                      
                      let dayName = d;
                      let dayNum = '';
                      try {
                        const dObj = new Date(d + 'T00:00:00');
                        dayName = dObj.toLocaleDateString(language === 'es' ? 'es-MX' : 'en-US', { weekday: 'short' });
                        dayNum = dObj.getDate();
                      } catch (e) {}

                      return (
                        <button
                          key={d}
                          onClick={() => { if (!isSoldOut) setBookingDate(d); }}
                          disabled={isSoldOut}
                          style={{
                            background: isSelected ? 'rgba(0, 194, 179, 0.2)' : isSoldOut ? 'rgba(255, 107, 77, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                            border: `1px solid ${isSelected ? 'var(--color-teal-light)' : isSoldOut ? 'var(--color-coral)' : 'var(--color-border)'}`,
                            color: isSoldOut ? 'var(--color-coral)' : 'var(--color-text-light)',
                            borderRadius: '8px',
                            padding: '6px',
                            cursor: isSoldOut ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            opacity: isSoldOut ? 0.4 : 1,
                            transition: 'var(--transition-smooth)'
                          }}
                        >
                          <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: isSelected ? 'var(--color-teal-light)' : 'var(--color-text-muted)' }}>{dayName}</span>
                          <span style={{ fontSize: '1rem', fontWeight: '700', margin: '2px 0' }}>{dayNum}</span>
                          <span style={{ fontSize: '0.55rem', fontWeight: '600' }}>
                            {isSoldOut ? (language === 'es' ? 'Agotado' : 'Full') : `$${(slot.price/1000).toFixed(1)}k`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Selected Date Summary */}
                {bookingDate && (
                  <div style={{ margin: '16px 0', padding: '12px', background: 'rgba(0, 194, 179, 0.05)', border: '1px dashed rgba(0, 194, 179, 0.3)', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>{language === 'es' ? 'Tarifa del día:' : 'Daily rate:'}</span>
                      <strong style={{ color: 'var(--color-teal-light)' }}>
                        ${((calendarAvailability[selectedExp.id]?.[bookingDate]?.price || selectedExp.price)).toLocaleString('es-MX')} MXN
                      </strong>
                    </div>
                  </div>
                )}

                {/* 3. DYNAMIC MODALITY FIELDS BASED ON GIRO / BOOKINGTYPE */}
                
                {/* A) EVENT GIRO: ZONE / TABLE SELECTOR */}
                {selectedExp.bookingType === 'event' && selectedExp.eventZones?.length > 0 && (
                  <div className="form-group" style={{ margin: '16px 0' }}>
                    <label className="form-label" style={{ color: '#00C2B3' }}>🎟️ {language === 'es' ? 'Selecciona tu Zona o Mesa:' : 'Select Zone or Table:'}</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedExp.eventZones.map(zone => {
                        const isZoneSelected = selectedZoneId === zone.id || (!selectedZoneId && zone.id === selectedExp.eventZones[0].id);
                        return (
                          <div 
                            key={zone.id}
                            onClick={() => setSelectedZoneId(zone.id)}
                            style={{
                              background: isZoneSelected ? 'rgba(0, 194, 179, 0.15)' : 'rgba(255,255,255,0.03)',
                              border: `1px solid ${isZoneSelected ? '#00C2B3' : 'rgba(255,255,255,0.1)'}`,
                              borderRadius: '10px', padding: '10px 14px', cursor: 'pointer',
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#fff' }}>{zone.name}</div>
                              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>
                                {zone.type === 'table' ? (language === 'es' ? `Incluye mesa completa hasta ${zone.capacity} asientos` : `Includes full table up to ${zone.capacity} seats`) : (language === 'es' ? 'Acceso individual por persona' : 'Individual pass per guest')}
                              </div>
                            </div>
                            <strong style={{ color: '#FF6B4D', fontSize: '0.95rem' }}>${zone.price.toLocaleString('es-MX')} MXN</strong>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* B) TOUR / CENOTE GIRO: TURN / SCHEDULE SELECTOR */}
                {(selectedExp.bookingType === 'tour' || selectedExp.category === 'cenotes') && (
                  <div className="form-group" style={{ margin: '16px 0' }}>
                    <label className="form-label" style={{ color: '#00C2B3' }}>🕒 {language === 'es' ? 'Selecciona Turno / Horario de Entrada:' : 'Select Entry Schedule:'}</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {(selectedExp.schedules || ['09:00 AM', '12:00 PM', '03:00 PM']).map(sch => {
                        const isSchSelected = selectedSchedule === sch || (!selectedSchedule && sch === (selectedExp.schedules?.[0] || '09:00 AM'));
                        return (
                          <button
                            key={sch} type="button"
                            onClick={() => setSelectedSchedule(sch)}
                            style={{
                              background: isSchSelected ? '#00C2B3' : 'rgba(255,255,255,0.04)',
                              color: isSchSelected ? '#fff' : 'rgba(255,255,255,0.7)',
                              border: isSchSelected ? 'none' : '1px solid rgba(255,255,255,0.1)',
                              padding: '6px 14px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer'
                            }}
                          >
                            {sch}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* C) TRANSPORT / YACHT GIRO: UNIT SPECS */}
                {selectedExp.bookingType === 'transport' && selectedExp.transportOptions && (
                  <div style={{ background: 'rgba(255, 107, 77, 0.08)', border: '1px solid rgba(255, 107, 77, 0.25)', padding: '12px 14px', borderRadius: '10px', margin: '16px 0', fontSize: '0.82rem' }}>
                    <div style={{ fontWeight: '700', color: '#FF6B4D', marginBottom: '4px' }}>
                      🚗 {selectedExp.transportOptions.unitType}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>
                      • Capacidad máxima: <strong>{selectedExp.transportOptions.maxPassengers} pasajeros</strong><br/>
                      • Punto de recogida: <strong>{selectedExp.transportOptions.pickupLocation}</strong><br/>
                      • Incluye chofer/capitán certificado y hielera con bebidas.
                    </div>
                  </div>
                )}

                {/* 4. Guests Selector */}
                <div className="form-group">
                  <label className="form-label">{selectedExp.bookingType === 'transport' ? (language === 'es' ? 'Número de Pasajeros' : 'Number of Passengers') : t('guestsLabel')}</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    min="1" 
                    max={selectedExp.capacity} 
                    value={bookingGuests}
                    onChange={(e) => setBookingGuests(Math.max(1, Number(e.target.value)))}
                  />
                </div>

                {/* 4. Pricing Calculation */}
                {bookingDate && (
                  <div style={{ borderTop: '1px solid var(--color-border)', margin: '16px 0 24px 0', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600' }}>{language === 'es' ? 'Total a pagar:' : 'Total price:'}</span>
                      <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--color-coral)' }}>
                        ${(selectedExp.pricingType === 'package' 
                          ? ((calendarAvailability[selectedExp.id]?.[bookingDate]?.price || selectedExp.price)) 
                          : (((calendarAvailability[selectedExp.id]?.[bookingDate]?.price || selectedExp.price) * bookingGuests))
                        ).toLocaleString('es-MX')} MXN
                      </span>
                    </div>
                  </div>
                )}

                {/* 5. Book Button */}
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={handleStartBooking}
                  disabled={!bookingDate}
                >
                  <ShieldCheck size={18} /> {t('bookGuaranteed')}
                </button>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.7rem', marginTop: '12px' }}>
                  <span>🔒 {language === 'es' ? 'Pago encriptado' : 'Encrypted pay'}</span>
                  <span>•</span>
                  <span>🛡️ {language === 'es' ? 'Fianza reembolsable' : 'Free cancellation'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL WINDOW */}
      {showCheckout && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(13,24,42,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '550px', padding: '32px', position: 'relative' }}>
            
            {/* Close button */}
            {checkoutStep < 3 && (
              <button 
                onClick={() => setShowCheckout(false)} 
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            )}

            {/* Step Indicators */}
            {checkoutStep < 3 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
                <span style={{ height: '4px', width: '40px', background: checkoutStep >= 1 ? 'var(--color-teal-light)' : 'var(--color-border)', borderRadius: '2px' }}></span>
                <span style={{ height: '4px', width: '40px', background: checkoutStep >= 2 ? 'var(--color-teal-light)' : 'var(--color-border)', borderRadius: '2px' }}></span>
              </div>
            )}

            {checkoutStep === 1 && (
              // STEP 1: TOURIST DATA
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h2 style={{ fontSize: '1.4rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={20} style={{ color: 'var(--color-teal-light)' }} /> {language === 'es' ? 'Datos del Titular' : 'Traveler Details'}
                  </h2>
                  <button 
                    type="button" 
                    onClick={() => setShowAuthModal(true)}
                    style={{
                      background: 'rgba(66, 133, 244, 0.12)', border: '1px solid rgba(66, 133, 244, 0.3)',
                      color: '#4285F4', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem',
                      fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {touristUser ? (language === 'es' ? 'Cambiar cuenta de Google' : 'Switch Google account') : (language === 'es' ? 'Ingresar con Google' : 'Sign in with Google')}
                  </button>
                </div>

                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
                  {language === 'es' ? 'Ingresa los detalles para emitir tu boleto de garantía.' : 'Provide details to issue your secure guarantee pass.'}
                </p>

                <div className="form-group">
                  <label className="form-label">{t('nameLabel')}</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej. Juan Pérez"
                    value={touristName}
                    onChange={(e) => setTouristName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('emailLabel')}</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="juan@perez.com"
                    value={touristEmail}
                    onChange={(e) => setTouristEmail(e.target.value)}
                  />
                </div>

                {/* Checkbox for Legal Terms, Environmental Rules and Sobriety Clause */}
                <div style={{
                  marginTop: '20px', padding: '14px', borderRadius: '12px',
                  background: 'rgba(0, 194, 179, 0.06)', border: '1px solid rgba(0, 194, 179, 0.2)',
                  fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)'
                }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={acceptedTerms} 
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      style={{ marginTop: '3px', accentColor: '#00C2B3', width: '16px', height: '16px' }}
                    />
                    <span>
                      {language === 'es' 
                        ? 'Acepto los Términos de Garantía, el Aviso de Privacidad y confirmo que ningún integrante asistirá en estado de ebriedad o bajo efectos de sustancias (motivo de cancelación sin reembolso).' 
                        : 'I accept Warranty Terms, Privacy Policy, and confirm no participant will attend intoxicated (cancellation without refund applies).'}
                    </span>
                  </label>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary" onClick={() => setCheckoutStep(2)} disabled={!touristName || !touristEmail || !acceptedTerms}>
                    {t('btnNext')}
                  </button>
                </div>
              </div>
            )}

            {checkoutStep === 2 && (
              // STEP 2: SIMULATED PAYMENT
              <div>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={20} style={{ color: 'var(--color-teal-light)' }} /> {t('checkoutStep2')}
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
                  {language === 'es' ? 'El pago se resguarda bajo la garantía de seguridad de la plataforma.' : 'Payment is safely escrowed under our platform guarantee.'}
                </p>

                <div className="form-group">
                  <label className="form-label">{language === 'es' ? 'Método de Pago' : 'Payment Method'}</label>
                  <select 
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="Tarjeta de Crédito">{language === 'es' ? 'Tarjeta de Crédito / Débito (Visa, MC)' : 'Credit / Debit Card (Visa, MC)'}</option>
                    <option value="Transferencia Coppel Pay">Coppel Pay Transfer</option>
                    <option value="Mercado Pago">Mercado Pago</option>
                    <option value="Enlace de WhatsApp">{language === 'es' ? 'Agente Directo - Pago contra Entrega' : 'Direct Agent - Pay at Arrival'}</option>
                  </select>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)', margin: '20px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                    <span>{selectedExp.name}</span>
                    <span>
                      {selectedExp.pricingType === 'package' 
                        ? t('pricePackage') 
                        : `x${bookingGuests} ${language === 'es' ? 'personas' : 'guests'}`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.05rem', borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
                    <span>{language === 'es' ? 'Total a debitar:' : 'Total charge:'}</span>
                    <span style={{ color: 'var(--color-coral)' }}>
                      ${(selectedExp.pricingType === 'package' 
                        ? ((calendarAvailability[selectedExp.id]?.[bookingDate]?.price || selectedExp.price)) 
                        : (((calendarAvailability[selectedExp.id]?.[bookingDate]?.price || selectedExp.price) * bookingGuests))
                      ).toLocaleString('es-MX')} MXN
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
                  <button className="btn btn-outline" onClick={() => setCheckoutStep(1)}>
                    {language === 'es' ? 'Atrás' : 'Back'}
                  </button>
                  <button className="btn btn-secondary" onClick={handleConfirmBooking}>
                    {t('btnPay')}
                  </button>
                </div>
              </div>
            )}

            {checkoutStep === 3 && successBooking && (
              // STEP 3: PASS TICKET
              <div style={{ texttextalign: 'center' }} className="animate-fade-in">
                <div style={{ display: 'inline-flex', background: 'rgba(0,194,179,0.15)', color: 'var(--color-teal-light)', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
                  <ShieldCheck size={48} />
                </div>
                
                <h2 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '8px' }}>{t('successTitle')}</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
                  {t('successSub')}
                </p>

                {/* Ticket Pass UI */}
                <div style={{ background: 'var(--color-offwhite)', color: 'var(--color-text-dark)', padding: '24px', borderRadius: '16px', textAlign: 'left', position: 'relative', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', borderTop: '6px solid var(--color-coral)', marginBottom: '24px' }}>
                  
                  <div style={{ position: 'absolute', left: '-10px', top: '50%', width: '20px', height: '20px', background: 'var(--color-bg-dark)', borderRadius: '50%' }}></div>
                  <div style={{ position: 'absolute', right: '-10px', top: '50%', width: '20px', height: '20px', background: 'var(--color-bg-dark)', borderRadius: '50%' }}></div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #ccc', paddingBottom: '12px', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-text-dark-muted)', fontWeight: '600' }}>EXPERIENCE PASS</span>
                      <h4 style={{ fontSize: '1rem', fontWeight: '800' }}>{successBooking.experienceName}</h4>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', background: 'var(--color-teal-light)', color: '#fff', padding: '4px 10px', borderRadius: '12px', height: 'fit-content' }}>
                      {language === 'es' ? 'VERIFICADO' : 'VERIFIED'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.8rem', borderBottom: '1px dashed #ccc', paddingBottom: '12px', marginBottom: '12px' }}>
                    <div>
                      <span style={{ color: 'var(--color-text-dark-muted)', display: 'block', fontSize: '0.65rem' }}>{language === 'es' ? 'TITULAR:' : 'TRAVELER:'}</span>
                      <strong>{successBooking.touristName}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-dark-muted)', display: 'block', fontSize: '0.65rem' }}>{language === 'es' ? 'CORREO:' : 'EMAIL:'}</span>
                      <strong>{successBooking.touristEmail}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-dark-muted)', display: 'block', fontSize: '0.65rem' }}>{language === 'es' ? 'FECHA:' : 'DATE:'}</span>
                      <strong>
                        {(() => {
                          try {
                            return new Date(successBooking.date + 'T00:00:00').toLocaleDateString(language === 'es' ? 'es-MX' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
                          } catch (e) {
                            return successBooking.date;
                          }
                        })()}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-dark-muted)', display: 'block', fontSize: '0.65rem' }}>{language === 'es' ? 'PASAJEROS:' : 'GUESTS:'}</span>
                      <strong>{successBooking.guests} {successBooking.guests === 1 ? (language === 'es' ? 'Pasaje' : 'Ticket') : (language === 'es' ? 'Pasajes' : 'Tickets')}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ color: 'var(--color-text-dark-muted)', display: 'block', fontSize: '0.65rem' }}>{language === 'es' ? 'CÓDIGO DE SEGURIDAD:' : 'SECURITY CODE:'}</span>
                      <strong style={{ fontSize: '0.95rem', letterSpacing: '0.05em', color: 'var(--color-coral)' }}>{successBooking.safetyPassCode}</strong>
                    </div>
                    
                    {/* Simulated QR Code */}
                    <div style={{ width: '50px', height: '50px', border: '2px solid var(--color-navy-dark)', display: 'grid', gridTemplateColumns: 'repeat(5, 10px)', gridTemplateRows: 'repeat(5, 10px)' }}>
                      {[...Array(25)].map((_, i) => (
                        <div key={i} style={{ background: (i % 2 === 0 || i % 3 === 0) ? 'var(--color-navy-dark)' : '#fff' }}></div>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', justifyContent: 'center' }} 
                  onClick={handleCloseDetail}
                >
                  {t('btnFinish')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          setShowCheckout(true);
          setCheckoutStep(1);
        }}
      />

      {/* Provider Registration Modal */}
      <ProviderRegisterModal
        isOpen={showProviderRegModal}
        onClose={() => setShowProviderRegModal(false)}
      />
    </div>
  );
}
