import { api } from './api';
import { SERVICES_DATA } from '../data/services';

const SERVICES_STORAGE_KEY = 'yovexa_cms_services';

// Initialize services with displayOrder and isActive
function getInitialServices() {
  return SERVICES_DATA.map((srv, idx) => ({
    ...srv,
    slug: srv.id,
    description: srv.deliverables,
    displayOrder: idx + 1,
    isActive: true,
    featured: idx === 0,
    buttonText: "Discuss Requirement",
    buttonLink: "#contact",
  }));
}

function getStoredServices() {
  try {
    const raw = localStorage.getItem(SERVICES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    const initial = getInitialServices();
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch {
    return getInitialServices();
  }
}

function persistServices(services) {
  try {
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));
  } catch (err) {
    console.error('Failed to persist services:', err);
  }
}

export const servicesService = {
  async getServices({ activeOnly = false } = {}) {
    try {
      const data = await api.get(activeOnly ? '/services' : '/admin/services');
      return data;
    } catch {
      const list = getStoredServices();
      const filtered = activeOnly ? list.filter(s => s.isActive !== false) : list;
      return filtered.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    }
  },

  async getServiceById(id) {
    try {
      const data = await api.get(`/admin/services/${id}`);
      return data;
    } catch {
      const list = getStoredServices();
      return list.find(s => s.id === id || s.slug === id) || null;
    }
  },

  async createService(serviceData) {
    const list = getStoredServices();
    const newService = {
      ...serviceData,
      id: serviceData.slug || `srv-${Date.now()}`,
      displayOrder: serviceData.displayOrder || list.length + 1,
      isActive: serviceData.isActive !== false,
      features: Array.isArray(serviceData.features) 
        ? serviceData.features 
        : typeof serviceData.features === 'string' 
          ? serviceData.features.split('\n').filter(Boolean) 
          : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const created = await api.post('/admin/services', newService);
      list.push(created);
      persistServices(list);
      return created;
    } catch {
      list.push(newService);
      persistServices(list);
      return newService;
    }
  },

  async updateService(id, serviceData) {
    const list = getStoredServices();
    const index = list.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Service not found');

    const updated = {
      ...list[index],
      ...serviceData,
      features: Array.isArray(serviceData.features)
        ? serviceData.features
        : typeof serviceData.features === 'string'
          ? serviceData.features.split('\n').filter(Boolean)
          : list[index].features,
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await api.put(`/admin/services/${id}`, updated);
      list[index] = res;
      persistServices(list);
      return res;
    } catch {
      list[index] = updated;
      persistServices(list);
      return updated;
    }
  },

  async deleteService(id) {
    try {
      await api.delete(`/admin/services/${id}`);
    } catch {
      // Fallback local deletion
    }
    const list = getStoredServices();
    const updated = list.filter(s => s.id !== id);
    persistServices(updated);
    return true;
  },

  async moveService(id, direction) {
    const list = getStoredServices().sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    const index = list.findIndex(s => s.id === id);
    if (index === -1) return list;

    if (direction === 'up' && index > 0) {
      const tempOrder = list[index].displayOrder;
      list[index].displayOrder = list[index - 1].displayOrder;
      list[index - 1].displayOrder = tempOrder;
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
    } else if (direction === 'down' && index < list.length - 1) {
      const tempOrder = list[index].displayOrder;
      list[index].displayOrder = list[index + 1].displayOrder;
      list[index + 1].displayOrder = tempOrder;
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
    }

    persistServices(list);
    return list;
  }
};
