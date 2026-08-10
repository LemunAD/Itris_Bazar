import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="pt-20 min-h-screen pb-24 bg-near-black-green">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] text-sage/40 mb-10 tracking-wider">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <span className="text-sage/20">/</span>
          <span className="text-ivory/60">Search</span>
        </div>

        <div className="mb-12">
          <h1 className="font-heading text-3xl text-ivory mb-2">Search Results</h1>
          <p className="text-sm text-sage/50">
            {results.length} result{results.length !== 1 ? 's' : ''} for "<span className="text-gold/70">{query}</span>"
          </p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-24">
            <Search size={32} className="text-sage/15 mx-auto mb-4" strokeWidth={1} />
            <h3 className="font-heading text-xl text-ivory/60 mb-2">No matches found</h3>
            <p className="text-sm text-sage/40 mb-8">Try searching for "tapestry", "moon", or "tarot".</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 border border-white/[0.08] text-ivory/60 font-heading text-xs tracking-wider uppercase px-6 py-2.5 rounded-lg hover:border-gold/20 hover:text-gold transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10 stagger">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
