import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Heart, ChevronDown } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export function Hero() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(weddingData.couple.targetDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 pb-12 px-4 overflow-hidden">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-top bg-no-repeat transition-all duration-700 opacity-25"
        style={{
          backgroundImage: `url('${weddingData.couple.heroBg}')`
        }}
      />
      
      {/* Soft Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/80 via-[#FAF7F2]/90 to-[#FAF7F2]" />
      
      {/* Ambient Rings */}
      <div className="absolute top-1/4 -left-20 w-80 sm:w-96 h-80 sm:h-96 bg-[#E2C799]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 sm:w-96 h-80 sm:h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E2C799]/30 border border-[#D4AF37]/30 text-[#8B6508] text-[11px] sm:text-xs uppercase tracking-widest font-semibold mb-6 shadow-xs">
          <Heart className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
          <span>Com a bênção de Deus</span>
          <Heart className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
        </div>

        {/* Names */}
        <h1 className="font-serif text-4xl sm:text-7xl md:text-8xl font-normal text-[#2C2623] tracking-tight mb-2 leading-tight">
          Alberto <span className="font-script text-5xl sm:text-8xl md:text-9xl text-[#B8860B] px-1">&</span> Lieza
        </h1>

        {/* Tagline */}
        <p className="text-xs sm:text-base text-[#5A4D4A] uppercase tracking-widest font-medium mb-6">
          {weddingData.couple.tagline}
        </p>

        {/* Date & Location */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 text-xs sm:text-sm text-[#4A3E3D] mb-8">
          <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full shadow-xs">
            <Calendar className="w-4 h-4 text-[#B8860B]" />
            <span className="font-medium">{weddingData.couple.dateText}</span>
          </div>
          <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full shadow-xs">
            <MapPin className="w-4 h-4 text-[#B8860B]" />
            <span className="font-medium">Maputo, Moçambique</span>
          </div>
        </div>

        {/* Countdown Grid - Mobile Optimized */}
        <div className="mb-8 sm:mb-12 max-w-md mx-auto">
          <h3 className="font-serif text-sm sm:text-lg text-[#5A4D4A] italic mb-4">
            Faltam apenas para o nosso Grande Dia:
          </h3>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {[
              { label: 'Dias', value: timeLeft.days },
              { label: 'Horas', value: timeLeft.hours },
              { label: 'Minutos', value: timeLeft.minutes },
              { label: 'Segundos', value: timeLeft.seconds }
            ].map((unit, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-2.5 sm:p-4 shadow-xs flex flex-col items-center border border-[#E2C799]/40">
                <span className="font-serif text-2xl sm:text-4xl font-bold text-[#B8860B]">
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-xs uppercase tracking-wider text-[#6B5A56] mt-0.5 font-medium">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons - Mobile Friendly */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#rsvp"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium text-sm shadow-md hover:shadow-lg transition-all"
          >
            Confirmar Presença
          </a>
          <a
            href="#schedule"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full glass-card text-[#2C2623] font-medium text-sm border border-[#D4AF37]/50 shadow-xs transition-all"
          >
            Ver Programa & Convite
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-10 sm:mt-12 flex justify-center">
          <a href="#story" className="text-[#B8860B] opacity-70 hover:opacity-100 transition-opacity animate-bounce">
            <ChevronDown className="w-7 h-7" />
          </a>
        </div>
      </div>
    </section>
  );
}
