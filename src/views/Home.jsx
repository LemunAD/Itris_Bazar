import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Sparkles, Moon } from 'lucide-react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const featured = products.filter((p) => p.featured);

  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-near-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(62,93,26,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(152,132,45,0.06),transparent)]" />
        
        {/* Decorative floating elements */}
        <div className="absolute top-1/3 left-[10%] w-px h-32 bg-gradient-to-b from-transparent via-gold/10 to-transparent animate-float" />
        <div className="absolute top-1/4 right-[15%] w-px h-24 bg-gradient-to-b from-transparent via-gold/10 to-transparent animate-float" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-5 text-center pt-20">
          {/* Ornamental divider top */}
          <div className="divider-ornament text-bronze/40 mb-8 animate-fade-in" style={{ animationDelay: '200ms', opacity: 0, animationFillMode: 'forwards' }}>
            <Sparkles size={12} />
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl text-ivory leading-[1.1] mb-6 animate-fade-in-up" style={{ opacity: 0, animationDelay: '300ms', animationFillMode: 'forwards' }}>
            Make Your Space<br />
            <span className="text-gradient-gold">Shine Bright</span>
          </h1>

          <p className="text-sage/70 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10 font-light animate-fade-in-up" style={{ opacity: 0, animationDelay: '500ms', animationFillMode: 'forwards' }}>
            Unique, alternative home décor — celestial wall tapestries and hand-illustrated tarot decks, curated to shift the vibe and make your home shine.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12 animate-fade-in-up" style={{ opacity: 0, animationDelay: '700ms', animationFillMode: 'forwards' }}>
            <Link
              to="/shop"
              className="group bg-gold text-ink font-heading text-xs tracking-[0.2em] uppercase py-3.5 px-8 rounded-lg hover:bg-pale-gold hover:shadow-gold transition-all duration-400 flex items-center gap-2.5"
            >
              Shop Collection
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#collections"
              className="border border-white/[0.08] text-ivory/70 font-heading text-xs tracking-[0.2em] uppercase py-3.5 px-8 rounded-lg hover:border-gold/20 hover:text-gold transition-all duration-400"
            >
              Explore
            </a>
          </div>

          {/* Shipping note */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-sage/40 animate-fade-in" style={{ opacity: 0, animationDelay: '900ms', animationFillMode: 'forwards' }}>
            <Truck size={13} strokeWidth={1.5} className="text-gold/40" />
            Free shipping on orders above 300 DH
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-near-black-green to-transparent" />
      </section>


      {/* ═══════════════════════════════════════════
          COLLECTIONS SECTION
          ═══════════════════════════════════════════ */}
      <section id="collections" className="py-24 px-5 lg:px-8 bg-near-black-green scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          {/* Section heading */}
          <div className="text-center max-w-md mx-auto mb-16">
            <span className="text-[10px] tracking-[0.3em] uppercase text-bronze/60 block mb-3">Collections</span>
            <h2 className="font-heading text-3xl text-ivory mb-4">Browse By Category</h2>
            <div className="divider-ornament text-bronze/30">
              <Moon size={10} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {categories.map((cat) => {
              // Pick the first product from this category to get an image
              const previewProduct = products.find((p) => p.category === cat.id);
              return (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.slug}`}
                  className="group relative h-72 sm:h-80 rounded-xl overflow-hidden border border-white/[0.04] hover:border-gold/10 transition-colors duration-400"
                >
                  {/* Background image */}
                  {previewProduct && (
                    <img
                      src={previewProduct.images[0]}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover brightness-[0.4] group-hover:brightness-[0.35] group-hover:scale-[1.03] transition-all duration-700"
                    />
                  )}
                  {!previewProduct && (
                    <div className="absolute inset-0 img-placeholder" />
                  )}
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-near-black via-near-black/50 to-transparent" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="text-[9px] tracking-[0.3em] uppercase text-gold/60 block mb-2">
                      {products.filter((p) => p.category === cat.id).length} items
                    </span>
                    <h3 className="font-heading text-2xl text-ivory group-hover:text-gold transition-colors duration-300 mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-sage/50 max-w-sm leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-gold/60 text-[10px] tracking-wider uppercase group-hover:text-gold transition-colors">
                      Browse collection <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          FEATURED PRODUCTS
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-5 lg:px-8 bg-deep-green border-t border-white/[0.03]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-14">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-bronze/60 block mb-2">Curated</span>
              <h2 className="font-heading text-3xl text-ivory">Featured Items</h2>
            </div>
            <Link
              to="/shop"
              className="group flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase text-sage/50 hover:text-gold transition-colors"
            >
              View all
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10 stagger">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          ALL PRODUCTS STRIP
          ═══════════════════════════════════════════ */}
      <section className="py-24 px-5 lg:px-8 bg-near-black-green border-t border-white/[0.03]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-md mx-auto mb-14">
            <span className="text-[10px] tracking-[0.3em] uppercase text-bronze/60 block mb-2">Full Catalog</span>
            <h2 className="font-heading text-3xl text-ivory mb-4">All Products</h2>
            <div className="divider-ornament text-bronze/30">
              <Sparkles size={10} />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10 stagger">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════
          TRUST SIGNALS
          ═══════════════════════════════════════════ */}
      <section className="py-16 px-5 lg:px-8 bg-deep-green border-t border-white/[0.03]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gold/10 flex items-center justify-center">
              <Truck size={18} className="text-gold/60" strokeWidth={1.5} />
            </div>
            <h4 className="font-heading text-sm text-ivory/90">Local Delivery</h4>
            <p className="text-[11px] text-sage/40 leading-relaxed max-w-[200px]">
              35 DH flat rate. Free shipping on orders over 300 DH.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gold/10 flex items-center justify-center">
              <Shield size={18} className="text-gold/60" strokeWidth={1.5} />
            </div>
            <h4 className="font-heading text-sm text-ivory/90">Cash on Delivery</h4>
            <p className="text-[11px] text-sage/40 leading-relaxed max-w-[200px]">
              Pay safely at your doorstep. No online payment required.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gold/10 flex items-center justify-center">
              <Sparkles size={18} className="text-gold/60" strokeWidth={1.5} />
            </div>
            <h4 className="font-heading text-sm text-ivory/90">Unique Collections</h4>
            <p className="text-[11px] text-sage/40 leading-relaxed max-w-[200px]">
              Hand-selected alternative & celestial items unavailable in mainstream stores.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
