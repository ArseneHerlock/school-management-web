'use client'

import { useState } from 'react'
import { Search, Plus, Phone, Mail, AlertTriangle, CheckCircle, Calendar, UserCheck, Users, Edit } from 'lucide-react'
import { PARENTS, TEACHERS } from '../../data'

const STATUS_COLORS: Record<string, string> = {
  'Đang làm': 'bg-green-100 text-green-700',
  'Nghỉ phép': 'bg-amber-100 text-amber-700',
  'Nghỉ bệnh': 'bg-rose-100 text-rose-600',
}

const ROLE_COLORS: Record<string, string> = {
  'Ban giám hiệu': 'bg-purple-100 text-purple-700',
  'Giáo viên chủ nhiệm': 'bg-blue-100 text-blue-700',
  'Giáo viên phụ': 'bg-indigo-100 text-indigo-700',
  'Nhân viên': 'bg-gray-100 text-gray-600',
}

export default function PhuHuynhNhanSu() {
  const [activeTab, setActiveTab] = useState<'phu-huynh' | 'nhan-su'>('phu-huynh')
  const [search, setSearch] = useState('')

  const filteredParents = PARENTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  const filteredTeachers = TEACHERS.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))

  const staffStats = {
    total: TEACHERS.length,
    working: TEACHERS.filter(t => t.status === 'Đang làm').length,
    leave: TEACHERS.filter(t => t.status === 'Nghỉ phép').length,
    sick: TEACHERS.filter(t => t.status === 'Nghỉ bệnh').length,
    teachers: TEACHERS.filter(t => t.role.includes('Giáo viên')).length,
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Phụ huynh & Nhân sự</h1>
          <p className="text-sm text-gray-500 mt-0.5">Quản lý phụ huynh và toàn bộ nhân sự nhà trường</p>
        </div>
        <button className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors">
          <Plus size={15} /> {activeTab === 'phu-huynh' ? 'Thêm phụ huynh' : 'Thêm nhân sự'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { id: 'phu-huynh' as const, label: 'Phụ huynh', count: PARENTS.length, icon: Users },
          { id: 'nhan-su' as const, label: 'Nhân sự', count: TEACHERS.length, icon: UserCheck },
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearch('') }}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={15} /> {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                activeTab === tab.id ? 'bg-rose-100 text-rose-600' : 'bg-gray-200 text-gray-500'
              }`}>{tab.count}</span>
            </button>
          )
        })}
      </div>

      {/* Staff summary (only for nhân sự) */}
      {activeTab === 'nhan-su' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Tổng nhân sự', value: staffStats.total, color: 'gray' },
            { label: 'Đang làm việc', value: staffStats.working, color: 'green' },
            { label: 'Đang nghỉ phép', value: staffStats.leave, color: 'amber' },
            { label: 'Nghỉ bệnh', value: staffStats.sick, color: 'rose' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Tìm ${activeTab === 'phu-huynh' ? 'phụ huynh' : 'nhân sự'}...`}
          className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400"
        />
      </div>

      {/* Parent table */}
      {activeTab === 'phu-huynh' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden max-h-[520px] overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Phụ huynh</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Quan hệ</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Liên hệ</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Con đang học</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Liên lạc gần nhất</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Tài khoản</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
              {filteredParents.map(parent => (
                <tr key={parent.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {parent.name.split(' ').pop()?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{parent.name}</p>
                        <p className="text-xs text-gray-400">ID: {parent.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{parent.relationship}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600"><Phone size={11} /> {parent.phone}</div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400"><Mail size={11} /> {parent.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    {parent.studentNames.map(n => (
                      <span key={n} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full mr-1">{n}</span>
                    ))}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">
                    {new Date(parent.lastContact).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      parent.accountStatus === 'Hoạt động' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {parent.accountStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button className="text-xs text-rose-500 font-medium hover:underline">Chi tiết</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Staff table */}
      {activeTab === 'nhan-su' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden max-h-[520px] overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Nhân sự</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Vị trí</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Lớp phụ trách</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Liên hệ</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Ngày vào làm</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Trạng thái</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
              {filteredTeachers.map(teacher => (
                <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {teacher.name.split(' ').pop()?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{teacher.name}</p>
                        <p className="text-xs text-gray-400">ID: {teacher.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[teacher.role] || 'bg-gray-100 text-gray-600'}`}>
                      {teacher.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    {teacher.className ? (
                      <span className="text-sm text-gray-800">{teacher.className}</span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600"><Phone size={11} /> {teacher.phone}</div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400"><Mail size={11} /> {teacher.email}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">
                    {new Date(teacher.joinDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[teacher.status]}`}>
                      {teacher.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                      <Edit size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Assignment panel (for nhân sự) */}
      {activeTab === 'nhan-su' && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-rose-500 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-rose-800">Lớp Lá 5 chưa có giáo viên chủ nhiệm</p>
              <p className="text-xs text-rose-600 mt-1">Giáo viên chủ nhiệm cũ đã nghỉ việc từ 01/11/2024. Cần phân công giáo viên ngay.</p>
              <div className="flex gap-2 mt-3">
                <button className="px-4 py-2 bg-rose-500 text-white rounded-lg text-xs font-medium hover:bg-rose-600 transition-colors">
                  Phân công ngay
                </button>
                <button className="px-4 py-2 bg-white text-rose-600 border border-rose-200 rounded-lg text-xs font-medium hover:bg-rose-50 transition-colors">
                  Xem lịch làm việc
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
