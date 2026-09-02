import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Heart } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Story } from './components/Story';
import { Couple } from './components/Couple';
import { ScheduleLocation } from './components/ScheduleLocation';
import { Gallery } from './components/Gallery';
import { DressCode } from './components/DressCode';
import { GiftRegistry } from './components/GiftRegistry';
import { RsvpForm } from './components/RsvpForm';
import { MessageWall } from './components/MessageWall';
import { Footer } from './components/Footer';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMusicPrompt, setShowMusicPrompt] = useState(true);
  const audioRef = useRef(null);

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setShowMusicPrompt(false);
      }).catch((err) => {
        console.log('Audio start error:', err);
      });
    }
  };

  useEffect(() => {
    // Attempt automatic play immediately
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setShowMusicPrompt(false);
      }).catch((err) => {
        console.log('Browser blocked unmuted autoplay, prompt active:', err);
      });
    }

    // Global listener to unlock audio on ANY user click, touch, or scroll anywhere on page
    const handleGlobalInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        startMusic();
      }
    };

    window.addEventListener('click', handleGlobalInteraction);
    window.addEventListener('touchstart', handleGlobalInteraction);
    window.addEventListener('scroll', handleGlobalInteraction);

    return () => {
      window.removeEventListener('click', handleGlobalInteraction);
      window.removeEventListener('touchstart', handleGlobalInteraction);
      window.removeEventListener('scroll', handleGlobalInteraction);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        startMusic();
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans text-[#2C2623] relative">
      {/* Background Audio Element */}
      <audio
        ref={audioRef}
        autoPlay
        loop
        playsInline
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-piano-113061.mp3"
      />

      {/* Floating Welcome Audio Unlock Prompt (Guarantees 100% audio playback on mobile browsers) */}
      {showMusicPrompt && !isPlaying && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md animate-bounce">
          <button
            onClick={startMusic}
            className="w-full glass-card-dark text-white p-4 rounded-2xl border border-[#D4AF37] shadow-2xl flex items-center justify-between gap-3 group hover:bg-[#2C2623] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shrink-0">
                <Volume2 className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-[#E2C799] uppercase tracking-wider">
                  Convite de Casamento
                </p>
                <p className="text-sm font-medium text-white flex items-center gap-1">
                  Toque para abrir com música 🎵
                </p>
              </div>
            </div>
            <Heart className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37] shrink-0" />
          </button>
        </div>
      )}

      {/* Main Sections */}
      <Navbar isPlaying={isPlaying} togglePlay={togglePlay} />
      <main>
        <Hero />
        <Story />
        <Couple />
        <ScheduleLocation />
        <Gallery />
        <DressCode />
        <GiftRegistry />
        <RsvpForm />
        <MessageWall />
      </main>
      <Footer />
    </div>
  );
}
