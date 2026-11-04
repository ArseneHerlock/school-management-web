'use client';

import React from 'react';
import { Camera, Users, Sparkles, Loader2, Inbox, Eye } from 'lucide-react';
import { MediaItem } from '../moments/types';

interface ActivityMomentsSectionProps {
  activityMoments: MediaItem[];
  classActivityMoments: MediaItem[];
  childActivityMoments: MediaItem[];
  displayedMoments: MediaItem[];
  loadingMoments: boolean;
  momentScopeFilter: 'ALL' | 'class' | 'child';
  setMomentScopeFilter: (filter: 'ALL' | 'class' | 'child') => void;
  onPreviewMoment: (m: MediaItem) => void;
  childName?: string;
}

export function ActivityMomentsSection({
  activityMoments,
  classActivityMoments,
  childActivityMoments,
  displayedMoments,
  loadingMoments,
  momentScopeFilter,
  setMomentScopeFilter,
  onPreviewMoment,
  childName,
}: ActivityMomentsSectionProps) {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/30 p-4 space-y-3 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100/80 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Camera size={14} />
          </span>
          <div>
            <h4 className="text-xs font-black text-slate-800">
              Khoảnh khắc tại hoạt động này ({activityMoments.length})
            </h4>
            <p className="text-[10px] text-slate-500">
              Xem trực tiếp hình ảnh/video của lớp và của bé {childName} trong hoạt động
            </p>
          </div>
        </div>

        {/* Bộ lọc nhanh Tất cả / Của lớp / Của bé ngay trong modal */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-0.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMomentScopeFilter('ALL')}
            className={`rounded-lg px-2.5 py-1 text-[10px] font-black transition cursor-pointer ${
              momentScopeFilter === 'ALL'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả ({activityMoments.length})
          </button>
          <button
            type="button"
            onClick={() => setMomentScopeFilter('class')}
            className={`rounded-lg px-2.5 py-1 text-[10px] font-black transition cursor-pointer flex items-center gap-1 ${
              momentScopeFilter === 'class'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users size={11} /> Của lớp ({classActivityMoments.length})
          </button>
          <button
            type="button"
            onClick={() => setMomentScopeFilter('child')}
            className={`rounded-lg px-2.5 py-1 text-[10px] font-black transition cursor-pointer flex items-center gap-1 ${
              momentScopeFilter === 'child'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles size={11} /> Của bé ({childActivityMoments.length})
          </button>
        </div>
      </div>

      {loadingMoments ? (
        <div className="flex items-center justify-center gap-2 py-8 text-xs text-slate-400">
          <Loader2 size={18} className="animate-spin text-indigo-500" />
          <span>Đang tải khoảnh khắc hoạt động...</span>
        </div>
      ) : displayedMoments.length === 0 ? (
        <div className="rounded-xl bg-white/90 p-5 text-center border border-dashed border-slate-200">
          <Inbox size={24} className="mx-auto text-slate-300 mb-1" />
          <p className="text-xs font-bold text-slate-600">
            {momentScopeFilter === 'class'
              ? 'Chưa có khoảnh khắc tập thể lớp nào cho hoạt động này.'
              : momentScopeFilter === 'child'
              ? `Chưa có khoảnh khắc riêng nào của bé ${childName} trong hoạt động này.`
              : 'Chưa có hình ảnh hoặc video khoảnh khắc cho hoạt động này.'}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Khi cô giáo đăng tải hình ảnh/video từ hoạt động này, ảnh sẽ hiển thị trực tiếp tại đây.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
          {displayedMoments.map((m) => (
            <div
              key={m.id}
              onClick={() => onPreviewMoment(m)}
              className="group relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:shadow-md transition cursor-pointer flex flex-col"
            >
              <div className="relative h-28 w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                {m.url ? (
                  <img
                    src={m.url}
                    alt={m.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <Sparkles size={22} className="text-indigo-400" />
                )}
                <span
                  className={`absolute top-1.5 left-1.5 flex items-center gap-1 rounded-lg px-2 py-0.5 text-[9px] font-black text-white backdrop-blur-md ${
                    m.scope === 'class' ? 'bg-indigo-900/80' : 'bg-purple-900/80'
                  }`}
                >
                  {m.scope === 'class' ? 'Của lớp' : 'Của bé'}
                </span>
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[11px] font-bold gap-1">
                  <Eye size={13} /> Xem to
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-[11px] font-extrabold text-slate-800 line-clamp-1">{m.title}</p>
                {m.description && (
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{m.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
