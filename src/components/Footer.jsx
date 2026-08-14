import React from 'react';
import { Link } from 'react-router-dom';

function InstagramIcon({ size = 15, strokeWidth = 1.5 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-near-black border-t border-white/[0.04] text-sage/70">

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <img src="/logos/itris_logo_white.png" alt="Itris" className="h-10 w-auto opacity-60" />
            <span className="font-heading text-base tracking-[0.2em] text-ivory/80 uppercase">Itris Bazaar</span>
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
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-6 flex flex-col items-center gap-4 text-[11px] text-sage/40">
          <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
            <p>&copy; {new Date().getFullYear()} Itris Bazaar. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/itrisbazaar/" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" aria-label="Instagram">
                <InstagramIcon size={15} strokeWidth={1.5} />
              </a>
              <span>Based in Morocco ✦</span>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-sage/30">made with love and care by LemunAD</p>
        </div>
      </div>
    </footer>
  );
}
