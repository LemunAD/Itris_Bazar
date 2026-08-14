import React, { useState, useEffect } from 'react';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, FolderOpen, ArrowUpRight, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


export default function Layout() {
  const { admin, logout, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Prevent background scrolling when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  // Show nothing while checking session (prevents flash redirect)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-green">
        <div className="animate-spin w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full" />
      </div>
    );
  }

  // Route protection: redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navLinks = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: ShoppingBag },
    { path: '/admin/categories', label: 'Categories', icon: FolderOpen },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingBag } // Reuse same icon for simplicity
  ];

  const pageTitle = location.pathname === '/admin' ? 'Dashboard Summary' : 'Management Console';

  // Shared sidebar content (used in both mobile drawer and desktop fixed sidebar)
  const sidebarContent = (
    <>
      {/* Brand Header */}
      <div className="h-20 border-b border-white/5 px-6 flex items-center gap-3 flex-shrink-0">
        <img src="/logos/itris_logo.png" alt="Itris" className="h-8 w-auto" />
        <div>
          <h2 className="font-heading text-sm text-ivory tracking-widest uppercase">Itris Bazaar</h2>
          <p className="text-[10px] text-sage font-body uppercase tracking-wider">Admin Panel</p>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 py-8 px-4 flex flex-col gap-1">
        <span className="text-[10px] text-bronze uppercase tracking-widest px-3 mb-2 font-heading">Navigation</span>
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-heading tracking-wide transition-all ${
                isActive
                  ? 'bg-gold/5 text-gold border-l-2 border-gold pl-3'
                  : 'text-sage hover:text-ivory hover:bg-white/5'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-gold' : 'text-sage/75'} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* User Card & Logout */}
      <div className="border-t border-white/5 p-4 bg-near-black-green/60 flex-shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-olive-glow flex items-center justify-center font-heading text-gold font-bold">
              {admin?.email ? admin.email[0].toUpperCase() : 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-ivory font-medium truncate">{admin?.email || 'Admin'}</p>
              <p className="text-[10px] text-sage/60 font-body">Session active</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-sage hover:text-ember transition-colors"
            title="Logout session"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-deep-green text-ivory">
      
      {/* ════════════════ DESKTOP SIDEBAR (lg+) ════════════════ */}
      <aside className="hidden lg:flex w-64 bg-near-black-green border-r border-white/5 flex-col fixed inset-y-0 left-0 z-40">
        {sidebarContent}
      </aside>

      {/* ════════════════ MOBILE SIDEBAR DRAWER (< lg) ════════════════ */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <aside className="absolute top-0 left-0 w-72 h-full bg-near-black-green border-r border-white/5 flex flex-col animate-slide-in-left shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-6 right-4 p-1.5 text-sage/50 hover:text-ivory transition-colors z-10"
            >
              <X size={18} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}


      {/* ════════════════ MAIN CONTENT AREA ════════════════ */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Topbar */}
        <header className="h-16 lg:h-20 bg-near-black-green border-b border-white/5 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-sage/70 hover:text-gold transition-colors lg:hidden -ml-1"
              aria-label="Open menu"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
            <h1 className="font-heading text-base lg:text-lg text-ivory truncate">
              {pageTitle}
            </h1>
          </div>

          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-1.5 border border-white/10 hover:border-gold/30 text-sage hover:text-gold px-3 lg:px-4 py-1.5 rounded text-xs transition-colors flex-shrink-0"
          >
            <span className="hidden sm:inline">Visit Storefront</span>
            <span className="sm:hidden">Store</span>
            <ArrowUpRight size={14} />
          </Link>
        </header>

        {/* Dashboard inner panels */}
        <main className="p-4 lg:p-8 flex-1">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
