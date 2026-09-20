import { apiRequest } from './api';
import { INITIAL_BLOGS } from '../data/initialBlogs';

const STORAGE_KEY = 'yovexa_blogs_data';

// Helper to initialize or retrieve persistent blog records
function getLocalBlogs() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BLOGS));
    return INITIAL_BLOGS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_BLOGS;
  }
}

function saveLocalBlogs(blogs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
}

// Calculate reading time from text content
export function calculateReadingTime(text = '') {
  const plainText = text.replace(/<[^>]*>/g, ' ').trim();
  const words = plainText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 200) || 1;
  return `${minutes} min read`;
}

// Auto-generate URL-friendly slug
export function generateSlug(text = '') {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const blogService = {
  // Public: Get all published blogs with optional search/category filter
  async getPublicBlogs({ search = '', category = 'all' } = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (category && category !== 'all') queryParams.append('category', category);
      
      const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await apiRequest(`/blogs${queryStr}`);
      return response;
    } catch {
      // Fallback to local persistent store
      const blogs = getLocalBlogs();
      let filtered = blogs.filter((b) => b.status === 'PUBLISHED');

      if (category && category !== 'all') {
        filtered = filtered.filter(
          (b) => b.category?.toLowerCase() === category.toLowerCase()
        );
      }

      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(
          (b) =>
            b.title?.toLowerCase().includes(query) ||
            b.excerpt?.toLowerCase().includes(query) ||
            b.tags?.some((t) => t.toLowerCase().includes(query))
        );
      }

      // Sort descending by publishedAt
      return filtered.sort(
        (a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt)
      );
    }
  },

  // Public: Get single blog by slug (must be PUBLISHED)
  async getBlogBySlug(slug) {
    try {
      const response = await apiRequest(`/blogs/${slug}`);
      return response;
    } catch {
      const blogs = getLocalBlogs();
      const blog = blogs.find((b) => b.slug === slug && b.status === 'PUBLISHED');
      if (!blog) {
        throw new Error('Blog post not found or is currently in draft.');
      }
      return blog;
    }
  },

  // Admin: Get all blogs (both Draft and Published)
  async getAdminBlogs() {
    try {
      const response = await apiRequest('/admin/blogs');
      return response;
    } catch {
      const blogs = getLocalBlogs();
      return [...blogs].sort(
        (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      );
    }
  },

  // Admin: Get single blog by ID for editing
  async getAdminBlogById(id) {
    try {
      const response = await apiRequest(`/admin/blogs/${id}`);
      return response;
    } catch {
      const blogs = getLocalBlogs();
      const blog = blogs.find((b) => String(b.id) === String(id));
      if (!blog) {
        throw new Error('Blog not found');
      }
      return blog;
    }
  },

  // Admin: Create new blog
  async createBlog(data) {
    const slug = data.slug?.trim() || generateSlug(data.title);
    const readingTime = calculateReadingTime(data.content);
    const now = new Date().toISOString();

    const newBlog = {
      id: `blog_${Date.now()}`,
      title: data.title?.trim(),
      slug,
      excerpt: data.excerpt?.trim(),
      content: data.content,
      featuredImage: data.featuredImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      category: data.category || 'General',
      author: data.author?.trim() || 'Yovexa Solutions',
      tags: Array.isArray(data.tags) ? data.tags : data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      status: data.status || 'DRAFT',
      readingTime,
      publishedAt: data.status === 'PUBLISHED' ? (data.publishedAt || now.split('T')[0]) : null,
      createdAt: now,
      updatedAt: now,
      seoTitle: data.seoTitle?.trim() || data.title?.trim(),
      seoDescription: data.seoDescription?.trim() || data.excerpt?.trim(),
    };

    try {
      const response = await apiRequest('/admin/blogs', {
        method: 'POST',
        body: JSON.stringify(newBlog),
      });
      return response;
    } catch {
      const blogs = getLocalBlogs();
      // Check slug uniqueness
      if (blogs.some((b) => b.slug === newBlog.slug)) {
        newBlog.slug = `${newBlog.slug}-${Math.floor(Math.random() * 1000)}`;
      }
      const updated = [newBlog, ...blogs];
      saveLocalBlogs(updated);
      return newBlog;
    }
  },

  // Admin: Update blog
  async updateBlog(id, data) {
    const readingTime = calculateReadingTime(data.content);
    const now = new Date().toISOString();

    try {
      const response = await apiRequest(`/admin/blogs/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...data,
          readingTime,
          updatedAt: now,
        }),
      });
      return response;
    } catch {
      const blogs = getLocalBlogs();
      const index = blogs.findIndex((b) => String(b.id) === String(id));
      if (index === -1) {
        throw new Error('Blog not found');
      }

      const existing = blogs[index];
      const updatedBlog = {
        ...existing,
        ...data,
        slug: data.slug?.trim() || generateSlug(data.title) || existing.slug,
        tags: Array.isArray(data.tags) ? data.tags : data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : existing.tags,
        readingTime,
        publishedAt: data.status === 'PUBLISHED' ? (data.publishedAt || existing.publishedAt || now.split('T')[0]) : existing.publishedAt,
        updatedAt: now,
      };

      blogs[index] = updatedBlog;
      saveLocalBlogs(blogs);
      return updatedBlog;
    }
  },

  // Admin: Delete blog
  async deleteBlog(id) {
    try {
      const response = await apiRequest(`/admin/blogs/${id}`, {
        method: 'DELETE',
      });
      return response;
    } catch {
      const blogs = getLocalBlogs();
      const filtered = blogs.filter((b) => String(b.id) !== String(id));
      saveLocalBlogs(filtered);
      return { success: true, message: 'Blog deleted successfully' };
    }
  },

  // Admin: Dashboard stats summary
  async getAdminStats() {
    try {
      const response = await apiRequest('/admin/dashboard');
      return response;
    } catch {
      const blogs = getLocalBlogs();
      const total = blogs.length;
      const published = blogs.filter((b) => b.status === 'PUBLISHED').length;
      const draft = blogs.filter((b) => b.status === 'DRAFT').length;
      const recent = [...blogs]
        .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
        .slice(0, 5);

      return {
        totalBlogs: total,
        publishedBlogs: published,
        draftBlogs: draft,
        recentBlogs: recent,
      };
    }
  },
};
