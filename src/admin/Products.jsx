import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Star, StarOff, Image as ImageIcon } from 'lucide-react';
import { fetchProductsRaw, createProduct, updateProduct, deleteProduct } from '../lib/products.service';
import { fetchCategories } from '../lib/categories.service';
import AdminModal from './AdminModal';

// Slug generator
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const emptyForm = {
  name: '',
  slug: '',
  category_id: '',
  price: '',
  images: '',
  short_description: '',
  description: '',
  featured: false,
  stock: 0,
};

const inputClass =
  'w-full bg-deep-green/60 border border-white/10 focus:border-gold/40 rounded-lg px-4 py-2.5 text-sm text-ivory placeholder-sage/25 outline-none transition-colors';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = add, object = edit
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [productsData, categoriesData] = await Promise.all([
        fetchProductsRaw(),
        fetchCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to load products:', err);
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

  function openEdit(product) {
    setEditing(product);
    setForm({
      name: product.name,
      slug: product.slug,
      category_id: product.category_id,
      price: String(product.price),
      images: (product.images || []).join('\n'),
      short_description: product.short_description || '',
      description: product.description || '',
      featured: product.featured,
      stock: product.stock ?? 0,
    });
    setError('');
    setModalOpen(true);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
      // Auto-generate slug from name when adding (not editing)
      if (name === 'name' && !editing) {
        updated.slug = slugify(value);
      }
      return updated;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      category_id: form.category_id,
      price: parseFloat(form.price),
      images: form.images
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      short_description: form.short_description.trim(),
      description: form.description.trim(),
      featured: form.featured,
      stock: parseInt(form.stock, 10) || 0,
    };

    try {
      if (editing) {
        const updated = await updateProduct(editing.id, payload);
        setProducts((prev) => prev.map((p) => (p.id === editing.id ? updated : p)));
      } else {
        const created = await createProduct(payload);
        setProducts((prev) => [created, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ──

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert('Failed to delete: ' + (err.message || 'Unknown error'));
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
          <h2 className="font-heading text-xl text-ivory">Products</h2>
          <p className="text-[11px] text-sage/50 mt-1">{products.length} items in catalog</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-gold text-ink font-heading text-xs tracking-wider uppercase px-5 py-2.5 rounded-lg hover:bg-pale-gold hover:shadow-gold transition-all"
        >
          <Plus size={15} />
          Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-forest-mid border border-white/5 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-near-black-green/30 text-sage uppercase tracking-wider border-b border-white/5 font-heading">
                <th className="p-4 font-normal w-14"></th>
                <th className="p-4 font-normal">Product</th>
                <th className="p-4 font-normal">Category</th>
                <th className="p-4 font-normal text-right">Price</th>
                <th className="p-4 font-normal text-right">Stock</th>
                <th className="p-4 font-normal text-center">Featured</th>
                <th className="p-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sage">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sage/40">
                    No products yet. Click "Add Product" to get started.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    {/* Thumbnail */}
                    <td className="p-4">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0]}
                          alt=""
                          className="w-10 h-12 object-cover rounded-md border border-white/5"
                        />
                      ) : (
                        <div className="w-10 h-12 rounded-md border border-white/5 bg-near-black-green/40 flex items-center justify-center">
                          <ImageIcon size={14} className="text-sage/20" />
                        </div>
                      )}
                    </td>
                    {/* Name + slug */}
                    <td className="p-4">
                      <div className="text-ivory font-medium">{p.name}</div>
                      <div className="text-[10px] text-sage/40 font-mono mt-0.5">/{p.slug}</div>
                    </td>
                    {/* Category */}
                    <td className="p-4">
                      <span className="text-ivory/70">{p.categories?.name || '—'}</span>
                    </td>
                    {/* Price */}
                    <td className="p-4 text-right text-gold font-heading">
                      {Number(p.price).toFixed(2)} DH
                    </td>
                    {/* Stock */}
                    <td className="p-4 text-right">
                      {p.stock > 0 ? (
                        <span className="text-ivory/80">{p.stock}</span>
                      ) : (
                        <span className="text-ember font-medium">Out</span>
                      )}
                    </td>
                    {/* Featured */}
                    <td className="p-4 text-center">
                      {p.featured ? (
                        <Star size={14} className="text-gold mx-auto fill-gold" />
                      ) : (
                        <StarOff size={14} className="text-sage/20 mx-auto" />
                      )}
                    </td>
                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 text-sage/50 hover:text-gold transition-colors"
                          title="Edit product"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-2 text-sage/50 hover:text-ember transition-colors"
                          title="Delete product"
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
        title={editing ? 'Edit Product' : 'Add Product'}
        maxWidth="max-w-2xl"
      >
        {error && (
          <div className="bg-ember/10 border border-ember/30 text-ember text-xs p-3 rounded-md mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-sage/50 uppercase tracking-wider mb-1.5">Name</label>
              <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Moon Tapestry" />
            </div>
            <div>
              <label className="block text-[10px] text-sage/50 uppercase tracking-wider mb-1.5">Slug</label>
              <input name="slug" value={form.slug} onChange={handleChange} required className={`${inputClass} font-mono`} placeholder="moon-tapestry" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] text-sage/50 uppercase tracking-wider mb-1.5">Category</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} required className={inputClass}>
                <option value="">Select category…</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-sage/50 uppercase tracking-wider mb-1.5">Price (DH)</label>
              <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required className={inputClass} placeholder="120.00" />
            </div>
            <div>
              <label className="block text-[10px] text-sage/50 uppercase tracking-wider mb-1.5">Stock</label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required className={inputClass} placeholder="10" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-sage/50 uppercase tracking-wider mb-1.5">
              Image URLs <span className="text-sage/30">(one per line)</span>
            </label>
            <textarea
              name="images"
              value={form.images}
              onChange={handleChange}
              rows={3}
              className={`${inputClass} resize-none font-mono text-[11px]`}
              placeholder={"/images/products/slug/1.jpeg\n/images/products/slug/2.jpeg"}
            />
          </div>

          <div>
            <label className="block text-[10px] text-sage/50 uppercase tracking-wider mb-1.5">Short Description</label>
            <input name="short_description" value={form.short_description} onChange={handleChange} className={inputClass} placeholder="Brief tagline for product cards" />
          </div>

          <div>
            <label className="block text-[10px] text-sage/50 uppercase tracking-wider mb-1.5">Full Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={4} className={`${inputClass} resize-none`} placeholder="Detailed product description…" />
          </div>

          <label className="flex items-center gap-3 cursor-pointer mt-1">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
              className="w-4 h-4 rounded border-white/10 bg-deep-green accent-gold"
            />
            <span className="text-xs text-sage/70">Featured on homepage</span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="bg-gold text-ink font-heading text-xs tracking-wider uppercase py-3 rounded-lg hover:bg-pale-gold hover:shadow-gold transition-all mt-2 disabled:opacity-50"
          >
            {saving ? 'Saving…' : editing ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      </AdminModal>

      {/* ── Delete Confirmation Modal ── */}
      <AdminModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product"
      >
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
      </AdminModal>
    </div>
  );
}
