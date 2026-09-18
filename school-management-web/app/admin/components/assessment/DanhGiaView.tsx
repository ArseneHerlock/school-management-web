'use client'

import { useMemo, useState } from 'react'
import { Search, TrendingUp, ClipboardCheck, BarChart3, Users, ChevronRight, ChevronDown, CheckCircle2 } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { DEVELOPMENT_CRITERIA } from '../../data'

const CRITERIA_GROUPS = [
  { name: 'Phát triển thể chất', criteria: ['Chiều cao, cân nặng phù hợp tuổi', 'Vận động thô', 'Vận động tinh', 'Tự chăm sóc bản thân'] },
  { name: 'Nhận thức', criteria: ['Nhận biết màu sắc, hình dạng', 'Phân biệt số lượng', 'Hiểu biết về thế giới xung quanh', 'Ghi nhớ và tập trung'] },
  { name: 'Ngôn ngữ', criteria: ['Vốn từ vựng', 'Phát âm rõ ràng', 'Kể chuyện, diễn đạt ý', 'Hiểu và làm theo hướng dẫn'] },
  { name: 'Tình cảm & Xã hội', criteria: ['Giao tiếp với bạn bè', 'Hợp tác trong nhóm', 'Tự điều chỉnh cảm xúc', 'Tôn trọng người khác'] },
]

const PROGRESS_DATA = [
  { month: 'T9', score: 62 }, { month: 'T10', score: 70 }, { month: 'T11', score: 78 },
]

const STUDENT_EVALUATIONS = [
  { id: 'HS006', name: 'Đặng Minh Khôi', class: 'Lá 1', lastEval: '01/11/2024', overallScore: 88, status: 'Tốt', completion: 100, teacher: 'Cô Nguyễn Thị Lan' },
  { id: 'HS007', name: 'Vũ Bảo Châu', class: 'Lá 1', lastEval: '01/11/2024', overallScore: 82, status: 'Tốt', completion: 100, teacher: 'Cô Nguyễn Thị Lan' },
  { id: 'HS010', name: 'Đinh Tuấn Khang', class: 'Lá 2', lastEval: '01/11/2024', overallScore: 91, status: 'Xuất sắc', completion: 100, teacher: 'Cô Trần Ngọc Anh' },
  { id: 'HS003', name: 'Lê Hoàng Nam', class: 'Chồi 1', lastEval: '01/11/2024', overallScore: 74, status: 'Đang đạt', completion: 92, teacher: 'Cô Lê Thị Hoa' },
  { id: 'HS005', name: 'Hoàng Gia Bảo', class: 'Chồi 2', lastEval: '01/11/2024', overallScore: 68, status: 'Đang đạt', completion: 84, teacher: 'Cô Phạm Thu Hà' },
]

const statusClass: Record<string, string> = {
  'Xuất sắc': 'bg-green-100 text-green-700', 'Tốt': 'bg-blue-100 text-blue-700', 'Đang đạt': 'bg-amber-100 text-amber-700',
}

