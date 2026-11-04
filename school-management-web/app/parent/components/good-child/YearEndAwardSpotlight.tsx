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
      <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-white shadow-lg">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10">
          <Trophy size={160} />
        </div>
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur text-amber-200">
              <Award size={32} />
            </div>
            <div>
              <span className="inline-block rounded-full bg-white/25 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white">
                KHEN THƯỞNG CUỐI NĂM • ĐÃ PHÊ DUYỆT
              </span>
              <h3 className="mt-1 text-xl font-black sm:text-2xl">
                Danh hiệu: {yearEndAward.AwardTitle || yearEndAward.awardTitle}
              </h3>
              <p className="mt-0.5 text-xs text-amber-100">
                Năm học: {yearEndAward.SchoolYear || yearEndAward.schoolYear} | Mã Giấy Khen:{' '}
                <span className="font-mono font-bold text-white">
                  {yearEndAward.CertificateCode ||
                    yearEndAward.certificateCode ||
                    'GK-CHÍNH-THỨC'}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onOpenCertModal}
            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black text-amber-900 shadow-md hover:bg-amber-50 transition cursor-pointer"
          >
            <Award size={16} className="text-amber-600" />
            Xem & Tải Giấy Khen Về Máy
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-sky-200 bg-gradient-to-r from-sky-50 via-indigo-50/70 to-amber-50/60 p-5 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-sm">
              <Award size={24} />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-sky-800">
                <Clock size={11} /> ĐÃ TRÌNH BAN GIÁM HIỆU • CHỜ CẤP GIẤY KHEN
              </span>
              <h3 className="mt-1 text-base sm:text-lg font-black text-slate-800">
                Danh hiệu đề xuất: {yearEndAward.AwardTitle || yearEndAward.awardTitle}
              </h3>
              <p className="mt-0.5 text-xs text-slate-600">
                Năm học: {yearEndAward.SchoolYear || yearEndAward.schoolYear} • Cô giáo chủ nhiệm đã trình hồ sơ thi đua của bé lên Ban Giám Hiệu. Giấy khen điện tử sẽ mở ngay khi Ban Giám Hiệu phê duyệt.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
