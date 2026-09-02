import React from 'react';
import { Shirt, HelpCircle, Info, CheckCircle2 } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export function DressCode() {
  const { title, code, description, faq } = weddingData.dressCode;

  return (
    <section className="py-20 px-4 bg-white/60 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-script text-4xl sm:text-5xl text-[#B8860B] block mb-2">
            Orientação aos Convidados
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2C2623] font-normal">
            {title}
          </h2>
          <div className="w-24 h-0.5 bg-[#D4AF37]/50 mx-auto mt-4 mb-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Dress Code Main Card */}
          <div className="lg:col-span-6 glass-card rounded-3xl p-8 border border-[#E2C799]/40 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#E2C799]/30 flex items-center justify-center text-[#B8860B] mb-6">
              <Shirt className="w-6 h-6" />
            </div>
            
            <span className="text-xs uppercase tracking-widest font-semibold text-[#B8860B] mb-2 block">
              Código de Vestuário
            </span>
            
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2C2623] font-medium mb-4">
              {code}
            </h3>

            <p className="text-sm sm:text-base text-[#5A4D4A] leading-relaxed mb-6">
              {description}
            </p>

            <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#E2C799]/30 flex items-start gap-3">
              <Info className="w-5 h-5 text-[#B8860B] shrink-0 mt-0.5" />
              <p className="text-xs text-[#6B5A56] italic">
                Solicitamos carinhosamente que as convidada evitem os tons de branco e pérola para que o destaque pertença à noiva.
              </p>
            </div>
          </div>

          {/* FAQ Cards */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="font-serif text-2xl text-[#2C2623] font-medium mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#B8860B]" />
              Perguntas Frequentes
            </h3>

            {faq.map((item, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 border border-[#E2C799]/30 shadow-xs hover:border-[#D4AF37] transition-all"
              >
                <h4 className="font-semibold text-base text-[#2C2623] mb-2 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B8860B] shrink-0 mt-1" />
                  {item.q}
                </h4>
                <p className="text-sm text-[#5A4D4A] pl-6 leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
