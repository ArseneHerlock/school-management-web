'use client'

import React from 'react'
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  CheckSquare,
  Square,
  Save,
  MessageSquare,
  Sparkles,
  Loader2,
  Search,
} from 'lucide-react'
import { ActivityItem, DomainItem, CriterionItem } from '@/lib/development'

interface TeacherAssessmentMatrixProps {
  activities: ActivityItem[]
  selectedActivityId: string
  onSelectActivity: (id: string) => void
  domains: DomainItem[]
  selectedDomainId: string
  onSelectDomain: (id: string) => void
  searchCriterion: string
  onSearchCriterionChange: (q: string) => void
  auditMode: boolean
  onToggleAuditMode: () => void
  dirtyCount: number
  isSaving: boolean
  onOpenConfirmSave: () => void
  classStudents: any[]
  displayCriteria: CriterionItem[]
  matrix: Record<string, Record<string, any>>
  selectedStudentIds: Set<string>
  onToggleSelectAll: () => void
  onToggleStudent: (id: string) => void
  onCellClick: (studentId: string, criterionId: string) => void
  onMarkRowPass: (studentId: string) => void
  onMarkColPass: (criterionId: string) => void
  onOpenCellDetail: (info: any) => void
  childActivityRemarks: Record<string, any>
  onChangeChildRemark: (studentId: string, val: string) => void
}

