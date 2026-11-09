'use client'

import { useEffect, useState } from 'react'
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  ShieldCheck,
  RefreshCw,
  School,
  IdCard,
} from 'lucide-react'
import { currentUser } from '@/services/client'
import { getClasses } from '@/services/classes'
import { getStaff } from '@/services/staff'

interface StaffProfile {
  staffId: string
  fullName: string
  staffCode?: string
  phoneNumber: string
  email: string
  address?: string
  positionId: string
  hireDate: string
  status: string
}

export default function TeacherProfilePage() {
  const [profileData, setProfileData] = useState<StaffProfile | null>(null)
  const [assignedClassName, setAssignedClassName] = useState<string>('Chưa phân công lớp')
  const [assignedRoom, setAssignedRoom] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string>('')

  async function loadTeacherProfile(): Promise<void> {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const activeUser = currentUser()
      if (!activeUser) return

      // Tải hồ sơ từ StaffService
      const staffResponse = await getStaff()
      const staffList = Array.isArray(staffResponse) ? staffResponse : []
      const matchedStaff = staffList.find((item) => item.userId === activeUser.id)

      if (matchedStaff) {
        setProfileData({ ...matchedStaff, address: matchedStaff.address ?? undefined })

        // Tìm lớp mà giáo viên làm chủ nhiệm
        const classesResponse = await getClasses()
        const assignedClass = classesResponse.find(
          (classItem) =>
            classItem.giaoVienChuNhiemId === matchedStaff.staffId ||
            classItem.giaoVienPhuId === matchedStaff.staffId
        )

        if (assignedClass) {
          setAssignedClassName(assignedClass.tenLop)
          setAssignedRoom(assignedClass.phongHoc || 'Phòng học chính')
        }
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Không tải được hồ sơ giáo viên'
      setErrorMessage(msg)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTeacherProfile()
  }, [])

  const initials = (profileData?.fullName || 'GV')
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(-2)
    .toUpperCase()

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Tiêu đề trang */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Thông tin cá nhân
          </h1>
        </div>

        <button
          onClick={loadTeacherProfile}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-orange-300 transition"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin text-orange-500' : ''} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Thông báo lỗi */}
      {errorMessage && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-800">
          {errorMessage}
        </div>
      )}

      {/* Thẻ Hero Profile */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-500 text-2xl font-black text-white shadow-lg shadow-orange-500/25">
          {initials}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h2 className="text-xl font-black text-slate-900">
              {profileData?.fullName || 'Giáo viên mầm non'}
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
              <ShieldCheck size={13} />
              <span>{profileData?.status || 'Đang công tác'}</span>
            </span>
          </div>

          <p className="text-xs font-semibold text-orange-600">
            Mã nhân sự: <span className="font-mono">{profileData?.staffCode || 'Chưa cấp mã'}</span>
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1 rounded-xl bg-orange-50 px-2.5 py-1 font-bold text-orange-800 border border-orange-100">
              <School size={14} className="text-orange-600" />
              {assignedClassName} {assignedRoom ? `• ${assignedRoom}` : ''}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} className="text-slate-400" />
              Ngày vào làm: {profileData?.hireDate ? String(profileData.hireDate).slice(0, 10) : '2026-09-01'}
            </span>
          </div>
        </div>
      </div>

      {/* Lưới chi tiết thông tin */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3">
          Chi tiết hồ sơ nhân sự
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3.5 rounded-2xl bg-slate-50/70 p-3.5 border border-slate-100">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <User size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400">Họ và tên</p>
              <p className="text-xs font-black text-slate-800 mt-0.5">
                {profileData?.fullName || '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl bg-slate-50/70 p-3.5 border border-slate-100">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <IdCard size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400">Mã định danh (Staff ID)</p>
              <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                {profileData?.staffId || '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl bg-slate-50/70 p-3.5 border border-slate-100">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400">Số điện thoại liên hệ</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {profileData?.phoneNumber || 'Chưa cập nhật'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl bg-slate-50/70 p-3.5 border border-slate-100">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400">Địa chỉ Email</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {profileData?.email || 'Chưa cập nhật'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl bg-slate-50/70 p-3.5 border border-slate-100 sm:col-span-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400">Địa chỉ cư trú</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {profileData?.address || 'Chưa cập nhật địa chỉ'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
