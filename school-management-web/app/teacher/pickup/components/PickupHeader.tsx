import React from 'react';
import { CheckCircle2, Users } from 'lucide-react';

interface PickupHeaderProps {
  className: string;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
}

export function PickupHeader({
  className,
  toastMessage,
  setToastMessage,
}: PickupHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 text-white shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-orange-100 flex items-center gap-1 mb-0.5">
            <Users size={13} /> Sổ đón trả học sinh
          </span>
          <h1 className="text-base sm:text-xl font-black">
            Đón trả trẻ
          </h1>
          <p className="text-[11px] text-orange-100/90 mt-0.5 hidden sm:block">
            Đối chiếu thông tin người đón hợp lệ & xác nhận bàn giao trẻ theo quy chuẩn an toàn.
          </p>
        </div>

        <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-xl px-3 py-1.5 shrink-0 flex items-center gap-2.5 self-start md:self-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-200 animate-pulse shrink-0" />
          <div>
            <div className="text-[9px] font-bold text-orange-100 uppercase tracking-wider">
              Lớp phụ trách
            </div>
            <div className="text-xs sm:text-sm font-black text-white">
              {className || 'Lớp phụ trách'}
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-orange-900 text-sm font-bold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-orange-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-orange-500 hover:text-orange-700 cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
