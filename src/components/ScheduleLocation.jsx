import React from 'react';
import { MapPin, Clock, Navigation, Church, PartyPopper, FileText, Download } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export function ScheduleLocation() {
  return (
    <section id="schedule" className="py-16 sm:py-20 px-4 bg-white/70 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="font-script text-4xl sm:text-5xl text-[#B8860B] block mb-2">
            Onde & Quando
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2C2623] font-normal">
            Localização & Programa
          </h2>
          <div className="w-24 h-0.5 bg-[#D4AF37]/50 mx-auto mt-4 mb-4" />
          <p className="text-sm sm:text-base text-[#6B5A56] max-w-xl mx-auto">
            Sábado, <span className="font-bold text-[#B8860B]">17 de Outubro de 2026</span>. Acompanhe os horários e locais onde celebraremos o nosso grande dia.
          </p>
        </div>

        {/* Events Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 sm:mb-16">
          {weddingData.events.map((evt, idx) => {
            return (
              <div
                key={evt.id}
                className="glass-card rounded-3xl p-6 border border-[#E2C799]/40 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  {/* Icon & Time Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#E2C799]/30 flex items-center justify-center text-[#B8860B] group-hover:scale-110 transition-transform">
                      {idx === 0 ? <Church className="w-6 h-6" /> : idx === 1 ? <FileText className="w-6 h-6" /> : <PartyPopper className="w-6 h-6" />}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/40 text-[#8B6508] font-semibold text-xs">
                      <Clock className="w-3.5 h-3.5 text-[#B8860B]" />
                      <span>{evt.time}</span>
                    </div>
                  </div>

                  {/* Title & Place */}
                  <h3 className="font-serif text-xl sm:text-2xl text-[#2C2623] font-medium mb-1">
                    {evt.title}
                  </h3>
                  <h4 className="text-sm font-semibold text-[#B8860B] mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {evt.place}
                  </h4>

                  <p className="text-xs text-[#8A7874] mb-3">
                    {evt.address}
                  </p>

                  <p className="text-xs sm:text-sm text-[#5A4D4A] leading-relaxed mb-6">
                    {evt.details}
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col gap-2 pt-4 border-t border-[#E2C799]/30">
                  <a
                    href={evt.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#B8860B] text-white font-medium text-xs shadow-xs transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Google Maps
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Official Flyer Section - 100% Full Height Uncropped Display */}
        <div className="glass-card rounded-3xl p-4 sm:p-8 border border-[#E2C799]/40 shadow-xs max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          <div className="w-full md:w-1/2 bg-white p-2 rounded-2xl border border-[#E2C799]/30 shadow-xs flex items-center justify-center overflow-hidden">
            <img
              src={weddingData.couple.flyerImage}
              alt="Panfleto Oficial do Convite"
              className="w-full h-auto max-h-[550px] object-contain rounded-xl"
            />
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left flex flex-col justify-center">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#B8860B] block mb-2">
              Convite Oficial
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2C2623] font-medium mb-3">
              Panfleto do Casamento
            </h3>
            <p className="text-sm text-[#5A4D4A] leading-relaxed mb-6 italic">
              "Com o coração cheio de gratidão, convidamos você para celebrar connosco este dia tão especial!"
            </p>
            <div>
              <a
                href={weddingData.couple.flyerImage}
                target="_blank"
                download="Convite_Alberto_e_Lieza.jpg"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#2C2623] hover:bg-[#4A3E3D] text-white text-xs sm:text-sm font-medium shadow-md transition-all w-full sm:w-auto"
              >
                <Download className="w-4 h-4 text-[#D4AF37]" />
                Ver / Baixar Convite Oficial
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
