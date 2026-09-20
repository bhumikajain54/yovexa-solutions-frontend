import { api } from './api';

const INQUIRIES_STORAGE_KEY = 'yovexa_cms_inquiries';

const INITIAL_INQUIRIES = [
  {
    id: "inq-101",
    fullName: "Rohan Verma",
    email: "rohan.v@techcorp.in",
    phone: "+91 98234 56789",
    company: "TechCorp Logistics",
    serviceRequired: "Custom Software Development",
    projectBudget: "₹50,000 – ₹1,00,000",
    message: "We need an internal warehouse dispatch management software with barcode scanning support and automated report exports.",
    status: "NEW",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "inq-102",
    fullName: "Ananya Deshmukh",
    email: "ananya@retailconnect.com",
    phone: "+91 97123 45678",
    company: "RetailConnect Studio",
    serviceRequired: "Mobile App Development",
    projectBudget: "₹1,00,000+",
    message: "Looking for an Android + React Native application for our store delivery network with live route mapping and instant push notifications.",
    status: "CONTACTED",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  }
];

function getStoredInquiries() {
  try {
    const raw = localStorage.getItem(INQUIRIES_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(INITIAL_INQUIRIES));
    return INITIAL_INQUIRIES;
  } catch {
    return INITIAL_INQUIRIES;
  }
}

function persistInquiries(inquiries) {
  try {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(inquiries));
  } catch (err) {
    console.error('Failed to persist inquiries:', err);
  }
}

export const inquiryService = {
  async submitInquiry(inquiryData) {
    const list = getStoredInquiries();
    const newInquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      status: 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const created = await api.post('/inquiries', newInquiry);
      list.unshift(created);
      persistInquiries(list);
      return created;
    } catch {
      list.unshift(newInquiry);
      persistInquiries(list);
      return newInquiry;
    }
  },

  async getInquiries() {
    try {
      const data = await api.get('/admin/inquiries');
      return data;
    } catch {
      return getStoredInquiries();
    }
  },

  async getInquiryById(id) {
    try {
      const data = await api.get(`/admin/inquiries/${id}`);
      return data;
    } catch {
      const list = getStoredInquiries();
      return list.find(i => i.id === id) || null;
    }
  },

  async updateInquiryStatus(id, status) {
    const list = getStoredInquiries();
    const index = list.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Inquiry not found');

    const updated = {
      ...list[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await api.put(`/admin/inquiries/${id}`, updated);
      list[index] = res;
      persistInquiries(list);
      return res;
    } catch {
      list[index] = updated;
      persistInquiries(list);
      return updated;
    }
  },

  async deleteInquiry(id) {
    try {
      await api.delete(`/admin/inquiries/${id}`);
    } catch {
      // Fallback
    }
    const list = getStoredInquiries();
    const updated = list.filter(i => i.id !== id);
    persistInquiries(updated);
    return true;
  }
};
