import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-near-black border-t border-white/[0.04] text-sage/70">
      
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Brand */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <img src="/logos/itris_logo_white.png" alt="Itris" className="h-10 w-auto opacity-60" />
            <span className="font-heading text-base tracking-[0.2em] text-ivory/80 uppercase">Itris Bazar</span>
          </Link>
          <p className="text-xs leading-relaxed max-w-xs">
            Curated alternative home décor from Morocco. Celestial wall tapestries, tarot decks, and unique pieces to make your space shine.
          </p>
        </div>

        {/* Shop Links */}
        <div>
          <h4 className="font-heading text-[11px] tracking-[0.25em] uppercase text-gold/80 mb-5">Shop</h4>
          <nav className="flex flex-col gap-2.5 text-sm">
            <Link to="/shop" className="hover:text-ivory transition-colors">All Products</Link>
            <Link to="/shop?category=wall-tapestry" className="hover:text-ivory transition-colors">Wall Tapestries</Link>
            <Link to="/shop?category=tarot-cards" className="hover:text-ivory transition-colors">Tarot Cards</Link>
          </nav>
        </div>

        {/* Help */}
        <div>
          <h4 className="font-heading text-[11px] tracking-[0.25em] uppercase text-gold/80 mb-5">Info</h4>
          <nav className="flex flex-col gap-2.5 text-sm">
            <Link to="/cart" className="hover:text-ivory transition-colors">Shopping Cart</Link>
            <span className="cursor-default">Shipping Policy</span>
            <span className="cursor-default">Contact Us</span>
          </nav>
        </div>

        {/* Delivery Info */}
        <div>
          <h4 className="font-heading text-[11px] tracking-[0.25em] uppercase text-gold/80 mb-5">Delivery</h4>
          <div className="text-sm flex flex-col gap-2">
            <p>
              <span className="text-ivory/80">Standard:</span> 35.00 DH
            </p>
            <p>
              <span className="text-ivory/80">Free delivery:</span> Orders above 300 DH
            </p>
            <p>
              <span className="text-ivory/80">Payment:</span> Cash on Delivery
            </p>
            <p className="text-[10px] text-sage/40 mt-2 uppercase tracking-wider">Morocco only</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-sage/40">
          <p>&copy; {new Date().getFullYear()} Itris Bazar. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gold transition-colors" aria-label="Website">
              <Globe size={15} strokeWidth={1.5} />
            </a>
            <a href="#" className="hover:text-gold transition-colors" aria-label="Email">
              <Mail size={15} strokeWidth={1.5} />
            </a>
            <span>Handcrafted in Morocco ✦</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
