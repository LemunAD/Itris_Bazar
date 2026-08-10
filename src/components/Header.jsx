import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { getCartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Track scroll for header background shift
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/shop?category=wall-tapestry', label: 'Tapestries' },
    { to: '/shop?category=tarot-cards', label: 'Tarot' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname + location.search === path || location.pathname.startsWith(path.split('?')[0]) && path !== '/';
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          scrolled
            ? 'h-16 glass-dark border-b border-gold/[0.06]'
            : 'h-20 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-5 lg:px-8 flex items-center justify-between">

          {/* ── LEFT: Logo ── */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <img
              src="/logos/itris_logo_white.png"
              alt="Itris Bazar"
              className="h-[46px] w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-heading text-base tracking-[0.2em] text-ivory uppercase hidden sm:inline-block transition-colors group-hover:text-gold mt-1">
              Itris Bazar
            </span>
          </Link>

          {/* ── CENTER: Nav Links (desktop) ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-[13px] tracking-[0.15em] uppercase transition-colors duration-300 ${
                  isActive(link.to)
                    ? 'text-gold'
                    : 'text-sage/80 hover:text-ivory'
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[1.5px] bg-gold rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* ── RIGHT: Actions ── */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 text-sage/70 hover:text-gold transition-colors"
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2.5 text-sage/70 hover:text-gold transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {getCartCount() > 0 && (
                <span className="absolute top-1 right-0.5 min-w-[16px] h-4 flex items-center justify-center bg-gold text-ink text-[9px] font-bold rounded-full px-1 leading-none">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2.5 text-sage/70 hover:text-gold transition-colors lg:hidden ml-1"
              aria-label="Menu"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* ── Search Dropdown ── */}
        {searchOpen && (
          <div className="absolute top-full left-0 right-0 glass-dark border-b border-gold/[0.06] py-4 px-5 animate-fade-in">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search the collection…"
                autoFocus
                className="flex-1 bg-deep-green/50 border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-ivory placeholder-sage/40 focus:outline-none focus:border-gold/30 transition-colors"
              />
              <button
                type="submit"
                className="bg-gold/10 border border-gold/20 text-gold font-heading text-xs tracking-wider uppercase px-5 py-2.5 rounded-lg hover:bg-gold/20 transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-sage/50 hover:text-ivory transition-colors"
              >
                <X size={18} />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer panel */}
          <div className="absolute top-0 right-0 w-72 h-full bg-near-black border-l border-gold/[0.06] flex flex-col animate-slide-in-right">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
              <span className="font-heading text-sm tracking-[0.2em] text-gold uppercase">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-sage/50 hover:text-ivory transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-6 px-5 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`py-3 px-3 text-sm tracking-[0.12em] uppercase rounded-md transition-colors ${
                    isActive(link.to)
                      ? 'text-gold bg-gold/[0.06]'
                      : 'text-sage/70 hover:text-ivory hover:bg-white/[0.03]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Cart link */}
            <div className="p-5 border-t border-white/[0.04]">
              <Link
                to="/cart"
                className="flex items-center justify-between py-3 px-3 text-sm tracking-[0.12em] uppercase text-sage/70 hover:text-gold rounded-md hover:bg-gold/[0.04] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ShoppingBag size={16} strokeWidth={1.5} />
                  Cart
                </span>
                {getCartCount() > 0 && (
                  <span className="bg-gold text-ink text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
