'use client'

import { useState } from 'react'
import { AlertTriangle, Heart, Search, ChevronRight, Pill, Activity, AlertCircle, FileText } from 'lucide-react'
import { HEALTH_RECORDS } from '../../data'

const INCIDENTS = [
  { id: 'SC001', date: '15/11/2024', student: 'Lê Hoàng Nam', class: 'Chồi 1', type: 'Khó thở', action: 'Sử dụng thuốc Ventolin, liên hệ phụ huynh', severity: 'medium', resolved: true },
  { id: 'SC002', date: '12/11/2024', student: 'Nguyễn Minh Anh', class: 'Mầm 1', type: 'Sốt nhẹ (37.8°C)', action: 'Hạ sốt, thông báo phụ huynh đón sớm', severity: 'low', resolved: true },
  { id: 'SC003', date: '10/11/2024', student: 'Vũ Bảo Châu', class: 'Lá 1', type: 'Dị ứng nhẹ da', action: 'Bôi kem chống dị ứng, theo dõi', severity: 'low', resolved: true },
]

const CHECKUPS = [
  { date: '15/09/2024', type: 'Khám định kỳ đầu năm học', classes: 'Toàn trường', doctor: 'BS. Nguyễn Văn An', done: 150, total: 406 },
  { date: '22/11/2024', type: 'Tiêm chủng định kỳ', classes: 'Toàn trường', doctor: 'BS. Trần Thị Bình', done: 0, total: 406, upcoming: true },
]

const ALLERGY_ALERTS = [
  { student: 'Trần Gia Hân', class: 'Mầm 1', allergens: ['Hải sản', 'Cua'], severity: 'Nghiêm trọng' },
  { student: 'Lê Hoàng Nam', class: 'Chồi 1', allergens: ['Đậu phộng'], severity: 'Nghiêm trọng' },
  { student: 'Vũ Bảo Châu', class: 'Lá 1', allergens: ['Sữa bò'], severity: 'Trung bình' },
  { student: 'Đinh Tuấn Khang', class: 'Lá 2', allergens: ['Trứng'], severity: 'Nhẹ' },
]

