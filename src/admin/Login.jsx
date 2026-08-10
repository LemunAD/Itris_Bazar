import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Moon, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-near-black-green via-deep-green to-near-black-green p-6">
      
      <div className="w-full max-w-sm bg-forest-mid border border-white/10 p-8 rounded-xl shadow-2xl animate-fade-in-up">
        
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <img src="/logos/itris_logo.png" alt="Itris Bazar" className="h-14 w-auto mb-4" />
          <h1 className="font-heading text-2xl text-ivory">Itris Bazar</h1>
          <p className="text-xs text-sage mt-1">Boutique management portal</p>
        </div>

        {/* Display Validation Error */}
        {error && (
          <div className="bg-ember/10 border border-ember/30 text-ember text-xs p-3 rounded-md mb-6 leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
          
          <div>
            <label htmlFor="email" className="block text-[10px] text-sage uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-deep-green/60 border border-white/10 focus:border-gold rounded px-4 py-2.5 text-sm text-ivory placeholder-sage/30 outline-none"
              placeholder="admin@itris.ma"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[10px] text-sage uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-deep-green/60 border border-white/10 focus:border-gold rounded px-4 py-2.5 text-sm text-ivory placeholder-sage/30 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-gold text-ink font-heading text-sm py-3 px-6 rounded-md hover:bg-pale-gold hover:shadow-gold transition-all duration-300 w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {submitting ? 'Signing in…' : 'Authenticate Portal'}
            {!submitting && <ArrowRight size={16} />}
          </button>

        </form>

        <div className="mt-8 border-t border-white/5 pt-6 text-center">
          <Link to="/" className="text-xs text-sage hover:text-gold transition-colors">
            ← Return to storefront
          </Link>
        </div>

      </div>

    </div>
  );
}
