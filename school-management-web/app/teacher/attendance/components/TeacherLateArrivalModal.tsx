'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Utensils, AlertCircle, X, Check, FileText } from 'lucide-react';
import { Child } from '../../data';

interface TeacherLateArrivalModalProps {
  child: Child | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { time: string; coAnTrua: boolean; note: string }) => Promise<void>;
}

export const TeacherLateArrivalModal: React.FC<TeacherLateArrivalModalProps> = ({
  child,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [time, setTime] = useState('');
  const [coAnTrua, setCoAnTrua] = useState(true);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      setTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      );
      setCoAnTrua(true);
      setNote('');
    }
  }, [isOpen]);

  if (!isOpen || !child) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        time,
        coAnTrua,
        note: note.trim(),
      });
      onClose();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tiếp nhận trẻ đến muộn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">
              Biến Động Chuyên Cần
            </span>
            <h3 className="text-base font-extrabold text-slate-900">Tiếp Nhận Trẻ Đến Muộn</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Thông tin bé */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
            {child.avatar || 'BE'}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{child.name}</h4>
            <p className="text-xs text-slate-500">
              Học sinh đã có đơn nghỉ hoặc vắng sáng nhưng trưa đến trường học.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Giờ đến thực tế */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Thời gian tiếp nhận thực tế *
            </label>
            <div className="relative">
              <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs font-semibold focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Lựa chọn suất ăn trưa bán trú */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Suất ăn trưa bán trú tại trường *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCoAnTrua(true)}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  coAnTrua
                    ? 'border-orange-500 bg-orange-50/70 text-orange-900 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold flex items-center gap-1.5">
                    <Utensils size={13} className="text-orange-600" /> Ăn trưa tại trường
                  </span>
                  {coAnTrua && <Check size={14} className="text-orange-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Báo Bếp chuẩn bị suất ăn dự phòng & kế toán tính tiền ăn.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setCoAnTrua(false)}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                  !coAnTrua
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold flex items-center gap-1.5">
                    <Check size={13} className="text-emerald-600" /> Bé đã ăn ở nhà
                  </span>
                  {!coAnTrua && <Check size={14} className="text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Không đăng ký suất ăn (giữ nguyên miễn giảm tiền ăn).
                </p>
              </button>
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Ghi chú thêm của giáo viên</label>
            <input
              type="text"
              placeholder="VD: Mẹ đưa đến lớp lúc 10h45 sau khi đi khám mắt xong..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Xác nhận tiếp nhận trẻ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
