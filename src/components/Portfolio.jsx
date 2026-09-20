import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Code2, ShoppingBag, BookOpen, Navigation, Boxes, Activity, CreditCard } from 'lucide-react';
import { projectService } from '../services/projectService';
import DynamicIcon from './DynamicIcon';

export default function Portfolio({ onSelectProject }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      projectService.getProjects({ publishedOnly: true }),
      projectService.getCategories(),
    ]).then(([projData, catData]) => {
      if (isMounted) {
        setProjects(projData);
        setCategories(catData);
        setLoading(false);
      }
    }).catch(err => {
      console.warn('Using cached projects', err);
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory || (Array.isArray(p.secondaryCategories) && p.secondaryCategories.includes(activeCategory)));

  const getProjectIcon = (iconName) => {
    switch (iconName) {
      case 'ShoppingBag': return <ShoppingBag className="w-6 h-6 text-[#0EA5E9]" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6 text-[#0EA5E9]" />;
      case 'Navigation': return <Navigation className="w-6 h-6 text-[#0EA5E9]" />;
      case 'Boxes': return <Boxes className="w-6 h-6 text-[#0EA5E9]" />;
      case 'Activity': return <Activity className="w-6 h-6 text-[#0EA5E9]" />;
      case 'CreditCard': return <CreditCard className="w-6 h-6 text-[#0EA5E9]" />;
      default: return <Code2 className="w-6 h-6 text-[#0EA5E9]" />;
    }
  };

  return (
    <section id="portfolio" className="py-24 bg-[#F8FAFC] text-[#0B1B3A] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] border border-[#BAE6FD] text-[#0369A1] text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Engineered Solutions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1B3A] tracking-tight font-display">
              Selected Projects
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#334155] max-w-2xl font-normal">
              A showcase of our architectural concepts, custom software systems, and digital product engineering.
            </p>
          </div>

          {/* Project disclaimer */}
          <div className="mt-4 md:mt-0 text-xs text-[#64748B] max-w-xs md:text-right font-medium">
            Internal product platforms, enterprise blueprints & technical concepts.
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-[#0B1B3A] text-white shadow-md shadow-[#0B1B3A]/20 ring-2 ring-[#0EA5E9]'
                    : 'bg-white text-[#334155] hover:bg-[#F1F5F9] hover:text-[#0B1B3A] border border-[#E2E8F0]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="rounded-2xl bg-white border border-[#E2E8F0] p-6 space-y-4 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/3" />
                <div className="h-8 bg-slate-200 rounded w-3/4" />
                <div className="h-16 bg-slate-200 rounded w-full" />
                <div className="h-6 bg-slate-200 rounded w-1/2 pt-2" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center shadow-sm">
            <h3 className="text-base font-bold text-[#0B1B3A]">No projects found in this category</h3>
            <p className="text-xs text-[#64748B] mt-1">Select another category or view all projects.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                {/* Card Header */}
                <div className="relative p-6 border-b border-[#E2E8F0] bg-gradient-to-b from-[#F8FAFC] to-white">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {/* Category Label */}
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7] bg-[#E0F2FE] px-2.5 py-1 rounded-md border border-[#BAE6FD]">
                      {project.projectType || project.category}
                    </span>

                    {/* Status Badge */}
                    <span className="text-[11px] font-medium text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#E2E8F0]">
                      {(project.clientLabel || project.statusBadge || 'Concept').split(' ')[0]}
                    </span>
                  </div>

                  {/* Project Title & Icon Header */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#0B1B3A] flex items-center justify-center shrink-0 shadow-sm group-hover:bg-[#0284C7] transition-colors duration-300">
                      {getProjectIcon(project.accentIcon || 'Code2')}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#0B1B3A] font-display leading-tight group-hover:text-[#0284C7] transition-colors">
                        {project.title || project.projectName}
                      </h3>
                      <p className="text-xs font-medium text-[#475569] mt-0.5 line-clamp-1">
                        {project.subtitle || project.shortDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    {/* High Contrast Description */}
                    <p className="text-sm text-[#334155] leading-relaxed">
                      {project.summary || project.shortDescription}
                    </p>

                    {/* Technology Tags (High Contrast) */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {(Array.isArray(project.technologies) ? project.technologies : project.technologies.split(',')).slice(0, 4).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#334155] text-xs font-semibold border border-[#CBD5E1]"
                          >
                            {typeof tech === 'string' ? tech.trim() : tech}
                          </span>
                        ))}
                        {(Array.isArray(project.technologies) ? project.technologies.length : project.technologies.split(',').length) > 4 && (
                          <span className="px-2 py-1 rounded-md bg-[#F1F5F9] text-[#64748B] text-xs font-semibold border border-[#CBD5E1]">
                            +{(Array.isArray(project.technologies) ? project.technologies.length : project.technologies.split(',').length) - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#0B1B3A] group-hover:text-[#0284C7] transition-colors"
                    >
                      <span>View Architecture Details</span>
                      <ArrowRight className="w-4 h-4 text-[#0284C7] transition-transform group-hover:translate-x-1" />
                    </button>
                    <span className="text-xs text-[#64748B] font-medium">Case Study</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
