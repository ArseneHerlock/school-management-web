'use client'

import React from 'react'
import { Users, Sparkles, Calendar, Heart } from 'lucide-react'
import { MediaItem } from './types'

interface MomentCardProps {
  item: MediaItem
  onOpenLightbox: () => void
  onToggleLike: (id: string) => void
}

export const MomentCard: React.FC<MomentCardProps> = ({ item, onOpenLightbox, onToggleLike }) => {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col">
      <div
        onClick={onOpenLightbox}
        className="relative h-48 w-full bg-slate-100 cursor-pointer overflow-hidden flex items-center justify-center"
      >
        {item.url && !item.url.includes('unsplash.com') ? (
          <img
            src={item.url}
            alt={item.title}
            className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent && !parent.querySelector('.moment-fallback')) {
                const fb = document.createElement('div');
                fb.className =
                  'moment-fallback h-full w-full bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col items-center justify-center text-indigo-400';
                fb.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg><span style="font-size: 11px; font-weight: bold; margin-top: 4px; color: #4338ca">Khoảnh khắc mầm non</span>`;
                parent.appendChild(fb);
              }
            }}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center justify-center text-indigo-400">
            <Sparkles size={32} />
            <span className="text-[11px] font-bold mt-1 text-indigo-500">Khoảnh khắc mầm non</span>
          </div>
        )}

        <span
          className={`absolute top-3 left-3 flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[11px] font-extrabold text-white backdrop-blur-md ${
            item.scope === 'class' ? 'bg-indigo-900/80' : 'bg-purple-900/80'
          }`}
        >
          {item.scope === 'class' ? <Users size={12} /> : <Sparkles size={12} />}
          <span>{item.scope === 'class' ? 'Lớp học' : 'Của bé'}</span>
        </span>

        <span className="absolute top-3 right-3 rounded-xl bg-white/95 backdrop-blur-md px-2.5 py-1 text-[10px] font-extrabold text-slate-800 shadow-sm">
          {item.category}
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-black text-sm text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {item.title}
          </h4>
          {item.description && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar size={13} />
            {item.date}
          </span>

          <button
            type="button"
            onClick={() => onToggleLike(item.id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              item.isLiked ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Heart size={14} className={item.isLiked ? 'fill-rose-600 text-rose-600' : ''} />
            <span>{item.likes}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
