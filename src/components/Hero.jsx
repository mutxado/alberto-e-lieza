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
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
      {/* Background Ambient Layers */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 opacity-20"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000')`
        }}
      />
      
      {/* Soft Romantic Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/80 via-[#FAF7F2]/90 to-[#FAF7F2]" />
      
      {/* Decorative Golden Ambient Rings */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#E2C799]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Pre-title Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E2C799]/30 border border-[#D4AF37]/30 text-[#8B6508] text-xs sm:text-sm uppercase tracking-widest font-semibold mb-6 shadow-xs animate-fadeIn">
          <Heart className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
          <span>Com a benção de Deus</span>
          <Heart className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
        </div>

        {/* Couple Names */}
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-normal text-[#2C2623] tracking-tight mb-4 leading-none">
          {weddingData.couple.groom.name} <span className="font-script text-6xl sm:text-8xl md:text-9xl text-[#B8860B] font-normal px-2">&</span> {weddingData.couple.bride.name}
        </h1>

        {/* Tagline / Location */}
        <p className="text-sm sm:text-base md:text-lg text-[#5A4D4A] uppercase tracking-widest font-medium mb-8">
          {weddingData.couple.tagline}
        </p>

        {/* Date & Location Pills */}
        <div className="flex flex-wrap justify-center items-center gap-4 text-sm sm:text-base text-[#4A3E3D] mb-12">
          <div className="flex items-center gap-2 glass-card px-5 py-2.5 rounded-full shadow-xs">
            <Calendar className="w-4 h-4 text-[#B8860B]" />
            <span className="font-medium">{weddingData.couple.dateText}</span>
          </div>
          <div className="flex items-center gap-2 glass-card px-5 py-2.5 rounded-full shadow-xs">
            <MapPin className="w-4 h-4 text-[#B8860B]" />
            <span className="font-medium">Maputo, Moçambique</span>
          </div>
        </div>

        {/* Countdown Timer Grid */}
        <div className="mb-12">
          <h3 className="font-serif text-lg sm:text-xl text-[#5A4D4A] italic mb-6">
            Faltam apenas para o nosso Grande Dia:
          </h3>
          <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-lg mx-auto">
            {[
              { label: 'Dias', value: timeLeft.days },
              { label: 'Horas', value: timeLeft.hours },
              { label: 'Minutos', value: timeLeft.minutes },
              { label: 'Segundos', value: timeLeft.seconds }
            ].map((unit, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-3 sm:p-5 shadow-xs flex flex-col items-center border border-[#E2C799]/40 hover:border-[#D4AF37] transition-all">
                <span className="font-serif text-3xl sm:text-5xl font-bold text-[#B8860B]">
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#6B5A56] mt-1 font-medium">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#rsvp"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium text-base shadow-md hover:shadow-lg hover:from-[#B8860B] hover:to-[#966F0D] transition-all transform hover:-translate-y-0.5"
          >
            Confirmar Presença
          </a>
          <a
            href="#schedule"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full glass-card hover:bg-white text-[#2C2623] font-medium text-base border border-[#D4AF37]/50 shadow-xs hover:shadow-md transition-all"
          >
            Ver Localização & Programa
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex justify-center">
          <a href="#story" className="text-[#B8860B] opacity-70 hover:opacity-100 transition-opacity animate-bounce">
            <ChevronDown className="w-8 h-8" />
          </a>
        </div>
      </div>
    </section>
  );
}
