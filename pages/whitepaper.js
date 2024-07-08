import React from 'react';
import Navbar from '../components/Navbar';
import WhitepaperPage from '../components/WhitepaperPage';

export default function Whitepaper() {
  return (
    <div className="min-h-screen bg-deep-space text-white">
      <div className="stars"></div>
      <div className="twinkling"></div>
      <div className="clouds"></div>

      <Navbar />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <WhitepaperPage />
      </main>
    </div>
  );
}
