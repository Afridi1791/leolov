import React, { useState } from 'react';
import { Hero } from './Hero';
import { Features } from './Features';
import { Pricing } from './Pricing';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { AuthModal } from '../auth/AuthModal';

export function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleGetStarted = () => {
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Header onAuthModalOpen={() => setAuthModalOpen(true)} />
      <Hero onGetStarted={handleGetStarted} />
      <Features />
      <Pricing onGetStarted={handleGetStarted} />
      <Footer />
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  );
}