import React from 'react';
import { Loader2, Inbox, Plus, Video, Image as ImageIcon, User, School, Eye } from 'lucide-react';
import { ActivityItem } from '@/services/development';
import { ActivityMomentItem } from './useActivityMoments';

interface ActivityMomentsGridProps {
  loading: boolean;
  filteredMoments: ActivityMomentItem[];
  activity: ActivityItem;
  onOpenPostMoment: (act: ActivityItem) => void;
  onOpenLightbox: (idx: number) => void;
}

export function ActivityMomentsGrid({
  loading,
  filteredMoments,
  activity,
  onOpenPostMoment,
  onOpenLightbox,
}: ActivityMomentsGridProps) {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={36} />
      </div>
    );
  }

  if (filteredMoments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-orange-500 mb-3 border border-orange-100">
          <Inbox size={32} />
        </div>
        <h4 className="text-base font-black text-slate-800">
          Chưa có khoảnh khắc nào cho hoạt động này
        </h4>
        <p className="mt-1 text-xs text-slate-400 max-w-sm">
          Hãy là người đầu tiên đăng tải những bức ảnh hoặc video kỷ niệm đáng yêu của các con trong hoạt động này!
        </p>
        <button
          type="button"
          onClick={() => onOpenPostMoment(activity)}
          className="mt-4 flex items-center gap-2 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 text-xs font-black shadow-md shadow-orange-500/20 transition cursor-pointer"
        >
          <Plus size={15} />
          <span>Đăng khoảnh khắc cho hoạt động này</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {filteredMoments.map((item, idx) => (
        <div
          key={item.id}
          onClick={() => onOpenLightbox(idx)}
          className="group relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:shadow-lg transition-all cursor-pointer aspect-square flex flex-col justify-between"
        >
          {item.type === 'video' ? (
            <div className="h-full w-full bg-slate-900 flex flex-col items-center justify-center text-white p-2">
              <div className="h-10 w-10 rounded-full bg-orange-500/80 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                <Video size={20} className="text-white ml-0.5" />
              </div>
              <span className="text-[9px] font-bold mt-1 text-slate-300">Video</span>
            </div>
          ) : item.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.url}
              alt={item.title}
              className="h-full w-full object-cover group-hover:scale-108 transition-transform duration-300"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-orange-50 to-amber-100 flex flex-col items-center justify-center text-orange-500">
              <ImageIcon size={28} />
              <span className="text-[9px] font-bold mt-1">Ảnh khoảnh khắc</span>
            </div>
          )}

          <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none gap-1">
            {item.scope === 'child' ? (
              <span className="rounded-lg bg-amber-500/90 backdrop-blur-md px-2 py-0.5 text-[9px] font-black text-white shadow-xs flex items-center gap-0.5">
                <User size={10} /> {item.childName || 'Bé'}
              </span>
            ) : (
              <span className="rounded-lg bg-sky-600/90 backdrop-blur-md px-2 py-0.5 text-[9px] font-black text-white shadow-xs flex items-center gap-0.5">
                <School size={10} /> Cả lớp
              </span>
            )}

            <span className="rounded-lg bg-black/55 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-bold text-white">
              {item.date}
            </span>
          </div>

          <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="flex items-center gap-1 bg-white/95 text-slate-800 px-3 py-1 rounded-xl text-[11px] font-black shadow-md">
              <Eye size={12} className="text-orange-500" /> Xem to
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
