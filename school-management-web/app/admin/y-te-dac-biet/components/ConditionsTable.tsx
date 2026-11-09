"use client";

import React from "react";
import { Phone, RotateCcw } from "lucide-react";
import { SpecialConditionItem } from "@/services/medications";

interface ConditionsTableProps {
  conditions: SpecialConditionItem[];
  hasFilter?: boolean;
  onResetFilter?: () => void;
}

export default function ConditionsTable({
  conditions,
  hasFilter = false,
  onResetFilter,
}: ConditionsTableProps) {
  if (conditions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 text-xs space-y-3">
        <p className="font-semibold text-slate-700">
          Không tìm thấy hồ sơ bệnh lý hoặc dị ứng nào theo lớp / từ khóa hiện tại.
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
            <th className="py-3 px-4">Bệnh lý / Tiền sử</th>
            <th className="py-3 px-4">Mức độ cảnh báo</th>
            <th className="py-3 px-4">Lưu ý vận động & ăn uống</th>
            <th className="py-3 px-4">Phác đồ sơ cứu</th>
            <th className="py-3 px-4">Hotline khẩn cấp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {conditions.map((cond) => (
            <tr key={cond.Id} className="hover:bg-slate-50/60 transition">
              <td className="py-3 px-4">
                <strong className="block text-slate-900 font-bold text-xs">
                  {cond.TenHocSinh}
                </strong>
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                  {cond.TenLop || "Lớp Mầm 1"}
                </span>
              </td>

              <td className="py-3 px-4">
                <span className="font-bold text-slate-800">{cond.TenBenh}</span>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                  {cond.LoaiBenh}
                </span>
              </td>

              <td className="py-3 px-4">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    cond.MucDoNguyHiem === 3
                      ? "bg-emerald-600 text-white"
                      : cond.MucDoNguyHiem === 2
                      ? "bg-amber-500 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {cond.MucDoNguyHiem === 3
                    ? "Nguy hiểm"
                    : cond.MucDoNguyHiem === 2
                    ? "Cần lưu ý"
                    : "Theo dõi nhẹ"}
                </span>
              </td>

              <td className="py-3 px-4 text-slate-600 max-w-xs leading-relaxed">
                {cond.LuuYVanDong && (
                  <div>
                    <strong>Vận động:</strong> {cond.LuuYVanDong}
                  </div>
                )}
                {cond.LuuYAnUong && (
                  <div className="text-emerald-700 font-semibold mt-1">
                    <strong>Kiêng ăn:</strong> {cond.LuuYAnUong}
                  </div>
                )}
                {!cond.LuuYVanDong && !cond.LuuYAnUong && (
                  <span className="text-slate-400 italic">
                    Chưa có ghi chú đặc biệt
                  </span>
                )}
              </td>

              <td className="py-3 px-4 text-slate-700 max-w-xs leading-relaxed">
                {cond.PhacDoSoCuu || (
                  <span className="text-slate-400 italic">
                    Theo dõi sinh hiệu cơ bản
                  </span>
                )}
              </td>

              <td className="py-3 px-4 whitespace-nowrap">
                {cond.SoDienThoaiKhanCap ? (
                  <span
                    className="inline-flex items-center gap-1.5 font-bold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200"
                    title="Số điện thoại liên hệ khẩn cấp"
                  >
                    <span className="text-slate-400 font-medium">SĐT:</span>
                    <span className="font-mono">{cond.SoDienThoaiKhanCap}</span>
                  </span>
                ) : (
                  <span className="text-slate-300 italic">Chưa cập nhật</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
