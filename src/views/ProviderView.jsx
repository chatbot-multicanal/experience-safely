import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  Plus, Calendar, Edit, Eye, CheckCircle2, DollarSign, Users, X, 
  Settings, User, CreditCard, Star
} from 'lucide-react';

export default function ProviderView() {
  const context = useContext(AppContext) || {};
  const { 
    experiences = [], 
    calendarAvailability = {}, 
    bookings = [], 
    providerProfiles = {}, 
    dates = [], 
    updateCalendarAvailability = () => {}, 
    updateProviderProfile = () => {}, 
    addExperience = () => {},
    language = 'es',
    t = (k) => k,
    categories = []
  } = context;

  // Provider Filter (only see items belonging to 'provider-1')
  const providerId = 'provider-1';
  const providerExperiences = (experiences || []).filter(e => e.providerId === providerId);

  // UI States
  const [activeTab, setActiveTab] = useState('listings'); // 'listings', 'calendar', 'profile'
  const [selectedExpId, setSelectedExpId] = useState(providerExperiences[0]?.id || '');
  
  // Custom Date Editing Modal
  const [editingDate, setEditingDate] = useState(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editCapacity, setEditCapacity] = useState(0);

  // Custom Form for New Experience
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('cenotes');
  const [newLocation, setNewLocation] = useState('Mérida');
  const [newPrice, setNewPrice] = useState(1000);
  const [newPricingType, setNewPricingType] = useState('individual'); // 'individual' or 'package'
  const [newCapacity, setNewCapacity] = useState(10);
  const [newBookingType, setNewBookingType] = useState('tour'); // 'tour' | 'event' | 'transport' | 'dining' | 'wellness'
  const [newEventZoneVipPrice, setNewEventZoneVipPrice] = useState(1500);
  const [newEventTablePrice, setNewEventTablePrice] = useState(4800);
  const [newTransportMode, setNewTransportMode] = useState('per_trip'); // 'per_hour' | 'per_trip' | 'per_day'
  const [newBadges, setNewBadges] = useState('Equipo de Primeros Auxilios, Guía Local Certificado');
  const [newSafetyDesc, setNewSafetyDesc] = useState('Nuestros guías e instructores cuentan con todas las autorizaciones vigentes.');

  // Image Upload Simulation States
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Profile Editor States
  const myProfile = providerProfiles[providerId] || {
    representativeName: '',
    commercialPhone: '',
    paymentEmail: '',
    bankClabe: ''
  };

  const [repName, setRepName] = useState(myProfile.representativeName);
  const [phone, setPhone] = useState(myProfile.commercialPhone);
  const [email, setEmail] = useState(myProfile.paymentEmail);
  const [clabe, setClabe] = useState(myProfile.bankClabe);

  const [profileSaved, setProfileSaved] = useState(false);

  // --- STATISTICS CALCULATIONS ---
  // Filter bookings belonging to experiences of provider-1
  const providerBookings = (bookings || []).filter(bk => {
    const exp = (experiences || []).find(e => e.id === bk.experienceId);
    return exp && exp.providerId === providerId;
  });

  // Total Income (85% of totalPrice)
  const totalRevenue = providerBookings.reduce((sum, bk) => sum + (bk.totalPrice * 0.85), 0);

  // Total Guests Received
  const totalGuests = providerBookings.reduce((sum, bk) => sum + bk.guests, 0);

  // Average Rating
  const avgRating = providerExperiences.length > 0 
    ? (providerExperiences.reduce((sum, exp) => sum + exp.rating, 0) / providerExperiences.length).toFixed(1) 
    : '5.0';

  // Active Experiences Count
  const activeServicesCount = providerExperiences.length;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleOpenDateEdit = (dateStr) => {
    const defaultPrice = (experiences || []).find(e => e.id === selectedExpId)?.price || 0;
    const defaultCapacity = (experiences || []).find(e => e.id === selectedExpId)?.capacity || 0;
    const slot = (calendarAvailability || {})[selectedExpId]?.[dateStr] || { 
      price: defaultPrice,
      capacity: defaultCapacity,
      booked: 0 
    };
    
    setEditingDate(dateStr);
    setEditPrice(slot.price);
    setEditCapacity(slot.capacity);
  };

  const handleSaveDateSettings = () => {
    updateCalendarAvailability(selectedExpId, editingDate, editPrice, editCapacity);
    setEditingDate(null);
  };

  const handleAddNewExp = (e) => {
    e.preventDefault();
    if (!newName || !newDesc) {
      alert(language === 'es' ? 'Por favor llena los campos obligatorios' : 'Please fill in required fields');
      return;
    }
    
    const badgesArray = newBadges.split(',').map(b => b.trim());
    
    addExperience({
      name: newName,
      description: newDesc,
      category: newCategory,
      location: newLocation,
      price: Number(newPrice),
      pricingType: newPricingType,
      bookingType: newBookingType,
      eventZones: newBookingType === 'event' ? [
        { id: 'z-gen', name: language === 'es' ? 'Zona General' : 'General Zone', price: Number(newPrice), type: 'ticket', capacity: Number(newCapacity) },
        { id: 'z-vip', name: language === 'es' ? 'Zona VIP Preferente' : 'VIP Preferred Zone', price: Number(newEventZoneVipPrice), type: 'ticket', capacity: Math.floor(newCapacity / 2) },
        { id: 'z-table', name: language === 'es' ? 'Mesa Lounge VIP (4 pers)' : 'VIP Table (4 pers)', price: Number(newEventTablePrice), type: 'table', capacity: 4, seats: 4 }
      ] : undefined,
      transportOptions: newBookingType === 'transport' ? {
        unitType: newName,
        maxPassengers: Number(newCapacity),
        pricingMode: newTransportMode,
        includesDriver: true,
        pickupLocation: newLocation
      } : undefined,
      schedules: ['09:00 AM', '12:00 PM', '03:00 PM'],
      capacity: Number(newCapacity),
      safetyBadges: badgesArray,
      safetyDescription: newSafetyDesc,
      providerId,
      providerName: 'Aventuras Mayas S.A.',
      image: imagePreview || '/branding_2.jpg'
    });

    // Reset Form
    setShowAddForm(false);
    setNewName('');
    setNewDesc('');
    setNewPrice(1000);
    setNewPricingType('individual');
    setNewCapacity(10);
    setUploadedImage(null);
    setImagePreview('');
    alert(language === 'es' ? 'Experiencia registrada correctamente.' : 'Experience registered successfully.');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProviderProfile(providerId, {
      representativeName: repName,
      commercialPhone: phone,
      paymentEmail: email,
      bankClabe: clabe
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const selectedExp = (experiences || []).find(e => e.id === selectedExpId);

  return (
    <div className="provider-view animate-fade-in">
      
      {/* Sub-Header Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '32px' }}>
        <button 
          onClick={() => setActiveTab('listings')}
          className={`btn ${activeTab === 'listings' ? 'btn-outline-teal' : 'btn-outline'}`}
          style={{ border: 'none', borderBottom: activeTab === 'listings' ? '2px solid var(--color-teal-light)' : 'none', borderRadius: 0, padding: '16px 24px' }}
        >
          📂 {t('tabListings')}
        </button>
        <button 
          onClick={() => setActiveTab('calendar')}
          className={`btn ${activeTab === 'calendar' ? 'btn-outline-teal' : 'btn-outline'}`}
          style={{ border: 'none', borderBottom: activeTab === 'calendar' ? '2px solid var(--color-teal-light)' : 'none', borderRadius: 0, padding: '16px 24px' }}
        >
          📅 {t('tabCalendar')}
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`btn ${activeTab === 'profile' ? 'btn-outline-teal' : 'btn-outline'}`}
          style={{ border: 'none', borderBottom: activeTab === 'profile' ? '2px solid var(--color-teal-light)' : 'none', borderRadius: 0, padding: '16px 24px' }}
        >
          💼 {t('tabProfile')}
        </button>
      </div>

      {activeTab === 'listings' && (
        // LISTINGS TAB
        <div>
          
          {/* Dashboard Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            {/* Stat 1: Total Revenue (85%) */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--color-teal-light)' }}>
              <div style={{ background: 'rgba(0, 194, 179, 0.1)', color: 'var(--color-teal-light)', padding: '12px', borderRadius: '12px' }}>
                <DollarSign size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('statsRevenue')}
                </span>
                <strong style={{ fontSize: '1.3rem', color: '#fff' }}>
                  ${totalRevenue.toLocaleString('es-MX')} MXN
                </strong>
              </div>
            </div>

            {/* Stat 2: Guests Served */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--color-coral)' }}>
              <div style={{ background: 'rgba(255, 107, 77, 0.1)', color: 'var(--color-coral)', padding: '12px', borderRadius: '12px' }}>
                <Users size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('statsGuests')}
                </span>
                <strong style={{ fontSize: '1.3rem', color: '#fff' }}>
                  {totalGuests}
                </strong>
              </div>
            </div>

            {/* Stat 3: Average Rating */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--color-gold)' }}>
              <div style={{ background: 'rgba(255, 215, 0, 0.1)', color: 'var(--color-gold)', padding: '12px', borderRadius: '12px' }}>
                <Star size={24} fill="var(--color-gold)" style={{ color: 'var(--color-gold)' }} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('statsRating')}
                </span>
                <strong style={{ fontSize: '1.3rem', color: '#fff' }}>
                  {avgRating} ⭐
                </strong>
              </div>
            </div>

            {/* Stat 4: Active Services */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #b388ff' }}>
              <div style={{ background: 'rgba(179, 136, 255, 0.1)', color: '#b388ff', padding: '12px', borderRadius: '12px' }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('statsActive')}
                </span>
                <strong style={{ fontSize: '1.3rem', color: '#fff' }}>
                  {activeServicesCount}
                </strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>{language === 'es' ? 'Catálogo de Servicios' : 'My Listings Catalog'}</h2>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(true)}>
              <Plus size={16} /> {language === 'es' ? 'Agregar Servicio' : 'Add Listing'}
            </button>
          </div>

          <div className="grid-cards">
            {(providerExperiences || []).map(exp => {
              const bookingCount = (bookings || []).filter(b => b.experienceId === exp.id).length;
              return (
                <div key={exp.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Local image render */}
                  <div style={{ height: '140px', background: `linear-gradient(to bottom, transparent, rgba(13,24,42,0.85)), url(${exp.image || '/branding_2.jpg'})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '10px', position: 'relative' }}>
                    <span className="badge badge-teal" style={{ position: 'absolute', top: '10px', left: '10px' }}>{exp.category}</span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{exp.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>📍 {exp.location}, Yucatán</p>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>
                    {exp.description}
                  </p>

                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.7rem' }}>
                        {exp.pricingType === 'package' ? (language === 'es' ? 'Tarifa Fija' : 'Flat Package') : (language === 'es' ? 'Costo Persona' : 'Cost Per Guest')}
                      </span>
                      <strong>${exp.price.toLocaleString('es-MX')} MXN</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.7rem' }}>{language === 'es' ? 'Reservas' : 'Bookings'}</span>
                      <strong>{bookingCount} {language === 'es' ? 'Tours' : 'Trips'}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                    <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => { setSelectedExpId(exp.id); setActiveTab('calendar'); }}>
                      <Calendar size={14} /> {language === 'es' ? 'Calendario' : 'Calendar'}
                    </button>
                    <button className="btn btn-outline-teal btn-sm" style={{ flex: 1 }}>
                      <Edit size={14} /> {language === 'es' ? 'Editar' : 'Edit'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ADD EXPERIENCE FORM MODAL */}
          {showAddForm && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(13,24,42,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
              <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3>{t('modalTitleAdd')}</h3>
                  <button onClick={() => setShowAddForm(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddNewExp}>
                  <div className="form-group">
                    <label className="form-label">{t('labelExpName')} *</label>
                    <input type="text" className="form-input" required value={newName} onChange={e => setNewName(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{language === 'es' ? 'Descripción Detallada *' : 'Detailed Description *'}</label>
                    <textarea className="form-input" rows="3" required value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">{t('labelCategory')}</label>
                      <select className="form-select" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                        {(categories || []).filter(c => c.id !== 'todos').map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">{language === 'es' ? 'Giro / Modalidad de Reserva *' : 'Experience Modality *'}</label>
                      <select className="form-select" value={newBookingType} onChange={e => setNewBookingType(e.target.value)}>
                        <option value="tour">🏊 Tour / Cenote / Aventura (Por Persona / Turnos)</option>
                        <option value="event">🎟️ Evento / Concierto / Festival (Zonas / Mesas)</option>
                        <option value="transport">🚗 Transporte / Yate / Marina (Renta por Hora/Día/Unidad)</option>
                        <option value="dining">🍽️ Gastronomía / Hacienda (Reserva de Mesa / Menú)</option>
                        <option value="wellness">💆 Spa / Wellness / Holística (Sesiones / Tratamientos)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">{t('labelLocation')}</label>
                      <input type="text" className="form-input" value={newLocation} onChange={e => setNewLocation(e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t('labelPriceType')}</label>
                      <select className="form-select" value={newPricingType} onChange={e => setNewPricingType(e.target.value)}>
                        <option value="individual">{t('priceTypeInd')}</option>
                        <option value="package">{t('priceTypePkg')}</option>
                      </select>
                    </div>
                  </div>

                  {/* DYNAMIC FIELDS FOR EVENT GIRO */}
                  {newBookingType === 'event' && (
                    <div style={{ background: 'rgba(0, 194, 179, 0.08)', border: '1px solid rgba(0, 194, 179, 0.25)', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                      <h4 style={{ color: '#00C2B3', margin: '0 0 12px', fontSize: '0.9rem' }}>🎟️ Configuración de Zonas y Mesas de Evento</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <div>
                          <label className="form-label">Precio Zona General</label>
                          <input type="number" className="form-input" value={newPrice} onChange={e => setNewPrice(e.target.value)} />
                        </div>
                        <div>
                          <label className="form-label">Precio Zona VIP</label>
                          <input type="number" className="form-input" value={newEventZoneVipPrice} onChange={e => setNewEventZoneVipPrice(e.target.value)} />
                        </div>
                        <div>
                          <label className="form-label">Precio Mesa Lounge VIP</label>
                          <input type="number" className="form-input" value={newEventTablePrice} onChange={e => setNewEventTablePrice(e.target.value)} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DYNAMIC FIELDS FOR TRANSPORT GIRO */}
                  {newBookingType === 'transport' && (
                    <div style={{ background: 'rgba(255, 107, 77, 0.08)', border: '1px solid rgba(255, 107, 77, 0.25)', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                      <h4 style={{ color: '#FF6B4D', margin: '0 0 12px', fontSize: '0.9rem' }}>🚗 Modalidad de Cobro de Transporte / Embarcación</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label className="form-label">Cobrar por:</label>
                          <select className="form-select" value={newTransportMode} onChange={e => setNewTransportMode(e.target.value)}>
                            <option value="per_trip">Por Recorrido / Viaje Completo</option>
                            <option value="per_hour">Por Hora de Renta</option>
                            <option value="per_day">Por Día Completo</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Capacidad de Unidad (Pasajeros)</label>
                          <input type="number" className="form-input" value={newCapacity} onChange={e => setNewCapacity(e.target.value)} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">{t('labelPrice')} *</label>
                      <input type="number" className="form-input" required value={newPrice} onChange={e => setNewPrice(e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">{t('labelPriceType')}</label>
                      <select className="form-select" value={newPricingType} onChange={e => setNewPricingType(e.target.value)}>
                        <option value="individual">{t('priceTypeInd')}</option>
                        <option value="package">{t('priceTypePkg')}</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('labelCapacity')} *</label>
                    <input type="number" className="form-input" required value={newCapacity} onChange={e => setNewCapacity(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('labelBadges')}</label>
                    <input type="text" className="form-input" value={newBadges} onChange={e => setNewBadges(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('labelSafetyDesc')}</label>
                    <textarea className="form-input" rows="2" value={newSafetyDesc} onChange={e => setNewSafetyDesc(e.target.value)} />
                  </div>

                  {/* Photo Uploader Simulation Input */}
                  <div className="form-group">
                    <label className="form-label">{t('labelImage')}</label>
                    <div style={{
                      border: '2px dashed var(--color-border)',
                      padding: '20px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      background: 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      position: 'relative'
                    }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer'
                        }}
                      />
                      <span>{imagePreview ? (language === 'es' ? '✓ Foto cargada' : '✓ Photo uploaded') : t('labelSelectFile')}</span>
                      {imagePreview && (
                        <img 
                          src={imagePreview} 
                          alt="preview" 
                          style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px', display: 'block', margin: '8px auto 0 auto' }} 
                        />
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                    <button type="button" className="btn btn-outline" onClick={() => setShowAddForm(false)}>
                      {t('btnCancelAdd')}
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {t('btnSubmitAdd')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'calendar' && (
        // CALENDAR & AVAILABILITY TAB
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }} className="calendar-layout">
          <div>
            <h3 style={{ marginBottom: '16px' }}>{language === 'es' ? 'Seleccionar Tour' : 'Select Experience'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(providerExperiences || []).map(exp => (
                <button
                  key={exp.id}
                  onClick={() => setSelectedExpId(exp.id)}
                  style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: selectedExpId === exp.id ? 'rgba(0,194,179,0.1)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${selectedExpId === exp.id ? 'var(--color-teal-light)' : 'transparent'}`,
                    color: selectedExpId === exp.id ? 'var(--color-teal-light)' : '#fff',
                    cursor: 'pointer',
                    fontWeight: selectedExpId === exp.id ? '700' : 'normal',
                    transition: 'var(--transition-smooth)'
                  }}
                >
                  {exp.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            {selectedExp ? (
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ marginBottom: '12px' }}>{selectedExp.name}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
                  {language === 'es' 
                    ? 'Haz clic en cualquier fecha para modificar el precio de salida o la capacidad de pasajeros para ese día específico.' 
                    : 'Click any date to modify departure rates or passenger capacity settings for that specific day.'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                  {(dates || []).map(dateStr => {
                    const slot = calendarAvailability[selectedExp.id]?.[dateStr] || { price: selectedExp.price, capacity: selectedExp.capacity, booked: 0 };
                    
                    let dayName = dateStr;
                    let dayNum = '';
                    try {
                      const dObj = new Date(dateStr + 'T00:00:00');
                      dayName = dObj.toLocaleDateString(language === 'es' ? 'es-MX' : 'en-US', { weekday: 'short' });
                      dayNum = dObj.getDate();
                    } catch (e) {}

                    return (
                      <div 
                        key={dateStr}
                        onClick={() => handleOpenDateEdit(dateStr)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '8px',
                          padding: '12px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'var(--transition-smooth)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-teal-light)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                      >
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{dayName}</span>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '4px 0' }}>{dayNum}</h4>
                        <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-teal-light)' }}>
                          ${slot.price.toLocaleString('es-MX')}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                          👥 {slot.booked}/{slot.capacity} {language === 'es' ? 'Cupos' : 'Spots'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                {language === 'es' ? 'Registra un servicio para ver el calendario.' : 'Register a service first to view calendar.'}
              </div>
            )}
          </div>

          {/* EDIT DAY PARAMETERS MODAL */}
          {editingDate && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(13,24,42,0.85)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
              <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3>{language === 'es' ? 'Modificar Disponibilidad' : 'Modify Slot Settings'}</h3>
                  <button onClick={() => setEditingDate(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

                <div style={{ marginBottom: '16px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <span>{language === 'es' ? 'Fecha seleccionada:' : 'Selected date:'}</span>
                  <strong style={{ display: 'block', color: 'var(--color-teal-light)', fontSize: '1rem', marginTop: '2px' }}>
                    {(() => {
                      try {
                        return new Date(editingDate + 'T00:00:00').toLocaleDateString(language === 'es' ? 'es-MX' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                      } catch (e) { return editingDate; }
                    })()}
                  </strong>
                </div>

                <div className="form-group">
                  <label className="form-label">{language === 'es' ? 'Tarifa Especial para este Día (MXN)' : 'Special Daily Price (MXN)'}</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={editPrice} 
                    onChange={e => setEditPrice(Number(e.target.value))} 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{language === 'es' ? 'Capacidad Máxima de Pasajeros' : 'Passenger Capacity Limit'}</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={editCapacity} 
                    onChange={e => setEditCapacity(Number(e.target.value))} 
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                  <button className="btn btn-outline" onClick={() => setEditingDate(null)}>
                    {t('btnCancel')}
                  </button>
                  <button className="btn btn-primary" onClick={handleSaveDateSettings}>
                    {language === 'es' ? 'Guardar Cambios' : 'Save Settings'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'profile' && (
        // PROFILE AND CLABE ACCOUNT TAB
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="glass-card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={20} style={{ color: 'var(--color-teal-light)' }} /> {language === 'es' ? 'Configuración Comercial del Socio' : 'Commercial Partner Settings'}
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
              {language === 'es' 
                ? 'Administra la información de contacto legal y la CLABE interbancaria para tus liquidaciones de balance automáticas.' 
                : 'Manage legal contact information and CLABE bank account credentials for automatic balance settlement disbursements.'}
            </p>

            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label">{language === 'es' ? 'Nombre del Representante Legal' : 'Legal Representative Name'}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={repName} 
                  onChange={e => setRepName(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">{language === 'es' ? 'Teléfono Comercial de Contacto' : 'Representative Phone'}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">{language === 'es' ? 'Correo Electrónico Contable' : 'Accountant Payment Email'}</label>
                <input 
                  type="email" 
                  className="form-input" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="form-label">{language === 'es' ? 'Cuenta CLABE Interbancaria (18 dígitos)' : 'CLABE Bank Account Number (18 digits)'}</label>
                <input 
                  type="text" 
                  className="form-input" 
                  maxLength={18}
                  minLength={18}
                  required 
                  placeholder="012914002015384729"
                  value={clabe} 
                  onChange={e => setClabe(e.target.value.replace(/[^0-9]/g, ''))} 
                />
              </div>

              {profileSaved && (
                <div style={{ background: 'rgba(0,194,179,0.1)', color: 'var(--color-teal-light)', border: '1px solid var(--color-teal-light)', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.8rem', fontWeight: '600' }}>
                  ✓ {t('profileSaved')}
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
                {language === 'es' ? 'Guardar Cuenta CLABE' : 'Save Account Settings'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
