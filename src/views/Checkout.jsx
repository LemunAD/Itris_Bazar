import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Shield, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { cart, getSubtotal, getShippingFee, getTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '',
  });
  const [submitting, setSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center text-center px-5">
        <div>
          <h2 className="font-heading text-2xl text-gold mb-3">Cart is Empty</h2>
          <p className="text-sage/40 mb-6 text-sm">Add items before checking out.</p>
          <Link to="/shop" className="bg-gold text-ink font-heading text-xs tracking-wider uppercase px-6 py-2.5 rounded-lg hover:bg-pale-gold transition-colors">
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const orderNumber = `ITR-${Date.now().toString(36).toUpperCase()}`;
    const order = {
      orderNumber,
      customer: form,
      items: cart,
      subtotal: getSubtotal(),
      shippingCost: getShippingFee(),
      total: getTotal(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('itris_orders') || '[]');
    localStorage.setItem('itris_orders', JSON.stringify([order, ...existing]));
    clearCart();

    setTimeout(() => {
      alert(`Order placed successfully!\nReference: ${orderNumber}\nPayment: Cash on Delivery`);
      navigate('/');
    }, 600);
  };

  const inputClass = 'w-full bg-near-black/40 border border-white/[0.06] focus:border-gold/30 rounded-lg px-4 py-2.5 text-sm text-ivory placeholder-sage/25 outline-none transition-colors';

  return (
    <div className="pt-20 min-h-screen pb-24 bg-near-black-green">
      <div className="max-w-5xl mx-auto px-5 lg:px-8 py-12">

        {/* Back */}
        <Link to="/cart" className="flex items-center gap-1.5 text-[11px] text-sage/40 hover:text-gold tracking-wider mb-10 w-fit transition-colors">
          <ArrowLeft size={14} strokeWidth={1.5} />
          Return to cart
        </Link>

        <h1 className="font-heading text-3xl sm:text-4xl text-ivory mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

          {/* ── Delivery Form ── */}
          <div className="lg:col-span-2 bg-deep-green/40 border border-white/[0.04] rounded-xl p-6 sm:p-8">
            <h3 className="font-heading text-base text-gold/80 mb-6 pb-4 border-b border-white/[0.04]">
              Delivery Information
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-[10px] text-sage/40 uppercase tracking-[0.2em] mb-2">Full Name</label>
                  <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Your full name" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-[10px] text-sage/40 uppercase tracking-[0.2em] mb-2">Phone</label>
                  <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} required placeholder="0612345678" className={inputClass} />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-[10px] text-sage/40 uppercase tracking-[0.2em] mb-2">Email</label>
                <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@email.com" className={inputClass} />
              </div>

              <div>
                <label htmlFor="address" className="block text-[10px] text-sage/40 uppercase tracking-[0.2em] mb-2">Shipping Address</label>
                <textarea id="address" name="address" value={form.address} onChange={handleChange} required rows={3} placeholder="Street, building, apartment…" className={`${inputClass} resize-none`} />
              </div>

              <div>
                <label htmlFor="city" className="block text-[10px] text-sage/40 uppercase tracking-[0.2em] mb-2">City</label>
                <input type="text" id="city" name="city" value={form.city} onChange={handleChange} required placeholder="Casablanca" className={inputClass} />
              </div>

              {/* COD notice */}
              <div className="flex items-start gap-3 bg-near-black/30 border border-white/[0.03] rounded-lg p-4 mt-1">
                <Shield size={16} className="text-gold/40 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-xs text-ivory/60 font-medium mb-0.5">Cash on Delivery</p>
                  <p className="text-[10px] text-sage/35 leading-relaxed">Pay the courier when your order arrives. No online payment needed.</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-gold text-ink font-heading text-xs tracking-[0.15em] uppercase py-3.5 rounded-lg hover:bg-pale-gold hover:shadow-gold transition-all duration-300 w-full mt-2 disabled:opacity-50"
              >
                {submitting ? 'Placing Order…' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* ── Order Summary ── */}
          <div className="bg-deep-green/40 border border-white/[0.04] rounded-xl p-6 lg:sticky lg:top-28">
            <h3 className="font-heading text-base text-ivory/90 mb-6 pb-4 border-b border-white/[0.04]">
              Order ({cart.length} {cart.length === 1 ? 'item' : 'items'})
            </h3>

            <div className="flex flex-col gap-4 max-h-56 overflow-y-auto mb-6 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.images[0]} alt={item.name} className="w-12 h-14 object-cover rounded-md flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-ivory/70 truncate">{item.name}</p>
                    <p className="text-[10px] text-sage/30">× {item.quantity}</p>
                  </div>
                  <span className="text-xs text-gold/80 font-heading flex-shrink-0">
                    {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2.5 border-t border-white/[0.04] pt-4 text-sm text-sage/50 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-ivory/60">{getSubtotal().toFixed(2)} DH</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className={getShippingFee() === 0 ? 'text-olive-glow' : 'text-ivory/60'}>
                  {getShippingFee() === 0 ? 'FREE' : `${getShippingFee().toFixed(2)} DH`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/[0.04]">
              <span className="font-heading text-sm text-ivory/80">Total</span>
              <span className="font-heading text-lg text-gold">{getTotal().toFixed(2)} DH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
