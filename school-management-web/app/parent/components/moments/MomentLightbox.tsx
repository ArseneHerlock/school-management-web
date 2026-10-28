'use client'

import React from 'react'
import { X } from 'lucide-react'
import { MediaItem } from './types'

interface MomentLightboxProps {
  item: MediaItem | null
  isOpen: boolean
  onClose: () => void
}

export const MomentLightbox: React.FC<MomentLightboxProps> = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 cursor-pointer transition"
        >
          <X size={18} />
        </button>
        <div className="max-h-[70vh] bg-black flex items-center justify-center">
          <img
            src={item.url}
            alt={item.title}
            className="max-h-[70vh] w-auto object-contain"
          />
        </div>
        <div className="p-5 bg-white">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {item.scope === 'class' ? 'Khoảnh khắc lớp' : 'Khoảnh khắc của bé'} · {item.category}
            </span>
            <span className="text-xs text-slate-400">{item.date}</span>
          </div>
          <h3 className="text-lg font-black text-slate-800 mt-2">{item.title}</h3>
          {item.description && (
            <p className="text-sm text-slate-600 mt-1">{item.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
