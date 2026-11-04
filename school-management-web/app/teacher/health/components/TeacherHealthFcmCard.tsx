import React from 'react';
import { ArrowRight } from 'lucide-react';
import Avatar from '../../components/Avatar';
import { Child } from '../../data';
import { WhoAssessmentResult } from './whoStandards';

interface TeacherHealthFcmCardProps {
  child: Child;
  assessment: WhoAssessmentResult;
  onSelectChildToInspect?: (child: Child) => void;
}

export function TeacherHealthFcmCard({
  child,
  assessment,
  onSelectChildToInspect,
}: TeacherHealthFcmCardProps) {
  return (
    <div
      onClick={() => onSelectChildToInspect?.(child)}
      className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-orange-300 hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Avatar initials={child.avatar} id={child.id} size="sm" />
            <div>
              <p className="font-black text-slate-800 text-xs">{child.name}</p>
              <p className="text-[10px] text-slate-400">
                {child.gender === 'F' ? '♀ Bé gái' : '♂ Bé trai'} · {assessment.ageMonths} tháng
              </p>
            </div>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              assessment.canCanThiep
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {assessment.trangThaiTongThe}
          </span>
        </div>

        {/* 3 chỉ số Z-score */}
        <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-slate-100 text-center">
          <div className="bg-slate-50 rounded-xl p-1.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase">HAZ</span>
            <p className={`text-xs font-black ${assessment.haz.isAlert ? 'text-blue-700' : 'text-slate-700'}`}>
              {assessment.haz.zScore > 0 ? `+${assessment.haz.zScore}` : assessment.haz.zScore}
            </p>
            <p className="text-[9px] text-slate-500 truncate">
              {assessment.haz.code === 'BINH_THUONG' ? 'Đạt chuẩn WHO' : assessment.haz.label}
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-1.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase">WAZ</span>
            <p className={`text-xs font-black ${assessment.waz.isAlert ? 'text-amber-700' : 'text-slate-700'}`}>
              {assessment.waz.zScore > 0 ? `+${assessment.waz.zScore}` : assessment.waz.zScore}
            </p>
            <p className="text-[9px] text-slate-500 truncate">
              {assessment.waz.code === 'BINH_THUONG' ? 'Đạt chuẩn WHO' : assessment.waz.label}
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-1.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase">WHZ</span>
            <p className={`text-xs font-black ${assessment.whz.isAlert ? 'text-rose-700' : 'text-slate-700'}`}>
              {assessment.whz.zScore > 0 ? `+${assessment.whz.zScore}` : assessment.whz.zScore}
            </p>
            <p className="text-[9px] text-slate-500 truncate">
              {assessment.whz.code === 'BINH_THUONG' ? 'Đạt chuẩn WHO' : assessment.whz.label}
            </p>
          </div>
        </div>
      </div>

      {/* Lời khuyên tóm tắt */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
        <span className="truncate">{assessment.loiKhuyen}</span>
        <ArrowRight size={13} className="text-slate-400 shrink-0 ml-1" />
      </div>
    </div>
  );
}
