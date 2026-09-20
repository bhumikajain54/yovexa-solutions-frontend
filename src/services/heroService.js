import { api } from './api';

const HEROES_STORAGE_KEY = 'yovexa_cms_heroes';

// Default initial hero records
const INITIAL_HEROES = [
  {
    id: 'hero-default-1',
    badge: 'Technology Partner for Modern Businesses',
    heading: 'Building Digital Solutions That',
    highlightedText: 'Move Your Business Forward.',
    description: 'Yovexa Solutions helps businesses turn ideas into scalable, secure, and user-friendly digital products. From web and mobile platforms to bespoke enterprise automation.',
    primaryCtaText: 'Start a Project',
    primaryCtaLink: '#contact',
    secondaryCtaText: 'Explore Our Services',
    secondaryCtaLink: '#services',
    heroImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Modern Software Architecture',
    status: 'PUBLISHED',
    isActive: true,
    isVisible: true,
    createdAt: new Date('2026-01-01').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'hero-growth-2',
    badge: 'Enterprise Software & Scalable Cloud',
    heading: 'Engineering Modern Platforms for',
    highlightedText: 'High-Growth Companies.',
    description: 'From rapid prototyping to enterprise cloud architectures, we partner with visionary teams to deploy mission-critical software on time and within budget.',
    primaryCtaText: 'Schedule Consultation',
    primaryCtaLink: '#contact',
    secondaryCtaText: 'View Case Studies',
    secondaryCtaLink: '#portfolio',
    heroImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Collaborative Technology Engineering',
    status: 'DRAFT',
    isActive: false,
    isVisible: true,
    createdAt: new Date('2026-02-15').toISOString(),
    updatedAt: new Date('2026-02-15').toISOString(),
  }
];

function getStoredHeroes() {
  try {
    const raw = localStorage.getItem(HEROES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    localStorage.setItem(HEROES_STORAGE_KEY, JSON.stringify(INITIAL_HEROES));
    return INITIAL_HEROES;
  } catch {
    return INITIAL_HEROES;
  }
}

function persistHeroes(list) {
  try {
    localStorage.setItem(HEROES_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to persist heroes:', err);
  }
}

export const heroService = {
  // Get all heroes (admin)
  async getHeroes() {
    try {
      const data = await api.get('/admin/content/hero');
      if (Array.isArray(data)) return data;
      return getStoredHeroes();
    } catch {
      return getStoredHeroes();
    }
  },

  // Get single hero by id
  async getHeroById(id) {
    try {
      const data = await api.get(`/admin/content/hero/${id}`);
      if (data) return data;
      const list = getStoredHeroes();
      return list.find(h => h.id === id) || null;
    } catch {
      const list = getStoredHeroes();
      return list.find(h => h.id === id) || null;
    }
  },

  // Get active hero for public website
  async getActiveHero() {
    try {
      const data = await api.get('/content/hero/active');
      if (data) return data;
      const list = getStoredHeroes();
      const active = list.find(h => h.isActive && h.status === 'PUBLISHED');
      return active || list.find(h => h.status === 'PUBLISHED') || list[0] || null;
    } catch {
      const list = getStoredHeroes();
      const active = list.find(h => h.isActive && h.status === 'PUBLISHED');
      return active || list.find(h => h.status === 'PUBLISHED') || list[0] || null;
    }
  },

  // Create new hero
  async createHero(data) {
    const newRecord = {
      ...data,
      id: data.id || `hero-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: data.status || 'DRAFT',
      isActive: Boolean(data.isActive),
      isVisible: data.isVisible !== false,
    };

    try {
      const created = await api.post('/admin/content/hero', newRecord);
      const list = getStoredHeroes();
      let updatedList = [...list];
      if (created.isActive) {
        updatedList = updatedList.map(h => ({ ...h, isActive: false }));
      }
      updatedList.unshift(created);
      persistHeroes(updatedList);
      return created;
    } catch {
      const list = getStoredHeroes();
      let updatedList = [...list];
      if (newRecord.isActive) {
        updatedList = updatedList.map(h => ({ ...h, isActive: false }));
      }
      updatedList.unshift(newRecord);
      persistHeroes(updatedList);
      return newRecord;
    }
  },

  // Update existing hero
  async updateHero(id, data) {
    const updatedData = {
      ...data,
      id,
      updatedAt: new Date().toISOString(),
    };

    try {
      const updated = await api.put(`/admin/content/hero/${id}`, updatedData);
      const list = getStoredHeroes();
      let updatedList = list.map(h => {
        if (h.id === id) return { ...h, ...updated };
        if (updated.isActive) return { ...h, isActive: false };
        return h;
      });
      persistHeroes(updatedList);
      return updated;
    } catch {
      const list = getStoredHeroes();
      let updatedList = list.map(h => {
        if (h.id === id) return { ...h, ...updatedData };
        if (updatedData.isActive) return { ...h, isActive: false };
        return h;
      });
      persistHeroes(updatedList);
      return updatedData;
    }
  },

  // Delete hero
  async deleteHero(id) {
    try {
      await api.delete(`/admin/content/hero/${id}`);
    } catch (err) {
      console.warn('API hero delete failed, using local storage:', err);
    }
    const list = getStoredHeroes();
    const filtered = list.filter(h => h.id !== id);
    const hasActive = filtered.some(h => h.isActive);
    if (!hasActive && filtered.length > 0) {
      const published = filtered.find(h => h.status === 'PUBLISHED');
      if (published) published.isActive = true;
    }
    persistHeroes(filtered);
    return true;
  },

  // Set active hero (deactivates others)
  async setActiveHero(id) {
    const list = getStoredHeroes();
    const target = list.find(h => h.id === id);
    if (!target) throw new Error('Hero record not found');

    const updatedList = list.map(h => ({
      ...h,
      isActive: h.id === id,
      updatedAt: h.id === id ? new Date().toISOString() : h.updatedAt,
    }));

    try {
      await api.put(`/admin/content/hero/${id}`, { ...target, isActive: true });
    } catch (err) {
      console.warn('API setActiveHero failed, local fallback used:', err);
    }

    persistHeroes(updatedList);
    return updatedList.find(h => h.id === id);
  }
};

export default heroService;
