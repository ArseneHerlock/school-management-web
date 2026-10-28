'use client'

import React, { useCallback, useState } from 'react'
import { CalendarDays, RefreshCw, CheckCircle2, XCircle, HelpCircle, MessageSquare, Clock, MapPin, UserCheck, Sparkles } from 'lucide-react'
import { ChildInfo } from '../types'
import WeeklyTimetable, { TimetableScheduleItem } from '@/app/components/schedule/WeeklyTimetable'
import Modal from '@/app/components/ui/Modal'
import { getParentSchedules, getSchedules, getEvaluationsForSchedule, ActivityChildEvaluation } from '@/services/schedule'

export default function ScheduleTab({ child }: { child: ChildInfo }) {
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedItem, setSelectedItem] = useState<TimetableScheduleItem | null>(null)
  const [childEvaluations, setChildEvaluations] = useState<ActivityChildEvaluation[]>([])

  React.useEffect(() => {
    if (!selectedItem) {
      setChildEvaluations([])
      return
    }
    getEvaluationsForSchedule(selectedItem.id).then((evals) => {
      const filtered = evals.filter(
        (e: ActivityChildEvaluation) =>
          String(e.childId) === String(child.id) ||
          (e.childName &&
            child.hoTen &&
            e.childName.trim().toLowerCase() === child.hoTen.trim().toLowerCase())
      )
      setChildEvaluations(filtered)
    }).catch(() => setChildEvaluations([]))
  }, [selectedItem, child.id, child.hoTen])

  // Fetch parent schedules dynamically from Backend API (strictly real data)
  const fetchParentSchedules = useCallback(
    async (params: {
      from: string;
      to: string;
      type?: number;
      classId?: string;
    }): Promise<TimetableScheduleItem[]> => {
      const q = new URLSearchParams()
      if (params.from) q.set('from', params.from)
      if (params.to) q.set('to', params.to)
      if (params.type !== undefined) q.set('type', String(params.type))
      const targetClass = child.lop || ''
      if (targetClass) q.set('classId', targetClass)

      // Call backend parent schedule API, fallback to standard schedule endpoint
      const scheduleParams = {
        from: params.from,
        to: params.to,
        type: params.type,
        classId: targetClass || undefined,
      }
      const res = await getParentSchedules(scheduleParams).catch(() =>
        getSchedules(scheduleParams).catch(() => [])
      )

      const fetchedList = Array.isArray(res) ? res : []
      const childClass = (child.lop || '').trim().toLowerCase()

      // Parent only sees their child's class schedules and school-wide events
      const filtered = fetchedList.filter((x: any) => {
        if (x.isSchoolWide) return true
        if (!childClass) return true
        const itemClass = (x.className || '').trim().toLowerCase()
        return !itemClass || itemClass === childClass || itemClass === 'toàn trường'
      })

      return filtered.map((x: any) => ({
        id: String(x.id || ''),
        title: x.title || x.tieuDe || x.tenSuKien || 'Hoạt động của bé',
        description: x.description || x.moTa || '',
        type: Number(x.type ?? x.loai ?? 1),
        date: String(x.date || x.ngay || new Date().toISOString()).slice(0, 10),
        startTime: String(x.startTime || x.gioBatDau || '07:30').slice(0, 5),
        endTime: String(x.endTime || x.gioKetThuc || '09:30').slice(0, 5),
        location: x.location || x.diaDiem || 'Phòng học',
        className: x.isSchoolWide ? 'Toàn trường' : child.lop || x.className || 'Lớp của bé',
        status: x.status || 'Approved',
        teacherName:
          x.teacherName ||
          x.teachers?.[0]?.teacherId ||
          child.giaoVienChuNhiem ||
          'Cô giáo phụ trách',
        teachers: x.teachers,
        isSchoolWide: Boolean(x.isSchoolWide),
        isActivity: Boolean(x.isActivity || x.type === 2 || x.type === 4),
        criteria: x.criteria,
      }))
    },
    [child.id, child.lop, child.giaoVienChuNhiem]
  )

  const teacherComment = childEvaluations.find((e: ActivityChildEvaluation) => Boolean(e.comment?.trim()))?.comment

  return (
    <section className="space-y-4">
      {/* Proposed Weekly Timetable Layout */}
      <WeeklyTimetable
        key={refreshKey}
        userRole="parent"
        fetchSchedules={fetchParentSchedules}
        onItemClick={(item) => setSelectedItem(item)}
        extraHeaderInfo={
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500">Học sinh:</span>
            <span className="font-bold text-sky-800 bg-sky-100/70 px-2 py-0.5 rounded border border-sky-200">
              {child.hoTen}
            </span>
            <span className="font-semibold text-slate-500 ml-1">Lớp:</span>
            <span className="font-bold text-indigo-800 bg-indigo-100/70 px-2 py-0.5 rounded border border-indigo-200">
              {child.lop || 'Lớp của bé'}
            </span>
            {child.giaoVienChuNhiem && (
              <>
                <span className="font-semibold text-slate-500 ml-1">GVCN:</span>
                <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {child.giaoVienChuNhiem}
                </span>
              </>
            )}
          </div>
        }
      />

      {/* Parent Activity Detail & Evaluation Modal */}
      {selectedItem && (
        <Modal
          isOpen={Boolean(selectedItem)}
          onClose={() => setSelectedItem(null)}
          title={`Chi tiết hoạt động: ${selectedItem.title}`}
          subtitle={`${selectedItem.isSchoolWide ? 'Hoạt động toàn trường' : selectedItem.className} • Ngày ${selectedItem.date}`}
          maxWidth="lg"
        >
          <div className="space-y-5 font-sans">
            {/* Meta badges */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <Clock size={15} className="text-sky-600" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Thời gian</p>
                  <p className="font-bold text-slate-700">
                    {selectedItem.startTime} - {selectedItem.endTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <MapPin size={15} className="text-rose-500" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Địa điểm</p>
                  <p className="font-bold text-slate-700">{selectedItem.location || 'Phòng học'}</p>
                </div>
              </div>
            </div>

            {selectedItem.description && (
              <div className="text-xs text-slate-600 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                <span className="font-bold text-amber-900 block mb-1">Mô tả hoạt động:</span>
                <p className="leading-relaxed">{selectedItem.description}</p>
              </div>
            )}

            {/* Child Evaluation & Indicators */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <UserCheck size={15} className="text-emerald-600" />
                  Kết quả rèn luyện của bé: <span className="text-sky-700">{child.hoTen}</span>
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    childEvaluations.length > 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {childEvaluations.length > 0 ? 'Đã ghi nhận' : 'Đang tiến hành'}
                </span>
              </div>

              {childEvaluations.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Các chỉ số tiêu chí đã đánh giá:
                  </p>
                  <div className="grid gap-2">
                    {childEvaluations.map((ev: ActivityChildEvaluation, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 border border-slate-100"
                      >
                        <span className="text-xs font-semibold text-slate-700">
                          {ev.criterionId === 'crit_participate'
                            ? 'Tham gia & Tương tác'
                            : ev.criterionId === 'crit_skill'
                            ? 'Kỹ năng thực hiện'
                            : `Tiêu chí phát triển #${idx + 1}`}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold ${
                            ev.result
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {ev.result ? (
                            <>
                              <CheckCircle2 size={13} /> Đạt
                            </>
                          ) : (
                            <>
                              <XCircle size={13} /> Cần rèn luyện
                            </>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-slate-50 p-3.5 text-center text-xs text-slate-500 border border-dashed border-slate-200">
                  <HelpCircle size={18} className="mx-auto text-slate-400 mb-1" />
                  <p className="font-medium">Hoạt động đang diễn ra hoặc chưa có đánh giá riêng.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Cô giáo sẽ cập nhật đánh giá và nhận xét của bé sau khi hoàn thành hoạt động.
                  </p>
                </div>
              )}

              {/* Teacher's comment for this activity */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                  <MessageSquare size={13} className="text-amber-500" />
                  Nhận xét của cô về bé trong hoạt động:
                </span>
                {teacherComment ? (
                  <div className="rounded-xl bg-amber-50/70 p-3 border border-amber-200/70 text-xs text-amber-950 italic leading-relaxed">
                    “{teacherComment}”
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Chưa có nhận xét riêng từ cô giáo cho hoạt động này.
                  </p>
                )}
              </div>
            </div>

            {/* Modal action */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  )
}
