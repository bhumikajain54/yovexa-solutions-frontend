import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Compass, Layers, Code, Rocket } from 'lucide-react';
import { processService } from '../services/processService';
import DynamicIcon from './DynamicIcon';

export default function Process() {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    processService.getProcessSteps({ activeOnly: true }).then(data => {
      if (isMounted) {
        setSteps(data);
        setLoading(false);
      }
    }).catch(err => {
      console.warn('Using cached process steps', err);
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <section id="process" className="py-24 bg-white text-[#0B1B3A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>Structured Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1B3A] tracking-tight font-display">
            How We Turn Ideas Into Products
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#334155] font-normal">
            A disciplined, transparent 4-stage engineering lifecycle designed for zero ambiguity, high momentum, and dependable delivery.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="relative">
          {/* Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-28 left-[12%] right-[12%] h-0.5 bg-[#CBD5E1] z-0" />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="p-7 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 animate-pulse">
                  <div className="w-14 h-14 bg-slate-200 rounded-2xl" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                  <div className="h-6 bg-slate-200 rounded w-4/5" />
                  <div className="h-16 bg-slate-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {steps.map((step, idx) => (
                <div
                  key={step.id || idx}
                  className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <div>
                    {/* Top Step Number & Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-[#0B1B3A] text-[#38BDF8] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <DynamicIcon name={step.icon || 'Compass'} className="w-7 h-7" />
                      </div>
                      <span className="text-3xl font-black font-display text-[#94A3B8] group-hover:text-[#0284C7] transition-colors">
                        {step.stepNumber || `0${idx + 1}`}
                      </span>
                    </div>

                    {/* Phase & Title */}
                    <div className="inline-block text-xs font-bold text-[#0369A1] uppercase tracking-wider bg-[#E0F2FE] border border-[#BAE6FD] px-2.5 py-0.5 rounded mb-2">
                      Phase {step.stepNumber || `0${idx + 1}`} {step.phase ? `— ${step.phase}` : ''}
                    </div>
                    
                    <h3 className="text-lg font-bold text-[#0B1B3A] font-display">
                      {step.title}
                    </h3>

                    {/* Summary */}
                    <p className="mt-2 text-xs sm:text-sm text-[#334155] leading-relaxed font-normal">
                      {step.description || step.summary}
                    </p>

                    {/* Details bullet points */}
                    {step.details && step.details.length > 0 && (
                      <ul className="mt-4 pt-4 border-t border-[#E2E8F0] space-y-2">
                        {(Array.isArray(step.details) ? step.details : step.details.split('\n')).map((detail, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2 text-xs font-medium text-[#334155]">
                            <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Bottom Tag */}
                  <div className="mt-6 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-medium text-[#64748B]">
                    <span>Focus:</span>
                    <span className="text-[#0B1B3A] font-bold">{step.tag || "Quality Delivery"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
