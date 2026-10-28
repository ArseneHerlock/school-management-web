'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  ChevronRight,
  Flower2,
  Loader2,
  Plus,
  RefreshCw,
  X,
  Award,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Trash2,
} from 'lucide-react'
import { currentUser } from '@/services/client'
import { getStaffByUserId } from '@/services/staff'
import { getClasses } from '@/services/classes'
import { getStudents, Student } from '@/services/students'
import { getGoodChildRecords, awardFlower, revokeFlower } from '@/services/learning'

function padZero(num: number): string {
  return String(num).padStart(2, '0')
}

interface FlowerRecord {
  id: string
  flowerDate: string
  reason?: string
  flowerType: number // 1: Hoa nhỏ, 2: Hoa lớn
  isRevoked?: boolean
}

interface GoodChildRecord {
  id: string
  childId: string
  month: number
  year: number
  dailyFlowerCount: number
  bonusFlowerCount: number
  flowers?: FlowerRecord[]
}

export default function FlowerAwardsPage() {
  const currentDate = new Date()
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear())

  // Danh sách học sinh và sổ bé ngoan
  const [studentsList, setStudentsList] = useState<Student[]>([])
  const [recordsList, setRecordsList] = useState<GoodChildRecord[]>([])

  // Modal tặng hoa
  const [selectedStudentForAward, setSelectedStudentForAward] = useState<{
    student: Student
    record?: GoodChildRecord
  } | null>(null)

  const [awardDate, setAwardDate] = useState<string>(
    `${currentDate.getFullYear()}-${padZero(currentDate.getMonth() + 1)}-${padZero(
      currentDate.getDate()
    )}`
  )
  const [awardReason, setAwardReason] = useState<string>('')

  // Modal gỡ hoa
  const [flowerToRevoke, setFlowerToRevoke] = useState<FlowerRecord | null>(null)
  const [revokeReason, setRevokeReason] = useState<string>('')

  // Trạng thái tải và phản hồi
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const requestCounterRef = useRef<number>(0)
  const lastDayOfMonth = new Date(selectedYear, selectedMonth, 0).getDate()

  /**
   * Tải danh sách học sinh và bản ghi hoa bé ngoan trong tháng
   */
  const loadFlowerAwardsData = useCallback(async () => {
    const currentRequestId = ++requestCounterRef.current
    setIsLoading(true)
    setErrorMessage('')

    try {
      const activeUser = currentUser()
      if (!activeUser) return

      // 1. Lấy thông tin lớp học của giáo viên
      const staffMember = await getStaffByUserId(activeUser.id)
      const allClasses = await getClasses()
      const myClass = allClasses.find((c) => c.giaoVienChuNhiemId === staffMember?.staffId)

      let students: Student[] = []
      if (myClass) {
        students = await getStudents({ lopId: myClass.id })
      } else {
        students = await getStudents()
      }

      if (currentRequestId !== requestCounterRef.current) return
      setStudentsList(students)

      // 2. Lấy danh sách sổ bé ngoan theo tháng và năm
      const rawRecords = await getGoodChildRecords({
        month: selectedMonth,
        year: selectedYear,
        pageSize: 100,
      })

      if (currentRequestId === requestCounterRef.current) {
        const recordsArray: GoodChildRecord[] = Array.isArray(rawRecords) ? rawRecords : []

        const filteredByMonthYear = recordsArray.filter(
          (item) =>
            Number(item.month) === selectedMonth && Number(item.year) === selectedYear
        )
        setRecordsList(filteredByMonthYear)
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Không tải được dữ liệu hoa bé ngoan'
      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
    }
  }, [selectedMonth, selectedYear])

  useEffect(() => {
    setAwardDate(`${selectedYear}-${padZero(selectedMonth)}-01`)
    setSelectedStudentForAward(null)
    loadFlowerAwardsData()
  }, [selectedMonth, selectedYear, loadFlowerAwardsData])

  function getRecordForStudent(studentId: string): GoodChildRecord | undefined {
    return recordsList.find((record) => String(record.childId) === String(studentId))
  }

  function handleOpenAwardModal(student: Student): void {
    const studentRecord = getRecordForStudent(student.id)
    setSelectedStudentForAward({ student, record: studentRecord })
    setAwardReason('')
  }

  /**
   * Thực hiện tặng hoa nhỏ cho bé
   */
  async function handleAwardFlower(): Promise<void> {
    if (!selectedStudentForAward?.record) return

    const currentSmallFlowers = Number(selectedStudentForAward.record.dailyFlowerCount || 0)
    if (currentSmallFlowers >= 4) {
      setErrorMessage('Bé đã đủ 4/4 hoa nhỏ trong tháng này.')
      return
    }

    const parsedDate = new Date(`${awardDate}T00:00:00`)
    if (
      parsedDate.getMonth() + 1 !== selectedMonth ||
      parsedDate.getFullYear() !== selectedYear
    ) {
      setErrorMessage('Ngày tặng hoa phải thuộc đúng tháng đang được chọn.')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')

      const updatedRecord = await awardFlower(
        selectedStudentForAward.record.id,
        {
          flowerDate: awardDate,
          reason: awardReason.trim() || 'Bé có việc làm tốt đáng khen trong ngày',
        }
      )

      setRecordsList(function (prevList) {
        return prevList.map((item) => (item.id === updatedRecord.id ? updatedRecord : item))
      })

      setSelectedStudentForAward({
        ...selectedStudentForAward,
        record: updatedRecord,
      })

      setAwardReason('')
      const isUpgraded = Number(updatedRecord.dailyFlowerCount || 0) >= 4
      setFeedbackMessage(
        isUpgraded
          ? 'Đã tặng hoa nhỏ thứ 4! Hệ thống tự động trao tặng thêm 1 Hoa lớn cho bé.'
          : 'Đã tặng 1 hoa nhỏ cho bé thành công.'
      )
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Không thể tặng hoa'
      setErrorMessage(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Thu hồi / Gỡ hoa đã tặng kèm lý do bắt buộc
   */
  async function handleConfirmRevokeFlower(): Promise<void> {
    if (!flowerToRevoke || !revokeReason.trim() || !selectedStudentForAward?.record) return

    try {
      setIsSubmitting(true)
      const updatedRecord = await revokeFlower(
        selectedStudentForAward.record.id,
        flowerToRevoke.id,
        revokeReason.trim()
      )

      const mergedRecord: GoodChildRecord = {
        ...selectedStudentForAward.record,
        ...updatedRecord,
        flowers: updatedRecord.flowers ?? selectedStudentForAward.record.flowers ?? [],
      }

      setSelectedStudentForAward({
        ...selectedStudentForAward,
        record: mergedRecord,
      })

      setRecordsList(function (prevList) {
        return prevList.map((item) => (item.id === mergedRecord.id ? mergedRecord : item))
      })

      setFlowerToRevoke(null)
      setRevokeReason('')
      setFeedbackMessage('Đã thu hồi hoa và ghi nhận lý do thành công.')
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Không thể gỡ hoa'
      setErrorMessage(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Tiêu đề trang */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-black tracking-wider text-rose-600 uppercase">
            Thi đua & Khen thưởng mầm non
          </span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
            Tặng hoa bé ngoan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Mỗi tháng bé có thể nhận tối đa 4 hoa nhỏ. Khi tích lũy đủ 4/4 hoa nhỏ, hệ thống sẽ tự động tặng 1 Hoa lớn danh dự.
          </p>
        </div>

        <button
          onClick={loadFlowerAwardsData}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-rose-300 transition"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin text-rose-500' : ''} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Thông báo kết quả */}
      {feedbackMessage && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 text-xs font-bold text-emerald-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{feedbackMessage}</span>
          </div>
          <button onClick={() => setFeedbackMessage('')}>
            <X size={15} />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-xs font-bold text-rose-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')}>
            <X size={15} />
          </button>
        </div>
      )}

      {/* Thanh chọn kỳ thi đua (Tháng / Năm) */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-4.5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <Calendar size={18} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Kỳ tặng hoa:</span>
            <select
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-rose-400 focus:bg-white"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  Tháng {index + 1}
                </option>
              ))}
            </select>

            <input
              type="number"
              className="w-24 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-rose-400 focus:bg-white"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Thời gian hợp lệ: Từ ngày 01 đến ngày {lastDayOfMonth} / {selectedMonth}
        </div>
      </div>

      {/* Thẻ hướng dẫn quy tắc */}
      <div className="rounded-3xl border border-rose-100 bg-gradient-to-r from-rose-50/80 via-amber-50/60 to-orange-50/40 p-4.5 flex items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-xs text-rose-500">
          <Flower2 size={24} />
        </div>
        <div>
          <h4 className="text-xs font-black text-slate-800">
            Quy tắc khen thưởng Tháng {selectedMonth}/{selectedYear}
          </h4>
          <p className="text-[11px] text-slate-600 mt-0.5">
            Mỗi hoa nhỏ biểu thị cho một việc tốt trong tuần/ngày. Đủ 4 hoa nhỏ sẽ tự động được trao tặng 1 Hoa lớn cuối tháng.
          </p>
        </div>
      </div>

      {/* Lưới danh sách học sinh */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-rose-500" size={32} />
        </div>
      ) : studentsList.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-14 text-center text-xs text-slate-400">
          Chưa có học sinh trong danh sách lớp phụ trách.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {studentsList.map((student) => {
            const studentRecord = getRecordForStudent(student.id)
            const smallFlowers = studentRecord?.dailyFlowerCount || 0
            const bigFlowers = studentRecord?.bonusFlowerCount || 0

            const initials = student.tenHocSinh
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(-2)
              .toUpperCase()

            return (
              <button
                key={student.id}
                type="button"
                onClick={() => handleOpenAwardModal(student)}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 text-left shadow-xs transition hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 font-black text-xs text-white shadow-xs">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-black text-slate-900 group-hover:text-rose-600 transition truncate">
                          {student.tenHocSinh}
                        </h3>
                        <p className="text-[10px] text-slate-400">
                          {studentRecord ? 'Đã tạo sổ tháng' : 'Chưa mở sổ tháng'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={17} className="text-slate-300 group-hover:text-rose-500" />
                  </div>

                  {/* Tiến độ hoa */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-2xl bg-rose-50/80 p-2.5 border border-rose-100 flex items-center justify-between">
                      <span className="font-bold text-rose-700 flex items-center gap-1">
                        <span>🌹</span> Hoa nhỏ
                      </span>
                      <strong className="text-rose-800 font-black">{smallFlowers} / 4</strong>
                    </div>

                    <div className="rounded-2xl bg-amber-50/80 p-2.5 border border-amber-100 flex items-center justify-between">
                      <span className="font-bold text-amber-700 flex items-center gap-1">
                        <span>🏅</span> Hoa lớn
                      </span>
                      <strong className="text-amber-800 font-black">{bigFlowers}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-[10px] font-bold text-slate-400 text-center border-t border-slate-100 pt-2.5">
                  Bấm để xem lịch sử & tặng hoa
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Modal Tặng hoa & Lịch sử hoa của bé */}
      {selectedStudentForAward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            {/* Header Modal */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600">
                  Tặng hoa Tháng {selectedMonth}/{selectedYear}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {selectedStudentForAward.student.tenHocSinh}
                </h3>
              </div>
              <button
                onClick={() => setSelectedStudentForAward(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {selectedStudentForAward.record ? (
              <>
                {/* Chỉ số hoa hiện tại */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-rose-50 p-3.5 border border-rose-100 text-center">
                    <p className="text-[11px] font-bold text-rose-700">Hoa nhỏ đã nhận</p>
                    <p className="text-2xl font-black text-rose-800 mt-1">
                      {selectedStudentForAward.record.dailyFlowerCount} / 4
                    </p>
                  </div>
                  <div className="rounded-2xl bg-amber-50 p-3.5 border border-amber-100 text-center">
                    <p className="text-[11px] font-bold text-amber-700">Hoa lớn đạt được</p>
                    <p className="text-2xl font-black text-amber-800 mt-1">
                      🏅 {selectedStudentForAward.record.bonusFlowerCount}
                    </p>
                  </div>
                </div>

                {/* Form tặng hoa */}
                <div className="space-y-3 rounded-2xl bg-slate-50/80 p-4 border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700">Ghi nhận hoa mới cho bé</h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500">Ngày tặng hoa</label>
                      <input
                        type="date"
                        min={`${selectedYear}-${padZero(selectedMonth)}-01`}
                        max={`${selectedYear}-${padZero(selectedMonth)}-${padZero(lastDayOfMonth)}`}
                        className="w-full mt-1 rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-800"
                        value={awardDate}
                        onChange={(e) => setAwardDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500">Lý do đáng khen</label>
                      <input
                        className="w-full mt-1 rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800"
                        value={awardReason}
                        onChange={(e) => setAwardReason(e.target.value)}
                        placeholder="Ví dụ: Giúp đỡ bạn, ăn hết suất..."
                      />
                    </div>
                  </div>

                  <button
                    disabled={
                      isSubmitting ||
                      Number(selectedStudentForAward.record.dailyFlowerCount || 0) >= 4
                    }
                    onClick={handleAwardFlower}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-rose-500 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-600 disabled:opacity-40 transition cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Plus size={15} />
                    )}
                    <span>
                      {Number(selectedStudentForAward.record.dailyFlowerCount || 0) >= 4
                        ? 'Bé đã đủ 4/4 hoa nhỏ tháng này'
                        : 'Tặng hoa nhỏ cho bé'}
                    </span>
                  </button>
                </div>

                {/* Danh sách hoa đã tặng */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700">Lịch sử hoa trong tháng</h4>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {(selectedStudentForAward.record.flowers || []).length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">Chưa có hoa nào được ghi nhận.</p>
                    ) : (
                      (selectedStudentForAward.record.flowers || []).map((flower) => (
                        <div
                          key={flower.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white p-2.5"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">
                              {flower.flowerType === 2 ? '🏅' : '🌹'}
                            </span>
                            <div>
                              <p className="text-xs font-bold text-slate-800">
                                {flower.flowerType === 2 ? 'Hoa lớn danh dự' : 'Hoa nhỏ bé ngoan'}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {flower.flowerDate} • {flower.reason || 'Khen thưởng'}
                              </p>
                            </div>
                          </div>

                          {!flower.isRevoked && flower.flowerType === 1 && (
                            <button
                              onClick={() => {
                                setFlowerToRevoke(flower)
                                setRevokeReason('')
                              }}
                              className="text-xs text-rose-600 hover:text-rose-800 font-semibold p-1"
                              title="Thu hồi hoa"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-2xl bg-amber-50 p-6 text-center text-xs text-amber-800">
                Bé chưa có sổ theo dõi tháng này. Vui lòng mở chức năng <b>Sổ bé ngoan</b> để khởi tạo sổ tháng cho trẻ trước khi tặng hoa.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal xác nhận thu hồi hoa */}
      {flowerToRevoke && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl space-y-4">
            <h4 className="text-sm font-black text-rose-800">Xác nhận thu hồi hoa</h4>
            <p className="text-xs text-slate-500">
              Vui lòng nhập lý do thu hồi hoa (bắt buộc):
            </p>
            <textarea
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-rose-400"
              rows={2}
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
              placeholder="Nhập lý do thu hồi..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setFlowerToRevoke(null)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
              >
                Hủy bỏ
              </button>
              <button
                disabled={isSubmitting || !revokeReason.trim()}
                onClick={handleConfirmRevokeFlower}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-40"
              >
                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận thu hồi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
