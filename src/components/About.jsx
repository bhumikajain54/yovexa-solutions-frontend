import React, { useState, useEffect } from 'react';
import { ArrowRight, Lightbulb, Compass, Code, Rocket, Check, Sparkles } from 'lucide-react';
import { contentService } from '../services/contentService';

export default function About() {
  const [activeStage, setActiveStage] = useState(0);

  const [about, setAbout] = useState({
    sectionLabel: "About Yovexa Solutions",
    title: "Technology Built Around",
    titleHighlight: "Your Business",
    description: "Yovexa Solutions is a technology startup focused on building practical, scalable, and user-focused digital solutions for modern businesses.",
    additionalDescription: "We believe that high-impact software doesn't need to be over-engineered or weighed down by generic templates. We collaborate directly with growing businesses, startups, and operational leaders to translate complex business logic into clean, dependable software that drives real efficiency.",
    primaryCtaText: "Work With Us",
    primaryCtaLink: "#contact",
    secondaryCtaText: "View Full Services",
    secondaryCtaLink: "#services",
    highlights: [
      "Web Applications (React, Single Page, Admin Portals)",
      "Mobile Applications (Android & Cross-Platform)",
      "Custom Software & Operational Workflows",
      "API & Backend Engineering (Spring Boot, Node.js)",
      "Business Automation & System Integration",
      "UI/UX Experience Design & Interaction Systems"
    ],
    isVisible: true,
  });

  useEffect(() => {
    let isMounted = true;
    contentService.getAboutContent().then(data => {
      if (isMounted && data) {
        setAbout(prev => ({ ...prev, ...data }));
      }
    }).catch(err => {
      console.warn('Using cached about data', err);
    });
    return () => { isMounted = false; };
  }, []);

  const stages = [
    {
      name: "Idea",
      icon: Lightbulb,
      title: "Discovery & Strategy",
      desc: "Deconstruct your business challenge, analyze technical workflows, and craft a clear product roadmap.",
      deliverable: "Product Blueprint & Scope"
    },
    {
      name: "Design",
      icon: Compass,
      title: "UI/UX & Architecture",
      desc: "Create responsive prototypes, user journeys, design systems, and robust database architecture schemas.",
      deliverable: "Clickable Prototypes & Specs"
    },
    {
      name: "Development",
      icon: Code,
      title: "Clean Modular Code",
      desc: "Engineer scalable web and mobile software with modern frameworks, secure APIs, and automated quality checks.",
      deliverable: "Tested Production Codebase"
    },
    {
      name: "Launch",
      icon: Rocket,
      title: "Deployment & Scaling",
      desc: "Deploy securely to cloud environments, optimize performance benchmarks, and provide ongoing refinement.",
      deliverable: "Live Product & Documentation"
    }
  ];

  const scrollTo = (target) => {
    const id = target?.replace('#', '') || 'contact';
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (about.isVisible === false) return null;

  const focusAreas = about.highlights && about.highlights.length > 0 ? about.highlights : [
    "Web Applications (React, Single Page, Admin Portals)",
    "Mobile Applications (Android & Cross-Platform)",
    "Custom Software & Operational Workflows",
    "API & Backend Engineering (Spring Boot, Node.js)",
    "Business Automation & System Integration",
    "UI/UX Experience Design & Interaction Systems"
  ];

  return (
    <section id="about" className="py-24 bg-[#F8FAFC] text-[#0B1B3A] relative tech-lines-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header Tag */}
        <div className="flex flex-col items-start mb-12">
          {about.sectionLabel && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>{about.sectionLabel}</span>
            </div>
          )}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1B3A] tracking-tight font-display">
            {about.title}{' '}
            {about.titleHighlight && (
              <span className="text-[#0284C7]">{about.titleHighlight}</span>
            )}
          </h2>
        </div>

        {/* 2-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Business Narrative & Domain Pillars */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <p className="text-lg text-[#334155] leading-relaxed font-normal">
              {about.description}
            </p>
            
            {about.additionalDescription && (
              <p className="text-base text-[#475569] leading-relaxed font-normal">
                {about.additionalDescription}
              </p>
            )}

            <div className="pt-2">
              <h4 className="text-xs uppercase tracking-widest font-extrabold text-[#0B1B3A] mb-4">
                What We Build For Our Partners:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {focusAreas.map((area, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-[#E2E8F0] shadow-sm">
                    <div className="w-5 h-5 rounded-full bg-[#E0F2FE] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-[#0284C7] stroke-[3]" />
                    </div>
                    <span className="text-xs text-[#0B1B3A] font-semibold leading-tight">
                      {area}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => scrollTo(about.primaryCtaLink || 'contact')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-[#0B1B3A] hover:bg-[#183B75] transition-all duration-200 shadow-sm transform hover:-translate-y-0.5"
              >
                <span>{about.primaryCtaText || "Work With Us"}</span>
                <ArrowRight className="w-4 h-4 text-[#38BDF8]" />
              </button>

              <button
                onClick={() => scrollTo(about.secondaryCtaLink || 'services')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-bold text-[#0B1B3A] hover:text-[#0284C7] hover:bg-white border border-[#E2E8F0] transition-colors"
              >
                <span>{about.secondaryCtaText || "View Full Services"}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Lifecycle Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-card">
              
              <div className="flex items-center justify-between pb-6 border-b border-[#E2E8F0] mb-6">
                <div>
                  <span className="text-xs font-bold text-[#0284C7] uppercase tracking-widest">Product Lifecycle</span>
                  <h3 className="text-xl font-bold text-[#0B1B3A] mt-1 font-display">From Concept to Deployment</h3>
                </div>
                <div className="text-xs font-mono px-2.5 py-1 bg-[#F1F5F9] text-[#334155] rounded-md font-bold border border-[#E2E8F0]">
                  4 Iterative Stages
                </div>
              </div>

              {/* Stage Selector Tabs */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {stages.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isActive = activeStage === idx;
                  return (
                    <button
                      key={stage.name}
                      onClick={() => setActiveStage(idx)}
                      className={`flex flex-col items-center p-3 rounded-xl text-center transition-all duration-200 ${
                        isActive
                          ? 'bg-[#0B1B3A] text-white shadow-sm ring-2 ring-[#0EA5E9]'
                          : 'bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0] hover:text-[#0B1B3A] border border-[#E2E8F0]'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-1.5 ${isActive ? 'text-[#38BDF8]' : 'text-[#334155]'}`} />
                      <span className="text-xs font-bold">{stage.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Stage Detail Panel */}
              <div className="bg-[#F8FAFC] rounded-xl p-5 border border-[#E2E8F0]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-[#0369A1] bg-[#E0F2FE] px-2.5 py-0.5 rounded border border-[#BAE6FD]">
                    Stage 0{activeStage + 1}
                  </span>
                  <span className="text-xs text-[#64748B] font-medium">
                    Deliverable: <strong className="text-[#0B1B3A]">{stages[activeStage].deliverable}</strong>
                  </span>
                </div>

                <h4 className="text-lg font-bold text-[#0B1B3A] mt-2 font-display">
                  {stages[activeStage].title}
                </h4>

                <p className="text-sm text-[#334155] mt-2 leading-relaxed font-normal">
                  {stages[activeStage].desc}
                </p>

                {/* Progress Indicator */}
                <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex items-center gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-200 ${
                        i <= activeStage ? 'bg-[#0EA5E9]' : 'bg-[#E2E8F0]'
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
