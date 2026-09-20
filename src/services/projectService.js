import { api } from './api';
import { PROJECTS_DATA, PROJECT_CATEGORIES } from '../data/projects';
import { generateSlug } from './blogService';

const PROJECTS_STORAGE_KEY = 'yovexa_cms_projects';
const CATEGORIES_STORAGE_KEY = 'yovexa_cms_project_categories';

function getInitialProjects() {
  return PROJECTS_DATA.map((p, idx) => ({
    ...p,
    projectName: p.title,
    slug: p.id,
    shortDescription: p.summary,
    fullDescription: p.solution || p.summary,
    featuredImage: p.featuredImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [],
    status: 'PUBLISHED',
    featured: idx < 2,
    displayOrder: idx + 1,
    projectUrl: p.projectUrl || '',
    githubUrl: p.githubUrl || '',
    caseStudyUrl: p.caseStudyUrl || '',
    clientLabel: p.statusBadge || 'Concept / Case Study',
    seoTitle: `${p.title} - Case Study | Yovexa Solutions`,
    seoDescription: p.summary,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

function getStoredProjects() {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    const initial = getInitialProjects();
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch {
    return getInitialProjects();
  }
}

function persistProjects(projects) {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to persist projects:', err);
  }
}

function getStoredCategories() {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(PROJECT_CATEGORIES));
    return PROJECT_CATEGORIES;
  } catch {
    return PROJECT_CATEGORIES;
  }
}

export const projectService = {
  async getCategories() {
    return getStoredCategories();
  },

  async getProjects({ category = 'all', publishedOnly = false } = {}) {
    try {
      const data = await api.get(publishedOnly ? `/projects?category=${category}` : `/admin/projects`);
      return data;
    } catch {
      const list = getStoredProjects();
      let filtered = list;

      if (publishedOnly) {
        filtered = filtered.filter(p => p.status === 'PUBLISHED');
      }

      if (category && category !== 'all') {
        filtered = filtered.filter(p => 
          p.category === category || 
          (Array.isArray(p.secondaryCategories) && p.secondaryCategories.includes(category))
        );
      }

      return filtered.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    }
  },

  async getProjectBySlug(slug) {
    try {
      const data = await api.get(`/projects/${slug}`);
      return data;
    } catch {
      const list = getStoredProjects();
      const proj = list.find(p => p.slug === slug || p.id === slug);
      if (!proj) throw new Error('Project not found');
      return proj;
    }
  },

  async getProjectById(id) {
    try {
      const data = await api.get(`/admin/projects/${id}`);
      return data;
    } catch {
      const list = getStoredProjects();
      return list.find(p => p.id === id || p.slug === id) || null;
    }
  },

  async createProject(projectData) {
    const list = getStoredProjects();
    const title = projectData.projectName || projectData.title || 'Untitled Project';
    const slug = projectData.slug || generateSlug(title);

    const newProject = {
      ...projectData,
      id: slug,
      title,
      projectName: title,
      slug,
      shortDescription: projectData.shortDescription || projectData.summary || '',
      summary: projectData.shortDescription || projectData.summary || '',
      fullDescription: projectData.fullDescription || projectData.solution || '',
      solution: projectData.fullDescription || projectData.solution || '',
      status: projectData.status || 'PUBLISHED',
      category: projectData.category || 'web',
      projectType: projectData.projectType || 'Web Application',
      technologies: Array.isArray(projectData.technologies)
        ? projectData.technologies
        : typeof projectData.technologies === 'string'
          ? projectData.technologies.split(',').map(t => t.trim()).filter(Boolean)
          : [],
      features: Array.isArray(projectData.features)
        ? projectData.features
        : typeof projectData.features === 'string'
          ? projectData.features.split('\n').map(f => f.trim()).filter(Boolean)
          : [],
      displayOrder: projectData.displayOrder || list.length + 1,
      featuredImage: projectData.featuredImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      clientLabel: projectData.clientLabel || 'Case Study / Prototype',
      statusBadge: projectData.clientLabel || 'Case Study / Prototype',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const created = await api.post('/admin/projects', newProject);
      list.push(created);
      persistProjects(list);
      return created;
    } catch {
      list.push(newProject);
      persistProjects(list);
      return newProject;
    }
  },

  async updateProject(id, projectData) {
    const list = getStoredProjects();
    const index = list.findIndex(p => p.id === id || p.slug === id);
    if (index === -1) throw new Error('Project not found');

    const title = projectData.projectName || projectData.title || list[index].title;
    const slug = projectData.slug || list[index].slug;

    const updated = {
      ...list[index],
      ...projectData,
      title,
      projectName: title,
      slug,
      shortDescription: projectData.shortDescription || projectData.summary || list[index].shortDescription,
      summary: projectData.shortDescription || projectData.summary || list[index].summary,
      fullDescription: projectData.fullDescription || projectData.solution || list[index].fullDescription,
      solution: projectData.fullDescription || projectData.solution || list[index].solution,
      technologies: Array.isArray(projectData.technologies)
        ? projectData.technologies
        : typeof projectData.technologies === 'string'
          ? projectData.technologies.split(',').map(t => t.trim()).filter(Boolean)
          : list[index].technologies,
      features: Array.isArray(projectData.features)
        ? projectData.features
        : typeof projectData.features === 'string'
          ? projectData.features.split('\n').map(f => f.trim()).filter(Boolean)
          : list[index].features,
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await api.put(`/admin/projects/${id}`, updated);
      list[index] = res;
      persistProjects(list);
      return res;
    } catch {
      list[index] = updated;
      persistProjects(list);
      return updated;
    }
  },

  async deleteProject(id) {
    try {
      await api.delete(`/admin/projects/${id}`);
    } catch {
      // Fallback
    }
    const list = getStoredProjects();
    const updated = list.filter(p => p.id !== id && p.slug !== id);
    persistProjects(updated);
    return true;
  }
};
