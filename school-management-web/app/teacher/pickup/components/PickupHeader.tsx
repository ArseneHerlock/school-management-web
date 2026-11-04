import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PickupHeaderProps {
  classes: any[];
  selectedClassId: string;
  setSelectedClassId: (id: string) => void;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

export function PickupHeader({
  classes,
  selectedClassId,
  setSelectedClassId,
  toastMessage,
  setToastMessage,
}: PickupHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-100 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck size={16} /> Quản lý đón trẻ & Trả bé
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Đón Trả Bé - Giờ Tan Trường
          </h1>
          <p className="text-teal-50 text-xs sm:text-sm mt-1">
            Xác nhận người đón nhanh chóng. Khi nhấn Đã đón, hệ thống sẽ tự động đồng bộ giờ về và người đón vào sổ điểm danh.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 shrink-0 min-w-[220px]">
          <div className="text-[11px] font-bold text-teal-100 uppercase mb-1">
            Lớp học đang xem
          </div>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="w-full text-sm font-bold bg-white text-slate-800 rounded-xl p-2 focus:outline-none cursor-pointer"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.tenLop}
              </option>
            ))}
          </select>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-500 hover:text-emerald-700 cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
