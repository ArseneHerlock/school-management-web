'use client';

import React from 'react';
import Link from 'next/link';
import { UserCheck, UserX, FileCheck2, ChevronRight, MessageSquare, ArrowRight } from 'lucide-react';

interface TeacherKpiCardsProps {
  presentCount: number;
  totalStudents: number;
  attendanceRate: number;
  absentCount: number;
  pendingLeaveCount: number;
}

export function TeacherKpiCards({
  presentCount,
  totalStudents,
  attendanceRate,
  absentCount,
  pendingLeaveCount,
}: TeacherKpiCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Link
        href="/teacher/attendance"
        className="group rounded-3xl border border-emerald-100 bg-white p-4.5 shadow-xs transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">Trẻ có mặt hôm nay</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
            <UserCheck size={18} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-800">{presentCount}</span>
          <span className="text-xs font-bold text-emerald-600">/ {totalStudents} trẻ</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tỷ lệ chuyên cần</span>
          <span className="font-extrabold text-emerald-600">{attendanceRate}%</span>
        </div>
      </Link>

      <Link
        href="/teacher/attendance"
        className="group rounded-3xl border border-rose-100 bg-white p-4.5 shadow-xs transition hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">Trẻ nghỉ học</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition">
            <UserX size={18} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-rose-600">{absentCount}</span>
          <span className="text-xs text-slate-400">trẻ</span>
        </div>
        <div className="mt-2.5 text-[11px] text-slate-400 truncate">
          {absentCount > 0 ? 'Cần kiểm tra đơn nghỉ' : 'Sĩ số đầy đủ'}
        </div>
      </Link>

      <Link
        href="/teacher/leave"
        className="group rounded-3xl border border-orange-100 bg-white p-4.5 shadow-xs transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">Đơn xin nghỉ phép</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition">
            <FileCheck2 size={18} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-black text-orange-600">{pendingLeaveCount}</span>
          <span className="text-xs text-slate-400">chờ duyệt</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Xác nhận ngay</span>
          <ChevronRight size={13} className="text-orange-500 group-hover:translate-x-0.5 transition" />
        </div>
      </Link>

      <Link
        href="/teacher/messages"
        className="group rounded-3xl border border-blue-100 bg-white p-4.5 shadow-xs transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">Trao đổi phụ huynh</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
            <MessageSquare size={18} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-black text-blue-600">Sổ liên lạc</span>
          <span className="text-xs text-slate-400">trực tuyến</span>
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-blue-600 font-semibold">
          <span>Xem tin nhắn</span>
          <ArrowRight size={13} />
        </div>
      </Link>
    </div>
  );
}
