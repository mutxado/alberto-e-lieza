import React from 'react';
import { MapPin, Clock, Navigation, Church, PartyPopper } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export function ScheduleLocation() {
  return (
    <section id="schedule" className="py-20 px-4 bg-white/70 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-script text-4xl sm:text-5xl text-[#B8860B] block mb-2">
            Onde & Quando
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2C2623] font-normal">
            Localização & Programa
          </h2>
          <div className="w-24 h-0.5 bg-[#D4AF37]/50 mx-auto mt-4 mb-4" />
          <p className="text-sm sm:text-base text-[#6B5A56] max-w-xl mx-auto">
            Acompanhe os horários e locais onde celebraremos o nosso grande dia.
          </p>
        </div>

        {/* Events Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {weddingData.events.map((evt) => {
            const isCeremony = evt.id === 'ceremony';

            return (
              <div
                key={evt.id}
                className="glass-card rounded-3xl p-6 sm:p-10 border border-[#E2C799]/40 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  {/* Icon & Time Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#E2C799]/30 flex items-center justify-center text-[#B8860B] group-hover:scale-110 transition-transform">
                      {isCeremony ? <Church className="w-7 h-7" /> : <PartyPopper className="w-7 h-7" />}
                    </div>
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/40 text-[#8B6508] font-semibold text-xs sm:text-sm">
                      <Clock className="w-4 h-4 text-[#B8860B]" />
                      <span>{evt.time}</span>
                    </div>
                  </div>

                  {/* Title & Place */}
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#2C2623] font-medium mb-2">
                    {evt.title}
                  </h3>
                  <h4 className="text-base sm:text-lg font-semibold text-[#B8860B] mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {evt.place}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#8A7874] mb-4">
                    {evt.address}
                  </p>

                  <p className="text-sm text-[#5A4D4A] leading-relaxed mb-8">
                    {evt.details}
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-[#E2C799]/30">
                  <a
                    href={evt.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#B8860B] text-white font-medium text-xs sm:text-sm shadow-xs transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    Google Maps
                  </a>
                  <a
                    href={evt.appleMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#E2C799]/30 text-[#4A3E3D] font-medium text-xs sm:text-sm border border-[#D4AF37]/40 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-[#B8860B]" />
                    Apple Maps
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
