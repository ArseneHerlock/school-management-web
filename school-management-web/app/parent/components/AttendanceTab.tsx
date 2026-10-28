'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Calendar } from 'lucide-react'
import { getChildAttendanceHistory, getParentSchedules } from '@/services'
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

interface ScheduleItem {
  id: string
  date: string
  classId: string
  title?: string
}

export default function AttendanceTab({ child }: { child: ChildInfo }) {
  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [schedules, setSchedules] = useState<ScheduleItem[]>([])
  const [filterMonth] = useState<number>(new Date().getMonth() + 1)
  const [filterYear] = useState<number>(new Date().getFullYear())
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')

  const loadAttendanceData = async () => {
    if (!child.id) return
    setLoading(true)
    try {
      const [historyRes, scheduleRes] = await Promise.allSettled([
        getChildAttendanceHistory(child.id),
        getParentSchedules({
          classId: child.classId || '',
          thang: filterMonth,
          nam: filterYear,
        }),
      ])

      if (historyRes.status === 'fulfilled') {
        const data = historyRes.value || []
        setRecords(Array.isArray(data) ? (data as unknown as AttendanceRecord[]) : [])
      }

      if (scheduleRes.status === 'fulfilled') {
        setSchedules(Array.isArray(scheduleRes.value) ? (scheduleRes.value as unknown as ScheduleItem[]) : [])
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAttendanceData()
  }, [child.id, filterMonth, filterYear])

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
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
  }, [records, fromDate, toDate, statusFilter])

  const stats = useMemo(() => {
    let presentCount = 0
    let lateCount = 0
    let absentCount = 0

    records.forEach((r) => {
      if (r.trangThai === 'Có mặt') {
        presentCount++
        if (r.gioDen && r.gioDen > '08:30:00') {
          lateCount++
        }
      } else {
        absentCount++
      }
    })

    const totalScheduledDays = schedules.length > 0 ? schedules.length : records.length
    const attendanceRate =
      totalScheduledDays > 0 ? Math.min(100, Math.round((presentCount / totalScheduledDays) * 100)) : 100

    return {
      presentCount,
      lateCount,
      absentCount,
      totalScheduledDays,
      attendanceRate,
    }
  }, [records, schedules])

  const weeklyChartData = useMemo(() => {
    const weeks: Record<string, { name: string; present: number; absent: number; late: number }> = {
      'Tuần 1': { name: 'Tuần 1 (1-7)', present: 0, absent: 0, late: 0 },
      'Tuần 2': { name: 'Tuần 2 (8-14)', present: 0, absent: 0, late: 0 },
      'Tuần 3': { name: 'Tuần 3 (15-21)', present: 0, absent: 0, late: 0 },
      'Tuần 4': { name: 'Tuần 4 (22-cuối)', present: 0, absent: 0, late: 0 },
    }

    records.forEach((r) => {
      const day = new Date(r.ngay).getDate()
      let weekKey = 'Tuần 1'
      if (day > 21) weekKey = 'Tuần 4'
      else if (day > 14) weekKey = 'Tuần 3'
      else if (day > 7) weekKey = 'Tuần 2'

      if (r.trangThai === 'Có mặt') {
        weeks[weekKey].present++
        if (r.gioDen && r.gioDen > '08:30:00') weeks[weekKey].late++
      } else {
        weeks[weekKey].absent++
      }
    })

    return Object.values(weeks)
  }, [records])

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-sky-700 p-4 sm:p-6 text-white shadow-lg shadow-blue-500/15">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold backdrop-blur">
              <CalendarDays size={13} /> SỔ ĐIỂM DANH & CHUYÊN CẦN
            </span>
            <h2 className="mt-1 sm:mt-2 text-base sm:text-xl font-black">Nhật ký Điểm danh của {child.hoTen || 'Bé'}</h2>
            <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-blue-100 max-w-xl">
              Hệ thống ghi nhận giờ đến, giờ về và tỷ lệ chuyên cần tính toán chính xác dựa trên lịch học thực tế của lớp {child.lop}.
            </p>
          </div>

          <button
            onClick={() => void loadAttendanceData()}
            className="self-start md:self-auto flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 sm:px-4 sm:py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-50 transition shadow-xs cursor-pointer"
          >
            <Calendar size={14} />
            <span>Làm mới dữ liệu</span>
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
        filterYear={filterYear}
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
