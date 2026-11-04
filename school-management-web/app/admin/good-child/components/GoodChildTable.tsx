"use client";

import { CheckCircle2, Flower2, Search, Star } from "lucide-react";
import { ClassChartItem, GoodChildEnrichedRow } from "../types";

interface GoodChildTableProps {
  filteredRows: GoodChildEnrichedRow[];
  classChartData: ClassChartItem[];
  selectedClass: string;
  setSelectedClass: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}

export default function GoodChildTable({
  filteredRows,
  classChartData,
  selectedClass,
  setSelectedClass,
  searchQuery,
  setSearchQuery,
}: GoodChildTableProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-800">
            Danh sách theo dõi sổ bé ngoan các lớp
          </h3>
          <p className="text-[11px] text-slate-400">
            Giám sát tình trạng nhận xét của giáo viên và phản hồi từ phụ huynh
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 outline-none"
          >
            <option value="ALL">Tất cả các lớp</option>
            {classChartData.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm tên bé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 rounded-xl border border-slate-200 py-1.5 pl-8 pr-3 text-xs text-slate-700 outline-none focus:border-rose-500"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400">
              <th className="pb-3 font-bold">Học sinh</th>
              <th className="pb-3 font-bold">Lớp</th>
              <th className="pb-3 text-center font-bold">Tiến trình hoa thứ 6</th>
              <th className="pb-3 text-center font-bold">Ngôi sao tháng</th>
              <th className="pb-3 font-bold">Nhận xét giáo viên</th>
              <th className="pb-3 text-center font-bold">Bàn giao phụ huynh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRows.map((r, i) => (
              <tr key={r.id || i} className="hover:bg-slate-50 transition">
                <td className="py-3 font-bold text-slate-800">{r.studentName}</td>
                <td className="py-3 text-slate-600">{r.className}</td>
                <td className="py-3 text-center">
                  <div className="inline-flex items-center gap-1">
                    {[0, 1, 2, 3].map((idx) => (
                      <Flower2
                        key={idx}
                        size={15}
                        className={
                          idx < r.dailyCount
                            ? "text-rose-500 fill-rose-500"
                            : "text-slate-200"
                        }
                      />
                    ))}
                    <span className="ml-1 text-[11px] font-bold text-slate-600">
                      ({r.dailyCount}/4)
                    </span>
                  </div>
                </td>
                <td className="py-3 text-center">
                  {r.bonusCount > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-800">
                      <Star size={11} fill="currentColor" /> {r.bonusCount} sao
                    </span>
                  ) : (
                    <span className="text-slate-300">-</span>
                  )}
                </td>
                <td className="py-3 max-w-xs truncate text-slate-600">
                  {r.teacherComment ? (
                    <span title={r.teacherComment}>{r.teacherComment}</span>
                  ) : (
                    <span className="italic text-slate-400">Chưa ghi nhận xét</span>
                  )}
                </td>
                <td className="py-3 text-center">
                  {r.hasComment ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 size={11} /> Đã bàn giao
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                      Đang tổng hợp
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Không có sổ bé ngoan nào phù hợp với bộ lọc
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
