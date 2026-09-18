'use client'

import { useState } from 'react'
import { Plus, Bell, Pin, Eye, Calendar, Search, X, ChevronDown, Users, BookOpen, School, AlertCircle } from 'lucide-react'
import { ANNOUNCEMENTS, EVENTS } from '../../data'

const TYPE_COLORS: Record<string, string> = {
  'Thông báo chung': 'bg-blue-100 text-blue-700',
  'Thông báo nghỉ': 'bg-amber-100 text-amber-700',
  'Thông báo họp': 'bg-purple-100 text-purple-700',
  'Khẩn cấp': 'bg-rose-100 text-rose-700',
}

const EVENT_TYPE_COLORS: Record<string, string> = {
  'Hoạt động ngoài trời': 'bg-green-100 text-green-700',
  'Họp phụ huynh': 'bg-purple-100 text-purple-700',
  'Y tế': 'bg-blue-100 text-blue-700',
  'Hoạt động học tập': 'bg-indigo-100 text-indigo-700',
}

export default function TinTuc() {
  const [activeTab, setActiveTab] = useState<'news' | 'events'>('news')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [eventType, setEventType] = useState<'news' | 'event'>('news')
  const [search, setSearch] = useState('')

  const filtered = ANNOUNCEMENTS.filter(a => a.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Tin tức & Sự kiện</h1>
          <p className="text-sm text-gray-500 mt-0.5">Quản lý thông báo và sự kiện toàn trường</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setShowCreateModal(true); setEventType('news') }}
            className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors"
          >
            <Plus size={15} /> Tạo thông báo
          </button>
          <button
            onClick={() => { setShowCreateModal(true); setEventType('event') }}
            className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Calendar size={15} /> Tạo sự kiện
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tổng thông báo', value: ANNOUNCEMENTS.length, sub: 'Tháng này' },
          { label: 'Đang hiển thị', value: ANNOUNCEMENTS.filter(a => a.pinned).length + 2, sub: 'Thông báo hiệu lực' },
          { label: 'Chưa đọc', value: 33, sub: 'Phụ huynh chưa đọc' },
          { label: 'Sự kiện sắp tới', value: EVENTS.filter(e => e.status === 'Sắp diễn ra').length, sub: '30 ngày tới' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-700 font-medium mt-0.5">{stat.label}</p>
            <p className="text-xs text-gray-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('news')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'news' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
        >
          <Bell size={14} /> Thông báo
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'events' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
        >
          <Calendar size={14} /> Sự kiện
        </button>
      </div>

      {/* News tab */}
      {activeTab === 'news' && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm thông báo..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <div className="max-h-[560px] overflow-y-auto pr-1 space-y-3">
            {filtered.map(ann => (
              <div key={ann.id} className={`bg-white rounded-xl border shadow-sm p-5 ${ann.pinned ? 'border-rose-200' : 'border-gray-100'}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-xl shrink-0 ${
                    ann.type === 'Khẩn cấp' ? 'bg-rose-50' : 'bg-blue-50'
                  }`}>
                    {ann.type === 'Khẩn cấp' ?
                      <AlertCircle size={18} className="text-rose-500" /> :
                      <Bell size={18} className="text-blue-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {ann.pinned && (
                        <span className="flex items-center gap-1 text-xs bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded font-medium">
                          <Pin size={10} /> Ghim
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[ann.type]}`}>
                        {ann.type}
                      </span>
                      <span className="text-xs text-gray-400">{ann.audience}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{ann.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{ann.content}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>{ann.author}</span>
                      <span>{ann.date}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                      <Eye size={13} /> {ann.readCount}/{ann.totalRecipients} đã đọc
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 w-24">
                      <div
                        className="h-1.5 rounded-full bg-green-400"
                        style={{ width: `${ann.readCount / ann.totalRecipients * 100}%` }}
                      />
                    </div>
                    {ann.readCount < ann.totalRecipients && (
                      <p className="text-xs text-amber-600 mt-1 font-medium">
                        {ann.totalRecipients - ann.readCount} chưa đọc
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                  <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">Chỉnh sửa</button>
                  <span className="text-gray-200">·</span>
                  <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">{ann.pinned ? 'Bỏ ghim' : 'Ghim'}</button>
                  <span className="text-gray-200">·</span>
                  <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">Gửi nhắc nhở</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events tab */}
      {activeTab === 'events' && (
        <div className="max-h-[560px] overflow-y-auto pr-1 space-y-3">
          {EVENTS.map(event => (
            <div key={event.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start gap-4">
                <div className="shrink-0 bg-rose-50 border border-rose-200 rounded-xl p-3 text-center min-w-[60px]">
                  <p className="text-xl font-bold text-rose-600">{event.date.split('-')[2]}</p>
                  <p className="text-xs text-rose-400">Th{event.date.split('-')[1]}</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${EVENT_TYPE_COLORS[event.type] || 'bg-gray-100 text-gray-600'}`}>
                      {event.type}
                    </span>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                      {event.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span>Thời gian: {event.time}</span>
                    <span>Địa điểm: {event.location}</span>
                    <span>Số người tham dự: {event.participants}</span>
                  </div>
                </div>
                <button className="shrink-0 text-xs text-rose-500 font-medium hover:underline">Chỉnh sửa</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {eventType === 'news' ? 'Tạo thông báo mới' : 'Tạo sự kiện mới'}
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Tiêu đề *</label>
                <input placeholder="Nhập tiêu đề..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
              </div>
              {eventType === 'news' && (
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Loại thông báo</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                    <option>Thông báo chung</option>
                    <option>Thông báo nghỉ</option>
                    <option>Thông báo họp</option>
                    <option>Khẩn cấp</option>
                  </select>
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Nội dung *</label>
                <textarea rows={4} placeholder="Nhập nội dung thông báo..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Đối tượng nhận *</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Toàn trường', icon: School },
                    { label: 'Khối Mầm', icon: BookOpen },
                    { label: 'Phụ huynh', icon: Users },
                    { label: 'Giáo viên', icon: Users },
                  ].map(item => {
                    const Icon = item.icon
                    return (
                      <label key={item.label} className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input type="checkbox" className="accent-rose-500" />
                        <Icon size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
              {eventType === 'news' && (
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-rose-500" />
                    <span className="text-sm text-gray-700">Ghim thông báo</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-rose-500" />
                    <span className="text-sm text-gray-700">Gửi thông báo push</span>
                  </label>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between px-6 pb-6">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                Hủy
              </button>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                  Lưu nháp
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 rounded-lg text-sm font-medium bg-rose-500 text-white hover:bg-rose-600 transition-colors"
                >
                  Đăng ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
