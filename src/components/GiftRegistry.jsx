import React, { useState } from 'react';
import { Gift, Heart, Send, Copy, Check, CreditCard, Palmtree, Utensils, Sparkles } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export function GiftRegistry() {
  const [copiedKey, setCopiedKey] = useState(null);
  const { intro, paymentInfo, honeymoonOptions } = weddingData.gifts;

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Palmtree':
        return <Palmtree className="w-6 h-6" />;
      case 'Utensils':
        return <Utensils className="w-6 h-6" />;
      case 'Heart':
        return <Heart className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <section id="gifts" className="py-16 sm:py-20 px-4 bg-[#FAF7F2] relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="font-script text-4xl sm:text-5xl text-[#B8860B] block mb-2">
            Com Carinho & Gratidão
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2C2623] font-normal">
            Fundo de Lua de Mel & Presentes
          </h2>
          <div className="w-24 h-0.5 bg-[#D4AF37]/50 mx-auto mt-4 mb-6" />
          <p className="text-sm sm:text-base text-[#5A4D4A] max-w-2xl mx-auto leading-relaxed">
            {intro}
          </p>
        </div>

        {/* Direct Payment Box (M-Pesa & e-Mola) */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 mb-12 sm:mb-16 border border-[#E2C799]/40 shadow-xs max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#E2C799]/30 flex items-center justify-center text-[#B8860B]">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-[#2C2623] font-medium">
                Contribuição Direta (M-Pesa & e-Mola)
              </h3>
              <p className="text-xs text-[#6B5A56]">
                Para nos abençoar com qualquer valor via M-Pesa ou e-Mola:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'M-Pesa', val: paymentInfo.mpesa, raw: '845942765', key: 'mpesa' },
              { label: 'e-Mola', val: paymentInfo.emola, raw: '879035122', key: 'emola' },
            ].map((method) => (
              <div key={method.key} className="bg-white rounded-2xl p-4 border border-[#E2C799]/30 flex items-center justify-between gap-3 shadow-2xs">
                <div className="overflow-hidden">
                  <span className="text-[10px] uppercase font-bold text-[#B8860B] block">{method.label}</span>
                  <span className="text-sm font-semibold text-[#2C2623] truncate block">{method.val}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(method.raw, method.key)}
                  className="px-3 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#E2C799]/30 text-[#B8860B] text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                  title="Copiar número"
                >
                  {copiedKey === method.key ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Honeymoon Fund Options Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(honeymoonOptions || []).map((item) => {
            const message = `Olá Alberto e Liesa! Gostaria de abençoar a vossa Lua de Mel com: *${item.title}* (${item.suggestedValue}).`;
            const waLink = `https://wa.me/${weddingData.couple.whatsappPhone}?text=${encodeURIComponent(message)}`;

            return (
              <div
                key={item.id}
                className="glass-card rounded-3xl p-6 border border-[#E2C799]/40 shadow-xs flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#E2C799]/30 flex items-center justify-center text-[#B8860B] mb-4 group-hover:scale-110 transition-transform">
                    {getIcon(item.icon)}
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[#2C2623] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#5A4D4A] leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div>
                  <div className="text-xs font-bold text-[#B8860B] mb-4">
                    Sugestão: {item.suggestedValue}
                  </div>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-full bg-[#D4AF37] hover:bg-[#B8860B] text-white text-xs font-medium shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Abençoar via WhatsApp
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
