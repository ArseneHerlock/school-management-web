'use client';

import React from 'react';
import { X } from 'lucide-react';
import { FormThuocState } from './types';

interface CreateMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formThuoc: FormThuocState;
  setFormThuoc: React.Dispatch<React.SetStateAction<FormThuocState>>;
  submitting: boolean;
  childName?: string;
  classNameProp?: string;
}

export function CreateMedicationModal({
  isOpen,
  onClose,
  onSubmit,
  formThuoc,
  setFormThuoc,
  submitting,
  childName,
  classNameProp,
}: CreateMedicationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Tạo Đơn Dặn Thuốc Mới</h3>
            <p className="text-xs text-slate-500">
              Bé: {childName} - Lớp: {classNameProp}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tên thuốc *</label>
            <input
              type="text"
              required
              placeholder="VD: Siro ho Prospan, Hạ sốt Hapacol 250mg..."
              value={formThuoc.tenThuoc}
              onChange={(e) => setFormThuoc({ ...formThuoc, tenThuoc: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Liều lượng *</label>
              <input
                type="text"
                required
                placeholder="VD: 5ml (1 nắp), 1 gói..."
                value={formThuoc.lieuLuong}
                onChange={(e) => setFormThuoc({ ...formThuoc, lieuLuong: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Cách bảo quản</label>
              <select
                value={formThuoc.baoQuan}
                onChange={(e) => setFormThuoc({ ...formThuoc, baoQuan: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:border-indigo-500 focus:outline-none bg-white"
              >
                <option value="Nhiệt độ phòng">Nhiệt độ phòng</option>
                <option value="Ngăn mát tủ lạnh">Ngăn mát tủ lạnh của lớp</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Thời điểm uống dặn cô</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {[
                '11:30 - Sau ăn trưa',
                '14:30 - Sau ngủ dậy',
                '09:00 - Sau ăn sáng',
                '16:00 - Trước khi về',
              ].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setFormThuoc({ ...formThuoc, gioUongDuKien: preset })}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${
                    formThuoc.gioUongDuKien === preset
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={formThuoc.gioUongDuKien}
              onChange={(e) => setFormThuoc({ ...formThuoc, gioUongDuKien: e.target.value })}
              placeholder="Hoặc tự điền khung giờ..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Lời dặn chi tiết cho cô giáo</label>
            <textarea
              rows={3}
              placeholder="VD: Bé hơi khó uống thuốc nước, nhờ cô pha thêm 1 chút nước ấm hoặc dỗ bé uống từ từ giúp em ạ..."
              value={formThuoc.loiNhan}
              onChange={(e) => setFormThuoc({ ...formThuoc, loiNhan: e.target.value })}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs font-medium focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-500">
            Gia đình cam kết thuốc do bác sĩ chỉ định hoặc tự chịu trách nhiệm về hướng dẫn sử dụng này.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Đang gửi...' : 'Gửi đơn cho cô giáo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
