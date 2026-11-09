'use client';

import React from 'react';
import { Award, Trophy, Clock } from 'lucide-react';

interface YearEndAwardSpotlightProps {
  yearEndAward: any;
  onOpenCertModal: () => void;
}

export function YearEndAwardSpotlight({
  yearEndAward,
  onOpenCertModal,
}: YearEndAwardSpotlightProps) {
  if (!yearEndAward) return null;

  const isApproved =
    yearEndAward.Status === 'APPROVED' || yearEndAward.status === 'APPROVED';
  const isSubmitted =
    yearEndAward.Status === 'SUBMITTED' || yearEndAward.status === 'SUBMITTED';

  if (isApproved) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-500 to-orange-500 p-3.5 sm:p-4 text-white shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 min-w-0 max-w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center shrink-0">
            <Trophy size={20} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-100">
              Khen thưởng cuối năm học
            </span>
            <h3 className="text-sm sm:text-base font-extrabold truncate">
              {yearEndAward.AwardTitle || yearEndAward.awardTitle}
            </h3>
            <p className="text-[11px] text-amber-100 mt-0.5">
              Năm học {yearEndAward.SchoolYear || yearEndAward.schoolYear} • Mã:{' '}
              <span className="font-mono font-bold text-white">
                {yearEndAward.CertificateCode || yearEndAward.certificateCode || 'GK-CHÍNH-THỨC'}
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={onOpenCertModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-orange-900 shadow hover:bg-amber-50 transition cursor-pointer shrink-0"
        >
          <Award size={14} className="text-orange-600" />
          <span>Xem giấy khen</span>
        </button>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-3 sm:p-3.5 text-slate-800 shadow-2xs flex items-center gap-3 min-w-0 max-w-full">
        <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
          <Clock size={16} />
        </div>
        <div className="min-w-0 text-xs">
          <span className="font-bold text-sky-800 uppercase text-[10px]">
            Hồ sơ khen thưởng đang chờ BGH phê duyệt
          </span>
          <p className="font-semibold text-slate-700 truncate">
            Danh hiệu đề xuất: {yearEndAward.AwardTitle || yearEndAward.awardTitle}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
