"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { MedicationItem } from "@/services/medications";

interface MedicationsTableProps {
  medications: MedicationItem[];
}

export default function MedicationsTable({
  medications,
}: MedicationsTableProps) {
  if (medications.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 text-xs">
        Hôm nay toàn trường không có đơn dặn thuốc nào được gửi.
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
                  <span className="text-[11px] text-slate-500">
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

                <td className="py-3 px-4 max-w-xs text-slate-600">
                  {med.LoiNhan || "--"}
                </td>

                <td className="py-3 px-4">
                  {isGiven ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 size={12} /> Đã uống ({med.GioUongThucTe})
                    </span>
                  ) : isIssue ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                      <AlertTriangle size={12} /> Có sự cố
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      <Clock size={12} /> Chờ đến giờ
                    </span>
                  )}
                </td>

                <td className="py-3 px-4 text-slate-700 font-medium">
                  {med.GiaoVienXacNhan || "Cô chủ nhiệm lớp"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
