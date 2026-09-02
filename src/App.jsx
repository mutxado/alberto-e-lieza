import React, { useState, useRef, useEffect } from 'react';
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
  // Always true by default so navbar shows "Música a tocar" immediately
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(null);

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log('Audio start error:', err);
      });
    }
  };

  useEffect(() => {
    // Attempt playback immediately on load
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log('Autoplay deferred until first touch:', err);
      });
    }

    // Unlock sound on any first user interaction (touch, click, scroll)
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
