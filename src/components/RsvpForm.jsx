import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, User, Users, MessageSquare, Utensils, Heart } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { saveRsvpToFirestore } from '../firebase';

export function RsvpForm() {
  const [formData, setFormData] = useState({
    name: '',
    guests: '1',
    attending: 'sim',
    dietary: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const googleSheetsUrl = weddingData.googleSheetsUrl || '';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    setIsSubmitting(true);

    const rsvpPayload = {
      name: formData.name.trim(),
      guests: parseInt(formData.guests, 10) || 1,
      attending: formData.attending,
      dietary: formData.dietary.trim() || 'Nenhuma',
      message: formData.message.trim() || 'Felicidades aos noivos!',
      timestamp: new Date().toLocaleString('pt-MZ')
    };

    // 1. Guardar na Base de Dados Cloud do Firebase Firestore
    try {
      await saveRsvpToFirestore(rsvpPayload);
      console.log('✅ Confirmado e salvo no Firebase Firestore!');
    } catch (err) {
      console.log('Firebase sync:', err);
    }

    // 2. Enviar para Google Sheets (se ativo)
    if (googleSheetsUrl) {
      try {
        const bodyParams = new URLSearchParams();
        bodyParams.append('timestamp', rsvpPayload.timestamp);
        bodyParams.append('name', rsvpPayload.name);
        bodyParams.append('guests', rsvpPayload.guests.toString());
        bodyParams.append('attending', rsvpPayload.attending === 'sim' ? 'Sim' : 'Não');
        bodyParams.append('dietary', rsvpPayload.dietary);
        bodyParams.append('message', rsvpPayload.message);

        await fetch(googleSheetsUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: bodyParams.toString()
        });
      } catch (err) {
        console.log('Google Sheets sync:', err);
      }
    }

    // 3. Guarda na memória local do navegador como backup
    try {
      const existing = JSON.parse(localStorage.getItem('alberto_liesa_rsvp_confirmations') || '[]');
      localStorage.setItem('alberto_liesa_rsvp_confirmations', JSON.stringify([rsvpPayload, ...existing]));
    } catch (err) {
      console.log('Local storage backup error:', err);
    }

    // 4. Efeito de Celebração com Confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.log('Confetti effect triggered');
    }

    setIsSubmitting(false);
    setSubmitted(true);

    // 5. Montar mensagem formatada e abrir o WhatsApp
    const textMsg = `Olá! Acabei de confirmar a minha presença no vosso casamento 🎉\n\n` +
      `*Nome:* ${rsvpPayload.name}\n` +
      `*Acompanhantes:* ${rsvpPayload.guests}\n` +
      `*Confirmação:* ${rsvpPayload.attending === 'sim' ? 'Sim, estarei presente!' : 'Não poderei comparecer'}\n` +
      `*Restrição Alimentar:* ${rsvpPayload.dietary}\n` +
      `*Mensagem:* ${rsvpPayload.message}`;

    const waUrl = `https://wa.me/${weddingData.couple.whatsappPhone}?text=${encodeURIComponent(textMsg)}`;

    // Redireciona para o WhatsApp após 1.2 segundos
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 1200);
  };

  return (
    <section id="rsvp" className="py-20 px-4 bg-white/70 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-script text-4xl sm:text-5xl text-[#B8860B] block mb-2">
            A Sua Presença é Fundamental
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2C2623] font-normal">
            Confirmar Presença (RSVP)
          </h2>
          <div className="w-24 h-0.5 bg-[#D4AF37]/50 mx-auto mt-4 mb-4" />
          <p className="text-sm sm:text-base text-[#6B5A56] max-w-xl mx-auto">
            Por favor, confirme a sua presença até ao dia <span className="font-bold text-[#B8860B]">20 de Setembro de 2026</span>.
          </p>
        </div>

        {/* Form Box */}
        <div className="glass-card rounded-3xl p-6 sm:p-12 border border-[#E2C799]/40 shadow-xs relative">
          {submitted ? (
            <div className="text-center py-12 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-3xl text-[#2C2623] font-medium mb-3">
                Obrigado pela Confirmação!
              </h3>
              <p className="text-sm sm:text-base text-[#5A4D4A] max-w-md mx-auto mb-8 leading-relaxed">
                A sua presença foi guardada na base de dados dos noivos e a mensagem foi enviada para o **WhatsApp**!
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-full bg-[#FAF7F2] border border-[#D4AF37]/40 text-[#B8860B] text-sm font-medium hover:bg-[#E2C799]/20 transition-all"
              >
                Enviar nova confirmação
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#4A3E3D] mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#B8860B]" />
                  Nome Completo (como consta no convite) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Salesio"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E2C799]/50 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-hidden text-sm text-[#2C2623] transition-all"
                />
              </div>

              {/* Number of Guests & Attendance choice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#4A3E3D] mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#B8860B]" />
                    Número de Lugares Reservados
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E2C799]/50 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-hidden text-sm text-[#2C2623] transition-all"
                  >
                    <option value="1">1 Pessoa (Individual)</option>
                    <option value="2">2 Pessoas (Casal / Duplo)</option>
                    <option value="3">3 Pessoas (Família)</option>
                    <option value="4">4 Pessoas ou mais</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#4A3E3D] mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#B8860B]" />
                    Confirma Presença?
                  </label>
                  <select
                    value={formData.attending}
                    onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E2C799]/50 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-hidden text-sm text-[#2C2623] transition-all"
                  >
                    <option value="sim">Sim, estarei presente com alegria!</option>
                    <option value="nao">Infelizmente não poderei comparecer</option>
                  </select>
                </div>
              </div>

              {/* Dietary Preferences */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#4A3E3D] mb-2 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#B8860B]" />
                  Restrição Alimentar ou Alergias (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Vegetariano, Sem Glúten, Alergia a Frutos do Mar..."
                  value={formData.dietary}
                  onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E2C799]/50 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-hidden text-sm text-[#2C2623] transition-all"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-[#4A3E3D] mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#B8860B]" />
                  Mensagem Carinhosa para Alberto & Liesa
                </label>
                <textarea
                  rows={3}
                  placeholder="Deixe uma mensagem especial para o casal..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E2C799]/50 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-hidden text-sm text-[#2C2623] transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium text-base shadow-md hover:shadow-lg hover:from-[#B8860B] hover:to-[#966F0D] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                {isSubmitting ? 'A guardar na nuvem...' : 'Confirmar Presença'}
              </button>

            </form>
          )}
        </div>
      </div>
    </section>
  );
}
