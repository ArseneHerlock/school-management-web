import React from 'react';
import { Heart, Pill } from 'lucide-react';
import { CHILDREN } from '../../data';
import { MedicationItem, SpecialConditionItem } from '@/services/medications';

interface MedicationAllClassTabProps {
  classNameStr: string;
  todayMeds: MedicationItem[];
  conditions: SpecialConditionItem[];
}

export function MedicationAllClassTab({
  classNameStr,
  todayMeds,
  conditions,
}: MedicationAllClassTabProps) {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">
          Danh Sách Học Sinh Lớp {classNameStr}
        </h2>
        <span className="text-xs font-semibold text-slate-500">
          Tổng số: {CHILDREN.length} trẻ
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {CHILDREN.map((child) => {
          const med = todayMeds.find(
            (m) => String(m.HocSinhId).toLowerCase() === String(child.apiId).toLowerCase()
          );
          const cond = conditions.find(
            (c) => String(c.HocSinhId).toLowerCase() === String(child.apiId).toLowerCase()
          );

          return (
            <div
              key={child.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 rounded-xl px-2 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                  {child.avatar || 'BE'}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{child.name}</h4>
                  <p className="text-[11px] text-slate-400">Biệt danh: {child.nickname || '--'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {cond && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    <Heart size={11} /> {cond.TenBenh}
                  </span>
                )}

                {med ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                    <Pill size={11} /> Có đơn uống thuốc hôm nay
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium">
                    Không có đơn thuốc
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
