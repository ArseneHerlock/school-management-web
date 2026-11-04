'use client'

import React from 'react'
import { CheckCircle2, XCircle, Trash2, Calendar, FileSearch } from 'lucide-react'
import { AssessmentItem } from "@/services/development"
import Pagination from '@/app/admin/components/shared/Pagination'

interface DanhGiaHistoryProps {
  paginatedAssessments: AssessmentItem[]
  filteredAssessmentsCount: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  getStudentName: (id: string) => string
  getClassName: (id: string) => string
  getCriterionName: (id: string) => string
  getCriterionCode: (id: string) => string
  getActivityName: (id?: string | null) => string
  onDeleteClick: (item: AssessmentItem) => void
}

export default function DanhGiaHistory({
  paginatedAssessments,
  filteredAssessmentsCount,
  currentPage,
  pageSize,
  onPageChange,
  getStudentName,
  getClassName,
  getCriterionName,
  getCriterionCode,
  getActivityName,
  onDeleteClick,
}: DanhGiaHistoryProps) {
  return (
    <div className="rounded-3xl border border-rose-100 bg-white overflow-hidden shadow-xs">
      <div className="p-4 border-b border-rose-100 bg-rose-50/30 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">Lịch sử đánh giá chi tiết</h3>
        <span className="text-xs font-semibold text-slate-500">
          Tổng số: <span className="text-rose-600 font-bold">{filteredAssessmentsCount}</span> bản ghi
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-rose-100 bg-slate-50/50 text-slate-500 uppercase text-[10px] tracking-wider">
              <th className="p-3.5">Học sinh</th>
              <th className="p-3.5">Tiêu chí đánh giá</th>
              <th className="p-3.5">Hoạt động</th>
              <th className="p-3.5 text-center">Kết quả</th>
              <th className="p-3.5">Nhận xét & Minh chứng</th>
              <th className="p-3.5 text-center">Thời gian</th>
              <th className="p-3.5 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-50">
            {paginatedAssessments.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  <FileSearch className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                  Không tìm thấy kết quả đánh giá nào phù hợp
                </td>
              </tr>
            ) : (
              paginatedAssessments.map((a) => (
                <tr key={a.id} className="hover:bg-rose-50/20 transition">
                  <td className="p-3.5 font-bold text-slate-800">
                    <p>{getStudentName(a.childId)}</p>
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold text-slate-700">{getCriterionName(a.developmentCriterionId)}</span>
                    <span className="ml-1 text-[10px] text-slate-400">({getCriterionCode(a.developmentCriterionId)})</span>
                  </td>
                  <td className="p-3.5 text-slate-600">
                    {getActivityName(a.activityId)}
                  </td>
                  <td className="p-3.5 text-center">
                    {a.result ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={13} /> Đạt
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 border border-rose-200">
                        <XCircle size={13} /> Chưa đạt
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-600 max-w-xs truncate">
                    {a.comment || a.evidence ? (
                      <div>
                        {a.comment && <p className="truncate font-medium">{a.comment}</p>}
                        {a.evidence && <p className="text-[10px] text-slate-400 truncate">{a.evidence}</p>}
                      </div>
                    ) : (
                      <span className="text-slate-300 italic">Không có nhận xét</span>
                    )}
                  </td>
                  <td className="p-3.5 text-center text-slate-500 whitespace-nowrap">
                    {a.assessedAt ? new Date(a.assessedAt).toLocaleDateString('vi-VN') : '-'}
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => onDeleteClick(a)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                      title="Xóa đánh giá"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 border-t border-rose-100 flex justify-end">
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={filteredAssessmentsCount}
          totalPages={Math.ceil(filteredAssessmentsCount / pageSize) || 1}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  )
}
