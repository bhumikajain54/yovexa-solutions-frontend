import { api, extractData, extractListData } from './api';

export const processService = {
  async getProcessSteps({ activeOnly = false } = {}) {
    try {
      const res = await api.get(activeOnly ? '/process' : '/admin/process');
      const list = extractListData(res);
      return list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    } catch (err) {
      console.error('Failed to fetch process steps:', err);
      return [];
    }
  },

  async getStepById(id) {
    try {
      const res = await api.get(`/admin/process/${id}`);
      return extractData(res);
    } catch (err) {
      console.error('Failed to fetch process step by id:', err);
      throw err;
    }
  },

  async createStep(stepData) {
    const payload = {
      ...stepData,
      details: Array.isArray(stepData.details)
        ? stepData.details
        : typeof stepData.details === 'string'
          ? stepData.details.split('\n').map(s => s.trim()).filter(Boolean)
          : [],
    };

    const res = await api.post('/admin/process', payload);
    return extractData(res);
  },

  async updateStep(id, stepData) {
    const payload = {
      ...stepData,
      details: Array.isArray(stepData.details)
        ? stepData.details
        : typeof stepData.details === 'string'
          ? stepData.details.split('\n').map(s => s.trim()).filter(Boolean)
          : stepData.details,
    };

    const res = await api.put(`/admin/process/${id}`, payload);
    return extractData(res);
  },

  async deleteStep(id) {
    await api.delete(`/admin/process/${id}`);
    return true;
  },

  async moveStep(id, direction) {
    const list = await this.getProcessSteps({ activeOnly: false });
    const index = list.findIndex(s => s.id === id);
    if (index === -1) return list;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return list;

    const current = list[index];
    const target = list[targetIndex];

    const currentOrder = current.displayOrder ?? (index + 1);
    const targetOrder = target.displayOrder ?? (targetIndex + 1);

    await Promise.all([
      this.updateStep(current.id, { ...current, displayOrder: targetOrder }),
      this.updateStep(target.id, { ...target, displayOrder: currentOrder })
    ]);

    return this.getProcessSteps({ activeOnly: false });
  }
};
