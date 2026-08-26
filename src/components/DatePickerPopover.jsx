import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DatePickerPopover({ value, onChange, onClose, language = 'es' }) {
  const today = new Date();
  
  // Parse initial selected date or default to current month
  const initialDate = value ? new Date(value + 'T00:00:00') : today;
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

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
      className="glass-card animate-fade-in-up" 
      onClick={e => e.stopPropagation()}
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        left: 0,
        zIndex: 9999,
        width: '320px',
        padding: '16px',
        borderRadius: '16px',
        background: 'rgba(13, 24, 42, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(0, 194, 179, 0.4)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 194, 179, 0.25)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <button 
          type="button"
          onClick={handlePrevMonth}
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}
        >
          <ChevronLeft size={16} />
        </button>

        <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#00C2B3' }}>
          {monthNames[currentMonth]} {currentYear}
        </div>

        <button 
          type="button"
          onClick={handleNextMonth}
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Weekdays Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
        {weekDays.map(d => (
          <span key={d} style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--color-gold)' }}>
            {d}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
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
                height: '36px',
                borderRadius: '10px',
                border: isSelected ? '1px solid #00C2B3' : isToday ? '1px solid rgba(255, 107, 77, 0.5)' : 'none',
                background: isSelected 
                  ? 'linear-gradient(135deg, #00C2B3, #00a89b)' 
                  : isToday 
                    ? 'rgba(255, 107, 77, 0.15)' 
                    : 'rgba(255,255,255,0.03)',
                color: isSelected ? '#fff' : isToday ? '#FF6B4D' : '#fff',
                fontWeight: isSelected || isToday ? '800' : '500',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                if (!isSelected) e.currentTarget.style.background = 'rgba(0, 194, 179, 0.2)';
              }}
              onMouseLeave={e => {
                if (!isSelected) e.currentTarget.style.background = isToday ? 'rgba(255, 107, 77, 0.15)' : 'rgba(255,255,255,0.03)';
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Footer Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          type="button"
          onClick={() => { onChange(todayFormatted); onClose?.(); }}
          style={{ background: 'transparent', border: 'none', color: '#00C2B3', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
        >
          {language === 'es' ? '📍 Hoy' : '📍 Today'}
        </button>

        {value && (
          <button
            type="button"
            onClick={() => { onChange(''); onClose?.(); }}
            style={{ background: 'transparent', border: 'none', color: '#FF6B4D', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
          >
            {language === 'es' ? '🗑️ Limpiar' : '🗑️ Clear'}
          </button>
        )}
      </div>
    </div>
  );
}
