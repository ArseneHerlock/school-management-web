"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { ScheduleItem, TYPE_NAMES, TYPE_COLORS } from "../types";
import Pagination from "@/app/admin/components/shared/Pagination";

interface LichHocTableProps {
  schedules: ScheduleItem[];
  currentPage: number;
  setCurrentPage: (p: number) => void;
  itemsPerPage: number;
  onOpenEdit: (item: ScheduleItem) => void;
  onDelete: (id: string) => void;
}

export default function LichHocTable({
  schedules,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  onOpenEdit,
  onDelete,
}: LichHocTableProps) {
  const paginated = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return schedules.slice(start, start + itemsPerPage);
  }, [schedules, currentPage, itemsPerPage]);

  return (
    <div className="rounded-3xl border border-emerald-100 bg-white overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-emerald-100 bg-emerald-50/20 text-slate-500 text-[10px] uppercase">
              <th className="p-3.5">Thời gian & Ngày</th>
              <th className="p-3.5">Tên hoạt động</th>
              <th className="p-3.5">Phân loại</th>
              <th className="p-3.5">Áp dụng cho</th>
              <th className="p-3.5">Địa điểm</th>
              <th className="p-3.5">Giáo viên phụ trách</th>
              <th className="p-3.5 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {paginated.map((item) => {
              const color =
                TYPE_COLORS[item.type] ||
                TYPE_COLORS[1] || {
                  bg: "",
                  border: "",
                  text: "",
                  badge: "bg-slate-500 text-white",
                };
              return (
                <tr key={item.id} className="hover:bg-emerald-50/20 transition">
                  <td className="p-3.5 whitespace-nowrap">
                    <p className="font-bold text-slate-800">{item.date}</p>
                    <p className="text-[10px] text-slate-400">
                      {item.startTime} - {item.endTime}
                    </p>
                  </td>
                  <td className="p-3.5 font-bold text-slate-800 max-w-xs truncate">
                    {item.title}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${color.badge}`}
                    >
                      {TYPE_NAMES[item.type] || "Hoạt động"}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-emerald-600">
                    {item.isSchoolWide
                      ? "Toàn trường"
                      : item.className || "Lớp mầm non"}
                  </td>
                  <td className="p-3.5 text-slate-500 truncate max-w-[120px]">
                    {item.location || "-"}
                  </td>
                  <td className="p-3.5 text-slate-600">
                    {item.teacherName || "-"}
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onOpenEdit(item)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  Không có hoạt động nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 border-t border-emerald-100 flex justify-end">
        <Pagination
          currentPage={currentPage}
          pageSize={itemsPerPage}
          totalItems={schedules.length}
          totalPages={Math.ceil(schedules.length / itemsPerPage) || 1}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
