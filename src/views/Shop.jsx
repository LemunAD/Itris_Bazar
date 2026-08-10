import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Moon } from 'lucide-react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');

  const filtered = useMemo(() => {
    if (!activeCategory) return products;
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const activeCatObj = categories.find((c) => c.slug === activeCategory);

  return (
    <div className="pt-20 min-h-screen pb-24 bg-near-black-green">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] text-sage/40 mb-10 tracking-wider">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span className="text-sage/20">/</span>
          <span className="text-ivory/60">Shop</span>
          {activeCatObj && (
            <>
              <span className="text-sage/20">/</span>
              <span className="text-gold/70">{activeCatObj.name}</span>
            </>
          )}
        </div>

        {/* Page Header */}
        <div className="mb-12">
          <h1 className="font-heading text-3xl sm:text-4xl text-ivory mb-3">
            {activeCatObj ? activeCatObj.name : 'All Products'}
          </h1>
          <p className="text-sm text-sage/50 max-w-md">
            {activeCatObj
              ? activeCatObj.description
              : 'Browse our complete catalog of unique, vibe-shifting home décor.'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-12 pb-6 border-b border-white/[0.04]">
          <button
            onClick={() => setSearchParams({})}
            className={`text-[11px] tracking-[0.15em] uppercase py-2 px-5 rounded-md transition-all duration-300 ${
              !activeCategory
                ? 'bg-gold/10 text-gold border border-gold/20'
                : 'text-sage/50 border border-white/[0.04] hover:border-white/[0.08] hover:text-ivory/70'
            }`}
          >
            All ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSearchParams({ category: cat.slug })}
                className={`text-[11px] tracking-[0.15em] uppercase py-2 px-5 rounded-md transition-all duration-300 ${
                  activeCategory === cat.slug
                    ? 'bg-gold/10 text-gold border border-gold/20'
                    : 'text-sage/50 border border-white/[0.04] hover:border-white/[0.08] hover:text-ivory/70'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <Moon size={32} className="text-sage/20 mx-auto mb-4" />
            <h3 className="font-heading text-xl text-ivory/70 mb-2">No products found</h3>
            <p className="text-sm text-sage/40">This collection is being restocked. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10 stagger">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
