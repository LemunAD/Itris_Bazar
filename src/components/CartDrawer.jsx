import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    getSubtotal,
    getShippingFee,
    getTotal,
    getCartCount,
  } = useCart();
  
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    if (!isCartOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handler);
    // Prevent background scrolling when open
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = 'auto';
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const total = getTotal();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={closeCart}
        aria-label="Close cart overlay"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-near-black border-l border-gold/[0.06] flex flex-col animate-slide-in-right h-full shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-gold" strokeWidth={1.5} />
            <h2 className="font-heading text-sm tracking-[0.2em] text-ivory uppercase">Your Cart</h2>
            <span className="bg-gold/10 text-gold text-[10px] font-heading px-2 py-0.5 rounded-full">
              {getCartCount()}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-sage/50 hover:text-ivory transition-colors rounded-md hover:bg-white/5"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart Items Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <ShoppingBag size={40} className="text-sage/15 mb-5" strokeWidth={1} />
              <h3 className="font-heading text-lg text-ivory/60 mb-2">Cart is empty</h3>
              <p className="text-sm text-sage/40 mb-8 max-w-[200px]">Your sacred items will appear here once selected.</p>
              <button
                onClick={closeCart}
                className="inline-flex items-center gap-2 border border-gold/30 text-gold font-heading text-xs tracking-[0.15em] uppercase py-2.5 px-6 rounded-lg hover:bg-gold/10 transition-colors"
              >
                Browse Shop
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 bg-deep-green/40 border border-white/[0.04] rounded-xl p-3 relative group"
                >
                  {/* Thumbnail */}
                  <Link to={`/product/${item.slug}`} onClick={closeCart} className="flex-shrink-0">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-16 h-20 object-cover rounded-lg border border-white/[0.02]"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 pr-6">
                    <div>
                      <span className="text-[9px] tracking-[0.2em] uppercase text-bronze/50 block mb-0.5">
                        {item.categoryName || item.category}
                      </span>
                      <h3 className="text-xs text-ivory/90 hover:text-gold transition-colors truncate">
                        <Link to={`/product/${item.slug}`} onClick={closeCart}>{item.name}</Link>
                      </h3>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-2">
                      {/* Qty control */}
                      <div className="flex items-center border border-white/[0.06] rounded-md overflow-hidden bg-near-black">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-sage/50 hover:text-gold text-xs transition-colors"
                        >
                          −
                        </button>
                        <span className="w-6 h-6 flex items-center justify-center text-ivory text-xs border-x border-white/[0.04]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.stock && item.quantity >= item.stock}
                          className="w-6 h-6 flex items-center justify-center text-sage/50 hover:text-gold text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>

                      {/* Line total */}
                      <span className="font-heading text-xs text-gold whitespace-nowrap">
                        {(item.price * item.quantity).toFixed(2)} <span className="text-[9px] text-gold/50">DH</span>
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-2 right-2 p-1.5 text-sage/20 hover:text-ember transition-colors bg-near-black/50 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Remove"
                  >
                    <Trash2 size={12} strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div className="bg-deep-green border-t border-gold/[0.06] p-5 pb-8 sm:pb-5">
            <div className="flex flex-col gap-2.5 text-sm mb-5">
              <div className="flex justify-between text-sage/50 text-xs">
                <span>Subtotal</span>
                <span className="text-ivory/70 font-heading">{subtotal.toFixed(2)} DH</span>
              </div>
              <div className="flex justify-between text-sage/50 text-xs">
                <span>Delivery</span>
                <span className={shipping === 0 ? 'text-olive-glow font-heading' : 'text-ivory/70 font-heading'}>
                  {shipping === 0 ? 'FREE' : `${shipping.toFixed(2)} DH`}
                </span>
              </div>

              {shipping > 0 && (
                <div className="flex items-start gap-2 bg-near-black-green border border-gold/10 rounded-md p-2.5 mt-1">
                  <Truck size={12} className="text-gold/50 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-sage/50 leading-relaxed">
                    Add <span className="text-gold/70 font-medium">{(300 - subtotal).toFixed(2)} DH</span> more for free delivery
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-white/[0.04] mb-5">
              <span className="font-heading text-xs text-ivory/80 uppercase tracking-wider">Total</span>
              <span className="font-heading text-lg text-gold">{total.toFixed(2)} DH</span>
            </div>

            <button
              onClick={handleCheckout}
              className="flex items-center justify-center gap-2 bg-gold text-ink font-heading text-xs tracking-[0.15em] uppercase py-3.5 rounded-lg hover:bg-pale-gold hover:shadow-gold transition-all duration-300 w-full"
            >
              Checkout
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
