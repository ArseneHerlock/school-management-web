"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  HeartPulse,
  Scale,
  Ruler,
  Inbox,
  Loader2,
  Calendar,
  Sparkles,
  TrendingUp,
  Info,
} from "lucide-react";
import { getHealthRecords, HealthRecord } from "@/services/health";
import { ChildInfo } from "../types";
import WhoGrowthChart from "@/app/components/WhoGrowthChart";
import { evaluateWhoMetrics } from "@/app/teacher/health/components/whoStandards";

function getQuarterInfo(dateStr?: string) {
  if (!dateStr) return { label: "Đợt khám định kỳ", quarter: "Quý --" };
  const d = new Date(dateStr);
  if (isNaN(d.getTime()))
    return { label: "Đợt khám định kỳ", quarter: "Quý --" };
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

export default function HealthTab({ child }: { child: ChildInfo }) {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const childId = child?.id;
    if (!childId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getHealthRecords(childId, {
      ngaySinh: child.ngaySinh,
      gioiTinh: child.gioiTinh,
    })
      .then((data) => {
        const list = Array.isArray(data) ? (data as unknown as HealthRecord[]) : [];
        setRecords(list);
      })
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, [child]);

  const latest = records[0];
  const latestQuarter = getQuarterInfo(latest?.ngayDo || latest?.ngayKham);

  return (
    <section className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-50 via-pink-50 to-indigo-50 p-6 shadow-sm border border-rose-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-white text-rose-500 rounded-2xl shadow-sm border border-rose-100 shrink-0">
            <HeartPulse size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-100/80 px-2.5 py-0.5 rounded-full">
                CHUẨN TĂNG TRƯỞNG WHO (0 - 5 TUỔI)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
              Hồ Sơ Sức Khỏe & Thể Trạng Bé {child.hoTen}
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Theo dõi liên tục biểu đồ tăng trưởng (HAZ, WAZ, WHZ) xuyên suốt quá trình học tại trường.
            </p>
          </div>
        </div>
      </div>

      {/* Biểu đồ Đường Tăng Trưởng Xuyên Suốt Quá Trình Học */}
      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
          <p className="text-xs font-bold text-slate-500">Đang tải biểu đồ tăng trưởng WHO...</p>
        </div>
      ) : records.length > 0 ? (
        <WhoGrowthChart
          childId={child.id}
          records={records}
          gender={child.gioiTinh}
          dob={child.ngaySinh}
          studentName={child.hoTen}
          height={380}
        />
      ) : (
        <div className="rounded-3xl bg-white p-10 text-center border border-dashed border-slate-200">
          <Inbox size={44} className="mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-bold text-slate-700">Chưa có số liệu khám sức khỏe định kỳ</p>
          <p className="text-xs text-slate-400 mt-1">
            Số liệu sẽ được cập nhật tự động khi giáo viên thực hiện cân đo định kỳ theo Quý.
          </p>
        </div>
      )}

      {/* Bảng Chi Tiết Lịch Sử Các Đợt Đo */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
            <Activity size={20} className="text-rose-500" /> Lịch sử chi tiết các lần đo
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
                  <th className="py-3 px-4">HAZ (Chiều cao/Tuổi)</th>
                  <th className="py-3 px-4">WAZ (Cân nặng/Tuổi)</th>
                  <th className="py-3 px-4">WHZ (Thể trạng)</th>
                  <th className="py-3 px-4">Đánh giá chung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r, idx) => {
                  const qInfo = getQuarterInfo(r.ngayDo || r.ngayKham);
                  const dyn =
                    (r.canNang && r.canNang > 0) || (r.chieuCao && r.chieuCao > 0)
                      ? evaluateWhoMetrics(
                          r.canNang,
                          r.chieuCao,
                          child.ngaySinh,
                          child.gioiTinh,
                          r.ngayDo || r.ngayKham
                        )
                      : null;

                  const hazVal = dyn ? dyn.haz.zScore : r.haz;
                  const hazLabel = dyn ? dyn.haz.label : r.ketLuanHaz;

                  const wazVal = dyn ? dyn.waz.zScore : r.waz;
                  const wazLabel = dyn ? dyn.waz.label : r.ketLuanWaz;

                  const whzVal = dyn ? dyn.whz.zScore : r.whz;
                  const whzLabel = dyn ? dyn.whz.label : r.ketLuanWhz;

                  const overallLabel = dyn ? dyn.trangThaiTongThe : r.ketLuanTongThe;
                  const canCanThiep = dyn ? dyn.canCanThiep : r.canCanThiep;

                  return (
                    <tr key={r.id || idx} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {qInfo.quarter}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {qInfo.formattedDate}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                        {r.chieuCao ? `${r.chieuCao} cm` : "--"}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                        {r.canNang ? `${r.canNang} kg` : "--"}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {hazVal != null ? `${hazVal > 0 ? "+" : ""}${hazVal} SD` : "--"}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {hazLabel || "Bình thường"}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {wazVal != null ? `${wazVal > 0 ? "+" : ""}${wazVal} SD` : "--"}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {wazLabel || "Bình thường"}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {whzVal != null ? `${whzVal > 0 ? "+" : ""}${whzVal} SD` : "--"}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {whzLabel || "Bình thường"}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            canCanThiep
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {overallLabel || (canCanThiep ? "Cần can thiệp" : "Bình thường")}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  );
}
