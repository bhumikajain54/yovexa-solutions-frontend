import React from 'react';
import { ShieldCheck, Cpu, Layout, TrendingUp } from 'lucide-react';
import { TRUST_PILLARS } from '../data/values';

export default function TrustStrip() {
  if (!TRUST_PILLARS || TRUST_PILLARS.length === 0) {
    return null;
  }

  const icons = [
    <Cpu className="w-5 h-5 text-[#38BDF8]" />,
    <TrendingUp className="w-5 h-5 text-[#38BDF8]" />,
    <Layout className="w-5 h-5 text-[#38BDF8]" />,
    <ShieldCheck className="w-5 h-5 text-[#38BDF8]" />,
  ];

  return (
    <section className="relative z-20 bg-[#0B1B3A] border-y border-white/10 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {TRUST_PILLARS.map((pillar, index) => (
            <div
              key={pillar.label}
              className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[#081A33] border border-white/10 hover:border-[#0EA5E9]/50 transition-all duration-300"
            >
              <div className="p-2.5 rounded-lg bg-[#040B17] border border-white/15 shrink-0 mt-0.5">
                {icons[index]}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-display tracking-tight">
                  {pillar.label}
                </h3>
                <p className="text-xs text-[#E2E8F0] mt-1 leading-relaxed font-normal">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
