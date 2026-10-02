'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Clock, AlertTriangle, ChevronRight, RefreshCw, X, Check, Minus } from 'lucide-react'
import { CLASSES, STUDENTS } from '../../data'

// Demo data must be deterministic so the server and browser render the same HTML.
const CLASS_ATTENDANCE = CLASSES.map((cls, index) => {
  const presentRate = 0.88 + (index % 5) * 0.02
  const late = index % 3
  const excused = index % 2
  const present = Math.min(
    cls.currentCount - late,
    Math.round(cls.currentCount * presentRate)
  )

  return {
    ...cls,
    present,
    absent: Math.max(0, cls.currentCount - present - late),
    late,
    excused,
    done: index % 10 !== 7,
  }
})

const ACTIVITY_LOG = [
  { time: '07:45', teacher: 'Cô Nguyễn Thị Lan', action: 'Hoàn tất điểm danh', class: 'Mầm 1', detail: '22 có mặt, 0 vắng' },
  { time: '07:52', teacher: 'Cô Trần Ngọc Anh', action: 'Ghi nhận vắng có phép', class: 'Mầm 2', detail: 'Trần Gia Hân - vắng có phép' },
  { time: '08:01', teacher: 'Cô Lê Thị Hoa', action: 'Hoàn tất điểm danh', class: 'Chồi 1', detail: '25 có mặt, 1 đi muộn' },
  { time: '08:15', teacher: 'Hệ thống', action: 'Cảnh báo tự động', class: 'Chồi 2', detail: 'Chưa hoàn tất điểm danh sau 8:15', isWarning: true },
]

const LEAVE_REQUESTS = [
  { id: 'XN001', student: 'Trần Gia Hân', class: 'Mầm 1', parent: 'Trần Thị Mai', reason: 'Sốt nhẹ 37.5°C', dates: '18/11 - 19/11/2024', status: 'pending' },
  { id: 'XN002', student: 'Ngô Quốc Khánh', class: 'Chồi 3', parent: 'Ngô Thị Thanh', reason: 'Đi du lịch gia đình', dates: '20/11 - 22/11/2024', status: 'pending' },
  { id: 'XN003', student: 'Hoàng Gia Bảo', class: 'Chồi 2', parent: 'Hoàng Văn Minh', reason: 'Khám sức khỏe định kỳ', dates: '19/11/2024', status: 'approved' },
  { id: 'XN004', student: 'Đinh Tuấn Khang', class: 'Lá 2', parent: 'Đinh Thị Lan', reason: 'Họ hàng từ xa đến thăm', dates: '21/11/2024', status: 'pending' },
  { id: 'XN005', student: 'Phạm Ngọc Linh', class: 'Mầm 2', parent: 'Phạm Quốc Anh', reason: 'Tiêm phòng', dates: '18/11/2024', status: 'rejected' },
]

