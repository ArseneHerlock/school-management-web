"use client";

import React, { useState } from "react";
import { Compass, Calendar, RefreshCw, Sparkles } from "lucide-react";
import { AdminRunFcmModal } from "./AdminRunFcmModal";

interface FcmHeaderProps {
  month: number;
  setMonth: (val: number) => void;
  year: number;
  setYear: (val: number) => void;
  loading: boolean;
  onRefresh: () => void;
  error?: string;
}

export function FcmHeader({
  month,
  setMonth,
  year,
  setYear,
  loading,
  onRefresh,
  error,
}: FcmHeaderProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              Phân loại năng lực trẻ (FCM)
            </h1>
          </div>

          {/* Actions & Date Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
              <Calendar size={15} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-600">Kỳ:</span>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="bg-transparent text-xs font-black text-slate-800 outline-none cursor-pointer"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    Tháng {m}
                  </option>
                ))}
              </select>
              <span className="text-xs font-bold text-slate-400">/</span>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="bg-transparent text-xs font-black text-slate-800 outline-none cursor-pointer"
              >
                {[2024, 2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition cursor-pointer"
            >
              <RefreshCw
                size={14}
                className={loading ? "animate-spin text-indigo-600" : ""}
              />
              <span>Làm mới</span>
            </button>

            {/* Nút chạy FCM chỉ dành cho Admin */}
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-bold shadow-md shadow-indigo-600/25 transition cursor-pointer"
            >
              <Sparkles size={15} />
              <span>Phân loại trẻ bằng FCM</span>
            </button>
          </div>
        </div>
      </div>

      <AdminRunFcmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={onRefresh}
        defaultMonth={month}
        defaultYear={year}
      />
    </>
  );
}
