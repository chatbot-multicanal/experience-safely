import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

// Helper to generate dates for next 30 days
const getDatesForNextMonth = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    const dateString = nextDate.toISOString().split('T')[0];
    dates.push(dateString);
  }
  return dates;
};

const initialDates = getDatesForNextMonth();

const INITIAL_EXPERIENCES = [
  {
    id: 'exp-1',
    name: 'Exploración de Cenote Sagrado y Cuevas',
    description: 'Descubre las místicas aguas cristalinas de un cenote semi-abierto privado en Valladolid. Incluye nado guiado por cavernas con estalactitas, chaleco salvavidas de alta seguridad y comida típica yucateca en la hacienda.',
    category: 'cenotes',
    location: 'Valladolid',
    price: 950,
    capacity: 15,
    image: '/images/cenote.jpg',
    rating: 4.9,
    reviewsCount: 2,
    pricingType: 'individual',
    bookingType: 'tour',
    schedules: ['09:00 AM', '12:00 PM', '03:00 PM'],
    reviews: [
      { id: 'rev-1', author: 'Carlos R.', rating: 5, comment: 'Excelente tour. Los guías sabían mucho sobre la geología de las cavernas y los chalecos estaban impecables.', date: '2026-07-28', source: 'Facebook' },
      { id: 'rev-2', author: 'Emily S.', rating: 4, comment: 'Beautiful water, very secure and well-organized. High quality life jackets.', date: '2026-07-15', source: 'TripAdvisor' }
    ],
    safetyBadges: ['Certificación de Salvavidas', 'Equipo Sanitizado', 'Seguro de Aventura'],
    safetyDescription: 'Guías certificados en primeros auxilios y rescate acuático. Chalecos de neopreno reglamentarios e higienizados tras cada uso. Seguro de viajero completo incluido.',
    providerId: 'provider-1',
    providerName: 'Aventuras Mayas S.A.',
    syncedFromWix: true,
  },
  {
    id: 'exp-2',
    name: 'Cena de Gala en Hacienda Mucuyché',
    description: 'Disfruta de una velada gastronómica exclusiva de 5 tiempos inspirada en recetas ancestrales del henequén, servida en los majestuenses jardines iluminados de la Hacienda Mucuyché. Incluye recorrido nocturno por el cenote de la hacienda.',
    category: 'haciendas',
    location: 'Mucuyché',
    price: 1800,
    capacity: 25,
    image: '/images/hacienda.jpg',
    rating: 4.8,
    reviewsCount: 1,
    pricingType: 'individual',
    reviews: [
      { id: 'rev-3', author: 'Mariana P.', rating: 5, comment: 'La cena fue espectacular, un ambiente mágico. Todo súper higiénico.', date: '2026-07-20', source: 'Facebook' }
    ],
    safetyBadges: ['Transporte Seguro', 'Higiene Distintivo H', 'Guía Privado'],
    safetyDescription: 'Instalaciones con sanitización continua. Alimentos preparados bajo el estándar Distintivo H. Protocolo de seguridad estructural en ruinas históricas.',
    providerId: 'provider-2',
    providerName: 'Haciendas de Yucatán Club',
    syncedFromWix: false,
  },
  {
    id: 'exp-3',
    name: 'Chárter de Catamarán Privado al Atardecer',
    description: 'Navega por la costa de Progreso en un catamarán de lujo de 42 pies. Disfruta de barra libre nacional, tabla de quesos y carnes frías locales, paradas para nadar con snorkel y la espectacular puesta de sol del Golfo.',
    category: 'barcos',
    location: 'Progreso',
    price: 12500,
    capacity: 10,
    image: '/images/catamaran.jpg',
    rating: 5.0,
    reviewsCount: 1,
    pricingType: 'package',
    bookingType: 'transport',
    transportOptions: {
      unitType: 'Catamarán Privado de Lujo (42ft)',
      maxPassengers: 10,
      pricingMode: 'per_trip', // 'per_hour' | 'per_trip' | 'per_day'
      includesDriver: true,
      pickupLocation: 'Marina de Progreso'
    },
    reviews: [
      { id: 'rev-4', author: 'Diego L.', rating: 5, comment: 'Rentamos el catamarán para mi familia de 8 personas. Fue genial pagar un precio fijo. El capitán de primera y todo el equipo de seguridad al día.', date: '2026-07-25', source: 'TripAdvisor' }
    ],
    safetyBadges: ['Capitán Licenciado', 'Radio VHF & GPS', 'Seguro Marítimo'],
    safetyDescription: 'Embarcación inspeccionada por Capitanía de Puerto. Cuenta con balsa salvavidas autoinflable, bengalas, extintores y chalecos tipo I aprobados por SOLAS.',
    providerId: 'provider-1',
    providerName: 'Aventuras Mayas S.A.',
    syncedFromWix: true,
  },
  {
    id: 'exp-4',
    name: 'Ritual Ancestral de Temazcal Holístico',
    description: 'Renace en una ceremonia prehispánica guiada por un chamán local en Izamal. Incluye meditación con copal, baño de vapor herbal con piedras volcánicas, baño en piscina de agua de pozo y cena de frutas orgánicas cultivadas en la comunidad.',
    category: 'holisticas',
    location: 'Izamal',
    price: 1200,
    capacity: 8,
    image: '/images/temazcal.jpg',
    rating: 4.9,
    reviewsCount: 1,
    pricingType: 'individual',
    reviews: [
      { id: 'rev-5', author: 'Jessica M.', rating: 5, comment: 'Una experiencia transformadora. Monitorean tu salud antes de entrar al temazcal. Súper profesional.', date: '2026-07-10', source: 'Instagram' }
    ],
    safetyBadges: ['Chamán Certificado', 'Sesión Controlada', 'Monitoreo de Salud'],
    safetyDescription: 'Monitoreo de presión arterial previo a la entrada. Entrada y salida asistida. Hierbas 100% orgánicas sin alérgenos. Espacio ventilado y sanitizado.',
    providerId: 'provider-3',
    providerName: 'Yucatán Wellness Center',
    syncedFromWix: false,
  },
  {
    id: 'exp-5',
    name: 'Tour Gastronómico Callejero en Mérida',
    description: 'Un recorrido a pie por los mercados y cantinas más antiguos del centro de Mérida. Degusta panuchos, salbutes, cochinita pibil, sopa de lima y helados artesanales de frutas locales de temporada mientras conoces la historia de la ciudad.',
    category: 'restaurantes',
    location: 'Mérida',
    price: 650,
    capacity: 12,
    image: '/images/gastronomia.jpg',
    rating: 4.7,
    reviewsCount: 1,
    pricingType: 'individual',
    reviews: [
      { id: 'rev-6', author: 'Arturo V.', rating: 4, comment: 'Gran comida y muy buenos locales con sellos sanitarios.', date: '2026-07-22', source: 'Facebook' }
    ],
    safetyBadges: ['Guía Local Certificado', 'Locales Verificados', 'Grupo Reducido'],
    safetyDescription: 'Visita exclusiva a puestos de comida auditados higiénicamente. Distanciamiento prudente y grupos de máximo 12 personas para garantizar atención personalizada.',
    providerId: 'provider-2',
    providerName: 'Haciendas de Yucatán Club',
    syncedFromWix: true,
  },
  {
    id: 'exp-6',
    name: 'Estadía Romántica en Rosas & Xocolate',
    description: 'Disfruta de una noche de lujo en el hotel boutique más icónico del Paseo de Montejo. Incluye botella de champaña de bienvenida, desayuno gourmet en el patio rosa y un masaje de terapia de chocolate de 60 minutos para dos personas en su spa premiado.',
    category: 'hoteles',
    location: 'Mérida',
    price: 6800,
    capacity: 4,
    image: '/images/hotel.jpg',
    rating: 4.9,
    reviewsCount: 1,
    pricingType: 'individual',
    reviews: [
      { id: 'rev-7', author: 'Sofía K.', rating: 5, comment: 'El servicio es increíble y la habitación impecable. El masaje de chocolate en pareja fue fabuloso.', date: '2026-07-29', source: 'Google' }
    ],
    safetyBadges: ['Estándar 5 Estrellas', 'Monitoreo Médico 24/7', 'Sanitización UV'],
    safetyDescription: 'Purificación de aire con filtros HEPA. Médico de guardia disponible las 24 horas. Llave digital sin contacto mediante aplicación móvil.',
    providerId: 'provider-4',
    providerName: 'Rosas & Xocolate Boutique',
    syncedFromWix: false,
  },
  {
    id: 'exp-7',
    name: 'Festival Nocturno Noche Blanca & Concierto Maya',
    description: 'Acceso exclusivo al concierto estelar al aire libre en la plaza principal. Elige entre zonas de boletos individuales o reserva una Mesa Lounge para tu grupo con servicio de champagne.',
    category: 'eventos',
    location: 'Mérida',
    price: 850,
    capacity: 200,
    image: '/images/gastronomia.jpg',
    rating: 4.9,
    reviewsCount: 3,
    pricingType: 'individual',
    bookingType: 'event',
    eventZones: [
      { id: 'z-gen', name: 'Zona General (Boleto Individual)', price: 850, type: 'ticket', capacity: 100 },
      { id: 'z-vip', name: 'Zona VIP Preferente (Boleto Individual)', price: 1500, type: 'ticket', capacity: 50 },
      { id: 'z-table4', name: 'Mesa Lounge VIP (Hasta 4 personas)', price: 4800, type: 'table', capacity: 4, seats: 4 },
      { id: 'z-table8', name: 'Mesa Premium VIP (Hasta 8 personas)', price: 8900, type: 'table', capacity: 8, seats: 8 }
    ],
    safetyBadges: ['Filtro de Seguridad', 'Asientos Distanciados', 'Paramédicos en Sitio'],
    safetyDescription: 'Acceso controlado con detector de metales, personal de seguridad privada y unidad médica de primera respuesta en sitio.',
    providerId: 'provider-2',
    providerName: 'Haciendas de Yucatán Club',
    syncedFromWix: false
  },
  {
    id: 'exp-8',
    name: 'Servicio de Traslado Privado en Van VIP (Chichén Itzá / Ruta Puuc)',
    description: 'Renta de Van ejecutiva Mercedes-Benz / Chevrolet con chofer privado bilingüe para recorridos personalizados de hasta 12 pasajeros con kilometraje libre y hielera con bebidas.',
    category: 'marinas',
    location: 'Yucatán',
    price: 3200,
    capacity: 12,
    image: '/hero_yucatan.jpg',
    rating: 5.0,
    reviewsCount: 2,
    pricingType: 'package',
    bookingType: 'transport',
    transportOptions: {
      unitType: 'Van Ejecutiva VIP (Hasta 12 pasajeros)',
      maxPassengers: 12,
      pricingMode: 'per_day',
      includesDriver: true,
      pickupLocation: 'Hotel / Aeropuerto de Mérida'
    },
    safetyBadges: ['Chofer Certificado', 'Seguro de Viajero AXXA', 'Unidad Sanitizada'],
    safetyDescription: 'Choferes certificados con pruebas toxicológicas vigentes, GPS de rastreo en tiempo real y póliza de seguro de viajero de amplia cobertura.',
    providerId: 'provider-1',
    providerName: 'Aventuras Mayas S.A.',
    syncedFromWix: false
  }
];

