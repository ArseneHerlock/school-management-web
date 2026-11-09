"use client";

import React from "react";
import { Activity } from "lucide-react";
import { HealthRecord } from "@/services/health";
import { ChildInfo } from "../../types";
import { evaluateWhoMetrics } from "@/app/teacher/health/components/whoStandards";

export function getQuarterInfo(dateStr?: string) {
  if (!dateStr) return { label: "Đợt khám định kỳ", quarter: "Quý --", formattedDate: "--" };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { label: "Đợt khám định kỳ", quarter: "Quý --", formattedDate: "--" };
  const m = d.getMonth() + 1;
  const y = d.getFullYear();
  const q = Math.ceil(m / 3);
  return {
    label: `Đợt khám Quý ${q}/${y} (Tháng ${m})`,
    quarter: `Quý ${q}/${y}`,
    month: m,
    year: y,
    formattedDate: d.toLocaleDateString("vi-VN"),
  };
}

export function ParentHealthHistoryBadge({ rec, child }: { rec: HealthRecord; child: ChildInfo }) {
  const dyn =
    rec.canNang && rec.chieuCao && rec.canNang > 0 && rec.chieuCao > 0
      ? evaluateWhoMetrics(rec.canNang, rec.chieuCao, child.ngaySinh, child.gioiTinh, rec.ngayDo || rec.ngayKham)
      : null;

  if (!dyn) {
    return <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">Chưa có số đo</span>;
  }
  if (!dyn.canCanThiep) {
    return <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">✓ Đạt chuẩn WHO</span>;
  }
  if (dyn.haz.code === "THAP_COI_NANG") return <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">Thấp còi nặng</span>;
  if (dyn.haz.code === "THAP_COI") return <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">Thấp còi</span>;
  if (dyn.waz.code === "NHE_CAN_NANG") return <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">Nhẹ cân nặng</span>;
  if (dyn.waz.code === "NHE_CAN") return <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">Nhẹ cân</span>;
  if (dyn.whz.code === "GAY_COM_NANG") return <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-800 border border-red-200">Gầy còm nặng</span>;
  if (dyn.whz.code === "GAY_COM") return <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-800 border border-orange-200">Gầy còm</span>;
  if (dyn.whz.code === "BEO_PHI" || dyn.waz.code === "BEO_PHI") return <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 text-pink-800 border border-pink-200">Béo phì</span>;
  if (dyn.whz.code === "THUA_CAN" || dyn.waz.code === "THUA_CAN") return <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">Thừa cân</span>;

  return <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">{dyn.trangThaiTongThe}</span>;
}

export function ParentHealthHistoryTable({ records, child }: { records: HealthRecord[]; child: ChildInfo }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
          <Activity size={20} className="text-emerald-600" /> Lịch sử chi tiết các lần đo
        </h3>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {records.length} đợt ghi nhận
        </span>
      </div>

      {records.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200/80 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Đợt đo</th>
                <th className="py-3 px-4">Ngày đo</th>
                <th className="py-3 px-4 text-center">Chiều cao</th>
                <th className="py-3 px-4 text-center">Cân nặng</th>
                <th className="py-3 px-4">Chiều cao / Tuổi</th>
                <th className="py-3 px-4">Cân nặng / Tuổi</th>
                <th className="py-3 px-4">Thể trạng</th>
                <th className="py-3 px-4">Kết luận thể trạng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r, idx) => {
                const qInfo = getQuarterInfo(r.ngayDo || r.ngayKham);
                const dyn =
                  (r.canNang && r.canNang > 0) || (r.chieuCao && r.chieuCao > 0)
                    ? evaluateWhoMetrics(r.canNang, r.chieuCao, child.ngaySinh, child.gioiTinh, r.ngayDo || r.ngayKham)
                    : null;
                const hazLabel = dyn ? dyn.haz.label : r.ketLuanHaz;
                const wazLabel = dyn ? dyn.waz.label : r.ketLuanWaz;
                const whzLabel = dyn ? dyn.whz.label : r.ketLuanWhz;

                return (
                  <tr key={r.id || idx} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-800">{qInfo.quarter}</td>
                    <td className="py-3.5 px-4 text-slate-500">{qInfo.formattedDate}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700">{r.chieuCao ? `${r.chieuCao} cm` : "--"}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700">{r.canNang ? `${r.canNang} kg` : "--"}</td>
                    <td className="py-3.5 px-4"><span className="font-semibold text-slate-800">{hazLabel || "Bình thường"}</span></td>
                    <td className="py-3.5 px-4"><span className="font-semibold text-slate-800">{wazLabel || "Bình thường"}</span></td>
                    <td className="py-3.5 px-4"><span className="font-semibold text-slate-800">{whzLabel || "Bình thường"}</span></td>
                    <td className="py-3.5 px-4"><ParentHealthHistoryBadge rec={r} child={child} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
