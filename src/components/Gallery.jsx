import React, { useState } from 'react';
import { Camera, X, Maximize2 } from 'lucide-react';
import { weddingData } from '../data/weddingData';

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section id="gallery" className="py-20 px-4 bg-[#FAF7F2] relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-script text-4xl sm:text-5xl text-[#B8860B] block mb-2">
            Nossos Momentos
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#2C2623] font-normal">
            Galeria Pré-Wedding
          </h2>
          <div className="w-24 h-0.5 bg-[#D4AF37]/50 mx-auto mt-4 mb-4" />
          <p className="text-sm sm:text-base text-[#6B5A56] max-w-xl mx-auto">
            Alguns registos da nossa caminhada juntos até ao grande dia.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {weddingData.gallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="relative group rounded-3xl overflow-hidden h-72 sm:h-80 cursor-pointer shadow-xs border border-[#E2C799]/30 hover:shadow-lg transition-all"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div className="text-white flex items-center justify-between w-full">
                  <div>
                    <h4 className="font-serif text-xl font-medium">{item.title}</h4>
                    <span className="text-xs text-amber-200">Clique para ampliar</span>
                  </div>
                  <Maximize2 className="w-5 h-5 text-amber-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white hover:text-[#D4AF37] p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            aria-label="Fechar"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="max-h-[80vh] w-auto max-w-full rounded-2xl shadow-2xl object-contain mb-4"
            />
            <p className="font-serif text-xl text-amber-100 font-light">
              {selectedImage.title}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
