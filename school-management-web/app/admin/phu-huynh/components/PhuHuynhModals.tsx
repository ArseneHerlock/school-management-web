'use client';

import React from 'react';
import { X, UserPlus } from 'lucide-react';
import { Parent, Child, Cls, Staff } from '../types';

interface PhuHuynhDetailModalProps {
  selected: Parent | null;
  onClose: () => void;
  childrenMap: Record<string, Child[]>;
  classes: Cls[];
  staff: Staff[];
}

export const PhuHuynhDetailModal: React.FC<PhuHuynhDetailModalProps> = ({
  selected,
  onClose,
  childrenMap,
  classes,
  staff,
}) => {
  if (!selected) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-800">Hồ sơ phụ huynh</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ['Họ tên', selected.hoTen],
            ['SĐT', selected.soDienThoai],
            ['Email', selected.email || '—'],
            ['CCCD', selected.cccd || '—'],
            ['Ngày sinh', String(selected.ngaySinh || '').slice(0, 10) || '—'],
            ['Nghề nghiệp', selected.ngheNghiep || '—'],
            ['Nơi làm việc', selected.noiLamViec || '—'],
            ['Địa chỉ', selected.diaChi || '—'],
            ['Tài khoản', selected.taiKhoanId ? 'Đã liên kết' : 'Chưa liên kết'],
          ].map(([a, b]) => (
            <div key={a} className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-400">{a}</p>
              <p className="mt-1 font-semibold">{b}</p>
            </div>
          ))}
        </div>
        <h3 className="mt-6 font-black text-slate-800">Danh sách con</h3>
        {(childrenMap[selected.id] || []).map((c) => {
          const cl = classes.find((x) => String(x.id) === String(c.lopId));
          const t = staff.find((x) => String(x.staffId) === String(cl?.giaoVienChuNhiemId));
          return (
            <div key={c.studentId} className="mt-2 rounded-xl border border-slate-200 p-3">
              <b>{c.tenHocSinh}</b>
              <div className="mt-1 grid gap-1 text-xs text-slate-500 sm:grid-cols-3">
                <span>Lớp: {cl?.tenLop || '—'}</span>
                <span>GVCN: {t?.fullName || '—'}</span>
                <span>Quan hệ: {c.quanHe}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface PhuHuynhFormModalProps {
  show: boolean;
  edit: Parent | null;
  form: any;
  setForm: (form: any) => void;
  busy: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
}

export const PhuHuynhFormModal: React.FC<PhuHuynhFormModalProps> = ({
  show,
  edit,
  form,
  setForm,
  busy,
  onClose,
  onSave,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-800">
            {edit ? 'Sửa phụ huynh' : 'Thêm phụ huynh + tạo tài khoản'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ['hoTen', 'Họ tên'],
            ['soDienThoai', 'Số điện thoại'],
            ['email', 'Email'],
            ['cccd', 'CCCD'],
            ['ngaySinh', 'Ngày sinh'],
            ['ngheNghiep', 'Nghề nghiệp'],
            ['noiLamViec', 'Nơi làm việc'],
            ['diaChi', 'Địa chỉ'],
          ].map(([k, l]) => (
            <label key={k} className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-600">{l}</span>
              <input
                className="admin-input"
                type={k === 'ngaySinh' ? 'date' : 'text'}
                value={form[k] || ''}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            </label>
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <select
            className="admin-input"
            value={form.moiQuanHe}
            onChange={(e) => setForm({ ...form, moiQuanHe: e.target.value })}
          >
            <option>Bố</option>
            <option>Mẹ</option>
            <option>Người giám hộ</option>
          </select>
          <select
            className="admin-input"
            value={form.gioiTinh}
            onChange={(e) => setForm({ ...form, gioiTinh: e.target.value })}
          >
            <option>Nam</option>
            <option>Nữ</option>
          </select>
        </div>
        {!edit && (
          <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
            <b>Tài khoản:</b> hệ thống tự tạo role <b>PHU_HUYNH</b>; mật khẩu ban đầu là ngày sinh và
            buộc đổi khi đăng nhập lần đầu.
          </p>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button className="admin-btn admin-btn-secondary" onClick={onClose}>
            Hủy
          </button>
          <button
            disabled={busy || !form.hoTen || !form.soDienThoai}
            onClick={() => void onSave()}
            className="admin-btn admin-btn-primary"
          >
            <UserPlus size={16} />
            {busy ? 'Đang lưu...' : edit ? 'Lưu thay đổi' : 'Tạo & cấp tài khoản'}
          </button>
        </div>
      </div>
    </div>
  );
};
