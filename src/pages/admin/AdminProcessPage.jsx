import React, { useState, useEffect } from 'react';
import {
  Plus,
  GitMerge,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  X,
  Compass,
  Layers,
  Code,
  Rocket
} from 'lucide-react';
import { processService } from '../../services/processService';
import { useToast } from '../../context/ToastContext';
import DeleteModal from '../../components/admin/DeleteModal';

export default function AdminProcessPage() {
  const { showToast } = useToast();
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Editor Modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [saving, setSaving] = useState(false);

  // Delete Modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    stepNumber: '01',
    phase: '',
    title: '',
    description: '',
    details: '',
    icon: 'Compass',
    tag: '',
    isActive: true,
  });

  const loadSteps = async () => {
    try {
      setLoading(true);
      const data = await processService.getProcessSteps({ activeOnly: false });
      setSteps(data);
    } catch (err) {
      console.error('Failed to load process steps:', err);
      showToast('Failed to load process steps', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSteps();
  }, []);

  const openCreateModal = () => {
    setEditingStep(null);
    setForm({
      stepNumber: `0${steps.length + 1}`,
      phase: '',
      title: '',
      description: '',
      details: '',
      icon: 'Compass',
      tag: 'Key Milestone',
      isActive: true,
    });
    setIsEditorOpen(true);
  };

  const openEditModal = (step) => {
    setEditingStep(step);
    setForm({
      stepNumber: step.stepNumber || '01',
      phase: step.phase || '',
      title: step.title || '',
      description: step.description || '',
      details: Array.isArray(step.details) ? step.details.join('\n') : step.details || '',
      icon: step.icon || 'Compass',
      tag: step.tag || '',
      isActive: step.isActive !== false,
    });
    setIsEditorOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast('Step title is required', 'error');
      return;
    }

    try {
      setSaving(true);
      if (editingStep) {
        await processService.updateStep(editingStep.id, form);
        showToast(`Step "${form.title}" updated successfully.`, 'success');
      } else {
        await processService.createStep(form);
        showToast(`Step "${form.title}" created successfully.`, 'success');
      }
      setIsEditorOpen(false);
      await loadSteps();
    } catch (err) {
      console.error('Failed to save step:', err);
      showToast(err.message || 'Failed to save process step', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await processService.deleteStep(deleteTarget.id);
      showToast(`Step "${deleteTarget.title}" deleted.`, 'success');
      setDeleteTarget(null);
      await loadSteps();
    } catch (err) {
      showToast(err.message || 'Failed to delete step', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleMove = async (id, direction) => {
    try {
      const updated = await processService.moveStep(id, direction);
      setSteps([...updated]);
      showToast('Step order updated', 'info');
    } catch (err) {
      console.error('Failed to reorder steps:', err);
    }
  };

  const handleToggleActive = async (step) => {
    try {
      await processService.updateStep(step.id, { isActive: !step.isActive });
      showToast(`Step set to ${!step.isActive ? 'Active' : 'Inactive'}`, 'success');
      await loadSteps();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1B3A] tracking-tight">
            Process Steps Management
          </h1>
          <p className="text-sm text-[#475569] mt-0.5 font-medium">
            Manage the iterative delivery workflow stages (Discover, Design, Develop, Launch).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadSteps}
            disabled={loading}
            className="p-2.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#334155] transition-colors"
            title="Refresh Steps"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#0EA5E9]' : ''}`} />
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-sm shadow-md shadow-[#0EA5E9]/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Process Step</span>
          </button>
        </div>
      </div>

      {/* Steps Table */}
      {loading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center space-y-3 bg-white rounded-2xl border border-[#E2E8F0]">
          <Loader2 className="w-8 h-8 text-[#0EA5E9] animate-spin" />
          <p className="text-sm font-semibold text-[#64748B]">Loading process steps...</p>
        </div>
      ) : steps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
          <GitMerge className="w-12 h-12 text-[#0EA5E9] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0B1B3A]">No Process Steps Created</h3>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B1B3A] text-white text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Create Step</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-extrabold uppercase tracking-wider text-[#64748B]">
                  <th className="py-3.5 px-4 text-center w-16">Order</th>
                  <th className="py-3.5 px-4 w-24">Step #</th>
                  <th className="py-3.5 px-4 sm:px-6">Phase & Title</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Summary</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-sm text-[#334155]">
                {steps.map((step, idx) => (
                  <tr key={step.id} className="hover:bg-[#F8FAFC] transition-colors">
                    {/* Reorder */}
                    <td className="py-4 px-2 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMove(step.id, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-[#0EA5E9] disabled:opacity-20"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-mono font-bold text-[#64748B]">{step.displayOrder || idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleMove(step.id, 'down')}
                          disabled={idx === steps.length - 1}
                          className="p-1 text-slate-400 hover:text-[#0EA5E9] disabled:opacity-20"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Step badge */}
                    <td className="py-4 px-4 font-mono font-black text-[#0284C7] text-base">
                      {step.stepNumber}
                    </td>

                    {/* Phase & Title */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0B1B3A]">{step.title}</span>
                        {step.phase && (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]">
                            {step.phase}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Summary */}
                    <td className="py-4 px-4 hidden md:table-cell text-xs text-[#64748B] max-w-sm line-clamp-2">
                      {step.description}
                    </td>

                    {/* Active */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleActive(step)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                          step.isActive !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {step.isActive !== false ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <XCircle className="w-3.5 h-3.5 text-slate-400" />}
                        <span>{step.isActive !== false ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(step)}
                          className="p-2 rounded-lg text-[#64748B] hover:text-[#0B1B3A] hover:bg-[#F1F5F9]"
                          title="Edit Step"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(step)}
                          className="p-2 rounded-lg text-[#64748B] hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Step"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Step Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081A33]/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#E2E8F0]">
            <button
              onClick={() => setIsEditorOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#64748B] hover:text-[#0B1B3A] hover:bg-[#F1F5F9]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-[#0B1B3A] font-display mb-1">
              {editingStep ? `Edit Process Step ${form.stepNumber}` : 'Add New Process Step'}
            </h3>
            <p className="text-xs text-[#64748B] mb-5">
              Specify the phase name, step number, description, and key deliverable bullet points.
            </p>

            <form onSubmit={handleSave} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-[#0B1B3A] mb-1">
                    Step Number (e.g. 01, 02)
                  </label>
                  <input
                    type="text"
                    value={form.stepNumber}
                    onChange={(e) => setForm({ ...form, stepNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm font-mono font-bold text-[#0F172A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#0B1B3A] mb-1">
                    Phase Name (e.g. Discover)
                  </label>
                  <input
                    type="text"
                    value={form.phase}
                    onChange={(e) => setForm({ ...form, phase: e.target.value })}
                    placeholder="Discover"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#0B1B3A] mb-1">
                  Step Title <span className="text-[#0EA5E9]">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Understanding Business & Requirements"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-sm font-bold text-[#0F172A]"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#0B1B3A] mb-1">
                  Summary Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed explanation of what occurs during this phase..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#0B1B3A] mb-1">
                  Deliverable Bullet Items <span className="text-[#64748B] font-normal">(One per line)</span>
                </label>
                <textarea
                  rows={3}
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                  placeholder="Requirements scoping&#10;Architecture design&#10;Sprint roadmap"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] text-xs font-mono text-[#0F172A] resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#0B1B3A]">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#0EA5E9] rounded"
                  />
                  <span>Active & Visible in Process Section</span>
                </label>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#334155] hover:bg-[#F1F5F9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-xs shadow-sm disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Step'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        title={deleteTarget?.title}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isDeleting={deleting}
      />
    </div>
  );
}
