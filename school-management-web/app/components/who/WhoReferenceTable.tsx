"use client";

import React from "react";
import { Info } from "lucide-react";
import { WHO_TABLES } from "./whoChartTypes";

export default function WhoReferenceTable() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <Info size={16} />
          </span>
          <div>
            <h4 className="text-sm font-black text-slate-800">
              Bảng Ngưỡng Phân Loại Z-score (WHO 2006 cho trẻ &lt; 5 tuổi)
            </h4>
            <p className="text-[11px] text-slate-400">
              Quy chuẩn đánh giá phát triển thể chất học đường
            </p>
          </div>
        </div>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-black text-blue-700 border border-blue-200">
          WHO Standards
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {WHO_TABLES.map((tbl) => (
          <div
            key={tbl.title}
            className={`rounded-2xl border p-4 space-y-2.5 ${tbl.border}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase">{tbl.title}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/80">
                {tbl.badge}
              </span>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white">
              <table className="w-full text-left text-xs">
                <thead className={`font-bold text-[11px] ${tbl.headerBg}`}>
                  <tr>
                    <th className="py-2 px-3">Z-score</th>
                    <th className="py-2 px-3">Phân loại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {tbl.rows.map((r) => (
                    <tr key={r.z}>
                      <td className="py-2 px-3 font-semibold text-slate-700">
                        {r.z}
                      </td>
                      <td className={`py-2 px-3 font-bold ${r.color}`}>
                        {r.label}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export { WhoReferenceTable };
