'use client'

import React from 'react'
import { ParentProfile } from '../types'

interface ParentProfileFormProps {
  formData: ParentProfile
  isEditing: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

export const ParentProfileForm: React.FC<ParentProfileFormProps> = ({
  formData,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Họ và tên phụ huynh *
          </label>
          <input
            type="text"
            name="hoTen"
            disabled={!isEditing}
            value={formData.hoTen}
            onChange={onChange}
            required
            className={`w-full text-xs font-semibold rounded-xl px-3 py-2.5 outline-hidden transition-all ${
              isEditing
                ? 'bg-white border border-sky-300 focus:ring-1 focus:ring-sky-500'
                : 'bg-slate-50 border border-slate-200 text-slate-800'
            }`}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Mối quan hệ với bé *
          </label>
          <select
            name="moiQuanHe"
            disabled={!isEditing}
            value={formData.moiQuanHe}
            onChange={onChange}
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

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Số điện thoại liên lạc *
          </label>
          <input
            type="tel"
            name="soDienThoai"
            disabled={!isEditing}
            value={formData.soDienThoai}
            onChange={onChange}
            required
            className={`w-full text-xs font-semibold rounded-xl px-3 py-2.5 outline-hidden transition-all ${
              isEditing
                ? 'bg-white border border-sky-300 focus:ring-1 focus:ring-sky-500'
                : 'bg-slate-50 border border-slate-200 text-slate-800'
            }`}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Địa chỉ Email
          </label>
          <input
            type="email"
            name="email"
            disabled={!isEditing}
            value={formData.email}
            onChange={onChange}
            className={`w-full text-xs font-semibold rounded-xl px-3 py-2.5 outline-hidden transition-all ${
              isEditing
                ? 'bg-white border border-sky-300 focus:ring-1 focus:ring-sky-500'
                : 'bg-slate-50 border border-slate-200 text-slate-800'
            }`}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Số CCCD / CMND
          </label>
          <input
            type="text"
            name="cccd"
            disabled={!isEditing}
            value={formData.cccd}
            onChange={onChange}
            placeholder="079195001234"
            className={`w-full text-xs font-semibold rounded-xl px-3 py-2.5 outline-hidden transition-all ${
              isEditing
                ? 'bg-white border border-sky-300 focus:ring-1 focus:ring-sky-500'
                : 'bg-slate-50 border border-slate-200 text-slate-800'
            }`}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Ngày sinh
          </label>
          <input
            type="date"
            name="ngaySinh"
            disabled={!isEditing}
            value={formData.ngaySinh}
            onChange={onChange}
            className={`w-full text-xs font-semibold rounded-xl px-3 py-2.5 outline-hidden transition-all ${
              isEditing
                ? 'bg-white border border-sky-300 focus:ring-1 focus:ring-sky-500'
                : 'bg-slate-50 border border-slate-200 text-slate-800'
            }`}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Giới tính
          </label>
          <select
            name="gioiTinh"
            disabled={!isEditing}
            value={formData.gioiTinh}
            onChange={onChange}
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

        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1">
            Nghề nghiệp
          </label>
          <input
            type="text"
            name="ngheNghiep"
            disabled={!isEditing}
            value={formData.ngheNghiep}
            onChange={onChange}
            placeholder="Kế toán, Kỹ sư, Bác sĩ..."
            className={`w-full text-xs font-semibold rounded-xl px-3 py-2.5 outline-hidden transition-all ${
              isEditing
                ? 'bg-white border border-sky-300 focus:ring-1 focus:ring-sky-500'
                : 'bg-slate-50 border border-slate-200 text-slate-800'
            }`}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1">
          Nơi làm việc / Cơ quan công tác
        </label>
        <input
          type="text"
          name="noiLamViec"
          disabled={!isEditing}
          value={formData.noiLamViec}
          onChange={onChange}
          placeholder="Tên công ty / doanh nghiệp / cơ quan"
          className={`w-full text-xs font-semibold rounded-xl px-3 py-2.5 outline-hidden transition-all ${
            isEditing
              ? 'bg-white border border-sky-300 focus:ring-1 focus:ring-sky-500'
              : 'bg-slate-50 border border-slate-200 text-slate-800'
          }`}
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1">
          Địa chỉ nhà / Nơi cư trú thường trú *
        </label>
        <input
          type="text"
          name="diaChi"
          disabled={!isEditing}
          value={formData.diaChi}
          onChange={onChange}
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
            onClick={onCancel}
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
  )
}
