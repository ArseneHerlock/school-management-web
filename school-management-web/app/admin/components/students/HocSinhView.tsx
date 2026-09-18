'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { Search, Plus, Download, Upload, Filter, AlertTriangle, X, CheckCircle, ChevronRight, Users, GraduationCap, FileCheck2, Clock3, ArrowLeft, UserRound } from 'lucide-react'
import { STUDENTS, CLASSES, Student } from '../../data'

const TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'active', label: 'Đang học' },
  { id: 'pending', label: 'Chờ nhập học' },
  { id: 'incomplete', label: 'Hồ sơ chưa đủ' },
  { id: 'inactive', label: 'Đã nghỉ' },
]

const ATTENDANCE_COLORS: Record<string, { bg: string; text: string }> = {
  'Có mặt': { bg: 'bg-green-100', text: 'text-green-700' },
  'Vắng có phép': { bg: 'bg-amber-100', text: 'text-amber-700' },
  'Vắng không phép': { bg: 'bg-rose-100', text: 'text-rose-700' },
  'Đi muộn': { bg: 'bg-purple-100', text: 'text-purple-700' },
  'Chưa điểm danh': { bg: 'bg-gray-100', text: 'text-gray-500' },
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  'Đang học': { bg: 'bg-green-100', text: 'text-green-700' },
  'Chờ nhập học': { bg: 'bg-amber-100', text: 'text-amber-700' },
  'Đã nghỉ': { bg: 'bg-gray-100', text: 'text-gray-500' },
  'Chuyển lớp': { bg: 'bg-blue-100', text: 'text-blue-700' },
}

const BLOCK_META: Record<string, { icon: string; description: string }> = {
  'Khối Mầm': { icon: '🌸', description: 'Nhóm trẻ 3 tuổi' },
  'Khối Chồi': { icon: '🌼', description: 'Nhóm trẻ 4 tuổi' },
  'Khối Lá': { icon: '🌱', description: 'Nhóm trẻ 5 tuổi' },
}

const ENROLLMENT_STEPS = ['Thông tin học sinh', 'Thông tin phụ huynh', 'Hồ sơ sức khỏe', 'Chọn lớp', 'Xác nhận']

type ViewMode = 'blocks' | 'classes' | 'students'

