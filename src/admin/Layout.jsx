import React from 'react';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, FolderOpen, ArrowUpRight, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


export default function Layout() {
  const { admin, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Route protection: redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navLinks = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: ShoppingBag },
    { path: '/admin/categories', label: 'Categories', icon: FolderOpen },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingBag } // Reuse same icon for simplicity
  ];

  return (
    <div className="min-h-screen flex bg-deep-green text-ivory">
      
      {/* ════════════════ SIDEBAR ════════════════ */}
      <aside className="w-64 bg-near-black-green border-r border-white/5 flex flex-col fixed inset-y-0 left-0 z-40">
        
        {/* Brand Header */}
        <div className="h-20 border-b border-white/5 px-6 flex items-center gap-3">
          <img src="/logos/itris_logo.png" alt="Itris" className="h-8 w-auto" />
          <div>
            <h2 className="font-heading text-sm text-ivory tracking-widest uppercase">Itris Bazar</h2>
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
        <div className="border-t border-white/5 p-4 bg-near-black-green/60">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-olive-glow flex items-center justify-center font-heading text-gold font-bold">
                {admin?.username ? admin.username[0].toUpperCase() : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-ivory font-medium truncate">{admin?.username || 'Admin'}</p>
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

      </aside>


      {/* ════════════════ MAIN CONTENT AREA ════════════════ */}
      <div className="flex-1 pl-64 flex flex-col">
        
        {/* Topbar */}
        <header className="h-20 bg-near-black-green border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-30">
          <h1 className="font-heading text-lg text-ivory">
            {location.pathname === '/admin' ? 'Dashboard Summary' : 'Management Console'}
          </h1>

          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-1.5 border border-white/10 hover:border-gold/30 text-sage hover:text-gold px-4 py-1.5 rounded text-xs transition-colors"
          >
            Visit Storefront
            <ArrowUpRight size={14} />
          </Link>
        </header>

        {/* Dashboard inner panels */}
        <main className="p-8 flex-1">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
