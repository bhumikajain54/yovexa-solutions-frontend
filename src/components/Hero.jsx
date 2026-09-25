import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { contentService } from '../services/contentService';

export default function Hero() {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    contentService.getHeroContent().then(data => {
      if (isMounted) {
        setHero(data || null);
        setLoading(false);
      }
    }).catch(err => {
      console.warn('Failed to load active hero:', err);
      if (isMounted) {
        setHero(null);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <section
        id="hero"
        className="relative min-h-[500px] pt-28 pb-20 md:pt-36 md:pb-28 flex items-center bg-[#081A33] overflow-hidden text-white tech-grid-dark"
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full animate-pulse">
          <div className="max-w-4xl space-y-6">
            <div className="w-48 h-8 rounded-full bg-white/10" />
            <div className="w-3/4 h-14 rounded-xl bg-white/10" />
            <div className="w-full h-24 rounded-xl bg-white/10" />
          </div>
        </div>
      </section>
    );
  }

  if (hero?.isVisible === false) return null;

  if (!hero) {
    return (
      <section
        id="hero"
        className="relative min-h-[400px] pt-28 pb-20 md:pt-36 md:pb-28 flex items-center justify-center bg-[#081A33] overflow-hidden text-white tech-grid-dark"
      >
        <div className="text-center max-w-lg mx-auto px-4 z-10">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4 text-[#38BDF8]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-display text-white">No Active Hero Content</h2>
          <p className="text-sm text-[#CBD5E1] mt-2 font-normal">
            Hero content will appear once created and activated in the dashboard.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="hero"
      className="relative min-h-[600px] pt-28 pb-20 md:pt-36 md:pb-28 flex items-center bg-[#081A33] overflow-hidden text-white tech-grid-dark"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0EA5E9]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-5 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Geometry Accent Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 200L400 500L800 200L1200 500L1440 320" stroke="#0EA5E9" strokeWidth="1.5" strokeDasharray="6 6" />
          <path d="M200 900L600 600L1000 900L1440 570" stroke="#0EA5E9" strokeWidth="1" strokeOpacity="0.4" />
          <circle cx="400" cy="500" r="4" fill="#0EA5E9" />
          <circle cx="800" cy="200" r="4" fill="#0EA5E9" />
          <circle cx="1200" cy="500" r="4" fill="#0EA5E9" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Hero Content: Headline & Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl flex flex-col items-start text-left"
        >
          {/* Startup Pill Tag */}
          {hero.badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0EA5E9]/15 border border-[#0EA5E9]/35 text-[#38BDF8] text-xs sm:text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>{hero.badge}</span>
            </div>
          )}

          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.14] text-white">
            {hero.heading}{' '}
            {hero.highlightedText && (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#0EA5E9] to-[#60A5FA]">
                {hero.highlightedText}
              </span>
            )}
          </h1>

          {/* High Contrast Supporting Headline */}
          {hero.description && (
            <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#E2E8F0] max-w-3xl leading-relaxed font-normal">
              {hero.description}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
