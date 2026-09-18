'use client'

import { useState } from 'react'
import { Download, Filter, BarChart2, Users, Calendar, Receipt, CheckSquare, Shield, Settings, History, ChevronRight } from 'lucide-react'

const REPORTS = [
  { id: 1, name: 'Báo cáo sĩ số', desc: 'Tổng hợp sĩ số theo khối, lớp và giai đoạn', icon: Users },
  { id: 2, name: 'Báo cáo điểm danh', desc: 'Thống kê tỷ lệ đi học, vắng mặt theo tháng', icon: CheckSquare },
  { id: 3, name: 'Báo cáo học sinh', desc: 'Danh sách học sinh với đầy đủ thông tin', icon: Users },
  { id: 4, name: 'Báo cáo nhân sự', desc: 'Thống kê giáo viên, nhân viên theo vị trí', icon: Users },
  { id: 5, name: 'Báo cáo thu chi', desc: 'Tổng hợp thu, chi và công nợ theo tháng/quý', icon: Receipt },
  { id: 6, name: 'Báo cáo đánh giá trẻ', desc: 'Kết quả đánh giá phát triển theo nhóm tiêu chí', icon: BarChart2 },
  { id: 7, name: 'Báo cáo hoạt động', desc: 'Lịch sử hoạt động và sự kiện trong kỳ', icon: Calendar },
]

const MODULES = [
  'Tổng quan',
  'Trường & Lớp',
  'Học sinh',
  'Phụ huynh',
  'Nhân sự',
  'Điểm danh',
  'Lịch học',
  'Đánh giá trẻ',
  'Sức khỏe',
  'Tin tức',
  'Liên lạc',
  'Thu chi',
  'Báo cáo',
  'Phân quyền',
  'Cấu hình',
]

const ROLES = [
  { id: 'admin', name: 'Admin / Ban Giám hiệu', color: 'bg-purple-100 text-purple-700' },
  { id: 'teacher', name: 'Giáo viên', color: 'bg-blue-100 text-blue-700' },
  { id: 'staff', name: 'Nhân viên', color: 'bg-gray-100 text-gray-700' },
  { id: 'parent', name: 'Phụ huynh', color: 'bg-green-100 text-green-700' },
]

const PERMISSIONS: Record<string, Record<string, boolean[]>> = {
  'Tổng quan': { admin: [true, false, false, false, false], teacher: [true, false, false, false, false], staff: [false, false, false, false, false], parent: [false, false, false, false, false] },
  'Học sinh': { admin: [true, true, true, true, false], teacher: [true, false, true, false, false], staff: [true, false, false, false, false], parent: [false, false, false, false, false] },
  'Điểm danh': { admin: [true, true, true, true, true], teacher: [true, true, true, false, false], staff: [true, false, false, false, false], parent: [true, false, false, false, false] },
  'Thu chi': { admin: [true, true, true, true, true], teacher: [false, false, false, false, false], staff: [true, false, false, false, false], parent: [true, false, false, false, false] },
  'Phân quyền': { admin: [true, true, true, true, true], teacher: [false, false, false, false, false], staff: [false, false, false, false, false], parent: [false, false, false, false, false] },
  'Cấu hình': { admin: [true, true, true, true, false], teacher: [false, false, false, false, false], staff: [false, false, false, false, false], parent: [false, false, false, false, false] },
}

const ACTIVITY_LOG = [
  { time: '08:38', user: 'TS. Nguyễn Thị Phương', role: 'Ban giám hiệu', action: 'Duyệt đơn xin nghỉ', target: 'Bé Hoàng Gia Bảo - Chồi 2', type: 'approve' },
  { time: '08:25', user: 'Cô Nguyễn Thị Lan', role: 'GVCN Mầm 1', action: 'Hoàn tất điểm danh', target: 'Lớp Mầm 1 - 22/22 học sinh', type: 'update' },
  { time: '08:15', user: 'ThS. Trần Văn Minh', role: 'Ban giám hiệu', action: 'Tạo thông báo', target: 'Thông báo họp phụ huynh cuối kỳ', type: 'create' },
  { time: '07:52', user: 'Cô Hoàng Thị Linh', role: 'GVCN Lá 1', action: 'Cập nhật nhật ký lớp', target: 'Lớp Lá 1 - Thứ Hai 18/11', type: 'update' },
  { time: '07:30', user: 'Hệ thống', role: 'Auto', action: 'Sao lưu dữ liệu tự động', target: 'Backup-20241118-073000.zip', type: 'system' },
  { time: '17:45 (17/11)', user: 'TS. Nguyễn Thị Phương', role: 'Ban giám hiệu', action: 'Tạo hóa đơn hàng loạt', target: '14 lớp - Học phí tháng 12', type: 'create' },
]

const ACTION_TYPE_COLORS: Record<string, string> = {
  approve: 'bg-green-100 text-green-700',
  update: 'bg-blue-100 text-blue-700',
  create: 'bg-indigo-100 text-indigo-700',
  system: 'bg-gray-100 text-gray-600',
  delete: 'bg-rose-100 text-rose-700',
}

