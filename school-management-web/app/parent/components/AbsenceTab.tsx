'use client';

import React, { useState } from 'react';
import { AbsenceRequest, ChildInfo } from '../types';

interface AbsenceTabProps {
  child: ChildInfo;
  absences: AbsenceRequest[];
  onSubmitAbsence: (newAbsence: Omit<AbsenceRequest, 'id' | 'createdAt'>) => void;
}

export default function AbsenceTab({ child, absences, onSubmitAbsence }: AbsenceTabProps) {
  const [selectedReason, setSelectedReason] = useState<'sick' | 'family' | 'travel' | 'other'>('sick');
  const [fromDate, setFromDate] = useState('2026-09-26');
  const [toDate, setToDate] = useState('2026-09-26');
  const [note, setNote] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const reasonOptions: Array<{ id: 'sick' | 'family' | 'travel' | 'other'; icon: string; label: string }> = [
    { id: 'sick', icon: '🤒', label: 'Bé bị ốm/sốt' },
    { id: 'family', icon: '👨‍👩‍👧', label: 'Việc gia đình' },
    { id: 'travel', icon: '✈️', label: 'Đi du lịch/về quê' },
    { id: 'other', icon: '📝', label: 'Lý do khác' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reasonTitles = {
      sick: 'Bé bị ốm/sốt cần theo dõi',
      family: 'Việc gia đình',
      travel: 'Đi du lịch/về quê cùng gia đình',
      other: 'Lý do cá nhân',
    };

    onSubmitAbsence({
      reasonCategory: selectedReason,
      reasonTitle: reasonTitles[selectedReason],
      fromDate,
      toDate,
      note: note.trim() || 'Bé nghỉ phép theo nguyện vọng gia đình',
      status: 'pending',
    });

    setNote('');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  return (
    <section className="space-y-5">
      <div className="card-frame p-5">
        <h2 className="text-lg font-extrabold text-slate-800">Gửi Đơn Xin Nghỉ Học</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Đơn xin nghỉ của bé {child.hoTen} sẽ được gửi trực tiếp đến giáo viên chủ nhiệm & nhà trường
        </p>
      </div>

      {showSuccessToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Đã gửi đơn xin nghỉ học thành công đến {child.giaoVienChuNhiem}!
          </div>
          <button onClick={() => setShowSuccessToast(false)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="card-frame p-5 space-y-5">
        {/* Reasons Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
            Lý do nghỉ học
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {reasonOptions.map((opt) => {
              const isSelected = selectedReason === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setSelectedReason(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:border-sky-300'
                  }`}
                >
                  <span className="text-2xl block mb-1">{opt.icon}</span>
                  <span className="text-xs font-bold text-slate-800">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date inputs */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Từ ngày</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm outline-hidden focus:border-sky-500 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Đến hết ngày</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm outline-hidden focus:border-sky-500 transition-all"
              required
            />
          </div>
        </div>

        {/* Detailed Note */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Ghi chú chi tiết / Dặn dò cô giáo
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ví dụ: Bé bị sốt nhẹ 38 độ, gia đình xin phép cho bé nghỉ ngơi theo dõi tại nhà..."
            className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm outline-hidden focus:border-sky-500 transition-all resize-none placeholder:text-slate-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
          </svg>
          <span>Gửi đơn xin nghỉ học</span>
        </button>
      </form>

      {/* Absence History */}
      <div className="card-frame p-5">
        <h3 className="font-extrabold text-slate-800 text-sm mb-3">Lịch sử xin nghỉ học gần đây</h3>
        <div className="space-y-3">
          {absences.map((abs) => {
            const isApproved = abs.status === 'approved';
            return (
              <div
                key={abs.id}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  isApproved
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-amber-50/70 border-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold ${
                      isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {isApproved ? '✓' : '⏳'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{abs.reasonTitle}</p>
                    <p className="text-xs text-slate-500">
                      {abs.fromDate} đến {abs.toDate} · &quot;{abs.note}&quot;
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                    isApproved
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : 'text-amber-700 bg-amber-100 border-amber-300'
                  }`}
                >
                  {isApproved ? 'Cô giáo đã duyệt' : 'Đang chờ cô duyệt'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
