import React from 'react';
import Link from 'next/link';
import { ClipboardCheck, Camera, Plus } from 'lucide-react';
import { ActivityItem } from '@/services/development';

interface TeacherActivityCardProps {
  item: any;
  teacherClassInfo: any;
  onViewMoments: (item: ActivityItem) => void;
  onPostMoment: (item: ActivityItem) => void;
}

export function TeacherActivityCard({
  item,
  teacherClassInfo,
  onViewMoments,
  onPostMoment,
}: TeacherActivityCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {item.scope === 'CLASS' ? (
              <span className="rounded-md bg-purple-50 text-purple-700 px-2 py-0.5 text-[10px] font-bold border border-purple-200">
                Hoạt động của lớp
              </span>
            ) : (
              <span className="rounded-md bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-bold border border-blue-200">
                Hoạt động của trường
              </span>
            )}
            <span className="rounded-md bg-amber-50 text-amber-800 px-2 py-0.5 text-[10px] font-bold border border-amber-200">
              Lĩnh vực: {item.domainName || 'Thể chất'}
            </span>
          </div>

          <span className="rounded-xl bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-600">
            #{item.code}
          </span>
        </div>

        <h3 className="mt-3 text-base font-black text-slate-900 leading-snug">
          {item.name}
        </h3>

        <p className="mt-1.5 text-xs text-slate-500 line-clamp-3 leading-relaxed">
          {item.description || 'Chưa có mô tả chi tiết.'}
        </p>

        {item.criteria && item.criteria.length > 0 && (
          <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs text-slate-700 border border-slate-200">
            <span className="font-bold text-slate-800 block mb-1">
              Tiêu chí đánh giá ({item.criteria.length}):
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
              {item.criteria.slice(0, 2).map((c: any) => (
                <li key={c.id || c.code} className="truncate">
                  {c.name}
                </li>
              ))}
              {item.criteria.length > 2 && (
                <li className="text-slate-400">+{item.criteria.length - 2} tiêu chí khác</li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
        <Link
          href={`/teacher/assessment?activityId=${item.id}${
            teacherClassInfo?.id ? `&classId=${teacherClassInfo.id}` : ''
          }`}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white py-2 text-xs font-bold transition shadow-xs shadow-orange-600/20"
        >
          <ClipboardCheck size={14} />
          <span>Đánh giá học sinh cho hoạt động này</span>
        </Link>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onViewMoments(item)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 py-1.5 text-xs font-bold transition cursor-pointer"
          >
            <Camera size={13} />
            <span>Khoảnh khắc</span>
          </button>

          <button
            type="button"
            onClick={() => onPostMoment(item)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 py-1.5 text-xs font-bold transition cursor-pointer"
          >
            <Plus size={13} />
            <span>Đăng ảnh</span>
          </button>
        </div>
      </div>
    </div>
  );
}
