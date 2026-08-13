import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  ShieldCheck, ShieldAlert, Award, Calculator, TrendingUp, DollarSign, Users, CheckCircle2,
  Trash2, ArrowUpRight, ArrowDownRight, Activity, PlusCircle, Globe, Settings, Palette,
  Plus, Edit, Eye, Star, Upload, FolderPlus, MessageSquarePlus
} from 'lucide-react';

export default function AdminView() {
  const context = useContext(AppContext) || {};
  const { 
    experiences = [], 
    bookings = [], 
    providers = [], 
    providerProfiles = {}, 
    auditLogs = [], 
    siteDesign = {}, 
    financialLedger = [], 
    approveProvider = () => {}, 
    rejectProvider = () => {}, 
    removeExperienceAdmin = () => {}, 
    addExpenseMovement = () => {}, 
    settleProviderPayout = () => {},
    updateSiteDesign = () => {},
    language = 'es',
    t = (k) => k,
    categories = [],
    addCategory = () => {},
    addExperienceReview = () => {}
  } = context;

  // UI Tabs
  const [activeTab, setActiveTab] = useState('metrics'); // 'metrics', 'audit', 'curate', 'finance', 'design'
  
  // Filtering & Search
  const [filterStatus, setFilterStatus] = useState('todos');
  const [curateSearch, setCurateSearch] = useState('');
  const [ledgerFilter, setLedgerFilter] = useState('todos');
  
  // Expense movement form
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Auditoría');
  const [expenseAmount, setExpenseAmount] = useState(0);

  // Graphical Customizer form
  const [tempTitle, setTempTitle] = useState(siteDesign.title || 'Experience Safely');
  const [tempSlogan, setTempSlogan] = useState(siteDesign.slogan || 'The Safest Way to Experience Yucatán');
  const [selectedColor, setSelectedColor] = useState(siteDesign.accentColor || '#FF6B4D');
  const [logoPreview, setLogoPreview] = useState(siteDesign.logo || null);
  const [bgPreview, setBgPreview] = useState(siteDesign.backgroundImage || null);
  const [tempHeroImage, setTempHeroImage] = useState(siteDesign.heroImage || '/hero_yucatan.jpg');
  const [tempHeroMediaType, setTempHeroMediaType] = useState(siteDesign.heroMediaType || 'video');
  const [tempHeroVideo, setTempHeroVideo] = useState(siteDesign.heroVideo || 'https://assets.mixkit.co/videos/preview/mixkit-diving-in-a-clear-water-cenote-41559-large.mp4');

  // New Group/Category Form State
  const [newGroupName, setNewGroupName] = useState('');

  // Import Review Form States
  const [importExpId, setImportExpId] = useState(experiences[0]?.id || '');
  const [importAuthor, setImportAuthor] = useState('');
  const [importRating, setImportRating] = useState(5);
  const [importSource, setImportSource] = useState('Facebook');
  const [importComment, setImportComment] = useState('');

  const colorPresets = [
    { name: 'Naranja Coral', value: '#FF6B4D' },
    { name: 'Teal Caribe', value: '#00C2B3' },
    { name: 'Oro Maya', value: '#FFC857' }
  ];

  // --- LOGIC: FINANCES AND LEDGER ---
  const grossRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const platformCommissions = grossRevenue * 0.15;
  const operationalExpenses = financialLedger
    .filter(item => item.type === 'Gasto')
    .reduce((sum, item) => sum + item.amount, 0);
  const netProfit = platformCommissions - operationalExpenses;

  // Calculate pending balances per provider
  const providerBalances = providers.map(p => {
    // Total price of bookings for experiences belonging to this provider
    const providerBookings = bookings.filter(b => {
      const exp = experiences.find(e => e.id === b.experienceId);
      return exp && exp.providerId === p.id;
    });
    const totalBooked = providerBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const earnings = totalBooked * 0.85; // 85% goes to provider
    
    // Sum of completed payments (payouts) in ledger for this provider
    const settled = financialLedger
      .filter(item => item.type === 'Pago Socio' && item.category === p.name)
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      id: p.id,
      name: p.name,
      pending: Math.max(0, earnings - settled)
    };
  });

  const totalSaldosPendientes = providerBalances.reduce((sum, p) => sum + p.pending, 0);

  // Form Submit: Log operational expense
  const handleLogExpense = (e) => {
    e.preventDefault();
    if (!expenseDesc || expenseAmount <= 0) return;
    addExpenseMovement(expenseDesc, expenseCategory, expenseAmount);
    setExpenseDesc('');
    setExpenseAmount(0);
    alert(language === 'es' ? 'Gasto registrado correctamente.' : 'Expense registered successfully.');
  };

  // Form Submit: Settle provider balance
  const handleSettleBalance = (pId, amount) => {
    const provName = providers.find(p => p.id === pId)?.name || pId;
    if (window.confirm(language === 'es' ? `¿Confirmas la liquidación de $${amount.toLocaleString('es-MX')} MXN para ${provName}?` : `Confirm settlement of $${amount.toLocaleString('es-MX')} MXN for ${provName}?`)) {
      settleProviderPayout(pId, provName, amount);
      alert(language === 'es' ? 'Liquidación efectuada y auditada.' : 'Settlement processed and audited.');
    }
  };

  // Form Submit: Brand customizer settings
  const handleSaveDesign = (e) => {
    e.preventDefault();
    updateSiteDesign({
      title: tempTitle,
      slogan: tempSlogan,
      accentColor: selectedColor,
      logo: logoPreview,
      backgroundImage: bgPreview,
      heroImage: tempHeroImage,
      heroMediaType: tempHeroMediaType,
      heroVideo: tempHeroVideo
    });
    alert(language === 'es' ? 'Identidad visual de marca aplicada correctamente.' : 'Visual brand identity applied successfully.');
  };

  const handleResetDesign = () => {
    setTempTitle('Experience Safely');
    setTempSlogan('The Safest Way to Experience Yucatán');
    setSelectedColor('#FF6B4D');
    setLogoPreview(null);
    setBgPreview(null);
    updateSiteDesign({
      title: 'Experience Safely',
      slogan: 'The Safest Way to Experience Yucatán',
      accentColor: '#FF6B4D',
      logo: null,
      backgroundImage: null
    });
  };

  // Logo file change
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  };

  // Background file change
  const handleBgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBgPreview(url);
    }
  };

  // Hero Rectangle Media File Change
  const handleHeroImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTempHeroImage(url);
    }
  };

  const handleHeroVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTempHeroVideo(url);
    }
  };

  // Add category handler
  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      addCategory(newGroupName.trim());
      setNewGroupName('');
      alert(language === 'es' ? 'Grupo registrado correctamente.' : 'Group registered successfully.');
    }
  };

  // Import Review handler
  const handleImportReviewSubmit = (e) => {
    e.preventDefault();
    if (importAuthor.trim() && importComment.trim()) {
      addExperienceReview(importExpId, {
        author: importAuthor.trim(),
        rating: Number(importRating),
        source: importSource,
        comment: importComment.trim()
      });
      setImportAuthor('');
      setImportComment('');
      alert(language === 'es' ? 'Reseña importada y calificación recalculada.' : 'Review imported and rating recalculated.');
    }
  };

  // Filter lists
  const filteredProviders = providers.filter(p => {
    if (filterStatus === 'todos') return true;
    return p.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const filteredCurate = experiences.filter(exp => {
    if (!curateSearch.trim()) return true;
    const q = curateSearch.toLowerCase();
    return exp.name.toLowerCase().includes(q) || exp.providerName.toLowerCase().includes(q);
  });

  const filteredLedger = financialLedger.filter(item => {
    if (ledgerFilter === 'todos') return true;
    if (ledgerFilter === 'ingreso') return item.type === 'Ingreso';
    if (ledgerFilter === 'gasto') return item.type === 'Gasto';
    if (ledgerFilter === 'pago') return item.type === 'Pago Socio';
    return true;
  });

  return (
    <div className="admin-view animate-fade-in">
      
      {/* Tab Selectors */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '32px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('metrics')}
          className={`btn ${activeTab === 'metrics' ? 'btn-outline-teal' : 'btn-outline'}`}
          style={{ border: 'none', borderBottom: activeTab === 'metrics' ? '2px solid var(--color-teal-light)' : 'none', borderRadius: 0, padding: '16px 20px' }}
        >
          📈 {t('tabMetrics')}
        </button>
        <button 
          onClick={() => setActiveTab('audit')}
          className={`btn ${activeTab === 'audit' ? 'btn-outline-teal' : 'btn-outline'}`}
          style={{ border: 'none', borderBottom: activeTab === 'audit' ? '2px solid var(--color-teal-light)' : 'none', borderRadius: 0, padding: '16px 20px' }}
        >
          🛡️ {t('tabAudits')}
        </button>
        <button 
          onClick={() => setActiveTab('curate')}
          className={`btn ${activeTab === 'curate' ? 'btn-outline-teal' : 'btn-outline'}`}
          style={{ border: 'none', borderBottom: activeTab === 'curate' ? '2px solid var(--color-teal-light)' : 'none', borderRadius: 0, padding: '16px 20px' }}
        >
          🔍 {t('tabCurate')}
        </button>
        <button 
          onClick={() => setActiveTab('finance')}
          className={`btn ${activeTab === 'finance' ? 'btn-outline-teal' : 'btn-outline'}`}
          style={{ border: 'none', borderBottom: activeTab === 'finance' ? '2px solid var(--color-teal-light)' : 'none', borderRadius: 0, padding: '16px 20px' }}
        >
          💰 {t('tabCurate') === 'Curar Catálogo' ? 'Finanzas' : 'Finances'}
        </button>
        <button 
          onClick={() => setActiveTab('design')}
          className={`btn ${activeTab === 'design' ? 'btn-outline-teal' : 'btn-outline'}`}
          style={{ border: 'none', borderBottom: activeTab === 'design' ? '2px solid var(--color-teal-light)' : 'none', borderRadius: 0, padding: '16px 20px' }}
        >
          🎨 {t('tabDesign')}
        </button>
      </div>

      {activeTab === 'metrics' && (
        // TAB 1: METRICS
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }} className="metrics-grid">
            
            <div>
              <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={20} style={{ color: 'var(--color-teal-light)' }} /> {language === 'es' ? 'Flujo de Transacciones del Portal' : 'Live Portal Activity Logs'}
              </h3>
              <div style={{ overflowX: 'auto' }} className="glass-card">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', minWidth: '500px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '12px 10px' }}>ID Reserva</th>
                      <th style={{ padding: '12px 10px' }}>Experiencia</th>
                      <th style={{ padding: '12px 10px' }}>Cliente</th>
                      <th style={{ padding: '12px 10px' }}>Fecha</th>
                      <th style={{ padding: '12px 10px' }}>Pasajeros</th>
                      <th style={{ padding: '12px 10px' }}>Monto</th>
                      <th style={{ padding: '12px 10px' }}>SafetyPass</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.01)' }}>
                        <td style={{ padding: '12px 10px', fontWeight: '700' }}>{b.id}</td>
                        <td style={{ padding: '12px 10px' }}>{b.experienceName}</td>
                        <td style={{ padding: '12px 10px' }}>{b.touristName}</td>
                        <td style={{ padding: '12px 10px' }}>{new Date(b.date + 'T00:00:00').toLocaleDateString(language === 'es' ? 'es-MX' : 'en-US', { day: 'numeric', month: 'short' })}</td>
                        <td style={{ padding: '12px 10px', fontWeight: '700' }}>{b.guests}</td>
                        <td style={{ padding: '12px 10px', color: 'var(--color-coral)', fontWeight: '700' }}>${b.totalPrice.toLocaleString('es-MX')}</td>
                        <td style={{ padding: '12px 10px', color: 'var(--color-teal-light)', fontWeight: '600' }}>{b.safetyPassCode}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <ShieldAlert size={20} style={{ color: 'var(--color-coral)' }} /> {t('adminAuditTitle')}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>{language === 'es' ? 'Status del Portal:' : 'Portal Status:'}</span>
                    <span style={{ color: 'var(--color-teal-light)', fontWeight: '600' }}>Seguro (SSL)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>{language === 'es' ? 'Clasificación de Riesgo:' : 'Risk classification:'}</span>
                    <strong style={{ color: 'var(--color-teal-light)' }}>{language === 'es' ? 'Mínimo' : 'Minimum'}</strong>
                  </div>
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: '600', display: 'block', marginBottom: '12px' }}>
                      {language === 'es' ? 'Logs Recientes del Sistema' : 'System Logs'}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
                      {(auditLogs || []).slice(0, 5).map((log, index) => (
                        <div key={index} style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '8px', fontSize: '0.75rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                            <span>{log.timestamp}</span>
                            <span style={{ textTransform: 'uppercase', color: log.type === 'security' ? 'var(--color-coral)' : 'var(--color-teal-light)', fontWeight: '700', fontSize: '0.6rem' }}>{log.type}</span>
                          </div>
                          <p style={{ color: '#fff', marginTop: '2px' }}>{log.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <TrendingUp size={20} /> {language === 'es' ? 'Ventas por Categoría' : 'Sales by Category'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {['Cenotes Explorer', 'Haciendas & Gastronomía', 'Chárters & Marinas'].map((catName, idx) => {
                    const percentages = [55, 30, 15];
                    const colorsList = ['var(--color-teal-light)', 'var(--color-coral)', 'var(--color-gold)'];
                    return (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                          <span>{catName}</span>
                          <strong>{percentages[idx]}%</strong>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                          <div style={{ width: `${percentages[idx]}%`, height: '100%', background: colorsList[idx], borderRadius: '3px' }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        // TAB 2: AUDIT
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={20} style={{ color: 'var(--color-coral)' }} /> {language === 'es' ? 'Auditoría de Proveedores Locales' : 'Local Partner Security Audits'}
            </h3>
            
            <div style={{ display: 'flex', gap: '6px' }}>
              {['todos', 'pendiente', 'aprobado'].map(st => (
                <button 
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '15px' }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredProviders.map(prov => (
              <div key={prov.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)', padding: '16px', borderRadius: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.95rem' }}>{prov.name}</strong>
                    <span className={`badge ${prov.status === 'Aprobado' ? 'badge-teal' : prov.status === 'Pendiente' ? 'badge-gold' : 'badge-coral'}`} style={{ fontSize: '0.6rem', padding: '2px 8px' }}>
                      {prov.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    <span>RFC: {prov.rfc}</span> | <span>Contacto: {prov.contact}</span>
                  </div>
                </div>

                {prov.status === 'Pendiente' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => approveProvider(prov.id)} style={{ padding: '6px 12px' }}>
                      <CheckCircle2 size={14} /> {language === 'es' ? 'Aprobar' : 'Approve'}
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={() => rejectProvider(prov.id)} style={{ padding: '6px 12px', borderColor: 'var(--color-coral)', color: 'var(--color-coral)' }}>
                      <XCircle size={14} /> {language === 'es' ? 'Rechazar' : 'Reject'}
                    </button>
                  </div>
                )}

                {prov.status === 'Aprobado' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-teal-light)', fontSize: '0.8rem', fontWeight: '600' }}>
                    <CheckCircle2 size={16} /> {language === 'es' ? 'Auditoría Aprobada' : 'Audit Verified'} ({prov.safetyRating})
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'curate' && (
        // TAB 3: CURATE
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <h3>{language === 'es' ? 'Curación y Control de Catálogo de Experiencias' : 'Experience Catalog Control & Curation'}</h3>
              <input 
                type="text" 
                className="form-input" 
                placeholder={language === 'es' ? 'Buscar experiencia...' : 'Search listing...'} 
                value={curateSearch}
                onChange={e => setCurateSearch(e.target.value)}
                style={{ width: '250px', padding: '8px 12px', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                    <th style={{ padding: '10px' }}>ID</th>
                    <th style={{ padding: '10px' }}>{language === 'es' ? 'Experiencia / Servicio' : 'Experience Listing'}</th>
                    <th style={{ padding: '10px' }}>{language === 'es' ? 'Categoría' : 'Category'}</th>
                    <th style={{ padding: '10px' }}>{language === 'es' ? 'Ubicación' : 'Location'}</th>
                    <th style={{ padding: '10px' }}>{language === 'es' ? 'Socio Proveedor' : 'Partner Name'}</th>
                    <th style={{ padding: '10px' }}>{language === 'es' ? 'Costo Base' : 'Base Rate'}</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>{language === 'es' ? 'Acciones' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCurate.map(exp => (
                    <tr key={exp.id} style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.01)' }}>
                      <td style={{ padding: '10px', fontWeight: '600' }}>{exp.id}</td>
                      <td style={{ padding: '10px' }}>
                        <strong>{exp.name}</strong>
                      </td>
                      <td style={{ padding: '10px', textTransform: 'capitalize' }}>{exp.category}</td>
                      <td style={{ padding: '10px' }}>{exp.location}</td>
                      <td style={{ padding: '10px', color: 'var(--color-teal-light)' }}>{exp.providerName}</td>
                      <td style={{ padding: '10px', fontWeight: '700' }}>${exp.price.toLocaleString('es-MX')} MXN</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        <button 
                          onClick={() => {
                            if (window.confirm(language === 'es' ? `¿Estás seguro de quitar "${exp.name}"?` : `Remove "${exp.name}"?`)) {
                              removeExperienceAdmin(exp.id);
                            }
                          }}
                          className="btn btn-sm"
                          style={{ background: 'rgba(255,107,77,0.15)', color: 'var(--color-coral)', border: '1px solid rgba(255,107,77,0.3)', padding: '6px 10px' }}
                        >
                          <Trash2 size={12} style={{ display: 'inline', marginRight: '4px' }} /> {language === 'es' ? 'Quitar' : 'Remove'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* IMPORT SOCIAL REVIEWS SYSTEM */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-teal-light)', marginBottom: '16px' }}>
              <MessageSquarePlus size={22} />
              <h3>{language === 'es' ? 'Importar Reseña Externa (Redes Sociales)' : 'Import External Social Networks Reviews'}</h3>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
              {language === 'es' 
                ? 'Agrega comentarios que las empresas ya tienen en sus redes. La calificación promedio se recalculará automáticamente.' 
                : 'Import feedback that partners already got on social networks. Catalog rating averages will recalculate instantly.'}
            </p>

            <form onSubmit={handleImportReviewSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">{language === 'es' ? 'Seleccionar Experiencia' : 'Select Experience'}</label>
                  <select 
                    className="form-select" 
                    value={importExpId} 
                    onChange={e => setImportExpId(e.target.value)}
                  >
                    {experiences.map(e => (
                      <option key={e.id} value={e.id}>{e.name} ({e.providerName})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('labelReviewAuthor')}</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ej. Ana L. / Robert K." 
                    required 
                    value={importAuthor} 
                    onChange={e => setImportAuthor(e.target.value)} 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">{t('reviewRating')}</label>
                    <select 
                      className="form-select" 
                      value={importRating} 
                      onChange={e => setImportRating(Number(e.target.value))}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                      <option value="4">⭐⭐⭐⭐ (4)</option>
                      <option value="3">⭐⭐⭐ (3)</option>
                      <option value="2">⭐⭐ (2)</option>
                      <option value="1">⭐ (1)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('labelReviewSource')}</label>
                    <select 
                      className="form-select" 
                      value={importSource} 
                      onChange={e => setImportSource(e.target.value)}
                    >
                      <option value="Facebook">Facebook</option>
                      <option value="TripAdvisor">TripAdvisor</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Google Reviews">Google Reviews</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <label className="form-label">{t('reviewComment')}</label>
                  <textarea 
                    className="form-input" 
                    style={{ flex: 1, minHeight: '110px' }} 
                    placeholder={language === 'es' ? 'Escribe aquí la opinión copiada de redes...' : 'Write the feedback copy-pasted from social...'}
                    required 
                    value={importComment} 
                    onChange={e => setImportComment(e.target.value)} 
                  />
                </div>

                <button type="submit" className="btn btn-secondary" style={{ justifyContent: 'center' }}>
                  {t('btnImportReview')}
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

      {activeTab === 'finance' && (
        // TAB 4: FINANCES
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Financial Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--color-teal-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '8px' }}>
                <span>{language === 'es' ? 'Ingreso Bruto Ventas' : 'Gross Sales Revenue'}</span>
                <ArrowUpRight size={16} style={{ color: 'var(--color-teal-light)' }} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>${grossRevenue.toLocaleString('es-MX')}</h3>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{language === 'es' ? 'Reservas de turistas' : 'Tourist bookings sum'}</span>
            </div>

            <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--color-gold)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '8px' }}>
                <span>{language === 'es' ? 'Comisión Portal (15%)' : 'Escrow Commission (15%)'}</span>
                <Calculator size={16} style={{ color: 'var(--color-gold)' }} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--color-gold)' }}>${platformCommissions.toLocaleString('es-MX')}</h3>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{language === 'es' ? 'Ganancia operativa neta' : 'Net operations profits'}</span>
            </div>

            <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid var(--color-coral)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '8px' }}>
                <span>{language === 'es' ? 'Gastos Operativos' : 'Operational Costs'}</span>
                <ArrowDownRight size={16} style={{ color: 'var(--color-coral)' }} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--color-coral)' }}>${operationalExpenses.toLocaleString('es-MX')}</h3>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{language === 'es' ? 'Auditorías, IT y marketing' : 'Auditing, IT & support'}</span>
            </div>

            <div className="glass-card" style={{ padding: '20px', borderLeft: `4px solid ${netProfit >= 0 ? '#10B981' : 'var(--color-coral)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '8px' }}>
                <span>{language === 'es' ? 'Balance Neto' : 'Net Balance'}</span>
                <Activity size={16} style={{ color: netProfit >= 0 ? '#10B981' : 'var(--color-coral)' }} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: netProfit >= 0 ? '#10B981' : 'var(--color-coral)' }}>
                ${netProfit.toLocaleString('es-MX')}
              </h3>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Comisión - Gastos</span>
            </div>

            <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #3B82F6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '8px' }}>
                <span>{t('adminSettleTitle')}</span>
                <Users size={16} style={{ color: '#3B82F6' }} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#3B82F6' }}>${totalSaldosPendientes.toLocaleString('es-MX')}</h3>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{language === 'es' ? 'Pendiente de pago a socios' : 'Owed to local partners'}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }} className="finance-layout">
            
            {/* Left Column: Ledger Table */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <h3>{language === 'es' ? 'Libro Contable Diario (Ledger)' : 'Daily Accounting Book (Ledger)'}</h3>
                
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['todos', 'ingreso', 'gasto', 'pago'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setLedgerFilter(filter)}
                      className={`btn btn-sm ${ledgerFilter === filter ? 'btn-primary' : 'btn-outline'}`}
                      style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '15px' }}
                    >
                      {filter === 'pago' ? (language === 'es' ? 'pagos' : 'payouts') : filter}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left', color: 'var(--color-text-muted)' }}>
                      <th style={{ padding: '10px' }}>{language === 'es' ? 'Fecha' : 'Date'}</th>
                      <th style={{ padding: '10px' }}>{language === 'es' ? 'Descripción' : 'Description'}</th>
                      <th style={{ padding: '10px' }}>{language === 'es' ? 'Tipo' : 'Type'}</th>
                      <th style={{ padding: '10px' }}>{language === 'es' ? 'Categoría' : 'Category'}</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>{language === 'es' ? 'Monto' : 'Amount'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLedger.map(item => {
                      const isIncome = item.type === 'Ingreso';
                      return (
                        <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.01)' }}>
                          <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{item.date}</td>
                          <td style={{ padding: '10px' }}>{item.description}</td>
                          <td style={{ padding: '10px' }}>
                            <span className={`badge ${isIncome ? 'badge-teal' : item.type === 'Gasto' ? 'badge-coral' : 'badge-gold'}`} style={{ fontSize: '0.6rem', padding: '2px 8px' }}>
                              {item.type}
                            </span>
                          </td>
                          <td style={{ padding: '10px' }}>{item.category}</td>
                          <td style={{ padding: '10px', textAlign: 'right', fontWeight: '700', color: isIncome ? '#10B981' : 'var(--color-coral)' }}>
                            {isIncome ? '+' : '-'}${item.amount.toLocaleString('es-MX')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Expense logger and Settlements */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              {/* Expense logger */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <PlusCircle size={20} style={{ color: 'var(--color-coral)' }} /> {language === 'es' ? 'Registrar Egreso Contable' : 'Log Operational Expense'}
                </h3>

                <form onSubmit={handleLogExpense}>
                  <div className="form-group">
                    <label className="form-label">{language === 'es' ? 'Descripción del Gasto' : 'Expense Description'}</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ej. Seguro Catamarán Progreso"
                      value={expenseDesc} 
                      onChange={e => setExpenseDesc(e.target.value)}
                      required 
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">{language === 'es' ? 'Categoría' : 'Category'}</label>
                      <select 
                        className="form-select"
                        value={expenseCategory}
                        onChange={e => setExpenseCategory(e.target.value)}
                      >
                        <option value="Auditoría">{language === 'es' ? 'Auditoría' : 'Audit'}</option>
                        <option value="Servidor">{language === 'es' ? 'Servidor' : 'Hosting'}</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Soporte">{language === 'es' ? 'Soporte' : 'Support'}</option>
                        <option value="Seguros">{language === 'es' ? 'Seguros' : 'Insurance'}</option>
                        <option value="Otros">{language === 'es' ? 'Otros' : 'Others'}</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">{language === 'es' ? 'Monto (MXN)' : 'Amount (MXN)'}</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        min="1"
                        value={expenseAmount} 
                        onChange={e => setExpenseAmount(Number(e.target.value))}
                        required 
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
                    {language === 'es' ? 'Registrar Gasto' : 'Submit Expense'}
                  </button>
                </form>
              </div>

              {/* Provider Settle Liquidations */}
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Calculator size={20} style={{ color: 'var(--color-teal-light)' }} /> {t('adminSettleTitle')}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                  {language === 'es' 
                    ? 'Saldos recaudados en reservas (85% para el socio). Haz clic en Liquidar para realizar el pago correspondiente.' 
                    : 'Balances gathered in escrow (85% for partner). Click settle to execute payment interbank transfer.'}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {(providerBalances || []).map(p => {
                    const pProfile = providerProfiles[p.id] || {};
                    return (
                      <div key={p.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ fontSize: '0.85rem', display: 'block' }}>{p.name}</strong>
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block', margin: '2px 0' }}>
                            CLABE: <code style={{ color: 'var(--color-teal-light)', fontFamily: 'monospace' }}>{pProfile.bankClabe || 'No registrada'}</code>
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{language === 'es' ? 'Saldo' : 'Balance'}: ${p.pending.toLocaleString('es-MX')} MXN</span>
                        </div>
                        
                        <button
                          className="btn btn-secondary btn-sm"
                          disabled={p.pending <= 0}
                          onClick={() => handleSettleBalance(p.id, p.pending)}
                          style={{ padding: '6px 10px', fontSize: '0.7rem', opacity: p.pending <= 0 ? 0.4 : 1 }}
                        >
                          {language === 'es' ? 'Liquidar' : 'Settle'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {activeTab === 'design' && (
        // TAB 5: DESIGN CUSTOMIZER
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* BRANDING FORM */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-teal-light)', marginBottom: '16px' }}>
                <Palette size={24} />
                <h3>{language === 'es' ? 'Aspectos Gráficos y Personalización de Marca' : 'Branding & Visual Customizer'}</h3>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
                {language === 'es' 
                  ? 'Modifica la identidad visual del portal. Los cambios reescribirán la configuración y las variables CSS raíz en tiempo real.' 
                  : 'Modify portal branding. Changes overwrite active config and inject global root CSS styles immediately.'}
              </p>

              <form onSubmit={handleSaveDesign}>
                <div className="form-group">
                  <label className="form-label">{language === 'es' ? 'Nombre del Portal (Header)' : 'Portal Name (Header)'}</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={tempTitle}
                    onChange={e => setTempTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{language === 'es' ? 'Slogan Oficial del Portal' : 'Official Portal Slogan'}</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={tempSlogan}
                    onChange={e => setTempSlogan(e.target.value)}
                    required
                  />
                </div>

                {/* Custom Logo Upload */}
                <div className="form-group">
                  <label className="form-label">{t('labelUploadLogo')}</label>
                  <div style={{
                    border: '2px dashed var(--color-border)',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    background: 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    position: 'relative',
                    marginBottom: '10px'
                  }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoChange}
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
                    <span>{logoPreview ? (language === 'es' ? '✓ Logo cargado' : '✓ Logo loaded') : (language === 'es' ? 'Subir Logo de Marca' : 'Upload Brand Logo')}</span>
                    {logoPreview && (
                      <img 
                        src={logoPreview} 
                        alt="logo" 
                        style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '50%', display: 'block', margin: '8px auto 0 auto', border: '1px solid var(--color-teal-light)' }} 
                      />
                    )}
                  </div>
                </div>

                {/* Custom Background Image Upload */}
                <div className="form-group">
                  <label className="form-label">{t('labelUploadBg')}</label>
                  <div style={{
                    border: '2px dashed var(--color-border)',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    background: 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    position: 'relative',
                    marginBottom: '10px'
                  }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleBgChange}
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
                    <span>{bgPreview ? (language === 'es' ? '✓ Fondo del sitio cargado' : '✓ Site Background loaded') : (language === 'es' ? 'Subir Fondo del Sitio Completo' : 'Upload Full Site Background')}</span>
                  </div>
                </div>

                {/* HERO RECTANGLE MEDIA CUSTOMIZER (PHOTO VS VIDEO MP4) */}
                <div style={{ background: 'rgba(0, 194, 179, 0.08)', border: '1px solid rgba(0, 194, 179, 0.25)', padding: '20px', borderRadius: '12px', marginTop: '20px', marginBottom: '20px' }}>
                  <h4 style={{ color: '#00C2B3', margin: '0 0 12px', fontSize: '0.95rem' }}>🎬 Fondo del Rectángulo Principal (Hero Banner)</h4>
                  
                  <div className="form-group">
                    <label className="form-label">{language === 'es' ? 'Tipo de Contenido Multimedia' : 'Media Type'}</label>
                    <select className="form-select" value={tempHeroMediaType} onChange={e => setTempHeroMediaType(e.target.value)}>
                      <option value="video">🎬 Video en Bucle MP4 (Recomendado Ultra HD)</option>
                      <option value="image">🖼️ Foto con Animación Ken Burns</option>
                    </select>
                  </div>

                  {tempHeroMediaType === 'video' ? (
                    <div className="form-group">
                      <label className="form-label">{language === 'es' ? 'Video MP4 del Rectángulo Principal' : 'Hero Rectangle MP4 Video'}</label>
                      
                      {/* Uploader Box for Video */}
                      <div style={{
                        border: '2px dashed var(--color-border)',
                        padding: '16px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.02)',
                        cursor: 'pointer',
                        position: 'relative',
                        marginBottom: '12px'
                      }}>
                        <input 
                          type="file" 
                          accept="video/mp4,video/webm,video/*" 
                          onChange={handleHeroVideoChange}
                          style={{
                            position: 'absolute',
                            top: 0, left: 0, width: '100%', height: '100%',
                            opacity: 0, cursor: 'pointer'
                          }}
                        />
                        <span>📁 {language === 'es' ? 'Seleccionar / Subir Video MP4 desde tu Equipo' : 'Upload MP4 Video File'}</span>
                      </div>

                      <label className="form-label" style={{ fontSize: '0.75rem', marginTop: '8px' }}>
                        {language === 'es' ? 'O ingresa enlace / URL externa:' : 'Or enter external video URL:'}
                      </label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={tempHeroVideo} 
                        onChange={e => setTempHeroVideo(e.target.value)} 
                        placeholder="https://ejemplo.com/cenote-video.mp4" 
                      />
                    </div>
                  ) : (
                    <div className="form-group">
                      <label className="form-label">{language === 'es' ? 'Foto del Rectángulo Principal' : 'Hero Rectangle Image'}</label>
                      
                      {/* Uploader Box for Image */}
                      <div style={{
                        border: '2px dashed var(--color-border)',
                        padding: '16px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.02)',
                        cursor: 'pointer',
                        position: 'relative',
                        marginBottom: '12px'
                      }}>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleHeroImageChange}
                          style={{
                            position: 'absolute',
                            top: 0, left: 0, width: '100%', height: '100%',
                            opacity: 0, cursor: 'pointer'
                          }}
                        />
                        <span>📁 {language === 'es' ? 'Seleccionar / Subir Imagen desde tu Equipo' : 'Upload Hero Image File'}</span>
                      </div>

                      <label className="form-label" style={{ fontSize: '0.75rem', marginTop: '8px' }}>
                        {language === 'es' ? 'O ingresa enlace / URL de imagen:' : 'Or enter image URL:'}
                      </label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={tempHeroImage} 
                        onChange={e => setTempHeroImage(e.target.value)} 
                        placeholder="/hero_yucatan.jpg" 
                      />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ marginBottom: '8px' }}>{language === 'es' ? 'Color Primario de Acento (Tema Completo)' : 'Primary Accent Color (Site Theme)'}</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {colorPresets.map(preset => {
                      const isCurrent = selectedColor === preset.value;
                      return (
                        <button
                          key={preset.value}
                          type="button"
                          onClick={() => setSelectedColor(preset.value)}
                          style={{
                            background: preset.value,
                            color: preset.value === '#FFC857' ? '#0D182A' : '#fff',
                            border: isCurrent ? '3px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                            padding: '12px 6px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '700',
                            fontSize: '0.75rem',
                            textAlign: 'center',
                            boxShadow: isCurrent ? `0 0 12px ${preset.value}` : 'none',
                            transition: 'var(--transition-smooth)'
                          }}
                        >
                          {isCurrent ? '✓ Activo' : preset.name.split(' ')[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '20px', marginTop: '24px' }}>
                  <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={handleResetDesign}>
                    {language === 'es' ? 'Restablecer' : 'Reset'}
                  </button>
                  <button type="submit" className="btn btn-secondary" style={{ flex: 2 }}>
                    {language === 'es' ? 'Aplicar Cambios' : 'Apply Settings'}
                  </button>
                </div>
              </form>
            </div>

            {/* DYNAMIC CATEGORY CREATOR PANEL */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-teal-light)', marginBottom: '16px' }}>
                <FolderPlus size={22} />
                <h3>{t('labelManageGroups')}</h3>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
                {language === 'es' 
                  ? 'Añade nuevos grupos o subcategorías al catálogo. Estarán disponibles para los socios al registrar servicios.' 
                  : 'Create new groups/categories in the catalog. They will be available instantly in listing registration forms.'}
              </p>

              <form onSubmit={handleAddCategorySubmit} style={{ display: 'flex', gap: '12px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ej. Aventuras / Spas / Cruceros" 
                  required 
                  value={newGroupName} 
                  onChange={e => setNewGroupName(e.target.value)} 
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Plus size={16} /> {t('btnAddGroup')}
                </button>
              </form>

              {/* Categories list preview */}
              <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '16px', paddingTop: '16px' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                  {language === 'es' ? 'Grupos Activos' : 'Active Groups'}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {categories.map(c => (
                    <span 
                      key={c.id} 
                      style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', padding: '4px 10px', borderRadius: '12px', color: 'var(--color-text-muted)' }}
                    >
                      {c.label} ({c.id})
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
              <h4 style={{ marginBottom: '16px' }}>{language === 'es' ? 'Previsualización en tiempo real' : 'Real-time Live Preview'}</h4>
              
              <div style={{ background: '#0D182A', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', textAlign: 'left', marginBottom: '16px', backgroundImage: bgPreview ? `linear-gradient(rgba(13,24,42,0.85), rgba(13,24,42,0.85)), url(${bgPreview})` : 'none', backgroundSize: 'cover' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                  {logoPreview ? (
                    <img src={logoPreview} alt="logo" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--color-coral)' }} />
                  ) : (
                    <span style={{ width: '8px', height: '8px', background: selectedColor, borderRadius: '50%' }}></span>
                  )}
                  <span style={{ fontSize: '0.95rem', fontWeight: '800' }}>
                    {tempTitle.split(' ')[0]} <span style={{ color: selectedColor }}>{tempTitle.split(' ').slice(1).join(' ')}</span>
                  </span>
                </div>
                <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', letterSpacing: '0.05em' }}>
                  {tempSlogan}
                </span>

                <div style={{ background: selectedColor, color: selectedColor === '#FFC857' ? '#0D182A' : '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', textAlign: 'center', marginTop: '16px' }}>
                  {language === 'es' ? 'Botón Muestra' : 'Sample Button'}
                </div>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                {language === 'es' 
                  ? 'Al guardar, el portal inyectará las comisiones de marca y los acentos visuales a todo el sitio web de manera global.' 
                  : 'When saved, the portal applies the brand theme config and visual accents globally across all views.'}
              </p>
            </div>

            <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe size={32} style={{ color: 'var(--color-gold)' }} />
              <div style={{ textAlign: 'left', fontSize: '0.8rem' }}>
                <strong>{language === 'es' ? 'Visibilidad del Portal' : 'Portal Visibility'}</strong>
                <p style={{ color: 'var(--color-text-muted)' }}>{language === 'es' ? 'Panel restringido. Protegido bajo estándares SSL y credenciales cifradas.' : 'Restricted dashboard. Protected under SSL and encrypted keys.'}</p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
