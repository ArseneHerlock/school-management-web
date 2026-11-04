"use client";

import React from "react";
import { Users } from "lucide-react";
import { AgeDistributionItem } from "@/services/adminDashboardTypes";

interface AgeDistributionChartProps {
  ageData: AgeDistributionItem[];
}

export function AgeDistributionChart({ ageData }: AgeDistributionChartProps) {
  if (!ageData || ageData.length === 0) return null;

  const totalAgeStudents = ageData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <section className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xs max-w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <Users size={16} />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-black text-slate-800 truncate">
              Cơ cấu Lứa tuổi & Khối lớp
            </h3>
            <p className="text-[11px] text-slate-400 truncate">
              Phân bổ trẻ theo ngày sinh thực tế toàn trường
            </p>
          </div>
        </div>

        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700 border border-amber-200 self-start sm:self-auto shrink-0">
          {totalAgeStudents} Trẻ mầm non
        </span>
      </div>

      {/* Grid 3 cột cân xứng tuyệt đối trên mobile */}
      <div className="mt-3.5 grid grid-cols-3 gap-2 sm:gap-3.5">
        {ageData.map((group) => (
          <div
            key={group.groupName}
            className="rounded-xl sm:rounded-2xl border border-slate-200/80 bg-slate-50/70 p-2.5 sm:p-3.5 text-center flex flex-col justify-between"
          >
            <div>
              <span
                className="inline-block h-2 w-2 rounded-full mb-1"
                style={{ backgroundColor: group.color }}
              />
              <h4 className="text-[11px] sm:text-xs font-black text-slate-800 truncate">
                {group.groupName}
              </h4>
              <p className="text-[9px] sm:text-[10px] font-medium text-slate-400 truncate">
                {group.ageRange}
              </p>
            </div>
            <div className="mt-1.5 pt-1.5 sm:mt-2 sm:pt-2 border-t border-slate-200/60">
              <p className="text-base sm:text-xl font-black text-slate-800">{group.count}</p>
              <p className="text-[9px] sm:text-[10px] font-bold text-slate-500">
                {group.percentage}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
