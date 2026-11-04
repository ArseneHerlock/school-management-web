'use client';

import React from 'react';
import { History } from 'lucide-react';
import { MedicationItem } from '@/services/medications';
import { getStatusBadge } from './types';

interface PastMedicationsSectionProps {
  pastMeds: MedicationItem[];
}

export function PastMedicationsSection({ pastMeds }: PastMedicationsSectionProps) {
  if (pastMeds.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 text-slate-600">
          <History size={15} />
        </span>
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">
          Lịch sử các lần gửi thuốc trước đây
        </h2>
      </div>

      <div className="divide-y divide-slate-100">
        {pastMeds.map((med) => {
          const statusInfo = getStatusBadge(med.TrangThai);
          return (
            <div
              key={med.Id}
              className="py-3 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <span className="font-bold text-slate-900">{med.TenThuoc}</span>
                <span className="text-slate-500 ml-2">({med.LieuLuong})</span>
                <span className="text-slate-400 block text-[11px]">
                  Ngày{' '}
                  {med.NgayUong
                    ? new Date(med.NgayUong).toLocaleDateString('vi-VN')
                    : '--'}{' '}
                  · {med.GioUongDuKien}
                </span>
              </div>

              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusInfo.color}`}
              >
                {statusInfo.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
