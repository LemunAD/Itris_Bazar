import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    getSubtotal,
    getShippingFee,
    getTotal,
  } = useCart();

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const total = getTotal();

  return (
    <div className="pt-20 min-h-screen pb-24 bg-near-black-green">
      <div className="max-w-5xl mx-auto px-5 lg:px-8 py-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] text-sage/40 mb-10 tracking-wider">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span className="text-sage/20">/</span>
          <span className="text-ivory/60">Cart</span>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl text-ivory mb-12">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          /* ── Empty State ── */
          <div className="text-center py-24">
            <ShoppingBag size={40} className="text-sage/15 mx-auto mb-5" strokeWidth={1} />
            <h3 className="font-heading text-xl text-ivory/60 mb-2">Nothing here yet</h3>
            <p className="text-sm text-sage/40 mb-8">Your sacred items will appear here once selected.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-gold text-ink font-heading text-xs tracking-[0.15em] uppercase py-3 px-7 rounded-lg hover:bg-pale-gold transition-colors"
            >
              Browse Collection
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

            {/* ── Item List ── */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-deep-green/40 border border-white/[0.04] rounded-xl p-4 relative group"
                >
                  {/* Thumbnail */}
                  <Link to={`/product/${item.slug}`} className="flex-shrink-0">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <span className="text-[9px] tracking-[0.2em] uppercase text-bronze/50 block mb-1">
                        {item.category === 'wall-tapestry' ? 'Tapestry' : 'Tarot'}
                      </span>
                      <h3 className="text-sm text-ivory/90 hover:text-gold transition-colors truncate">
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </h3>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-3">
                      {/* Qty control */}
                      <div className="flex items-center border border-white/[0.06] rounded-md overflow-hidden bg-near-black">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-sage/50 hover:text-gold text-xs transition-colors"
                        >
                          −
                        </button>
                        <span className="w-7 h-7 flex items-center justify-center text-ivory text-xs border-x border-white/[0.04]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-sage/50 hover:text-gold text-xs transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Line total */}
                      <span className="font-heading text-sm text-gold whitespace-nowrap">
                        {(item.price * item.quantity).toFixed(2)} <span className="text-[10px] text-gold/50">DH</span>
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-3 right-3 p-1.5 text-sage/20 hover:text-ember transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </div>
              ))}

              {/* Continue shopping */}
              <Link
                to="/shop"
                className="flex items-center gap-1.5 text-[11px] text-sage/40 hover:text-gold tracking-wider mt-2 transition-colors w-fit"
              >
                <ArrowLeft size={13} />
                Continue shopping
              </Link>
            </div>

            {/* ── Order Summary ── */}
            <div className="bg-deep-green/40 border border-white/[0.04] rounded-xl p-6 lg:sticky lg:top-28">
              <h3 className="font-heading text-base text-ivory/90 mb-6 pb-4 border-b border-white/[0.04]">
                Order Summary
              </h3>

              <div className="flex flex-col gap-3 text-sm mb-6">
                <div className="flex justify-between text-sage/50">
                  <span>Subtotal</span>
                  <span className="text-ivory/70">{subtotal.toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between text-sage/50">
                  <span>Delivery</span>
                  <span className={shipping === 0 ? 'text-olive-glow' : 'text-ivory/70'}>
                    {shipping === 0 ? 'FREE' : `${shipping.toFixed(2)} DH`}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="flex items-start gap-2 bg-near-black/40 border border-white/[0.03] rounded-md p-3 mt-1">
                    <Truck size={13} className="text-gold/40 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-sage/40 leading-relaxed">
                      Add <span className="text-gold/70 font-medium">{(300 - subtotal).toFixed(2)} DH</span> more for free delivery
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/[0.04] mb-6">
                <span className="font-heading text-sm text-ivory/80">Total</span>
                <span className="font-heading text-lg text-gold">{total.toFixed(2)} DH</span>
              </div>

              <Link
                to="/checkout"
                className="flex items-center justify-center gap-2 bg-gold text-ink font-heading text-xs tracking-[0.15em] uppercase py-3.5 rounded-lg hover:bg-pale-gold hover:shadow-gold transition-all duration-300 w-full"
              >
                Checkout
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
