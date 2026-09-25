'use client';

import React, { useState } from 'react';
import { MomentItem } from '../types';

interface MomentsTabProps {
  moments: MomentItem[];
  onSelectMoment: (moment: MomentItem) => void;
  onToggleLike: (id: string) => void;
}

export default function MomentsTab({ moments, onSelectMoment }: MomentsTabProps) {
  const [filter, setFilter] = useState<'all' | 'child' | 'class'>('all');

  const childCount = moments.filter((m) => m.category === 'child').length;
  const classCount = moments.filter((m) => m.category === 'class').length;

  const filteredMoments = moments.filter((m) => {
    if (filter === 'child') return m.category === 'child';
    if (filter === 'class') return m.category === 'class';
    return true;
  });

  return (
    <section className="space-y-5">
      {/* Title & Filter Tabs */}
      <div className="card-frame p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-800">Khoảnh Khắc Lớp Học</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Hình ảnh hoạt động sinh hoạt, vui chơi, học tập được cô giáo ghi lại mỗi ngày
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full self-start sm:self-auto">
            Lớp Chồi 2 · Năm học 2026-2027
          </span>
        </div>

        {/* Lọc ra khoảnh khắc của con và của tập thể lớp */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-3 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            Tất cả ({moments.length})
          </button>
          <button
            onClick={() => setFilter('child')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              filter === 'child'
                ? 'bg-sky-500 text-white shadow-xs font-bold'
                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            <span>👦 Khoảnh khắc của con (Bảo Minh)</span>
            <span className={`text-xs px-2 py-0.2 rounded-full font-bold ${
              filter === 'child' ? 'bg-white text-sky-600' : 'bg-sky-100 text-sky-700'
            }`}>
              {childCount}
            </span>
          </button>
          <button
            onClick={() => setFilter('class')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              filter === 'class'
                ? 'bg-sky-500 text-white shadow-xs font-bold'
                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            <span>🏫 Tập thể lớp Chồi 2</span>
            <span className={`text-xs px-2 py-0.2 rounded-full font-bold ${
              filter === 'class' ? 'bg-white text-emerald-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {classCount}
            </span>
          </button>
        </div>
      </div>

      {/* Photos Grid with Level 4-5 Borders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMoments.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectMoment(item)}
            className="group card-frame overflow-hidden cursor-pointer"
          >
            <div className="relative aspect-4/3 overflow-hidden bg-slate-100 border-b border-slate-200">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span
                className={`absolute top-2.5 left-2.5 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs ${
                  item.category === 'child' ? 'bg-sky-600/90' : 'bg-emerald-600/90'
                }`}
              >
                {item.categoryLabel}
              </span>
            </div>
            <div className="p-3.5">
              <h4 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-sky-600 transition-colors">
                {item.title}
              </h4>
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mt-2">
                <span>{item.date}</span>
                <span className="flex items-center gap-1 text-rose-500 font-bold">
                  {item.liked ? '❤️' : '🤍'} {item.likes}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
