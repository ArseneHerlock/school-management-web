"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, Clock, RotateCcw } from "lucide-react";
import { MedicationItem } from "@/services/medications";

interface MedicationsTableProps {
  medications: MedicationItem[];
  hasFilter?: boolean;
  onResetFilter?: () => void;
}

export default function MedicationsTable({
  medications,
  hasFilter = false,
  onResetFilter,
}: MedicationsTableProps) {
  if (medications.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 text-xs space-y-3">
        <p className="font-semibold text-slate-700">
          Hôm nay không có đơn dặn thuốc nào theo lớp / từ khóa hiện tại.
        </p>
        {hasFilter && onResetFilter && (
          <button
            type="button"
            onClick={onResetFilter}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
          >
            <RotateCcw size={12} />
            Xem tất cả các lớp
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px]">
            <th className="py-3 px-4">Học sinh & Lớp</th>
            <th className="py-3 px-4">Thuốc & Liều lượng</th>
            <th className="py-3 px-4">Giờ hẹn uống</th>
            <th className="py-3 px-4">Lời dặn của phụ huynh</th>
            <th className="py-3 px-4">Trạng thái</th>
            <th className="py-3 px-4">Giáo viên phụ trách</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {medications.map((med) => {
            const isGiven = med.TrangThai === "DA_CHO_UONG";
            const isIssue = med.TrangThai === "SU_CO";

            return (
              <tr key={med.Id} className="hover:bg-slate-50/60 transition">
                <td className="py-3 px-4">
                  <strong className="block text-slate-900 font-bold text-xs">
                    {med.TenHocSinh}
                  </strong>
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                    {med.TenLop || "Lớp Mầm 1"}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <strong className="text-slate-800">{med.TenThuoc}</strong>
                  <span className="block text-[11px] text-orange-600 font-bold">
                    {med.LieuLuong}
                  </span>
                </td>

                <td className="py-3 px-4 font-semibold text-slate-700">
                  {med.GioUongDuKien}
                </td>

                <td className="py-3 px-4 text-slate-600 max-w-xs leading-relaxed">
                  {med.LoiNhan || (
                    <span className="text-slate-300 italic">Không có</span>
                  )}
                </td>

                <td className="py-3 px-4">
                  {isGiven ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      Đã uống ({med.GioUongThucTe || "Đúng giờ"})
                    </span>
                  ) : isIssue ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <AlertTriangle size={13} className="text-emerald-600" />
                      Sự cố ({med.GhiChuGiaoVien || "Gặp vấn đề"})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      <Clock size={13} className="text-amber-600" />
                      Chờ uống
                    </span>
                  )}
                </td>

                <td className="py-3 px-4 text-slate-600">
                  {med.GiaoVienXacNhan || (
                    <span className="text-slate-300 italic">Chưa xác nhận</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
