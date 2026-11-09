'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { RecentPickupLog, formatPickupTime } from '../types';

interface PickupHistoryTableProps {
  history: RecentPickupLog[];
}

export function PickupHistoryTable({ history }: PickupHistoryTableProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Clock className="text-indigo-600" /> Nhật ký đón trả học sinh thực tế
      </h2>

      {history.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm">
          Chưa có nhật ký trả trẻ nào được ghi nhận cho bé.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-black uppercase text-slate-400">
                <th className="py-3 px-4">Ngày đón</th>
                <th className="py-3 px-4">Giờ về</th>
                <th className="py-3 px-4">Người đón bé</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Ghi chú bàn giao</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((log) => (
                <tr key={log.Id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {new Date(log.Ngay).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-3 px-4 text-indigo-700 font-bold">
                    {formatPickupTime(log.GioVe)}
                  </td>
                  <td className="py-3 px-4 font-black text-slate-900">
                    {log.NguoiDon || 'Phụ huynh đón'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                      {log.TrangThai || 'Đã về'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500">
                    {log.GhiChu || log.LyDoVeSom || 'Bàn giao an toàn'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
