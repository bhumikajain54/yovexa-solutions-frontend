import { api } from './api';
import { heroService } from './heroService';
import { aboutService } from './aboutService';

const CONTACT_STORAGE_KEY = 'yovexa_cms_contact';
const FOOTER_STORAGE_KEY = 'yovexa_cms_footer';

const DEFAULT_CONTACT = {
  email: "contact@yovexasolutions.com",
  phone: "+91 (Contact Available on Inquiry)",
  whatsapp: "+91 9876543210",
  location: "India (Serving Clients Globally)",
  address: "Bangalore / Remote Global Hub",
  turnaroundTime: "Within 24 Hours",
  workingHours: "Mon - Sat: 9:00 AM - 7:00 PM IST",
  heading: "Have an Idea? Let's Build It.",
  description: "Tell us what you're building, what problem you're solving, or what you want to improve. We'll help turn the idea into a practical digital solution.",
};

const DEFAULT_FOOTER = {
  description: "Building practical, scalable, and user-focused digital solutions for modern businesses. Transforming ideas into robust software.",
  email: "contact@yovexasolutions.com",
  phone: "+91 (Contact Available on Inquiry)",
  location: "India (Serving Clients Globally)",
  copyright: `© ${new Date().getFullYear()} Yovexa Solutions. All rights reserved.`,
  socials: [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/jain-bhumika", active: true },
    { name: "GitHub", url: "https://github.com/bhumikajain54", active: true },
    { name: "Instagram", url: "https://www.instagram.com/yovexaprime/", active: true },
  ],
};

// Helpers for localStorage sync
function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  } catch {
    return fallback;
  }
}

function setStored(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to persist ${key}:`, err);
  }
}

export const contentService = {
  // HERO (Delegates to heroService)
  async getHeroContent() {
    return heroService.getActiveHero();
  },

  async updateHeroContent(heroData) {
    const active = await heroService.getActiveHero();
    if (active && active.id) {
      return heroService.updateHero(active.id, heroData);
    }
    return heroService.createHero({ ...heroData, isActive: true, status: 'PUBLISHED' });
  },

  // ABOUT (Delegates to aboutService)
  async getAboutContent() {
    return aboutService.getActiveAbout();
  },

  async updateAboutContent(aboutData) {
    const active = await aboutService.getActiveAbout();
    if (active && active.id) {
      return aboutService.updateAbout(active.id, aboutData);
    }
    return aboutService.createAbout({ ...aboutData, isActive: true, status: 'PUBLISHED' });
  },

  // CONTACT
  async getContactContent() {
    try {
      const data = await api.get('/content/contact');
      return data;
    } catch {
      return getStored(CONTACT_STORAGE_KEY, DEFAULT_CONTACT);
    }
  },

  async updateContactContent(contactData) {
    try {
      const updated = await api.put('/admin/content/contact', contactData);
      setStored(CONTACT_STORAGE_KEY, updated);
      return updated;
    } catch {
      setStored(CONTACT_STORAGE_KEY, contactData);
      return contactData;
    }
  },

  // FOOTER
  async getFooterContent() {
    try {
      const data = await api.get('/content/footer');
      return data;
    } catch {
      return getStored(FOOTER_STORAGE_KEY, DEFAULT_FOOTER);
    }
  },

  async updateFooterContent(footerData) {
    try {
      const updated = await api.put('/admin/content/footer', footerData);
      setStored(FOOTER_STORAGE_KEY, updated);
      return updated;
    } catch {
      setStored(FOOTER_STORAGE_KEY, footerData);
      return footerData;
    }
  },
};

export { heroService, aboutService };
export default contentService;

