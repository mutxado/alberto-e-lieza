import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Story } from './components/Story';
import { Couple } from './components/Couple';
import { ScheduleLocation } from './components/ScheduleLocation';
import { Gallery } from './components/Gallery';
import { GiftRegistry } from './components/GiftRegistry';
import { RsvpForm } from './components/RsvpForm';
import { MessageWall } from './components/MessageWall';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [showAdmin, setShowAdmin] = useState(window.location.hash === '#admin');

  useEffect(() => {
    const handleHashChange = () => {
      setShowAdmin(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (showAdmin) {
    return (
      <AdminDashboard onBack={() => {
        window.location.hash = '';
        setShowAdmin(false);
      }} />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans text-[#2C2623] relative">
      {/* Main Navigation */}
      <Navbar />

      {/* Main Sections */}
      <main>
        <Hero />
        <Story />
        <Couple />
        <ScheduleLocation />
        <Gallery />
        <GiftRegistry />
        <RsvpForm />
        <MessageWall />
      </main>

      {/* Footer with Admin Dashboard link */}
      <Footer onOpenAdmin={() => {
        window.location.hash = 'admin';
        setShowAdmin(true);
      }} />
    </div>
  );
}
