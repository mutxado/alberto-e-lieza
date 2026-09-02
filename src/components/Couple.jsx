import React from 'react';
import { Quote } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export function Couple() {
  const { groom, bride } = weddingData.couple;

  return (
    <section id="couple" className="py-20 px-4 bg-[#FAF7F2] relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-script text-4xl sm:text-5xl text-[#B8860B] block mb-2">
            Duas Vidas, Um Só Coração
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2C2623] font-normal">
            Os Noivos
          </h2>
          <div className="w-24 h-0.5 bg-[#D4AF37]/50 mx-auto mt-4" />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* Groom Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E2C799]/40 flex flex-col items-center text-center hover:shadow-md transition-all group">
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full overflow-hidden mb-6 border-4 border-[#FAF7F2] shadow-md group-hover:scale-105 transition-transform duration-500">
              <img
                src={groom.image}
                alt={groom.fullName}
                className="w-full h-full object-cover object-[center_15%]"
              />
            </div>
            
            <span className="text-xs uppercase tracking-widest font-semibold text-[#B8860B] mb-1">
              {groom.role}
            </span>
            <h3 className="font-serif text-3xl text-[#2C2623] font-medium mb-4">
              {groom.fullName}
            </h3>
            
            <p className="text-sm sm:text-base text-[#5A4D4A] leading-relaxed mb-6 flex-grow">
              {groom.bio}
            </p>

            <div className="bg-[#E2C799]/20 rounded-2xl p-4 w-full relative">
              <Quote className="w-5 h-5 text-[#D4AF37] absolute top-2 left-2 opacity-50" />
              <p className="font-serif italic text-sm text-[#4A3E3D] px-4">
                "{groom.quote}"
              </p>
            </div>
          </div>

          {/* Bride Card */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E2C799]/40 flex flex-col items-center text-center hover:shadow-md transition-all group">
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full overflow-hidden mb-6 border-4 border-[#FAF7F2] shadow-md group-hover:scale-105 transition-transform duration-500">
              <img
                src={bride.image}
                alt={bride.fullName}
                className="w-full h-full object-cover object-[center_15%]"
              />
            </div>
            
            <span className="text-xs uppercase tracking-widest font-semibold text-[#B8860B] mb-1">
              {bride.role}
            </span>
            <h3 className="font-serif text-3xl text-[#2C2623] font-medium mb-4">
              {bride.fullName}
            </h3>
            
            <p className="text-sm sm:text-base text-[#5A4D4A] leading-relaxed mb-6 flex-grow">
              {bride.bio}
            </p>

            <div className="bg-[#E2C799]/20 rounded-2xl p-4 w-full relative">
              <Quote className="w-5 h-5 text-[#D4AF37] absolute top-2 left-2 opacity-50" />
              <p className="font-serif italic text-sm text-[#4A3E3D] px-4">
                "{bride.quote}"
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
