'use client'

import React from 'react'
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  MessageSquare,
  Eye,
  Users,
  TrendingUp,
} from 'lucide-react'
import { ActivityItem, CriterionItem } from '@/lib/development'
import { MatrixCell } from './types'

interface DanhGiaMatrixProps {
  classes: any[]
  activities: ActivityItem[]
  adminMatrixClassId: string
  setAdminMatrixClassId: (val: string) => void
  adminMatrixActivityId: string
  setAdminMatrixActivityId: (val: string) => void
  adminMatrixStudents: any[]
  adminActiveCriteria: CriterionItem[]
  adminMatrixData: Record<string, Record<string, MatrixCell>>
  onOpenDetailModal: (cellInfo: {
    studentId: string
    criterionId: string
    studentName: string
    criterionName: string
    comment: string
    evidence: string
  }) => void
}

export default function DanhGiaMatrix({
  classes,
  activities,
  adminMatrixClassId,
  setAdminMatrixClassId,
  adminMatrixActivityId,
  setAdminMatrixActivityId,
  adminMatrixStudents,
  adminActiveCriteria,
  adminMatrixData,
  onOpenDetailModal,
}: DanhGiaMatrixProps) {
  const currentClass = classes.find((c) => c.id === adminMatrixClassId)

  // Calculate statistics for the selected class
  const totalInClass = adminMatrixStudents.length
  let evaluatedStudentsCount = 0
  let totalClassPass = 0
  let totalClassFail = 0

  adminMatrixStudents.forEach((st) => {
    const row = adminMatrixData[st.id] || {}
    let hasEval = false
    Object.values(row).forEach((c) => {
      if (c.result !== null && c.result !== undefined) {
        hasEval = true
        if (c.result) totalClassPass++
        else totalClassFail++
      }
    })
    if (hasEval) evaluatedStudentsCount++
  })

  const classCompletionRate =
    totalInClass > 0 ? Math.round((evaluatedStudentsCount / totalInClass) * 100) : 0

  return (
    <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xs space-y-4">
      {/* Top Header & Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pb-4 border-b border-rose-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-800">
              Tiến độ đánh giá chi tiết theo Lớp & Trẻ
            </h3>
            <span className="flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-sky-700 border border-sky-200">
              <Eye size={12} /> Dành cho BGH giám sát
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Quan sát kết quả đánh giá các chỉ số phát triển của từng trẻ do giáo viên phụ trách thực hiện.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Lớp:</span>
            <select
              className="rounded-xl border border-rose-200/80 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-rose-400"
              value={adminMatrixClassId}
              onChange={(e) => setAdminMatrixClassId(e.target.value)}
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.tenLop}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-medium">Hoạt động:</span>
            <select
              className="rounded-xl border border-rose-200/80 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-rose-400"
              value={adminMatrixActivityId}
              onChange={(e) => setAdminMatrixActivityId(e.target.value)}
            >
              <option value="">Tất cả hoạt động</option>
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Class Overview Statistics Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <Users size={16} />
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Sĩ số lớp {currentClass?.tenLop || ''}</p>
            <p className="font-black text-slate-800 text-sm">{totalInClass} trẻ</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <TrendingUp size={16} />
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Tiến độ giáo viên đánh giá</p>
            <p className="font-black text-amber-700 text-sm">
              {evaluatedStudentsCount}/{totalInClass} trẻ ({classCompletionRate}%)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 size={16} />
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Lượt chỉ số Đạt</p>
            <p className="font-black text-emerald-700 text-sm">{totalClassPass} lượt</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <XCircle size={16} />
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Cần rèn luyện thêm</p>
            <p className="font-black text-rose-700 text-sm">{totalClassFail} lượt</p>
          </div>
        </div>
      </div>

      {/* Read-Only Matrix of Children and Criteria */}
      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-rose-50/90 backdrop-blur-xs border-b border-rose-100 text-slate-700">
            <tr>
              <th className="p-3 min-w-[160px] font-bold text-slate-800">Học sinh</th>
              <th className="p-3 w-28 text-center font-bold text-slate-600">Đã đạt</th>
              {adminActiveCriteria.map((crit) => (
                <th
                  key={crit.id}
                  className="p-2.5 min-w-[120px] text-center font-bold text-slate-700"
                >
                  <div className="truncate max-w-[140px]" title={crit.name}>
                    {crit.name}
                  </div>
                </th>
              ))}
              <th className="p-3 min-w-[200px] font-bold text-slate-800">
                Ghi chú / Nhận xét của GV
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-50">
            {adminMatrixStudents.map((st) => {
              const row = adminMatrixData[st.id] || {}
              let childPassCount = 0
              let childTotalAssessed = 0
              let sampleComment = ''

              adminActiveCriteria.forEach((crit) => {
                const cell = row[crit.id]
                if (cell && cell.result !== null && cell.result !== undefined) {
                  childTotalAssessed++
                  if (cell.result) childPassCount++
                  if (cell.comment && !sampleComment) sampleComment = cell.comment
                }
              })

              return (
                <tr key={st.id} className="hover:bg-rose-50/20 transition">
                  <td className="p-3 font-bold text-slate-800 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-black text-[11px]">
                        {(st.tenHocSinh || 'B').charAt(0)}
                      </span>
                      <span>{st.tenHocSinh}</span>
                    </div>
                  </td>

                  {/* Summary progress badge for this child */}
                  <td className="p-2.5 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[11px] ${
                        childTotalAssessed === 0
                          ? 'bg-slate-100 text-slate-400'
                          : childPassCount === childTotalAssessed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {childTotalAssessed > 0
                        ? `${childPassCount}/${childTotalAssessed} Đạt`
                        : 'Chưa đánh giá'}
                    </span>
                  </td>

                  {/* Read-Only Criteria Badges */}
                  {adminActiveCriteria.map((crit) => {
                    const cell = row[crit.id] || { result: null }
                    return (
                      <td key={crit.id} className="p-2 text-center align-middle">
                        <button
                          type="button"
                          onClick={() =>
                            onOpenDetailModal({
                              studentId: st.id,
                              criterionId: crit.id,
                              studentName: st.tenHocSinh,
                              criterionName: crit.name,
                              comment: cell.comment || '',
                              evidence: cell.evidence || '',
                            })
                          }
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-lg transition cursor-pointer ${
                            cell.result === true
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : cell.result === false
                              ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                              : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                          }`}
                          title={`Xem chi tiết tiêu chí: ${crit.name} (${
                            cell.result === true
                              ? 'Đạt'
                              : cell.result === false
                              ? 'Cần rèn luyện'
                              : 'Chưa đánh giá'
                          })`}
                        >
                          {cell.result === true ? (
                            <CheckCircle2 size={15} />
                          ) : cell.result === false ? (
                            <XCircle size={15} />
                          ) : (
                            <HelpCircle size={14} />
                          )}
                        </button>
                      </td>
                    )
                  })}

                  {/* Teacher's comment preview */}
                  <td className="p-3 text-slate-600 italic text-[11px] max-w-[220px] truncate">
                    {sampleComment ? (
                      <span className="flex items-center gap-1">
                        <MessageSquare size={12} className="text-amber-500 shrink-0" />
                        <span className="truncate" title={sampleComment}>
                          {sampleComment}
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-400 not-italic">--</span>
                    )}
                  </td>
                </tr>
              )
            })}

            {adminMatrixStudents.length === 0 && (
              <tr>
                <td
                  colSpan={adminActiveCriteria.length + 3}
                  className="p-8 text-center text-slate-400"
                >
                  Không có học sinh nào trong lớp được chọn.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Guide footer */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-rose-50">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-bold text-emerald-700">
            <CheckCircle2 size={14} /> Đạt tiêu chí
          </span>
          <span className="flex items-center gap-1 font-bold text-rose-700">
            <XCircle size={14} /> Cần rèn luyện thêm
          </span>
          <span className="flex items-center gap-1 text-slate-400 font-medium">
            <HelpCircle size={14} /> Chưa đánh giá
          </span>
        </div>
        <p className="text-[11px] text-slate-400 italic">
          Bấm vào biểu tượng bất kỳ để xem ghi chú và minh chứng chi tiết do giáo viên nhập.
        </p>
      </div>
    </div>
  )
}
