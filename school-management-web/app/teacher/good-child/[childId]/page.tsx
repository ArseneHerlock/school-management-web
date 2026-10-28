'use client'

import { useEffect, useState, useMemo, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  BookmarkCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardList,
  FileText,
  Loader2,
  PlusCircle,
  RefreshCw,
  RotateCcw,
  Share2,
  Sparkles,
  Users,
  X,
  AlertCircle,
} from 'lucide-react'
import {
  getGoodChildRecords,
  createGoodChildRecord,
  updateGoodChildTeacherComment,
} from '@/services/learning'
import { CHILDREN, loadLiveTeacherChildren, type Child } from '../../data'
import {
  getEvaluationsForChild,
  synthesizeGoodChildComment,
  isGoodChildDelivered,
  setGoodChildDelivered,
  ActivityChildEvaluation,
} from '@/lib/activitySchedule'

const normalizeRecordList = (x: any) =>
  Array.isArray(x) ? x : Array.isArray(x?.items) ? x.items : []

function GoodChildDetailWorkspace() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()

  const rawChildId = String(params?.childId || '')
  const initialMonth = Number(searchParams.get('month')) || new Date().getMonth() + 1
  const initialYear = Number(searchParams.get('year')) || new Date().getFullYear()

  const [month, setMonth] = useState<number>(initialMonth)
  const [year, setYear] = useState<number>(initialYear)
  const [childrenList, setChildrenList] = useState<Child[]>([])
  const [currentChild, setCurrentChild] = useState<Child | null>(null)

  const [recordId, setRecordId] = useState<string>('')
  const [comment, setComment] = useState<string>('')
  const [parentFeedback, setParentFeedback] = useState<string>('')
  const [activityEvals, setActivityEvals] = useState<ActivityChildEvaluation[]>([])

  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [successToast, setSuccessToast] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [isDelivered, setIsDelivered] = useState<boolean>(false)

  const loadWorkspaceData = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      await loadLiveTeacherChildren()
      const allChildren = [...CHILDREN]
      setChildrenList(allChildren)

      const foundChild =
        allChildren.find(
          (c) =>
            String(c.apiId).toLowerCase() === rawChildId.toLowerCase() ||
            String(c.id) === rawChildId
        ) || null
      setCurrentChild(foundChild)

      const targetChildApiId = foundChild?.apiId || rawChildId

      const [recordsRes, evalsRes] = await Promise.all([
        getGoodChildRecords({
          month,
          year,
          pageSize: 100,
        }).catch(() => []),
        getEvaluationsForChild(targetChildApiId, month, year).catch(() => []),
      ])

      const allRecords = normalizeRecordList(recordsRes)
      const matchedRecord = allRecords.find(
        (r: any) => String(r.childId).toLowerCase() === String(targetChildApiId).toLowerCase()
      )

      setRecordId(matchedRecord?.id || '')
      setComment(matchedRecord?.teacherComment || '')
      setParentFeedback(matchedRecord?.parentFeedback || '')
      setActivityEvals(evalsRes || [])
      setIsDelivered(isGoodChildDelivered(targetChildApiId, month, year))
    } catch (err: any) {
      setErrorMsg(err instanceof Error ? err.message : 'Không tải được dữ liệu sổ bé ngoan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (rawChildId) {
      void loadWorkspaceData()
    }
  }, [rawChildId, month, year])

  const targetChildApiId = currentChild?.apiId || rawChildId
  const childDisplayName = currentChild?.name || 'Học sinh'

  // Thống kê kết quả đánh giá hoạt động thực tế của bé
  const evalStats = useMemo(() => {
    const total = activityEvals.length
    const passed = activityEvals.filter(
      (e) => e.completed || e.result === true || e.result === 'Đạt'
    ).length
    const failed = total - passed
    const withCommentCount = activityEvals.filter((e) => Boolean(e.comment?.trim())).length
    return { total, passed, failed, withCommentCount }
  }, [activityEvals])

  // Chèn 1 nhận xét hoạt động thực tế của giáo viên vào khung soạn thảo
  const handleInsertActivityEvaluation = (ev: ActivityChildEvaluation) => {
    const dateStr = ev.date
      ? new Date(ev.date).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
        })
      : ''
    const statusText = ev.result ? 'Đạt' : 'Cần rèn luyện thêm'
    const remarkPart = ev.comment?.trim()
      ? ev.comment.trim()
      : `${ev.criterionName || ev.activityTitle}: ${statusText}`

    const line = `• [${ev.activityTitle}${
      ev.criterionName && ev.criterionName !== ev.activityTitle ? ` - ${ev.criterionName}` : ''
    }${dateStr ? ` (${dateStr})` : ''}]: ${remarkPart}`

    setComment((prev) => {
      const trimmed = prev.trim()
      if (!trimmed) return line
      if (trimmed.includes(line)) return trimmed
      return `${trimmed}\n${line}`
    })

    setCopiedId(ev.id || `${ev.activityTitle}-${ev.criterionId}`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Tổng hợp toàn bộ các nhận xét & kết quả đánh giá hoạt động của bé thành nhận xét Sổ Bé Ngoan
  const handleSynthesizeFromActivities = () => {
    if (activityEvals.length === 0) return
    const synthesized = synthesizeGoodChildComment(activityEvals, childDisplayName, month)
    if (synthesized) {
      setComment(synthesized)
      setSuccessToast(
        `Đã tổng hợp nhận xét từ ${activityEvals.length} lượt đánh giá hoạt động của bé ${childDisplayName}!`
      )
      setTimeout(() => setSuccessToast(''), 3000)
    }
  }

  const handleSaveComment = async () => {
    setSaving(true)
    setErrorMsg('')
    try {
      let currentRecId = recordId
      if (!currentRecId) {
        const created = await createGoodChildRecord({
          childId: targetChildApiId,
          month,
          year,
        })
        if (created?.id) {
          currentRecId = created.id
          setRecordId(created.id)
        }
      }

      if (currentRecId) {
        await updateGoodChildTeacherComment(currentRecId, comment)
      }

      if (comment.trim()) {
        setGoodChildDelivered(targetChildApiId, month, year, true)
        setIsDelivered(true)
      }

      setSuccessToast(`Đã lưu Sổ Bé Ngoan tháng ${month}/${year} cho bé ${childDisplayName}!`)
      setTimeout(() => setSuccessToast(''), 3500)
    } catch (err: any) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể lưu nhận xét Sổ Bé Ngoan')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleDeliver = () => {
    const nextState = !isDelivered
    setGoodChildDelivered(targetChildApiId, month, year, nextState)
    setIsDelivered(nextState)
    setSuccessToast(
      nextState
        ? `Đã bàn giao Sổ Bé Ngoan tháng ${month}/${year} cho phụ huynh bé ${childDisplayName}!`
        : `Đã thu hồi Sổ Bé Ngoan tháng ${month}/${year} để tiếp tục chỉnh sửa!`
    )
    setTimeout(() => setSuccessToast(''), 3500)
  }

  return (
    <section className="mx-auto max-w-7xl space-y-5 pb-10">
      {/* Toast thông báo */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 text-xs font-bold text-white shadow-xl shadow-emerald-600/30 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Thanh điều hướng & Thông tin học sinh */}
      <div className="flex flex-col gap-4 rounded-3xl border border-amber-200/80 bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-white p-4 sm:p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/teacher/good-child?month=${month}&year=${year}`}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-3.5 py-2 text-xs font-extrabold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition shadow-2xs"
          >
            <ArrowLeft size={15} />
            <span>Quay lại danh sách Sổ Bé Ngoan</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            {/* Chuyển nhanh học sinh trong lớp */}
            {childrenList.length > 1 && (
              <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5">
                <Users size={14} className="text-amber-600 shrink-0" />
                <select
                  value={targetChildApiId}
                  onChange={(e) => {
                    const nextId = e.target.value
                    router.push(
                      `/teacher/good-child/${encodeURIComponent(nextId)}?month=${month}&year=${year}`
                    )
                  }}
                  className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
                >
                  {childrenList.map((c) => {
                    const cid = c.apiId || String(c.id)
                    return (
                      <option key={cid} value={cid}>
                        {c.name}
                      </option>
                    )
                  })}
                </select>
              </div>
            )}

            {/* Chọn kỳ đánh giá Tháng / Năm */}
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5">
              <CalendarDays size={14} className="text-amber-500 shrink-0" />
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Tháng {i + 1}
                  </option>
                ))}
              </select>
              <span className="text-slate-300">/</span>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-16 bg-transparent text-xs font-bold text-slate-700 outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => void loadWorkspaceData()}
              className="rounded-xl border border-amber-200 bg-white p-2 text-amber-600 hover:bg-amber-50 transition cursor-pointer"
              title="Làm mới dữ liệu"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Thông tin chính của bé */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-3.5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-lg font-black text-white shadow-sm">
              {currentChild?.avatar || childDisplayName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded-md bg-amber-100 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-amber-800">
                  Sổ Bé Ngoan Tháng {month}/{year}
                </span>
                <span
                  className={`rounded-md px-2.5 py-0.5 text-[11px] font-bold ${
                    isDelivered
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {isDelivered ? '✓ Đã bàn giao cho Phụ huynh' : 'Chưa bàn giao cho Phụ huynh'}
                </span>
              </div>
              <h1 className="mt-1 text-xl sm:text-2xl font-black text-slate-900">
                {childDisplayName}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Tổng hợp nhận xét từ các hoạt động giáo dục của bé trong tháng để ghi Sổ Bé Ngoan.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleToggleDeliver}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-extrabold transition cursor-pointer ${
                isDelivered
                  ? 'border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  : 'border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              {isDelivered ? (
                <>
                  <Check size={14} />
                  <span>Đã giao Sổ cho PH (Nhấn để thu hồi)</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  <span>Bàn giao Sổ cho Phụ huynh</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => void handleSaveComment()}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-amber-500/20 hover:bg-amber-600 disabled:opacity-50 transition cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <BookmarkCheck size={16} />
                  <span>Lưu nhận xét Sổ Bé Ngoan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-rose-600 hover:text-rose-900">
            <X size={16} />
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white py-24">
          <Loader2 size={32} className="animate-spin text-amber-500 mb-3" />
          <p className="text-xs font-bold text-slate-500">
            Đang tải lịch sử nhận xét hoạt động và Sổ Bé Ngoan của bé...
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* CỘT TRÁI (5/12): Gợi ý & Tổng hợp từ các nhận xét của giáo viên tại mỗi hoạt động */}
          <div className="lg:col-span-5 space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3.5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  DỮ LIỆU ĐÁNH GIÁ HOẠT ĐỘNG THỰC TẾ
                </span>
                <h2 className="mt-1.5 text-base font-black text-slate-800 flex items-center gap-2">
                  <ClipboardList size={18} className="text-indigo-600 shrink-0" />
                  <span>Nhận xét của GV tại từng hoạt động ({activityEvals.length})</span>
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Được tổng hợp trực tiếp từ các nhận xét và kết quả chấm của giáo viên cho bé ở mỗi hoạt động học tập.
                </p>
              </div>
            </div>

            {/* Thống kê nhanh kết quả hoạt động của bé */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-3 text-center">
                <p className="text-[11px] font-bold text-slate-500">Tổng lượt chấm</p>
                <p className="mt-0.5 text-xl font-black text-slate-800">{evalStats.total}</p>
              </div>
              <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-3 text-center">
                <p className="text-[11px] font-bold text-emerald-700">Nội dung Đạt</p>
                <p className="mt-0.5 text-xl font-black text-emerald-700">{evalStats.passed}</p>
              </div>
              <div className="rounded-2xl border border-rose-200/80 bg-rose-50/60 p-3 text-center">
                <p className="text-[11px] font-bold text-rose-700">Cần rèn luyện</p>
                <p className="mt-0.5 text-xl font-black text-rose-700">{evalStats.failed}</p>
              </div>
            </div>

            {/* Nút tổng hợp toàn bộ nhận xét hoạt động sang khung Sổ Bé Ngoan */}
            {activityEvals.length > 0 && (
              <button
                type="button"
                onClick={handleSynthesizeFromActivities}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 px-4 py-3 text-xs font-black text-indigo-700 transition active:scale-[0.99] cursor-pointer"
              >
                <Sparkles size={16} className="text-indigo-600 shrink-0" />
                <span>
                  Tổng hợp tất cả {activityEvals.length} đánh giá & nhận xét hoạt động vào Sổ Bé Ngoan
                </span>
              </button>
            )}

            {/* Danh sách chi tiết từng nhận xét hoạt động */}
            <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
              {activityEvals.length > 0 ? (
                activityEvals.map((ev, index) => {
                  const itemKey = ev.id || `${ev.activityTitle}-${ev.criterionId}-${index}`
                  const isCopied = copiedId === itemKey
                  const hasTeacherRemark = Boolean(ev.comment && ev.comment.trim())

                  return (
                    <div
                      key={itemKey}
                      className="rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-amber-300 p-3.5 transition flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-extrabold ${
                                ev.result
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {ev.result ? '✓ Đạt' : '✕ Cần rèn luyện'}
                            </span>
                            {ev.date && (
                              <span className="text-[11px] font-semibold text-slate-400">
                                Ngày {ev.date}
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-xs font-black text-slate-800">
                            {ev.activityTitle}
                          </p>
                          {ev.criterionName && ev.criterionName !== ev.activityTitle && (
                            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                              Tiêu chí: {ev.criterionName}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleInsertActivityEvaluation(ev)}
                          className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-extrabold transition shrink-0 cursor-pointer ${
                            isCopied
                              ? 'bg-emerald-600 text-white'
                              : 'border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check size={12} />
                              <span>Đã đưa vào sổ</span>
                            </>
                          ) : (
                            <>
                              <PlusCircle size={12} />
                              <span>Đưa vào sổ</span>
                            </>
                          )}
                        </button>
                      </div>

                      {hasTeacherRemark ? (
                        <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 px-3 py-2 text-xs text-slate-700">
                          <span className="font-bold text-amber-900">Nhận xét của GV: </span>
                          <span className="italic">“{ev.comment}”</span>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">
                          (Giáo viên chấm {ev.result ? 'Đạt' : 'Cần rèn luyện'} tiêu chí này, chưa ghi chú thêm)
                        </p>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center space-y-3">
                  <p className="text-xs font-bold text-slate-600">
                    Chưa có nhận xét hoạt động nào của bé {childDisplayName} trong tháng {month}/{year}.
                  </p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Hãy chấm điểm và ghi nhận xét cho bé tại trang Đánh giá hoạt động, hệ thống sẽ tự động tổng hợp các nhận xét đó về đây để làm gợi ý ghi Sổ Bé Ngoan.
                  </p>
                  <Link
                    href="/teacher/assessment?tab=matrix"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition"
                  >
                    <span>Đi tới trang Đánh giá hoạt động</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* CỘT PHẢI (7/12): Không gian viết Nhận xét Sổ Bé Ngoan rộng rãi */}
          <div className="lg:col-span-7 space-y-4 rounded-3xl border border-amber-200/80 bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3.5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  SOẠN THẢO SỔ BÉ NGOAN THÁNG {month}/{year}
                </span>
                <h2 className="mt-1.5 text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
                  <FileText size={18} className="text-amber-500 shrink-0" />
                  <span>Nội dung nhận xét Sổ Bé Ngoan của {childDisplayName}</span>
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400">
                  {comment.length} ký tự
                </span>
                {comment.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => setComment('')}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                  >
                    <RotateCcw size={12} />
                    <span>Xóa trắng</span>
                  </button>
                )}
              </div>
            </div>

            <textarea
              rows={14}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`Nhấn nút "Tổng hợp tất cả đánh giá & nhận xét hoạt động" ở cột bên trái, chọn "Đưa vào sổ" từ từng hoạt động, hoặc trực tiếp viết nhận xét tháng ${month}/${year} cho bé ${childDisplayName} tại đây...`}
              className="w-full min-h-[320px] sm:min-h-[420px] rounded-2xl border-2 border-amber-200/90 bg-amber-50/10 p-4 text-sm sm:text-base font-medium text-slate-800 leading-relaxed outline-none focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100 transition"
            />

            {parentFeedback && (
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-indigo-900">
                  Ý kiến phản hồi từ Phụ huynh:
                </p>
                <p className="mt-1 text-sm text-slate-700 italic">“{parentFeedback}”</p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <Link
                href={`/teacher/good-child?month=${month}&year=${year}`}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Quay lại danh sách lớp
              </Link>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleToggleDeliver}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-extrabold transition cursor-pointer ${
                    isDelivered
                      ? 'border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      : 'border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  {isDelivered ? (
                    <>
                      <Check size={14} />
                      <span>Đã giao PH</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={14} />
                      <span>Giao sổ cho PH</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void handleSaveComment()}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-black text-white shadow-md shadow-amber-500/20 hover:bg-amber-600 disabled:opacity-50 transition cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <BookmarkCheck size={16} />
                      <span>Lưu nhận xét Sổ Bé Ngoan</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default function GoodChildDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-amber-500" size={32} />
        </div>
      }
    >
      <GoodChildDetailWorkspace />
    </Suspense>
  )
}
