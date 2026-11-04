'use client'

import React from 'react'
import { Calendar, CheckCircle2, XCircle, MessageSquare } from 'lucide-react'
import { AssessmentItem } from "@/services/development"

interface AssessmentActivitiesHistoryProps {
  assessments: AssessmentItem[]
  getCriterionName: (id: string) => string
  getActivityName: (id?: string | null) => string
}

export default function AssessmentActivitiesHistory({
  assessments,
  getCriterionName,
  getActivityName,
}: AssessmentActivitiesHistoryProps) {
  return (
    <div className="rounded-3xl border border-rose-100 bg-white overflow-hidden shadow-xs">
      <div className="p-4 border-b border-rose-100 bg-rose-50/20 flex justify-between items-center">
        <div>
          <h4 className="text-sm font-black text-slate-800">Nhật ký quan sát & Đánh giá của cô giáo</h4>
          <p className="text-[11px] text-slate-400">Ghi nhận từng hoạt động thực tế bé tham gia trên lớp</p>
        </div>
        <span className="text-xs font-bold text-slate-500">
          Tổng số: <b className="text-rose-600">{assessments.length}</b> lượt
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-rose-100 bg-slate-50/50 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
              <th className="p-3.5">Thời gian</th>
              <th className="p-3.5">Hoạt động / Tiêu chí rèn luyện</th>
              <th className="p-3.5 text-center">Kết quả</th>
              <th className="p-3.5">Lời cô dặn dò / Nhận xét</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-50">
            {assessments.map((a) => (
              <tr key={a.id} className="hover:bg-rose-50/20 transition">
                <td className="p-3.5 whitespace-nowrap text-slate-500 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-rose-400" />
                    <span>{a.assessedAt ? String(a.assessedAt).slice(0, 10) : 'Gần đây'}</span>
                  </div>
                </td>
                <td className="p-3.5">
                  <p className="font-bold text-slate-800">{getActivityName(a.activityId)}</p>
                  <p className="text-[10px] text-rose-600 font-semibold mt-0.5">{getCriterionName(a.developmentCriterionId)}</p>
                </td>
                <td className="p-3.5 text-center">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    a.result ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {a.result ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {a.result ? 'Hoàn thành' : 'Cần rèn luyện'}
                  </span>
                </td>
                <td className="p-3.5 text-slate-600">
                  {a.comment ? (
                    <div className="flex items-start gap-1.5">
                      <MessageSquare size={13} className="text-slate-400 shrink-0 mt-0.5" />
                      <p className="font-medium text-slate-700 leading-relaxed">{a.comment}</p>
                    </div>
                  ) : (
                    <span className="text-slate-300 italic">Bé tham gia tích cực</span>
                  )}
                </td>
              </tr>
            ))}

            {assessments.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400 italic">
                  Chưa có lượt đánh giá nào được ghi nhận cho bé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
