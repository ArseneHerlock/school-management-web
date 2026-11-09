"use client";

import React from "react";
import { ShieldAlert, AlertOctagon, AlertTriangle, Pill } from "lucide-react";

interface MedicalKpiCardsProps {
  totalConditions: number;
  criticalCount: number;
  allergyCount: number;
  givenMedsToday: number;
  totalMedsToday: number;
}

export default function MedicalKpiCards({
  totalConditions,
  criticalCount,
  allergyCount,
  givenMedsToday,
  totalMedsToday,
}: MedicalKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-1">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-bold">Hồ sơ bệnh nền toàn trường</span>
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <ShieldAlert size={16} />
          </span>
        </div>
        <div className="text-2xl font-black text-slate-900">
          {totalConditions}
        </div>
        <div className="text-[11px] text-slate-400">
          Ghi nhận từ khâu tuyển sinh & phụ huynh
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-4 shadow-2xs space-y-1">
        <div className="flex items-center justify-between text-emerald-700">
          <span className="text-xs font-bold">Ca bệnh cực kỳ nguy hiểm</span>
          <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
            <AlertOctagon size={16} />
          </span>
        </div>
        <div className="text-2xl font-black text-emerald-700">{criticalCount}</div>
        <div className="text-[11px] text-emerald-600/80">
          Cần theo dõi sát & có phác đồ sơ cứu
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50/30 p-4 shadow-2xs space-y-1">
        <div className="flex items-center justify-between text-amber-700">
          <span className="text-xs font-bold">Trẻ dị ứng thực phẩm</span>
          <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
            <AlertTriangle size={16} />
          </span>
        </div>
        <div className="text-2xl font-black text-amber-700">{allergyCount}</div>
        <div className="text-[11px] text-amber-600/80">
          Cần chia sẻ trực tiếp với Nhà Bếp
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-1">
        <div className="flex items-center justify-between text-slate-500">
          <span className="text-xs font-bold">Đơn thuốc hôm nay</span>
          <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
            <Pill size={16} />
          </span>
        </div>
        <div className="text-2xl font-black text-slate-900">
          {givenMedsToday}{" "}
          <span className="text-sm font-bold text-slate-400">
            / {totalMedsToday}
          </span>
        </div>
        <div className="text-[11px] text-slate-400">Đã cho uống an toàn</div>
      </div>
    </div>
  );
}
