import React, { useState } from 'react';
import { Send, Copy, Check, CreditCard } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export function GiftRegistry() {
  const [copiedKey, setCopiedKey] = useState(null);
  const { intro, paymentInfo } = weddingData.gifts;

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const whatsappBlessingMessage = `Olá Alberto e Lieza! Gostaria de vos abençoar com uma contribuição para o vosso casamento.`;
  const whatsappUrl = `https://wa.me/${weddingData.couple.whatsappPhone}?text=${encodeURIComponent(whatsappBlessingMessage)}`;

  return (
    <section id="gifts" className="py-16 sm:py-20 px-4 bg-[#FAF7F2] relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-script text-4xl sm:text-5xl text-[#B8860B] block mb-2">
            Com Carinho & Gratidão
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2C2623] font-normal">
            Contribuição Direta
          </h2>
          <div className="w-24 h-0.5 bg-[#D4AF37]/50 mx-auto mt-4 mb-6" />
          <p className="text-sm sm:text-base text-[#5A4D4A] max-w-2xl mx-auto leading-relaxed">
            {intro}
          </p>
        </div>

        {/* Direct Payment Box (M-Pesa & e-Mola) */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-[#E2C799]/40 shadow-xs max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#E2C799]/30 flex items-center justify-center text-[#B8860B] mx-auto mb-4">
            <CreditCard className="w-7 h-7" />
          </div>

          <h3 className="font-serif text-2xl text-[#2C2623] font-medium mb-2">
            Detalhes para Contribuição (M-Pesa & e-Mola)
          </h3>
          <p className="text-xs sm:text-sm text-[#6B5A56] mb-8 max-w-md mx-auto">
            Pode nos abençoar com qualquer valor através dos seguintes contactos:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
            {[
              { label: 'M-Pesa', val: paymentInfo.mpesa, raw: '845942765', key: 'mpesa' },
              { label: 'e-Mola', val: paymentInfo.emola, raw: '879035122', key: 'emola' },
            ].map((method) => (
              <div key={method.key} className="bg-white rounded-2xl p-4 border border-[#E2C799]/40 flex items-center justify-between gap-3 shadow-2xs">
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

          <div className="border-t border-[#E2C799]/30 pt-6">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium text-sm shadow-md hover:shadow-lg transition-all"
            >
              <Send className="w-4 h-4" />
              Notificar / Abençoar via WhatsApp
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
