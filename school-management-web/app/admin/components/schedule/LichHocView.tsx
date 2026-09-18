'use client'

import { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, X, AlertCircle, Clock } from 'lucide-react'

const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
const HOURS = [7, 8, 9, 10, 11, 11.5, 12, 14, 15, 16]
const HOUR_LABELS: Record<number, string> = {
  7: '07:00', 8: '08:00', 9: '09:00', 10: '10:00', 11: '11:00',
  11.5: '11:30', 12: '12:00', 14: '14:00', 15: '15:00', 16: '16:00'
}

const EVENT_TYPE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  'Học tập': { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700' },
  'Ăn': { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700' },
  'Ngủ': { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-700' },
  'Vui chơi': { bg: 'bg-pink-50', border: 'border-pink-300', text: 'text-pink-700' },
  'Hoạt động ngoài trời': { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700' },
  'Sinh hoạt': { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-700' },
  'Sự kiện': { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-700' },
  'conflict': { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-700' },
}

const SCHEDULE = [
  { id: 1, title: 'Đón trẻ', class: 'Toàn trường', day: 0, startHour: 7, duration: 0.5, type: 'Sinh hoạt' },
  { id: 2, title: 'Hoạt động học tập', class: 'Mầm 1', day: 0, startHour: 7.5, duration: 1, type: 'Học tập' },
  { id: 3, title: 'Bữa ăn sáng', class: 'Khối Mầm', day: 0, startHour: 8.5, duration: 0.5, type: 'Ăn' },
  { id: 4, title: 'Hoạt động ngoài trời', class: 'Chồi 1', day: 0, startHour: 9, duration: 1, type: 'Hoạt động ngoài trời', conflict: true, conflictMsg: 'Sân trường có 5 lớp cùng sử dụng lúc 09:00. Sức chứa có thể vượt giới hạn.' },
  { id: 5, title: 'Hoạt động ngoài trời', class: 'Chồi 2', day: 0, startHour: 9, duration: 1, type: 'Hoạt động ngoài trời', conflict: true, conflictMsg: 'Sân trường có 5 lớp cùng sử dụng lúc 09:00.' },
  { id: 6, title: 'Bữa trưa', class: 'Toàn trường', day: 0, startHour: 11, duration: 0.5, type: 'Ăn' },
  { id: 7, title: 'Giờ ngủ trưa', class: 'Toàn trường', day: 0, startHour: 11.5, duration: 2, type: 'Ngủ' },
  { id: 8, title: 'Hoạt động chiều', class: 'Khối Lá', day: 0, startHour: 14, duration: 1.5, type: 'Học tập' },
  { id: 9, title: 'Vui chơi tự do', class: 'Toàn trường', day: 0, startHour: 15.5, duration: 0.5, type: 'Vui chơi' },
  { id: 10, title: 'Hoạt động học tập', class: 'Lá 1', day: 1, startHour: 7.5, duration: 2, type: 'Học tập' },
  { id: 11, title: 'Tiếng Anh', class: 'Khối Lá', day: 1, startHour: 9, duration: 1, type: 'Học tập' },
  { id: 12, title: 'Hội thi bé khéo tay', class: 'Toàn trường', day: 4, startHour: 8, duration: 3, type: 'Sự kiện' },
]

export default function LichHoc() {
  const [view, setView] = useState<'week' | 'day'>('week')
  const [filterClass, setFilterClass] = useState('Tất cả')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createStep, setCreateStep] = useState(0)
  const [conflictFound, setConflictFound] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<typeof SCHEDULE[0] | null>(null)

  const hourToPixels = (h: number) => {
    const base = 7
    return (h - base) * 60
  }

  const conflicts = SCHEDULE.filter(e => e.conflict)

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Lịch học & Điều phối</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tuần 12 · 18 - 23 tháng 11, 2024</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {(['week', 'day'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  view === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                {v === 'week' ? 'Tuần' : 'Ngày'}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setShowCreateModal(true); setCreateStep(0); setConflictFound(false) }}
            className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors"
          >
            <Plus size={15} /> Tạo lịch
          </button>
        </div>
      </div>

      {/* Conflict alert */}
      {conflicts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">{conflicts.length} xung đột lịch phát hiện</p>
            <p className="text-xs text-amber-700 mt-0.5">Sân trường có 5 lớp cùng sử dụng lúc 09:00 - 10:00 ngày Thứ 2. Sức chứa dự kiến vượt giới hạn.</p>
          </div>
          <button className="text-xs text-amber-700 font-medium underline hover:no-underline shrink-0">Giải quyết</button>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"><ChevronLeft size={16} /></button>
          <span className="text-sm font-medium text-gray-700">18 - 23 tháng 11</span>
          <button className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"><ChevronRight size={16} /></button>
        </div>
        <select
          value={filterClass}
          onChange={e => setFilterClass(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-gray-700"
        >
          <option>Tất cả</option>
          <option>Mầm 1</option>
          <option>Chồi 1</option>
          <option>Lá 1</option>
          <option>Toàn trường</option>
        </select>

        {/* Legend */}
        <div className="flex items-center gap-3 ml-auto flex-wrap">
          {Object.entries(EVENT_TYPE_COLORS).filter(([k]) => k !== 'conflict').map(([type, colors]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded ${colors.bg} border ${colors.border}`} />
              <span className="text-xs text-gray-500">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Calendar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b border-gray-100">
          <div className="px-3 py-3 text-xs text-gray-400 font-medium">Giờ</div>
          {DAYS.map((day, i) => (
            <div key={i} className={`px-3 py-3 text-center text-sm font-semibold border-l border-gray-100 ${i === 0 ? 'text-rose-600 bg-rose-50' : 'text-gray-700'}`}>
              {day}
              <div className="text-xs font-normal text-gray-400 mt-0.5">{18 + i}/11</div>
            </div>
          ))}
        </div>

        <div className="relative overflow-x-auto">
          <div className="grid grid-cols-7 min-h-96" style={{ position: 'relative' }}>
            {/* Time labels */}
            <div className="border-r border-gray-100">
              {HOURS.map(h => (
                <div key={h} className="text-xs text-gray-400 px-3 py-1 border-b border-gray-50" style={{ height: '60px', display: 'flex', alignItems: 'flex-start', paddingTop: '4px' }}>
                  {HOUR_LABELS[h]}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {DAYS.map((day, dayIndex) => {
              const dayEvents = SCHEDULE.filter(e => e.day === dayIndex)
              return (
                <div key={dayIndex} className={`border-l border-gray-100 relative ${dayIndex === 0 ? 'bg-rose-50/30' : ''}`}>
                  {/* Hour lines */}
                  {HOURS.map(h => (
                    <div key={h} className="border-b border-gray-50" style={{ height: '60px' }} />
                  ))}
                  {/* Events */}
                  {dayEvents.map(event => {
                    const colors = event.conflict ? EVENT_TYPE_COLORS['conflict'] : (EVENT_TYPE_COLORS[event.type] || EVENT_TYPE_COLORS['Sinh hoạt'])
                    const topPx = (event.startHour - 7) * 60
                    const heightPx = event.duration * 60 - 2
                    return (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event === selectedEvent ? null : event)}
                        className={`absolute left-1 right-1 rounded-md border px-1.5 py-1 cursor-pointer hover:shadow-sm transition-shadow ${colors.bg} ${colors.border} ${event.conflict ? 'border-2' : ''}`}
                        style={{ top: `${topPx}px`, height: `${heightPx}px`, zIndex: 10 }}
                        title={event.title}
                      >
                        <p className={`text-xs font-semibold leading-tight truncate ${colors.text}`}>{event.title}</p>
                        <p className="text-xs opacity-70 truncate">{event.class}</p>
                        {event.conflict && (
                          <div className="flex items-center gap-0.5 mt-0.5">
                            <AlertTriangle size={10} className="text-rose-500" />
                            <span className="text-xs text-rose-500 font-medium">Xung đột</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>

        {/* Selected event detail */}
        {selectedEvent && (
          <div className={`border-t p-4 flex items-start gap-4 ${selectedEvent.conflict ? 'bg-rose-50 border-rose-200' : 'bg-gray-50 border-gray-100'}`}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {selectedEvent.conflict ? (
                  <AlertCircle size={16} className="text-rose-500" />
                ) : (
                  <CheckCircle size={16} className="text-green-500" />
                )}
                <p className="font-semibold text-gray-900">{selectedEvent.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selectedEvent.conflict ? 'bg-rose-100 text-rose-600' : 'bg-green-100 text-green-600'}`}>
                  {selectedEvent.conflict ? 'Xung đột' : 'Bình thường'}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <span>Lớp: {selectedEvent.class}</span>
                <span>Giờ: {HOUR_LABELS[selectedEvent.startHour]} - {HOUR_LABELS[selectedEvent.startHour + selectedEvent.duration] || `${selectedEvent.startHour + selectedEvent.duration}:00`}</span>
                <span>Loại: {selectedEvent.type}</span>
              </div>
              {selectedEvent.conflict && selectedEvent.conflictMsg && (
                <div className="mt-2 p-2.5 bg-white border border-rose-200 rounded-lg">
                  <p className="text-xs text-rose-700 font-medium">{selectedEvent.conflictMsg}</p>
                  <p className="text-xs text-rose-500 mt-1">Đề xuất: Chuyển sang khung 10:00 - 11:00 (còn trống cho 3 lớp)</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              {selectedEvent.conflict && (
                <button className="text-xs px-3 py-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 font-medium transition-colors">
                  Đổi lịch
                </button>
              )}
              <button onClick={() => setSelectedEvent(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-white"><X size={14} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Create schedule modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Tạo lịch hoạt động mới</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Lớp *</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20">
                    <option>Chọn lớp</option>
                    <option>Mầm 1</option><option>Mầm 2</option>
                    <option>Chồi 1</option><option>Chồi 2</option>
                    <option>Lá 1</option><option>Lá 2</option>
                    <option>Toàn trường</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Loại hoạt động *</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20">
                    <option>Học tập</option><option>Ăn</option><option>Ngủ</option>
                    <option>Vui chơi</option><option>Hoạt động ngoài trời</option>
                    <option>Sinh hoạt</option><option>Sự kiện</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Giáo viên *</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20">
                    <option>Cô Nguyễn Thị Lan</option>
                    <option>Cô Trần Ngọc Anh</option>
                    <option>Cô Lê Thị Hoa</option>
                    <option>Cô Hoàng Thị Linh</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Phòng / Khu vực *</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20">
                    <option>Phòng 101</option><option>Phòng 201</option>
                    <option>Phòng 301</option><option>Sân trường</option>
                    <option>Hội trường</option><option>Phòng ăn</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Ngày *</label>
                  <input type="date" defaultValue="2024-11-18" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Khung giờ *</label>
                  <div className="flex gap-2">
                    <select className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none">
                      <option>09:00</option><option>10:00</option><option>11:00</option>
                    </select>
                    <span className="self-center text-gray-400 text-xs">đến</span>
                    <select className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none">
                      <option>10:00</option><option>11:00</option><option>12:00</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setConflictFound(true)}
                className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-rose-300 hover:text-rose-600 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle size={15} /> Kiểm tra xung đột
              </button>

              {conflictFound && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={15} className="text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Phát hiện 2 vấn đề</p>
                      <ul className="text-xs text-amber-700 mt-1 space-y-1">
                        <li>· Khung giờ này có 5 lớp cùng sử dụng Sân trường. Sức chứa vượt giới hạn (tối đa 3 lớp cùng lúc).</li>
                        <li>· Giáo viên Nguyễn Thị Lan đang được phân công tại Mầm 1 cùng khung giờ này.</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-white border border-amber-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Đề xuất khung giờ thay thế:</p>
                    <div className="flex gap-2">
                      {['10:30 - 11:30', '14:00 - 15:00'].map(slot => (
                        <button key={slot} className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors">
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-6 pb-6">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                Hủy
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                disabled={conflictFound}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                  conflictFound ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-rose-500 text-white hover:bg-rose-600'
                }`}
              >
                {conflictFound ? 'Xử lý xung đột trước' : 'Lưu lịch'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
