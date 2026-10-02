'use client';

import React, { useState } from 'react';
import { ParentProfile } from '../types';

interface ParentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  parent: ParentProfile;
  onSave: (updated: ParentProfile) => void;
}

export default function ParentProfileModal({
  isOpen,
  onClose,
  parent,
  onSave,
}: ParentProfileModalProps) {
  const [formData, setFormData] = useState<ParentProfile>(parent);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-xs">
              {formData.hoTen.split(' ').slice(-1)[0]?.slice(0, 2).toUpperCase() || 'PH'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-800">{formData.hoTen}</h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 border border-sky-200">
                  {formData.moiQuanHe}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Hồ sơ thông tin liên lạc phụ huynh học sinh</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-600 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 overflow-y-auto parent-scroll space-y-4">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Đã cập nhật thông tin phụ huynh thành công vào hệ thống!
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isEditing ? 'Chỉnh sửa thông tin phụ huynh' : 'Thông tin cá nhân & Liên lạc'}
            </span>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
            >
              {isEditing ? 'Hủy chỉnh sửa' : '✏️ Thay đổi thông tin'}
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Họ và tên */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Họ và tên phụ huynh *</label>
                <input
                  type="text"
                  name="hoTen"
                  disabled={!isEditing}
                  value={formData.hoTen}
                  onChange={handleChange}
                  required
                  className={`w-full text-xs font-semibold rounded-xl px-3 py-2.5 outline-hidden transition-all ${
                    isEditing
                      ? 'bg-white border border-sky-300 focus:ring-1 focus:ring-sky-500'
                      : 'bg-slate-50 border border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              {/* Mối quan hệ */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Mối quan hệ với bé *</label>
                <select
                  name="moiQuanHe"
                  disabled={!isEditing}
                  value={formData.moiQuanHe}
                  onChange={handleChange}
                  className={`w-full text-xs font-semibold rounded-xl px-3 py-2.5 outline-hidden transition-all ${
                    isEditing
                      ? 'bg-white border border-sky-300 focus:ring-1 focus:ring-sky-500'
                      : 'bg-slate-50 border border-slate-200 text-slate-800'
                  }`}
                >
                  <option value="Mẹ">Mẹ</option>
                  <option value="Cha">Cha</option>
                  <option value="Người giám hộ">Người giám hộ</option>
                  <option value="Ông/Bà">Ông / Bà</option>
                </select>
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Số điện thoại liên lạc *</label>
                <input
                  type="tel"
                  name="soDienThoai"
                  disabled={!isEditing}
                  value={formData.soDienThoai}
                  onChange={handleChange}
                  required
                  className={`w-full text-xs font-semibold rounded-xl px-3 py-2.5 outline-hidden transition-all ${
                    isEditing
                      ? 'bg-white border border-sky-300 focus:ring-1 focus:ring-sky-500'
                      : 'bg-slate-50 border border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Địa chỉ Email</label>
                <input
                  type="email"
                  name="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full text-xs font-semibold rounded-xl px-3 py-2.5 outline-hidden transition-all ${
                    isEditing
                      ? 'bg-white border border-sky-300 focus:ring-1 focus:ring-sky-500'
                      : 'bg-slate-50 border border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              {/* Số CCCD / CMND */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Số CCCD / CMND</label>
                <input
                  type="text"
                  name="cccd"
                  disabled={!isEditing}
                  value={formData.cccd}
                  onChange={handleChange}
                  placeholder="079195001234"
                  className={`w-full text-xs font-semibold rounded-xl px-3 py-2.5 outline-hidden transition-all ${
                    isEditing
                      ? 'bg-white border border-sky-300 focus:ring-1 focus:ring-sky-500'
                      : 'bg-slate-50 border border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              {/* Ngày sinh */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Ngày sinh</label>
                <input
                  type="date"
                  name="ngaySinh"
                  disabled={!isEditing}
                  value={formData.ngaySinh}
                  onChange={handleChange}
                  className={`w-full text-xs font-semibold rounded-xl px-3 py-2.5 outline-hidden transition-all ${
                    isEditing
                      ? 'bg-white border border-sky-300 focus:ring-1 focus:ring-sky-500'
                      : 'bg-slate-50 border border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              {/* Giới tính */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Giới tính</label>
                <select
                  name="gioiTinh"
                  disabled={!isEditing}
                  value={formData.gioiTinh}
                  onChange={handleChange}
                  className={`w-full text-xs font-semibold rounded-xl px-3 py-2.5 outline-hidden transition-all ${
                    isEditing
                      ? 'bg-white border border-sky-300 focus:ring-1 focus:ring-sky-500'
                      : 'bg-slate-50 border border-slate-200 text-slate-800'
                  }`}
                >
                  <option value="Nữ">Nữ</option>
                  <option value="Nam">Nam</option>
                </select>
              </div>

              {/* Nghề nghiệp */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nghề nghiệp</label>
                <input
                  type="text"
                  name="ngheNghiep"
                  disabled={!isEditing}
                  value={formData.ngheNghiep}
                  onChange={handleChange}
                  placeholder="Kế toán, Kỹ sư, Bác sĩ..."
                  className={`w-full text-xs font-semibold rounded-xl px-3 py-2.5 outline-hidden transition-all ${
                    isEditing
                      ? 'bg-white border border-sky-300 focus:ring-1 focus:ring-sky-500'
                      : 'bg-slate-50 border border-slate-200 text-slate-800'
                  }`}
                />
              </div>
            </div>

            {/* Nơi làm việc */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Nơi làm việc / Cơ quan công tác</label>
              <input
                type="text"
                name="noiLamViec"
                disabled={!isEditing}
                value={formData.noiLamViec}
                onChange={handleChange}
                placeholder="Tên công ty / doanh nghiệp / cơ quan"
                className={`w-full text-xs font-semibold rounded-xl px-3 py-2.5 outline-hidden transition-all ${
                  isEditing
                    ? 'bg-white border border-sky-300 focus:ring-1 focus:ring-sky-500'
                    : 'bg-slate-50 border border-slate-200 text-slate-800'
                }`}
              />
            </div>

            {/* Địa chỉ nhà */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Địa chỉ nhà / Nơi cư trú thường trú *</label>
              <input
                type="text"
                name="diaChi"
                disabled={!isEditing}
                value={formData.diaChi}
                onChange={handleChange}
                required
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                className={`w-full text-xs font-semibold rounded-xl px-3 py-2.5 outline-hidden transition-all ${
                  isEditing
                    ? 'bg-white border border-sky-300 focus:ring-1 focus:ring-sky-500'
                    : 'bg-slate-50 border border-slate-200 text-slate-800'
                }`}
              />
            </div>

            {isEditing && (
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 shadow-xs transition-colors cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Khóa hồ sơ bảo mật thông tin theo tiêu chuẩn GDPR & Luật Bảo vệ dữ liệu cá nhân</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
