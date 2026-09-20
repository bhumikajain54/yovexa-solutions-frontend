import React from 'react';

/**
 * Official Brand Logo Component for Yovexa Solutions
 * Supports dark mode (light text) and light mode (navy text)
 */
export default function Logo({ variant = 'light', size = 'default', showText = true, className = '' }) {
  // size options: 'sm', 'default', 'lg', 'xl'
  const sizeClasses = {
    sm: 'h-8',
    default: 'h-10 sm:h-11',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20',
  };

  const isDarkBg = variant === 'dark';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Geometric Yovexa Symbol Vector / Image Hybrid */}
      <div className="relative flex items-center justify-center shrink-0">
        <div className={`relative overflow-hidden rounded-lg ${isDarkBg ? 'bg-[#0B1B3A]/80 p-1 border border-cyan-500/20 shadow-glow-cyan-sm' : 'bg-white p-1 shadow-sm'}`}>
          <img 
            src="/yovexa-logo.png" 
            alt="Yovexa Solutions Logo" 
            className={`${sizeClasses[size]} w-auto object-contain rounded transition-transform duration-300 hover:scale-105`}
            loading="eager"
          />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className={`font-display font-extrabold tracking-tight leading-none text-xl sm:text-2xl ${isDarkBg ? 'text-white' : 'text-navy-900'}`}>
              YOVEXA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
          </div>
          <span className={`text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase leading-tight mt-0.5 ${isDarkBg ? 'text-cyan-400/90' : 'text-slate-500'}`}>
            SOLUTIONS
          </span>
        </div>
      )}
    </div>
  );
}
