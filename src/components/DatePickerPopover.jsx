import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon } from 'lucide-react';

export default function DatePickerPopover({ value, onChange, onClose, language = 'es' }) {
  const today = new Date();
  
  // Parse initial selected date or default to current month
  const initialDate = value ? new Date(value + 'T00:00:00') : today;
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

  // ESC Key Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const monthNamesEs = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const weekDaysEs = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const weekDaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const monthNames = language === 'es' ? monthNamesEs : monthNamesEn;
  const weekDays = language === 'es' ? weekDaysEs : weekDaysEn;

  // Days calculations
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleSelectDay = (day) => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const formatted = `${currentYear}-${monthStr}-${dayStr}`;
    onChange(formatted);
    onClose?.();
  };

  // Format today YYYY-MM-DD
  const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8, 15, 27, 0.75)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100000,
        padding: '16px',
        animation: 'chatbot-slide-up 0.25s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        className="glass-modal" 
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '360px',
          padding: '24px',
          borderRadius: '24px',
          background: 'rgba(13, 24, 42, 0.95)',
          border: '1px solid rgba(0, 194, 179, 0.4)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 194, 179, 0.25)',
          position: 'relative'
        }}
      >
        {/* Modal Top Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00C2B3', fontWeight: '800', fontSize: '1rem' }}>
            <CalendarIcon size={20} />
            <span>{language === 'es' ? 'Seleccionar Fecha de Salida' : 'Select Departure Date'}</span>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.7)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Month Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <button 
            type="button"
            onClick={handlePrevMonth}
            style={{ background: 'rgba(0,194,179,0.12)', border: '1px solid rgba(0,194,179,0.3)', color: '#00C2B3', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', fontSize: '0.75rem' }}
          >
            <ChevronLeft size={16} /> {language === 'es' ? 'Ant' : 'Prev'}
          </button>

          <div style={{ fontWeight: '800', fontSize: '1.02rem', color: '#fff' }}>
            {monthNames[currentMonth]} {currentYear}
          </div>

          <button 
            type="button"
            onClick={handleNextMonth}
            style={{ background: 'rgba(0,194,179,0.12)', border: '1px solid rgba(0,194,179,0.3)', color: '#00C2B3', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', fontSize: '0.75rem' }}
          >
            {language === 'es' ? 'Sig' : 'Next'} <ChevronRight size={16} />
          </button>
        </div>

        {/* Weekdays Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '10px' }}>
          {weekDays.map(d => (
            <span key={d} style={{ fontSize: '0.76rem', fontWeight: '800', color: 'var(--color-gold)' }}>
              {d}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const monthStr = String(currentMonth + 1).padStart(2, '0');
            const dayStr = String(day).padStart(2, '0');
            const dateStr = `${currentYear}-${monthStr}-${dayStr}`;

            const isSelected = value === dateStr;
            const isToday = todayFormatted === dateStr;

            return (
              <button
                key={day}
                type="button"
                onClick={() => handleSelectDay(day)}
                style={{
                  height: '40px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #00C2B3' : isToday ? '1px solid rgba(255, 107, 77, 0.6)' : 'none',
                  background: isSelected 
                    ? 'linear-gradient(135deg, #00C2B3, #00a89b)' 
                    : isToday 
                      ? 'rgba(255, 107, 77, 0.15)' 
                      : 'rgba(255,255,255,0.04)',
                  color: isSelected ? '#fff' : isToday ? '#FF6B4D' : '#fff',
                  fontWeight: isSelected || isToday ? '800' : '600',
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 4px 12px rgba(0, 194, 179, 0.4)' : 'none',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  if (!isSelected) e.currentTarget.style.background = 'rgba(0, 194, 179, 0.25)';
                }}
                onMouseLeave={e => {
                  if (!isSelected) e.currentTarget.style.background = isToday ? 'rgba(255, 107, 77, 0.15)' : 'rgba(255,255,255,0.04)';
                }}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Footer Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            type="button"
            onClick={() => { onChange(todayFormatted); onClose?.(); }}
            style={{ background: 'rgba(0,194,179,0.12)', border: '1px solid rgba(0,194,179,0.3)', color: '#00C2B3', padding: '6px 14px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}
          >
            📍 {language === 'es' ? 'Seleccionar Hoy' : 'Select Today'}
          </button>

          {value && (
            <button
              type="button"
              onClick={() => { onChange(''); onClose?.(); }}
              style={{ background: 'rgba(255,107,77,0.12)', border: '1px solid rgba(255,107,77,0.3)', color: '#FF6B4D', padding: '6px 14px', borderRadius: '10px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}
            >
              🗑️ {language === 'es' ? 'Limpiar Fecha' : 'Clear Date'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
