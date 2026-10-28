'use client'

import React, { useEffect, useMemo, useState, useCallback } from 'react'
import Modal from '@/app/components/ui/Modal'
import { ScheduleItem, SCHEDULE_TYPES } from './types'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Unlink,
  Link2,
  Save,
  X,
  Loader2,
  Layers,
} from 'lucide-react'
import {
  getActivities,
  createActivity,
  getDomains,
  getCriteria,
  createCriterion,
  updateCriterion,
  deleteCriterion,
  linkActivityCriterion,
  unlinkActivityCriterion,
  ActivityItem,
  DomainItem,
  CriterionItem,
} from '@/lib/development'

interface LichHocModalProps {
  isOpen: boolean
  onClose: () => void
  editingItem: ScheduleItem | null
  form: {
    activityId?: string
    title: string
    description: string
    type: number
    date: string
    startTime: string
    endTime: string
    location: string
    classId: string
    isSchoolWide: boolean
    teacherName: string
  }
  setForm: React.Dispatch<React.SetStateAction<any>>
  classes: any[]
  existingSchedules?: ScheduleItem[]
  onSave: () => void
  isSubmitting: boolean
}

export default function LichHocModal({
  isOpen,
  onClose,
  editingItem,
  form,
  setForm,
  classes,
  existingSchedules = [],
  onSave,
  isSubmitting,
}: LichHocModalProps) {
  const [schoolActivities, setSchoolActivities] = useState<ActivityItem[]>([])
  const [domains, setDomains] = useState<DomainItem[]>([])
  const [criteriaList, setCriteriaList] = useState<CriterionItem[]>([])
  const [loadingBank, setLoadingBank] = useState(false)

  // Quick create school activity state
  const [creatingNewActivity, setCreatingNewActivity] = useState(false)
  const [newActName, setNewActName] = useState('')
  const [newActDesc, setNewActDesc] = useState('')
  const [savingNewAct, setSavingNewAct] = useState(false)

  // Criterion CRUD state for selected activity
  const [selectedCriterionToLink, setSelectedCriterionToLink] = useState('')
  const [criterionFormOpen, setCriterionFormOpen] = useState(false)
  const [editingCriterion, setEditingCriterion] = useState<CriterionItem | null>(null)
  const [critDomainId, setCritDomainId] = useState('')
  const [critCode, setCritCode] = useState('')
  const [critName, setCritName] = useState('')
  const [critDesc, setCritDesc] = useState('')
  const [savingCriterion, setSavingCriterion] = useState(false)

  const loadActivityAndCriteriaBank = useCallback(async () => {
    setLoadingBank(true)
    try {
      const [actRes, domRes, criRes] = await Promise.all([
        getActivities({ page: 1, pageSize: 200, includeInactive: false }),
        getDomains({ page: 1, pageSize: 100 }),
        getCriteria({ page: 1, pageSize: 500 }),
      ])
      const acts = actRes.items || []
      const doms = domRes.items || []
      const crits = criRes.items || []
      setSchoolActivities(acts)
      setDomains(doms)
      setCriteriaList(crits)
      if (doms.length > 0 && !critDomainId) {
        setCritDomainId(doms[0].id)
      }

      // If form doesn't have activityId yet, try matching by title
      if (form.title && !form.activityId) {
        const matched = acts.find(
          (a) =>
            a.name.trim().toLowerCase() === form.title.trim().toLowerCase() ||
            form.title.toLowerCase().includes(a.name.trim().toLowerCase())
        )
        if (matched) {
          setForm((p: any) => ({ ...p, activityId: matched.id }))
        }
      }
    } finally {
      setLoadingBank(false)
    }
  }, [form.title, form.activityId, critDomainId, setForm])

  useEffect(() => {
    if (isOpen) {
      void loadActivityAndCriteriaBank()
    }
  }, [isOpen, loadActivityAndCriteriaBank])

  const selectedActivity = useMemo(() => {
    if (form.activityId) {
      const byId = schoolActivities.find((a) => a.id === form.activityId)
      if (byId) return byId
    }
    if (form.title) {
      const q = form.title.trim().toLowerCase()
      return (
        schoolActivities.find((a) => a.name.trim().toLowerCase() === q) || null
      )
    }
    return null
  }, [schoolActivities, form.activityId, form.title])

  const linkedCriteria = useMemo(() => {
    if (!selectedActivity?.developmentCriteria?.length) return []
    return selectedActivity.developmentCriteria
      .map((dc) => {
        const found = criteriaList.find((c) => c.id === dc.developmentCriterionId)
        return found
          ? {
              ...found,
              observationGuide: dc.observationGuide,
            }
          : null
      })
      .filter(Boolean) as Array<CriterionItem & { observationGuide?: string | null }>
  }, [selectedActivity, criteriaList])

  const unlinkedCriteria = useMemo(() => {
    const linkedIds = new Set(
      (selectedActivity?.developmentCriteria || []).map((dc) => dc.developmentCriterionId)
    )
    return criteriaList.filter((c) => !linkedIds.has(c.id))
  }, [selectedActivity, criteriaList])

  const handleSelectSchoolActivity = (act: ActivityItem) => {
    setForm((p: any) => ({
      ...p,
      activityId: act.id,
      title: act.name,
      description: act.description || p.description || '',
      type: 2,
    }))
  }

  const handleCreateNewSchoolActivity = async () => {
    if (!newActName.trim()) return
    setSavingNewAct(true)
    try {
      const autoCode = `HD-${Date.now().toString().slice(-5)}`
      const created = await createActivity({
        code: autoCode,
        name: newActName.trim(),
        description: newActDesc.trim() || 'Hoạt động giáo dục mầm non',
        minAgeMonths: 18,
        maxAgeMonths: 72,
      })
      await loadActivityAndCriteriaBank()
      setForm((p: any) => ({
        ...p,
        activityId: created.id,
        title: created.name,
        description: created.description || '',
        type: 2,
      }))
      setCreatingNewActivity(false)
      setNewActName('')
      setNewActDesc('')
    } catch (err: any) {
      alert('Không thể tạo hoạt động mới: ' + (err?.message || err))
    } finally {
      setSavingNewAct(false)
    }
  }

  const handleLinkExistingCriterion = async () => {
    if (!selectedActivity?.id || !selectedCriterionToLink) return
    setSavingCriterion(true)
    try {
      await linkActivityCriterion(selectedActivity.id, selectedCriterionToLink)
      setSelectedCriterionToLink('')
      await loadActivityAndCriteriaBank()
    } catch (err: any) {
      alert('Không thể gắn tiêu chí: ' + (err?.message || err))
    } finally {
      setSavingCriterion(false)
    }
  }

  const handleUnlinkCriterion = async (criterionId: string) => {
    if (!selectedActivity?.id) return
    setSavingCriterion(true)
    try {
      await unlinkActivityCriterion(selectedActivity.id, criterionId)
      await loadActivityAndCriteriaBank()
    } catch (err: any) {
      alert('Không thể gỡ tiêu chí: ' + (err?.message || err))
    } finally {
      setSavingCriterion(false)
    }
  }

  const handleOpenCreateCriterion = () => {
    setEditingCriterion(null)
    setCritDomainId(domains[0]?.id || '')
    setCritCode(`TC-${Date.now().toString().slice(-4)}`)
    setCritName('')
    setCritDesc('')
    setCriterionFormOpen(true)
  }

  const handleOpenEditCriterion = (crit: CriterionItem) => {
    setEditingCriterion(crit)
    setCritDomainId(crit.developmentDomainId || domains[0]?.id || '')
    setCritCode(crit.code)
    setCritName(crit.name)
    setCritDesc(crit.description || '')
    setCriterionFormOpen(true)
  }

  const handleSaveCriterion = async () => {
    if (!critName.trim() || !critDomainId) return
    setSavingCriterion(true)
    try {
      if (editingCriterion) {
        await updateCriterion(editingCriterion.id, {
          developmentDomainId: critDomainId,
          code: critCode.trim() || editingCriterion.code,
          name: critName.trim(),
          description: critDesc.trim(),
          isActive: true,
        })
      } else {
        const created = await createCriterion({
          developmentDomainId: critDomainId,
          code: critCode.trim() || `TC-${Date.now().toString().slice(-4)}`,
          name: critName.trim(),
          description: critDesc.trim(),
        })
        if (selectedActivity?.id && created?.id) {
          await linkActivityCriterion(selectedActivity.id, created.id)
        }
      }
      setCriterionFormOpen(false)
      setEditingCriterion(null)
      await loadActivityAndCriteriaBank()
    } catch (err: any) {
      alert('Không thể lưu tiêu chí: ' + (err?.message || err))
    } finally {
      setSavingCriterion(false)
    }
  }

  const handleDeleteCriterionPermanently = async (crit: CriterionItem) => {
    if (!confirm(`Xóa vĩnh viễn tiêu chí "${crit.name}" khỏi hệ thống?`)) return
    setSavingCriterion(true)
    try {
      if (selectedActivity?.id) {
        await unlinkActivityCriterion(selectedActivity.id, crit.id).catch(() => {})
      }
      await deleteCriterion(crit.id)
      await loadActivityAndCriteriaBank()
    } catch (err: any) {
      alert('Không thể xóa tiêu chí: ' + (err?.message || err))
    } finally {
      setSavingCriterion(false)
    }
  }

  // 1. Filter existing items on this selected date and class
  const daySchedules = useMemo(() => {
    if (!form.date) return []
    return existingSchedules
      .filter((s) => {
        if (editingItem && s.id === editingItem.id) return false
        if (s.date !== form.date) return false
        if (form.isSchoolWide) return true
        if (s.isSchoolWide) return true
        if (form.classId && s.classId) {
          return String(s.classId).toLowerCase() === String(form.classId).toLowerCase()
        }
        return false
      })
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
  }, [existingSchedules, form.date, form.classId, form.isSchoolWide, editingItem])

  // 2. Real-time Conflict Detection
  const conflicts = useMemo(() => {
    if (!form.startTime || !form.endTime || !form.date) return []

    return daySchedules.filter((s) => {
      const sStart = (s.startTime || '').slice(0, 5)
      const sEnd = (s.endTime || '').slice(0, 5)
      const formStart = form.startTime.slice(0, 5)
      const formEnd = form.endTime.slice(0, 5)

      return formStart < sEnd && formEnd > sStart
    })
  }, [daySchedules, form.startTime, form.endTime, form.date])

  // 3. Calculate Available / Free Time Gaps during Preschool Day (07:00 to 17:00)
  const availableSlots = useMemo(() => {
    if (daySchedules.length === 0) {
      return [{ start: '07:30', end: '09:00', duration: 90 }]
    }

    const freeSlots: Array<{ start: string; end: string; duration: number }> = []
    const dayStart = '07:00'
    const dayEnd = '17:00'

    let cursor = dayStart
    for (const item of daySchedules) {
      const iStart = (item.startTime || '').slice(0, 5)
      const iEnd = (item.endTime || '').slice(0, 5)

      if (cursor < iStart) {
        const [cH, cM] = cursor.split(':').map(Number)
        const [sH, sM] = iStart.split(':').map(Number)
        const dur = sH * 60 + sM - (cH * 60 + cM)
        if (dur >= 20) {
          freeSlots.push({ start: cursor, end: iStart, duration: dur })
        }
      }
      if (iEnd > cursor) {
        cursor = iEnd
      }
    }

    if (cursor < dayEnd) {
      const [cH, cM] = cursor.split(':').map(Number)
      const [eH, eM] = dayEnd.split(':').map(Number)
      const dur = eH * 60 + eM - (cH * 60 + cM)
      if (dur >= 20) {
        freeSlots.push({ start: cursor, end: dayEnd, duration: dur })
      }
    }

    return freeSlots
  }, [daySchedules])

  const applyFreeSlot = (start: string, end: string) => {
    setForm((p: any) => ({
      ...p,
      startTime: start,
      endTime: end,
    }))
  }

  const selectedClassName = form.isSchoolWide
    ? 'Toàn trường'
    : classes.find((c) => c.id === form.classId)?.tenLop || 'Lớp đã chọn'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingItem ? 'Chỉnh sửa hoạt động lịch học' : 'Thêm hoạt động từ Ngân hàng Hoạt động trường vào lịch'}
      maxWidth="2xl"
    >
      <div className="space-y-4 max-h-[82vh] overflow-y-auto px-1 pr-2">
        {/* ============================================================== */}
        {/* 1. CHỌN HOẠT ĐỘNG TỪ NGÂN HÀNG HOẠT ĐỘNG CỦA TRƯỜNG (API)      */}
        {/* ============================================================== */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-3.5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
              <Sparkles size={14} className="text-rose-600" />
              <span>1. Chọn hoạt động từ Ngân hàng Hoạt động của trường ({schoolActivities.length} hoạt động) *</span>
            </label>
            <button
              type="button"
              onClick={() => setCreatingNewActivity((v) => !v)}
              className="inline-flex items-center gap-1 rounded-xl bg-white border border-rose-200 px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            >
              <Plus size={12} />
              <span>{creatingNewActivity ? 'Đóng tạo mới' : 'Tạo hoạt động trường mới'}</span>
            </button>
          </div>

          {creatingNewActivity && (
            <div className="rounded-xl border border-rose-200 bg-white p-3 space-y-2.5 shadow-2xs">
              <p className="text-[11px] font-bold text-rose-700">
                Thêm hoạt động mới trực tiếp vào Ngân hàng Hoạt động của trường:
              </p>
              <input
                type="text"
                value={newActName}
                onChange={(e) => setNewActName(e.target.value)}
                placeholder="Tên hoạt động mới (VD: Khám phá khoa học: Sự kỳ diệu của nước)..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold outline-none focus:border-rose-400"
              />
              <input
                type="text"
                value={newActDesc}
                onChange={(e) => setNewActDesc(e.target.value)}
                placeholder="Mô tả mục tiêu rèn luyện của hoạt động..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-rose-400"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreatingNewActivity(false)}
                  className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={savingNewAct || !newActName.trim()}
                  onClick={handleCreateNewSchoolActivity}
                  className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
                >
                  {savingNewAct ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  <span>Lưu & Chọn hoạt động này</span>
                </button>
              </div>
            </div>
          )}

          {/* Dropdown chọn hoạt động của trường */}
          <select
            value={selectedActivity?.id || ''}
            onChange={(e) => {
              const act = schoolActivities.find((a) => a.id === e.target.value)
              if (act) handleSelectSchoolActivity(act)
            }}
            className="w-full rounded-xl border border-rose-200 bg-white p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-rose-400"
          >
            <option value="">
              {loadingBank
                ? 'Đang tải danh sách hoạt động từ trường...'
                : '-- Chọn hoạt động từ danh mục Hoạt động của trường --'}
            </option>
            {schoolActivities.map((act) => (
              <option key={act.id} value={act.id}>
                [{act.code}] {act.name} ({act.developmentCriteria?.length || 0} tiêu chí đánh giá)
              </option>
            ))}
          </select>

          {/* Các nút chọn nhanh từ hoạt động thật của trường */}
          {schoolActivities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {schoolActivities.map((act) => {
                const isSelected = selectedActivity?.id === act.id
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => handleSelectSchoolActivity(act)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'border-rose-600 bg-rose-600 text-white shadow-2xs'
                        : 'border-rose-200 bg-white hover:bg-rose-100/70 text-slate-700'
                    }`}
                  >
                    {act.name} ({act.developmentCriteria?.length || 0} TC)
                  </button>
                )
              })}
            </div>
          )}

          {/* Tên hoạt động hiển thị trên lịch */}
          <div>
            <label className="text-[11px] font-bold text-slate-600">
              Tên hiển thị trên lịch học *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p: any) => ({ ...p, title: e.target.value }))}
              placeholder="Chọn hoạt động ở trên hoặc nhập tiêu đề lịch..."
              className="mt-1 w-full rounded-xl border border-rose-200 bg-white p-2.5 text-xs font-bold text-slate-800 outline-none focus:border-rose-400"
            />
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. QUẢN LÝ TIÊU CHÍ ĐÁNH GIÁ CỦA HOẠT ĐỘNG (CRUD TRỰC TIẾP)    */}
        {/* ============================================================== */}
        {selectedActivity ? (
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-3.5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Layers size={15} className="text-indigo-600" />
                <span className="text-xs font-extrabold text-indigo-950">
                  Tiêu chí đánh giá của hoạt động &ldquo;{selectedActivity.name}&rdquo; ({linkedCriteria.length} tiêu chí)
                </span>
              </div>
              <button
                type="button"
                onClick={handleOpenCreateCriterion}
                className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-indigo-700 transition cursor-pointer"
              >
                <Plus size={12} />
                <span>Thêm tiêu chí mới</span>
              </button>
            </div>

            {/* Gán tiêu chí có sẵn vào hoạt động */}
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedCriterionToLink}
                onChange={(e) => setSelectedCriterionToLink(e.target.value)}
                className="flex-1 rounded-xl border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-400"
              >
                <option value="">-- Chọn tiêu chí có sẵn để gắn thêm vào hoạt động này --</option>
                {unlinkedCriteria.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.code}] {c.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={!selectedCriterionToLink || savingCriterion}
                onClick={handleLinkExistingCriterion}
                className="inline-flex items-center justify-center gap-1 rounded-xl border border-indigo-300 bg-white px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 cursor-pointer shrink-0"
              >
                <Link2 size={13} />
                <span>Gắn vào hoạt động</span>
              </button>
            </div>

            {/* Form Tạo mới / Sửa Tiêu chí đánh giá ngay tại chỗ */}
            {criterionFormOpen && (
              <div className="rounded-xl border border-indigo-200 bg-white p-3 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-800">
                    {editingCriterion
                      ? `Chỉnh sửa tiêu chí: ${editingCriterion.code}`
                      : 'Tạo tiêu chí đánh giá mới & gắn vào hoạt động này'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCriterionFormOpen(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <select
                    value={critDomainId}
                    onChange={(e) => setCritDomainId(e.target.value)}
                    className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none"
                  >
                    {domains.map((d) => (
                      <option key={d.id} value={d.id}>
                        Lĩnh vực: {d.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={critCode}
                    onChange={(e) => setCritCode(e.target.value)}
                    placeholder="Mã TC (VD: TC-01)"
                    className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-mono outline-none"
                  />
                  <input
                    type="text"
                    value={critName}
                    onChange={(e) => setCritName(e.target.value)}
                    placeholder="Tên tiêu chí đánh giá *"
                    className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold outline-none"
                  />
                </div>

                <input
                  type="text"
                  value={critDesc}
                  onChange={(e) => setCritDesc(e.target.value)}
                  placeholder="Mô tả chi tiết yêu cầu cần đạt của trẻ ở hoạt động này..."
                  className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs outline-none"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCriterionFormOpen(false)}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    disabled={savingCriterion || !critName.trim()}
                    onClick={handleSaveCriterion}
                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
                  >
                    {savingCriterion ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                    <span>{editingCriterion ? 'Cập nhật tiêu chí' : 'Tạo & Gắn tiêu chí'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Danh sách tiêu chí đang gắn với hoạt động */}
            {linkedCriteria.length === 0 ? (
              <p className="rounded-xl border border-dashed border-indigo-200 bg-white/80 p-3 text-center text-[11px] text-slate-500">
                Hoạt động này chưa có tiêu chí đánh giá nào. Hãy chọn tiêu chí ở trên hoặc bấm <b>&ldquo;Thêm tiêu chí mới&rdquo;</b> để giáo viên chấm điểm khi dạy hoạt động này.
              </p>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {linkedCriteria.map((crit) => (
                  <div
                    key={crit.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-indigo-100 bg-white px-3 py-2 text-xs shadow-2xs"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="mr-1.5 rounded bg-indigo-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-indigo-700">
                        {crit.code}
                      </span>
                      <span className="font-bold text-slate-800">{crit.name}</span>
                      {crit.description && (
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {crit.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEditCriterion(crit)}
                        className="rounded-lg p-1 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
                        title="Sửa nội dung tiêu chí"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUnlinkCriterion(crit.id)}
                        className="rounded-lg p-1 text-slate-500 hover:bg-amber-50 hover:text-amber-700 cursor-pointer"
                        title="Gỡ tiêu chí khỏi hoạt động này"
                      >
                        <Unlink size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCriterionPermanently(crit)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                        title="Xóa vĩnh viễn tiêu chí"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* Đối tượng áp dụng (Toàn trường vs Từng lớp) */}
        <div>
          <label className="text-xs font-bold text-slate-700">Áp dụng cho đối tượng *</label>
          <div className="mt-1.5 flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="radio"
                checked={form.isSchoolWide}
                onChange={() => setForm((p: any) => ({ ...p, isSchoolWide: true, classId: '' }))}
                className="text-rose-600 focus:ring-rose-500"
              />
              <span>Toàn trường</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="radio"
                checked={!form.isSchoolWide}
                onChange={() =>
                  setForm((p: any) => ({
                    ...p,
                    isSchoolWide: false,
                    classId: classes[0]?.id || '',
                  }))
                }
                className="text-rose-600 focus:ring-rose-500"
              />
              <span>Theo từng lớp</span>
            </label>
          </div>
          {!form.isSchoolWide && (
            <select
              value={form.classId}
              onChange={(e) => setForm((p: any) => ({ ...p, classId: e.target.value }))}
              className="mt-2 w-full rounded-xl border border-rose-200 p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-rose-400"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.tenLop} {c.phongHoc ? `(${c.phongHoc})` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Ngày & Khung Giờ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700">Ngày diễn ra *</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((p: any) => ({ ...p, date: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-rose-200 p-2 text-xs font-bold text-slate-800 outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Giờ bắt đầu *</label>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm((p: any) => ({ ...p, startTime: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-rose-200 p-2 text-xs font-bold text-slate-800 outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Giờ kết thúc *</label>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm((p: any) => ({ ...p, endTime: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-rose-200 p-2 text-xs font-bold text-slate-800 outline-none focus:border-rose-400"
            />
          </div>
        </div>

        {/* ============================================================== */}
        {/* REAL-TIME CONFLICT STATUS / AVAILABLE SLOTS PREVIEW            */}
        {/* ============================================================== */}
        <div className="space-y-2">
          {conflicts.length > 0 ? (
            <div className="rounded-2xl border-2 border-rose-400 bg-rose-50 p-3.5 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-rose-800 font-black text-xs">
                <AlertTriangle size={17} className="text-rose-600 shrink-0" />
                <span>CẢNH BÁO: TRÙNG LỊCH ({conflicts.length} hoạt động bị chồng chéo):</span>
              </div>
              <div className="space-y-1.5 text-xs text-rose-950">
                {conflicts.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white p-2.5 rounded-xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 shadow-2xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800">{c.title}</span>
                      <span className="text-rose-700 font-black ml-2">
                        ({c.startTime} - {c.endTime})
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {c.className || (c.isSchoolWide ? 'Toàn trường' : 'Lớp học')}{' '}
                        {c.location ? `• Địa điểm: ${c.location}` : ''}
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] font-black text-rose-700 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full">
                      Bị trùng khung giờ
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-rose-700 font-medium italic">
                💡 Khuyên dùng: Hãy chọn một trong các khung giờ còn trống bên dưới để xếp lịch an toàn.
              </p>
            </div>
          ) : form.startTime && form.endTime ? (
            <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2.5 flex items-center justify-between text-emerald-800 text-xs font-bold shadow-2xs">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                Khung giờ hợp lệ: Chưa có hoạt động nào bị trùng ({form.startTime} - {form.endTime}) cho {selectedClassName}.
              </span>
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Sẵn sàng thêm
              </span>
            </div>
          ) : null}

          {/* Quick Available Slots Selection */}
          {availableSlots.length > 0 && (
            <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-sky-900">
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-sky-600" />
                  Các khung giờ còn trống trong ngày của {selectedClassName}:
                </span>
                <span className="text-[10px] text-sky-600 font-semibold">Bấm để tự động điền</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {availableSlots.map((slot, sIdx) => (
                  <button
                    key={sIdx}
                    type="button"
                    onClick={() => applyFreeSlot(slot.start, slot.end)}
                    className="text-xs font-bold px-2.5 py-1 rounded-xl bg-white border border-sky-200 text-sky-700 hover:bg-sky-500 hover:text-white transition shadow-2xs cursor-pointer flex items-center gap-1"
                  >
                    <span>
                      {slot.start} - {slot.end}
                    </span>
                    {'duration' in slot && slot.duration ? (
                      <span className="text-[9px] font-black opacity-75">
                        ({slot.duration} phút)
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phân loại & Địa điểm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700">Phân loại hoạt động</label>
            <select
              value={form.type}
              onChange={(e) => setForm((p: any) => ({ ...p, type: Number(e.target.value) }))}
              className="mt-1 w-full rounded-xl border border-rose-200 p-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-rose-400"
            >
              {SCHEDULE_TYPES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">Địa điểm tổ chức</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm((p: any) => ({ ...p, location: e.target.value }))}
              placeholder="VD: Phòng Nghệ thuật A201, Sân cỏ..."
              className="mt-1 w-full rounded-xl border border-rose-200 p-2.5 text-xs outline-none focus:border-rose-400"
            />
          </div>
        </div>

        {/* Giáo viên phụ trách */}
        <div>
          <label className="text-xs font-bold text-slate-700">Giáo viên phụ trách</label>
          <input
            type="text"
            value={form.teacherName}
            onChange={(e) => setForm((p: any) => ({ ...p, teacherName: e.target.value }))}
            placeholder="VD: Cô Nguyễn Thị Hoa..."
            className="mt-1 w-full rounded-xl border border-rose-200 p-2.5 text-xs outline-none focus:border-rose-400"
          />
        </div>

        {/* Mô tả nội dung */}
        <div>
          <label className="text-xs font-bold text-slate-700">Mô tả nội dung</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm((p: any) => ({ ...p, description: e.target.value }))}
            placeholder="Ghi chú chi tiết về bài học, mục tiêu hoặc chuẩn bị đạo cụ..."
            className="mt-1 w-full rounded-xl border border-rose-200 p-2.5 text-xs outline-none focus:border-rose-400"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Hủy
          </button>
          <div className="flex items-center gap-2">
            {conflicts.length > 0 && (
              <span className="text-[11px] font-bold text-rose-600 hidden sm:inline">
                Đang bị trùng lịch!
              </span>
            )}
            <button
              type="button"
              onClick={onSave}
              disabled={isSubmitting || !form.title.trim()}
              className={`rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-sm transition disabled:opacity-50 cursor-pointer ${
                conflicts.length > 0
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {isSubmitting
                ? 'Đang lưu...'
                : conflicts.length > 0
                ? 'Vẫn lưu (Chấp nhận trùng)'
                : 'Lưu hoạt động vào lịch'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