export default function DanhGia() {
  const [selectedStudent, setSelectedStudent] = useState(STUDENT_EVALUATIONS[0])
  const [search, setSearch] = useState('')
  const [period, setPeriod] = useState('T11/2024')
  const [block, setBlock] = useState('Tất cả khối')
  const [openGroup, setOpenGroup] = useState(0)

  const filtered = useMemo(() => STUDENT_EVALUATIONS.filter(s =>
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())) &&
    (block === 'Tất cả khối' || s.class.startsWith(block))
  ), [search, block])

  const radarData = DEVELOPMENT_CRITERIA.map(d => ({ ...d, name: d.subject }))
  const completed = STUDENT_EVALUATIONS.filter(s => s.completion === 100).length
  const average = Math.round(STUDENT_EVALUATIONS.reduce((sum, s) => sum + s.overallScore, 0) / STUDENT_EVALUATIONS.length)

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Đánh giá trẻ & Hồ sơ phát triển</h1>
          <p className="text-sm text-gray-500 mt-0.5">Admin theo dõi, thống kê và quản lý kết quả đánh giá do giáo viên cập nhật</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={period} onChange={e => setPeriod(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700">
            <option>T11/2024</option><option>T10/2024</option><option>T9/2024</option>
          </select>
          <select value={block} onChange={e => setBlock(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700">
            <option>Tất cả khối</option><option>Khối Mầm</option><option>Khối Chồi</option><option>Khối Lá</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Summary icon={ClipboardCheck} label="Đã có đánh giá" value={`${completed}/${STUDENT_EVALUATIONS.length}`} sub="Hồ sơ hoàn tất" />
        <Summary icon={BarChart3} label="Điểm trung bình" value={`${average}/100`} sub="Toàn bộ hồ sơ" />
        <Summary icon={Users} label="Cần theo dõi" value="2" sub="Có tiêu chí chưa đạt" />
        <Summary icon={TrendingUp} label="Cập nhật gần nhất" value="01/11" sub="Theo kỳ đánh giá" />
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <ClipboardCheck size={18} className="text-blue-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-blue-800">Phân quyền nghiệp vụ</p>
          <p className="text-xs text-blue-700 mt-0.5">Giáo viên là người trực tiếp quan sát, đánh giá trẻ và nhập kết quả. Admin chỉ xem, kiểm tra tiến độ, thống kê, phát hiện trường hợp cần theo dõi và quản lý hồ sơ.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm học sinh..." className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
            </div>
          </div>
          <div className="max-h-[560px] overflow-y-auto divide-y divide-gray-50">
            {filtered.map(student => (
              <button key={student.id} onClick={() => setSelectedStudent(student)} className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 ${selectedStudent.id === student.id ? 'bg-rose-50' : ''}`}>
                <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold shrink-0">{student.name.split(' ').pop()?.charAt(0)}</div>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{student.name}</p><p className="text-xs text-gray-400">{student.class} · {student.id}</p></div>
                <div className="text-right shrink-0"><p className="text-sm font-bold text-gray-800">{student.overallScore}</p><span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusClass[student.status]}`}>{student.status}</span></div>
                <ChevronRight size={14} className="text-gray-300 shrink-0" />
              </button>
            ))}
            {filtered.length === 0 && <p className="p-6 text-sm text-gray-400 text-center">Không tìm thấy học sinh</p>}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-lg font-bold">{selectedStudent.name.split(' ').pop()?.charAt(0)}</div>
                <div><h3 className="font-bold text-gray-900">{selectedStudent.name}</h3><p className="text-sm text-gray-500">{selectedStudent.class} · Cập nhật {selectedStudent.lastEval}</p><p className="text-xs text-gray-400 mt-0.5">Người cập nhật: {selectedStudent.teacher}</p></div>
              </div>
              <div className="text-right"><p className="text-3xl font-bold text-indigo-600">{selectedStudent.overallScore}</p><p className="text-xs text-gray-400">Điểm tổng / 100</p><span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${statusClass[selectedStudent.status]}`}>{selectedStudent.status}</span></div>
            </div>
            <div className="h-52"><ResponsiveContainer width="100%" height="100%"><RadarChart data={radarData}><PolarGrid stroke="#f3f4f6" /><PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#6b7280' }} /><PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#9ca3af' }} /><Radar name="Kết quả" dataKey="A" stroke="#E11D48" fill="#E11D48" fillOpacity={0.15} strokeWidth={2} /><Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #f3f4f6', fontSize: '12px' }} /></RadarChart></ResponsiveContainer></div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3"><h4 className="font-semibold text-gray-800 flex items-center gap-2"><TrendingUp size={15} className="text-green-500" /> Tiến bộ theo thời gian</h4><span className="text-xs text-gray-400">Dữ liệu do giáo viên cập nhật</span></div>
            <ResponsiveContainer width="100%" height={100}><LineChart data={PROGRESS_DATA}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} /><YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} /><Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #f3f4f6', fontSize: '12px' }} /><Line type="monotone" dataKey="score" stroke="#E11D48" strokeWidth={2.5} dot={{ fill: '#E11D48', r: 4, strokeWidth: 0 }} /></LineChart></ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">Kết quả theo nhóm tiêu chí</h4>
                <p className="text-xs text-gray-400 mt-1">Tổng hợp 16 tiêu chí theo 4 lĩnh vực phát triển</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1 shrink-0">
                <CheckCircle2 size={13} className="text-emerald-500" /> Chỉ xem
              </span>
            </div>

            <div className="space-y-2.5">
              {CRITERIA_GROUPS.map((group, groupIndex) => {
                const ratings = group.criteria.map((_, i) => 2 + ((i + groupIndex) % 2))
                const groupScore = Math.round(ratings.reduce((sum, value) => sum + value, 0) / ratings.length / 3 * 100)
                const isOpen = openGroup === groupIndex

                return (
                  <div key={group.name} className={`rounded-xl border transition-colors ${isOpen ? 'border-rose-100 bg-rose-50/30' : 'border-gray-100 bg-white'}`}>
                    <button
                      type="button"
                      onClick={() => setOpenGroup(isOpen ? -1 : groupIndex)}
                      className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-gray-50/70 rounded-xl"
                    >
                      <div className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-sm font-bold text-gray-700 shadow-sm shrink-0">
                        {groupIndex + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-gray-800 truncate">{group.name}</p>
                          <p className="text-sm font-bold text-gray-900 shrink-0">{groupScore}%</p>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="h-1.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                            <div className="h-full rounded-full bg-rose-500" style={{ width: `${groupScore}%` }} />
                          </div>
                          <span className="text-[11px] text-gray-400 shrink-0">{group.criteria.length} tiêu chí</span>
                        </div>
                      </div>
                      <ChevronDown size={16} className={`text-gray-400 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                      <div className="px-3.5 pb-3.5">
                        <div className="rounded-lg bg-white border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                          {group.criteria.map((criterion, i) => {
                            const rating = ratings[i]
                            const ratingLabel = ['Chưa đạt', 'Đang đạt', 'Tốt', 'Xuất sắc'][rating]
                            const ratingWidth = [25, 50, 75, 100][rating]
                            return (
                              <div key={criterion} className="px-3 py-2.5 flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                                <p className="text-sm text-gray-700 flex-1 min-w-0">{criterion}</p>
                                <div className="w-20 hidden sm:block">
                                  <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                                    <div className="h-full rounded-full bg-rose-400" style={{ width: `${ratingWidth}%` }} />
                                  </div>
                                </div>
                                <span className="text-[11px] font-medium px-2 py-1 rounded-md bg-gray-50 border border-gray-100 text-gray-600 shrink-0">{ratingLabel}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Summary({ icon: Icon, label, value, sub }: { icon: typeof ClipboardCheck, label: string, value: string, sub: string }) {
  return <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"><div className="flex items-center gap-2 text-gray-400"><Icon size={15} /><span className="text-xs">{label}</span></div><p className="text-xl font-bold text-gray-900 mt-2">{value}</p><p className="text-xs text-gray-400 mt-0.5">{sub}</p></div>
}
