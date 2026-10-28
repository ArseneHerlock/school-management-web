'use client';

import React from 'react';
import {
  CalendarCheck,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  LogOut,
  Sparkles,
  AlertCircle,
  Edit3,
} from 'lucide-react';
import Avatar from '../../components/Avatar';
import { Child } from '../../data';

interface AttendanceListProps {
  childrenList: Child[];
  absentIds: Set<number>;
  lateIds: Set<number>;
  approvedLeaveMap: Map<number, { reason: string; fromDate: string; toDate: string }>;
  noteMap: Record<number, string>;
  mode: 'DEN' | 'VE';
  toggle: (id: number, type: 'absent' | 'late') => void;
  onOpenNote: (id: number) => void;
}

export const AttendanceList: React.FC<AttendanceListProps> = ({
  childrenList,
  absentIds,
  lateIds,
  approvedLeaveMap,
  noteMap,
  mode,
  toggle,
  onOpenNote,
}) => {
  if (childrenList.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <p className="text-sm font-bold text-slate-500">
          Không tìm thấy học sinh nào phù hợp với bộ lọc.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
      {childrenList.map((child, index) => {
        const isAbsent = absentIds.has(child.id);
        const isLate = lateIds.has(child.id);
        const isPresent = !isAbsent && !isLate;
        const approvedLeave = approvedLeaveMap.get(child.id);
        const noteText = noteMap[child.id];

        return (
          <div
            key={child.id || index}
            className={`flex flex-col justify-between rounded-3xl border p-4 transition-all duration-200 shadow-xs ${
              approvedLeave
                ? 'bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border-emerald-300 ring-1 ring-emerald-300/50'
                : isAbsent
                ? 'bg-rose-50/60 border-rose-200 ring-1 ring-rose-200/50'
                : isLate
                ? 'bg-amber-50/60 border-amber-200 ring-1 ring-amber-200/50'
                : 'bg-white border-slate-200/80 hover:border-orange-300 hover:shadow-sm'
            }`}
          >
            {/* Hàng trên: Avatar, Thông tin tên bé, Giới tính, Tuổi & Huy hiệu nghỉ phép */}
            <div className="flex items-start gap-3.5">
              <div className="relative">
                <Avatar initials={child.avatar} id={child.id} size="md" />
                <span
                  className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white shadow-xs ${
                    child.gender === 'F' ? 'bg-rose-400' : 'bg-blue-400'
                  }`}
                  title={child.gender === 'F' ? 'Bé gái' : 'Bé trai'}
                >
                  {child.gender === 'F' ? '♀' : '♂'}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-black text-sm text-slate-800 leading-snug">
                    {child.name || 'Chưa cập nhật tên'}
                  </h3>
                  {child.nickname && (
                    <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/50">
                      ({child.nickname})
                    </span>
                  )}
                </div>

                <div className="mt-1 flex items-center gap-2 text-xs text-slate-400 font-semibold">
                  {child.dob && <span>Sinh ngày: {child.dob}</span>}
                  {child.parentPhone && <span>· SĐT: {child.parentPhone}</span>}
                </div>

                {/* Huy hiệu nếu đã duyệt đơn nghỉ phép */}
                {approvedLeave && (
                  <div className="mt-2 flex items-start gap-1.5 rounded-xl bg-emerald-100/70 border border-emerald-300 px-2.5 py-1.5 text-xs text-emerald-800 font-bold">
                    <CalendarCheck size={14} className="shrink-0 mt-0.5 text-emerald-700" />
                    <div>
                      <span>Đã duyệt nghỉ: {approvedLeave.reason}</span>
                      <span className="text-[10px] text-emerald-600 font-medium block">
                        (
                        {approvedLeave.fromDate === approvedLeave.toDate
                          ? approvedLeave.fromDate
                          : `${approvedLeave.fromDate} → ${approvedLeave.toDate}`}
                        )
                      </span>
                    </div>
                  </div>
                )}

                {/* Ghi chú giáo viên */}
                {noteText && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white/80 border border-slate-200 px-2.5 py-1 rounded-xl">
                    <FileText size={13} className="text-orange-500 shrink-0" />
                    <span className="truncate italic">Ghi chú: {noteText}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Hàng dưới: Nút điều khiển trạng thái (Có mặt / Trễ / Vắng / Ghi chú) */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              {mode === 'DEN' ? (
                <>
                  <div className="flex items-center gap-1.5 flex-1">
                    {/* Nút Có mặt */}
                    <button
                      onClick={() => {
                        if (isAbsent) toggle(child.id, 'absent');
                        if (isLate) toggle(child.id, 'late');
                      }}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        isPresent
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 ring-2 ring-emerald-400'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle size={13} />
                      <span>Có mặt</span>
                    </button>

                    {/* Nút Trễ */}
                    <button
                      onClick={() => toggle(child.id, 'late')}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        isLate
                          ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30 ring-2 ring-amber-400'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Clock size={13} />
                      <span>Trễ</span>
                    </button>

                    {/* Nút Vắng */}
                    <button
                      onClick={() => toggle(child.id, 'absent')}
                      className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        isAbsent
                          ? approvedLeave
                            ? 'bg-teal-700 text-white shadow-sm shadow-teal-700/30 ring-2 ring-teal-500'
                            : 'bg-rose-500 text-white shadow-sm shadow-rose-500/30 ring-2 ring-rose-400'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <XCircle size={13} />
                      <span>{approvedLeave && isAbsent ? 'Có phép' : 'Vắng'}</span>
                    </button>
                  </div>

                  {/* Nút Ghi chú */}
                  <button
                    onClick={() => onOpenNote(child.id)}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all cursor-pointer ${
                      noteText
                        ? 'bg-orange-100 border-orange-300 text-orange-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                    title="Viết ghi chú cá nhân cho bé"
                  >
                    <Edit3 size={14} />
                  </button>
                </>
              ) : (
                /* Chế độ Trả trẻ */
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <CheckCircle size={14} />
                    </span>
                    <span className="text-xs font-black text-slate-700">
                      Sẵn sàng trả trẻ cho phụ huynh
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenNote(child.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-orange-50 hover:text-orange-600 cursor-pointer"
                  >
                    <Edit3 size={12} />
                    <span>{noteText ? 'Sửa ghi chú' : 'Ghi chú trả trẻ'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
