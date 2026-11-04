'use client';

import React from 'react';
import { X, UserPlus } from 'lucide-react';
import { Student, Cls, StudentFormState } from '../types';

interface StudentDetailModalProps {
  detail: Student | null;
  classNameText: string;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  detail,
  classNameText,
  onClose,
}) => {
  if (!detail) return null;

  const detailFields: [string, string][] = [
    ['Mã học sinh', detail.id],
    [
      'Ngày sinh',
      detail.ngaySinh ? new Date(detail.ngaySinh).toLocaleDateString('vi-VN') : '—',
    ],
    ['Giới tính', detail.gioiTinh || '—'],
    ['Địa chỉ', detail.diaChi || '—'],
    ['Lớp', classNameText],
    ['Trạng thái', detail.trangThaiHoc || '—'],
  ];

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/45 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="admin-eyebrow">HỒ SƠ HỌC SINH</p>
            <h2 className="text-xl font-black text-slate-900">{detail.tenHocSinh}</h2>
          </div>
          <button type="button" onClick={onClose} className="icon-btn">
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {detailFields.map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-400">{label}</p>
              <p className="mt-1 font-semibold text-slate-800">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface StudentCreateModalProps {
  show: boolean;
  form: StudentFormState;
  setForm: React.Dispatch<React.SetStateAction<StudentFormState>>;
  classes: Cls[];
  busy: boolean;
  onClose: () => void;
  onCreate: () => Promise<void>;
}

export const StudentCreateModal: React.FC<StudentCreateModalProps> = ({
  show,
  form,
  setForm,
  classes,
  busy,
  onClose,
  onCreate,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/45 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="admin-eyebrow">HỒ SƠ TRẺ</p>
            <h2 className="text-xl font-black text-slate-900">Thêm học sinh</h2>
          </div>
          <button type="button" onClick={onClose} className="icon-btn">
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Họ và tên</span>
            <input
              className="admin-input"
              value={form.tenHocSinh}
              onChange={(e) => setForm({ ...form, tenHocSinh: e.target.value })}
              placeholder="Nguyễn Văn A"
            />
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Ngày sinh</span>
            <input
              className="admin-input"
              type="date"
              value={form.ngaySinh}
              onChange={(e) => setForm({ ...form, ngaySinh: e.target.value })}
            />
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Giới tính</span>
            <select
              className="admin-input"
              value={form.gioiTinh}
              onChange={(e) => setForm({ ...form, gioiTinh: e.target.value })}
            >
              <option>Nam</option>
              <option>Nữ</option>
            </select>
          </label>

          <label>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Lớp</span>
            <select
              className="admin-input"
              value={form.lopId}
              onChange={(e) => setForm({ ...form, lopId: e.target.value })}
            >
              <option value="">Chưa xếp lớp</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.tenLop}
                </option>
              ))}
            </select>
          </label>

          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">Địa chỉ</span>
            <textarea
              className="admin-input min-h-24 py-3"
              value={form.diaChi}
              onChange={(e) => setForm({ ...form, diaChi: e.target.value })}
              placeholder="Địa chỉ của học sinh"
            />
          </label>
        </div>

        <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">
          Học sinh chỉ có hồ sơ trong StudentService.
          <strong> Không tạo tài khoản đăng nhập cho học sinh.</strong>
          Tài khoản chỉ được cấp cho phụ huynh, giáo viên và quản trị viên.
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="admin-btn admin-btn-secondary"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={busy || !form.tenHocSinh.trim() || !form.ngaySinh}
            onClick={() => void onCreate()}
            className="admin-btn admin-btn-primary"
          >
            <UserPlus size={16} />
            {busy ? 'Đang tạo...' : 'Tạo hồ sơ học sinh'}
          </button>
        </div>
      </div>
    </div>
  );
};
