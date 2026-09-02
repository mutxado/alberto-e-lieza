import React from 'react';
import { Heart } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export function Story() {
  return (
    <section id="story" className="py-20 px-4 bg-white/60 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-script text-4xl sm:text-5xl text-[#B8860B] block mb-2">
            Amor, Propósito e Fé
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2C2623] font-normal tracking-tight">
            A Nossa História
          </h2>
          <div className="w-24 h-0.5 bg-[#D4AF37]/50 mx-auto mt-4 mb-4" />
          <p className="text-sm sm:text-base text-[#6B5A56] max-w-2xl mx-auto italic">
            "Grandes coisas fez o Senhor por nós, por isso estamos alegres."
          </p>
        </div>

        {/* Timeline Cards Container */}
        <div className="relative border-l-2 border-[#E2C799]/40 ml-4 md:ml-0 md:border-l-0">
          
          {/* Vertical line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#E2C799]/20 via-[#D4AF37]/50 to-[#E2C799]/20 transform -translate-x-1/2" />

          {weddingData.story.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`mb-12 md:mb-20 relative flex flex-col md:flex-row items-center ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline Heart Node */}
                <div className="absolute left-[-1.3rem] md:left-1/2 top-0 md:top-6 transform -translate-x-1/2 z-10 w-8 h-8 rounded-full bg-[#FAF7F2] border-2 border-[#D4AF37] flex items-center justify-center shadow-xs">
                  <Heart className="w-4 h-4 text-[#B8860B] fill-[#D4AF37]/30" />
                </div>

                {/* Content Card */}
                <div className="w-full md:w-[45%] pl-8 md:pl-0">
                  <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-xs border border-[#E2C799]/30 hover:shadow-md transition-all">
                    
                    {/* Image */}
                    <div className="relative h-56 sm:h-64 rounded-xl overflow-hidden mb-6 group">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover object-[center_15%] group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#FAF7F2]/90 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-serif font-bold text-[#B8860B] border border-[#D4AF37]/30 shadow-xs">
                        {item.year}
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl text-[#2C2623] font-medium mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#5A4D4A] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
