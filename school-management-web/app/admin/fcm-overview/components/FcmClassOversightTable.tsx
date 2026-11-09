"use client";

import React from "react";
import { ClassBreakdown } from "../types";

interface FcmClassOversightTableProps {
  classBreakdown: ClassBreakdown[];
}

export function FcmClassOversightTable({
  classBreakdown,
}: FcmClassOversightTableProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-800">
            Bảng giám sát hỗ trợ chuyên môn theo lớp
          </h3>
          <p className="text-[11px] text-slate-400">
            Nhận diện các lớp có tỷ lệ trẻ Cụm 4 cao để phân bổ trợ giảng và
            hướng dẫn giáo viên
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400">
              <th className="pb-3 font-bold">Lớp học</th>
              <th className="pb-3 text-center font-bold">Sĩ số</th>
              <th className="pb-3 text-center font-bold">Đã chạy FCM</th>
              <th className="pb-3 text-center font-bold text-emerald-600">
                Cụm 1 (Chuẩn)
              </th>
              <th className="pb-3 text-center font-bold text-blue-600">
                Cụm 2 (Khá)
              </th>
              <th className="pb-3 text-center font-bold text-amber-600">
                Cụm 3 (TB)
              </th>
              <th className="pb-3 text-center font-bold text-emerald-600">
                Cụm 4 (Cần theo dõi)
              </th>
              <th className="pb-3 text-center font-bold">Mức cảnh báo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {classBreakdown.map((row) => {
              const c4Rate =
                row.Evaluated > 0 ? (row.Cluster4 / row.Evaluated) * 100 : 0;
              let warningBadge = (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Bình thường
                </span>
              );
              if (c4Rate > 30) {
                warningBadge = (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    Cần hỗ trợ gấp ({Math.round(c4Rate)}%)
                  </span>
                );
              } else if (c4Rate > 15) {
                warningBadge = (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                    Lưu ý ({Math.round(c4Rate)}%)
                  </span>
                );
              }

              return (
                <tr key={row.ClassId} className="hover:bg-slate-50 transition">
                  <td className="py-3 font-bold text-slate-800">{row.TenLop}</td>
                  <td className="py-3 text-center text-slate-600">
                    {row.TotalStudents}
                  </td>
                  <td className="py-3 text-center font-semibold text-slate-700">
                    {row.Evaluated}/{row.TotalStudents}
                  </td>
                  <td className="py-3 text-center font-bold text-emerald-600">
                    {row.Cluster1}
                  </td>
                  <td className="py-3 text-center font-bold text-blue-600">
                    {row.Cluster2}
                  </td>
                  <td className="py-3 text-center font-bold text-amber-600">
                    {row.Cluster3}
                  </td>
                  <td className="py-3 text-center font-bold text-emerald-600">
                    {row.Cluster4}
                  </td>
                  <td className="py-3 text-center">{warningBadge}</td>
                </tr>
              );
            })}
            {classBreakdown.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-slate-400">
                  Không có dữ liệu lớp học
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
