import React, { useState, useRef } from 'react';
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
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.log('Audio autoplay prevented or error:', err);
          setIsPlaying(false);
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans text-[#2C2623]">
      {/* Background Romantic Music Element */}
      <audio
        ref={audioRef}
        loop
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
