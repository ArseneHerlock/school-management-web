'use client';

import React from 'react';
import { UserPlus } from 'lucide-react';

interface AddAuthorizedPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: {
    fullName: string;
    relationship: string;
    phoneNumber: string;
    idCardNumber: string;
    photoUrl: string;
    isDefault: boolean;
    notes: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      fullName: string;
      relationship: string;
      phoneNumber: string;
      idCardNumber: string;
      photoUrl: string;
      isDefault: boolean;
      notes: string;
    }>
  >;
}

export function AddAuthorizedPersonModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
}: AddAuthorizedPersonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <UserPlus className="text-indigo-600" /> Thêm người thân đón bé
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Họ và tên người đón *
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Bác Nguyễn Văn Nam"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mối quan hệ với bé *
              </label>
              <select
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-indigo-600 cursor-pointer"
              >
                <option value="Ông nội">Ông nội</option>
                <option value="Bà nội">Bà nội</option>
                <option value="Ông ngoại">Ông ngoại</option>
                <option value="Bà ngoại">Bà ngoại</option>
                <option value="Bác">Bác</option>
                <option value="Cô / Chú / Dì">Cô / Chú / Dì</option>
                <option value="Người giúp việc">Người giúp việc</option>
                <option value="Tài xế">Tài xế</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                placeholder="0912..."
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Số CCCD (Căn cước công dân)
            </label>
            <input
              type="text"
              placeholder="0012..."
              value={formData.idCardNumber}
              onChange={(e) => setFormData({ ...formData, idCardNumber: e.target.value })}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ghi chú nhận diện / Dặn dò cô giáo
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Đi xe Lead đỏ, thường đón lúc 17h15..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-indigo-600"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded"
            />
            <label
              htmlFor="isDefault"
              className="text-xs text-slate-700 font-semibold cursor-pointer"
            >
              Đặt làm người đón chính mặc định
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow hover:bg-indigo-700 cursor-pointer"
            >
              Xác nhận lưu hồ sơ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