const generateInitialAvailability = () => {
  const registry = {};
  INITIAL_EXPERIENCES.forEach(exp => {
    registry[exp.id] = {};
    initialDates.forEach((date, index) => {
      const dayOfWeek = new Date(date).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const rateMultiplier = isWeekend ? 1.2 : 1.0;
      
      let finalCapacity = exp.capacity;
      let booked = 0;
      
      if (index === 2) {
        booked = exp.capacity;
      } else if (index === 5) {
        booked = exp.capacity - 2;
      } else if (index === 10) {
        finalCapacity = 0;
      }
      
      registry[exp.id][date] = {
        price: Math.round(exp.price * rateMultiplier),
        capacity: finalCapacity,
        booked: booked
      };
    });
  });
  return registry;
};

// Initial Financial Ledger Data
const INITIAL_FINANCIAL_LEDGER = [
  {
    id: 'tx-2001',
    date: '2026-07-28',
    description: 'Honorarios Inspector Auditoría de Seguridad Cenotes',
    type: 'Gasto',
    category: 'Auditoría',
    amount: 3500,
    status: 'Completado'
  },
  {
    id: 'tx-2002',
    date: '2026-07-29',
    description: 'Liquidación de Saldo - Aventuras Mayas S.A.',
    type: 'Pago a Proveedor',
    category: 'Liquidación',
    amount: 8500,
    providerId: 'provider-1',
    status: 'Completado'
  },
  {
    id: 'tx-2003',
    date: '2026-07-30',
    description: 'Alojamiento Servidor Web AWS Portal',
    type: 'Gasto',
    category: 'Servidor',
    amount: 1200,
    status: 'Completado'
  },
  {
    id: 'tx-2004',
    date: '2026-07-31',
    description: 'Campaña Publicidad Instagram Experiencias Yucatán',
    type: 'Gasto',
    category: 'Marketing',
    amount: 4800,
    status: 'Completado'
  },
  {
    id: 'tx-1001',
    date: initialDates[2],
    description: 'Cobro de reserva: Exploración de Cenote Sagrado y Cuevas (15 pax)',
    type: 'Ingreso',
    category: 'Venta de Tour',
    amount: 14250,
    providerId: 'provider-1',
    status: 'Completado'
  },
  {
    id: 'tx-1002',
    date: initialDates[5],
    description: 'Cobro de reserva: Exploración de Cenote Sagrado y Cuevas (13 pax)',
    type: 'Ingreso',
    category: 'Venta de Tour',
    amount: 12350,
    providerId: 'provider-1',
    status: 'Completado'
  }
];

