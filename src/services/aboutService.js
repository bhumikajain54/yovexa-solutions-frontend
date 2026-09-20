import { api } from './api';

const ABOUTS_STORAGE_KEY = 'yovexa_cms_abouts';

// Default initial about records
const INITIAL_ABOUTS = [
  {
    id: 'about-default-1',
    sectionLabel: 'About Yovexa Solutions',
    title: 'Technology Built Around',
    titleHighlight: 'Your Business',
    description: 'Yovexa Solutions is a technology startup focused on building practical, scalable, and user-focused digital solutions for modern businesses.',
    additionalDescription: "We believe that high-impact software doesn't need to be over-engineered or weighed down by generic templates. We collaborate directly with growing businesses, startups, and operational leaders to translate complex business logic into clean, dependable software that drives real efficiency.",
    primaryCtaText: 'Work With Us',
    primaryCtaLink: '#contact',
    secondaryCtaText: 'View Full Services',
    secondaryCtaLink: '#services',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Yovexa Engineering Team',
    highlights: [
      'Web Applications (React, Single Page, Admin Portals)',
      'Mobile Applications (Android & Cross-Platform)',
      'Custom Software & Operational Workflows',
      'API & Backend Engineering (Spring Boot, Node.js)',
      'Business Automation & System Integration',
      'UI/UX Experience Design & Interaction Systems'
    ],
    status: 'PUBLISHED',
    isActive: true,
    isVisible: true,
    createdAt: new Date('2026-01-01').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'about-innovation-2',
    sectionLabel: 'Our Philosophy & Mission',
    title: 'Transforming Ideas Into Robust',
    titleHighlight: 'Digital Assets',
    description: 'We help ambitious enterprises build digital capabilities that accelerate growth, reduce technical debt, and delight end-users.',
    additionalDescription: 'Our agile engineering squads work alongside your product teams to deliver high-velocity software releases with bulletproof security, clean test coverage, and modern cloud deployment standards.',
    primaryCtaText: 'Explore Capabilities',
    primaryCtaLink: '#services',
    secondaryCtaText: 'Contact Founders',
    secondaryCtaLink: '#contact',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Modern Tech Workspace',
    highlights: [
      'Dedicated Product Engineering Teams',
      'Zero-Template Custom Software Architecture',
      'Full CI/CD Automated Pipelines',
      'Enterprise Data Protection & Security First'
    ],
    status: 'DRAFT',
    isActive: false,
    isVisible: true,
    createdAt: new Date('2026-02-10').toISOString(),
    updatedAt: new Date('2026-02-10').toISOString(),
  }
];

function getStoredAbouts() {
  try {
    const raw = localStorage.getItem(ABOUTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    localStorage.setItem(ABOUTS_STORAGE_KEY, JSON.stringify(INITIAL_ABOUTS));
    return INITIAL_ABOUTS;
  } catch {
    return INITIAL_ABOUTS;
  }
}

function persistAbouts(list) {
  try {
    localStorage.setItem(ABOUTS_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to persist abouts:', err);
  }
}

export const aboutService = {
  // Get all about records (admin)
  async getAbouts() {
    try {
      const data = await api.get('/admin/content/about');
      if (Array.isArray(data)) return data;
      return getStoredAbouts();
    } catch {
      return getStoredAbouts();
    }
  },

  // Get single about record by id
  async getAboutById(id) {
    try {
      const data = await api.get(`/admin/content/about/${id}`);
      if (data) return data;
      const list = getStoredAbouts();
      return list.find(a => a.id === id) || null;
    } catch {
      const list = getStoredAbouts();
      return list.find(a => a.id === id) || null;
    }
  },

  // Get active about for public homepage
  async getActiveAbout() {
    try {
      const data = await api.get('/content/about/active');
      if (data) return data;
      const list = getStoredAbouts();
      const active = list.find(a => a.isActive && a.status === 'PUBLISHED');
      return active || list.find(a => a.status === 'PUBLISHED') || list[0] || null;
    } catch {
      const list = getStoredAbouts();
      const active = list.find(a => a.isActive && a.status === 'PUBLISHED');
      return active || list.find(a => a.status === 'PUBLISHED') || list[0] || null;
    }
  },

  // Create new about record
  async createAbout(data) {
    const newRecord = {
      ...data,
      id: data.id || `about-${Date.now()}`,
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: data.status || 'DRAFT',
      isActive: Boolean(data.isActive),
      isVisible: data.isVisible !== false,
    };

    try {
      const created = await api.post('/admin/content/about', newRecord);
      const list = getStoredAbouts();
      let updatedList = [...list];
      if (created.isActive) {
        updatedList = updatedList.map(a => ({ ...a, isActive: false }));
      }
      updatedList.unshift(created);
      persistAbouts(updatedList);
      return created;
    } catch {
      const list = getStoredAbouts();
      let updatedList = [...list];
      if (newRecord.isActive) {
        updatedList = updatedList.map(a => ({ ...a, isActive: false }));
      }
      updatedList.unshift(newRecord);
      persistAbouts(updatedList);
      return newRecord;
    }
  },

  // Update existing about record
  async updateAbout(id, data) {
    const updatedData = {
      ...data,
      id,
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      updatedAt: new Date().toISOString(),
    };

    try {
      const updated = await api.put(`/admin/content/about/${id}`, updatedData);
      const list = getStoredAbouts();
      let updatedList = list.map(a => {
        if (a.id === id) return { ...a, ...updated };
        if (updated.isActive) return { ...a, isActive: false };
        return a;
      });
      persistAbouts(updatedList);
      return updated;
    } catch {
      const list = getStoredAbouts();
      let updatedList = list.map(a => {
        if (a.id === id) return { ...a, ...updatedData };
        if (updatedData.isActive) return { ...a, isActive: false };
        return a;
      });
      persistAbouts(updatedList);
      return updatedData;
    }
  },

  // Delete about record
  async deleteAbout(id) {
    try {
      await api.delete(`/admin/content/about/${id}`);
    } catch (err) {
      console.warn('API about delete failed, using local storage:', err);
    }
    const list = getStoredAbouts();
    const filtered = list.filter(a => a.id !== id);
    const hasActive = filtered.some(a => a.isActive);
    if (!hasActive && filtered.length > 0) {
      const published = filtered.find(a => a.status === 'PUBLISHED');
      if (published) published.isActive = true;
    }
    persistAbouts(filtered);
    return true;
  },

  // Set active about record (deactivates others)
  async setActiveAbout(id) {
    const list = getStoredAbouts();
    const target = list.find(a => a.id === id);
    if (!target) throw new Error('About record not found');

    const updatedList = list.map(a => ({
      ...a,
      isActive: a.id === id,
      updatedAt: a.id === id ? new Date().toISOString() : a.updatedAt,
    }));

    try {
      await api.put(`/admin/content/about/${id}`, { ...target, isActive: true });
    } catch (err) {
      console.warn('API setActiveAbout failed, local fallback used:', err);
    }

    persistAbouts(updatedList);
    return updatedList.find(a => a.id === id);
  }
};

export default aboutService;
