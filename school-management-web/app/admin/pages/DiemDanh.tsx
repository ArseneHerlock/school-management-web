'use client'

import { useEffect, useMemo, useState } from 'react'
import { RefreshCw, BarChart3, UserCheck, Calendar } from 'lucide-react'
import { getStudents } from '@/services/students'
import { getClasses } from '@/services/classes'
import { getGrades } from '@/services/grades'
import { getDailyAttendance, getStudentAttendanceHistory } from '@/services/attendance'
import TabsNav, { TabItem } from '@/app/components/ui/TabsNav'
import { Student, ClassRow, Grade, AttendanceRecord, HistoryRecord, AdminAttTab } from './diem-danh/types'
import DiemDanhDashboard from './diem-danh/DiemDanhDashboard'
import DiemDanhMonitoring from './diem-danh/DiemDanhMonitoring'
import DiemDanhHistoryModal from './diem-danh/DiemDanhHistoryModal'

/**
 * Tính phần trăm chuyên cần an toàn, tránh chia cho 0
 */
function calculatePercentage(partValue: number, totalValue: number): number {
  if (!totalValue || totalValue === 0) {
    return 0;
  }
  return Math.round((partValue * 100) / totalValue);
}

export default function DiemDanh() {
  const currentDateString = new Date().toISOString().split('T')[0]
  const [activeTab, setActiveTab] = useState<AdminAttTab>('dashboard')
  const [selectedDate, setSelectedDate] = useState<string>(currentDateString)
  const [selectedClassId, setSelectedClassId] = useState<string>('ALL')

  // Dữ liệu chính
  const [studentsList, setStudentsList] = useState<Student[]>([])
  const [classesList, setClassesList] = useState<ClassRow[]>([])
  const [gradesList, setGradesList] = useState<Grade[]>([])
  const [attendanceRecordsMap, setAttendanceRecordsMap] = useState<Record<string, AttendanceRecord>>({})

  // Tìm kiếm và trạng thái tải
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Modal lịch sử điểm danh của từng học sinh
  const [selectedHistoryStudent, setSelectedHistoryStudent] = useState<Student | null>(null)
  const [studentHistoryLogs, setStudentHistoryLogs] = useState<HistoryRecord[]>([])
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false)

  /**
   * Tải toàn bộ dữ liệu học sinh, lớp, khối và điểm danh theo ngày
   */
  async function loadAttendanceData(targetDate: string = selectedDate): Promise<void> {
    setIsLoading(true)
    try {
      const [studentsResult, classesResult, gradesResult, attendanceResult] = await Promise.allSettled([
        getStudents(),
        getClasses(),
        getGrades(),
        getDailyAttendance(targetDate),
      ])

      if (studentsResult.status === 'fulfilled' && Array.isArray(studentsResult.value)) {
        setStudentsList(studentsResult.value as unknown as Student[])
      } else {
        setStudentsList([])
      }

      if (classesResult.status === 'fulfilled' && Array.isArray(classesResult.value)) {
        setClassesList(classesResult.value as unknown as ClassRow[])
      } else {
        setClassesList([])
      }

      if (gradesResult.status === 'fulfilled' && Array.isArray(gradesResult.value)) {
        setGradesList(gradesResult.value as unknown as Grade[])
      } else {
        setGradesList([])
      }

      const attendanceList =
        attendanceResult.status === 'fulfilled' && Array.isArray(attendanceResult.value)
          ? attendanceResult.value
          : []

      const mappedAttendance: Record<string, AttendanceRecord> = {}
      attendanceList.forEach(function (attendanceItem: any) {
        const studentId = attendanceItem.hocSinhId || attendanceItem.HocSinhId
        if (studentId) {
          mappedAttendance[studentId] = {
            id: attendanceItem.id || attendanceItem.Id || studentId,
            coBanGhi: true,
            trangThai: attendanceItem.trangThai || attendanceItem.TrangThai || 'Có mặt',
            gioDen: attendanceItem.gioDen || attendanceItem.GioDen || null,
            gioVe: attendanceItem.gioVe || attendanceItem.GioVe || null,
            ghiChu: attendanceItem.ghiChu || attendanceItem.GhiChu || null,
          }
        }
      })

      setAttendanceRecordsMap(mappedAttendance)
    } finally {
      setIsLoading(false)
    }
  }

  // Tải lại khi thay đổi ngày chọn
  useEffect(() => {
    loadAttendanceData(selectedDate)
  }, [selectedDate])

  /**
   * Ghép thông tin điểm danh và tên lớp vào từng học sinh
   */
  const mergedStudentsList = useMemo(() => {
    return studentsList.map(function (studentItem) {
      const matchedClass = classesList.find(function (classItem) {
        return classItem.id === studentItem.lopId
      })
      const matchedGrade = gradesList.find(function (gradeItem) {
        return gradeItem.id === matchedClass?.khoiId
      })

      const attendanceRecord = attendanceRecordsMap[studentItem.id] || {
        id: studentItem.id,
        coBanGhi: false,
        trangThai: 'Chưa điểm danh',
      }

      return {
        ...studentItem,
        att: attendanceRecord,
        className: matchedClass?.tenLop || 'Chưa xếp lớp',
        gradeName: matchedGrade?.tenKhoi || 'Chưa rõ',
      }
    })
  }, [studentsList, attendanceRecordsMap, classesList, gradesList])

  /**
   * Lọc danh sách học sinh theo lớp và từ khóa tìm kiếm
   */
  const classFilteredStudents = useMemo(() => {
    let resultList = mergedStudentsList

    if (selectedClassId !== 'ALL') {
      resultList = resultList.filter(function (studentItem) {
        return studentItem.lopId === selectedClassId
      })
    }

    const keyword = searchKeyword.trim().toLowerCase()
    if (keyword.length > 0) {
      resultList = resultList.filter(function (studentItem) {
        const matchName = studentItem.tenHocSinh.toLowerCase().includes(keyword)
        const matchClass = studentItem.className.toLowerCase().includes(keyword)
        return matchName || matchClass
      })
    }

    return resultList
  }, [mergedStudentsList, selectedClassId, searchKeyword])

  // Thống kê chuyên cần toàn trường
  const presentCount = mergedStudentsList.filter(function (item) {
    return item.att?.coBanGhi && String(item.att?.trangThai).toLowerCase().includes('có mặt')
  }).length

  const lateCount = mergedStudentsList.filter(function (item) {
    return item.att?.coBanGhi && String(item.att?.trangThai).toLowerCase().includes('muộn')
  }).length

  const absentCount = mergedStudentsList.filter(function (item) {
    const isAbsent = item.att?.coBanGhi && String(item.att?.trangThai).toLowerCase().includes('vắng')
    const isLeave = String(item.att?.trangThai).toLowerCase().includes('nghỉ')
    return isAbsent || isLeave
  }).length

  const unrecordedCount = Math.max(0, studentsList.length - presentCount - lateCount - absentCount)
  const schoolPercentage = calculatePercentage(presentCount + lateCount, studentsList.length)

  // Thống kê chuyên cần theo từng lớp
  const attendanceByClass = useMemo(() => {
    return classesList.map(function (classItem) {
      const studentsInClass = mergedStudentsList.filter(function (studentItem) {
        return studentItem.lopId === classItem.id
      })

      const presentStudentCount = studentsInClass.filter(function (studentItem) {
        const status = String(studentItem.att?.trangThai).toLowerCase()
        return studentItem.att?.coBanGhi && (status.includes('có mặt') || status.includes('muộn'))
      }).length

      const absentStudentCount = studentsInClass.filter(function (studentItem) {
        const status = String(studentItem.att?.trangThai).toLowerCase()
        return studentItem.att?.coBanGhi && (status.includes('vắng') || status.includes('nghỉ'))
      }).length

      return {
        name: classItem.tenLop,
        present: presentStudentCount,
        absent: absentStudentCount,
      }
    })
  }, [mergedStudentsList, classesList])

  // Thống kê chuyên cần theo từng khối
  const attendanceByGrade = useMemo(() => {
    return gradesList.map(function (gradeItem) {
      const classIdsInGrade = new Set(
        classesList
          .filter(function (classItem) {
            return classItem.khoiId === gradeItem.id
          })
          .map(function (classItem) {
            return classItem.id
          })
      )

      const studentsInGrade = mergedStudentsList.filter(function (studentItem) {
        return studentItem.lopId && classIdsInGrade.has(studentItem.lopId)
      })

      const presentCountInGrade = studentsInGrade.filter(function (studentItem) {
        const status = String(studentItem.att?.trangThai).toLowerCase()
        return studentItem.att?.coBanGhi && (status.includes('có mặt') || status.includes('muộn'))
      }).length

      const absentCountInGrade = studentsInGrade.filter(function (studentItem) {
        const status = String(studentItem.att?.trangThai).toLowerCase()
        return studentItem.att?.coBanGhi && (status.includes('vắng') || status.includes('nghỉ'))
      }).length

      return {
        name: gradeItem.tenKhoi,
        present: presentCountInGrade,
        absent: absentCountInGrade,
      }
    })
  }, [mergedStudentsList, gradesList, classesList])

  /**
   * Mở modal xem lịch sử điểm danh của học sinh
   */
  async function handleOpenHistoryModal(targetStudent: Student): Promise<void> {
    setSelectedHistoryStudent(targetStudent)
    setIsHistoryLoading(true)
    try {
      const rawHistory = await getStudentAttendanceHistory(targetStudent.id)
      setStudentHistoryLogs(Array.isArray(rawHistory) ? (rawHistory as unknown as HistoryRecord[]) : [])
    } catch (error) {
      console.warn('Không thể tải lịch sử điểm danh:', error)
      setStudentHistoryLogs([])
    } finally {
      setIsHistoryLoading(false)
    }
  }

  const tabs: TabItem<AdminAttTab>[] = [
    { id: 'dashboard', label: 'Tổng quan chuyên cần', icon: BarChart3 },
    { id: 'monitoring', label: 'Bảng giám sát trực tiếp', icon: UserCheck, badge: studentsList.length },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold text-rose-500 uppercase">Học vụ & Giám sát nề nếp</span>
          <h1 className="text-2xl font-black text-slate-800">Giám sát Điểm danh Toàn trường</h1>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="rounded-2xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-rose-400"
          />
          <button
            onClick={() => loadAttendanceData(selectedDate)}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-rose-50 transition"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Cập nhật
          </button>
        </div>
      </div>

      <TabsNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'dashboard' ? (
        <DiemDanhDashboard
          presentCount={presentCount}
          lateCount={lateCount}
          absentCount={absentCount}
          unrecordedCount={unrecordedCount}
          totalStudents={studentsList.length}
          schoolPercent={schoolPercentage}
          byClass={attendanceByClass}
          byGrade={attendanceByGrade}
        />
      ) : (
        <DiemDanhMonitoring
          students={classFilteredStudents}
          classes={classesList}
          selectedClassId={selectedClassId}
          setSelectedClassId={setSelectedClassId}
          q={searchKeyword}
          setQ={setSearchKeyword}
          onViewHistory={handleOpenHistoryModal}
        />
      )}

      <DiemDanhHistoryModal
        student={selectedHistoryStudent}
        onClose={() => setSelectedHistoryStudent(null)}
        logs={studentHistoryLogs}
        loading={isHistoryLoading}
      />
    </div>
  )
}
