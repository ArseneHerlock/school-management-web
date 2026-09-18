'use client'

import type { ElementType } from 'react'
import { Users, UserCheck, UserX, Clock, BookOpen, Briefcase, MessageSquare, Bell, TrendingUp, TrendingDown, AlertTriangle, ChevronRight, Plus, Calendar, Receipt, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { MONTHLY_REVENUE, ATTENDANCE_TREND, TASK_ITEMS, EVENTS, ANNOUNCEMENTS } from '../../data'

type PageId = 'dashboard' | 'truong-lop' | 'hoc-sinh' | 'phu-huynh-nhan-su' | 'diem-danh' | 'lich-hoc' | 'danh-gia' | 'suc-khoe' | 'tin-tuc' | 'thu-chi' | 'lien-lac' | 'bao-cao'

interface DashboardProps {
  navigate: (page: PageId) => void
}

const KPI_COLORS = ['#E11D48', '#f59e0b', '#10b981']
const PIE_DATA = [
  { name: 'Có mặt', value: 358, color: '#10b981' },
  { name: 'Vắng có phép', value: 18, color: '#f59e0b' },
  { name: 'Vắng không phép', value: 8, color: '#E11D48' },
  { name: 'Đi muộn', value: 22, color: '#6366f1' },
]

const TODAY_SCHEDULE = [
  { time: '07:00 - 07:30', activity: 'Đón trẻ', classes: 'Toàn trường', status: 'done' },
  { time: '07:30 - 08:30', activity: 'Hoạt động học tập buổi sáng', classes: 'Toàn trường', status: 'done' },
  { time: '08:30 - 09:00', activity: 'Bữa ăn phụ', classes: 'Khối Mầm', status: 'active' },
  { time: '09:00 - 10:00', activity: 'Hoạt động ngoài trời', classes: 'Khối Chồi, Khối Lá', status: 'active', warning: true },
  { time: '10:30 - 11:30', activity: 'Bữa trưa', classes: 'Toàn trường', status: 'upcoming' },
  { time: '11:30 - 14:00', activity: 'Giờ ngủ', classes: 'Toàn trường', status: 'upcoming' },
  { time: '14:00 - 15:30', activity: 'Hoạt động chiều', classes: 'Toàn trường', status: 'upcoming' },
  { time: '15:30 - 17:00', activity: 'Trả trẻ', classes: 'Toàn trường', status: 'upcoming' },
]

export default function Dashboard({ navigate }: DashboardProps) {
  const totalStudents = 406
  const presentToday = 358
  const absentToday = 26
  const lateToday = 22

  return (
    <div className="p-6 space-y-6 max-w-screen-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Tổng quan hôm nay</h1>
          <p className="text-sm text-gray-500 mt-0.5">Thứ Hai, 18 tháng 11 năm 2024 · Tuần 12, Học kỳ I</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Đang cập nhật · 8 giây trước
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: '+ Thêm học sinh', page: 'hoc-sinh' as PageId },
          { label: '+ Tạo thông báo', page: 'tin-tuc' as PageId },
          { label: '+ Tạo lịch', page: 'lich-hoc' as PageId },
          { label: '+ Tạo hóa đơn', page: 'thu-chi' as PageId },
          { label: '+ Tạo sự kiện', page: 'tin-tuc' as PageId },
        ].map(action => (
          <button
            key={action.label}
            onClick={() => navigate(action.page)}
            className="text-sm font-medium px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-colors"
          >
            {action.label}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          label="Tổng học sinh"
          value={totalStudents.toString()}
          sub="14 lớp · 3 khối"
          icon={Users}
          color="blue"
          onClick={() => navigate('hoc-sinh')}
        />
        <KPICard
          label="Có mặt hôm nay"
          value={`${presentToday}`}
          sub={`${Math.round(presentToday / totalStudents * 100)}% tỷ lệ đi học`}
          icon={UserCheck}
          color="green"
          trend="+2% so với tuần trước"
          trendUp={true}
          onClick={() => navigate('diem-danh')}
        />
        <KPICard
          label="Vắng hôm nay"
          value={`${absentToday}`}
          sub={`${Math.round(absentToday / totalStudents * 100)}% vắng mặt`}
          icon={UserX}
          color="red"
          onClick={() => navigate('diem-danh')}
        />
        <KPICard
          label="Đi muộn"
          value={`${lateToday}`}
          sub="8 chưa check-in"
          icon={Clock}
          color="amber"
          onClick={() => navigate('diem-danh')}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          label="Lớp hoạt động"
          value="13/14"
          sub="Lá 5 thiếu GVCN"
          icon={BookOpen}
          color="indigo"
          alert={true}
          onClick={() => navigate('truong-lop')}
        />
        <KPICard
          label="Nhân sự hôm nay"
          value="38/42"
          sub="4 người nghỉ phép"
          icon={Briefcase}
          color="purple"
          onClick={() => navigate('phu-huynh-nhan-su')}
        />
        <KPICard
          label="Tin nhắn chưa đọc"
          value="3"
          sub="Từ 3 phụ huynh"
          icon={MessageSquare}
          color="blue"
          onClick={() => navigate('lien-lac')}
        />
        <KPICard
          label="Hóa đơn quá hạn"
          value="4"
          sub="Cần thu ngay"
          icon={Receipt}
          color="red"
          alert={true}
          onClick={() => navigate('thu-chi')}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Việc cần xử lý */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-500" />
              Việc cần xử lý
            </h2>
            <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-0.5 rounded-full">{TASK_ITEMS.length}</span>
          </div>
          <div className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
            {TASK_ITEMS.map(task => (
              <button
                key={task.id}
                onClick={() => navigate(task.link as PageId)}
                className="w-full flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left group"
              >
                <div className={`mt-0.5 shrink-0 ${
                  task.type === 'error' ? 'text-rose-500' :
                  task.type === 'warning' ? 'text-amber-500' : 'text-blue-500'
                }`}>
                  {task.type === 'error' ? <AlertCircle size={15} /> :
                   task.type === 'warning' ? <AlertTriangle size={15} /> :
                   <Info size={15} />}
                </div>
                <p className="text-sm text-gray-700 flex-1">{task.message}</p>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 mt-0.5 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Attendance Donut + Class Status */}
        <div className="space-y-4">
          {/* Attendance chart */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-3">Điểm danh hôm nay</h2>
            <div className="flex items-center gap-4">
              <div className="w-36 h-36 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={64} dataKey="value" strokeWidth={0}>
                      {PIE_DATA.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {PIE_DATA.map(item => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
              <span className="text-gray-500">Đã điểm danh 13/14 lớp</span>
              <button onClick={() => navigate('diem-danh')} className="text-rose-500 font-medium hover:underline">Xem chi tiết</button>
            </div>
          </div>

          {/* Upcoming events */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar size={15} className="text-gray-400" /> Sự kiện sắp tới
            </h2>
            <div className="space-y-2.5">
              {EVENTS.slice(0, 3).map(event => (
                <div key={event.id} className="flex items-start gap-3">
                  <div className="shrink-0 bg-rose-50 text-rose-600 rounded-lg p-1.5 text-xs font-bold text-center min-w-[40px]">
                    <div>{event.date.split('-')[2]}</div>
                    <div className="text-xs opacity-70">Th{event.date.split('-')[1]}</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{event.title}</p>
                    <p className="text-xs text-gray-400">{event.time} · {event.location}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('tin-tuc')} className="mt-3 text-xs text-rose-500 font-medium hover:underline">Xem tất cả sự kiện</button>
          </div>
        </div>

        {/* Today's schedule */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Lịch hôm nay</h2>
            <button onClick={() => navigate('lich-hoc')} className="text-xs text-rose-500 font-medium hover:underline">Xem lịch đầy đủ</button>
          </div>
          <div className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
            {TODAY_SCHEDULE.map((item, i) => (
              <div key={i} className={`flex items-start gap-3 px-5 py-3 ${item.status === 'active' ? 'bg-rose-50/50' : ''}`}>
                <div className="w-24 shrink-0">
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
                <div className={`w-2 h-2 mt-1 rounded-full shrink-0 ${
                  item.status === 'done' ? 'bg-green-400' :
                  item.status === 'active' ? 'bg-rose-500 animate-pulse' :
                  'bg-gray-200'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${item.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{item.activity}</p>
                  <p className="text-xs text-gray-400">{item.classes}</p>
                  {item.warning && (
                    <div className="flex items-center gap-1 text-xs text-amber-600 mt-0.5">
                      <AlertTriangle size={11} /> Cảnh báo xung đột khu vực
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-800">Thu chi 6 tháng gần đây</h2>
              <p className="text-xs text-gray-400 mt-0.5">Đơn vị: triệu đồng</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-rose-400" /> Thu</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-gray-200" /> Chi</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_REVENUE} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #f3f4f6', fontSize: '12px' }}
                formatter={(v: any) => [`${v} triệu`, '']}
              />
              <Bar dataKey="thu" fill="#fda4af" radius={[4, 4, 0, 0]} />
              <Bar dataKey="chi" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 pt-3 border-t border-gray-50 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-gray-400">Thu tháng 11</p>
              <p className="text-sm font-bold text-gray-800">320 triệu</p>
              <p className="text-xs text-green-600 flex items-center justify-center gap-0.5"><TrendingUp size={11} /> +5%</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Chi tháng 11</p>
              <p className="text-sm font-bold text-gray-800">198 triệu</p>
              <p className="text-xs text-green-600 flex items-center justify-center gap-0.5"><TrendingDown size={11} /> -6%</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Công nợ</p>
              <p className="text-sm font-bold text-rose-600">18.5 triệu</p>
              <p className="text-xs text-rose-500">4 hóa đơn quá hạn</p>
            </div>
          </div>
        </div>

        {/* Attendance trend */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-800">Tỷ lệ đi học theo ngày</h2>
              <p className="text-xs text-gray-400 mt-0.5">7 ngày gần nhất (%)</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ATTENDANCE_TREND}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #f3f4f6', fontSize: '12px' }}
                formatter={(v: any) => [`${v}%`, 'Tỷ lệ đi học']}
              />
              <Line type="monotone" dataKey="rate" stroke="#E11D48" strokeWidth={2.5} dot={{ fill: '#E11D48', r: 4, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>

          {/* Class status grid */}
          <div className="mt-4 pt-4 border-t border-gray-50">
            <p className="text-xs font-medium text-gray-500 mb-2">Tình trạng điểm danh theo khối</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Khối Mầm', classes: 4, done: 4, rate: 96 },
                { name: 'Khối Chồi', classes: 5, done: 5, rate: 91 },
                { name: 'Khối Lá', classes: 5, done: 4, rate: 94 },
              ].map(block => (
                <div key={block.name} className="bg-gray-50 rounded-lg p-2.5">
                  <p className="text-xs font-medium text-gray-700">{block.name}</p>
                  <p className="text-lg font-bold text-gray-900 mt-0.5">{block.rate}%</p>
                  <p className="text-xs text-gray-400">Điểm danh {block.done}/{block.classes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent announcements */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Thông báo gần đây</h2>
          <button onClick={() => navigate('tin-tuc')} className="text-xs text-rose-500 font-medium hover:underline">Xem tất cả</button>
        </div>
        <div className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
          {ANNOUNCEMENTS.map(ann => (
            <div key={ann.id} className="flex items-start gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
              <div className={`mt-0.5 shrink-0 ${
                ann.type === 'Khẩn cấp' ? 'text-rose-500' :
                ann.type === 'Thông báo họp' ? 'text-amber-500' : 'text-blue-500'
              }`}>
                {ann.type === 'Khẩn cấp' ? <AlertCircle size={16} /> :
                 ann.type === 'Thông báo họp' ? <Bell size={16} /> : <Info size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {ann.pinned && <span className="text-xs bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded font-medium">Ghim</span>}
                  <p className="text-sm font-medium text-gray-800">{ann.title}</p>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{ann.author} · {ann.date} · {ann.audience}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs text-gray-500">{ann.readCount}/{ann.totalRecipients}</p>
                <p className="text-xs text-gray-400">đã đọc</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function KPICard({ label, value, sub, icon: Icon, color, trend, trendUp, alert, onClick }: {
  label: string; value: string; sub: string; icon: ElementType;
  color: string; trend?: string; trendUp?: boolean; alert?: boolean; onClick?: () => void
}) {
  const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-500', border: 'border-blue-100' },
    green: { bg: 'bg-green-50', icon: 'text-green-500', border: 'border-green-100' },
    red: { bg: 'bg-rose-50', icon: 'text-rose-500', border: 'border-rose-100' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-500', border: 'border-amber-100' },
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-500', border: 'border-indigo-100' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-500', border: 'border-purple-100' },
  }
  const c = colorMap[color] || colorMap.blue

  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-xl border shadow-sm p-5 text-left hover:shadow-md transition-shadow w-full ${alert ? 'border-rose-200' : 'border-gray-100'}`}
    >
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg ${c.bg}`}>
          <Icon size={18} className={c.icon} />
        </div>
        {alert && <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        <p className="text-xs text-gray-400 mt-1">{sub}</p>
        {trend && (
          <p className={`text-xs mt-1 flex items-center gap-0.5 font-medium ${trendUp ? 'text-green-600' : 'text-rose-500'}`}>
            {trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {trend}
          </p>
        )}
      </div>
    </button>
  )
}
