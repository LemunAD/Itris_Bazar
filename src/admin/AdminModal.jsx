import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable admin modal overlay.
 * Props: isOpen, onClose, title, children, maxWidth (optional, default 'max-w-lg')
 */
export default function AdminModal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-near-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative ${maxWidth} w-full bg-forest-mid border border-white/10 rounded-xl shadow-2xl animate-fade-in-up max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="font-heading text-base text-ivory uppercase tracking-wider">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-sage/50 hover:text-ivory transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
