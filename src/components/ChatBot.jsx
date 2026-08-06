import React, { useState, useRef, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';

export default function ChatBot() {
  const context = useContext(AppContext) || {};
  const { experiences = [], language = 'es', t = (k) => k } = context;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize with greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'greeting',
        sender: 'bot',
        text: t('chatBotGreeting'),
        timestamp: new Date(),
        showQuickActions: true
      }]);
    }
  }, [language]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // -------- NLP Engine --------
  const CATEGORY_MAP = {
    cenote: 'cenotes', cenotes: 'cenotes', swimming: 'cenotes', nadar: 'cenotes', cueva: 'cenotes',
    hacienda: 'haciendas', haciendas: 'haciendas', cena: 'haciendas', gala: 'haciendas',
    barco: 'barcos', barcos: 'barcos', catamaran: 'barcos', boat: 'barcos', marina: 'barcos', velero: 'barcos', yacht: 'barcos',
    holistica: 'holisticas', holisticas: 'holisticas', temazcal: 'holisticas', spa: 'holisticas', wellness: 'holisticas', yoga: 'holisticas',
    restaurante: 'restaurantes', restaurantes: 'restaurantes', comida: 'restaurantes', food: 'restaurantes', gastronomia: 'restaurantes', gastronomía: 'restaurantes', cocina: 'restaurantes',
    hotel: 'hoteles', hoteles: 'hoteles', hospedaje: 'hoteles', hospedar: 'hoteles', stay: 'hoteles', dormir: 'hoteles',
  };

  const detectIntent = (text) => {
    const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const words = lower.split(/\s+/);

    // Safety intent
    if (['seguridad', 'seguro', 'certificado', 'emergencia', 'safety', 'safe', 'certified', 'chaleco', 'primeros auxilios'].some(w => lower.includes(w))) {
      return { intent: 'safety' };
    }

    // Chukum & Real Estate intent
    if (['chukum', 'casa', 'casas', 'bienes raices', 'propiedad', 'inmueble', 'inversion', 'arquitectura', 'construccion', 'real estate'].some(w => lower.includes(w))) {
      return { intent: 'chukum' };
    }

    // Transport / Pickup intent
    if (['transporte', 'traslado', 'taxi', 'camioneta', 'pickup', 'aeropuerto', 'llegar'].some(w => lower.includes(w))) {
      return { intent: 'transport' };
    }

    // Human Support / WhatsApp intent
    if (['humano', 'agente', 'persona', 'whatsapp', 'contacto', 'hablar', 'telefono', 'soporte', 'asesor'].some(w => lower.includes(w))) {
      return { intent: 'support' };
    }

    // Booking intent
    if (['reservar', 'reserva', 'booking', 'book', 'agendar', 'disponibilidad', 'availability'].some(w => lower.includes(w))) {
      return { intent: 'booking' };
    }

    // Recommendation / top rated
    if (['recomienda', 'recomendacion', 'mejor', 'top', 'popular', 'recommend', 'best'].some(w => lower.includes(w))) {
      return { intent: 'recommend' };
    }

    // Price intent
    if (['precio', 'precios', 'costo', 'cuanto', 'barato', 'economico', 'price', 'cost', 'cheap', 'paquete', 'package'].some(w => lower.includes(w))) {
      return { intent: 'prices' };
    }

    // Greeting
    if (['hola', 'hi', 'hello', 'buenos', 'buenas', 'hey', 'que tal', 'saludos'].some(w => lower.includes(w))) {
      return { intent: 'greeting' };
    }

    // All experiences
    if (['todo', 'todos', 'todas', 'all', 'catalogo', 'catalog', 'lista', 'list', 'ver'].some(w => lower.includes(w))) {
      return { intent: 'all' };
    }

    // Category search
    for (const word of words) {
      if (CATEGORY_MAP[word]) {
        return { intent: 'category', category: CATEGORY_MAP[word] };
      }
    }

    // Location search
    const locations = ['merida', 'valladolid', 'progreso', 'izamal', 'mucuyche'];
    for (const loc of locations) {
      if (lower.includes(loc)) {
        return { intent: 'location', location: loc };
      }
    }

    return { intent: 'unknown' };
  };

  const formatExpList = (exps) => {
    return exps.map(exp => {
      const priceLabel = exp.pricingType === 'package'
        ? `$${exp.price.toLocaleString()} MXN (${t('pricePackage')})`
        : `$${exp.price.toLocaleString()} MXN/${t('pricePerPerson')}`;
      return `• **${exp.name}** — ${exp.location}\n  💰 ${t('chatBotPriceFrom')} ${priceLabel}\n  ⭐ ${t('chatBotRated')}: ${exp.rating}/5 (${exp.reviewsCount} ${t('reviewsCountLabel')})`;
    }).join('\n\n');
  };

  const generateResponse = (text) => {
    const { intent, category, location } = detectIntent(text);

    switch (intent) {
      case 'chukum':
        return t('chatBotChukumInfo');

      case 'transport':
        return t('chatBotTransportInfo');

      case 'support':
        return t('chatBotSupportInfo');

      case 'safety':
        return t('chatBotSafetyInfo');

      case 'booking':
        return t('chatBotBookInfo');

      case 'greeting':
        return t('chatBotGreeting');

      case 'recommend': {
        const top = [...experiences].sort((a, b) => b.rating - a.rating).slice(0, 3);
        return `${t('chatBotTopRated')}\n\n${formatExpList(top)}`;
      }

      case 'prices': {
        const sorted = [...experiences].sort((a, b) => a.price - b.price);
        return `💰 ${t('chatBotFoundExps')}\n\n${formatExpList(sorted)}`;
      }

      case 'all': {
        return `📋 ${t('chatBotFoundExps')}\n\n${formatExpList(experiences)}`;
      }

      case 'category': {
        const filtered = experiences.filter(e => e.category === category);
        if (filtered.length === 0) return t('chatBotNoResults');
        return `${t('chatBotFoundExps')}\n\n${formatExpList(filtered)}`;
      }

      case 'location': {
        const filtered = experiences.filter(e => e.location.toLowerCase().includes(location));
        if (filtered.length === 0) return t('chatBotNoResults');
        return `${t('chatBotFoundExps')}\n\n${formatExpList(filtered)}`;
      }

      default:
        return t('chatBotDefault');
    }
  };

  // -------- Handlers --------
  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(trimmed);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  };

  const handleQuickAction = (action) => {
    const quickTexts = {
      cenotes: language === 'es' ? 'cenotes' : 'cenotes',
      food: language === 'es' ? 'gastronomía' : 'food',
      safety: language === 'es' ? 'seguridad' : 'safety',
      book: language === 'es' ? 'reservar' : 'book',
      all: language === 'es' ? 'ver todo' : 'view all'
    };
    setInput(quickTexts[action] || '');
    // Auto-send
    const text = quickTexts[action];
    const userMsg = { id: `user-${Date.now()}`, sender: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setTimeout(() => {
      const response = generateResponse(text);
      setMessages(prev => [...prev, { id: `bot-${Date.now()}`, sender: 'bot', text: response, timestamp: new Date() }]);
      setIsTyping(false);
    }, 600 + Math.random() * 800);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Simple markdown-like bold rendering
  const renderText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: '#00C2B3' }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-fab"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00C2B3, #00a89b)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0, 194, 179, 0.4), 0 0 40px rgba(0, 194, 179, 0.15)',
          zIndex: 9998,
          transition: 'all 0.3s ease',
          transform: isOpen ? 'scale(0.9) rotate(90deg)' : 'scale(1)',
        }}
      >
        {isOpen ? <X size={26} color="#fff" /> : <MessageCircle size={26} color="#fff" />}
      </button>

      {/* Pulse ring animation */}
      {!isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: '2px solid rgba(0, 194, 179, 0.4)',
          zIndex: 9997,
          animation: 'chatbot-pulse 2s ease-out infinite',
          pointerEvents: 'none'
        }} />
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window" style={{
          position: 'fixed',
          bottom: '96px',
          right: '24px',
          width: '380px',
          maxWidth: 'calc(100vw - 32px)',
          height: '520px',
          maxHeight: 'calc(100vh - 140px)',
          borderRadius: '20px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9998,
          background: 'rgba(13, 24, 42, 0.97)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 194, 179, 0.08)',
          backdropFilter: 'blur(20px)',
          animation: 'chatbot-slide-up 0.35s ease-out'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, rgba(0, 194, 179, 0.15), rgba(0, 194, 179, 0.05))',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00C2B3, #00a89b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0, 194, 179, 0.3)'
            }}>
              <Bot size={22} color="#fff" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#fff' }}>
                {t('chatBotName')} <Sparkles size={14} style={{ color: '#FFD700', marginLeft: '4px' }} />
              </div>
              <div style={{ fontSize: '0.72rem', color: '#00C2B3', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00C2B3', display: 'inline-block' }} />
                {t('chatBotOnline')}
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '6px',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.6)',
                display: 'flex',
                transition: 'all 0.2s'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {messages.map(msg => (
              <div key={msg.id}>
                <div style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: '8px',
                  alignItems: 'flex-end'
                }}>
                  {msg.sender === 'bot' && (
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00C2B3, #00a89b)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Bot size={14} color="#fff" />
                    </div>
                  )}
                  <div style={{
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: msg.sender === 'user'
                      ? '16px 16px 4px 16px'
                      : '16px 16px 16px 4px',
                    background: msg.sender === 'user'
                      ? 'linear-gradient(135deg, #FF6B4D, #e55a3f)'
                      : 'rgba(255, 255, 255, 0.06)',
                    border: msg.sender === 'user'
                      ? 'none'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    color: '#fff',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {renderText(msg.text)}
                  </div>
                  {msg.sender === 'user' && (
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'rgba(255, 107, 77, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <User size={14} color="#FF6B4D" />
                    </div>
                  )}
                </div>

                {/* Quick Actions after greeting */}
                {msg.showQuickActions && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginTop: '10px',
                    marginLeft: '36px'
                  }}>
                    {[
                      { key: 'cenotes', label: t('chatBotQuickCenotes') },
                      { key: 'food', label: t('chatBotQuickFood') },
                      { key: 'safety', label: t('chatBotQuickSafety') },
                      { key: 'book', label: t('chatBotQuickBook') },
                      { key: 'all', label: t('chatBotQuickAll') },
                    ].map(btn => (
                      <button
                        key={btn.key}
                        onClick={() => handleQuickAction(btn.key)}
                        style={{
                          background: 'rgba(0, 194, 179, 0.1)',
                          border: '1px solid rgba(0, 194, 179, 0.3)',
                          color: '#00C2B3',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          fontWeight: '600',
                          transition: 'all 0.2s',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(0, 194, 179, 0.25)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'rgba(0, 194, 179, 0.1)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00C2B3, #00a89b)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Bot size={14} color="#fff" />
                </div>
                <div style={{
                  padding: '12px 18px',
                  borderRadius: '16px 16px 16px 4px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center'
                }}>
                  <span className="typing-dot" style={{ animationDelay: '0s' }} />
                  <span className="typing-dot" style={{ animationDelay: '0.2s' }} />
                  <span className="typing-dot" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            gap: '8px',
            background: 'rgba(13, 24, 42, 0.95)'
          }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chatBotPlaceholder')}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '10px 16px',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(0, 194, 179, 0.5)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              style={{
                background: input.trim()
                  ? 'linear-gradient(135deg, #00C2B3, #00a89b)'
                  : 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 14px',
                cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                boxShadow: input.trim() ? '0 2px 8px rgba(0, 194, 179, 0.3)' : 'none'
              }}
            >
              <Send size={18} color={input.trim() ? '#fff' : 'rgba(255,255,255,0.3)'} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