const INITIAL_CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'cenotes', label: 'Cenotes' },
  { id: 'haciendas', label: 'Haciendas' },
  { id: 'barcos', label: 'Marinas & Barcos' },
  { id: 'holisticas', label: 'Holísticas' },
  { id: 'restaurantes', label: 'Gastronomía' },
  { id: 'hoteles', label: 'Hoteles' },
  { id: 'spas', label: 'Spas' }
];

const TRANSLATIONS = {
  es: {
    navTourist: 'Turista',
    navProvider: 'Socio / Experiencia',
    navAdmin: 'Administrador',
    adminSession: '🛡️ ADMIN SESIÓN',
    providerSession: '💼 SOCIO SESIÓN',
    logout: 'Cerrar Sesión',
    loginPrompt: 'Ingresar Contraseña',
    loginCancel: 'Cancelar',
    loginSubmit: 'Entrar',
    footerRights: 'Todos los derechos reservados.',
    searchPlace: 'Cenotes, tours, restaurantes...',
    datePlace: 'Cualquier fecha',
    guestsPlace: '1 persona',
    guestsPlacePlural: '{{count}} personas',
    btnFilter: 'FILTRAR',
    heroTitle: 'Experiencias Curadas y Totalmente Seguras',
    heroSubtitle: 'Reserva tours, cenotes, hospeda y eventos deportivos verificados. Cumplimos con auditorías de seguridad locales y guías certificados.',
    noExpFound: 'No encontramos experiencias con los filtros indicados.',
    btnClearFilters: 'Limpiar filtros',
    reviewsCountLabel: 'reseñas',
    pricePerPerson: 'por persona',
    pricePackage: 'paquete completo',
    btnViewDetails: 'Ver Detalles',
    backToCatalog: 'Volver al catálogo',
    descriptionLabel: 'Descripción',
    protocolsLabel: 'Protocolos y Equipamiento de Seguridad',
    reviewsTitle: 'Reseñas de la Comunidad',
    noReviews: 'Aún no hay reseñas para esta experiencia.',
    addReviewTitle: 'Comparte tu Experiencia',
    reviewName: 'Tu Nombre',
    reviewComment: 'Comentario / Opinión',
    reviewRating: 'Calificación (Estrellas)',
    btnSubmitReview: 'Publicar Reseña',
    verifiedTourist: 'Turista Verificado',
    socialImport: 'Importado de',
    bookGuaranteed: 'Reservar con Garantía',
    soldOut: 'Agotado para esta fecha',
    checkoutTitle: 'Reserva de Experiencia con Garantía',
    checkoutStep1: 'Paso 1: Confirmar Detalles',
    checkoutStep2: 'Paso 2: Pago Seguro de Fianza',
    checkoutStep3: 'Paso 3: Tu SafetyPass Generado',
    dateLabel: 'Fecha seleccionada',
    guestsLabel: 'Cantidad de personas',
    priceTotalLabel: 'Precio Final a Pagar',
    btnNext: 'Siguiente',
    btnCancel: 'Cancelar',
    nameLabel: 'Nombre completo del titular',
    emailLabel: 'Correo electrónico',
    phoneLabel: 'Teléfono celular',
    cardNumber: 'Número de tarjeta (16 dígitos)',
    cardExp: 'Expira (MM/AA)',
    cardCvc: 'CVC / CVV',
    btnPay: 'Confirmar y Pagar',
    payWarning: 'Pago 100% encriptado. Fianza protegida bajo garantía de seguridad.',
    successTitle: '¡Reserva Completada con Éxito!',
    successSub: 'Tu SafetyPass ha sido emitido y enviado a tu correo. Muéstralo al proveedor para iniciar el tour.',
    safetyPassCodeLabel: 'Código Único SafetyPass',
    safetyRulesTitle: 'Reglas de Seguridad y Cancelación',
    safetyRulesText: 'Este boleto cuenta con garantía total. Puedes cancelar hasta 24 horas antes si el clima o condiciones de seguridad impiden el tour y recibirás reembolso completo.',
    btnFinish: 'Entendido y Finalizar',
    tabListings: 'Mis Experiencias',
    tabCalendar: 'Calendario y Fechas',
    tabProfile: 'Mi Perfil y CLABE',
    statsRevenue: 'Ingresos Totales (85%)',
    statsGuests: 'Turistas Recibidos',
    statsRating: 'Puntuación Promedio',
    statsActive: 'Servicios Activos',
    btnRegisterExp: 'Registrar Nueva Experiencia',
    modalTitleAdd: 'Agregar Nueva Experiencia / Servicio',
    labelExpName: 'Nombre del Servicio',
    labelCategory: 'Categoría / Grupo',
    labelLocation: 'Ubicación',
    labelPrice: 'Precio / Tarifa (MXN)',
    labelPriceType: 'Tipo de Tarifa',
    priceTypeInd: 'Cobro Individual (Por Persona)',
    priceTypePkg: 'Paquete Fijo (Por Grupo)',
    labelCapacity: 'Capacidad Máxima',
    labelImage: 'Foto de la Experiencia',
    labelSelectFile: 'Selecciona una foto',
    labelBadges: 'Sellos de Seguridad (Separados por coma)',
    labelSafetyDesc: 'Detalle de Protocolo de Emergencia',
    btnCancelAdd: 'Cancelar',
    btnSubmitAdd: 'Registrar Servicio',
    tabMetrics: 'Métricas del Portal',
    tabAudits: 'Auditoría de Socios',
    tabCurate: 'Curar Catálogo',
    tabFinance: 'Finanzas y Contabilidad',
    tabDesign: 'Aspectos Gráficos',
    adminAuditTitle: 'Bitácora de Seguridad y Auditoría',
    adminSettleTitle: 'Liquidaciones Pendientes',
    labelUploadLogo: 'Subir Logo de Marca (Imagen)',
    labelUploadBg: 'Subir Imagen de Fondo Global',
    labelManageGroups: 'Gestionar Grupos / Categorías',
    btnAddGroup: 'Añadir Grupo',
    labelAddReview: 'Importar Reseña Externa (Redes)',
    labelReviewAuthor: 'Autor de la Reseña',
    labelReviewSource: 'Red Social / Origen',
    btnImportReview: 'Importar Reseña',
    profileSaved: 'Perfil y cuenta CLABE actualizados con éxito.',
    designSaved: 'Configuración visual de marca aplicada correctamente.',
    categoryAdded: 'Nuevo grupo de tour registrado con éxito.',
    reviewAdded: 'Reseña agregada y calificación actualizada.',
    chatBotName: 'Laura | Concierge Virtual',
    chatBotGreeting: '¡Hola! 👋 Soy **Laura**, tu concierge virtual de experiencias seguras en Yucatán. ¿En qué te puedo ayudar hoy?',
    chatBotPlaceholder: 'Escribe tu pregunta...',
    chatBotSend: 'Enviar',
    chatBotOnline: 'En línea',
    chatBotQuickCenotes: '🏊 Cenotes',
    chatBotQuickFood: '🍽️ Gastronomía',
    chatBotQuickSafety: '🛡️ Seguridad',
    chatBotQuickBook: '📅 Reservar',
    chatBotQuickAll: '📋 Ver Todo',
    chatBotNoResults: 'No encontré experiencias con ese criterio. Intenta con: cenotes, haciendas, barcos, gastronomía, hoteles o holísticas.',
    chatBotSafetyInfo: '🛡️ Todas nuestras experiencias cumplen con certificaciones de seguridad locales, guías capacitados en primeros auxilios, equipo sanitizado y seguros de viajero incluidos.',
    chatBotBookInfo: '📅 Para reservar, ve al catálogo de experiencias, selecciona la que más te guste, haz clic en **Ver Detalles**, elige fecha y número de personas, y completa el pago seguro.',
    chatBotFoundExps: 'Encontré estas experiencias para ti:',
    chatBotPriceFrom: 'Desde',
    chatBotRated: 'Calificación',
    chatBotTopRated: '⭐ Estas son las experiencias mejor calificadas:',
    chatBotChukumInfo: '🏛️ **Residencias & Chukum**: En Yucatán integramos acabados orgánicos de Chukum en piscinas y villas de lujo. Si deseas conocer propiedades exclusivas con acabado Chukum o invertir en la región, escribe a un asesor.',
    chatBotPdfInfo: '📄 **Presentación Oficial**: Puedes ver o descargar la presentación comercial completa con información del ecosistema, métricas e inversión en PDF haciendo clic aquí: [Descargar Presentación PDF](/Experience_Safely_Presentacion.pdf)',
    chatBotTransportInfo: '🚐 **Transporte Seguro**: Todos nuestros paquetes incluyen la opción de transporte privado en camionetas sanitizadas con aire acondicionado y chofer certificado desde tu hotel o el aeropuerto de Mérida/Cancún.',
    chatBotSupportInfo: '📱 **Atención Humana 24/7**: Si prefieres hablar con un asesor humano por WhatsApp o teléfono, llama al **+52 999 123 4567** o escríbenos directamente.',
    chatBotDefault: 'Puedo ayudarte con información sobre tours, seguridad, precios, **Chukum / casas**, **transporte** y reservas. Prueba preguntarme sobre **cenotes**, **haciendas**, **precios** o **seguridad**.',
    authTitle: 'Bienvenido a Experience Safely',
    authSubtitle: 'Inicia sesión o regístrate para reservar experiencias seguras',
    authTabLogin: 'Iniciar Sesión',
    authTabRegister: 'Registrarse',
    authGoogle: 'Continuar con Google',
    authOrDivider: 'o continúa con email',
    authName: 'Nombre completo',
    authEmail: 'Correo electrónico',
    authPhone: 'Teléfono celular',
    authPassword: 'Contraseña',
    authConfirmPass: 'Confirmar contraseña',
    authBtnLogin: 'Ingresar',
    authBtnRegister: 'Crear Cuenta',
    authNoAccount: '¿No tienes cuenta?',
    authHasAccount: '¿Ya tienes cuenta?',
    authRegisterLink: 'Regístrate aquí',
    authLoginLink: 'Inicia sesión',
    authLogout: 'Cerrar Sesión',
    authWelcome: 'Hola',
    authPassMismatch: 'Las contraseñas no coinciden',
    authFieldsRequired: 'Completa todos los campos',
    authEmailExists: 'Este correo ya está registrado',
    authInvalidCreds: 'Correo o contraseña incorrectos',
  },
  en: {
    navTourist: 'Tourist',
    navProvider: 'Partner / Experience',
    navAdmin: 'Administrator',
    adminSession: '🛡️ ADMIN SESSION',
    providerSession: '💼 PARTNER SESSION',
    logout: 'Log Out',
    loginPrompt: 'Enter Password',
    loginCancel: 'Cancel',
    loginSubmit: 'Enter',
    footerRights: 'All rights reserved.',
    searchPlace: 'Cenotes, tours, restaurants...',
    datePlace: 'Any date',
    guestsPlace: '1 guest',
    guestsPlacePlural: '{{count}} guests',
    btnFilter: 'FILTER',
    heroTitle: 'Curated & Fully Secure Experiences',
    heroSubtitle: 'Book verified tours, cenotes, hosting, and sports events. We comply with local safety audits and certified guides.',
    noExpFound: 'No experiences found matching the active filters.',
    btnClearFilters: 'Clear filters',
    reviewsCountLabel: 'reviews',
    pricePerPerson: 'per person',
    pricePackage: 'full package',
    btnViewDetails: 'View Details',
    backToCatalog: 'Back to catalog',
    descriptionLabel: 'Description',
    protocolsLabel: 'Safety Protocols & Equipment',
    reviewsTitle: 'Community Reviews',
    noReviews: 'No reviews yet for this experience.',
    addReviewTitle: 'Share Your Experience',
    reviewName: 'Your Name',
    reviewComment: 'Comment / Review',
    reviewRating: 'Rating (Stars)',
    btnSubmitReview: 'Submit Review',
    verifiedTourist: 'Verified Tourist',
    socialImport: 'Imported from',
    bookGuaranteed: 'Book with Guarantee',
    soldOut: 'Sold out for this date',
    checkoutTitle: 'Guaranteed Experience Booking',
    checkoutStep1: 'Step 1: Confirm Details',
    checkoutStep2: 'Step 2: Secure Escrow Payment',
    checkoutStep3: 'Step 3: Your Generated SafetyPass',
    dateLabel: 'Selected Date',
    guestsLabel: 'Number of guests',
    priceTotalLabel: 'Final Price to Pay',
    btnNext: 'Next',
    btnCancel: 'Cancel',
    nameLabel: 'Full name of cardholder',
    emailLabel: 'Email address',
    phoneLabel: 'Cell phone number',
    cardNumber: 'Card number (16 digits)',
    cardExp: 'Expires (MM/YY)',
    cardCvc: 'CVC / CVV',
    btnPay: 'Confirm and Pay',
    payWarning: '100% encrypted payment. Escrow protected under safety guarantee.',
    successTitle: 'Booking Completed Successfully!',
    successSub: 'Your SafetyPass has been issued and sent to your email. Show it to the partner to start the tour.',
    safetyPassCodeLabel: 'Unique SafetyPass Code',
    safetyRulesTitle: 'Safety and Cancellation Rules',
    safetyRulesText: 'This ticket features full guarantee. You can cancel up to 24 hours prior if weather or safety conditions block the tour and receive a full refund.',
    btnFinish: 'Understood and Finish',
    tabListings: 'My Listings',
    tabCalendar: 'Calendar & Availability',
    tabProfile: 'Profile & CLABE',
    statsRevenue: 'Total Revenue (85%)',
    statsGuests: 'Guests Served',
    statsRating: 'Average Rating',
    statsActive: 'Active Listings',
    btnRegisterExp: 'Register New Experience',
    modalTitleAdd: 'Add New Experience / Service',
    labelExpName: 'Service Name',
    labelCategory: 'Category / Group',
    labelLocation: 'Location',
    labelPrice: 'Price / Rate (MXN)',
    labelPriceType: 'Pricing Type',
    priceTypeInd: 'Individual Rate (Per Person)',
    priceTypePkg: 'Flat Rate (Per Package)',
    labelCapacity: 'Maximum Capacity',
    labelImage: 'Experience Photo',
    labelSelectFile: 'Select a photo',
    labelBadges: 'Safety Badges (Comma separated)',
    labelSafetyDesc: 'Emergency Protocol Detail',
    btnCancelAdd: 'Cancel',
    btnSubmitAdd: 'Register Service',
    tabMetrics: 'Portal Metrics',
    tabAudits: 'Partner Audits',
    tabCurate: 'Curate Catalog',
    tabFinance: 'Finances & Accounting',
    tabDesign: 'Design & Branding',
    adminAuditTitle: 'Security & Audit Log',
    adminSettleTitle: 'Pending Settlements',
    labelUploadLogo: 'Upload Brand Logo (Image)',
    labelUploadBg: 'Upload Global Background Image',
    labelManageGroups: 'Manage Groups / Categories',
    btnAddGroup: 'Add Group',
    labelAddReview: 'Import Social Review (Networks)',
    labelReviewAuthor: 'Review Author',
    labelReviewSource: 'Social Network / Source',
    btnImportReview: 'Import Review',
    profileSaved: 'Profile and CLABE account successfully updated.',
    designSaved: 'Visual branding configuration applied successfully.',
    categoryAdded: 'New tour group registered successfully.',
    reviewAdded: 'Review added and rating updated.',
    chatBotName: 'Laura | Virtual Concierge',
    chatBotGreeting: 'Hello! 👋 I am **Laura**, your virtual concierge for safe experiences in Yucatan. How can I assist you today?',
    chatBotPlaceholder: 'Type your question...',
    chatBotSend: 'Send',
    chatBotOnline: 'Online',
    chatBotQuickCenotes: '🏊 Cenotes',
    chatBotQuickFood: '🍽️ Food Tours',
    chatBotQuickSafety: '🛡️ Safety',
    chatBotQuickBook: '📅 Book Now',
    chatBotQuickAll: '📋 View All',
    chatBotNoResults: 'I couldn\'t find experiences matching that query. Try: cenotes, haciendas, boats, food, hotels, or wellness.',
    chatBotSafetyInfo: '🛡️ All our experiences meet local safety certifications, first-aid trained guides, sanitized equipment, and traveler insurance included.',
    chatBotBookInfo: '📅 To book, browse the experience catalog, select one you like, click **View Details**, choose a date and number of guests, and complete the secure payment.',
    chatBotFoundExps: 'I found these experiences for you:',
    chatBotPriceFrom: 'From',
    chatBotRated: 'Rating',
    chatBotTopRated: '⭐ These are the top-rated experiences:',
    chatBotChukumInfo: '🏛️ **Residences & Chukum**: In Yucatan we integrate organic Chukum finishes into luxury pools and villas. If you are interested in exclusive Chukum properties or investing in the region, contact an advisor.',
    chatBotPdfInfo: '📄 **Official Presentation**: You can view or download our complete pitch deck PDF with ecosystem details, metrics, and investment model by clicking here: [Download PDF Deck](/Experience_Safely_Presentacion.pdf)',
    chatBotTransportInfo: '🚐 **Safe Transport**: All our packages offer optional private transfer in sanitized AC vans with certified drivers from your hotel or Merida/Cancun airport.',
    chatBotSupportInfo: '📱 **Human Support 24/7**: If you prefer to speak to a human advisor via WhatsApp or phone, call **+52 999 123 4567** or message us directly.',
    chatBotDefault: 'I can help you with info about tours, safety, pricing, **Chukum / properties**, **transportation**, and bookings. Try asking me about **cenotes**, **haciendas**, **prices**, or **safety**.',
    authTitle: 'Welcome to Experience Safely',
    authSubtitle: 'Sign in or register to book safe experiences',
    authTabLogin: 'Sign In',
    authTabRegister: 'Register',
    authGoogle: 'Continue with Google',
    authOrDivider: 'or continue with email',
    authName: 'Full name',
    authEmail: 'Email address',
    authPhone: 'Phone number',
    authPassword: 'Password',
    authConfirmPass: 'Confirm password',
    authBtnLogin: 'Sign In',
    authBtnRegister: 'Create Account',
    authNoAccount: "Don't have an account?",
    authHasAccount: 'Already have an account?',
    authRegisterLink: 'Register here',
    authLoginLink: 'Sign in',
    authLogout: 'Log Out',
    authWelcome: 'Hello',
    authPassMismatch: 'Passwords do not match',
    authFieldsRequired: 'Please fill all fields',
    authEmailExists: 'This email is already registered',
    authInvalidCreds: 'Invalid email or password',
  }
};

