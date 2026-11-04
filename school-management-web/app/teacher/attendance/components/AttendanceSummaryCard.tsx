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
    <div className="rounded-3xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 p-4 sm:p-6 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden max-w-full min-w-0">
      {/* Background soft decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-amber-400/20 blur-xl" />
      </div>

      {/* Header dòng đầu: Tiêu đề + Chuyển chế độ Đón/Trả + Chọn ngày */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-black backdrop-blur-md text-orange-100 uppercase tracking-wider mb-1.5">
            {mode === 'DEN' ? <Sun size={12} className="text-amber-300" /> : <Moon size={12} className="text-amber-200" />}
            {mode === 'DEN' ? 'Ca Sáng · Điểm danh đón trẻ' : 'Ca Chiều · Xác nhận trả trẻ'}
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Sổ Điểm Danh Lớp Học
          </h1>
          <p className="text-xs font-semibold text-orange-100 capitalize mt-0.5">
            {selectedLabel}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Ô chọn ngày */}
          <div className="flex items-center justify-between sm:justify-start gap-2 rounded-2xl bg-white/15 px-3 py-2 border border-white/20 backdrop-blur-md">
            <span className="flex items-center gap-2">
              <CalendarDays size={16} className="text-amber-200" />
              <span className="text-[11px] font-bold sm:hidden">Ngày:</span>
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-black text-white outline-none cursor-pointer [color-scheme:dark]"
            />
          </div>

          {/* Nút chuyển chế độ Đón trẻ / Trả trẻ */}
          <div className="grid grid-cols-2 sm:flex rounded-2xl bg-black/20 p-1 border border-white/15 backdrop-blur-md">
            <button
              onClick={() => setMode('DEN')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                mode === 'DEN'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-orange-100 hover:text-white'
              }`}
            >
              <Sun size={13} />
              <span>Đón trẻ (Sáng)</span>
            </button>
            <button
              onClick={() => setMode('VE')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                mode === 'VE'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-orange-100 hover:text-white'
              }`}
            >
              <Moon size={13} />
              <span>Trả trẻ (Chiều)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Thẻ thống kê 5 chỉ số (KPIs) */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
        <div className="rounded-2xl bg-white/15 border border-white/20 p-3 text-center backdrop-blur-md transition hover:bg-white/20">
          <div className="flex items-center justify-center gap-1.5 text-orange-100 text-[11px] font-black uppercase mb-1">
            <Users size={14} />
            <span>Tổng sĩ số</span>
          </div>
          <div className="text-2xl font-black text-white">{totalCount}</div>
          <div className="text-[10px] text-orange-200 font-semibold mt-0.5">Học sinh trong lớp</div>
        </div>

        <div className="rounded-2xl bg-emerald-500/30 border border-emerald-400/40 p-3 text-center backdrop-blur-md transition hover:bg-emerald-500/40">
          <div className="flex items-center justify-center gap-1.5 text-emerald-100 text-[11px] font-black uppercase mb-1">
            <UserCheck size={14} className="text-emerald-300" />
            <span>Có mặt</span>
          </div>
          <div className="text-2xl font-black text-white">{presentCount}</div>
          <div className="text-[10px] text-emerald-200 font-semibold mt-0.5">
            {totalCount ? `${Math.round((presentCount / totalCount) * 100)}% sĩ số` : '0%'}
          </div>
        </div>

        <div className="rounded-2xl bg-amber-500/30 border border-amber-400/40 p-3 text-center backdrop-blur-md transition hover:bg-amber-500/40">
          <div className="flex items-center justify-center gap-1.5 text-amber-100 text-[11px] font-black uppercase mb-1">
            <Clock3 size={14} className="text-amber-300" />
            <span>Đến muộn</span>
          </div>
          <div className="text-2xl font-black text-white">{lateCount}</div>
          <div className="text-[10px] text-amber-200 font-semibold mt-0.5">Đã đón trễ giờ</div>
        </div>

        <div className="rounded-2xl bg-rose-500/30 border border-rose-400/40 p-3 text-center backdrop-blur-md transition hover:bg-rose-500/40">
          <div className="flex items-center justify-center gap-1.5 text-rose-100 text-[11px] font-black uppercase mb-1">
            <UserX size={14} className="text-rose-300" />
            <span>Vắng mặt</span>
          </div>
          <div className="text-2xl font-black text-white">{absentCount}</div>
          <div className="text-[10px] text-rose-200 font-semibold mt-0.5">Chưa thấy đến lớp</div>
        </div>

        <div className="rounded-2xl bg-sky-500/30 border border-sky-400/40 p-3 text-center backdrop-blur-md transition hover:bg-sky-500/40 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-center gap-1.5 text-sky-100 text-[11px] font-black uppercase mb-1">
            <CalendarCheck size={14} className="text-sky-300" />
            <span>Duyệt nghỉ</span>
          </div>
          <div className="text-2xl font-black text-white">{approvedLeaveCount}</div>
          <div className="text-[10px] text-sky-200 font-semibold mt-0.5">Đã duyệt phép</div>
        </div>
      </div>
    </div>
  );
};
