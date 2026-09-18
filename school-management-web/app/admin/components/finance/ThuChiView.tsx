'use client'

import { useState } from 'react'
import { Plus, Download, Search, Filter, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TRANSACTIONS, MONTHLY_REVENUE } from '../../data'

const STATUS_COLORS: Record<string, string> = {
  'Đã thanh toán': 'bg-green-100 text-green-700',
  'Chờ thanh toán': 'bg-amber-100 text-amber-700',
  'Quá hạn': 'bg-rose-100 text-rose-700',
}

const INCOME_CATEGORIES = [
  { name: 'Học phí', amount: 243000000, pct: 76 },
  { name: 'Tiền ăn', amount: 52000000, pct: 16 },
  { name: 'Học phí ngoài giờ', amount: 15000000, pct: 5 },
  { name: 'Khác', amount: 10000000, pct: 3 },
]

export default function ThuChi() {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'expenses'>('overview')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tất cả')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const thu = TRANSACTIONS.filter(t => t.type === 'thu')
  const chi = TRANSACTIONS.filter(t => t.type === 'chi')
  const overdueCount = thu.filter(t => t.status === 'Quá hạn').length
  const totalThu = 320000000
  const totalChi = 198000000

  const filteredInvoices = thu.filter(t =>
    (statusFilter === 'Tất cả' || t.status === statusFilter) &&
    (t.studentName?.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Thu chi & Hóa đơn</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tháng 11 năm 2024</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download size={15} /> Xuất báo cáo
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors"
          >
            <Plus size={15} /> Tạo hóa đơn
          </button>
        </div>
      </div>

      {/* Alert for overdue */}
      {overdueCount > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle size={18} className="text-rose-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-rose-800">{overdueCount} hóa đơn quá hạn cần thu ngay</p>
            <p className="text-xs text-rose-600 mt-0.5">Tổng số tiền quá hạn: 10.700.000 đ</p>
          </div>
          <button className="text-xs text-rose-600 font-semibold underline hover:no-underline shrink-0">Xem ngay</button>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500">Tổng thu tháng 11</p>
            <TrendingUp size={14} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">320 triệu</p>
          <p className="text-xs text-green-600 mt-0.5 flex items-center gap-0.5"><TrendingUp size={11} /> +5% so với T10</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500">Tổng chi tháng 11</p>
            <TrendingDown size={14} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">198 triệu</p>
          <p className="text-xs text-green-600 mt-0.5 flex items-center gap-0.5"><TrendingDown size={11} /> -6% so với T10</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs text-gray-500 mb-1">Lợi nhuận tháng</p>
          <p className="text-2xl font-bold text-green-600">122 triệu</p>
          <p className="text-xs text-gray-400 mt-0.5">Tỷ suất 38.1%</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs text-gray-500 mb-1">Công nợ chưa thu</p>
          <p className="text-2xl font-bold text-rose-600">18.5 triệu</p>
          <p className="text-xs text-rose-500 mt-0.5">{overdueCount} HĐ quá hạn</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {[
          { id: 'overview' as const, label: 'Tổng quan' },
          { id: 'invoices' as const, label: 'Hóa đơn thu' },
          { id: 'expenses' as const, label: 'Chi phí' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Thu chi 6 tháng gần đây (triệu đồng)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MONTHLY_REVENUE} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #f3f4f6', fontSize: '12px' }} formatter={(v: any) => [`${v} triệu`, '']} />
                <Legend formatter={(v) => v === 'thu' ? 'Thu' : 'Chi'} />
                <Bar dataKey="thu" fill="#fda4af" radius={[4, 4, 0, 0]} name="Thu" />
                <Bar dataKey="chi" fill="#e5e7eb" radius={[4, 4, 0, 0]} name="Chi" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Cơ cấu thu tháng 11</h3>
            <div className="space-y-3">
              {INCOME_CATEGORIES.map(cat => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{cat.name}</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900">{(cat.amount / 1000000).toFixed(0)} triệu</span>
                      <span className="text-xs text-gray-400 ml-1">({cat.pct}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-rose-400 h-2 rounded-full" style={{ width: `${cat.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Invoices */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm học sinh, khoản thu..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none text-gray-700">
              <option>Tất cả</option>
              <option>Đã thanh toán</option>
              <option>Chờ thanh toán</option>
              <option>Quá hạn</option>
            </select>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden max-h-[520px] overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Mã HĐ</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Học sinh</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Khoản thu</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Số tiền</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Hạn thanh toán</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Trạng thái</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
                {filteredInvoices.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-mono text-gray-500">{t.id}</td>
                    <td className="px-4 py-3.5 text-sm font-medium text-gray-900">{t.studentName || '—'}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">{t.category}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-gray-900 text-right">
                      {t.amount.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">{t.dueDate || '—'}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[t.status]}`}>
                        {t.status}
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
        </div>
      )}

      {/* Expenses */}
      {activeTab === 'expenses' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden max-h-[520px] overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Mã</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Hạng mục</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Số tiền</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Ngày</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto">
              {chi.map(t => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-mono text-gray-500">{t.id}</td>
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-900">{t.category}</td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-gray-900 text-right">
                    {t.amount.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-500">{t.date}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[t.status]}`}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