export default function TeacherAssessmentMatrix({
  activities,
  selectedActivityId,
  onSelectActivity,
  domains,
  selectedDomainId,
  onSelectDomain,
  searchCriterion,
  onSearchCriterionChange,
  auditMode,
  onToggleAuditMode,
  dirtyCount,
  isSaving,
  onOpenConfirmSave,
  classStudents,
  displayCriteria,
  matrix,
  selectedStudentIds,
  onToggleSelectAll,
  onToggleStudent,
  onCellClick,
  onMarkRowPass,
  onMarkColPass,
  onOpenCellDetail,
  childActivityRemarks,
  onChangeChildRemark,
}: TeacherAssessmentMatrixProps) {
  return (
    <div className="space-y-4">
      {/* Thanh công cụ lọc */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-3xl border border-rose-100 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-full sm:w-auto min-w-0">
            <select
              value={selectedActivityId}
              onChange={(e) => onSelectActivity(e.target.value)}
              className="w-full sm:w-auto max-w-full sm:max-w-xs truncate rounded-xl border border-rose-200 bg-rose-50/40 px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-rose-400"
            >
              <option value="">-- Tất cả hoạt động --</option>
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.code} - {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-auto min-w-0">
            <select
              value={selectedDomainId}
              onChange={(e) => onSelectDomain(e.target.value)}
              className="w-full sm:w-auto max-w-full sm:max-w-[240px] truncate rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-rose-400"
            >
              <option value="ALL">Tất cả lĩnh vực</option>
              {domains.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
            <input
              type="text"
              placeholder="Tìm tiêu chí..."
              value={searchCriterion}
              onChange={(e) => onSearchCriterionChange(e.target.value)}
              className="w-36 rounded-xl border border-rose-200 py-1.5 pl-8 pr-2 text-xs outline-none focus:w-48 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleAuditMode}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition border ${
              auditMode
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white text-slate-600 border-rose-200 hover:bg-rose-50'
            }`}
          >
            Chế độ rà soát
          </button>

          <button
            onClick={onOpenConfirmSave}
            disabled={dirtyCount === 0 || isSaving}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition shadow-sm ${
              dirtyCount > 0
                ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-rose-500/20 hover:from-rose-600 hover:to-rose-700'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span>Lưu đánh giá ({dirtyCount})</span>
          </button>
        </div>
      </div>

      {/* Bảng Ma Trận */}
      <div className="bg-white rounded-3xl border border-rose-100 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-rose-100 bg-rose-50/30 text-slate-700">
                <th className="p-3 w-10 text-center">
                  <button onClick={onToggleSelectAll} className="text-slate-400 hover:text-rose-600">
                    {selectedStudentIds.size === classStudents.length ? (
                      <CheckSquare size={16} className="text-rose-600" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </th>
                <th className="p-3 min-w-[140px] font-bold">Học sinh</th>
                <th className="p-3 w-16 text-center font-bold text-slate-500">Nhanh</th>
                {displayCriteria.map((c) => {
                  let allPass = classStudents.length > 0;
                  let allFail = classStudents.length > 0;
                  for (const st of classStudents) {
                    const res = matrix[st.id]?.[c.id]?.result;
                    if (res !== true) allPass = false;
                    if (res !== false) allFail = false;
                  }

                  let btnText = 'Đạt cả cột';
                  let btnColor = 'text-emerald-600 hover:text-emerald-800 bg-emerald-50';
                  if (allPass) {
                    btnText = 'Không đạt';
                    btnColor = 'text-rose-600 hover:text-rose-800 bg-rose-50';
                  } else if (allFail) {
                    btnText = 'Reset trắng';
                    btnColor = 'text-slate-600 hover:text-slate-800 bg-slate-100';
                  }

                  return (
                    <th key={c.id} className="p-2.5 min-w-[110px] text-center font-bold text-slate-700">
                      <div className="truncate max-w-[120px]" title={c.name}>
                        {c.name}
                      </div>
                      <button
                        onClick={() => onMarkColPass(c.id)}
                        className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md transition ${btnColor}`}
                        title="Nhấn lần 1: Đạt → Lần 2: Không đạt → Lần 3: Chưa đánh giá"
                      >
                        {btnText}
                      </button>
                    </th>
                  );
                })}
                <th className="p-3 min-w-[160px] font-bold text-slate-700">Nhận xét buổi học</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {classStudents.map((st) => {
                const isSelected = selectedStudentIds.has(st.id)
                return (
                  <tr key={st.id} className="hover:bg-rose-50/20 transition">
                    <td className="p-3 text-center">
                      <button onClick={() => onToggleStudent(st.id)} className="text-slate-400 hover:text-rose-600">
                        {isSelected ? <CheckSquare size={16} className="text-rose-600" /> : <Square size={16} />}
                      </button>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">
                      <p className="truncate">{st.tenHocSinh}</p>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onMarkRowPass(st.id)}
                        className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 hover:bg-emerald-100"
                      >
                        Đạt
                      </button>
                    </td>
                    {displayCriteria.map((crit) => {
                      const cell = matrix[st.id]?.[crit.id] || { result: null }
                      const isDirty = cell.isDirty
                      return (
                        <td key={crit.id} className="p-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => onCellClick(st.id, crit.id)}
                              className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${
                                cell.result === true
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : cell.result === false
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                              } ${isDirty ? 'ring-2 ring-amber-400' : ''}`}
                            >
                              {cell.result === true ? (
                                <CheckCircle2 size={16} />
                              ) : cell.result === false ? (
                                <XCircle size={16} />
                              ) : (
                                <HelpCircle size={15} />
                              )}
                            </button>
                            {auditMode && (
                              <button
                                onClick={() =>
                                  onOpenCellDetail({
                                    studentId: st.id,
                                    criterionId: crit.id,
                                    studentName: st.tenHocSinh,
                                    criterionName: crit.name,
                                    comment: cell.comment || '',
                                    evidence: cell.evidence || '',
                                  })
                                }
                                className="text-slate-400 hover:text-slate-600"
                              >
                                <MessageSquare size={12} />
                              </button>
                            )}
                          </div>
                        </td>
                      )
                    })}
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="Nhận xét bé hôm nay..."
                        value={childActivityRemarks[st.id]?.comment || ''}
                        onChange={(e) => onChangeChildRemark(st.id, e.target.value)}
                        className="w-full rounded-xl border border-rose-100 bg-rose-50/30 px-2.5 py-1 text-xs outline-none focus:border-rose-400 focus:bg-white"
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