export default function HocSinh() {
  const [viewMode, setViewMode] = useState<ViewMode>('blocks')
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null)
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetail, setShowDetail] = useState<Student | null>(null)
  const [enrollStep, setEnrollStep] = useState(0)

  const stats = useMemo(() => ({
    total: STUDENTS.length,
    active: STUDENTS.filter(s => s.status === 'Đang học').length,
    pending: STUDENTS.filter(s => s.status === 'Chờ nhập học').length,
    incomplete: STUDENTS.filter(s => s.profileComplete < 100).length,
  }), [])

  const blockSummary = useMemo(() => {
    return ['Khối Mầm', 'Khối Chồi', 'Khối Lá'].map(block => {
      const students = STUDENTS.filter(s => s.block === block)
      const classes = CLASSES.filter(c => c.block === block)
      return {
        block,
        students: students.length,
        active: students.filter(s => s.status === 'Đang học').length,
        classes: classes.length,
        capacity: classes.reduce((sum, c) => sum + c.capacity, 0),
      }
    })
  }, [])

  const classSummary = useMemo(() => {
    if (!selectedBlock) return []
    return CLASSES.filter(c => c.block === selectedBlock).map(c => ({
      ...c,
      students: STUDENTS.filter(s => s.className === c.name),
    }))
  }, [selectedBlock])

  const filtered = useMemo(() => {
    return STUDENTS.filter(s => {
      const matchTab = activeTab === 'all' ||
        (activeTab === 'active' && s.status === 'Đang học') ||
        (activeTab === 'pending' && s.status === 'Chờ nhập học') ||
        (activeTab === 'incomplete' && s.profileComplete < 100) ||
        (activeTab === 'inactive' && s.status === 'Đã nghỉ')
      const q = search.trim().toLowerCase()
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.parentName.toLowerCase().includes(q)
      const matchBlock = !selectedBlock || s.block === selectedBlock
      const matchClass = !selectedClass || s.className === selectedClass
      return matchTab && matchSearch && matchBlock && matchClass
    })
  }, [activeTab, search, selectedBlock, selectedClass])

  const getAge = (dob: string) => {
    const d = new Date(dob)
    const now = new Date()
    let age = now.getFullYear() - d.getFullYear()
    if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--
    return age
  }

  const openBlock = (block: string) => {
    setSelectedBlock(block)
    setSelectedClass(null)
    setSearch('')
    setViewMode('classes')
  }

  const openClass = (className: string) => {
    setSelectedClass(className)
    setSearch('')
    setViewMode('students')
  }

  const goBack = () => {
    if (viewMode === 'students') {
      setSelectedClass(null)
      setSearch('')
      setViewMode('classes')
    } else if (viewMode === 'classes') {
      setSelectedBlock(null)
      setSearch('')
      setViewMode('blocks')
    }
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1.5">
            {viewMode !== 'blocks' && <button onClick={() => { setSelectedBlock(null); setSelectedClass(null); setViewMode('blocks') }} className="hover:text-rose-500">Học sinh</button>}
            {viewMode !== 'blocks' && <ChevronRight size={12} />}
            {viewMode === 'classes' && <span>{selectedBlock}</span>}
            {viewMode === 'students' && <><button onClick={goBack} className="hover:text-rose-500">{selectedBlock}</button><ChevronRight size={12} /><span>{selectedClass}</span></>}
          </div>
          <div className="flex items-center gap-3">
            {viewMode !== 'blocks' && <button onClick={goBack} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"><ArrowLeft size={17} /></button>}
            <div>
              <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {viewMode === 'blocks' ? 'Học sinh' : viewMode === 'classes' ? selectedBlock : selectedClass}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {viewMode === 'blocks' ? 'Quản lý học sinh theo khối, lớp và hồ sơ' : viewMode === 'classes' ? 'Chọn lớp để xem danh sách học sinh' : 'Danh sách học sinh và thông tin hồ sơ'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button className="flex items-center gap-2 text-gray-600 border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"><Upload size={15} /> Nhập Excel</button>
          <button className="flex items-center gap-2 text-gray-600 border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"><Download size={15} /> Xuất danh sách</button>
          <button onClick={() => { setShowAddModal(true); setEnrollStep(0) }} className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-600"><Plus size={15} /> Thêm học sinh</button>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<Users size={18} />} label="Tổng học sinh" value={stats.total} detail={`${blockSummary.reduce((sum, b) => sum + b.classes, 0)} lớp`} />
        <StatCard icon={<GraduationCap size={18} />} label="Đang học" value={stats.active} detail={`${stats.total ? Math.round(stats.active / stats.total * 100) : 0}% tổng số`} />
        <StatCard icon={<Clock3 size={18} />} label="Chờ nhập học" value={stats.pending} detail="Cần xử lý hồ sơ" />
        <StatCard icon={<FileCheck2 size={18} />} label="Hồ sơ chưa đủ" value={stats.incomplete} detail="Cần bổ sung thông tin" />
      </div>

      {/* Block view */}
      {viewMode === 'blocks' && (
        <section className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Chọn khối</h2>
              <p className="text-xs text-gray-400 mt-0.5">Bắt đầu từ khối để thu gọn danh sách và tìm học sinh nhanh hơn</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {blockSummary.map(item => {
              const meta = BLOCK_META[item.block]
              const fill = item.capacity ? Math.round(item.students / item.capacity * 100) : 0
              return (
                <button key={item.block} onClick={() => openBlock(item.block)} className="text-left bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-rose-200 transition-all group">
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center text-xl">{meta.icon}</div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-gray-400 group-hover:text-rose-500">Xem lớp <ChevronRight size={14} /></div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-4">{item.block}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{meta.description}</p>
                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <Metric label="Học sinh" value={item.students} />
                    <Metric label="Lớp" value={item.classes} />
                  </div>
                  <div className="mt-5">
                    <div className="flex justify-between text-xs mb-1.5"><span className="text-gray-500">Sĩ số / sức chứa</span><span className="font-semibold text-gray-700">{item.students}/{item.capacity}</span></div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-rose-400 rounded-full" style={{ width: `${Math.min(fill, 100)}%` }} /></div>
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* Classes inside selected block */}
      {viewMode === 'classes' && (
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative w-full md:max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm lớp..." className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400" />
            </div>
            <div className="text-sm text-gray-500">{classSummary.length} lớp · {classSummary.reduce((sum, c) => sum + c.students.length, 0)} học sinh</div>
          </div>
          <div className="max-h-[560px] overflow-y-auto pr-1 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {classSummary.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(cls => {
              const fill = cls.capacity ? Math.round(cls.currentCount / cls.capacity * 100) : 0
              const hasTeacher = Boolean(cls.teacher)
              return (
                <button key={cls.id} onClick={() => openClass(cls.name)} className="text-left bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-rose-200 transition-all group">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-400" /><h3 className="font-bold text-gray-900">{cls.name}</h3></div>
                      <p className="text-xs text-gray-400 mt-1">{cls.room}</p>
                    </div>
                    <ChevronRight size={17} className="text-gray-300 group-hover:text-rose-500" />
                  </div>
                  <div className="mt-5 flex items-end justify-between"><div><p className="text-2xl font-bold text-gray-900">{cls.currentCount}</p><p className="text-xs text-gray-400">/ {cls.capacity} học sinh</p></div><span className={`text-xs font-semibold px-2 py-1 rounded-full ${fill >= 100 ? 'bg-rose-100 text-rose-600' : fill >= 90 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{fill}%</span></div>
                  <div className="h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden"><div className={`h-full rounded-full ${fill >= 100 ? 'bg-rose-400' : fill >= 90 ? 'bg-amber-400' : 'bg-green-400'}`} style={{ width: `${Math.min(fill, 100)}%` }} /></div>
                  <div className="mt-4 pt-4 border-t border-gray-50 space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-gray-400">GVCN</span><span className={`font-medium ${hasTeacher ? 'text-gray-700' : 'text-rose-500'}`}>{cls.teacher || 'Chưa phân công'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">GV phụ</span><span className="font-medium text-gray-700">{cls.assistant || '—'}</span></div>
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* Students inside selected class */}
      {viewMode === 'students' && (
        <section className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-fit overflow-x-auto">
              {TABS.map(tab => {
                const count = tab.id === 'all' ? filtered.length : STUDENTS.filter(s => {
                  const sameClass = s.className === selectedClass
                  if (tab.id === 'active') return sameClass && s.status === 'Đang học'
                  if (tab.id === 'pending') return sameClass && s.status === 'Chờ nhập học'
                  if (tab.id === 'incomplete') return sameClass && s.profileComplete < 100
                  if (tab.id === 'inactive') return sameClass && s.status === 'Đã nghỉ'
                  return sameClass
                }).length
                return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{tab.label}<span className={`px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-rose-100 text-rose-600' : 'bg-gray-200 text-gray-500'}`}>{count}</span></button>
              })}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tên, mã HS, phụ huynh..." className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400" /></div>
              <button className="flex items-center gap-2 text-gray-600 border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"><Filter size={14} /> Lọc</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between"><div><h2 className="font-bold text-gray-900">Danh sách học sinh</h2><p className="text-xs text-gray-400 mt-0.5">{filtered.length} học sinh phù hợp</p></div><div className="text-xs text-gray-400">{selectedBlock} · {selectedClass}</div></div>
            <div className="max-h-[520px] overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-white"><tr className="border-b border-gray-100 bg-gray-50/60"><th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Học sinh</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Tuổi</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Phụ huynh</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Hồ sơ</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Điểm danh</th><th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Trạng thái</th><th className="px-4 py-3" /></tr></thead>
                <tbody className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
                  {filtered.map(student => {
                    const att = ATTENDANCE_COLORS[student.attendance]
                    const sta = STATUS_COLORS[student.status]
                    return <tr key={student.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${student.gender === 'Nam' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>{student.name.split(' ').pop()?.charAt(0)}</div><div><p className="text-sm font-medium text-gray-900">{student.name}</p><p className="text-xs text-gray-400">{student.id} · {student.gender}</p></div>{student.allergies?.length ? <span title={`Dị ứng: ${student.allergies.join(', ')}`} className="text-amber-500"><AlertTriangle size={14} /></span> : null}</div></td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{getAge(student.dob)} tuổi</td>
                      <td className="px-4 py-3.5"><p className="text-sm text-gray-800">{student.parentName}</p><p className="text-xs text-gray-400">{student.parentPhone}</p></td>
                      <td className="px-4 py-3.5"><div className="flex items-center gap-2"><div className="bg-gray-100 rounded-full h-1.5 w-16"><div className={`h-1.5 rounded-full ${student.profileComplete === 100 ? 'bg-green-400' : student.profileComplete >= 70 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${student.profileComplete}%` }} /></div><span className="text-xs font-medium text-gray-500">{student.profileComplete}%</span></div></td>
                      <td className="px-4 py-3.5"><span className={`text-xs font-medium px-2 py-1 rounded-full ${att.bg} ${att.text}`}>{student.attendance}</span></td>
                      <td className="px-4 py-3.5"><span className={`text-xs font-medium px-2 py-1 rounded-full ${sta.bg} ${sta.text}`}>{student.status}</span></td>
                      <td className="px-4 py-3.5"><button onClick={() => setShowDetail(student)} className="flex items-center gap-1 text-xs text-rose-500 font-medium hover:underline">Chi tiết <ChevronRight size={12} /></button></td>
                    </tr>
                  })}
                </tbody>
              </table>
            </div>
            {!filtered.length && <EmptyState />}
            <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400">Hiển thị {filtered.length}/{STUDENTS.filter(s => s.className === selectedClass).length} học sinh của lớp</div>
          </div>
        </section>
      )}

      <AddStudentModal show={showAddModal} step={enrollStep} setStep={setEnrollStep} onClose={() => setShowAddModal(false)} />

      {showDetail && <StudentDetail student={showDetail} onClose={() => setShowDetail(null)} getAge={getAge} />}
    </div>
  )
}

function StatCard({ icon, label, value, detail }: { icon: ReactNode; label: string; value: number; detail: string }) {
  return <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"><div className="flex items-center justify-between"><div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">{icon}</div><span className="text-2xl font-bold text-gray-900">{value}</span></div><p className="text-sm font-medium text-gray-700 mt-3">{label}</p><p className="text-xs text-gray-400 mt-0.5">{detail}</p></div>
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div><p className="text-xl font-bold text-gray-900">{value}</p><p className="text-xs text-gray-400">{label}</p></div>
}

function EmptyState() {
  return <div className="py-14 text-center"><div className="w-11 h-11 rounded-full bg-gray-100 mx-auto flex items-center justify-center text-gray-400"><Search size={18} /></div><p className="text-sm font-medium text-gray-700 mt-3">Không tìm thấy học sinh</p><p className="text-xs text-gray-400 mt-1">Thử thay đổi từ khóa hoặc bộ lọc.</p></div>
}

function AddStudentModal({ show, step, setStep, onClose }: { show: boolean; step: number; setStep: (n: number) => void; onClose: () => void }) {
  if (!show) return null
  return <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"><div className="flex items-center justify-between p-6 border-b border-gray-100"><div><h3 className="font-bold text-gray-900">Thêm học sinh mới</h3><p className="text-xs text-gray-400 mt-0.5">Bước {step + 1}/{ENROLLMENT_STEPS.length}: {ENROLLMENT_STEPS[step]}</p></div><button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"><X size={18} /></button></div><div className="px-6 pt-5"><div className="flex items-center gap-2">{ENROLLMENT_STEPS.map((s, i) => <div key={s} className="flex items-center gap-2 flex-1"><div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-400'}`}>{i < step ? <CheckCircle size={14} /> : i + 1}</div><span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-rose-600' : i < step ? 'text-green-600' : 'text-gray-400'}`}>{s}</span>{i < ENROLLMENT_STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-green-300' : 'bg-gray-100'}`} />}</div>)}</div></div><div className="p-6 pt-5">{step === 0 && <FormGrid fields={['Họ và tên *|Nguyễn Văn An','Ngày sinh *|','Giới tính *|Nam','Dân tộc|Kinh','Nơi sinh|TP. Hồ Chí Minh']} />} {step === 1 && <FormGrid fields={['Tên phụ huynh *|Nguyễn Văn Bình','Mối quan hệ *|Bố','Số điện thoại *|0901 234 567','Email|email@example.com']} />} {step === 2 && <FormGrid fields={['Nhóm máu|O','Cân nặng (kg)|14.5','Chiều cao (cm)|98','Dị ứng|Hải sản, Đậu phộng...']} />} {step === 3 && <div className="grid grid-cols-2 gap-4"><SelectField label="Khối *" options={['Khối Mầm (3 tuổi)','Khối Chồi (4 tuổi)','Khối Lá (5 tuổi)']} /><SelectField label="Lớp *" options={CLASSES.filter(c => c.block === 'Khối Mầm').map(c => `${c.name} (${c.currentCount}/${c.capacity})`)} /></div>} {step === 4 && <div className="space-y-3">{['Thông tin học sinh','Phụ huynh','Hồ sơ sức khỏe','Lớp được phân vào'].map((label, i) => <div key={label} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"><CheckCircle size={16} className="text-green-500 mt-0.5" /><div><p className="text-xs font-semibold text-gray-600">{label}</p><p className="text-sm text-gray-800">Đã kiểm tra thông tin mẫu</p></div></div>)}</div>}</div><div className="flex items-center justify-between px-6 pb-6"><button onClick={() => step > 0 ? setStep(step - 1) : onClose()} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">{step === 0 ? 'Hủy' : 'Quay lại'}</button><button onClick={() => step < ENROLLMENT_STEPS.length - 1 ? setStep(step + 1) : onClose()} className="px-6 py-2 rounded-lg text-sm font-medium bg-rose-500 text-white hover:bg-rose-600">{step === ENROLLMENT_STEPS.length - 1 ? 'Xác nhận nhập học' : 'Tiếp tục'}</button></div></div></div>
}

function FormGrid({ fields }: { fields: string[] }) {
  return <div className="grid grid-cols-2 gap-4">{fields.map((item, i) => { const [label, placeholder] = item.split('|'); return <div key={label} className={i === 0 && fields.length === 5 ? 'col-span-2' : ''}><label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label><input placeholder={placeholder} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400" /></div> })}</div>
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  return <div><label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label><select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20">{options.map(o => <option key={o}>{o}</option>)}</select></div>
}

function StudentDetail({ student, onClose, getAge }: { student: Student; onClose: () => void; getAge: (dob: string) => number }) {
  const sta = STATUS_COLORS[student.status]
  const att = ATTENDANCE_COLORS[student.attendance]
  return <div className="fixed inset-0 bg-black/40 flex items-center justify-end z-50"><div className="bg-white w-full max-w-md h-full overflow-y-auto"><div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between"><h3 className="font-bold text-gray-900">Hồ sơ học sinh</h3><button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"><X size={18} /></button></div><div className="p-5 space-y-5"><div className="flex items-start gap-4"><div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold ${student.gender === 'Nam' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>{student.name.split(' ').pop()?.charAt(0)}</div><div className="flex-1"><h4 className="font-bold text-gray-900 text-lg">{student.name}</h4><p className="text-sm text-gray-500">{student.id} · {student.className} · {student.block}</p><p className="text-xs text-gray-400 mt-1">{getAge(student.dob)} tuổi · {student.gender}</p><div className="flex items-center gap-2 mt-2"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sta.bg} ${sta.text}`}>{student.status}</span><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${att.bg} ${att.text}`}>{student.attendance}</span></div></div></div><div className="bg-gray-50 rounded-xl p-4"><div className="flex items-center justify-between mb-2"><p className="text-sm font-medium text-gray-700">Hồ sơ hoàn thiện</p><span className={`text-sm font-bold ${student.profileComplete < 100 ? 'text-amber-600' : 'text-green-600'}`}>{student.profileComplete}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className={`h-2 rounded-full ${student.profileComplete === 100 ? 'bg-green-400' : 'bg-amber-400'}`} style={{ width: `${student.profileComplete}%` }} /></div></div><DetailSection title="Thông tin cá nhân"><InfoRow label="Ngày sinh" value={new Date(student.dob).toLocaleDateString('vi-VN')} /><InfoRow label="Giới tính" value={student.gender} /><InfoRow label="Khối" value={student.block} /><InfoRow label="Lớp" value={student.className} /></DetailSection><DetailSection title="Thông tin phụ huynh"><InfoRow label="Tên phụ huynh" value={student.parentName} /><InfoRow label="Số điện thoại" value={student.parentPhone} /></DetailSection>{student.allergies?.length ? <div className="bg-amber-50 border border-amber-200 rounded-xl p-4"><div className="flex items-start gap-2"><AlertTriangle size={16} className="text-amber-600 mt-0.5" /><div><p className="text-sm font-semibold text-amber-800">Dị ứng cần lưu ý</p><p className="text-sm text-amber-700 mt-0.5">{student.allergies.join(', ')}</p></div></div></div> : null}<DetailSection title="Điểm danh gần đây">{['Th2 18/11','Th6 15/11','Th5 14/11','Th4 13/11'].map((day, i) => <div key={day} className="flex items-center justify-between py-1.5"><span className="text-sm text-gray-600">{day}</span><span className={`text-xs px-2 py-0.5 rounded-full ${i === 1 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{i === 1 ? 'Vắng có phép' : 'Có mặt'}</span></div>)}</DetailSection></div></div></div>
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) { return <div className="bg-white border border-gray-100 rounded-xl p-4"><h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{title}</h4><div className="space-y-2">{children}</div></div> }
function InfoRow({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between gap-4"><span className="text-sm text-gray-500">{label}</span><span className="text-sm font-medium text-gray-800 text-right">{value}</span></div> }
