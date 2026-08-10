import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, DollarSign, Loader, TrendingUp, ArrowRight, FolderPlus } from 'lucide-react';
import { fetchOrders } from '../lib/orders.service';
import { fetchProductCount } from '../lib/products.service';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [ordersData, productCount] = await Promise.all([
          fetchOrders(),
          fetchProductCount(),
        ]);
        setOrders(ordersData);
        setTotalProducts(productCount);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  // ── Sales Analytics (Last 7 Days) ──
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const chartData = last7Days.map((dateStr) => {
    const dayOrders = orders.filter(
      (o) => o.status === 'delivered' && o.createdAt.startsWith(dateStr)
    );
    const revenue = dayOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      dateStr,
      label: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
      revenue,
    };
  });

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full" />
      </div>
    );
  }

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
            Live from Supabase
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
          <p className="text-[10px] text-sage/65 mt-2">In Supabase catalog</p>
        </div>

      </div>


      {/* ── DETAILS PANEL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Recent Orders table */}
        <div className="lg:col-span-2 bg-forest-mid border border-white/5 rounded-lg overflow-hidden">
          <div className="p-5 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-heading text-sm text-ivory uppercase tracking-wider">Recent Transactions</h3>
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

        {/* Analytics Card */}
        <div className="bg-forest-mid border border-white/5 p-6 rounded-lg">
          <h3 className="font-heading text-sm text-ivory uppercase tracking-wider mb-6 border-b border-white/5 pb-3">
            Sales (Last 7 Days)
          </h3>

          <div className="h-48 flex items-end justify-between gap-2 mt-4 pb-2 border-b border-white/5 relative">
            {chartData.map((d, i) => {
              const heightPercent = (d.revenue / maxRevenue) * 100;
              return (
                <div key={i} className="relative flex flex-col items-center justify-end h-full w-full group">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 bg-near-black border border-white/10 text-ivory text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-lg">
                    {d.revenue.toFixed(0)} DH
                  </div>
                  {/* Bar */}
                  <div
                    className="w-full max-w-[28px] bg-gold/80 hover:bg-gold rounded-t-sm transition-all duration-500 ease-out"
                    style={{ height: `${Math.max(heightPercent, 2)}%` }}
                  />
                  {/* Label */}
                  <span className="text-[9px] text-sage/60 mt-2 uppercase">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] text-sage/70">
            <span>Only delivered orders</span>
            <Link to="/shop" className="text-gold hover:underline flex items-center gap-1">
              Shop <ArrowRight size={12} />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
