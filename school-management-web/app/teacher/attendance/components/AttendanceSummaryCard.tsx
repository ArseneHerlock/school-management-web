'use client';

import React from 'react';
import {
  CalendarDays,
  UserCheck,
  UserX,
  Clock3,
  CalendarCheck,
  Users,
  Sun,
  Moon,
} from 'lucide-react';

interface AttendanceSummaryCardProps {
  mode: 'DEN' | 'VE';
  setMode: (m: 'DEN' | 'VE') => void;
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  selectedLabel: string;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  approvedLeaveCount: number;
  totalCount: number;
}

export const AttendanceSummaryCard: React.FC<AttendanceSummaryCardProps> = ({
  mode,
  setMode,
  selectedDate,
  setSelectedDate,
  selectedLabel,
  presentCount,
  absentCount,
  lateCount,
  approvedLeaveCount,
  totalCount,
}) => {
  return (
    <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 p-3 sm:p-5 text-white shadow-md shadow-orange-500/15 relative overflow-hidden max-w-full min-w-0">
      {/* Background soft decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl sm:rounded-3xl">
        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-amber-400/20 blur-xl" />
      </div>

      {/* Header dòng đầu: Tiêu đề + Chuyển chế độ Đón/Trả + Chọn ngày */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 sm:gap-4">
        <div>
          <div className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-black backdrop-blur-md text-orange-100 uppercase tracking-wider mb-1">
            {mode === 'DEN' ? <Sun size={11} className="text-amber-300" /> : <Moon size={11} className="text-amber-200" />}
            {mode === 'DEN' ? 'Ca Sáng · Điểm danh đón' : 'Ca Chiều · Xác nhận trả'}
          </div>
          <h1 className="text-base sm:text-2xl font-black tracking-tight text-white leading-tight">
            Sổ Điểm Danh Lớp
          </h1>
          <p className="text-[11px] font-semibold text-orange-100 capitalize mt-0.5">
            {selectedLabel}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Ô chọn ngày */}
          <div className="flex items-center justify-between sm:justify-start gap-1.5 rounded-xl bg-white/15 px-2.5 py-1.5 border border-white/20 backdrop-blur-md">
            <CalendarDays size={14} className="text-amber-200 shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-black text-white outline-none cursor-pointer [color-scheme:dark]"
            />
          </div>

          {/* Nút chuyển chế độ Đón trẻ / Trả trẻ */}
          <div className="grid grid-cols-2 sm:flex rounded-xl bg-black/20 p-0.5 border border-white/15 backdrop-blur-md">
            <button
              onClick={() => setMode('DEN')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                mode === 'DEN'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-orange-100 hover:text-white'
              }`}
            >
              <Sun size={12} />
              <span>Đón trẻ</span>
            </button>
            <button
              onClick={() => setMode('VE')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                mode === 'VE'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-orange-100 hover:text-white'
              }`}
            >
              <Moon size={12} />
              <span>Trả trẻ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Thẻ thống kê 5 chỉ số (KPIs) - Thu gọn hiển thị trên mobile */}
      <div className="relative z-10 grid grid-cols-5 gap-1.5 sm:gap-3 mt-3 sm:mt-4">
        <div className="rounded-xl bg-white/15 border border-white/20 p-1.5 sm:p-3 text-center backdrop-blur-md">
          <div className="text-[9px] sm:text-[11px] font-bold text-orange-100 uppercase truncate">Sĩ số</div>
          <div className="text-sm sm:text-2xl font-black text-white mt-0.5">{totalCount}</div>
        </div>

        <div className="rounded-xl bg-emerald-500/30 border border-emerald-400/40 p-1.5 sm:p-3 text-center backdrop-blur-md">
          <div className="text-[9px] sm:text-[11px] font-bold text-emerald-100 uppercase truncate">Có mặt</div>
          <div className="text-sm sm:text-2xl font-black text-white mt-0.5">{presentCount}</div>
        </div>

        <div className="rounded-xl bg-amber-500/30 border border-amber-400/40 p-1.5 sm:p-3 text-center backdrop-blur-md">
          <div className="text-[9px] sm:text-[11px] font-bold text-amber-100 uppercase truncate">Muộn</div>
          <div className="text-sm sm:text-2xl font-black text-white mt-0.5">{lateCount}</div>
        </div>

        <div className="rounded-xl bg-rose-500/30 border border-rose-400/40 p-1.5 sm:p-3 text-center backdrop-blur-md">
          <div className="text-[9px] sm:text-[11px] font-bold text-rose-100 uppercase truncate">Vắng</div>
          <div className="text-sm sm:text-2xl font-black text-white mt-0.5">{absentCount}</div>
        </div>

        <div className="rounded-xl bg-sky-500/30 border border-sky-400/40 p-1.5 sm:p-3 text-center backdrop-blur-md">
          <div className="text-[9px] sm:text-[11px] font-bold text-sky-100 uppercase truncate">Nghỉ phép</div>
          <div className="text-sm sm:text-2xl font-black text-white mt-0.5">{approvedLeaveCount}</div>
        </div>
      </div>
    </div>
  );
};
