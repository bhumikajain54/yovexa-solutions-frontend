import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Sparkles, Layers, Shield, Smartphone, Globe, Terminal, CheckCircle2 } from 'lucide-react';
import { contentService } from '../services/contentService';

export default function Hero() {
  const [hero, setHero] = useState({
    badge: "Technology Partner for Modern Businesses",
    heading: "Building Digital Solutions That",
    highlightedText: "Move Your Business Forward.",
    description: "Yovexa Solutions helps businesses turn ideas into scalable, secure, and user-friendly digital products. From web and mobile platforms to bespoke enterprise automation.",
    primaryCtaText: "Start a Project",
    primaryCtaLink: "#contact",
    secondaryCtaText: "Explore Our Services",
    secondaryCtaLink: "#services",
    isVisible: true,
  });

  useEffect(() => {
    let isMounted = true;
    contentService.getHeroContent().then(data => {
      if (isMounted && data) {
        setHero(prev => ({ ...prev, ...data }));
      }
    }).catch(err => {
      console.warn('Using cached hero data', err);
    });
    return () => { isMounted = false; };
  }, []);

  const scrollTo = (target) => {
    const id = target?.replace('#', '') || 'contact';
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (hero.isVisible === false) return null;

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-20 md:pt-36 md:pb-28 flex items-center bg-[#081A33] overflow-hidden text-white tech-grid-dark"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column: Headline & Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left"
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
            <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#E2E8F0] max-w-2xl leading-relaxed font-normal">
              {hero.description}
            </p>

            {/* Core Capability Badges */}
            <div className="mt-6 flex flex-wrap gap-2.5 sm:gap-3 text-xs sm:text-sm text-white">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0B1B3A] border border-white/20 font-medium">
                <Globe className="w-4 h-4 text-[#38BDF8]" />
                <span>Web Applications</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0B1B3A] border border-white/20 font-medium">
                <Smartphone className="w-4 h-4 text-[#38BDF8]" />
                <span>Mobile Apps</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0B1B3A] border border-white/20 font-medium">
                <Code2 className="w-4 h-4 text-[#38BDF8]" />
                <span>Custom Software</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0B1B3A] border border-white/20 font-medium">
                <Layers className="w-4 h-4 text-[#38BDF8]" />
                <span>Business Automation</span>
              </div>
            </div>

            {/* High Contrast CTA Buttons */}
            <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => scrollTo(hero.primaryCtaLink || 'contact')}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#0EA5E9] hover:bg-[#0284C7] transition-all duration-200 shadow-glow-cyan-sm transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{hero.primaryCtaText || "Start a Project"}</span>
                <ArrowRight className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={() => scrollTo(hero.secondaryCtaLink || 'services')}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-bold text-white bg-[#0B1B3A] hover:bg-[#183B75] border border-white/20 hover:border-[#0EA5E9]/50 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>{hero.secondaryCtaText || "Explore Our Services"}</span>
              </button>
            </div>

            {/* Micro-guarantee highlight */}
            <div className="mt-8 flex items-center gap-6 text-xs sm:text-sm text-[#CBD5E1] font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span>Zero bloated templates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span>Clean maintainable code</span>
              </div>
              <div className="flex items-center gap-2 hidden sm:flex">
                <CheckCircle2 className="w-4 h-4 text-[#38BDF8] shrink-0" />
                <span>Direct engineer collaboration</span>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Column: Abstract Technology & Geometric Dashboard Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl bg-[#0B1B3A] border border-[#0EA5E9]/30 p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
              
              {/* Card Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono text-[#CBD5E1] ml-2 font-medium">yovexa-core-system</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0EA5E9]/15 border border-[#0EA5E9]/30 text-xs font-mono text-[#38BDF8] font-semibold">
                  <Terminal className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>v2.4 stable</span>
                </div>
              </div>

              {/* Code / Architecture Preview */}
              <div className="space-y-3 font-mono text-xs text-white bg-[#040B17] p-4 rounded-xl border border-white/10">
                <div className="flex items-center justify-between text-[#CBD5E1] text-xs">
                  <span className="text-[#38BDF8] font-bold">// Architecture & Flow</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Operational
                  </span>
                </div>

                <div className="text-white space-y-1 font-medium">
                  <p><span className="text-purple-300">const</span> <span className="text-[#38BDF8]">yovexaStack</span> = &#123;</p>
                  <p className="pl-4"><span className="text-[#94A3B8]">frontend:</span> <span className="text-amber-200">'React.js / Next.js'</span>,</p>
                  <p className="pl-4"><span className="text-[#94A3B8]">backend:</span> <span className="text-amber-200">'Spring Boot / Node / REST'</span>,</p>
                  <p className="pl-4"><span className="text-[#94A3B8]">security:</span> <span className="text-amber-200">'JWT / HTTPS / Encrypted'</span>,</p>
                  <p className="pl-4"><span className="text-[#94A3B8]">deployment:</span> <span className="text-emerald-300">'Docker / CI-CD Pipelines'</span>,</p>
                  <p>&#125;;</p>
                </div>
              </div>

              {/* Real-time Feature Metrics Preview Tiles */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-4 rounded-xl bg-[#081A33] border border-white/15 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#CBD5E1]">
                    <span>Performance</span>
                    <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                  </div>
                  <div className="mt-2 text-2xl font-black text-white font-display">99.8%</div>
                  <div className="text-xs font-medium text-[#BAE6FD] mt-0.5">Optimized UI & API Latency</div>
                </div>

                <div className="p-4 rounded-xl bg-[#081A33] border border-white/15 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#CBD5E1]">
                    <span>Security</span>
                    <Shield className="w-4 h-4 text-[#38BDF8]" />
                  </div>
                  <div className="mt-2 text-2xl font-black text-white font-display">End-to-End</div>
                  <div className="text-xs font-medium text-[#BAE6FD] mt-0.5">Role-Based Data Access</div>
                </div>
              </div>

              {/* Floating Highlight Card */}
              <div className="mt-4 p-3.5 rounded-xl bg-[#081A33] border border-[#0EA5E9]/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#0EA5E9]/20 border border-[#0EA5E9]/40 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5 text-[#38BDF8]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Bespoke Engineering</div>
                  <div className="text-xs text-[#CBD5E1]">Customized exactly to your business model</div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
