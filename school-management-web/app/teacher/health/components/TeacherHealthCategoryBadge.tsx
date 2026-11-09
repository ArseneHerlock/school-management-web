import React from 'react';

export function TeacherHealthCategoryBadge({ code, label }: { code: string; label: string }) {
  switch (code) {
    case 'DAT_CHUAN':
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          ✓ Đạt chuẩn WHO
        </span>
      );
    case 'THAP_COI':
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
          Thấp còi
        </span>
      );
    case 'THAP_COI_NANG':
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
          Thấp còi nặng
        </span>
      );
    case 'NHE_CAN':
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
          Nhẹ cân
        </span>
      );
    case 'NHE_CAN_NANG':
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
          Nhẹ cân nặng
        </span>
      );
    case 'GAY_COM':
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-800 border border-orange-200">
          Gầy còm
        </span>
      );
    case 'GAY_COM_NANG':
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-800 border border-red-200">
          Gầy còm nặng
        </span>
      );
    case 'THUA_CAN':
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
          Thừa cân
        </span>
      );
    case 'BEO_PHI':
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-50 text-pink-800 border border-pink-200">
          Béo phì
        </span>
      );
    default:
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
          {label}
        </span>
      );
  }
}
