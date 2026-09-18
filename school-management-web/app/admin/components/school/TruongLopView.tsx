'use client'

import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Edit,
  Plus,
  Search,
  School,
  Users,
} from 'lucide-react'
import { BLOCKS, CLASSES } from '../../data'

const BLOCK_STYLES: Record<string, {
  icon: string
  iconBg: string
  iconText: string
  softBg: string
  accent: string
}> = {
  'Khối Mầm': {
    icon: '🌸',
    iconBg: 'bg-rose-100',
    iconText: 'text-rose-600',
    softBg: 'bg-rose-50/70',
    accent: 'bg-rose-500',
  },
  'Khối Chồi': {
    icon: '🌼',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
    softBg: 'bg-amber-50/70',
    accent: 'bg-amber-500',
  },
  'Khối Lá': {
    icon: '🌱',
    iconBg: 'bg-indigo-100',
    iconText: 'text-indigo-600',
    softBg: 'bg-indigo-50/70',
    accent: 'bg-indigo-500',
  },
}

export default function TruongLop() {
  const [selectedBlock, setSelectedBlock] = useState<string>('Tất cả')
  const [search, setSearch] = useState('')

  const normalizedSearch = search.trim().toLowerCase()

  const blockStats = useMemo(() => BLOCKS.map(block => {
    const classes = CLASSES.filter(c => c.block === block)
    const students = classes.reduce((sum, c) => sum + c.currentCount, 0)
    const capacity = classes.reduce((sum, c) => sum + c.capacity, 0)

    return {
      name: block,
      classes,
      classCount: classes.length,
      students,
      capacity,
      fillRate: capacity ? Math.round(students / capacity * 100) : 0,
      missingTeacher: classes.filter(c => !c.teacher).length,
    }
  }), [])

  const totalStudents = CLASSES.reduce((sum, c) => sum + c.currentCount, 0)
  const totalCapacity = CLASSES.reduce((sum, c) => sum + c.capacity, 0)
  const totalFillRate = totalCapacity ? Math.round(totalStudents / totalCapacity * 100) : 0

  const selectedBlockStats = blockStats.find(block => block.name === selectedBlock)

  const filteredClasses = useMemo(() => CLASSES.filter(cls => {
    const matchesBlock = selectedBlock === 'Tất cả' || cls.block === selectedBlock
    const matchesSearch = !normalizedSearch ||
      cls.name.toLowerCase().includes(normalizedSearch) ||
      cls.teacher?.toLowerCase().includes(normalizedSearch) ||
      cls.room.toLowerCase().includes(normalizedSearch)

    return matchesBlock && matchesSearch
  }), [normalizedSearch, selectedBlock])

  const showClassResults = selectedBlock !== 'Tất cả' || normalizedSearch.length > 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <span>Quản lý</span>
            <ChevronRight size={13} />
            <span className="text-gray-600">Trường & Lớp</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Trường & Lớp</h1>
          <p className="text-sm text-gray-500 mt-1">Năm học 2024-2025 · Trường Mầm Non Hoa Sen</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-rose-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-600 transition-colors shadow-sm">
          <Plus size={17} />
          Thêm lớp
        </button>
      </div>

      {/* School overview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-rose-500 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <School size={30} className="text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-gray-900">Trường Mầm Non Hoa Sen</h2>
                <span className="bg-green-50 text-green-700 text-[11px] font-semibold px-2.5 py-1 rounded-full">Đang hoạt động</span>
              </div>
              <p className="text-sm text-gray-500 mt-1 truncate">123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh</p>
              <p className="text-xs text-gray-400 mt-1">Học kỳ 1 · 2024-2025</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:min-w-[520px]">
            <Stat label="Tổng số lớp" value={CLASSES.length} />
            <Stat label="Học sinh" value={totalStudents} />
            <Stat label="Sức chứa" value={totalCapacity} />
            <Stat label="Tỷ lệ lấp đầy" value={`${totalFillRate}%`} accent />
          </div>
        </div>
      </div>

      {/* Block selector */}
      <section>
        <div className="flex flex-col gap-1 mb-4">
          <h2 className="text-lg font-bold text-gray-900">Cơ cấu lớp học</h2>
          <p className="text-sm text-gray-500">Chọn một khối để xem danh sách lớp và thông tin chi tiết.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {blockStats.map(block => {
            const style = BLOCK_STYLES[block.name]
            const isSelected = selectedBlock === block.name
            const isFull = block.fillRate >= 100

            return (
              <button
                key={block.name}
                type="button"
                onClick={() => setSelectedBlock(isSelected ? 'Tất cả' : block.name)}
                className={`text-left bg-white rounded-2xl border p-5 shadow-sm transition-all group ${
                  isSelected
                    ? 'border-rose-300 ring-2 ring-rose-100 shadow-md'
                    : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-11 h-11 rounded-xl ${style.iconBg} flex items-center justify-center text-xl`}>
                    {style.icon}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${style.softBg} ${style.iconText}`}>
                    {block.classCount} lớp
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{block.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{block.students} học sinh · {block.capacity} chỗ</p>
                  </div>
                  <ChevronRight size={18} className={`text-gray-300 transition-transform ${isSelected ? 'rotate-90 text-rose-400' : 'group-hover:translate-x-0.5'}`} />
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-gray-400">Tỷ lệ lấp đầy</span>
                    <span className={`font-semibold ${isFull ? 'text-rose-600' : 'text-gray-700'}`}>{block.fillRate}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${isFull ? 'bg-rose-500' : block.fillRate >= 90 ? 'bg-amber-400' : 'bg-green-400'}`} style={{ width: `${Math.min(block.fillRate, 100)}%` }} />
                  </div>
                </div>

                <div className="mt-3 min-h-5">
                  {block.missingTeacher > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-rose-600 font-medium">
                      <AlertTriangle size={12} /> {block.missingTeacher} lớp chưa có GVCN
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-green-600 font-medium">
                      <Users size={12} /> Tất cả lớp đã có GVCN
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Class area */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 sm:px-6 border-b border-gray-100 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3 mr-auto">
            {showClassResults && selectedBlock !== 'Tất cả' && (
              <button
                type="button"
                onClick={() => setSelectedBlock('Tất cả')}
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                aria-label="Quay lại danh sách khối"
              >
                <ArrowLeft size={17} />
              </button>
            )}
            <div>
              <h2 className="font-bold text-gray-900">
                {selectedBlock === 'Tất cả' ? 'Danh sách lớp' : selectedBlock}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {selectedBlock === 'Tất cả'
                  ? 'Tìm kiếm lớp hoặc chọn khối ở phía trên để xem chi tiết.'
                  : `${selectedBlockStats?.classCount ?? 0} lớp · ${selectedBlockStats?.students ?? 0} học sinh`}
              </p>
            </div>
          </div>

          <div className="relative w-full lg:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm lớp, giáo viên, phòng..."
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400"
            />
          </div>
        </div>

        {!showClassResults ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
              <BookOpen size={23} />
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">Chọn một khối để xem lớp</h3>
            <p className="mt-1 text-sm text-gray-400 max-w-md mx-auto">
              Danh sách lớp được thu gọn theo từng khối để màn hình quản lý gọn hơn và dễ thao tác.
            </p>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center">
              <Search size={21} />
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">Không tìm thấy lớp</h3>
            <p className="mt-1 text-sm text-gray-400">Thử đổi từ khóa hoặc chọn một khối khác.</p>
          </div>
        ) : (
          <div className="max-h-[560px] overflow-y-auto pr-1 p-5 sm:p-6 grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredClasses.map(cls => {
              const fillRate = cls.capacity ? Math.round(cls.currentCount / cls.capacity * 100) : 0
              const isFull = fillRate >= 100
              const noTeacher = !cls.teacher
              const style = BLOCK_STYLES[cls.block]

              return (
                <div key={cls.id} className="group rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-11 h-11 rounded-xl ${style?.iconBg ?? 'bg-gray-100'} flex items-center justify-center text-lg shrink-0`}>
                        {style?.icon ?? '📚'}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{cls.name}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{cls.block} · Phòng {cls.room}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      noTeacher ? 'bg-rose-50 text-rose-600' : 'bg-green-50 text-green-700'
                    }`}>
                      {noTeacher ? 'Thiếu GVCN' : 'Hoạt động'}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Giáo viên chủ nhiệm</p>
                      {noTeacher ? (
                        <p className="mt-1 text-sm font-medium text-rose-600 flex items-center gap-1.5">
                          <AlertTriangle size={13} /> Chưa phân công
                        </p>
                      ) : (
                        <p className="mt-1 text-sm font-semibold text-gray-800 truncate">{cls.teacher}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Giáo viên phụ</p>
                      <p className="mt-1 text-sm font-medium text-gray-700 truncate">{cls.assistant || '—'}</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-50">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-gray-400">Sĩ số</span>
                      <span className={`font-semibold ${isFull ? 'text-rose-600' : 'text-gray-700'}`}>
                        {cls.currentCount}/{cls.capacity} · {fillRate}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${isFull ? 'bg-rose-500' : fillRate > 80 ? 'bg-amber-400' : 'bg-green-400'}`} style={{ width: `${Math.min(fillRate, 100)}%` }} />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    {isFull ? (
                      <span className="text-xs text-rose-500 font-medium flex items-center gap-1.5">
                        <AlertTriangle size={12} /> Đã đủ sĩ số
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Còn {Math.max(cls.capacity - cls.currentCount, 0)} chỗ trống</span>
                    )}
                    <button type="button" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-rose-600 transition-colors">
                      <Edit size={13} /> Chỉnh sửa
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {showClassResults && filteredClasses.length > 0 && (
          <div className="px-5 py-3 sm:px-6 border-t border-gray-100 text-xs text-gray-400">
            Hiển thị {filteredClasses.length}/{selectedBlock === 'Tất cả' ? CLASSES.length : selectedBlockStats?.classCount ?? CLASSES.length} lớp
          </div>
        )}
      </section>
    </div>
  )
}

function Stat({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="rounded-xl bg-gray-50 px-3 py-3">
      <p className={`text-xl font-bold ${accent ? 'text-rose-600' : 'text-gray-900'}`}>{value}</p>
      <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
    </div>
  )
}
