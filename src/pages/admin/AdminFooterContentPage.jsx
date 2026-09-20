import React, { useState, useEffect } from 'react';
import { Save, LayoutTemplate, Plus, Trash2, Globe, Loader2, Check } from 'lucide-react';
import { contentService } from '../../services/contentService';
import { useToast } from '../../context/ToastContext';

export default function AdminFooterContentPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    description: '',
    email: '',
    phone: '',
    location: '',
    copyright: '',
    socials: [],
  });

  const [newSocial, setNewSocial] = useState({ name: 'LinkedIn', url: '', active: true });

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        setLoading(true);
        const data = await contentService.getFooterContent();
        setFormData(data);
      } catch (err) {
        console.error('Failed to load footer content:', err);
        showToast('Failed to load footer content', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchFooter();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialUrlChange = (idx, url) => {
    setFormData(prev => {
      const updated = [...prev.socials];
      updated[idx] = { ...updated[idx], url };
      return { ...prev, socials: updated };
    });
  };

  const handleToggleSocial = (idx) => {
    setFormData(prev => {
      const updated = [...prev.socials];
      updated[idx] = { ...updated[idx], active: !updated[idx].active };
      return { ...prev, socials: updated };
    });
  };

  const handleRemoveSocial = (idx) => {
    setFormData(prev => ({
      ...prev,
      socials: prev.socials.filter((_, i) => i !== idx)
    }));
  };

  const handleAddSocial = () => {
    if (!newSocial.url.trim()) {
      showToast('Please enter a URL for the social profile', 'error');
      return;
    }
    setFormData(prev => ({
      ...prev,
      socials: [...(prev.socials || []), { ...newSocial }]
    }));
    setNewSocial({ name: 'LinkedIn', url: '', active: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await contentService.updateFooterContent(formData);
      showToast('Footer settings saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to update footer:', err);
      showToast(err.message || 'Failed to save footer changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#0EA5E9] animate-spin" />
        <p className="text-sm font-semibold text-[#64748B]">Loading Footer editor...</p>
      </div>
    );
  }

  const socialPlatforms = ['LinkedIn', 'GitHub', 'Instagram', 'Twitter / X', 'YouTube', 'Facebook', 'Other'];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0EA5E9]/15 text-[#0284C7] text-xs font-bold uppercase tracking-wider mb-1">
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>Singleton CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3A] tracking-tight">
            Footer & Social Links
          </h1>
          <p className="text-sm text-[#475569] mt-0.5 font-medium">
            Manage global footer descriptions, copyright statement, and social media icons.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-[#0EA5E9] hover:bg-[#0284C7] transition-all shadow-md text-sm disabled:opacity-60 shrink-0"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Footer Content</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Footer Brand & Copy (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-3">
              Footer Brand Details
            </h3>

            <div>
              <label htmlFor="description" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Footer Brand Summary Paragraph
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Building practical, scalable digital solutions..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A] resize-none"
              />
            </div>

            <div>
              <label htmlFor="copyright" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Copyright Notice Text
              </label>
              <input
                type="text"
                id="copyright"
                name="copyright"
                value={formData.copyright}
                onChange={handleChange}
                placeholder="© 2026 Yovexa Solutions. All rights reserved."
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Footer Contact Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A]"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-xs font-extrabold text-[#0B1B3A] mb-1.5">
                Footer Location Label
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A]"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Social Profiles (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0B1B3A] border-b border-[#E2E8F0] pb-3">
              Social Media Links
            </h3>
            <p className="text-xs text-[#64748B]">
              Only active links with valid URLs will be displayed in the public footer.
            </p>

            {/* Existing social list */}
            <div className="space-y-3">
              {formData.socials?.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B1B3A]">{item.name}</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs text-[#334155] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.active !== false}
                          onChange={() => handleToggleSocial(idx)}
                          className="w-3.5 h-3.5 text-[#0EA5E9] rounded"
                        />
                        <span>Visible</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveSocial(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) => handleSocialUrlChange(idx, e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 rounded-lg border border-[#CBD5E1] text-xs font-mono text-[#0F172A]"
                  />
                </div>
              ))}
            </div>

            {/* Add new social */}
            <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
              <span className="text-xs font-bold text-[#0B1B3A]">Add Social Profile</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={newSocial.name}
                  onChange={(e) => setNewSocial({ ...newSocial, name: e.target.value })}
                  className="px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#0B1B3A]"
                >
                  {socialPlatforms.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <input
                  type="url"
                  value={newSocial.url}
                  onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                  placeholder="https://..."
                  className="sm:col-span-2 px-3 py-2 rounded-xl border border-[#CBD5E1] text-xs font-mono text-[#0F172A]"
                />
              </div>
              <button
                type="button"
                onClick={handleAddSocial}
                className="w-full py-2 bg-[#0B1B3A] text-white text-xs font-bold rounded-xl hover:bg-[#183B75] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Social Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