export default function SucKhoe() {
  const [activeTab, setActiveTab] = useState<'records' | 'incidents' | 'checkups' | 'allergies'>('records')
  const [search, setSearch] = useState('')

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Sức khỏe & Chăm sóc trẻ</h1>
          <p className="text-sm text-gray-500 mt-0.5">Quản lý hồ sơ, kết quả khám, dị ứng và cảnh báo sức khỏe của học sinh</p>
          <p className="text-xs text-blue-600 mt-1">Giáo viên trực tiếp ghi nhận dữ liệu sức khỏe và kết quả khám; Admin chỉ quản lý hồ sơ, tiến độ, cảnh báo và thống kê.</p>
        </div>
        <button className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors">
          <FileText size={15} /> Xem nhật ký sự cố
        </button>
      </div>

      {/* Alert banner */}
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="text-rose-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-rose-800">4 học sinh có dị ứng thực phẩm cần lưu ý trong thực đơn hôm nay</p>
            <p className="text-xs text-rose-600 mt-0.5">Đảm bảo thực đơn không có hải sản (Mầm 1), đậu phộng (Chồi 1), sữa bò (Lá 1), trứng (Lá 2)</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Có dị ứng', value: 4, icon: AlertTriangle, color: 'amber' },
          { label: 'Dùng thuốc thường xuyên', value: 1, icon: Pill, color: 'blue' },
          { label: 'Bệnh nền', value: 2, icon: Activity, color: 'purple' },
          { label: 'Sự cố tháng này', value: 3, icon: Heart, color: 'rose' },
        ].map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
                stat.color === 'amber' ? 'bg-amber-50' :
                stat.color === 'blue' ? 'bg-blue-50' :
                stat.color === 'purple' ? 'bg-purple-50' : 'bg-rose-50'
              }`}>
                <Icon size={16} className={
                  stat.color === 'amber' ? 'text-amber-500' :
                  stat.color === 'blue' ? 'text-blue-500' :
                  stat.color === 'purple' ? 'text-purple-500' : 'text-rose-500'
                } />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { id: 'records' as const, label: 'Hồ sơ sức khỏe' },
          { id: 'incidents' as const, label: 'Sự cố y tế' },
          { id: 'checkups' as const, label: 'Khám sức khỏe' },
          { id: 'allergies' as const, label: 'Dị ứng' },
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

      {/* Health Records */}
      {activeTab === 'records' && (
        <div className="max-h-[560px] overflow-y-auto pr-1 space-y-4">
          <div className="relative max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm học sinh..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HEALTH_RECORDS.filter(r => r.studentName.toLowerCase().includes(search.toLowerCase())).map(record => (
              <div key={record.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{record.studentName}</h3>
                    <p className="text-xs text-gray-400">{record.className}</p>
                  </div>
                  {record.allergies.length > 0 && (
                    <div className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                      <AlertTriangle size={11} /> Dị ứng
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-gray-900">{record.weight}</p>
                    <p className="text-xs text-gray-400">Cân nặng</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-gray-900">{record.height}</p>
                    <p className="text-xs text-gray-400">Chiều cao</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-gray-900">{record.bloodType}</p>
                    <p className="text-xs text-gray-400">Nhóm máu</p>
                  </div>
                </div>

                {record.allergies.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mb-3">
                    <p className="text-xs font-semibold text-amber-800 mb-1">Dị ứng:</p>
                    <div className="flex flex-wrap gap-1">
                      {record.allergies.map(a => (
                        <span key={a} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{a}</span>
                      ))}
                    </div>
                  </div>
                )}

                {record.medications.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 mb-3">
                    <p className="text-xs font-semibold text-blue-800 mb-1">Thuốc:</p>
                    {record.medications.map(m => (
                      <p key={m} className="text-xs text-blue-700">{m}</p>
                    ))}
                  </div>
                )}

                {record.note && (
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-xs text-gray-600">{record.note}</p>
                  </div>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <p className="text-xs text-gray-400">Khám gần nhất: {new Date(record.lastCheckup).toLocaleDateString('vi-VN')}</p>
                  <button className="text-xs text-rose-500 font-medium hover:underline flex items-center gap-1">
                    Chi tiết <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Incidents */}
      {activeTab === 'incidents' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden max-h-[520px] overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Ngày</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Học sinh</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Sự cố</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Xử lý</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Mức độ</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 max-h-[560px] overflow-y-auto">
              {INCIDENTS.map(inc => (
                <tr key={inc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-sm text-gray-600">{inc.date}</td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-gray-900">{inc.student}</p>
                    <p className="text-xs text-gray-400">{inc.class}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-800">{inc.type}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-600 max-w-xs">{inc.action}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      inc.severity === 'high' ? 'bg-rose-100 text-rose-700' :
                      inc.severity === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {inc.severity === 'high' ? 'Cao' : inc.severity === 'medium' ? 'Trung bình' : 'Thấp'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">Đã xử lý</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Checkups */}
      {activeTab === 'checkups' && (
        <div className="max-h-[560px] overflow-y-auto pr-1 space-y-4">
          {CHECKUPS.map((checkup, i) => (
            <div key={i} className={`bg-white rounded-xl border shadow-sm p-5 ${checkup.upcoming ? 'border-rose-200' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl ${checkup.upcoming ? 'bg-rose-50' : 'bg-green-50'}`}>
                    <Activity size={20} className={checkup.upcoming ? 'text-rose-500' : 'text-green-500'} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{checkup.type}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Ngày: {checkup.date} · Bác sĩ: {checkup.doctor}</p>
                    <p className="text-sm text-gray-500">Đối tượng: {checkup.classes}</p>
                  </div>
                </div>
                <div className="text-right">
                  {checkup.upcoming ? (
                    <span className="text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-full font-medium">Sắp diễn ra</span>
                  ) : (
                    <>
                      <p className="text-lg font-bold text-gray-900">{checkup.done}/{checkup.total}</p>
                      <p className="text-xs text-gray-400">đã khám</p>
                    </>
                  )}
                </div>
              </div>
              {!checkup.upcoming && (
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: `${checkup.done / checkup.total * 100}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{Math.round(checkup.done / checkup.total * 100)}%</span>
                  </div>
                </div>
              )}
              {checkup.upcoming && (
                <div className="mt-3 flex gap-2">
                  <button className="px-4 py-1.5 bg-rose-500 text-white rounded-lg text-xs font-medium hover:bg-rose-600 transition-colors">
                    Xem danh sách
                  </button>
                  <button className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
                    Thông báo phụ huynh
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Allergy management */}
      {activeTab === 'allergies' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-amber-800 mb-1">Hướng dẫn xử lý dị ứng</p>
            <p className="text-xs text-amber-700">Khi phát hiện trẻ có phản ứng dị ứng: 1) Dừng ngay tiếp xúc với chất gây dị ứng. 2) Liên hệ phụ huynh ngay lập tức. 3) Gọi y tá/bác sĩ nếu phản ứng nghiêm trọng. 4) Ghi chép sự cố vào hồ sơ.</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Danh sách dị ứng học sinh ({ALLERGY_ALERTS.length} trẻ)</h3>
            </div>
            <div className="max-h-[560px] overflow-y-auto pr-1 divide-y divide-gray-50">
              {ALLERGY_ALERTS.map((alert, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {alert.student.split(' ').pop()?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.student}</p>
                    <p className="text-xs text-gray-400">{alert.class}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {alert.allergens.map(a => (
                      <span key={a} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{a}</span>
                    ))}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    alert.severity === 'Nghiêm trọng' ? 'bg-rose-100 text-rose-700' :
                    alert.severity === 'Trung bình' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                  }`}>{alert.severity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
