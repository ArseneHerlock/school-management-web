import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  subtitle?: string;
  isOpen?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

const maxWidthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
};

export default function Modal({
  title,
  subtitle,
  isOpen = true,
  onClose,
  children,
  maxWidth = 'xl',
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog box */}
      <div
        className={`relative w-full ${maxWidthMap[maxWidth]} overflow-hidden rounded-3xl border border-rose-100/80 bg-white shadow-2xl transition-all duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-100/60 bg-gradient-to-r from-rose-50/70 to-amber-50/30 px-6 py-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-slate-400 hover:bg-white hover:text-slate-600 shadow-xs transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(85vh-80px)] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
