'use client'

import React from 'react'
import { History, X, Save, Trash2, Clock, Ruler, Scale, Activity } from 'lucide-react'
import { Student, RecordRow, getQuarterFromDate } from './types'
import WhoGrowthChart from '@/app/components/WhoGrowthChart'

interface FormState {
  height: string
  weight: string
  note: string
  checkupDate: string
  quarterName: string
}

interface SucKhoeDetailModalProps {
  selected: Student
  className: string
  history: RecordRow[]
  historyChart: Array<{ date: string; height: number; weight: number; bmi: number }>
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  busy: boolean
  onClose: () => void
  onSave: () => void
  onRemove: (id: string) => void
}

export const SucKhoeDetailModal: React.FC<SucKhoeDetailModalProps> = ({
  selected,
  className,
  history,
  form,
  setForm,
  busy,
  onClose,
  onSave,
  onRemove,
}) => {
  return (
    <div className="admin-card p-6 border-2 border-indigo-500 shadow-xl space-y-6">
      {/* Header Modal */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="text-indigo-600" size={24} />
            <h2 className="text-xl font-black text-slate-900">
              Chi tiết Thể trạng & Lịch sử Khám Sức Khỏe (WHO 0 - 5 Tuổi)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Học sinh: <b className="text-slate-800">{selected.tenHocSinh}</b> ({className}) · Giới tính: <b className="text-slate-700">{selected.gioiTinh}</b> · Ngày sinh: {String(selected.ngaySinh).slice(0, 10)}
          </p>
        </div>
        <button onClick={onClose} className="icon-btn">
          <X size={18} />
        </button>
      </div>

      {/* Biểu đồ Đường Cong Tăng Trưởng Xuyên Suốt Chuẩn WHO */}
      <div>
        <h3 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2">
          <Activity size={18} className="text-indigo-600" />
          Biểu đồ tăng trưởng xuyên suốt (HAZ, WAZ, WHZ) so với đường cong chuẩn WHO
        </h3>
        <WhoGrowthChart
          records={history as any}
          gender={selected.gioiTinh}
          dob={selected.ngaySinh}
          studentName={selected.tenHocSinh}
          height={320}
        />
      </div>

      {/* Grid: Form Nhập đợt khám mới + Bảng lịch sử */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr] border-t border-slate-100 pt-5">
        {/* Form Nhập đợt khám mới */}
        <div className="space-y-4 rounded-2xl bg-slate-50 p-5 border border-slate-200">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white font-black text-xs">
              +
            </span>
            Nhập đợt cân đo mới cho học sinh
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-600">
                Tên Đợt khám / Quý
              </span>
              <select
                className="admin-input font-bold"
                value={form.quarterName}
                onChange={(e) => setForm({ ...form, quarterName: e.target.value })}
              >
                <option value="Đợt khám Quý 1/2026">Đợt khám Quý 1/2026 (Tháng 1-3)</option>
                <option value="Đợt khám Quý 2/2026">Đợt khám Quý 2/2026 (Tháng 4-6)</option>
                <option value="Đợt khám Quý 3/2026">Đợt khám Quý 3/2026 (Tháng 7-9)</option>
                <option value="Đợt khám Quý 4/2026">Đợt khám Quý 4/2026 (Tháng 10-12)</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-600">
                Ngày thực hiện khám
              </span>
              <input
                className="admin-input font-bold"
                type="date"
                value={form.checkupDate}
                onChange={(e) => setForm({ ...form, checkupDate: e.target.value })}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-600">Chiều cao (cm)</span>
              <input
                className="admin-input font-bold"
                type="number"
                step="0.1"
                placeholder="Ví dụ: 102.5"
                value={form.height}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-600">Cân nặng (kg)</span>
              <input
                className="admin-input font-bold"
                type="number"
                step="0.1"
                placeholder="Ví dụ: 16.8"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-600">
              Ghi chú / Chỉ định can thiệp
            </span>
            <input
              className="admin-input"
              placeholder="Ví dụ: Cần bổ sung Canxi/D3 hoặc phối hợp theo dõi"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </label>

          <div className="flex justify-end pt-2">
            <button
              disabled={busy || !form.height || !form.weight}
              onClick={onSave}
              className="admin-btn admin-btn-primary w-full sm:w-auto"
            >
              <Save size={16} />
              {busy ? 'Đang lưu & tính toán...' : 'Lưu chỉ số đợt này'}
            </button>
          </div>
        </div>

        {/* Bảng Lịch sử các đợt khám */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
            <Clock size={16} className="text-indigo-600" /> Bảng lịch sử các đợt đo
          </h3>
          <div className="overflow-x-auto max-h-[300px] border border-slate-200 rounded-2xl">
            <table className="admin-table">
              <thead className="sticky top-0 bg-slate-50 z-10">
                <tr>
                  <th>Ngày đo</th>
                  <th>Chiều cao</th>
                  <th>Cân nặng</th>
                  <th>HAZ (CC/Tuổi)</th>
                  <th>WAZ (CN/Tuổi)</th>
                  <th>WHZ (Thể trạng)</th>
                  <th className="text-right">Xóa</th>
                </tr>
              </thead>
              <tbody>
                {history.map((x) => {
                  return (
                    <tr key={x.id}>
                      <td className="font-semibold">{String(x.ngayDo).slice(0, 10)}</td>
                      <td><b>{x.chieuCao ?? '—'}</b> cm</td>
                      <td><b>{x.canNang ?? '—'}</b> kg</td>
                      <td>
                        <span className="text-xs font-bold text-blue-700">
                          {x.haz != null ? `${x.haz > 0 ? '+' : ''}${x.haz} SD` : '—'}
                        </span>
                      </td>
                      <td>
                        <span className="text-xs font-bold text-emerald-700">
                          {x.waz != null ? `${x.waz > 0 ? '+' : ''}${x.waz} SD` : '—'}
                        </span>
                      </td>
                      <td>
                        <span className="text-xs font-bold text-amber-700">
                          {x.whz != null ? `${x.whz > 0 ? '+' : ''}${x.whz} SD` : '—'}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => onRemove(x.id)}
                          className="icon-btn danger"
                          title="Xóa đợt khám này"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {!history.length && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Chưa có lịch sử đợt khám sức khỏe nào cho học sinh này.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
