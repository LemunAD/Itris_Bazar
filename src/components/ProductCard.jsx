import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1200);
  };

  return (
    <div className="group animate-fade-in-up" style={{ opacity: 0 }}>
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-deep-green border border-white/[0.04] group-hover:border-gold/10 transition-colors duration-400">
        
        {/* Product image */}
        {!imgLoaded && (
          <div className="absolute inset-0 img-placeholder">
            <div className="w-8 h-8 border border-sage/20 border-t-gold/40 rounded-full animate-spin" />
          </div>
        )}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.04] ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-near-black/80 via-near-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-4">
          <div className="flex gap-2 w-full">
            <Link
              to={`/product/${product.slug}`}
              className="flex-1 flex items-center justify-center gap-2 bg-ivory/10 backdrop-blur-sm border border-ivory/10 text-ivory text-xs tracking-wider uppercase py-2.5 rounded-md hover:bg-ivory/20 transition-colors"
            >
              <Eye size={14} strokeWidth={1.5} />
              View
            </Link>
            <button
              onClick={handleQuickAdd}
              disabled={isAdding}
              className={`flex-1 flex items-center justify-center gap-2 text-xs tracking-wider uppercase py-2.5 rounded-md transition-all duration-300 ${
                isAdding
                  ? 'bg-olive-glow/80 text-ivory border border-olive-glow'
                  : 'bg-gold/90 text-ink border border-gold hover:bg-gold'
              }`}
            >
              <ShoppingCart size={14} strokeWidth={1.5} />
              {isAdding ? 'Added ✓' : 'Add'}
            </button>
          </div>
        </div>
      </div>

      {/* Product info */}
      <div className="mt-3.5 px-0.5">
        <span className="text-[10px] tracking-[0.2em] uppercase text-bronze/70 block mb-1">
          {product.category === 'wall-tapestry' ? 'Tapestry' : 'Tarot'}
        </span>
        <h3 className="text-sm text-ivory/90 group-hover:text-gold transition-colors duration-300 leading-snug mb-1.5">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <span className="font-heading text-gold text-sm">
          {product.price.toFixed(2)} <span className="text-[10px] text-gold/60">DH</span>
        </span>
      </div>
    </div>
  );
}
