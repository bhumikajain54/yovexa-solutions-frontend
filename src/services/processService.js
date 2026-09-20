import { api } from './api';
import { PROCESS_STEPS } from '../data/process';

const PROCESS_STORAGE_KEY = 'yovexa_cms_process';

function getInitialSteps() {
  return PROCESS_STEPS.map((step, idx) => ({
    id: `step-${step.step || idx + 1}`,
    stepNumber: step.step || `0${idx + 1}`,
    phase: step.phase,
    title: step.title,
    description: step.summary,
    details: step.details || [],
    icon: step.icon || 'Compass',
    tag: step.tag || 'Phase Milestone',
    displayOrder: idx + 1,
    isActive: true,
  }));
}

function getStoredSteps() {
  try {
    const raw = localStorage.getItem(PROCESS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    const initial = getInitialSteps();
    localStorage.setItem(PROCESS_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  } catch {
    return getInitialSteps();
  }
}

function persistSteps(steps) {
  try {
    localStorage.setItem(PROCESS_STORAGE_KEY, JSON.stringify(steps));
  } catch (err) {
    console.error('Failed to persist process steps:', err);
  }
}

export const processService = {
  async getProcessSteps({ activeOnly = false } = {}) {
    try {
      const data = await api.get(activeOnly ? '/process' : '/admin/process');
      return data;
    } catch {
      const list = getStoredSteps();
      const filtered = activeOnly ? list.filter(s => s.isActive !== false) : list;
      return filtered.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    }
  },

  async getStepById(id) {
    try {
      const data = await api.get(`/admin/process/${id}`);
      return data;
    } catch {
      const list = getStoredSteps();
      return list.find(s => s.id === id) || null;
    }
  },

  async createStep(stepData) {
    const list = getStoredSteps();
    const newStep = {
      ...stepData,
      id: `step-${Date.now()}`,
      stepNumber: stepData.stepNumber || `0${list.length + 1}`,
      displayOrder: stepData.displayOrder || list.length + 1,
      isActive: stepData.isActive !== false,
      details: Array.isArray(stepData.details)
        ? stepData.details
        : typeof stepData.details === 'string'
          ? stepData.details.split('\n').filter(Boolean)
          : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const created = await api.post('/admin/process', newStep);
      list.push(created);
      persistSteps(list);
      return created;
    } catch {
      list.push(newStep);
      persistSteps(list);
      return newStep;
    }
  },

  async updateStep(id, stepData) {
    const list = getStoredSteps();
    const index = list.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Process step not found');

    const updated = {
      ...list[index],
      ...stepData,
      details: Array.isArray(stepData.details)
        ? stepData.details
        : typeof stepData.details === 'string'
          ? stepData.details.split('\n').filter(Boolean)
          : list[index].details,
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await api.put(`/admin/process/${id}`, updated);
      list[index] = res;
      persistSteps(list);
      return res;
    } catch {
      list[index] = updated;
      persistSteps(list);
      return updated;
    }
  },

  async deleteStep(id) {
    try {
      await api.delete(`/admin/process/${id}`);
    } catch {
      // Fallback
    }
    const list = getStoredSteps();
    const updated = list.filter(s => s.id !== id);
    persistSteps(updated);
    return true;
  },

  async moveStep(id, direction) {
    const list = getStoredSteps().sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
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

    persistSteps(list);
    return list;
  }
};