export const AppProvider = ({ children }) => {
  const [experiences, setExperiences] = useState(INITIAL_EXPERIENCES);
  const [calendarAvailability, setCalendarAvailability] = useState(generateInitialAvailability());
  
  const [bookings, setBookings] = useState([
    {
      id: 'bk-101',
      experienceId: 'exp-1',
      experienceName: 'Exploración de Cenote Sagrado y Cuevas',
      date: initialDates[2],
      guests: 15,
      totalPrice: 14250,
      touristName: 'John Doe',
      touristEmail: 'john@example.com',
      status: 'Confirmada',
      paymentMethod: 'Tarjeta de Crédito',
      safetyPassCode: 'SAFE-ZACI-3949'
    },
    {
      id: 'bk-102',
      experienceId: 'exp-1',
      experienceName: 'Exploración de Cenote Sagrado y Cuevas',
      date: initialDates[5],
      guests: 13,
      totalPrice: 12350,
      touristName: 'Ana Gomez',
      touristEmail: 'ana@gomez.com',
      status: 'Confirmada',
      paymentMethod: 'Transferencia Coppel Pay',
      safetyPassCode: 'SAFE-ZACI-8812'
    }
  ]);

  // Language and Multilanguage Switcher
  const [language, setLanguage] = useState('es');
  const toggleLanguage = () => setLanguage(prev => prev === 'es' ? 'en' : 'es');
  
  const t = (key, count) => {
    let text = TRANSLATIONS[language]?.[key] || TRANSLATIONS['es']?.[key] || key;
    if (count !== undefined) {
      text = text.replace('{{count}}', count);
    }
    return text;
  };

  // Dynamic categories/groups state
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  const addCategory = (label) => {
    if (!label) return;
    const id = label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (categories.some(c => c.id === id)) return;
    setCategories(prev => [...prev, { id, label }]);
    addAuditLog('system', `Nuevo grupo / categoría registrada: "${label}"`);
  };

  // Financial Ledger state
  const [financialLedger, setFinancialLedger] = useState(INITIAL_FINANCIAL_LEDGER);

  const [currentProfile, setCurrentProfile] = useState('tourist');
  const [activeProviderId, setActiveProviderId] = useState('provider-1');
  
  // Graphical Customizer Design State
  const [siteDesign, setSiteDesign] = useState({
    title: 'Experience Safely',
    slogan: 'The Safest Way to Experience Yucatán',
    accentColor: '#FF6B4D',
    heroImage: '/hero_yucatan.jpg',
    heroMediaType: 'video', // 'image' | 'video'
    heroVideo: 'https://assets.mixkit.co/videos/preview/mixkit-diving-in-a-clear-water-cenote-41559-large.mp4',
    logo: '/Logo - Experience Safely.png',
    backgroundImage: '/hero_yucatan.jpg'
  });



  // Password-lock Authentication state
  const [auth, setAuth] = useState({
    isAdminLoggedIn: false,
    isProviderLoggedIn: false
  });

  // Tourist User Authentication (persisted in localStorage)
  const [touristUser, setTouristUser] = useState(() => {
    try {
      const saved = localStorage.getItem('es_tourist_user');
      return (saved && saved !== 'undefined' && saved !== 'null') ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('es_registered_users');
      return (saved && saved !== 'undefined' && saved !== 'null') ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const registerTourist = (userData) => {
    const exists = registeredUsers.find(u => u.email === userData.email);
    if (exists) return { success: false, error: 'authEmailExists' };
    const newUser = { ...userData, id: `tourist-${Date.now()}`, createdAt: new Date().toISOString() };
    const updated = [...registeredUsers, newUser];
    setRegisteredUsers(updated);
    localStorage.setItem('es_registered_users', JSON.stringify(updated));
    const { password, ...safeUser } = newUser;
    setTouristUser(safeUser);
    localStorage.setItem('es_tourist_user', JSON.stringify(safeUser));
    addAuditLog('system', `Nuevo turista registrado: ${userData.name} (${userData.email})`);
    return { success: true };
  };

  const loginTourist = (email, password) => {
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    if (!user) return { success: false, error: 'authInvalidCreds' };
    const { password: _, ...safeUser } = user;
    setTouristUser(safeUser);
    localStorage.setItem('es_tourist_user', JSON.stringify(safeUser));
    return { success: true };
  };

  const loginWithGoogle = () => {
    const googleUser = {
      id: `google-${Date.now()}`,
      name: 'Turista Google',
      email: 'turista@gmail.com',
      phone: '',
      provider: 'google',
      createdAt: new Date().toISOString()
    };
    setTouristUser(googleUser);
    localStorage.setItem('es_tourist_user', JSON.stringify(googleUser));
    return { success: true };
  };

  const logoutTourist = () => {
    setTouristUser(null);
    localStorage.removeItem('es_tourist_user');
  };

  // Providers database
  const [providers, setProviders] = useState([
    { id: 'provider-1', name: 'Aventuras Mayas S.A.', rfc: 'AMA190204XY9', status: 'Aprobado', safetyRating: 'Gold', contact: 'contacto@aventurasmayas.mx' },
    { id: 'provider-2', name: 'Haciendas de Yucatán Club', rfc: 'HYC110825LL2', status: 'Aprobado', safetyRating: 'Gold', contact: 'admin@haciendasyucatan.com' },
    { id: 'provider-3', name: 'Yucatán Wellness Center', rfc: 'YWC180415AA7', status: 'Aprobado', safetyRating: 'Verified', contact: 'info@yucatanwellness.mx' },
    { id: 'provider-4', name: 'Rosas & Xocolate Boutique', rfc: 'RXB091210PP1', status: 'Aprobado', safetyRating: 'Gold', contact: 'reservaciones@rosasandxocolate.com' },
    { id: 'provider-5', name: 'Marinas del Norte Yucatán', rfc: 'MNY201103BC3', status: 'Pendiente', safetyRating: 'None', contact: 'ventas@marinasnorte.com' }
  ]);

  // Provider Profiles state (CLABE and Bank credentials)
  const [providerProfiles, setProviderProfiles] = useState({
    'provider-1': {
      representativeName: 'Gabriel Pech',
      commercialPhone: '9991234567',
      paymentEmail: 'contacto@experiencesafely.com',
      bankClabe: '012914002015384729'
    },
    'provider-2': {
      representativeName: 'Sofía López',
      commercialPhone: '9997654321',
      paymentEmail: 'pagos@haciendasyucatan.com',
      bankClabe: '012914002015389999'
    },
    'provider-3': {
      representativeName: 'Manuel Alonzo',
      commercialPhone: '9884561230',
      paymentEmail: 'finanzas@yucatanwellness.mx',
      bankClabe: '012914002015388888'
    },
    'provider-4': {
      representativeName: 'Carla Rosas',
      commercialPhone: '9999876543',
      paymentEmail: 'cuentas@rosasandxocolate.com',
      bankClabe: '012914002015387777'
    }
  });

  // Audit Logs database for Admin
  const [auditLogs, setAuditLogs] = useState([
    { timestamp: '2026-08-03 10:14:02', type: 'security', message: 'Auditoría aprobada para el socio: Aventuras Mayas S.A.' },
    { timestamp: '2026-08-02 09:12:45', type: 'system', message: 'Parámetros de seguridad actualizados para el tour Cenote Sagrado.' },
    { timestamp: '2026-08-01 16:30:20', type: 'financial', message: 'Liquidación de balance procesada con éxito por $16,500 MXN.' }
  ]);

  // Auth Operations
  const login = (profile, password) => {
    if (profile === 'admin') {
      if (password === 'nohayimposible2026') {
        setAuth(prev => ({ ...prev, isAdminLoggedIn: true }));
        return { success: true };
      }
      return { success: false, error: 'Contraseña de Administrador incorrecta.' };
    } else if (profile === 'provider') {
      if (password === 'nohayimposible2026') {
        setAuth(prev => ({ ...prev, isProviderLoggedIn: true }));
        return { success: true };
      }
      return { success: false, error: 'Contraseña de Empresa/Socio incorrecta.' };
    }
    return { success: false, error: 'Perfil inválido.' };
  };

  const logout = (profile) => {
    if (profile === 'admin') {
      setAuth(prev => ({ ...prev, isAdminLoggedIn: false }));
    } else if (profile === 'provider') {
      setAuth(prev => ({ ...prev, isProviderLoggedIn: false }));
    }
    setCurrentProfile('tourist');
  };

  // Graphical customization updater
  const updateSiteDesign = (newDesign) => {
    setSiteDesign(prev => ({ ...prev, ...newDesign }));
  };

  // Experience removal by Admin (Curation)
  const removeExperienceAdmin = (id) => {
    setExperiences(prev => prev.filter(e => e.id !== id));
  };

  // Finance Ledger Operations
  const addExpenseMovement = (description, category, amount) => {
    const newMovement = {
      id: 'tx-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString().split('T')[0],
      description,
      type: 'Gasto',
      category,
      amount: Number(amount),
      status: 'Completado'
    };
    setFinancialLedger(prev => [newMovement, ...prev]);
  };

  const settleProviderPayout = (providerId, amount) => {
    const providerName = providers.find(p => p.id === providerId)?.name || 'Proveedor';
    const newMovement = {
      id: 'tx-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString().split('T')[0],
      description: `Liquidación de saldo - ${providerName}`,
      type: 'Pago a Proveedor',
      category: 'Liquidación',
      amount: Number(amount),
      providerId,
      status: 'Completado'
    };
    setFinancialLedger(prev => [newMovement, ...prev]);
  };

  const updateCalendarAvailability = (experienceId, dateStr, price, capacity) => {
    setCalendarAvailability(prev => {
      const expRegistry = prev[experienceId] || {};
      const currentSlot = expRegistry[dateStr] || { booked: 0 };
      
      return {
        ...prev,
        [experienceId]: {
          ...expRegistry,
          [dateStr]: {
            price: Number(price),
            capacity: Number(capacity),
            booked: currentSlot.booked
          }
        }
      };
    });
  };

  const changeProfile = (profile) => {
    setCurrentProfile(profile);
  };

  const checkAvailability = (experienceId, dateStr, guests) => {
    const expRegistry = calendarAvailability[experienceId];
    if (!expRegistry) return { available: false, reason: 'Experiencia no encontrada' };
    
    const slot = expRegistry[dateStr];
    if (!slot) return { available: false, reason: 'Fecha no habilitada' };
    if (slot.capacity === 0) return { available: false, reason: 'No disponible' };
    
    const remaining = slot.capacity - slot.booked;
    if (remaining < guests) {
      return { available: false, reason: `Cupo insuficiente (solo quedan ${remaining} lugares)` };
    }
    
    return { available: true, price: slot.price, spotsLeft: remaining };
  };

  const bookExperience = (experienceId, dateStr, guests, name, email, paymentMethod = 'Tarjeta de Crédito') => {
    const check = checkAvailability(experienceId, dateStr, guests);
    if (!check.available) return { success: false, error: check.reason };
    
    const exp = experiences.find(e => e.id === experienceId);
    const isPackage = exp?.pricingType === 'package';
    const totalPrice = isPackage ? check.price : (check.price * guests);
    const bookingId = 'bk-' + Math.floor(100 + Math.random() * 900);
    const passCode = 'SAFE-' + exp.category.toUpperCase().slice(0, 4) + '-' + Math.floor(1000 + Math.random() * 9000);
    
    const newBooking = {
      id: bookingId,
      experienceId,
      experienceName: exp.name,
      date: dateStr,
      guests: Number(guests),
      totalPrice,
      touristName: name,
      touristEmail: email,
      status: 'Confirmada',
      paymentMethod,
      safetyPassCode: passCode
    };

    setBookings(prev => [newBooking, ...prev]);

    // Book the spots in calendar
    setCalendarAvailability(prev => {
      const expRegistry = prev[experienceId] || {};
      const slot = expRegistry[dateStr];
      return {
        ...prev,
        [experienceId]: {
          ...expRegistry,
          [dateStr]: {
            ...slot,
            booked: slot.booked + Number(guests)
          }
        }
      };
    });

    // Automatically record entry in the financial ledger
    const bookingLedgerEntry = {
      id: 'tx-' + Math.floor(1000 + Math.random() * 9000),
      date: dateStr,
      description: `Cobro de reserva: ${exp.name} (${guests} pax)`,
      type: 'Ingreso',
      category: 'Venta de Tour',
      amount: totalPrice,
      providerId: exp.providerId,
      status: 'Completado'
    };
    setFinancialLedger(prev => [bookingLedgerEntry, ...prev]);

    return { success: true, booking: newBooking };
  };

  const addExperience = (newExp) => {
    const id = 'exp-' + (experiences.length + 1);
    const expWithId = {
      ...newExp,
      id,
      rating: 5.0,
      reviewsCount: 0,
      pricingType: newExp.pricingType || 'individual',
      reviews: [],
      image: newExp.image || '/branding_2.jpg'
    };
    
    setExperiences(prev => [...prev, expWithId]);
    addAuditLog('security', `Nueva experiencia registrada: "${newExp.name}" por Socio ID: ${newExp.providerId}`);
    
    setCalendarAvailability(prev => {
      const datesReg = {};
      initialDates.forEach(date => {
        datesReg[date] = {
          price: Number(newExp.price),
          capacity: Number(newExp.capacity),
          booked: 0
        };
      });
      return {
        ...prev,
        [id]: datesReg
      };
    });
  };

  const addExperienceReview = (expId, reviewData) => {
    const id = 'rev-' + Date.now();
    const newReview = {
      id,
      author: reviewData.author,
      rating: Number(reviewData.rating),
      comment: reviewData.comment,
      date: new Date().toISOString().split('T')[0],
      source: reviewData.source || 'Turista Verificado'
    };

    setExperiences(prev => prev.map(exp => {
      if (exp.id === expId) {
        const currentReviews = exp.reviews || [];
        const updatedReviews = [newReview, ...currentReviews];
        const sumRatings = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
        const avgRating = Number((sumRatings / updatedReviews.length).toFixed(1));
        
        // Log auditing for system security
        setTimeout(() => {
          addAuditLog('system', `Nueva reseña para "${exp.name}" por ${reviewData.author}. Rating: ${avgRating}`);
        }, 100);

        return {
          ...exp,
          reviews: updatedReviews,
          rating: avgRating,
          reviewsCount: updatedReviews.length
        };
      }
      return exp;
    }));
  };

  const updateExperience = (updatedExp) => {
    setExperiences(prev => prev.map(e => e.id === updatedExp.id ? updatedExp : e));
    addAuditLog('system', `Experiencia editada: "${updatedExp.name}"`);
  };

  const deleteExperience = (id) => {
    const name = experiences.find(e => e.id === id)?.name || id;
    setExperiences(prev => prev.filter(e => e.id !== id));
    addAuditLog('security', `Experiencia eliminada del catálogo: "${name}"`);
  };

  const updateProviderProfile = (providerId, profileData) => {
    setProviderProfiles(prev => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        ...profileData
      }
    }));
    addAuditLog('system', `Perfil contable y CLABE actualizados para Socio ID: ${providerId}`);
  };

  const addAuditLog = (type, message) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setAuditLogs(prev => [{ timestamp, type, message }, ...prev]);
  };

  const approveProvider = (providerId) => {
    setProviders(prev => prev.map(p => p.id === providerId ? { ...p, status: 'Aprobado', safetyRating: 'Verified' } : p));
    const name = providers.find(p => p.id === providerId)?.name || providerId;
    addAuditLog('security', `Socio Aprobado: ${name}. Estatus de seguridad elevado a "Verified".`);
  };

  const rejectProvider = (providerId) => {
    setProviders(prev => prev.map(p => p.id === providerId ? { ...p, status: 'Rechazado', safetyRating: 'None' } : p));
    const name = providers.find(p => p.id === providerId)?.name || providerId;
    addAuditLog('security', `Socio Rechazado: ${name}. Estatus de seguridad bajado a "None".`);
  };

  return (
    <AppContext.Provider value={{
      experiences,
      calendarAvailability,
      bookings,
      currentProfile,
      activeProviderId,
      providers,
      providerProfiles,
      auditLogs,
      dates: initialDates,
      siteDesign,
      auth,
      financialLedger,
      language,
      t,
      toggleLanguage,
      categories,
      addCategory,
      addExperienceReview,
      changeProfile,
      updateCalendarAvailability,
      checkAvailability,
      bookExperience,
      addExperience,
      updateExperience,
      deleteExperience,
      updateProviderProfile,
      addAuditLog,
      approveProvider,
      rejectProvider,
      login,
      logout,
      updateSiteDesign,
      removeExperienceAdmin,
      addExpenseMovement,
      settleProviderPayout,
      touristUser,
      registerTourist,
      loginTourist,
      loginWithGoogle,
      logoutTourist
    }}>
      {children}
    </AppContext.Provider>
  );
};
