"use client";

import React from "react";
import { Users, TrendingUp, CheckCircle2, XCircle } from "lucide-react";

interface ClassMatrixStatsPillsProps {
  className?: string;
  totalInClass: number;
  evaluatedStudentsCount: number;
  classCompletionRate: number;
  totalClassPass: number;
  totalClassFail: number;
}

export default function ClassMatrixStatsPills({
  className = "",
  totalInClass,
  evaluatedStudentsCount,
  classCompletionRate,
  totalClassPass,
  totalClassFail,
}: ClassMatrixStatsPillsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 text-xs">
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
          <Users size={16} />
        </div>
        <div>
          <p className="text-[11px] text-slate-400">Sĩ số lớp {className}</p>
          <p className="font-black text-slate-800 text-sm">{totalInClass} trẻ</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
          <TrendingUp size={16} />
        </div>
        <div>
          <p className="text-[11px] text-slate-400">Tiến độ giáo viên đánh giá</p>
          <p className="font-black text-amber-700 text-sm">
            {evaluatedStudentsCount}/{totalInClass} trẻ ({classCompletionRate}%)
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
          <CheckCircle2 size={16} />
        </div>
        <div>
          <p className="text-[11px] text-slate-400">Lượt chỉ số Đạt</p>
          <p className="font-black text-emerald-700 text-sm">
            {totalClassPass} lượt
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
          <XCircle size={16} />
        </div>
        <div>
          <p className="text-[11px] text-slate-400">Cần rèn luyện thêm</p>
          <p className="font-black text-emerald-700 text-sm">
            {totalClassFail} lượt
          </p>
        </div>
      </div>
    </div>
  );
}
