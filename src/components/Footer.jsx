import React from 'react';
import { Heart, ArrowUp } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#2C2623] text-[#FAF7F2] py-16 px-4 relative overflow-hidden">
      {/* Golden glow element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-[#D4AF37]/10 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Logo */}
        <h2 className="font-script text-5xl sm:text-6xl text-[#D4AF37] mb-2">
          Alberto & Liesa
        </h2>
        
        <p className="text-xs uppercase tracking-widest text-[#E2C799] font-medium mb-6">
          {weddingData.couple.hashtag}
        </p>

        <div className="w-16 h-0.5 bg-[#D4AF37]/40 mx-auto mb-8" />

        <p className="text-sm text-gray-300 max-w-md mx-auto mb-8 italic">
          "O amor nunca falha. Onde quer que fores, irei eu, e onde quer que pousares à noite, ali pousarei eu."
        </p>

        {/* Back to top button */}
        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs text-amber-200 border border-[#D4AF37]/30 transition-all mb-8"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          Voltar ao topo
        </button>

        <div className="text-xs text-gray-400 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; 2026 Alberto & Liesa. Todos os direitos reservados.</span>
          <span className="flex items-center gap-1">
            Criado com <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" /> para o nosso grande dia
          </span>
        </div>

      </div>
    </footer>
  );
}
