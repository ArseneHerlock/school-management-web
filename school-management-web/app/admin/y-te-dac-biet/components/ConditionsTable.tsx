"use client";

import React from "react";
import { Phone } from "lucide-react";
import { SpecialConditionItem } from "@/services/medications";

interface ConditionsTableProps {
  conditions: SpecialConditionItem[];
}

export default function ConditionsTable({
  conditions,
}: ConditionsTableProps) {
  if (conditions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 text-xs">
        Không tìm thấy trường hợp bệnh lý nào theo bộ lọc hiện tại.
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
                <span className="text-[11px] text-slate-500">
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
                      ? "bg-rose-600 text-white"
                      : cond.MucDoNguyHiem === 2
                      ? "bg-amber-500 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {cond.MucDoNguyHiem === 3
                    ? "Nguy hiểm"
                    : cond.MucDoNguyHiem === 2
                    ? "Cần chú ý"
                    : "Nhẹ"}
                </span>
              </td>

              <td className="py-3 px-4 max-w-xs text-slate-600 space-y-1">
                {cond.LuuYVanDong && (
                  <div>
                    <span className="font-bold text-slate-700">Vận động:</span>{" "}
                    {cond.LuuYVanDong}
                  </div>
                )}
                {cond.LuuYAnUong && (
                  <div className="text-amber-800 font-medium">
                    <span className="font-bold">Kiêng ăn:</span>{" "}
                    {cond.LuuYAnUong}
                  </div>
                )}
              </td>

              <td className="py-3 px-4 max-w-xs text-rose-900 bg-rose-50/20 font-medium leading-relaxed">
                {cond.PhacDoSoCuu || "Chưa cập nhật phác đồ"}
              </td>

              <td className="py-3 px-4 whitespace-nowrap">
                {cond.SoDienThoaiKhanCap ? (
                  <a
                    href={`tel:${cond.SoDienThoaiKhanCap.replace(/\D/g, "")}`}
                    className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline"
                  >
                    <Phone size={11} />
                    <span>{cond.SoDienThoaiKhanCap}</span>
                  </a>
                ) : (
                  <span className="text-slate-400">--</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
