import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, DollarSign, Loader, TrendingUp, ArrowRight, FolderPlus } from 'lucide-react';
import { products } from '../data/products';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read simulated orders from local storage
    const savedOrders = JSON.parse(localStorage.getItem('itris_orders') || '[]');
    setOrders(savedOrders);
    setLoading(false);
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const totalProducts = products.length;

  return (
    <div className="flex flex-col gap-8">

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Revenue */}
        <div className="bg-forest-mid border border-white/5 p-6 rounded-lg">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] text-sage uppercase tracking-wider font-heading">Total Revenue</span>
            <DollarSign size={18} className="text-gold" />
          </div>
          <p className="font-heading text-2xl text-ivory font-bold">{totalRevenue.toFixed(2)} DH</p>
          <p className="text-[10px] text-gold flex items-center gap-1 mt-2">
            <TrendingUp size={12} />
            Simulated cash turnover
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-forest-mid border border-white/5 p-6 rounded-lg">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] text-sage uppercase tracking-wider font-heading">Total Orders</span>
            <ShoppingBag size={18} className="text-gold" />
          </div>
          <p className="font-heading text-2xl text-ivory font-bold">{totalOrders}</p>
          <p className="text-[10px] text-sage/65 mt-2">Through storefront checkout</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-forest-mid border border-white/5 p-6 rounded-lg">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] text-sage uppercase tracking-wider font-heading">Pending Orders</span>
            <Loader size={18} className={`text-gold ${pendingOrders > 0 ? 'animate-spin' : ''}`} />
          </div>
          <p className="font-heading text-2xl text-ivory font-bold">{pendingOrders}</p>
          <p className="text-[10px] text-sage/65 mt-2">Awaiting courier dispatch</p>
        </div>

        {/* Catalog Items */}
        <div className="bg-forest-mid border border-white/5 p-6 rounded-lg">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] text-sage uppercase tracking-wider font-heading">Active Products</span>
            <FolderPlus size={18} className="text-gold" />
          </div>
          <p className="font-heading text-2xl text-ivory font-bold">{totalProducts}</p>
          <p className="text-[10px] text-sage/65 mt-2">Currently in mock database</p>
        </div>

      </div>


      {/* ── DETAILS PANEL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Recent Orders table */}
        <div className="lg:col-span-2 bg-forest-mid border border-white/5 rounded-lg overflow-hidden">
          <div className="p-5 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-heading text-sm text-ivory uppercase tracking-wider">Recent Transactions</h3>
            {orders.length > 0 && (
              <button
                onClick={() => {
                  localStorage.removeItem('itris_orders');
                  setOrders([]);
                }}
                className="text-[10px] text-ember uppercase font-heading hover:underline"
              >
                Clear History
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-near-black-green/30 text-sage uppercase tracking-wider border-b border-white/5 font-heading">
                  <th className="p-4 font-normal">Reference</th>
                  <th className="p-4 font-normal">Customer</th>
                  <th className="p-4 font-normal text-center">Status</th>
                  <th className="p-4 font-normal text-right">Amount</th>
                  <th className="p-4 font-normal text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sage">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-sage/40">
                      No order logs available.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.orderNumber} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-ivory font-heading">{o.orderNumber}</td>
                      <td className="p-4 text-ivory">
                        <div>{o.customer.name}</div>
                        <div className="text-[10px] text-sage/60 font-body">{o.customer.city}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-gold/15 text-gold text-[9px] uppercase font-heading px-2 py-0.5 rounded">
                          {o.status}
                        </span>
                      </td>
                      <td className="p-4 text-right text-gold font-heading">{o.total.toFixed(2)} DH</td>
                      <td className="p-4 text-right text-[10px]">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-forest-mid border border-white/5 p-6 rounded-lg">
          <h3 className="font-heading text-sm text-ivory uppercase tracking-wider mb-6 border-b border-white/5 pb-3">
            Quick Actions
          </h3>

          <div className="flex flex-col gap-4">
            <Link
              to="/shop"
              className="bg-deep-green border border-white/10 hover:border-gold/30 text-ivory hover:text-gold text-xs font-heading uppercase py-3 px-4 rounded transition-colors flex items-center justify-between"
            >
              Browse Public Shop
              <ArrowRight size={14} />
            </Link>
            <div className="bg-near-black-green/30 border border-white/5 p-4 rounded text-[11px] text-sage leading-relaxed">
              <p className="font-heading text-gold mb-1">Testing local checkout:</p>
              Go to public shop, add products to cart, fill billing details, click buy, then refresh this panel to see the transaction update instantly!
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
