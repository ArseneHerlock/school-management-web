"use client";

import React from "react";
import { HealthStudentRow } from "../healthAggregations";

export function HealthCategoryBadge({ s }: { s: HealthStudentRow }) {
  if (!s.health?.canNang) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
        Chưa có số đo
      </span>
    );
  }
  if (!s.canCanThiep) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
        ✓ Đạt chuẩn WHO
      </span>
    );
  }
  if (s.haz != null && s.haz < -3) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
        Thấp còi nặng
      </span>
    );
  }
  if (s.haz != null && s.haz < -2) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
        Thấp còi
      </span>
    );
  }
  if (s.waz != null && s.waz < -3) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
        Nhẹ cân nặng
      </span>
    );
  }
  if (s.waz != null && s.waz < -2) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
        Nhẹ cân
      </span>
    );
  }
  if (s.whz != null && s.whz < -3) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-800 border border-red-200">
        Gầy còm nặng
      </span>
    );
  }
  if (s.whz != null && s.whz < -2) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-800 border border-orange-200">
        Gầy còm
      </span>
    );
  }
  if ((s.whz != null && s.whz > 3) || (s.waz != null && s.waz > 3)) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-50 text-pink-800 border border-pink-200">
        Béo phì
      </span>
    );
  }
  if ((s.whz != null && s.whz > 2) || (s.waz != null && s.waz > 2)) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
        Thừa cân
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
      {s.trangThaiTheTrang}
    </span>
  );
}
