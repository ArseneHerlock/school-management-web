import React from 'react';
import { Sparkles, CheckCircle2, RotateCcw, Check } from 'lucide-react';
import { StudentPickupItem } from '../types';

function getInitials(name: string): string {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatPickupTime(timeVal: any): string {
  if (!timeVal) return '';
  if (typeof timeVal === 'string') return timeVal.slice(0, 5);
  if (typeof timeVal === 'object' && ('hours' in timeVal || 'minutes' in timeVal)) {
    const h = String(timeVal.hours || 0).padStart(2, '0');
    const m = String(timeVal.minutes || 0).padStart(2, '0');
    return `${h}:${m}`;
  }
  return String(timeVal).slice(0, 5);
}

interface PickupCardProps {
  student: StudentPickupItem;
  processingId: string | null;
  onConfirmPickup: (student: StudentPickupItem, personName: string) => void;
  onCancelPickup: (studentId: string, studentName: string) => void;
}

export function PickupCard({
  student: st,
  processingId,
  onConfirmPickup,
  onCancelPickup,
}: PickupCardProps) {
  const hasTodayAuth = Boolean(st.todayAuthorization);
  const isBusy = processingId === st.studentId;

  return (
    <div
      className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        st.isPickedUp
          ? 'border-emerald-200 bg-emerald-50/20'
          : hasTodayAuth
          ? 'border-purple-300 ring-2 ring-purple-100'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* 1. BÉ LÀ AI */}
      <div className="flex items-center gap-3.5 min-w-[240px]">
        <div
          className={`w-12 h-12 rounded-2xl font-black text-sm flex items-center justify-center shrink-0 border ${
            st.isPickedUp
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : hasTodayAuth
              ? 'bg-purple-100 text-purple-900 border-purple-300'
              : 'bg-teal-100 text-teal-800 border-teal-200'
          }`}
        >
          {getInitials(st.studentName)}
        </div>
        <div>
          <h3 className="font-black text-base text-slate-900 leading-tight">
            {st.studentName}
          </h3>
          <div className="text-xs text-slate-500 mt-0.5">
            {st.gender === 'Nam' ? 'Bé trai' : 'Bé gái'} •{' '}
            {st.dob ? new Date(st.dob).toLocaleDateString('vi-VN') : '---'}
          </div>
        </div>
      </div>

      {/* 2. AI SẼ LÀ NGƯỜI ĐÓN */}
      <div className="flex-1 md:px-4">
        {hasTodayAuth && st.todayAuthorization ? (
          <div className="bg-purple-50 border border-purple-300 rounded-xl p-3 text-xs text-purple-950 space-y-1">
            <div className="flex items-center gap-1.5 text-purple-700 font-extrabold text-[11px] uppercase tracking-wider">
              <Sparkles size={13} /> Người đón hôm nay (Bố mẹ dặn):
            </div>
            <div className="text-sm font-black text-purple-950 flex flex-wrap items-center gap-2">
              <span>{st.todayAuthorization.Relationship}:</span>
              <span className="text-purple-900 font-extrabold">
                {st.todayAuthorization.PickupPersonName}
              </span>
              {st.todayAuthorization.PhoneNumber && (
                <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                  SĐT: {st.todayAuthorization.PhoneNumber}
                </span>
              )}
            </div>
            {st.todayAuthorization.ParentNote && (
              <p className="text-[11px] text-purple-800 italic mt-0.5">
                "{st.todayAuthorization.ParentNote}"
              </p>
            )}
          </div>
        ) : st.authorizedPersons && st.authorizedPersons.length > 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 space-y-1.5">
            <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
              Người đón hợp lệ (Phụ huynh):
            </div>
            <div className="flex flex-wrap gap-2">
              {st.authorizedPersons.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs"
                >
                  <span className="font-extrabold text-teal-700">{p.Relationship}:</span>
                  <span className="font-black text-slate-900">{p.FullName}</span>
                  {p.PhoneNumber && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      ({p.PhoneNumber})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200">
            Chưa có thông tin người đón đăng ký
          </div>
        )}
      </div>

      {/* 3. THAO TÁC 1 CHẠM */}
      <div className="shrink-0 flex items-center gap-2 justify-end">
        {st.isPickedUp ? (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-300 rounded-2xl px-4 py-2 text-xs">
            <div>
              <div className="text-emerald-800 font-black flex items-center gap-1">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Đã đón lúc {formatPickupTime(st.pickupTime)}</span>
              </div>
              <div className="text-[11px] text-emerald-700 mt-0.5">
                Người đón: <strong>{st.pickedUpBy || 'Phụ huynh'}</strong>
              </div>
            </div>

            <button
              onClick={() => onCancelPickup(st.studentId, st.studentName)}
              disabled={isBusy}
              title="Hủy trạng thái đã đón (hoàn tác về chờ đón)"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {hasTodayAuth && st.todayAuthorization ? (
              <button
                onClick={() =>
                  onConfirmPickup(
                    st,
                    `${st.todayAuthorization!.PickupPersonName} (${
                      st.todayAuthorization!.Relationship
                    })`
                  )
                }
                disabled={isBusy}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Check size={14} />
                <span>
                  {isBusy
                    ? 'Đang lưu...'
                    : `Xác nhận: ${st.todayAuthorization.PickupPersonName} đã đón`}
                </span>
              </button>
            ) : st.authorizedPersons && st.authorizedPersons.length > 0 ? (
              st.authorizedPersons.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    onConfirmPickup(st, `${p.FullName} (${p.Relationship})`)
                  }
                  disabled={isBusy}
                  className={`px-3.5 py-2.5 rounded-xl font-black text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                    idx === 0
                      ? 'bg-teal-600 hover:bg-teal-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <Check size={13} />
                  <span>
                    {isBusy ? 'Đang lưu...' : `${p.Relationship} ${p.FullName} đón`}
                  </span>
                </button>
              ))
            ) : (
              <button
                onClick={() => onConfirmPickup(st, 'Phụ huynh đón')}
                disabled={isBusy}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Check size={14} />
                <span>{isBusy ? 'Đang lưu...' : 'Xác nhận Đã Đón Bé'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
