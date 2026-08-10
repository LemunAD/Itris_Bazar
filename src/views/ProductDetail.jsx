import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchProductBySlug, fetchProductsByCategory } from '../lib/products.service';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setActiveImage(0);
      setQuantity(1);

      try {
        const p = await fetchProductBySlug(slug);
        if (cancelled) return;
        setProduct(p);

        if (p) {
          const relatedProducts = await fetchProductsByCategory(p.category);
          if (!cancelled) {
            setRelated(relatedProducts.filter((r) => r.id !== p.id).slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-near-black-green">
        <div className="animate-spin w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center text-center px-5">
        <div>
          <h2 className="font-heading text-3xl text-gold mb-3">Not Found</h2>
          <p className="text-sage/50 mb-6">This product doesn't exist in our catalog.</p>
          <Link to="/shop" className="bg-gold text-ink font-heading text-xs tracking-wider uppercase px-6 py-3 rounded-lg hover:bg-pale-gold transition-colors">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1500);
  };

  const nextImage = () => setActiveImage((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + product.images.length) % product.images.length);

  return (
    <div className="pt-20 min-h-screen pb-24 bg-near-black-green">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">

        {/* Back nav */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[11px] text-sage/40 hover:text-gold tracking-wider mb-10 transition-colors"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* ── LEFT: Image Gallery ── */}
          <div className="flex flex-col gap-4">
            {/* Main image */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-deep-green border border-white/[0.04]">
              <img
                src={product.images[activeImage]}
                alt={`${product.name} - Image ${activeImage + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
                key={activeImage}
              />

              {/* Image nav arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass-dark border border-white/[0.08] flex items-center justify-center text-ivory/60 hover:text-gold hover:border-gold/20 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass-dark border border-white/[0.08] flex items-center justify-center text-ivory/60 hover:text-gold hover:border-gold/20 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-3 right-3 glass-dark border border-white/[0.06] px-2.5 py-1 rounded-full text-[10px] text-ivory/50 tracking-wider">
                {activeImage + 1} / {product.images.length}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-24 rounded-lg overflow-hidden border transition-all duration-300 ${
                      idx === activeImage
                        ? 'border-gold/40 opacity-100 ring-1 ring-gold/20'
                        : 'border-white/[0.04] opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Product Details ── */}
          <div className="flex flex-col justify-center lg:py-8">
            <span className="text-[10px] tracking-[0.3em] uppercase text-bronze/60 block mb-2">
              {product.categoryName || product.category}
            </span>

            <h1 className="font-heading text-3xl sm:text-4xl text-ivory leading-tight mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-heading text-2xl text-gold">
                {product.price.toFixed(2)}
              </span>
              <span className="text-xs text-gold/50 tracking-wider">DH</span>
            </div>
            {product.stock > 0 && product.stock <= 5 && (
              <div className="text-ember/90 text-xs font-medium tracking-wide mb-6">
                Only {product.stock} left in stock!
              </div>
            )}
            {(product.stock > 5 || product.stock <= 0) && <div className="mb-6" />}

            {/* Description */}
            <p className="text-sm text-sage/60 leading-relaxed mb-8 max-w-lg">
              {product.description}
            </p>

            {/* Qty + Add to Cart */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/[0.04]">
              {product.stock > 0 ? (
                <>
                  {/* Quantity selector */}
                  <div className="flex items-center border border-white/[0.06] rounded-lg overflow-hidden bg-near-black">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-sage/50 hover:text-gold transition-colors text-sm"
                    >
                      −
                    </button>
                    <span className="w-10 h-10 flex items-center justify-center text-ivory text-sm border-x border-white/[0.04]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center text-sage/50 hover:text-gold transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>

                  {/* Add to cart button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`flex-1 flex items-center justify-center gap-2.5 font-heading text-xs tracking-[0.15em] uppercase py-3.5 rounded-lg transition-all duration-400 ${
                      isAdding
                        ? 'bg-olive-glow/30 text-ivory border border-olive-glow/40'
                        : 'bg-gold text-ink hover:bg-pale-gold hover:shadow-gold border border-gold'
                    }`}
                  >
                    <ShoppingCart size={15} strokeWidth={1.5} />
                    {isAdding ? 'Added to Cart ✓' : 'Add to Cart'}
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2.5 font-heading text-xs tracking-[0.15em] uppercase py-3.5 rounded-lg bg-near-black/50 text-sage/40 border border-white/5 cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}
            </div>

            {/* Trust items */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <Truck size={16} className="text-gold/40" strokeWidth={1.5} />
                <span className="text-[10px] text-sage/40 leading-tight">
                  {product.price >= 300 ? 'Free delivery' : '35 DH delivery'}
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <Shield size={16} className="text-gold/40" strokeWidth={1.5} />
                <span className="text-[10px] text-sage/40 leading-tight">Cash on delivery</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <RotateCcw size={16} className="text-gold/40" strokeWidth={1.5} />
                <span className="text-[10px] text-sage/40 leading-tight">Quality guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {related.length > 0 && (
          <div className="mt-24 pt-16 border-t border-white/[0.03]">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="text-[10px] tracking-[0.3em] uppercase text-bronze/60 block mb-2">You may also like</span>
                <h2 className="font-heading text-2xl text-ivory">Related Items</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10 stagger">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
