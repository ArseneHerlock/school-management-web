'use client';

import React from 'react';
import { X, Save, Loader2, AlertCircle } from 'lucide-react';
import { ClassItem, Grade, Staff, Student } from '../types';

interface ClassFormModalProps {
  editing: ClassItem | null;
  isNew: boolean;
  form: {
    tenLop: string;
    siSo: number;
    namHoc: string;
    giaoVienChuNhiemId: string;
    giaoVienPhuId: string;
    khoiId: string;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
  staffList: Staff[];
  grades: Grade[];
  classes: ClassItem[];
  saving: boolean;
  error?: string;
  onClose: () => void;
  onSave: () => Promise<void>;
  onGradeChangeAutoName: (gradeId: string) => void;
}

export const ClassFormModal: React.FC<ClassFormModalProps> = ({
  editing,
  isNew,
  form,
  setForm,
  staffList,
  grades,
  classes,
  saving,
  error,
  onClose,
  onSave,
  onGradeChangeAutoName,
}) => {
  if (!editing) return null;

  const assignedTeacherMap = new Map<string, string>();
  classes.forEach((c: any) => {
    if (!isNew && (c.id === editing.id || c.Id === editing.id)) return;
    const gv1 = c.giaoVienChuNhiemId || c.GiaoVienChuNhiemId;
    const gv2 = c.giaoVienPhuId || c.GiaoVienPhuId;
    const className = c.tenLop || c.TenLop || 'Lớp khác';
    if (gv1) assignedTeacherMap.set(String(gv1).toLowerCase(), className);
    if (gv2) assignedTeacherMap.set(String(gv2).toLowerCase(), className);
  });

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 p-3 sm:p-4">
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4">
          <div>
            <h2 className="text-base sm:text-xl font-black text-slate-800">
              {isNew ? 'Thêm lớp học mới' : 'Chỉnh sửa thông tin lớp'}
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
              Tên lớp sẽ tự động sinh theo khối và yêu cầu đủ 2 giáo viên phụ trách
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-emerald-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-600">
              Khối học <span className="text-emerald-500">*</span>
            </label>
            <select
              className="admin-input"
              value={form.khoiId}
              onChange={(e) => {
                const newGradeId = e.target.value;
                setForm((prev: any) => ({ ...prev, khoiId: newGradeId }));
                if (isNew) {
                  onGradeChangeAutoName(newGradeId);
                }
              }}
            >
              <option value="">-- Chọn khối học --</option>
              {grades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.tenKhoi}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-slate-600">
                Tên lớp học (Tự động sinh) <span className="text-emerald-500">*</span>
              </label>
              {isNew && (
                <span className="text-[11px] font-semibold text-emerald-600">
                  Tự động tăng theo số lớp hiện có
                </span>
              )}
            </div>
            <input
              className="admin-input font-bold text-slate-800"
              value={form.tenLop}
              onChange={(e) => setForm({ ...form, tenLop: e.target.value })}
              placeholder="VD: Lớp Mầm 5"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-600">
              Giáo viên phụ trách 1 (Chủ nhiệm chính) <span className="text-emerald-500">*</span>
            </label>
            <select
              className="admin-input"
              value={form.giaoVienChuNhiemId}
              onChange={(e) => setForm({ ...form, giaoVienChuNhiemId: e.target.value })}
            >
              <option value="">-- Chọn giáo viên 1 --</option>
              {staffList.map((st: any) => {
                const stId = st.staffId || st.StaffId || st.id || st.Id || '';
                const stName = st.fullName || st.FullName || 'Chưa đặt tên';
                const stPhone = st.phoneNumber || st.PhoneNumber || '';
                const assignedClassName = assignedTeacherMap.get(String(stId).toLowerCase());
                const isSelectedAsSecond = String(form.giaoVienPhuId).toLowerCase() === String(stId).toLowerCase();

                return (
                  <option key={stId} value={stId} disabled={isSelectedAsSecond}>
                    {stName} {stPhone ? `(${stPhone})` : ''} -{' '}
                    {isSelectedAsSecond
                      ? '[ĐÃ CHỌN LÀM GV 2]'
                      : assignedClassName
                      ? `[Đang phụ trách: ${assignedClassName}]`
                      : '[Chưa phụ trách lớp nào]'}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-600">
              Giáo viên phụ trách 2 (Đồng chủ nhiệm / Trợ giảng) <span className="text-emerald-500">*</span>
            </label>
            <select
              className="admin-input"
              value={form.giaoVienPhuId}
              onChange={(e) => setForm({ ...form, giaoVienPhuId: e.target.value })}
            >
              <option value="">-- Chọn giáo viên 2 --</option>
              {staffList.map((st: any) => {
                const stId = st.staffId || st.StaffId || st.id || st.Id || '';
                const stName = st.fullName || st.FullName || 'Chưa đặt tên';
                const stPhone = st.phoneNumber || st.PhoneNumber || '';
                const assignedClassName = assignedTeacherMap.get(String(stId).toLowerCase());
                const isSelectedAsFirst = String(form.giaoVienChuNhiemId).toLowerCase() === String(stId).toLowerCase();

                return (
                  <option key={stId} value={stId} disabled={isSelectedAsFirst}>
                    {stName} {stPhone ? `(${stPhone})` : ''} -{' '}
                    {isSelectedAsFirst
                      ? '[ĐÃ CHỌN LÀM GV 1]'
                      : assignedClassName
                      ? `[Đang phụ trách: ${assignedClassName}]`
                      : '[Chưa phụ trách lớp nào]'}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-600">Sĩ số tối đa</label>
              <input
                className="admin-input"
                type="number"
                min="1"
                max="100"
                value={form.siSo}
                onChange={(e) => setForm({ ...form, siSo: Number(e.target.value) || 25 })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-600">Năm học</label>
              <input
                className="admin-input"
                value={form.namHoc}
                onChange={(e) => setForm({ ...form, namHoc: e.target.value })}
                placeholder="2026-2027"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
          <button onClick={onClose} className="admin-btn admin-btn-secondary cursor-pointer">
            Hủy
          </button>
          <button
            disabled={saving}
            onClick={() => void onSave()}
            className="admin-btn admin-btn-primary cursor-pointer"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Lưu lớp học
          </button>
        </div>
      </div>
    </div>
  );
};

interface ClassStudentsModalProps {
  viewStudentsClass: ClassItem | null;
  currentClassStudents: Student[];
  teacherName: string;
  gradeName: string;
  onClose: () => void;
}

export const ClassStudentsModal: React.FC<ClassStudentsModalProps> = ({
  viewStudentsClass,
  currentClassStudents,
  teacherName,
  gradeName,
  onClose,
}) => {
  if (!viewStudentsClass) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 p-3 sm:p-4">
      <div className="w-full max-w-2xl max-h-[88vh] flex flex-col rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <p className="text-[10px] font-black text-emerald-600 uppercase">DANH SÁCH HỌC SINH</p>
            <h2 className="text-base sm:text-xl font-black">{viewStudentsClass.tenLop}</h2>
            <p className="text-[11px] text-slate-500">
              Giáo viên: {teacherName} · Khối: {gradeName}
            </p>
          </div>
          <button onClick={onClose} className="icon-btn cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto min-h-0 border-t border-b border-slate-100 py-3">
          {currentClassStudents.length === 0 ? (
            <div className="py-12 text-center text-slate-400">Lớp này hiện chưa có học sinh nào.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {currentClassStudents.map((st, idx) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between py-2.5 px-2 hover:bg-slate-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-sm text-slate-800">{st.tenHocSinh}</p>
                      <p className="text-[11px] text-slate-400 font-mono">Mã: {st.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                  </div>
                  <span className="status-pill status-ok text-xs">{st.trangThaiHoc || 'Đang học'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between shrink-0 text-xs text-slate-500">
          <span>
            Tổng số: <strong>{currentClassStudents.length}</strong> / {viewStudentsClass.siSo} học sinh
          </span>
          <button onClick={onClose} className="admin-btn admin-btn-secondary cursor-pointer">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