export default function DiemDanh() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'attendance' | 'leave' | 'log'>('attendance')
  const [filterBlock, setFilterBlock] = useState('Tất cả')
  const [updatingTime] = useState('vừa cập nhật')
  const [notice, setNotice] = useState('')
  const [leaveRequests, setLeaveRequests] = useState(LEAVE_REQUESTS)

  const totalPresent = CLASS_ATTENDANCE.reduce((s, c) => s + c.present, 0)
  const totalAbsent = CLASS_ATTENDANCE.reduce((s, c) => s + c.absent + c.excused, 0)
  const totalLate = CLASS_ATTENDANCE.reduce((s, c) => s + c.late, 0)
  const totalStudents = CLASS_ATTENDANCE.reduce((s, c) => s + c.currentCount, 0)
  const doneDanh = CLASS_ATTENDANCE.filter(c => c.done).length

  const filteredClasses = CLASS_ATTENDANCE.filter(c =>
    filterBlock === 'Tất cả' || c.block === filterBlock
  )

  const classDetail = selectedClass ? CLASS_ATTENDANCE.find(c => c.id === selectedClass) : null

  return (
    <div className="p-6 space-y-5">
      {notice && <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"><span>{notice}</span><button onClick={() => setNotice('')}><X size={15} /></button></div>}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Điểm danh hôm nay</h1>
          <p className="text-sm text-gray-500 mt-0.5">Thứ Hai, 18 tháng 11 năm 2024</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Cập nhật {updatingTime}
          </div>
          <button onClick={() => setNotice('Đã làm mới dữ liệu điểm danh.')} className="flex items-center gap-1.5 text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            <RefreshCw size={14} /> Làm mới
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Có mặt', value: totalPresent, color: 'green', pct: Math.round(totalPresent/totalStudents*100) },
          { label: 'Vắng', value: totalAbsent, color: 'rose', pct: Math.round(totalAbsent/totalStudents*100) },
          { label: 'Đi muộn', value: totalLate, color: 'amber', pct: null },
          { label: 'Đã điểm danh', value: `${doneDanh}/14`, color: 'indigo', pct: null },
          { label: 'Chờ duyệt đơn', value: leaveRequests.filter(r => r.status === 'pending').length, color: 'purple', pct: null },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className={`text-2xl font-bold ${
              stat.color === 'green' ? 'text-green-600' :
              stat.color === 'rose' ? 'text-rose-600' :
              stat.color === 'amber' ? 'text-amber-600' :
              stat.color === 'indigo' ? 'text-indigo-600' : 'text-purple-600'
            }`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            {stat.pct !== null && <p className="text-xs text-gray-400">{stat.pct}%</p>}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { id: 'attendance' as const, label: 'Tình trạng lớp' },
          { id: 'leave' as const, label: `Đơn xin nghỉ (${leaveRequests.filter(r => r.status === 'pending').length} chờ duyệt)` },
          { id: 'log' as const, label: 'Nhật ký hoạt động' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Attendance tab */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {['Tất cả', 'Khối Mầm', 'Khối Chồi', 'Khối Lá'].map(b => (
              <button
                key={b}
                onClick={() => setFilterBlock(b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterBlock === b ? 'bg-rose-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden max-h-[520px] overflow-auto">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Danh sách lớp</p>
              <p className="text-xs text-gray-400">Đã điểm danh {doneDanh}/14 lớp</p>
            </div>
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-gray-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Lớp</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">Sĩ số</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">Có mặt</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">Vắng</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">Đi muộn</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Tiến độ</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Trạng thái</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
                {filteredClasses.map(cls => {
                  const pct = Math.round(cls.present / cls.currentCount * 100)
                  return (
                    <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                            cls.block === 'Khối Mầm' ? 'bg-rose-100 text-rose-600' :
                            cls.block === 'Khối Chồi' ? 'bg-amber-100 text-amber-600' :
                            'bg-indigo-100 text-indigo-600'
                          }`}>{cls.name[0]}</div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{cls.name}</p>
                            <p className="text-xs text-gray-400">{cls.teacher || 'Chưa có GVCN'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center text-sm font-medium text-gray-800">{cls.currentCount}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-sm font-semibold text-green-600">{cls.present}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`text-sm font-semibold ${cls.absent + cls.excused > 0 ? 'text-rose-600' : 'text-gray-300'}`}>
                          {cls.absent + cls.excused}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`text-sm font-semibold ${cls.late > 0 ? 'text-amber-600' : 'text-gray-300'}`}>
                          {cls.late}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 w-28">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${pct >= 95 ? 'bg-green-400' : pct >= 80 ? 'bg-amber-400' : 'bg-rose-400'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-7">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        {cls.done ? (
                          <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                            <CheckCircle size={13} /> Hoàn tất
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                            <Clock size={13} /> Chưa xong
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => setSelectedClass(cls.id === selectedClass ? null : cls.id)}
                          className="text-xs text-rose-500 font-medium hover:underline"
                        >
                          {cls.id === selectedClass ? 'Đóng' : 'Xem'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Class detail panel */}
          {classDetail && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Chi tiết điểm danh · {classDetail.name}</h3>
                <button onClick={() => setSelectedClass(null)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {STUDENTS.filter(s => s.className === classDetail.name).map(student => (
                  <div key={student.id} className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                      student.attendance === 'Có mặt' ? 'bg-green-400' :
                      student.attendance === 'Vắng có phép' ? 'bg-amber-400' :
                      student.attendance === 'Vắng không phép' ? 'bg-rose-400' :
                      student.attendance === 'Đi muộn' ? 'bg-purple-400' : 'bg-gray-300'
                    }`} />
                    <p className="text-xs text-gray-700 truncate">{student.name}</p>
                  </div>
                ))}
                {/* Pad with unknowns if needed */}
                {Array.from({ length: Math.max(0, classDetail.currentCount - STUDENTS.filter(s => s.className === classDetail.name).length) }).map((_, i) => (
                  <div key={`pad-${i}`} className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-100">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <p className="text-xs text-gray-400">Học sinh {i + 1 + STUDENTS.filter(s => s.className === classDetail.name).length}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Có mặt</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Vắng phép</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400 inline-block" /> Vắng không phép</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400 inline-block" /> Đi muộn</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Leave requests tab */}
      {activeTab === 'leave' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">Đơn xin nghỉ · {leaveRequests.filter(r => r.status === 'pending').length} chờ duyệt</p>
          </div>
          <div className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
            {leaveRequests.map(req => (
              <div key={req.id} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-900">{req.student}</p>
                    <span className="text-xs text-gray-400">·</span>
                    <p className="text-sm text-gray-500">{req.class}</p>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">Phụ huynh: {req.parent}</p>
                  <p className="text-sm text-gray-700">Lý do: {req.reason}</p>
                  <p className="text-xs text-gray-400 mt-1">Ngày nghỉ: {req.dates}</p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  {req.status === 'pending' ? (
                    <>
                      <button onClick={() => { setLeaveRequests(p => p.map(x => x.id === req.id ? { ...x, status: 'approved' } : x)); setNotice(`Đã duyệt đơn nghỉ của ${req.student}.`) }} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors">
                        <Check size={13} /> Duyệt
                      </button>
                      <button onClick={() => { setLeaveRequests(p => p.map(x => x.id === req.id ? { ...x, status: 'rejected' } : x)); setNotice(`Đã từ chối đơn nghỉ của ${req.student}.`) }} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
                        <X size={13} /> Từ chối
                      </button>
                    </>
                  ) : (
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-600'
                    }`}>
                      {req.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity log tab */}
      {activeTab === 'log' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Nhật ký điểm danh hôm nay</h3>
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {ACTIVITY_LOG.map((log, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`shrink-0 mt-0.5 p-1.5 rounded-full ${log.isWarning ? 'bg-amber-100' : 'bg-green-100'}`}>
                  {log.isWarning ? <AlertTriangle size={12} className="text-amber-600" /> : <CheckCircle size={12} className="text-green-600" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-400">{log.time}</span>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                      log.isWarning ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                    }`}>{log.class}</span>
                  </div>
                  <p className="text-sm text-gray-800 mt-0.5">{log.teacher}: {log.action}</p>
                  <p className="text-xs text-gray-400">{log.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
