import React, { useEffect } from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ProjectModal({ project, onClose, onDiscussProject }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-[#081A33]/80 backdrop-blur-md transition-opacity animate-in fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden z-10 max-h-[90vh] flex flex-col my-auto animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="relative bg-[#0B1B3A] text-white p-6 sm:p-8 border-b border-white/10 tech-grid-dark">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-[#0EA5E9]/20 text-[#38BDF8] border border-[#0EA5E9]/40">
              {project.projectType}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white/10 text-[#E2E8F0] border border-white/15">
              {project.statusBadge}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            {project.title}
          </h3>
          <p className="mt-1 text-sm sm:text-base text-[#E2E8F0] font-normal">
            {project.subtitle}
          </p>
        </div>

        {/* Modal Body Scrollable */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 bg-white text-[#334155]">
          
          {/* Executive Overview */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#0B1B3A] mb-2">
              Project Overview
            </h4>
            <p className="text-base text-[#334155] leading-relaxed font-normal">
              {project.summary}
            </p>
          </div>

          {/* Problem vs Solution Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-[#FFF1F2] border border-[#FECDD3]">
              <div className="flex items-center gap-2 text-[#BE123C] font-bold text-xs uppercase tracking-wider mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#BE123C]" />
                <span>The Challenge</span>
              </div>
              <p className="text-sm text-[#334155] leading-relaxed font-normal">
                {project.problem}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
              <div className="flex items-center gap-2 text-[#15803D] font-bold text-xs uppercase tracking-wider mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#15803D]" />
                <span>The Engineered Solution</span>
              </div>
              <p className="text-sm text-[#334155] leading-relaxed font-normal">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Key Features */}
          {((Array.isArray(project.features) && project.features.length > 0) || (typeof project.features === 'string' && project.features.trim())) && (
            <div>
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#0B1B3A] mb-3">
                Core Architecture & Highlights
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(Array.isArray(project.features) ? project.features : project.features.split('\n').filter(Boolean)).map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-[#0B1B3A] leading-snug">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack Badges */}
          {((Array.isArray(project.technologies) && project.technologies.length > 0) || (typeof project.technologies === 'string' && project.technologies.trim())) && (
            <div>
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-[#0B1B3A] mb-3">
                Technologies Utilized
              </h4>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(project.technologies) ? project.technologies : project.technologies.split(',').map(s => s.trim()).filter(Boolean)).map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-[#F1F5F9] text-[#0B1B3A] text-xs font-mono font-bold border border-[#CBD5E1]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#64748B] font-medium text-center sm:text-left">
            Want a tailored system like <strong className="text-[#0B1B3A]">{project.title}</strong> for your organization?
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#334155] hover:bg-[#E2E8F0] hover:text-[#0B1B3A] transition-colors w-full sm:w-auto text-center border border-[#E2E8F0]"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                if (onDiscussProject) onDiscussProject(project.title);
              }}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0B1B3A] hover:bg-[#183B75] transition-all shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span>Discuss Similar Project</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
