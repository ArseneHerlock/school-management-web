'use client';

import React from 'react';
import { MomentItem } from '../types';

interface LightboxModalProps {
  moment: MomentItem | null;
  onClose: () => void;
  onToggleLike: (id: string) => void;
}

export default function LightboxModal({
  moment,
  onClose,
  onToggleLike,
}: LightboxModalProps) {
  if (!moment) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[80] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          
        </button>

        <div className="aspect-video bg-black flex items-center justify-center overflow-hidden">
          <img
            src={moment.imageUrl}
            alt={moment.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              moment.category === 'child' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {moment.categoryLabel}
            </span>
            <span className="text-xs text-slate-400">{moment.date}</span>
          </div>
          <h3 className="text-base font-extrabold text-slate-800">{moment.title}</h3>
          <p className="text-xs text-slate-500 mt-1">Dữ liệu media của lớp</p>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onToggleLike(moment.id)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <span>{moment.liked ? ' Đã thích' : ' Thích khoảnh khắc'}</span>
              <span>({moment.likes})</span>
            </button>
            <button
              onClick={onClose}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
