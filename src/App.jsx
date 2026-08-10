import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Storefront Components
import Header from './components/Header';
import Footer from './components/Footer';

// Storefront Views
import Home from './views/Home';
import Shop from './views/Shop';
import ProductDetail from './views/ProductDetail';
import Cart from './views/Cart';
import Checkout from './views/Checkout';
import SearchResults from './views/SearchResults';

// Admin Views
import AdminLayout from './admin/Layout';
import AdminLogin from './admin/Login';
import AdminDashboard from './admin/Dashboard';

// Storefront Layout Wrapper
function StorefrontLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            
            {/* Storefront Routes */}
            <Route element={<StorefrontLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/search" element={<SearchResults />} />
            </Route>

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Console */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              {/* Fallback to Dashboard for undefined admin paths in Phase 1 */}
              <Route path="products" element={<AdminDashboard />} />
              <Route path="categories" element={<AdminDashboard />} />
              <Route path="orders" element={<AdminDashboard />} />
            </Route>

            {/* Global Fallback Route */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center text-center px-6">
                  <div>
                    <h2 className="font-heading text-4xl text-gold mb-4">404</h2>
                    <p className="text-sage mb-8">The page you are looking for does not exist.</p>
                    <a href="/" className="bg-gold text-ink font-heading px-6 py-3 rounded-md hover:bg-pale-gold transition-colors inline-block">
                      Return to Home
                    </a>
                  </div>
                </div>
              }
            />

          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
