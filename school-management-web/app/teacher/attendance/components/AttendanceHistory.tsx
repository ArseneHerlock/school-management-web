'use client';

import React from 'react';
import { History, RefreshCw, Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { Child } from '../../data';

interface AttendanceHistoryProps {
  historyRows: Array<{ childId: string; childName: string; rows: any[] }>;
  historyFrom: string;
  setHistoryFrom: (d: string) => void;
  historyTo: string;
  setHistoryTo: (d: string) => void;
  historyChildId: string;
  setHistoryChildId: (id: string) => void;
  childrenList: Child[];
  loadingData: boolean;
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  historyRows,
  historyFrom,
  setHistoryFrom,
  historyTo,
  setHistoryTo,
  historyChildId,
  setHistoryChildId,
  childrenList,
  loadingData,
}) => {
  const filteredHistory = historyRows.flatMap((group) =>
    group.rows
      .filter(() => historyChildId === 'ALL' || group.childId === historyChildId)
      .map((row) => ({ ...row, childName: group.childName }))
  );

  return (
    <section className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-orange-100/70">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
            <History size={20} />
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-base">Lịch Sử Điểm Danh</h3>
            <p className="text-xs text-slate-500 font-medium">
              Tra cứu lịch sử đón và trả trẻ theo khoảng ngày của lớp học
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">
            {filteredHistory.length} bản ghi
          </span>
          <div className="h-4 w-px bg-slate-200" />
          <RefreshCw
            size={16}
            className={loadingData ? 'animate-spin text-orange-500' : 'text-slate-300'}
          />
        </div>
      </div>

      {/* Bộ lọc khoảng thời gian & học sinh */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <label className="text-xs font-bold text-slate-600 mb-1 block">Từ ngày:</label>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2">
            <Calendar size={14} className="text-orange-500 shrink-0" />
            <input
              type="date"
              value={historyFrom}
              onChange={(e) => setHistoryFrom(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 mb-1 block">Đến ngày:</label>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2">
            <Calendar size={14} className="text-orange-500 shrink-0" />
            <input
              type="date"
              value={historyTo}
              onChange={(e) => setHistoryTo(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-600 mb-1 block">Chọn học sinh:</label>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2">
            <User size={14} className="text-orange-500 shrink-0" />
            <select
              value={historyChildId}
              onChange={(e) => setHistoryChildId(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="ALL">Tất cả học sinh trong lớp</option>
              {childrenList
                .filter((child) => child.apiId)
                .map((child) => (
                  <option key={child.apiId} value={child.apiId}>
                    {child.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bảng danh sách lịch sử */}
      <div className="mt-5 max-h-96 overflow-y-auto rounded-2xl border border-slate-100 divide-y divide-slate-100">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((row: any, index) => {
            const dateStr = String(row.ngay || row.Ngay || '').slice(0, 10);
            const arriveTime = String(row.gioDen || row.GioDen || '').slice(0, 5);
            const leaveTime = String(row.gioVe || row.GioVe || '').slice(0, 5);
            const status = row.trangThai || row.TrangThai || 'Có mặt';

            const isPresent = status === 'Có mặt';
            const isLate = status.includes('muộn') || status.includes('trễ');
            const isAbsent = status.includes('Vắng') || status.includes('nghỉ');

            return (
              <div
                key={row.id || index}
                className="flex items-center justify-between gap-3 p-3.5 hover:bg-orange-50/30 transition"
              >
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-800">{row.childName}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="font-semibold text-slate-600">{dateStr}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-emerald-500" />
                      Đến: {arriveTime || '—'}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-amber-500" />
                      Về: {leaveTime || '—'}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black ${
                      isAbsent
                        ? 'bg-rose-100 text-rose-700'
                        : isLate
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {status}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 font-semibold">
            Không có dữ liệu điểm danh trong khoảng thời gian đã chọn.
          </div>
        )}
      </div>
    </section>
  );
};
