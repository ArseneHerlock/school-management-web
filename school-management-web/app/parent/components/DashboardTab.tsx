'use client';

import React from 'react';
import { ChildInfo, ParentProfile } from '../types';
import { WEEKLY_ATTENDANCE, TIMELINE_TODAY } from '../data/mockData';

interface DashboardTabProps {
  child: ChildInfo;
  parent: ParentProfile;
  onNavigateTab: (tabId: string) => void;
}

export default function DashboardTab({ child, parent, onNavigateTab }: DashboardTabProps) {
  return (
    <section className="space-y-5">
      {/* Hero Card */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 rounded-3xl p-6 sm:p-7 text-white shadow-xs relative overflow-hidden">
        <div className="absolute right-0 -top-6 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 border border-white/25 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2">
              <span>👋 Chào buổi sáng, {parent.moiQuanHe} {parent.hoTen.split(' ').slice(-1)[0]}!</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bé <span className="text-yellow-300">{child.hoTen}</span>
            </h2>
            <p className="text-sky-100 text-sm font-medium mt-1">
              {child.lop} · {child.giaoVienChuNhiem} (GVCN)
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 text-xs">
            <span className="bg-emerald-400/25 border border-emerald-300/60 text-white px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-300"></span> Đã có mặt tại lớp
            </span>
            <span className="bg-white/15 px-3 py-1.5 rounded-xl font-medium text-sky-100">
              ⏰ Điểm danh: 07:42 sáng
            </span>
          </div>
        </div>
      </div>

      {/* 4 Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Stat 1 */}
        <div className="card-frame p-4 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Điểm chuyên cần</p>
            <p className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5">94%</p>
            <p className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-0.5">
              ↑ +2% so với tháng trước
            </p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="card-frame p-4 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đánh giá tuần</p>
            <p className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5">4.8 / 5</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">Xuất sắc & chăm ngoan</p>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="card-frame p-4 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ăn & Sức khỏe</p>
            <p className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5">Rất tốt</p>
            <p className="text-[11px] font-semibold text-emerald-600 mt-1">Ăn hết suất, ngủ đủ</p>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="card-frame p-4 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sĩ số lớp Chồi 2</p>
            <p className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5">22 bé</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">Có mặt: 21 · Vắng: 1</p>
          </div>
        </div>
      </div>

      {/* Weekly attendance card */}
      <div className="card-frame p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-slate-800 text-sm">Điểm danh tuần này (Tuần 38)</h3>
          <span className="text-xs font-semibold text-slate-500">Tháng 9/2026</span>
        </div>
        <div className="grid grid-cols-5 gap-2.5">
          {WEEKLY_ATTENDANCE.map((item, idx) => {
            const isToday = item.dayOfWeek === 'Hôm nay';
            const isLeave = item.status === 'leave';
            return (
              <div
                key={idx}
                className={`flex flex-col items-center p-2.5 rounded-xl border ${
                  isToday
                    ? 'bg-sky-50 border-sky-300 ring-1 ring-sky-300'
                    : isLeave
                    ? 'bg-rose-50 border-rose-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className={`text-xs font-bold mb-2 ${isToday ? 'text-sky-800' : isLeave ? 'text-rose-700' : 'text-slate-600'}`}>
                  {item.dayOfWeek}
                </span>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm ${
                    isToday
                      ? 'bg-sky-500 text-white'
                      : isLeave
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {item.symbol}
                </div>
                <span className={`text-[10px] mt-1 font-semibold ${isToday ? 'text-sky-700 font-bold' : isLeave ? 'text-rose-700 font-bold' : 'text-slate-500'}`}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Khung thông báo vàng - Cân bằng viền 4.5/10 */}
      <div className="notice-frame p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="p-1.5 bg-amber-500 text-white rounded-lg shadow-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
          </span>
          <h3 className="font-extrabold text-slate-800 text-sm">Thông báo quan trọng từ nhà trường</h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div
            onClick={() => onNavigateTab('tuition')}
            className="notice-subcard cursor-pointer p-3.5 flex items-start gap-3"
          >
            <div className="text-2xl shrink-0">💳</div>
            <div>
              <p className="text-sm font-bold text-slate-800">Học phí tháng 10/2026</p>
              <p className="text-xs text-slate-500 mt-0.5">Hạn nộp: 05/10/2026 · Tổng: 4.400.000đ</p>
              <span className="inline-block mt-2 text-xs font-bold text-sky-600 hover:underline">
                Thanh toán ngay →
              </span>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('news')}
            className="notice-subcard cursor-pointer p-3.5 flex items-start gap-3"
          >
            <div className="text-2xl shrink-0">🏮</div>
            <div>
              <p className="text-sm font-bold text-slate-800">Đêm hội Trăng Rằm 2026</p>
              <p className="text-xs text-slate-500 mt-0.5">17:30 ngày 28/09/2026 tại sân trường</p>
              <span className="inline-block mt-2 text-xs font-bold text-amber-700 hover:underline">
                Xem chi tiết sự kiện →
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily schedule timeline */}
      <div className="card-frame p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-slate-800 text-sm">Lịch sinh hoạt hôm nay</h3>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            Đúng tiến độ
          </span>
        </div>
        <div className="space-y-2.5">
          {TIMELINE_TODAY.map((item, idx) => {
            const isDone = item.status === 'done';
            const isCurrent = item.status === 'current';
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2.5 rounded-xl border ${
                  isDone
                    ? 'bg-slate-50/70 border-slate-200/80 opacity-60'
                    : isCurrent
                    ? 'bg-sky-50 border-sky-300 ring-1 ring-sky-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isDone ? 'bg-slate-400' : isCurrent ? 'bg-sky-500 animate-ping' : 'bg-slate-300'
                  }`}
                />
                <span
                  className={`text-xs font-bold w-28 shrink-0 ${
                    isCurrent ? 'text-sky-800 font-extrabold' : 'text-slate-500'
                  }`}
                >
                  {item.time}
                </span>
                <span
                  className={`text-sm font-medium ${
                    isCurrent ? 'text-sky-900 font-bold' : 'text-slate-700'
                  }`}
                >
                  {item.title}
                </span>
                <span
                  className={`ml-auto text-xs px-2 py-0.5 rounded-md font-bold ${
                    isDone
                      ? 'text-emerald-700 bg-emerald-100/70'
                      : isCurrent
                      ? 'text-sky-700 bg-sky-200/80 font-extrabold'
                      : 'text-slate-400 font-medium'
                  }`}
                >
                  {item.statusLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
