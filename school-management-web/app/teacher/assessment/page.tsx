'use client'

import { useEffect, useMemo, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { RefreshCw, LayoutGrid, BarChart3, ArrowLeft } from 'lucide-react'
import { currentUser, getClasses, getStudents } from '@/services'
import {
  getActivities,
  getDomains,
  getCriteria,
  getAssessments,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  ActivityItem,
  DomainItem,
  CriterionItem,
  AssessmentItem,
} from '@/lib/development'
import TabsNav, { TabItem } from '@/app/components/ui/TabsNav'
import TeacherAssessmentStats from './components/TeacherAssessmentStats'
import TeacherAssessmentMatrix from './components/TeacherAssessmentMatrix'
import TeacherAssessmentModals from './components/TeacherAssessmentModals'

type TeacherViewTab = 'dashboard' | 'matrix'

function TeacherAssessmentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryTab = searchParams.get('tab')

  // Ngữ cảnh hoạt động được bấm từ thời khóa biểu (lưu trong sessionStorage để giữ URL sạch và chuẩn REST)
  const [focusedScheduleContext, setFocusedScheduleContext] = useState<{
    scheduleId?: string
    activityId?: string
    title?: string
    classId?: string
    date?: string
  } | null>(null)

  const [activeTab, setActiveTab] = useState<TeacherViewTab>(
    queryTab === 'matrix' ? 'matrix' : 'dashboard'
  )
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const [authorizedClasses, setAuthorizedClasses] = useState<any[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string>('')
  const [classStudents, setClassStudents] = useState<any[]>([])

  const [domains, setDomains] = useState<DomainItem[]>([])
  const [selectedDomainId, setSelectedDomainId] = useState<string>('ALL')
  const [allCriteria, setAllCriteria] = useState<CriterionItem[]>([])
  const [searchCriterion, setSearchCriterion] = useState<string>('')

  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [selectedActivityId, setSelectedActivityId] = useState<string>('')
  const [targetActivityTitle, setTargetActivityTitle] = useState<string>('')
  const [childActivityRemarks, setChildActivityRemarks] = useState<Record<string, any>>({})

  const [existingAssessments, setExistingAssessments] = useState<AssessmentItem[]>([])
  const [matrix, setMatrix] = useState<Record<string, Record<string, any>>>({})
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set())
  const [auditMode, setAuditMode] = useState(false)

  // Modals state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [cellDetailModal, setCellDetailModal] = useState({ open: false, studentId: '', criterionId: '', studentName: '', criterionName: '', comment: '', evidence: '' })
  const [childRadarModal, setChildRadarModal] = useState<{ open: boolean; student: any | null }>({ open: false, student: null })

  // Đọc ngữ cảnh từ sessionStorage khi component mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('teacher_focused_activity')
      if (stored) {
        const parsed = JSON.parse(stored)
        setFocusedScheduleContext(parsed)
        setActiveTab('matrix')
        if (parsed.classId) setSelectedClassId(parsed.classId)
        if (parsed.title) setTargetActivityTitle(parsed.title)
      }
    } catch {}
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const user = currentUser()
      const [clsRes, domRes, criRes, actRes, assRes] = await Promise.all([
        getClasses().catch(() => []),
        getDomains(),
        getCriteria({ page: 1, pageSize: 300 }),
        getActivities({ page: 1, pageSize: 100 }),
        getAssessments({ page: 1, pageSize: 1000 }),
      ])
      const clsList = Array.isArray(clsRes) ? clsRes : []
      setAuthorizedClasses(clsList)
      setDomains(domRes?.items || [])
      setAllCriteria(criRes?.items || [])
      
      const actItems: ActivityItem[] = actRes?.items || []
      setActivities(actItems)
      setExistingAssessments(assRes?.items || [])

      // Tìm hoạt động khớp với ngữ cảnh đã chọn
      let focusedObj = focusedScheduleContext
      if (!focusedObj) {
        try {
          const raw = sessionStorage.getItem('teacher_focused_activity')
          if (raw) focusedObj = JSON.parse(raw)
        } catch {}
      }

      if (focusedObj) {
        setActiveTab('matrix')
        const rawTitle = (focusedObj.title || '').trim()
        const cleanTitle = rawTitle.replace(/\s*-\s*lớp\s+.*$/i, '').trim().toLowerCase()

        let found = actItems.find((a) => {
          if (focusedObj?.activityId && (a.id === focusedObj.activityId || a.code === focusedObj.activityId)) {
            return true
          }
          if (cleanTitle) {
            const name = a.name.trim().toLowerCase()
            return cleanTitle === name || cleanTitle.includes(name) || name.includes(cleanTitle)
          }
          return false
        })

        // Fallback keyword matching if schedule item was created before direct activityId linking
        if (!found && cleanTitle && actItems.length > 0) {
          const keywords = ['âm nhạc', 'hát', 'múa', 'vận động', 'thể chất', 'thể thao', 'tạo hình', 'vẽ', 'mỹ thuật', 'khám phá', 'ngoài trời', 'dã ngoại', 'toán', 'chữ cái', 'văn học', 'kể chuyện', 'kỹ năng']
          const matchedKw = keywords.find((kw) => cleanTitle.includes(kw))
          if (matchedKw) {
            found = actItems.find((a) => {
              const hay = `${a.name} ${a.description || ''}`.toLowerCase()
              return hay.includes(matchedKw)
            })
          }
        }

        if (found) {
          setSelectedActivityId(found.id)
          setTargetActivityTitle(rawTitle || found.name)
        } else if (rawTitle) {
          setTargetActivityTitle(rawTitle)
        }
      }

      const activeCls = focusedObj?.classId || selectedClassId || clsList[0]?.id || ''
      if (activeCls) {
        setSelectedClassId(activeCls)
        const stuRes = await getStudents({ lopId: activeCls }).catch(() => [])
        const stuList = Array.isArray(stuRes) ? stuRes : []
        setClassStudents(stuList)
        setSelectedStudentIds(new Set(stuList.map((s: any) => s.id)))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadData() }, [selectedClassId])

  const displayCriteria = useMemo(() => {
    let list = allCriteria
    if (selectedActivityId) {
      const act = activities.find((a) => a.id === selectedActivityId || a.code === selectedActivityId)
      if (act?.developmentCriteria?.length) {
        const ids = new Set(act.developmentCriteria.map((dc) => dc.developmentCriterionId))
        const matched = list.filter((c) => ids.has(c.id))
        if (matched.length > 0) return matched
      }
    }
    if (selectedDomainId !== 'ALL') list = list.filter((c) => c.developmentDomainId === selectedDomainId)
    if (searchCriterion) {
      const q = searchCriterion.toLowerCase()
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
    }
    return list.slice(0, 12)
  }, [allCriteria, selectedActivityId, selectedDomainId, searchCriterion, activities])

  // Build matrix và đồng bộ nhận xét buổi học từ dữ liệu thật khi thay đổi
  useEffect(() => {
    if (classStudents.length === 0 || allCriteria.length === 0) return
    const newMatrix: Record<string, Record<string, any>> = {}
    const newRemarks: Record<string, any> = {}
    const displayIds = new Set(displayCriteria.map((c) => c.id))

    classStudents.forEach((st) => {
      newMatrix[st.id] = {}
      let latestRemark = ''
      allCriteria.forEach((crit) => {
        const found = existingAssessments.find(
          (a) =>
            a.childId === st.id &&
            a.developmentCriterionId === crit.id &&
            (!selectedActivityId || !a.activityId || a.activityId === selectedActivityId)
        ) || existingAssessments.find((a) => a.childId === st.id && a.developmentCriterionId === crit.id)

        newMatrix[st.id][crit.id] = found
          ? {
              result: found.result,
              existingId: found.id,
              comment: found.comment || '',
              evidence: found.evidence || '',
              isDirty: false,
            }
          : { result: null, isDirty: false }

        if (found?.comment && displayIds.has(crit.id) && !latestRemark) {
          latestRemark = found.comment
        }
      })
      newRemarks[st.id] = { comment: latestRemark, isDirty: false }
    })
    setMatrix(newMatrix)
    setChildActivityRemarks(newRemarks)
  }, [classStudents.length, allCriteria.length, existingAssessments, selectedActivityId, displayCriteria])

  const dirtyCount = useMemo(() => {
    let c = 0
    Object.values(matrix).forEach((row) => Object.values(row).forEach((cell) => { if (cell.isDirty) c++ }))
    Object.values(childActivityRemarks).forEach((rem) => { if (rem?.isDirty) c++ })
    return c
  }, [matrix, childActivityRemarks])

  const handleCellClick = (sId: string, cId: string) => {
    setMatrix((prev) => {
      const row = { ...(prev[sId] || {}) }
      const cur = row[cId] || { result: null }
      const next = cur.result === null ? true : cur.result === true ? false : null
      row[cId] = { ...cur, result: next, isDirty: true }
      return { ...prev, [sId]: row }
    })
  }

  const handleSaveBatch = async () => {
    setIsSaving(true)
    try {
      const displayCritIds = new Set(displayCriteria.map((c) => c.id))

      for (const [stId, row] of Object.entries(matrix)) {
        const studentRemarkObj = childActivityRemarks[stId]
        const remarkText = studentRemarkObj?.comment?.trim() ?? ''
        const remarkChanged = Boolean(studentRemarkObj?.isDirty)
        let remarkSavedForStudent = false

        for (const [crId, cell] of Object.entries(row)) {
          const isDisplayedCrit = displayCritIds.has(crId)
          const shouldAttachRemark = isDisplayedCrit && (cell.isDirty || remarkChanged)
          const finalComment = shouldAttachRemark
            ? remarkText || cell.comment || ''
            : cell.comment || ''

          if (!cell.isDirty && !(remarkChanged && isDisplayedCrit && cell.result !== null)) {
            continue
          }

          if (cell.result === null) {
            if (cell.existingId) await deleteAssessment(cell.existingId)
          } else if (cell.existingId) {
            await updateAssessment(cell.existingId, {
              result: cell.result,
              comment: finalComment,
              evidence: cell.evidence,
              activityId: selectedActivityId || undefined,
              assessedBy: currentUser()?.id,
            })
            if (isDisplayedCrit) remarkSavedForStudent = true
          } else {
            await createAssessment({
              childId: stId,
              developmentCriterionId: crId,
              activityId: selectedActivityId || undefined,
              assessedBy: currentUser()?.id,
              assessedAt: new Date().toISOString(),
              result: cell.result,
              comment: finalComment,
              evidence: cell.evidence,
            })
            if (isDisplayedCrit) remarkSavedForStudent = true
          }
        }

        // Nếu giáo viên nhập nhận xét buổi học cho bé nhưng chưa bấm ô tiêu chí nào, tự động lưu vào tiêu chí đầu tiên của hoạt động
        if (remarkChanged && remarkText && !remarkSavedForStudent && displayCriteria.length > 0) {
          const firstCritId = displayCriteria[0].id
          const firstCell = row[firstCritId]
          if (firstCell?.existingId) {
            await updateAssessment(firstCell.existingId, {
              result: firstCell.result ?? true,
              comment: remarkText,
              evidence: firstCell.evidence,
              activityId: selectedActivityId || undefined,
              assessedBy: currentUser()?.id,
            })
          } else {
            await createAssessment({
              childId: stId,
              developmentCriterionId: firstCritId,
              activityId: selectedActivityId || undefined,
              assessedBy: currentUser()?.id,
              assessedAt: new Date().toISOString(),
              result: true,
              comment: remarkText,
            })
          }
        }
      }
      setConfirmModalOpen(false)
      setToast({ msg: 'Đã lưu kết quả đánh giá và nhận xét hoạt động thành công!', type: 'success' })
      await loadData()
    } finally {
      setIsSaving(false)
    }
  }

  const progressStats = useMemo(() => {
    const totalStudents = classStudents.length
    let completedCells = 0, passCells = 0
    classStudents.forEach((st) => {
      allCriteria.forEach((cr) => {
        const c = matrix[st.id]?.[cr.id]
        if (c?.result !== null && c?.result !== undefined) {
          completedCells++
          if (c.result) passCells++
        }
      })
    })
    return {
      totalStudents,
      completedCells,
      passCells,
      passRate: completedCells > 0 ? Math.round((passCells / completedCells) * 100) : 0,
      fullyCompletedStudentsCount: classStudents.filter((st) => allCriteria.every((cr) => matrix[st.id]?.[cr.id]?.result === true)).length,
    }
  }, [classStudents, allCriteria, matrix])

  const classBreakdown = useMemo(() => domains.map((d) => {
    const dCritIds = allCriteria.filter((c) => c.developmentDomainId === d.id).map((c) => c.id)
    let passSlots = 0, failSlots = 0, unassessedSlots = 0
    classStudents.forEach((st) => {
      dCritIds.forEach((cId) => {
        const res = matrix[st.id]?.[cId]?.result
        if (res === true) passSlots++
        else if (res === false) failSlots++
        else unassessedSlots++
      })
    })
    return { shortName: d.name, passSlots, failSlots, unassessedSlots }
  }), [domains, allCriteria, classStudents, matrix])

  const radarData = useMemo(() => {
    if (!childRadarModal.student) return []
    const stId = childRadarModal.student.id
    return domains.map((d) => {
      const dCritIds = allCriteria.filter((c) => c.developmentDomainId === d.id).map((c) => c.id)
      let pass = 0
      dCritIds.forEach((cId) => { if (matrix[stId]?.[cId]?.result === true) pass++ })
      const score = dCritIds.length > 0 ? Math.round((pass / dCritIds.length) * 100) : 0
      return { domain: d.name, score }
    })
  }, [childRadarModal.student, domains, allCriteria, matrix])

  const tabs: TabItem<TeacherViewTab>[] = [
    { id: 'dashboard', label: 'Tổng quan lớp', icon: BarChart3 },
    { id: 'matrix', label: 'Ma trận đánh giá', icon: LayoutGrid, badge: dirtyCount || undefined },
  ]

  return (
    <div className="space-y-6 min-w-0 max-w-full overflow-x-hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/teacher"
            className="p-2.5 rounded-2xl border border-orange-200 bg-white text-slate-600 hover:bg-orange-50 transition"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/60">
                Theo dõi phát triển toàn diện
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-800 mt-1">Đánh giá sự phát triển của trẻ</h1>
          </div>
        </div>
        <button
          onClick={() => void loadData()}
          className="inline-flex items-center gap-1.5 rounded-2xl border border-orange-200 bg-white px-4 py-2 text-xs font-black text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition shadow-2xs cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-orange-500' : ''} />
          <span>Đồng bộ dữ liệu</span>
        </button>
      </div>

      <TabsNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {toast && (
        <div
          className={`rounded-2xl p-4 text-xs font-bold flex justify-between items-center shadow-xs ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{toast.msg}</span>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-700 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {activeTab === 'dashboard' && (
        <TeacherAssessmentStats
          selectedClassId={selectedClassId}
          authorizedClasses={authorizedClasses}
          onClassChange={setSelectedClassId}
          activitiesCount={activities.length}
          progressStats={progressStats}
          classBreakdown={classBreakdown}
          tierPieData={[
            { name: 'Tốt', value: progressStats.passCells, color: '#10b981' },
            {
              name: 'Cần rèn luyện',
              value: progressStats.completedCells - progressStats.passCells,
              color: '#f43f5e',
            },
          ]}
          classStudents={classStudents}
          getStudentProgress={(stId) => {
            let pass = 0;
            let comp = 0;
            allCriteria.forEach((cr) => {
              const r = matrix[stId]?.[cr.id]?.result;
              if (r !== null && r !== undefined) {
                comp++;
                if (r) pass++;
              }
            });
            return {
              completed: comp,
              total: allCriteria.length,
              pass,
              rate: comp > 0 ? Math.round((pass / comp) * 100) : 0,
            };
          }}
          onOpenRadar={(st) => setChildRadarModal({ open: true, student: st })}
          onGoToMatrix={() => setActiveTab('matrix')}
        />
      )}

      {activeTab === 'matrix' && (
        <div className="space-y-4">
          {(targetActivityTitle || selectedActivityId) && (
            <div className="rounded-3xl border-2 border-rose-300 bg-linear-to-r from-rose-50 via-white to-amber-50 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-white font-black text-2xl shadow-xs">
                  🎯
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                      ĐANG ĐÁNH GIÁ CHO HOẠT ĐỘNG ĐÃ CHỌN
                    </span>
                    {focusedScheduleContext?.date && (
                      <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                        Ngày: {focusedScheduleContext.date}
                      </span>
                    )}
                    {authorizedClasses.find((c: any) => c.id === selectedClassId)?.tenLop && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Lớp: {authorizedClasses.find((c: any) => c.id === selectedClassId)?.tenLop}
                      </span>
                    )}
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1 truncate">
                    {targetActivityTitle || activities.find((a: any) => a.id === selectedActivityId)?.name || 'Hoạt động giáo dục'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hệ thống đã tự động liên kết các tiêu chuẩn rèn luyện của hoạt động này để bạn chấm điểm cho các học sinh.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    try {
                      sessionStorage.removeItem('teacher_focused_activity');
                    } catch {}
                    setFocusedScheduleContext(null);
                    setSelectedActivityId('');
                    setTargetActivityTitle('');
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
                >
                  Xem tất cả hoạt động
                </button>
              </div>
            </div>
          )}

          <TeacherAssessmentMatrix
            activities={activities}
            selectedActivityId={selectedActivityId}
            onSelectActivity={(actId) => {
              setSelectedActivityId(actId)
              if (actId) {
                const foundAct = activities.find((a) => a.id === actId)
                if (foundAct) setTargetActivityTitle(foundAct.name)
              } else {
                setTargetActivityTitle('')
              }
            }}
            domains={domains}
            selectedDomainId={selectedDomainId}
            onSelectDomain={setSelectedDomainId}
            searchCriterion={searchCriterion}
            onSearchCriterionChange={setSearchCriterion}
            auditMode={auditMode}
            onToggleAuditMode={() => setAuditMode(!auditMode)}
            dirtyCount={dirtyCount}
            isSaving={isSaving}
            onOpenConfirmSave={() => setConfirmModalOpen(true)}
            classStudents={classStudents}
            displayCriteria={displayCriteria}
            matrix={matrix}
            selectedStudentIds={selectedStudentIds}
            onToggleSelectAll={() =>
              setSelectedStudentIds(
                selectedStudentIds.size === classStudents.length
                  ? new Set()
                  : new Set(classStudents.map((s) => s.id))
              )
            }
            onToggleStudent={(id) =>
              setSelectedStudentIds((prev) => {
                const next = new Set(prev);
                next.has(id) ? next.delete(id) : next.add(id);
                return next;
              })
            }
            onCellClick={handleCellClick}
            onMarkRowPass={(stId) =>
              setMatrix((prev) => {
                const row = { ...(prev[stId] || {}) };
                displayCriteria.forEach((cr) => {
                  row[cr.id] = { ...(row[cr.id] || {}), result: true, isDirty: true };
                });
                return { ...prev, [stId]: row };
              })
            }
            onMarkColPass={(cId) =>
              setMatrix((prev) => {
                // 3-state cycling:
                // Click 1: Đạt (true)
                // Click 2: Không đạt (false)
                // Click 3: Quay về Chưa đánh giá (null)
                let allTrue = classStudents.length > 0;
                let allFalse = classStudents.length > 0;
                for (const st of classStudents) {
                  const res = prev[st.id]?.[cId]?.result;
                  if (res !== true) allTrue = false;
                  if (res !== false) allFalse = false;
                }

                let nextVal: boolean | null = true;
                if (allTrue) {
                  nextVal = false; // Lần 2: Không đạt
                } else if (allFalse) {
                  nextVal = null; // Lần 3: Reset về chưa đánh giá
                } else {
                  nextVal = true; // Lần 1: Đạt
                }

                const next = { ...prev };
                classStudents.forEach((st) => {
                  const row = { ...(next[st.id] || {}) };
                  row[cId] = { ...(row[cId] || {}), result: nextVal, isDirty: true };
                  next[st.id] = row;
                });
                return next;
              })
            }
            onOpenCellDetail={(info) => setCellDetailModal({ ...info, open: true })}
            childActivityRemarks={childActivityRemarks}
            onChangeChildRemark={(stId, val) =>
              setChildActivityRemarks((prev) => ({
                ...prev,
                [stId]: { ...prev[stId], comment: val, isDirty: true },
              }))
            }
          />
        </div>
      )}

      <TeacherAssessmentModals
        cellDetailModal={cellDetailModal}
        onCloseCellDetail={() => setCellDetailModal((prev) => ({ ...prev, open: false }))}
        onSaveCellDetail={(comment, evidence) => {
          setMatrix((prev) => {
            const row = { ...(prev[cellDetailModal.studentId] || {}) };
            row[cellDetailModal.criterionId] = {
              ...row[cellDetailModal.criterionId],
              comment,
              evidence,
              isDirty: true,
            };
            return { ...prev, [cellDetailModal.studentId]: row };
          });
        }}
        childRadarModal={childRadarModal}
        onCloseRadar={() => setChildRadarModal({ open: false, student: null })}
        radarData={radarData}
        confirmModalOpen={confirmModalOpen}
        onCloseConfirmModal={() => setConfirmModalOpen(false)}
        onConfirmSave={handleSaveBatch}
        dirtyCount={dirtyCount}
        isSaving={isSaving}
      />
    </div>
  );
}

export default function TeacherAssessmentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Đang chuẩn bị dữ liệu lớp học...</div>}>
      <TeacherAssessmentContent />
    </Suspense>
  )
}
