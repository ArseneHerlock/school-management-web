"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Wallet,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import {
  DomainProgressStat,
  TuitionLedgerStats,
} from "@/services/adminDashboardTypes";

interface TuitionAndDomainProgressChartsProps {
  tuitionLedger: TuitionLedgerStats;
  domainProgress: DomainProgressStat[];
  onNavigate?: (tab: string) => void;
}

const formatVND = (val: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(val || 0);
};

export function TuitionAndDomainProgressCharts({
  tuitionLedger,
  domainProgress = [],
  onNavigate,
}: TuitionAndDomainProgressChartsProps) {
  const financialChartData = [
    {
      name: "Đã thu thành công",
      value: tuitionLedger.totalCollected,
      color: "#0ea5e9",
      labelShort: "Đã thu",
    },
    {
      name: "Còn nợ chưa đóng",
      value: tuitionLedger.totalOutstanding,
      color: "#f43f5e",
      labelShort: "Còn nợ",
    },
  ].filter((item) => item.value > 0);

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 max-w-full min-w-0">
      {/* 3. Biểu đồ Tiến độ Thu Học phí & Dòng tiền */}
      <section className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xs flex flex-col justify-between max-w-full min-w-0">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                <Wallet size={16} />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-black text-slate-800 truncate">
                  Thu Học phí & Dòng tiền ({tuitionLedger.periodLabel})
                </h3>
                <p className="text-[11px] text-slate-400 truncate">
                  Tiến độ thu học phí chính khóa & tiền ăn bán trú
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-black text-sky-700 border border-sky-200">
                Đạt {tuitionLedger.collectionRate}% chỉ tiêu
              </span>
              {onNavigate && (
                <button
                  onClick={() => onNavigate("hoc-phi")}
                  className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-0.5 cursor-pointer ml-1"
                >
                  <span className="hidden sm:inline">Sổ học phí</span>
                  <ArrowRight size={13} />
                </button>
              )}
            </div>
          </div>

          {tuitionLedger.totalExpected === 0 ? (
            <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-slate-200 my-4 text-center text-xs text-slate-400">
              Chưa có hóa đơn học phí hoặc phiếu thu nào được phát hành trong kỳ này.
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 items-center gap-3">
              <div className="h-44 sm:h-52 w-full relative min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={financialChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={46}
                      outerRadius={68}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {financialChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any, name: any) => [
                        formatVND(Number(val)),
                        name,
                      ]}
                      contentStyle={{
                        borderRadius: "0.85rem",
                        borderColor: "#e2e8f0",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                        fontSize: "12px",
                        padding: "8px 12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl sm:text-2xl font-black text-sky-700">
                    {tuitionLedger.collectionRate}%
                  </span>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wide">
                    Đã thu
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Tổng dự thu kỳ này
                  </span>
                  <p className="text-base sm:text-lg font-black text-slate-800 mt-0.5 truncate">
                    {formatVND(tuitionLedger.totalExpected)}
                  </p>
                </div>

                <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-sky-600 uppercase">
                      Đã thanh toán ({tuitionLedger.collectionRate}%)
                    </span>
                    <CheckCircle2 size={12} className="text-sky-600" />
                  </div>
                  <p className="text-base sm:text-lg font-black text-sky-800 mt-0.5 truncate">
                    {formatVND(tuitionLedger.totalCollected)}
                  </p>
                </div>

                <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-600 uppercase">
                      Còn nợ cần thu
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                  </div>
                  <p className="text-base sm:text-lg font-black text-rose-700 mt-0.5 truncate">
                    {formatVND(tuitionLedger.totalOutstanding)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-2 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="truncate">Học phí chính khóa & bán trú</span>
          <span className="font-bold text-sky-700 shrink-0 ml-2">Đối soát tự động</span>
        </div>
      </section>

      {/* 4. Biểu đồ 5 Lĩnh vực Phát triển Mầm non */}
      <section className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xs flex flex-col justify-between max-w-full min-w-0">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <Sparkles size={16} />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-black text-slate-800 truncate">
                  5 Lĩnh vực Phát triển Trẻ em
                </h3>
                <p className="text-[11px] text-slate-400 truncate">
                  Chuẩn chương trình Giáo dục Mầm non Bộ GD&ĐT
                </p>
              </div>
            </div>

            {onNavigate && (
              <button
                onClick={() => onNavigate("danh-gia")}
                className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-0.5 self-start sm:self-auto cursor-pointer shrink-0"
              >
                <span className="hidden sm:inline">Sổ đánh giá</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>

          {domainProgress.length === 0 ? (
            <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-slate-200 my-4 text-center text-xs text-slate-400">
              Chưa có dữ liệu phiếu đánh giá định kỳ nào cho học sinh.
            </div>
          ) : (
            <div className="mt-3 space-y-2.5">
              {domainProgress.map((dom) => (
                <div key={dom.domainId} className="space-y-1 min-w-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 truncate max-w-[180px] sm:max-w-[240px]">
                      {dom.domainName}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] sm:text-[11px] text-slate-400">
                        {dom.passCount}/{dom.totalAssessments} đạt
                      </span>
                      <span
                        className="font-black px-1.5 py-0.5 rounded-md text-[11px]"
                        style={{
                          color: dom.color,
                          backgroundColor: `${dom.color}15`,
                        }}
                      >
                        {dom.passRate}%
                      </span>
                    </div>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${dom.passRate}%`,
                        backgroundColor: dom.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-2 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="truncate">Thể chất, Nhận thức, Ngôn ngữ, Xã hội, Thẩm mỹ</span>
          <span className="font-bold text-purple-700 shrink-0 ml-2">Chuẩn GDMN</span>
        </div>
      </section>
    </div>
  );
}
