import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Search, Calendar, Users, MapPin, Star, ShieldCheck, CheckCircle2, 
  ArrowLeft, CreditCard, Clock, Phone, Mail, Award, X, Sparkles
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
    addExperienceReview = () => {}
  } = context;
  
  // UI States
  const [selectedExpId, setSelectedExpId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterGuests, setFilterGuests] = useState(1);
  
  // Booking Form States
  const [bookingDate, setBookingDate] = useState('');
  const [bookingGuests, setBookingGuests] = useState(1);
  const [touristName, setTouristName] = useState('');
  const [touristEmail, setTouristEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Tarjeta de Crédito');
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1 = Details, 2 = Payment, 3 = Ticket
  const [successBooking, setSuccessBooking] = useState(null);

  // New Review Form States
  const [newRevAuthor, setNewRevAuthor] = useState('');
  const [newRevComment, setNewRevComment] = useState('');
  const [newRevRating, setNewRevRating] = useState(5);

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
    <div className="tourist-view animate-fade-in">
      
      {!selectedExp ? (
        // CATALOG / SEARCH MODE
        <>
          {/* Hero Banner */}
          <div className="hero-banner glass-card" style={{
            padding: '60px 40px',
            marginBottom: '40px',
            background: 'linear-gradient(135deg, rgba(13, 24, 42, 0.85), rgba(21, 38, 63, 0.7)), url("/hero_yucatan.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div className="hero-glow" style={{
              position: 'absolute',
              top: '-50%',
              right: '-20%',
              width: '500px',
              height: '500px',
              background: 'radial-gradient(circle, rgba(0, 194, 179, 0.15) 0%, rgba(0,0,0,0) 70%)',
              pointerEvents: 'none'
            }}></div>

            <div style={{ maxWidth: '700px', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 107, 77, 0.15)', color: '#FF6B4D', padding: '6px 14px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '20px' }}>
                <Award size={14} /> {language === 'es' ? 'La forma más segura de vivir Yucatán' : 'The safest way to experience Yucatan'}
              </div>
              <h1 style={{ fontSize: '2.5rem', lineHeight: '1.2', marginBottom: '16px' }}>
                {language === 'es' ? 'Experiencias Curadas y ' : 'Curated & '} 
                <span style={{ color: '#00C2B3' }}>{language === 'es' ? 'Totalmente Seguras' : 'Fully Secure'}</span>
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', marginBottom: '32px' }}>
                {t('heroSubtitle')}
              </p>
            </div>

            {/* Global Search Bar */}
            <div className="search-bar glass-card" style={{
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
                    min={dates && dates.length > 0 ? dates[0] : undefined}
                    max={dates && dates.length > 0 ? dates[dates.length - 1] : undefined}
                    style={{ paddingLeft: '40px', width: '100%', colorScheme: 'dark' }}
                    placeholder={t('datePlace')}
                  />
                </div>
              </div>

              <div className="form-group" style={{ flex: '1 1 100px', marginBottom: 0 }}>
                <label className="form-label">{language === 'es' ? 'Personas' : 'Guests'}</label>
                <div style={{ position: 'relative' }}>
                  <Users size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--color-text-muted)' }} />
                  <input 
                    type="number" 
                    className="form-input" 
                    min="1" 
                    max="20" 
                    value={filterGuests} 
                    onChange={(e) => setFilterGuests(Number(e.target.value))}
                    style={{ paddingLeft: '40px', width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', flex: '1 1 150px' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', height: '48px', justifyContent: 'center' }}
                  onClick={() => {}}
                >
                  {t('btnFilter')}
                </button>
              </div>
            </div>
          </div>

          {/* Categories Selector */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px' }}>
            {(categories || []).map(cat => {
              const label = language === 'es' 
                ? cat.label 
                : cat.id === 'todos' ? 'All' : cat.id === 'cenotes' ? 'Cenotes' : cat.id === 'haciendas' ? 'Haciendas' : cat.id === 'barcos' ? 'Boats & Marinas' : cat.id === 'holisticas' ? 'Wellness' : cat.id === 'restaurantes' ? 'Gastronomy' : cat.id === 'hoteles' ? 'Hotels' : cat.id === 'spas' ? 'Spas' : cat.label;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`btn btn-sm ${filterCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
                  style={{ whiteSpace: 'nowrap', borderRadius: '30px' }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Catalog Cards Grid */}
          {filteredExperiences.length === 0 ? (
            <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>{t('noExpFound')}</p>
              <button className="btn btn-outline" onClick={() => { setSearchQuery(''); setFilterCategory('todos'); setFilterDate(''); }}>{t('btnClearFilters')}</button>
            </div>
          ) : (
            <div className="grid-cards">
              {filteredExperiences.map(exp => {
                const displayPrice = getDisplayPrice(exp);
                const isPackage = exp.pricingType === 'package';
                return (
                  <div key={exp.id} className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Image / Category */}
                    <div style={{ height: '200px', width: '100%', background: `linear-gradient(to bottom, transparent, rgba(13,24,42,0.9)), url(${exp.image || '/branding_2.jpg'})`, backgroundSize: 'cover', backgroundPosition: 'center', borderTopLeftRadius: '15px', borderTopRightRadius: '15px', position: 'relative' }}>
                      <span className="badge badge-teal" style={{ position: 'absolute', top: '12px', left: '12px' }}>
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
                            ✓ {b}
                          </span>
                        ))}
                      </div>

                      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                            {isPackage ? t('pricePackage') : t('pricePerPerson')}
                          </div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-text-light)' }}>
                            ${displayPrice.toLocaleString('es-MX')} MXN
                          </div>
                        </div>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenDetail(exp.id)}>
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
        // EXPERIENCE DETAIL MODE
        <div style={{ maxWidth: '1000px', margin: '0 auto' }} className="animate-fade-in">
          {/* Back Button */}
          <button onClick={handleCloseDetail} className="btn btn-outline" style={{ marginBottom: '24px', padding: '10px 16px' }}>
            <ArrowLeft size={16} /> {t('backToCatalog')}
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }} className="detail-layout">
            
            {/* Left Content Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Cover Banner */}
              <div style={{ height: '350px', width: '100%', background: `linear-gradient(to bottom, transparent, rgba(13, 24, 42, 0.9)), url(${selectedExp.image || '/branding_1.jpg'})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '16px', position: 'relative' }}>
                <span className="badge badge-teal" style={{ position: 'absolute', bottom: '20px', left: '20px', fontSize: '0.9rem', padding: '8px 16px' }}>
                  {selectedExp.category}
                </span>
              </div>

              {/* Title & Location */}
              <div>
                <h1 style={{ fontSize: '2rem', marginBottom: '12px', lineHeight: '1.2' }}>{selectedExp.name}</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    <MapPin size={16} /> {selectedExp.location}, Yucatán
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

              {/* Safety protocols */}
              <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(0, 194, 179, 0.4)', background: 'rgba(0, 194, 179, 0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-teal-light)', marginBottom: '16px' }}>
                  <ShieldCheck size={24} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{t('protocolsLabel')} (Verified Safe)</h3>
                </div>
                <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', marginBottom: '16px' }}>
                  {selectedExp.safetyDescription}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {(selectedExp.safetyBadges || []).map((badge, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      <CheckCircle2 size={14} className="text-teal" style={{ color: 'var(--color-teal-light)' }} />
                      <span>{badge}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Reviews Section */}
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

                {/* Add Review Form */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '12px' }}>{t('addReviewTitle')}</h4>
                  <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '12px' }}>
                      <div>
                        <label className="form-label">{t('reviewName')}</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          placeholder="Ej. Juan Pérez"
                          value={newRevAuthor}
                          onChange={e => setNewRevAuthor(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">{t('reviewRating')}</label>
                        <select 
                          className="form-select"
                          value={newRevRating}
                          onChange={e => setNewRevRating(Number(e.target.value))}
                        >
                          <option value="5">⭐⭐⭐⭐⭐</option>
                          <option value="4">⭐⭐⭐⭐</option>
                          <option value="3">⭐⭐⭐</option>
                          <option value="2">⭐⭐</option>
                          <option value="1">⭐</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">{t('reviewComment')}</label>
                      <textarea 
                        className="form-input" 
                        rows="3" 
                        style={{ resize: 'vertical' }}
                        placeholder={language === 'es' ? 'Escribe aquí tu opinión...' : 'Write your comment here...'}
                        value={newRevComment}
                        onChange={e => setNewRevComment(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
                      {t('btnSubmitReview')}
                    </button>
                  </form>
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

                {/* 3. Guests Selector */}
                <div className="form-group">
                  <label className="form-label">{t('guestsLabel')}</label>
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
                <h2 style={{ fontSize: '1.4rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={20} style={{ color: 'var(--color-teal-light)' }} /> {language === 'es' ? 'Datos del Titular' : 'Traveler Details'}
                </h2>
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

                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary" onClick={handleConfirmBooking} disabled={!touristName || !touristEmail}>
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

    </div>
  );
}
