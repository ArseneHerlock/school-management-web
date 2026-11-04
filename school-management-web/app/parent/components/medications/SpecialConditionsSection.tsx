'use client';

import React from 'react';
import { Heart, Phone } from 'lucide-react';
import { SpecialConditionItem } from '@/services/medications';

interface SpecialConditionsSectionProps {
  conditions: SpecialConditionItem[];
  classNameProp?: string;
}

export function SpecialConditionsSection({
  conditions,
  classNameProp,
}: SpecialConditionsSectionProps) {
  if (conditions.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-rose-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-rose-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-rose-100 text-rose-600">
            <Heart size={15} />
          </span>
          <h2 className="text-sm font-black text-rose-900 uppercase tracking-wide">
            Hồ sơ sức khỏe & Bệnh lý đặc biệt cần lưu ý
          </h2>
        </div>
        {classNameProp && (
          <span className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
            Cô giáo lớp {classNameProp} đang theo dõi
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conditions.map((cond) => (
          <div
            key={cond.Id}
            className="rounded-2xl border border-rose-100 bg-rose-50/40 p-4 space-y-2.5 relative"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900">{cond.TenBenh}</h3>
              <span
                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  cond.MucDoNguyHiem === 3
                    ? 'bg-rose-600 text-white'
                    : cond.MucDoNguyHiem === 2
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {cond.MucDoNguyHiem === 3
                  ? 'Cực kỳ nguy hiểm'
                  : cond.MucDoNguyHiem === 2
                  ? 'Cần chú ý'
                  : 'Theo dõi nhẹ'}
              </span>
            </div>

            {cond.LuuYVanDong && (
              <div className="text-xs text-slate-700">
                <span className="font-bold text-slate-800">Lưu ý vận động:</span>{' '}
                {cond.LuuYVanDong}
              </div>
            )}

            {cond.LuuYAnUong && (
              <div className="text-xs text-slate-700">
                <span className="font-bold text-slate-800">Kiêng cữ ăn uống:</span>{' '}
                {cond.LuuYAnUong}
              </div>
            )}

            {cond.PhacDoSoCuu && (
              <div className="text-xs text-rose-800 bg-white/80 p-2.5 rounded-xl border border-rose-100">
                <span className="font-bold text-rose-900">Sơ cứu khẩn cấp:</span>{' '}
                {cond.PhacDoSoCuu}
              </div>
            )}

            {cond.SoDienThoaiKhanCap && (
              <div className="text-[11px] text-slate-600 flex items-center gap-1.5 pt-1">
                <Phone size={12} className="text-emerald-600" />
                <span>
                  Hotline khẩn cấp:{' '}
                  <strong className="text-slate-900">{cond.SoDienThoaiKhanCap}</strong>
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