export default function BaoCao() {
  const [activeTab, setActiveTab] = useState<'reports' | 'permissions' | 'settings' | 'log'>('reports')
  const [fromDate, setFromDate] = useState('2024-11-01')
  const [toDate, setToDate] = useState('2024-11-30')
  const [blockFilter, setBlockFilter] = useState('Tất cả')

  const PERM_LABELS = ['Xem', 'Thêm', 'Sửa', 'Xóa', 'Duyệt']

  const previewModules = Object.keys(PERMISSIONS)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Báo cáo & Cấu hình</h1>
          <p className="text-sm text-gray-500 mt-0.5">Xuất báo cáo, quản lý phân quyền và cài đặt hệ thống</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit flex-wrap">
        {[
          { id: 'reports' as const, label: 'Báo cáo', icon: BarChart2 },
          { id: 'permissions' as const, label: 'Phân quyền', icon: Shield },
          { id: 'settings' as const, label: 'Cấu hình', icon: Settings },
          { id: 'log' as const, label: 'Nhật ký hoạt động', icon: History },
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              <Icon size={14} /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-5">
          {/* Filter row */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Từ ngày</label>
                <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Đến ngày</label>
                <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Khối</label>
                <select value={blockFilter} onChange={e => setBlockFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none text-gray-700">
                  <option>Tất cả</option>
                  <option>Khối Mầm</option>
                  <option>Khối Chồi</option>
                  <option>Khối Lá</option>
                </select>
              </div>
              <button className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors">
                <Filter size={14} /> Áp dụng
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {REPORTS.map(report => {
              const Icon = report.icon
              return (
                <div key={report.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2.5 bg-rose-50 rounded-xl">
                      <Icon size={20} className="text-rose-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{report.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{report.desc}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
                      <Download size={13} /> Excel
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
                      <Download size={13} /> PDF
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Permissions */}
      {activeTab === 'permissions' && (
        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            {ROLES.map(role => (
              <div key={role.id} className={`text-xs font-medium px-3 py-1.5 rounded-full ${role.color}`}>
                {role.name}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden max-h-[520px] overflow-y-auto">
            <div className="max-h-[520px] overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">Chức năng</th>
                    {ROLES.map(role => (
                      <th key={role.id} colSpan={5} className="px-4 py-3 text-center text-xs font-semibold text-gray-500 border-l border-gray-100">
                        {role.name}
                      </th>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-2" />
                    {ROLES.map(role => (
                      PERM_LABELS.map(perm => (
                        <th key={`${role.id}-${perm}`} className="px-2 py-2 text-center text-xs text-gray-400 font-normal">
                          {perm}
                        </th>
                      ))
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
                  {previewModules.map(module => (
                    <tr key={module} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-sm font-medium text-gray-800">{module}</td>
                      {ROLES.map(role => {
                        const perms = PERMISSIONS[module]?.[role.id] || [false, false, false, false, false]
                        return perms.map((perm, i) => (
                          <td key={`${role.id}-${i}`} className="px-2 py-3 text-center border-l border-gray-50">
                            <div className={`w-5 h-5 rounded-md mx-auto flex items-center justify-center ${perm ? 'bg-green-100' : 'bg-gray-100'}`}>
                              {perm ? (
                                <span className="text-green-600 text-xs font-bold">✓</span>
                              ) : (
                                <span className="text-gray-300 text-xs">—</span>
                              )}
                            </div>
                          </td>
                        ))
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-gray-400">Hiển thị {previewModules.length}/{MODULES.length} chức năng. Nhấn "Chỉnh sửa" để thay đổi quyền.</p>
          <button className="px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors">
            Chỉnh sửa phân quyền
          </button>
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Năm học', items: [
                { label: 'Năm học hiện tại', value: '2024-2025', editable: true },
                { label: 'Học kỳ I', value: '02/09/2024 - 15/01/2025', editable: true },
                { label: 'Học kỳ II', value: '16/01/2025 - 31/05/2025', editable: true },
              ]
            },
            {
              title: 'Thông tin trường', items: [
                { label: 'Tên trường', value: 'Trường Mầm Non Hoa Sen', editable: true },
                { label: 'Địa chỉ', value: '123 Nguyễn Văn Linh, Q7, TP.HCM', editable: true },
                { label: 'Số điện thoại', value: '028 3456 7890', editable: true },
              ]
            },
            {
              title: 'Loại khoản thu', items: [
                { label: 'Học phí Khối Mầm', value: '2.500.000 đ / tháng', editable: true },
                { label: 'Học phí Khối Chồi', value: '2.700.000 đ / tháng', editable: true },
                { label: 'Học phí Khối Lá', value: '2.900.000 đ / tháng', editable: true },
                { label: 'Tiền ăn', value: '800.000 đ / tháng', editable: true },
              ]
            },
            {
              title: 'Cấu hình hệ thống', items: [
                { label: 'Ngôn ngữ', value: 'Tiếng Việt', editable: false },
                { label: 'Múi giờ', value: 'GMT+7 (Hà Nội/TP.HCM)', editable: false },
                { label: 'Sao lưu tự động', value: 'Mỗi ngày lúc 23:00', editable: true },
                { label: 'Phiên bản', value: 'v2.4.1', editable: false },
              ]
            },
          ].map(section => (
            <div key={section.title} className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">{section.title}</h3>
                <button className="text-xs text-rose-500 font-medium hover:underline">Chỉnh sửa</button>
              </div>
              <div className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
                {section.items.map(item => (
                  <div key={item.label} className="flex items-center justify-between px-5 py-3">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <span className={`text-sm font-medium ${item.editable ? 'text-gray-800' : 'text-gray-400'}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity log */}
      {activeTab === 'log' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden max-h-[520px] overflow-y-auto">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Nhật ký hoạt động hệ thống</h3>
            <button className="flex items-center gap-1.5 text-gray-500 text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <Download size={13} /> Xuất log
            </button>
          </div>
          <div className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
            {ACTIVITY_LOG.map((log, i) => (
              <div key={i} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="shrink-0 w-20">
                  <p className="text-xs font-mono text-gray-400">{log.time}</p>
                </div>
                <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {log.user === 'Hệ thống' ? 'SYS' : log.user.split(' ').pop()?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-gray-900">{log.user}</p>
                    <span className="text-xs text-gray-400">{log.role}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${ACTION_TYPE_COLORS[log.type]}`}>{log.action}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{log.target}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
