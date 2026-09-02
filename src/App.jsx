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
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(null);

  // Attempt automatic audio playback on load and on first user interaction if blocked by browser policy
  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.log('Autoplay blocked by browser policy, waiting for interaction:', err);
          setIsPlaying(false);
        });
      }
    };

    // Try playing immediately on load
    playAudio();

    // Fallback: Start playing on first touch/click anywhere on page if browser blocked silent autoplay
    const handleFirstInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        playAudio();
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    window.addEventListener('scroll', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.log('Audio playback error:', err);
          setIsPlaying(false);
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans text-[#2C2623]">
      {/* Background Romantic Music Element with Autoplay */}
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
