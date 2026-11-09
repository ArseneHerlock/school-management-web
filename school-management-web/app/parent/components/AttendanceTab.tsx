'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, RefreshCw } from 'lucide-react'
import { getChildAttendanceHistory } from '@/services'
import { useApiQuery } from '@/lib/hooks/useApiQuery'
import { ChildInfo } from '../types'
import { AttendanceKPICards } from './attendance/AttendanceKPICards'
import { AttendanceChartCard } from './attendance/AttendanceChartCard'
import { AttendanceTable } from './attendance/AttendanceTable'

interface AttendanceRecord {
  id: string
  hocSinhId: string
  ngay: string
  trangThai: string
  gioDen?: string | null
  gioVe?: string | null
}

const parseRecordDate = (ngayStr: string) => {
  const clean = String(ngayStr || '').slice(0, 10)
  const [y, m, d] = clean.split('-').map(Number)
  return { year: y || 0, month: m || 0, day: d || 0 }
}

export default function AttendanceTab({ child }: { child: ChildInfo }) {
  const [filterMonth, setFilterMonth] = useState<number>(() => new Date().getMonth() + 1)
  const [filterYear, setFilterYear] = useState<number>(() => new Date().getFullYear())
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')

  // Sử dụng TanStack Query với staleTime 2 phút: dữ liệu được lưu cache trong bộ nhớ
  // Người dùng chuyển tab qua lại không bị giật, không bị chờ đợi lâu (0ms phản hồi)
  const { data: rawHistory, isLoading: loading, refetch } = useApiQuery(
    ['child', 'attendance-history', child.id],
    () => getChildAttendanceHistory(child.id),
    {
      enabled: Boolean(child.id),
      staleTime: 120_000,
    }
  )

  const records = useMemo(() => {
    return Array.isArray(rawHistory) ? (rawHistory as unknown as AttendanceRecord[]) : []
  }, [rawHistory])

  // Tự động chuyển sang tháng mới nhất có dữ liệu khi nạp bản ghi
  useEffect(() => {
    if (records.length > 0) {
      const sorted = [...records].sort(
        (a, b) => new Date(b.ngay).getTime() - new Date(a.ngay).getTime()
      )
      const latestDate = parseRecordDate(sorted[0].ngay)
      if (latestDate.month > 0 && latestDate.year > 0) {
        const hasDataInCurrent = records.some((r) => {
          const p = parseRecordDate(r.ngay)
          return p.month === filterMonth && p.year === filterYear
        })
        if (!hasDataInCurrent) {
          setFilterMonth(latestDate.month)
          setFilterYear(latestDate.year)
        }
      }
    }
  }, [records, filterMonth, filterYear])

  // Lọc riêng dữ liệu điểm danh theo Tháng và Năm được chọn (100% dữ liệu thực từ API)
  const monthRecords = useMemo(() => {
    return records.filter((r) => {
      if (!r.ngay) return false
      const p = parseRecordDate(r.ngay)
      return p.month === filterMonth && p.year === filterYear
    })
  }, [records, filterMonth, filterYear])

  // Thống kê chuyên cần của tháng đang xem:
  // - Đi học đủ (onTimeCount): có mặt và đến trước hoặc đúng 08:30
  // - Đến muộn (lateCount): có mặt và đến sau 08:30
  // - Tổng có mặt (presentCount): onTimeCount + lateCount
  // - Nghỉ học (absentCount): không có mặt
  // - Tổng số buổi học: presentCount + absentCount (dựa trên các ngày học thực tế đã ghi nhận trong tháng)
  // - Tỷ lệ chuyên cần (%): (presentCount / totalScheduledDays) * 100
  const stats = useMemo(() => {
    let onTimeCount = 0
    let lateCount = 0
    let absentCount = 0

    monthRecords.forEach((r) => {
      if (r.trangThai === 'Có mặt') {
        const isLate = r.gioDen && r.gioDen > '08:30:00'
        if (isLate) {
          lateCount++
        } else {
          onTimeCount++
        }
      } else {
        absentCount++
      }
    })

    const presentCount = onTimeCount + lateCount
    const totalScheduledDays = presentCount + absentCount
    const attendanceRate =
      totalScheduledDays > 0 ? Math.min(100, Math.round((presentCount / totalScheduledDays) * 100)) : 100

    return {
      presentCount,
      lateCount,
      absentCount,
      totalScheduledDays,
      attendanceRate,
    }
  }, [monthRecords])

  // Tính số ngày theo ĐÚNG 4 TUẦN TRONG THÁNG (Tuyệt đối không có tuần 5):
  // - Tuần 1: Ngày 01–07
  // - Tuần 2: Ngày 08–14
  // - Tuần 3: Ngày 15–21
  // - Tuần 4: Ngày 22–cuối tháng (22–28/30/31)
  // - Cột "Có mặt đúng giờ" và "Đi muộn" là 2 nhóm tách biệt (không cộng dồn trùng lặp)
  const weeklyChartData = useMemo(() => {
    const daysInMonth = new Date(filterYear, filterMonth, 0).getDate()
    const weeks = [
      { name: 'Tuần 1', dateRange: '01–07', present: 0, absent: 0, late: 0 },
      { name: 'Tuần 2', dateRange: '08–14', present: 0, absent: 0, late: 0 },
      { name: 'Tuần 3', dateRange: '15–21', present: 0, absent: 0, late: 0 },
      { name: 'Tuần 4', dateRange: `22–${daysInMonth}`, present: 0, absent: 0, late: 0 },
    ]

    monthRecords.forEach((r) => {
      const { day } = parseRecordDate(r.ngay)
      let weekIdx = 0
      if (day >= 22) weekIdx = 3
      else if (day >= 15) weekIdx = 2
      else if (day >= 8) weekIdx = 1
      else weekIdx = 0

      const isLate = r.gioDen && r.gioDen > '08:30:00'
      if (r.trangThai === 'Có mặt') {
        if (isLate) {
          weeks[weekIdx].late++
        } else {
          weeks[weekIdx].present++
        }
      } else {
        weeks[weekIdx].absent++
      }
    })

    return weeks
  }, [monthRecords, filterMonth, filterYear])

  const filteredRecords = useMemo(() => {
    const base = fromDate || toDate ? records : monthRecords
    return base
      .filter((r) => {
        const recordDate = String(r.ngay).slice(0, 10)
        if (fromDate && recordDate < fromDate) return false
        if (toDate && recordDate > toDate) return false

        if (statusFilter !== 'all') {
          const isLate = r.gioDen && r.gioDen > '08:30:00'
          if (statusFilter === 'present' && r.trangThai !== 'Có mặt') return false
          if (statusFilter === 'late' && (!isLate || r.trangThai !== 'Có mặt')) return false
          if (statusFilter === 'absent' && r.trangThai === 'Có mặt') return false
        }
        return true
      })
      .sort((a, b) => new Date(b.ngay).getTime() - new Date(a.ngay).getTime())
  }, [records, monthRecords, fromDate, toDate, statusFilter])

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-sky-700 p-3 sm:p-6 text-white shadow-lg shadow-blue-500/15">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-4">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold backdrop-blur">
              <CalendarDays size={12} /> SỔ ĐIỂM DANH
            </span>
            <h2 className="mt-1 text-sm sm:text-xl font-black">Điểm danh của {child.hoTen || 'Bé'}</h2>
            <p className="mt-0.5 text-[11px] text-blue-100 max-w-xl hidden sm:block">
              Hệ thống ghi nhận giờ đến, giờ về và tỷ lệ chuyên cần tính toán chính xác dựa trên lịch học thực tế của lớp {child.lop}.
            </p>
          </div>

          <button
            onClick={() => void refetch()}
            className="self-start md:self-auto flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 sm:px-4 sm:py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-50 transition shadow-xs cursor-pointer active:scale-95"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      <AttendanceKPICards
        attendanceRate={stats.attendanceRate}
        totalScheduledDays={stats.totalScheduledDays}
        presentCount={stats.presentCount}
        lateCount={stats.lateCount}
        absentCount={stats.absentCount}
      />

      <AttendanceChartCard
        data={weeklyChartData}
        filterMonth={filterMonth}
        setFilterMonth={setFilterMonth}
        filterYear={filterYear}
        setFilterYear={setFilterYear}
      />

      <AttendanceTable
        records={filteredRecords}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        fromDate={fromDate}
        setFromDate={setFromDate}
        toDate={toDate}
        setToDate={setToDate}
      />
    </div>
  )
}
