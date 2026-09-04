import React, { useState, useEffect } from 'react';
import { Heart, Send } from 'lucide-react';
import { saveMessageToFirestore, subscribeToMessages } from '../firebase';

export function MessageWall() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      author: 'Família Alves',
      text: 'Que este amor seja abençoado e fortalecido a cada dia. Estamos imensamente felizes por vocês!',
      date: 'Ontem'
    },
    {
      id: 2,
      author: 'Ana & Paulo',
      text: 'Alberto e Liesa, vocês são o exemplo perfeito de amor e cumplicidade. Que Deus guie sempre os vossos passos!',
      date: 'Há 2 dias'
    },
    {
      id: 3,
      author: 'Pr. Mateus',
      text: 'O amor é o vínculo da perfeição. Desejamos uma união recheada de paz, alegria e sabedoria.',
      date: 'Há 3 dias'
    }
  ]);

  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sincronização em tempo real das mensagens com o Firebase Firestore
  useEffect(() => {
    const unsubscribe = subscribeToMessages((cloudMessages) => {
      if (cloudMessages && cloudMessages.length > 0) {
        setMessages(cloudMessages);
      } else {
        try {
          const saved = localStorage.getItem('alberto_liesa_messages');
          if (saved) setMessages(JSON.parse(saved));
        } catch (e) {
          console.log('Using initial wall messages');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddMessage = async (e) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;

    setIsSubmitting(true);

    const newMsg = {
      author: author.trim(),
      text: text.trim(),
      date: 'Agora mesmo',
      timestamp: new Date().toISOString()
    };

    // 1. Guardar no Firebase
    try {
      await saveMessageToFirestore(newMsg);
    } catch (err) {
      console.log('Firebase message sync error:', err);
    }

    // 2. Guardar backup local
    const updated = [newMsg, ...messages];
    setMessages(updated);
    setAuthor('');
    setText('');
    setIsSubmitting(false);

    try {
      localStorage.setItem('alberto_liesa_messages', JSON.stringify(updated));
    } catch (e) {
      console.log('Saved to state');
    }
  };

  return (
    <section id="messages" className="py-20 px-4 bg-[#FAF7F2] relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-script text-4xl sm:text-5xl text-[#B8860B] block mb-2">
            Votos & Felicidades
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2C2623] font-normal">
            Mural de Mensagens
          </h2>
          <div className="w-24 h-0.5 bg-[#D4AF37]/50 mx-auto mt-4 mb-4" />
          <p className="text-sm sm:text-base text-[#6B5A56] max-w-xl mx-auto">
            Deixe o seu carinho, oração ou mensagem especial para Alberto & Liesa.
          </p>
        </div>

        {/* Input Form Box */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#E2C799]/40 shadow-xs mb-12 max-w-3xl mx-auto">
          <form onSubmit={handleAddMessage} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Seu Nome / Família"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E2C799]/50 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-hidden text-sm text-[#2C2623] transition-all"
                />
              </div>
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#D4AF37] hover:bg-[#B8860B] text-white font-medium text-sm shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'A publicar...' : 'Publicar Mensagem'}
                </button>
              </div>
            </div>
            <div>
              <textarea
                rows={2}
                required
                placeholder="Escreva a sua mensagem para os noivos..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-[#E2C799]/50 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-hidden text-sm text-[#2C2623] transition-all"
              />
            </div>
          </form>
        </div>

        {/* Message Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className="glass-card rounded-2xl p-6 border border-[#E2C799]/30 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif text-lg font-medium text-[#2C2623]">
                    {msg.author}
                  </h4>
                  <Heart className="w-4 h-4 text-[#B8860B] fill-[#D4AF37]" />
                </div>
                <p className="text-sm text-[#5A4D4A] italic leading-relaxed mb-4">
                  "{msg.text}"
                </p>
              </div>
              <span className="text-[10px] text-[#8A7874] uppercase tracking-wider font-semibold">
                {msg.date || msg.createdDate || 'Recente'}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
