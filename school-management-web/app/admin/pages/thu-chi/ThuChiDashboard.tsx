'use client'

import React from 'react'
import {
  DollarSign,
  CreditCard,
  AlertTriangle,
  Users,
  Eye,
  CheckCircle2,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { FinancialStats } from './types'
import { InvoiceItem } from '@/lib/billing'
import Pagination from '@/app/admin/components/shared/Pagination'

interface ThuChiDashboardProps {
  financialStats: FinancialStats
  schoolYear: string
  feeStructureChartData: any[]
  invoiceStatusChartData: any[]
  invoices: InvoiceItem[]
  invoiceStatusFilter: 'ALL' | 'PAID' | 'DEBT'
  setInvoiceStatusFilter: (val: 'ALL' | 'PAID' | 'DEBT') => void
  paginatedInvoices: InvoiceItem[]
  invoicePage: number
  setInvoicePage: (p: number) => void
  money: (n: any) => string
  onOpenInvoiceDetail: (inv: InvoiceItem) => void
}

export default function ThuChiDashboard({
  financialStats,
  schoolYear,
  feeStructureChartData,
  invoiceStatusChartData,
  invoices,
  invoiceStatusFilter,
  setInvoiceStatusFilter,
  paginatedInvoices,
  invoicePage,
  setInvoicePage,
  money,
  onOpenInvoiceDetail,
}: ThuChiDashboardProps) {
  return (
    <div className="space-y-6">
      {/* 4 Thẻ tài chính */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Dự toán thu mầm non</span>
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600"><DollarSign size={16} /></span>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-800">{money(financialStats.totalEstimatedRevenue)} đ</p>
          <p className="mt-1 text-xs text-slate-400">Niên khóa: {schoolYear}</p>
        </div>

        <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Đã thực thu</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><CreditCard size={16} /></span>
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-600">{money(financialStats.totalCollected)} đ</p>
          <p className="mt-1 text-xs text-emerald-600 font-semibold">{financialStats.collectionRate}% hoàn thành</p>
        </div>

        <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Công nợ còn tồn</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600"><AlertTriangle size={16} /></span>
          </div>
          <p className="mt-2 text-2xl font-black text-amber-600">{money(financialStats.totalDebt)} đ</p>
          <p className="mt-1 text-xs text-slate-400">{financialStats.debtStudentsCount} học sinh chưa đóng</p>
        </div>

        <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Đã hoàn thành phí</span>
            <span className="p-2 rounded-xl bg-sky-50 text-sky-600"><Users size={16} /></span>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-800">{financialStats.paidStudentsCount} bé</p>
          <p className="mt-1 text-xs text-slate-400">Học sinh đã nộp đủ</p>
        </div>
      </div>

      {/* 2 Biểu đồ */}
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-rose-50 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-800">Cơ cấu mức phí theo danh mục khoản thu</h3>
              <p className="text-[11px] text-slate-400">Học phí, Tiền ăn, Bán trú, Ngoại khóa...</p>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">{schoolYear}</span>
          </div>

          <div className="mt-4 h-64">
            {feeStructureChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={feeStructureChartData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}Tr`} />
                  <Tooltip formatter={(v: any) => [`${money(v)} đ`, 'Mức nộp']} />
                  <Bar dataKey="amount" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={34} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                Chưa có dữ liệu khoản thu nào
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-rose-100 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-rose-50 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-800">Tỷ lệ thu hồi công nợ</h3>
                <p className="text-[11px] text-slate-400">Trạng thái hoàn thành học phí</p>
              </div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                {financialStats.collectionRate}% Hoàn tất
              </span>
            </div>

            <div className="mt-3 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={invoiceStatusChartData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={72} paddingAngle={3}>
                    {invoiceStatusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v} học sinh`, 'Số lượng']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-center">
            {invoiceStatusChartData.map((item, idx) => (
              <div key={idx} className="rounded-2xl bg-rose-50/30 p-2">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-semibold text-slate-600">{item.name}</span>
                </div>
                <p className="mt-1 text-sm font-black text-slate-800">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bảng Hóa đơn */}
      <div className="rounded-3xl border border-rose-100 bg-white overflow-hidden shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-rose-100 p-4">
          <div>
            <h3 className="text-sm font-black text-slate-800">Hóa đơn phát hành gần đây</h3>
            <p className="text-[11px] text-slate-400">Các đợt thu học phí mầm non</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => { setInvoiceStatusFilter('ALL'); setInvoicePage(1); }}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${invoiceStatusFilter === 'ALL' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'}`}
            >
              Tất cả ({invoices.length})
            </button>
            <button
              onClick={() => { setInvoiceStatusFilter('DEBT'); setInvoicePage(1); }}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${invoiceStatusFilter === 'DEBT' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-500'}`}
            >
              Còn nợ
            </button>
            <button
              onClick={() => { setInvoiceStatusFilter('PAID'); setInvoicePage(1); }}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${invoiceStatusFilter === 'PAID' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500'}`}
            >
              Đã thu
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-rose-100 bg-rose-50/20 text-slate-500 text-[10px] uppercase">
                <th className="p-3.5">Mã HĐ</th>
                <th className="p-3.5">Học sinh</th>
                <th className="p-3.5">Tổng tiền</th>
                <th className="p-3.5">Đã đóng</th>
                <th className="p-3.5 text-center">Trạng thái</th>
                <th className="p-3.5 text-center">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {paginatedInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-rose-50/20 transition">
                  <td className="p-3.5 font-bold text-rose-600">{inv.invoiceNumber}</td>
                  <td className="p-3.5 font-semibold text-slate-800">{(inv as any).studentName || inv.childId || 'Học sinh'}</td>
                  <td className="p-3.5 font-bold text-slate-800">{money(inv.totalAmount)} đ</td>
                  <td className="p-3.5 text-emerald-600 font-bold">{money(inv.paidAmount)} đ</td>
                  <td className="p-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {inv.status === 'Paid' ? 'Đã thu đủ' : 'Chưa thu đủ'}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button onClick={() => onOpenInvoiceDetail(inv)} className="p-1.5 text-slate-400 hover:text-slate-600">
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">Không có hóa đơn nào phù hợp</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-rose-100 flex justify-end">
          <Pagination
            currentPage={invoicePage}
            pageSize={8}
            totalItems={invoices.length}
            totalPages={Math.ceil(invoices.length / 8) || 1}
            onPageChange={setInvoicePage}
          />
        </div>
      </div>
    </div>
  )
}
