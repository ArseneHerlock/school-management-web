'use client';

import React, { useState, useEffect } from 'react';
import { LogOut, UserCheck, Clock, AlertTriangle, X, Check, Thermometer } from 'lucide-react';
import { Child } from '../../data';

interface TeacherEarlyPickupModalProps {
  child: Child | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { time: string; nguoiDon: string; lyDo: string; note: string }) => Promise<void>;
}

export const TeacherEarlyPickupModal: React.FC<TeacherEarlyPickupModalProps> = ({
  child,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [time, setTime] = useState('');
  const [nguoiDon, setNguoiDon] = useState('Mẹ bé');
  const [customNguoiDon, setCustomNguoiDon] = useState('');
  const [lyDo, setLyDo] = useState('Việc gia đình đột xuất');
  const [customLyDo, setCustomLyDo] = useState('');
  const [nhietDo, setNhietDo] = useState('36.8');
  const [tinhTrang, setTinhTrang] = useState('Bình thường, tỉnh táo');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      setTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      );
      setNguoiDon('Mẹ bé');
      setCustomNguoiDon('');
      setLyDo('Việc gia đình đột xuất');
      setCustomLyDo('');
      setNhietDo('36.8');
      setTinhTrang('Bình thường, tỉnh táo');
    }
  }, [isOpen]);

  if (!isOpen || !child) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalNguoiDon = nguoiDon === 'Khác' ? customNguoiDon.trim() : nguoiDon;
    const finalLyDo = lyDo === 'Khác' ? customLyDo.trim() : lyDo;

    if (!finalNguoiDon) {
      alert('Vui lòng chọn hoặc nhập người đến đón trẻ.');
      return;
    }

    setLoading(true);
    try {
      const noteFull = `Nhiệt độ lúc bàn giao: ${nhietDo}°C · Tình trạng: ${tinhTrang}`;
      await onSubmit({
        time,
        nguoiDon: finalNguoiDon,
        lyDo: finalLyDo,
        note: noteFull,
      });
      onClose();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi ghi nhận trẻ về sớm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600">
              Bàn Giao & Đón Sớm
            </span>
            <h3 className="text-base font-extrabold text-slate-900">Ghi Nhận Cho Bé Về Sớm</h3>
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
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
            {child.avatar || 'BE'}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">{child.name}</h4>
            <p className="text-xs text-slate-500">
              Phụ huynh đến đón bé về trước giờ tan trường chính thức.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Giờ đón thực tế */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Thời gian đón về *</label>
            <div className="relative">
              <Clock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs font-semibold focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Người đến đón */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Người thân đến đón thực tế *
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {['Mẹ bé', 'Bố bé', 'Bà nội', 'Bà ngoại', 'Khác'].map((rel) => (
                <button
                  type="button"
                  key={rel}
                  onClick={() => setNguoiDon(rel)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    nguoiDon === rel
                      ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {rel}
                </button>
              ))}
            </div>
            {nguoiDon === 'Khác' && (
              <input
                type="text"
                required
                placeholder="Nhập tên & quan hệ người đón được ủy quyền..."
                value={customNguoiDon}
                onChange={(e) => setCustomNguoiDon(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:border-rose-500 focus:outline-none"
              />
            )}
          </div>

          {/* Lý do về sớm */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Lý do về sớm *</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {[
                'Việc gia đình đột xuất',
                'Bé sốt / Mệt cần nghỉ',
                'Đi khám bác sĩ',
                'Khác',
              ].map((reason) => (
                <button
                  type="button"
                  key={reason}
                  onClick={() => setLyDo(reason)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    lyDo === reason
                      ? 'bg-slate-800 text-white border-slate-800 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
            {lyDo === 'Khác' && (
              <input
                type="text"
                required
                placeholder="Nhập chi tiết lý do..."
                value={customLyDo}
                onChange={(e) => setCustomLyDo(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:border-slate-700 focus:outline-none"
              />
            )}
          </div>

          {/* Tình trạng sức khỏe lúc bàn giao */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Thân nhiệt (°C) lúc bàn giao
              </label>
              <div className="relative">
                <Thermometer
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500"
                />
                <input
                  type="text"
                  placeholder="36.8"
                  value={nhietDo}
                  onChange={(e) => setNhietDo(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs font-semibold focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Biểu hiện thể trạng</label>
              <input
                type="text"
                value={tinhTrang}
                onChange={(e) => setTinhTrang(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-500 leading-relaxed">
            Hệ thống sẽ lưu biên bản bàn giao và vô hiệu hóa nút trả trẻ chiều đối với bé này để tránh thao tác lặp lại.
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
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Xác nhận bàn giao trẻ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
