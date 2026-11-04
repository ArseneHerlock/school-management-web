'use client';

import React from 'react';
import {
  CalendarCheck,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  LogOut,
  Edit3,
  Lock,
  UserCheck,
  Check,
} from 'lucide-react';
import Avatar from '../../components/Avatar';
import { Child } from '../../data';

interface AttendanceChildCardProps {
  child: Child;
  isAbsent: boolean;
  isLate: boolean;
  isPresent: boolean;
  approvedLeave?: { reason: string; fromDate: string; toDate: string };
  noteText?: string;
  mode: 'DEN' | 'VE';
  isLocked: boolean;
  isCheckedOut: boolean;
  earlyPickupInfo?: { time: string; nguoiDon: string; lyDo: string };
  toggle: (id: number, type: 'absent' | 'late') => void;
  onOpenNote: (id: number) => void;
  onOpenLateArrival: (child: Child) => void;
  onOpenEarlyPickup: (child: Child) => void;
  onCheckOutChild: (child: Child) => void;
}

export function AttendanceChildCard({
  child,
  isAbsent,
  isLate,
  isPresent,
  approvedLeave,
  noteText,
  mode,
  isLocked,
  isCheckedOut,
  earlyPickupInfo,
  toggle,
  onOpenNote,
  onOpenLateArrival,
  onOpenEarlyPickup,
  onCheckOutChild,
}: AttendanceChildCardProps) {
  return (
    <div
      className={`flex flex-col justify-between rounded-3xl border p-4 transition-all duration-200 shadow-xs ${
        earlyPickupInfo
          ? 'bg-rose-50/50 border-rose-200 ring-1 ring-rose-300/40'
          : isCheckedOut && mode === 'VE'
          ? 'bg-emerald-50/50 border-emerald-200 ring-1 ring-emerald-300/40'
          : approvedLeave
          ? 'bg-teal-50/40 border-teal-200 ring-1 ring-teal-300/40'
          : isAbsent
          ? 'bg-rose-50/60 border-rose-200'
          : isLate
          ? 'bg-amber-50/60 border-amber-200'
          : 'bg-white border-slate-200 hover:border-orange-300'
      }`}
    >
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

            {earlyPickupInfo && (
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white">
                Đã về sớm
              </span>
            )}
            {isCheckedOut && mode === 'VE' && !earlyPickupInfo && (
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                Đã trả trẻ
              </span>
            )}
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400 font-semibold">
            {child.dob && <span>Sinh ngày: {child.dob}</span>}
            {child.parentPhone && <span>· SĐT: {child.parentPhone}</span>}
          </div>

          {approvedLeave && (
            <div className="mt-2 flex items-start gap-1.5 rounded-xl bg-teal-100/70 border border-teal-300 px-2.5 py-1.5 text-xs text-teal-900 font-bold">
              <CalendarCheck size={14} className="shrink-0 mt-0.5 text-teal-700" />
              <div>
                <span>Đơn nghỉ phép: {approvedLeave.reason}</span>
                <span className="text-[10px] text-teal-700 font-medium block">
                  ({approvedLeave.fromDate === approvedLeave.toDate ? approvedLeave.fromDate : `${approvedLeave.fromDate} → ${approvedLeave.toDate}`})
                </span>
              </div>
            </div>
          )}

          {earlyPickupInfo && (
            <div className="mt-2 flex items-start gap-1.5 rounded-xl bg-rose-100/80 border border-rose-300 p-2 text-xs text-rose-900">
              <LogOut size={13} className="shrink-0 mt-0.5 text-rose-700" />
              <div>
                <strong>Đã về lúc {earlyPickupInfo.time}:</strong> Bàn giao cho{' '}
                <strong>{earlyPickupInfo.nguoiDon}</strong> ({earlyPickupInfo.lyDo})
              </div>
            </div>
          )}

          {noteText && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white/80 border border-slate-200 px-2.5 py-1 rounded-xl">
              <FileText size={13} className="text-orange-500 shrink-0" />
              <span className="truncate italic">Ghi chú: {noteText}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        {mode === 'DEN' ? (
          <>
            {isLocked ? (
              <div className="flex-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Lock size={13} className="text-slate-400" />
                  <span className="text-slate-500">
                    {isAbsent ? (
                      <span className="text-rose-700 font-extrabold">Vắng mặt</span>
                    ) : isLate ? (
                      <span className="text-amber-700 font-extrabold">Đi muộn</span>
                    ) : (
                      <span className="text-emerald-700 font-extrabold">Có mặt tại lớp</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isAbsent && (
                    <button
                      onClick={() => onOpenLateArrival(child)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-2xs transition cursor-pointer"
                    >
                      <Clock size={12} />
                      <span>Đến muộn / Trưa đến</span>
                    </button>
                  )}

                  {isPresent && !earlyPickupInfo && (
                    <button
                      onClick={() => onOpenEarlyPickup(child)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer"
                    >
                      <LogOut size={12} />
                      <span>Đón về sớm</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 flex-1">
                <button
                  onClick={() => {
                    if (isAbsent) toggle(child.id, 'absent');
                    if (isLate) toggle(child.id, 'late');
                  }}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isPresent
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle size={13} />
                  <span>Có mặt</span>
                </button>

                <button
                  onClick={() => toggle(child.id, 'late')}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isLate
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Clock size={13} />
                  <span>Trễ</span>
                </button>

                <button
                  onClick={() => toggle(child.id, 'absent')}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isAbsent
                      ? approvedLeave
                        ? 'bg-teal-700 text-white shadow-sm'
                        : 'bg-rose-500 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <XCircle size={13} />
                  <span>{approvedLeave && isAbsent ? 'Có phép' : 'Vắng'}</span>
                </button>
              </div>
            )}

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
          <div className="w-full flex items-center justify-between gap-2">
            <div>
              {earlyPickupInfo ? (
                <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                  <Check size={14} /> Đã về sớm lúc {earlyPickupInfo.time}
                </span>
              ) : isCheckedOut ? (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle size={14} /> Đã trả bé an toàn
                </span>
              ) : isAbsent ? (
                <span className="text-xs font-bold text-slate-400">
                  Hôm nay bé vắng mặt
                </span>
              ) : (
                <span className="text-xs font-semibold text-slate-600">
                  Đang ở lớp, chờ phụ huynh
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isAbsent && !earlyPickupInfo && (
                <button
                  onClick={() => onCheckOutChild(child)}
                  disabled={isCheckedOut}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-2xs ${
                    isCheckedOut
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                  }`}
                >
                  <UserCheck size={14} />
                  <span>{isCheckedOut ? 'Đã xác nhận về' : 'Xác nhận ra về'}</span>
                </button>
              )}

              <button
                onClick={() => onOpenNote(child.id)}
                className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-orange-600 hover:bg-orange-50 cursor-pointer"
                title="Ghi chú trả trẻ"
              >
                <Edit3 size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
