import React, { useState, useEffect } from 'react';
import { Trash2, ChevronDown, ChevronUp, Package, User, Phone, Mail, MapPin } from 'lucide-react';
import { fetchOrders, updateOrderStatus, deleteOrder } from '../lib/orders.service';
import AdminModal from './AdminModal';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS = {
  pending:    'bg-amber-500/15 text-amber-400 border-amber-500/20',
  processing: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  shipped:    'bg-purple-500/15 text-purple-400 border-purple-500/20',
  delivered:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  cancelled:  'bg-red-500/15 text-red-400 border-red-500/20',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(orderId, newStatus) {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert('Failed to update status: ' + (err.message || 'Unknown error'));
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteOrder(deleteTarget.id);
      setOrders((prev) => prev.filter((o) => o.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert('Failed to delete: ' + (err.message || 'Unknown error'));
    } finally {
      setDeleting(false);
    }
  }

  function toggleExpand(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full" />
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header + Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl text-ivory">Orders</h2>
          <p className="text-[11px] text-sage/50 mt-1">
            {orders.length} total · {pendingCount} pending · {totalRevenue.toFixed(2)} DH revenue
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-forest-mid border border-white/5 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-near-black-green/30 text-sage uppercase tracking-wider border-b border-white/5 font-heading">
                <th className="p-4 font-normal w-8"></th>
                <th className="p-4 font-normal">Reference</th>
                <th className="p-4 font-normal">Customer</th>
                <th className="p-4 font-normal text-center">Status</th>
                <th className="p-4 font-normal text-right">Amount</th>
                <th className="p-4 font-normal text-right">Date</th>
                <th className="p-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sage">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sage/40">
                    No orders yet. Orders will appear here when customers checkout.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <React.Fragment key={o.id}>
                    {/* Main row */}
                    <tr className="hover:bg-white/5 transition-colors">
                      {/* Expand toggle */}
                      <td className="p-4">
                        <button
                          onClick={() => toggleExpand(o.id)}
                          className="text-sage/40 hover:text-gold transition-colors"
                        >
                          {expandedId === o.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </td>
                      <td className="p-4 text-ivory font-heading">{o.orderNumber}</td>
                      <td className="p-4 text-ivory">
                        <div>{o.customer.name}</div>
                        <div className="text-[10px] text-sage/60">{o.customer.city}</div>
                      </td>
                      <td className="p-4 text-center">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className={`text-[10px] uppercase font-heading px-2.5 py-1 rounded border cursor-pointer outline-none bg-transparent ${STATUS_COLORS[o.status] || 'text-sage border-white/10'}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s} className="bg-forest-mid text-ivory">
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4 text-right text-gold font-heading">{o.total.toFixed(2)} DH</td>
                      <td className="p-4 text-right text-[10px]">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setDeleteTarget(o)}
                          className="p-2 text-sage/50 hover:text-ember transition-colors"
                          title="Delete order"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {expandedId === o.id && (
                      <tr className="bg-near-black-green/20">
                        <td colSpan={7} className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Customer details */}
                            <div className="bg-deep-green/40 border border-white/5 rounded-lg p-4">
                              <h4 className="font-heading text-[10px] text-gold/70 uppercase tracking-wider mb-3">Customer Details</h4>
                              <div className="flex flex-col gap-2 text-xs">
                                <div className="flex items-center gap-2 text-ivory/70">
                                  <User size={12} className="text-sage/40" />
                                  {o.customer.name}
                                </div>
                                {o.customer.email && (
                                  <div className="flex items-center gap-2 text-ivory/70">
                                    <Mail size={12} className="text-sage/40" />
                                    {o.customer.email}
                                  </div>
                                )}
                                {o.customer.phone && (
                                  <div className="flex items-center gap-2 text-ivory/70">
                                    <Phone size={12} className="text-sage/40" />
                                    {o.customer.phone}
                                  </div>
                                )}
                                <div className="flex items-start gap-2 text-ivory/70">
                                  <MapPin size={12} className="text-sage/40 mt-0.5 flex-shrink-0" />
                                  <span>{o.customer.address}, {o.customer.city}</span>
                                </div>
                              </div>
                            </div>

                            {/* Ordered items */}
                            <div className="bg-deep-green/40 border border-white/5 rounded-lg p-4">
                              <h4 className="font-heading text-[10px] text-gold/70 uppercase tracking-wider mb-3">
                                Ordered Items ({o.items.length})
                              </h4>
                              <div className="flex flex-col gap-2.5">
                                {o.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-3 text-xs">
                                    {item.image ? (
                                      <img src={item.image} alt="" className="w-8 h-10 object-cover rounded border border-white/5" />
                                    ) : (
                                      <div className="w-8 h-10 rounded border border-white/5 bg-near-black-green/40 flex items-center justify-center">
                                        <Package size={10} className="text-sage/20" />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-ivory/70 truncate">{item.name}</p>
                                      <p className="text-[10px] text-sage/40">× {item.quantity}</p>
                                    </div>
                                    <span className="text-gold/70 font-heading">
                                      {(item.price * item.quantity).toFixed(2)} DH
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      <AdminModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Order"
      >
        <p className="text-sm text-sage/70 mb-2">
          Are you sure you want to delete order <span className="text-ivory font-heading">"{deleteTarget?.orderNumber}"</span>?
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
