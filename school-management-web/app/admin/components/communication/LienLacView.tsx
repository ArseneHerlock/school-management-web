'use client'

import { useState, type ElementType } from 'react'
import { Search, Send, Paperclip, Bell, AlertCircle, CheckCircle, Clock, MessageSquare, X } from 'lucide-react'
import { MESSAGES, CHAT_MESSAGES } from '../../data'

const NOTIFICATIONS = [
  { id: 1, type: 'message', title: 'Tin nhắn mới từ Nguyễn Văn Hùng', sub: 'Xin phép nghỉ cho bé Minh Anh', time: '08:35', read: false },
  { id: 2, type: 'leave', title: 'Đơn xin nghỉ từ Trần Thị Mai', sub: 'Bé Gia Hân xin nghỉ 2 ngày', time: '07:20', read: false },
  { id: 3, type: 'alert', title: 'Cảnh báo điểm danh', sub: '2 lớp chưa hoàn tất điểm danh', time: '08:15', read: false },
  { id: 4, type: 'payment', title: 'Nhắc nhở hóa đơn quá hạn', sub: '3 hóa đơn cần thu', time: 'Hôm qua', read: true },
  { id: 5, type: 'event', title: 'Sự kiện sắp tới: Ngày hội Bé với thiên nhiên', sub: 'Còn 7 ngày nữa', time: 'Hôm qua', read: true },
  { id: 6, type: 'schedule', title: 'Cảnh báo lịch hoạt động', sub: 'Xung đột lịch sân trường thứ 2', time: 'Hôm qua', read: true },
]

const NOTIF_COLORS: Record<string, { bg: string; icon: ElementType; color: string }> = {
  message: { bg: 'bg-blue-50', icon: MessageSquare, color: 'text-blue-500' },
  leave: { bg: 'bg-amber-50', icon: Clock, color: 'text-amber-500' },
  alert: { bg: 'bg-rose-50', icon: AlertCircle, color: 'text-rose-500' },
  payment: { bg: 'bg-green-50', icon: CheckCircle, color: 'text-green-500' },
  event: { bg: 'bg-purple-50', icon: Bell, color: 'text-purple-500' },
  schedule: { bg: 'bg-amber-50', icon: AlertCircle, color: 'text-amber-500' },
}

export default function LienLac() {
  const [activeTab, setActiveTab] = useState<'messages' | 'notifications'>('messages')
  const [selectedConversation, setSelectedConversation] = useState(MESSAGES[0])
  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState(CHAT_MESSAGES)
  const [search, setSearch] = useState('')

  const handleSend = () => {
    if (!inputMessage.trim()) return
    setMessages(prev => [...prev, {
      id: `cm-${Date.now()}`,
      sender: 'Admin',
      content: inputMessage,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    }])
    setInputMessage('')
  }

  const filtered = MESSAGES.filter(m => m.from.toLowerCase().includes(search.toLowerCase()))
  const unreadNotifs = NOTIFICATIONS.filter(n => !n.read).length

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Liên lạc</h1>
          <p className="text-sm text-gray-500 mt-0.5">Nhắn tin và thông báo với phụ huynh, giáo viên</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'messages' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
        >
          <MessageSquare size={14} /> Tin nhắn
          <span className="bg-rose-100 text-rose-600 text-xs px-1.5 py-0.5 rounded-full font-semibold">3</span>
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'notifications' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
        >
          <Bell size={14} /> Thông báo
          {unreadNotifs > 0 && (
            <span className="bg-rose-100 text-rose-600 text-xs px-1.5 py-0.5 rounded-full font-semibold">{unreadNotifs}</span>
          )}
        </button>
      </div>

      {/* Messages tab */}
      {activeTab === 'messages' && (
        <div className="flex gap-4 h-[calc(100vh-280px)] min-h-96">
          {/* Conversation list */}
          <div className="w-72 shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Tìm cuộc trò chuyện..."
                  className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {filtered.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedConversation(msg)}
                  className={`w-full flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left ${
                    selectedConversation.id === msg.id ? 'bg-rose-50' : ''
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    selectedConversation.id === msg.id ? 'bg-rose-200 text-rose-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {msg.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 truncate">{msg.from}</p>
                      <span className="text-xs text-gray-400 shrink-0">{msg.time}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{msg.role}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{msg.preview}</p>
                  </div>
                  {msg.unread > 0 && (
                    <span className="shrink-0 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {msg.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
            {/* Chat header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 bg-rose-200 text-rose-700 rounded-full flex items-center justify-center text-xs font-bold">
                {selectedConversation.avatar}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{selectedConversation.from}</p>
                <p className="text-xs text-gray-400">{selectedConversation.role}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                  {!msg.isMe && (
                    <div className="w-7 h-7 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      {msg.sender.split(' ').pop()?.charAt(0)}
                    </div>
                  )}
                  <div className={`max-w-xs md:max-w-md ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    {!msg.isMe && <p className="text-xs text-gray-400">{msg.sender}</p>}
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                      msg.isMe
                        ? 'bg-rose-500 text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}>
                      {msg.content}
                    </div>
                    <p className="text-xs text-gray-400">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2">
                <input
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                />
                <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                  <Paperclip size={16} />
                </button>
                <button
                  onClick={handleSend}
                  className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{unreadNotifs} thông báo chưa đọc</p>
            <button className="text-xs text-rose-500 font-medium hover:underline">Đánh dấu tất cả đã đọc</button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden max-h-[560px] overflow-y-auto pr-1">
            {NOTIFICATIONS.map(notif => {
              const nc = NOTIF_COLORS[notif.type]
              const Icon = nc.icon
              return (
                <div key={notif.id} className={`flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}>
                  <div className={`p-2 rounded-xl shrink-0 ${nc.bg}`}>
                    <Icon size={16} className={nc.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${!notif.read ? 'text-gray-900' : 'text-gray-600'}`}>{notif.title}</p>
                      {!notif.read && <span className="w-2 h-2 bg-rose-500 rounded-full" />}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{notif.sub}</p>
                    <p className="text-xs text-gray-300 mt-1">{notif.time}</p>
                  </div>
                  <button className="shrink-0 p-1 text-gray-300 hover:text-gray-500 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
