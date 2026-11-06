"use client";

import { useEffect, useState, useMemo } from "react";
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
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import { getHealthRecords, HealthRecord } from "@/services/health";
import { ChildInfo } from "../types";
import WhoGrowthChart from "@/app/components/WhoGrowthChart";
import { evaluateWhoMetrics, WhoAssessmentResult } from "@/app/teacher/health/components/whoStandards";
import { WHO_9_CATEGORIES } from "@/app/admin/suc-khoe/types";

function getQuarterInfo(dateStr?: string) {
  if (!dateStr) return { label: "Đợt khám định kỳ", quarter: "Quý --", formattedDate: "--" };
  const d = new Date(dateStr);
  if (isNaN(d.getTime()))
    return { label: "Đợt khám định kỳ", quarter: "Quý --", formattedDate: "--" };
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
  const [showWhoGuide, setShowWhoGuide] = useState(false);

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

  // Đánh giá thể trạng lần đo mới nhất của bé theo chuẩn WHO
  const latestEvaluation = useMemo<WhoAssessmentResult | null>(() => {
    if (!latest?.canNang || !latest?.chieuCao || latest.canNang <= 0 || latest.chieuCao <= 0) {
      return null;
    }
    return evaluateWhoMetrics(
      latest.canNang,
      latest.chieuCao,
      child.ngaySinh,
      child.gioiTinh,
      latest.ngayDo || latest.ngayKham
    );
  }, [latest, child]);

  // Phân loại vào 1 trong 9 nhóm WHO
  const currentCategoryMeta = useMemo(() => {
    if (!latestEvaluation) {
      return null;
    }
    const { haz, waz, whz, canCanThiep } = latestEvaluation;

    if (!canCanThiep) {
      return WHO_9_CATEGORIES.find((c) => c.key === "DAT_CHUAN");
    }
    if (haz.code === "THAP_COI_NANG") {
      return WHO_9_CATEGORIES.find((c) => c.key === "THAP_COI_NANG");
    }
    if (haz.code === "THAP_COI") {
      return WHO_9_CATEGORIES.find((c) => c.key === "THAP_COI");
    }
    if (waz.code === "NHE_CAN_NANG") {
      return WHO_9_CATEGORIES.find((c) => c.key === "NHE_CAN_NANG");
    }
    if (waz.code === "NHE_CAN") {
      return WHO_9_CATEGORIES.find((c) => c.key === "NHE_CAN");
    }
    if (whz.code === "GAY_COM_NANG") {
      return WHO_9_CATEGORIES.find((c) => c.key === "GAY_COM_NANG");
    }
    if (whz.code === "GAY_COM") {
      return WHO_9_CATEGORIES.find((c) => c.key === "GAY_COM");
    }
    if (whz.code === "BEO_PHI" || waz.code === "BEO_PHI") {
      return WHO_9_CATEGORIES.find((c) => c.key === "BEO_PHI");
    }
    if (whz.code === "THUA_CAN" || waz.code === "THUA_CAN") {
      return WHO_9_CATEGORIES.find((c) => c.key === "THUA_CAN");
    }
    return WHO_9_CATEGORIES.find((c) => c.key === "DAT_CHUAN");
  }, [latestEvaluation]);

  function getHistoryCategoryBadge(rec: HealthRecord) {
    const dyn =
      rec.canNang && rec.chieuCao && rec.canNang > 0 && rec.chieuCao > 0
        ? evaluateWhoMetrics(
            rec.canNang,
            rec.chieuCao,
            child.ngaySinh,
            child.gioiTinh,
            rec.ngayDo || rec.ngayKham
          )
        : null;

    if (!dyn) {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
          Chưa có số đo
        </span>
      );
    }

    if (!dyn.canCanThiep) {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          ✓ Đạt chuẩn WHO
        </span>
      );
    }

    if (dyn.haz.code === "THAP_COI_NANG") {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
          Thấp còi nặng
        </span>
      );
    }
    if (dyn.haz.code === "THAP_COI") {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
          Thấp còi
        </span>
      );
    }
    if (dyn.waz.code === "NHE_CAN_NANG") {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
          Nhẹ cân nặng
        </span>
      );
    }
    if (dyn.waz.code === "NHE_CAN") {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
          Nhẹ cân
        </span>
      );
    }
    if (dyn.whz.code === "GAY_COM_NANG") {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-800 border border-red-200">
          Gầy còm nặng
        </span>
      );
    }
    if (dyn.whz.code === "GAY_COM") {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-800 border border-orange-200">
          Gầy còm
        </span>
      );
    }
    if (dyn.whz.code === "BEO_PHI" || dyn.waz.code === "BEO_PHI") {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 text-pink-800 border border-pink-200">
          Béo phì
        </span>
      );
    }
    if (dyn.whz.code === "THUA_CAN" || dyn.waz.code === "THUA_CAN") {
      return (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
          Thừa cân
        </span>
      );
    }

    return (
      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
        {dyn.trangThaiTongThe}
      </span>
    );
  }

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
                SỨC KHỎE HỌC ĐƯỜNG
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
              Hồ Sơ Sức Khỏe & Thể Trạng Bé {child.hoTen}
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Theo dõi định kỳ chiều cao, cân nặng và thể trạng phát triển của bé tại trường.
            </p>
          </div>
        </div>
      </div>

      {/* Thẻ Phân Loại Thể Trạng Hiện Tại Của Bé */}
      {latest && latestEvaluation && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: currentCategoryMeta?.color || "#10b981" }}
              />
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Đánh giá thể trạng kỳ gần nhất ({latestQuarter.quarter}):
                </span>
                <span className="text-lg font-black text-slate-800">
                  {currentCategoryMeta?.label || latestEvaluation.trangThaiTongThe}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 self-start sm:self-auto">
              <span className="text-xs text-slate-600">
                Chiều cao: <b>{latest.chieuCao} cm</b>
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-600">
                Cân nặng: <b>{latest.canNang} kg</b>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-3.5">
              <span className="text-[10px] font-bold uppercase text-blue-700 tracking-wider block">
                Chiều cao theo độ tuổi
              </span>
              <span className="text-sm font-black text-blue-900 mt-1 block">
                {latestEvaluation.haz.label}
              </span>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-3.5">
              <span className="text-[10px] font-bold uppercase text-amber-700 tracking-wider block">
                Cân nặng theo độ tuổi
              </span>
              <span className="text-sm font-black text-amber-900 mt-1 block">
                {latestEvaluation.waz.label}
              </span>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-3.5">
              <span className="text-[10px] font-bold uppercase text-rose-700 tracking-wider block">
                Thể trạng phát triển
              </span>
              <span className="text-sm font-black text-rose-900 mt-1 block">
                {latestEvaluation.whz.label}
              </span>
            </div>
          </div>
        </div>
      )}

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
                        <span className="font-semibold text-slate-800">
                          {hazLabel || "Bình thường"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">
                          {wazLabel || "Bình thường"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">
                          {whzLabel || "Bình thường"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {getHistoryCategoryBadge(r)}
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
