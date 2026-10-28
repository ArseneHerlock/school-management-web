'use client';

import React from 'react';
import { X, UserPlus, Link2, Plus, Trash2 } from 'lucide-react';
import { Staff, Position, Cls, Assignment, getRoleLabel } from './types';

interface StaffDetailModalProps {
  selected: Staff | null;
  onClose: () => void;
  classes: Cls[];
  assign: Record<string, Assignment[]>;
  af: { classId: string; role: number; startDate: string; endDate?: string };
  setAf: (af: any) => void;
  onAddAssignment: () => Promise<void>;
  onRemoveAssignment: (id: string) => Promise<void>;
}

export const StaffDetailModal: React.FC<StaffDetailModalProps> = ({
  selected,
  onClose,
  classes,
  assign,
  af,
  setAf,
  onAddAssignment,
  onRemoveAssignment,
}) => {
  if (!selected) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-800">Hồ sơ nhân sự</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ['Mã nhân sự', selected.staffCode],
            ['Họ tên', selected.fullName],
            ['Ngày sinh', String(selected.dateOfBirth).slice(0, 10)],
            ['CCCD', selected.nationalId],
            ['Điện thoại', selected.phoneNumber],
            ['Email', selected.email],
            ['Địa chỉ', selected.address],
            ['Trình độ', selected.professionalQualification || '—'],
            ['Chuyên ngành', selected.major || '—'],
            ['Ngày vào làm', String(selected.hireDate).slice(0, 10)],
          ].map(([a, b]) => (
            <div key={a} className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-400">{a}</p>
              <p className="mt-1 font-semibold text-slate-800">{b}</p>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-800">Phân công lớp</h3>
            <Link2 size={16} className="text-emerald-600" />
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            <select
              className="admin-input"
              value={af.classId}
              onChange={(e) => setAf({ ...af, classId: e.target.value })}
            >
              <option value="">Chọn lớp</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.tenLop}
                </option>
              ))}
            </select>
            <select
              className="admin-input"
              value={af.role}
              onChange={(e) => setAf({ ...af, role: Number(e.target.value) })}
            >
              <option value="1">Chủ nhiệm</option>
              <option value="2">Phó chủ nhiệm</option>
              <option value="3">Giảng dạy</option>
            </select>
            <input
              className="admin-input"
              type="date"
              value={af.startDate}
              onChange={(e) => setAf({ ...af, startDate: e.target.value })}
            />
            <button onClick={() => void onAddAssignment()} className="admin-btn admin-btn-primary">
              <Plus size={15} /> Phân công
            </button>
          </div>
          {(assign[selected.staffId] || []).map((a) => (
            <div
              key={a.assignmentId}
              className="mt-2 flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm"
            >
              <span>
                <b>{classes.find((c) => String(c.id) === String(a.classId))?.tenLop || a.classId}</b> ·{' '}
                {getRoleLabel(Number(a.role))} · từ {a.startDate}
              </span>
              <button
                onClick={() => void onRemoveAssignment(a.assignmentId)}
                className="icon-btn danger"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {!(assign[selected.staffId] || []).length && (
            <p className="mt-2 text-sm text-slate-400">Chưa có phân công lớp nào.</p>
          )}
        </div>

        <div className="mt-5 flex justify-end">
          <button className="admin-btn admin-btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

interface StaffCreateModalProps {
  show: boolean;
  form: any;
  setForm: (form: any) => void;
  positions: Position[];
  busy: boolean;
  onClose: () => void;
  onCreate: () => Promise<void>;
}

export const StaffCreateModal: React.FC<StaffCreateModalProps> = ({
  show,
  form,
  setForm,
  positions,
  busy,
  onClose,
  onCreate,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-800">Thêm nhân sự & cấp tài khoản</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ['fullName', 'Họ tên *'],
            ['dateOfBirth', 'Ngày sinh'],
            ['nationalId', 'CCCD / CMND'],
            ['phoneNumber', 'Điện thoại *'],
            ['email', 'Email *'],
            ['address', 'Địa chỉ'],
            ['hireDate', 'Ngày vào làm'],
            ['professionalQualification', 'Trình độ'],
            ['major', 'Chuyên ngành'],
          ].map(([k, l]) => (
            <label key={k} className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-600">{l}</span>
              <input
                className="admin-input"
                type={k.includes('Date') || k.includes('dateOfBirth') ? 'date' : 'text'}
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            </label>
          ))}
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-600">Giới tính</span>
            <select
              className="admin-input"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: Number(e.target.value) })}
            >
              <option value="1">Nam</option>
              <option value="2">Nữ</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-600">Vị trí</span>
            <select
              className="admin-input"
              value={form.positionId}
              onChange={(e) => setForm({ ...form, positionId: e.target.value })}
            >
              <option value="">Chọn vị trí</option>
              {positions.map((p) => (
                <option key={p.positionId} value={p.positionId}>
                  {p.positionName}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-600">Loại hợp đồng</span>
            <select
              className="admin-input"
              value={form.contractType}
              onChange={(e) => setForm({ ...form, contractType: Number(e.target.value) })}
            >
              <option value="1">Biên chế</option>
              <option value="2">Xác định thời hạn</option>
              <option value="3">Thời vụ</option>
              <option value="4">Thuê ngoài</option>
            </select>
          </label>
        </div>

        <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
          Tài khoản được tạo với vai trò <b>GIAO_VIEN</b>; mật khẩu ban đầu là ngày sinh và hệ
          thống yêu cầu đổi mật khẩu lần đầu.
        </p>

        <div className="mt-5 flex justify-end gap-2">
          <button className="admin-btn admin-btn-secondary" onClick={onClose}>
            Hủy
          </button>
          <button
            disabled={busy || !form.fullName || !form.dateOfBirth || !form.positionId}
            onClick={() => void onCreate()}
            className="admin-btn admin-btn-primary"
          >
            <UserPlus size={16} />
            {busy ? 'Đang tạo...' : 'Tạo nhân sự & tài khoản'}
          </button>
        </div>
      </div>
    </div>
  );
};
