"use client";

import { useEffect, useState, useMemo } from "react";
import {
  HeartPulse,
  Inbox,
  Loader2,
} from "lucide-react";
import { getHealthRecords, HealthRecord } from "@/services/health";
import { ChildInfo } from "../types";
import WhoGrowthChart from "@/app/components/WhoGrowthChart";
import { evaluateWhoMetrics, WhoAssessmentResult } from "@/app/teacher/health/components/whoStandards";
import { WHO_9_CATEGORIES } from "@/app/admin/suc-khoe/types";
import { ParentHealthHistoryTable, getQuarterInfo } from "./health/ParentHealthHistoryTable";

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

  const currentCategoryMeta = useMemo(() => {
    if (!latestEvaluation) return null;
    const { haz, waz, whz, canCanThiep } = latestEvaluation;
    if (!canCanThiep) return WHO_9_CATEGORIES.find((c) => c.key === "DAT_CHUAN");
    if (haz.code === "THAP_COI_NANG") return WHO_9_CATEGORIES.find((c) => c.key === "THAP_COI_NANG");
    if (haz.code === "THAP_COI") return WHO_9_CATEGORIES.find((c) => c.key === "THAP_COI");
    if (waz.code === "NHE_CAN_NANG") return WHO_9_CATEGORIES.find((c) => c.key === "NHE_CAN_NANG");
    if (waz.code === "NHE_CAN") return WHO_9_CATEGORIES.find((c) => c.key === "NHE_CAN");
    if (whz.code === "GAY_COM_NANG") return WHO_9_CATEGORIES.find((c) => c.key === "GAY_COM_NANG");
    if (whz.code === "GAY_COM") return WHO_9_CATEGORIES.find((c) => c.key === "GAY_COM");
    if (whz.code === "BEO_PHI" || waz.code === "BEO_PHI") return WHO_9_CATEGORIES.find((c) => c.key === "BEO_PHI");
    if (whz.code === "THUA_CAN" || waz.code === "THUA_CAN") return WHO_9_CATEGORIES.find((c) => c.key === "THUA_CAN");
    return WHO_9_CATEGORIES.find((c) => c.key === "DAT_CHUAN");
  }, [latestEvaluation]);

  return (
    <section className="space-y-3.5 sm:space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 p-3.5 sm:p-5 shadow-xs border border-sky-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 bg-white text-indigo-600 rounded-xl shadow-xs border border-sky-100 shrink-0">
            <HeartPulse size={20} />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-black text-slate-800">
              Sức khỏe thể trạng {child.hoTen ? `— ${child.hoTen}` : ''}
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
              Theo dõi chiều cao, cân nặng và thể trạng phát triển theo chuẩn tăng trưởng WHO.
            </p>
          </div>
        </div>
      </div>

      {/* Latest Evaluation Card */}
      {latest && latestEvaluation && (
        <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-3.5 sm:p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: currentCategoryMeta?.color || "#10b981" }}
              />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Kỳ đo {latestQuarter.quarter}:
                </span>
                <span className="text-sm sm:text-base font-black text-slate-800">
                  {currentCategoryMeta?.label || latestEvaluation.trangThaiTongThe}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 self-start sm:self-auto text-xs">
              <span className="text-slate-600">
                Cao: <b>{latest.chieuCao} cm</b>
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-600">
                Nặng: <b>{latest.canNang} kg</b>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-2 sm:p-3 text-center sm:text-left">
              <span className="text-[9px] font-bold uppercase text-blue-700 tracking-wider block truncate">
                Chiều cao
              </span>
              <span className="text-xs sm:text-sm font-black text-blue-900 mt-0.5 block truncate">
                {latestEvaluation.haz.label}
              </span>
            </div>

            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-2 sm:p-3 text-center sm:text-left">
              <span className="text-[9px] font-bold uppercase text-amber-700 tracking-wider block truncate">
                Cân nặng
              </span>
              <span className="text-xs sm:text-sm font-black text-amber-900 mt-0.5 block truncate">
                {latestEvaluation.waz.label}
              </span>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-2 sm:p-3 text-center sm:text-left">
              <span className="text-[9px] font-bold uppercase text-emerald-700 tracking-wider block truncate">
                Thể trạng
              </span>
              <span className="text-xs sm:text-sm font-black text-emerald-900 mt-0.5 block truncate">
                {latestEvaluation.whz.label}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Growth Chart */}
      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-emerald-600" size={32} />
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

      {/* Detail history table */}
      <ParentHealthHistoryTable records={records} child={child} />
    </section>
  );
}
