import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { fetchCategoriesWithCount, createCategory, updateCategory, deleteCategory } from '../lib/categories.service';
import AdminModal from './AdminModal';

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const emptyForm = { id: '', name: '', slug: '', description: '' };

const inputClass =
  'w-full bg-deep-green/60 border border-white/10 focus:border-gold/40 rounded-lg px-4 py-2.5 text-sm text-ivory placeholder-sage/25 outline-none transition-colors';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Delete
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const data = await fetchCategoriesWithCount();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  }

  // ── Form helpers ──

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setModalOpen(true);
  }

  function openEdit(cat) {
    setEditing(cat);
    setForm({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
    });
    setError('');
    setModalOpen(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-generate slug and id from name when adding
      if (name === 'name' && !editing) {
        const slugged = slugify(value);
        updated.slug = slugged;
        updated.id = slugged;
      }
      return updated;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editing) {
        await updateCategory(editing.id, {
          name: form.name.trim(),
          slug: form.slug.trim(),
          description: form.description.trim(),
        });
        // Reload to get updated counts
        await loadCategories();
      } else {
        await createCategory({
          id: form.id.trim(),
          name: form.name.trim(),
          slug: form.slug.trim(),
          description: form.description.trim(),
        });
        await loadCategories();
      }
      setModalOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ──

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      if (err.message?.includes('violates foreign key') || err.code === '23503') {
        alert('Cannot delete this category — products are still assigned to it. Reassign or delete those products first.');
      } else {
        alert('Failed to delete: ' + (err.message || 'Unknown error'));
      }
    } finally {
      setDeleting(false);
    }
  }

  // ── Render ──

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl text-ivory">Categories</h2>
          <p className="text-[11px] text-sage/50 mt-1">{categories.length} categories</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-gold text-ink font-heading text-xs tracking-wider uppercase px-4 sm:px-5 py-2.5 rounded-lg hover:bg-pale-gold hover:shadow-gold transition-all"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Add Category</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* ── MOBILE CARD VIEW (< lg) ── */}
      <div className="flex flex-col gap-3 lg:hidden">
        {categories.length === 0 ? (
          <div className="bg-forest-mid border border-white/5 rounded-lg p-8 text-center text-sage/40 text-sm">
            No categories yet. Click "Add Category" to get started.
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="bg-forest-mid border border-white/5 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm text-ivory font-medium">{cat.name}</h3>
                  <p className="text-[10px] text-sage/40 font-mono mt-0.5">{cat.slug}</p>
                  {cat.description && (
                    <p className="text-[11px] text-sage/50 mt-2 line-clamp-2">{cat.description}</p>
                  )}
                  <div className="mt-2">
                    <span className="bg-gold/10 text-gold text-[10px] font-heading px-2 py-0.5 rounded">
                      {cat.productCount} product{cat.productCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-2 text-sage/50 hover:text-gold transition-colors"
                    title="Edit category"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(cat)}
                    className="p-2 text-sage/50 hover:text-ember transition-colors"
                    title="Delete category"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── DESKTOP TABLE VIEW (lg+) ── */}
      <div className="hidden lg:block bg-forest-mid border border-white/5 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-near-black-green/30 text-sage uppercase tracking-wider border-b border-white/5 font-heading">
                <th className="p-4 font-normal">ID</th>
                <th className="p-4 font-normal">Name</th>
                <th className="p-4 font-normal">Slug</th>
                <th className="p-4 font-normal">Description</th>
                <th className="p-4 font-normal text-center">Products</th>
                <th className="p-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sage">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sage/40">
                    No categories yet. Click "Add Category" to get started.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-ivory/50 font-mono text-[10px]">{cat.id}</td>
                    <td className="p-4 text-ivory font-medium">{cat.name}</td>
                    <td className="p-4 text-ivory/50 font-mono text-[10px]">{cat.slug}</td>
                    <td className="p-4 text-sage/60 max-w-xs truncate">{cat.description || '—'}</td>
                    <td className="p-4 text-center">
                      <span className="bg-gold/10 text-gold text-[10px] font-heading px-2.5 py-0.5 rounded">
                        {cat.productCount}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(cat)}
                          className="p-2 text-sage/50 hover:text-gold transition-colors"
                          title="Edit category"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat)}
                          className="p-2 text-sage/50 hover:text-ember transition-colors"
                          title="Delete category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add/Edit Modal ── */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Category' : 'Add Category'}
      >
        {error && (
          <div className="bg-ember/10 border border-ember/30 text-ember text-xs p-3 rounded-md mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] text-sage/50 uppercase tracking-wider mb-1.5">Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Wall Tapestries" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-sage/50 uppercase tracking-wider mb-1.5">
                ID {editing && <span className="text-sage/30">(read-only)</span>}
              </label>
              <input
                name="id"
                value={form.id}
                onChange={handleChange}
                required
                disabled={!!editing}
                className={`${inputClass} font-mono ${editing ? 'opacity-40 cursor-not-allowed' : ''}`}
                placeholder="wall-tapestry"
              />
            </div>
            <div>
              <label className="block text-[10px] text-sage/50 uppercase tracking-wider mb-1.5">Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange} required className={`${inputClass} font-mono`} placeholder="wall-tapestry" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-sage/50 uppercase tracking-wider mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} placeholder="Category description…" />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-gold text-ink font-heading text-xs tracking-wider uppercase py-3 rounded-lg hover:bg-pale-gold hover:shadow-gold transition-all mt-2 disabled:opacity-50"
          >
            {saving ? 'Saving…' : editing ? 'Update Category' : 'Create Category'}
          </button>
        </form>
      </AdminModal>

      {/* ── Delete Confirmation Modal ── */}
      <AdminModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Category"
      >
        {deleteTarget?.productCount > 0 ? (
          <>
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs p-3 rounded-md mb-4">
              This category has {deleteTarget.productCount} product{deleteTarget.productCount !== 1 ? 's' : ''} assigned to it.
              You must reassign or delete those products before deleting this category.
            </div>
            <button
              onClick={() => setDeleteTarget(null)}
              className="w-full border border-white/10 text-ivory/70 font-heading text-xs uppercase py-2.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              Go Back
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-sage/70 mb-2">
              Are you sure you want to delete <span className="text-ivory font-medium">"{deleteTarget?.name}"</span>?
            </p>
            <p className="text-[11px] text-sage/40 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 border border-white/10 text-ivory/70 font-heading text-xs uppercase py-2.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-ember/20 border border-ember/30 text-ember font-heading text-xs uppercase py-2.5 rounded-lg hover:bg-ember/30 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </>
        )}
      </AdminModal>
    </div>
  );
}
