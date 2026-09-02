import React, { useState, useEffect } from 'react';
import { Heart, Send, MessageSquareQuote } from 'lucide-react';

export function MessageWall() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      author: 'Família Alves',
      text: 'Que este amor seja abençoado e fortalecido a cada dia. Estamos imensamente felizes por vocês!',
      date: 'Hoje'
    },
    {
      id: 2,
      author: 'Ana & Paulo',
      text: 'Alberto e Lieza, vocês são o exemplo perfeito de amor e cumplicidade. Que Deus guie sempre os vossos passos!',
      date: 'Ontem'
    },
    {
      id: 3,
      author: 'Pr. Mateus',
      text: 'O amor é o vínculo da perfeição. Desejamos uma união recheada de paz, alegria e sabedoria.',
      date: 'Há 2 dias'
    }
  ]);

  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

  // Load local messages if saved in localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('alberto_lieza_messages');
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch (e) {
      console.log('Using initial wall messages');
    }
  }, []);

  const handleAddMessage = (e) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;

    const newMsg = {
      id: Date.now(),
      author: author.trim(),
      text: text.trim(),
      date: 'Agora mesmo'
    };

    const updated = [newMsg, ...messages];
    setMessages(updated);
    setAuthor('');
    setText('');

    try {
      localStorage.setItem('alberto_lieza_messages', JSON.stringify(updated));
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
            Deixe o seu carinho, oração ou mensagem especial para Alberto & Lieza.
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
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#D4AF37] hover:bg-[#B8860B] text-white font-medium text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Publicar Mensagem
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
          {messages.map((msg) => (
            <div
              key={msg.id}
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
                {msg.date}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
