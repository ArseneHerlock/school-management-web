'use client'

import { useEffect, useMemo, useState } from 'react'
import { LayoutGrid, Loader2 } from 'lucide-react'
import { ChildInfo } from '../types'
import {
  FeeItem,
  InvoiceItem,
  BillingPeriodItem,
  ChargeType,
  getFees,
  getInvoices,
  getBillings,
  createPayment,
} from '@/lib/billing'
import TuitionSummaryCards from './tuition/TuitionSummaryCards'
import TuitionPeriodsTable from './tuition/TuitionPeriodsTable'
import OtherFeesTable from './tuition/OtherFeesTable'
import TuitionPaymentModal from './tuition/TuitionPaymentModal'

const money = (n: any) => Number(n || 0).toLocaleString('vi-VN')

interface TuitionTabProps {
  child: ChildInfo
  items?: any[]
  history?: any[]
  parentId?: string | null
}

export default function TuitionTab({ child }: TuitionTabProps) {
  const [selectedSemester, setSelectedSemester] = useState<string>('ALL')
  const [activeSubTab, setActiveSubTab] = useState<'hoc_phi' | 'mon_hoc'>('hoc_phi')
  const [expandedPeriods, setExpandedPeriods] = useState<Record<string, boolean>>({})

  const [loading, setLoading] = useState<boolean>(true)
  const [liveFees, setLiveFees] = useState<FeeItem[]>([])
  const [liveInvoices, setLiveInvoices] = useState<InvoiceItem[]>([])
  const [liveBillings, setLiveBillings] = useState<BillingPeriodItem[]>([])

  const [payModalOpen, setPayModalOpen] = useState(false)
  const [paying, setPaying] = useState(false)
  const [paySuccess, setPaySuccess] = useState(false)

  const fetchBillingData = async () => {
    setLoading(true)
    try {
      const [feesRes, invoicesRes, billingsRes] = await Promise.allSettled([
        getFees(),
        child?.id ? getInvoices({ childId: child.id }) : getInvoices(),
        child?.id ? getBillings({ childId: child.id }) : getBillings(),
      ])

      if (feesRes.status === 'fulfilled') setLiveFees(feesRes.value)
      if (invoicesRes.status === 'fulfilled') setLiveInvoices(invoicesRes.value)
      if (billingsRes.status === 'fulfilled') setLiveBillings(billingsRes.value)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void fetchBillingData() }, [child?.id])

  const semestersList = useMemo(() => {
    const years = new Set<string>()
    liveFees.forEach((f) => { if (f.schoolYear) years.add(f.schoolYear) })
    liveBillings.forEach((b) => {
      if (b.billingPeriod) years.add(b.billingPeriod)
      if (b.schoolYear) years.add(b.schoolYear)
    })
    const list = [{ id: 'ALL', label: 'Tất cả niên khóa' }]
    Array.from(years).sort().reverse().forEach((y) => list.push({ id: y, label: y }))
    if (list.length === 1) {
      const curYear = `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
      list.push({ id: curYear, label: curYear })
    }
    return list
  }, [liveFees, liveBillings])

  const otherFeesData = useMemo(() => {
    const raw = liveFees.filter((f) => f.chargeType !== ChargeType.Tuition)
    const filtered = selectedSemester === 'ALL' ? raw : raw.filter((f) => f.schoolYear === selectedSemester)
    return filtered.map((fee, idx) => {
      const childInvoice = liveInvoices.find((i) => String(i.childId).toLowerCase() === String(child?.id || '').toLowerCase()) || liveInvoices[0]
      const isPaid = childInvoice && Number(childInvoice.outstandingAmount || 0) <= 0
      const amount = Number(fee.amount || 0)
      return {
        stt: idx + 1,
        maKhoan: fee.id ? fee.id.slice(0, 8).toUpperCase() : `KTT-${idx + 1}`,
        tenKhoan: fee.name,
        mucNop: amount,
        batBuoc: fee.isMandatory !== false,
        soTienNop: isPaid ? amount : 0,
        congNo: isPaid ? 0 : amount,
      }
    })
  }, [liveFees, liveInvoices, child?.id, selectedSemester])

  const otherFeesTotals = useMemo(() => ({
    totalMucNop: otherFeesData.reduce((s, x) => s + x.mucNop, 0),
    totalSoTienNop: otherFeesData.reduce((s, x) => s + x.soTienNop, 0),
    totalCongNo: otherFeesData.reduce((s, x) => s + x.congNo, 0),
  }), [otherFeesData])

  const tuitionPeriods = useMemo(() => {
    const tuitionFees = liveFees.filter((f) => f.chargeType === ChargeType.Tuition)
    const periodsMap: Record<string, any[]> = {}

    tuitionFees.forEach((f) => {
      const periodKey = f.schoolYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
      if (!periodsMap[periodKey]) periodsMap[periodKey] = []
      const childInvoice = liveInvoices.find((i) => String(i.childId).toLowerCase() === String(child?.id || '').toLowerCase()) || liveInvoices[0]
      const isPaid = childInvoice && Number(childInvoice.outstandingAmount || 0) <= 0
      const discount = childInvoice ? Number(childInvoice.discountAmount || 0) : 0
      const amount = Number(f.amount || 0)
      const finalAmount = Math.max(0, amount - discount)

      periodsMap[periodKey].push({
        noiDung: f.name,
        mucPhiBanDau: amount,
        soTienGiam: discount,
        mucNop: finalAmount,
        daNop: isPaid ? finalAmount : 0,
        congNo: isPaid ? 0 : finalAmount,
      })
    })

    if (tuitionFees.length === 0 && liveInvoices.length > 0) {
      liveInvoices.forEach((inv, idx) => {
        const periodKey = inv.invoiceNumber ? `Hóa đơn ${inv.invoiceNumber}` : `Đợt thu ${idx + 1}`
        if (!periodsMap[periodKey]) periodsMap[periodKey] = []
        const isPaid = Number(inv.outstandingAmount || 0) <= 0
        periodsMap[periodKey].push({
          noiDung: `Học phí theo hóa đơn ${inv.invoiceNumber || inv.id.slice(0, 8)}`,
          mucPhiBanDau: Number(inv.totalAmount || 0) + Number(inv.discountAmount || 0),
          soTienGiam: Number(inv.discountAmount || 0),
          mucNop: Number(inv.totalAmount || 0),
          daNop: Number(inv.paidAmount || 0),
          congNo: isPaid ? 0 : Number(inv.outstandingAmount || inv.totalAmount || 0),
        })
      })
    }

    return Object.entries(periodsMap).map(([name, items]) => ({
      id: name,
      name,
      items,
      subtotalMucNop: items.reduce((s, x) => s + x.mucNop, 0),
      subtotalDaNop: items.reduce((s, x) => s + x.daNop, 0),
      subtotalCongNo: items.reduce((s, x) => s + x.congNo, 0),
    }))
  }, [liveFees, liveInvoices, child?.id])

  const totals = useMemo(() => {
    let mucNop = 0, daNop = 0, congNo = 0
    tuitionPeriods.forEach((p) => {
      mucNop += p.subtotalMucNop
      daNop += p.subtotalDaNop
      congNo += p.subtotalCongNo
    })
    mucNop += otherFeesTotals.totalMucNop
    daNop += otherFeesTotals.totalSoTienNop
    congNo += otherFeesTotals.totalCongNo
    return { mucNop, daNop, congNo }
  }, [tuitionPeriods, otherFeesTotals])

  const handleExecutePayment = async () => {
    setPaying(true)
    try {
      const targetInvoice = liveInvoices.find((i) => Number(i.outstandingAmount || 0) > 0) || liveInvoices[0]
      if (targetInvoice) {
        await createPayment({
          invoiceId: targetInvoice.id,
          amount: totals.congNo || 1000000,
          method: 2,
          idempotencyKey: `pay-${Date.now()}`,
        })
      }
      setPaySuccess(true)
      await fetchBillingData()
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <LayoutGrid size={18} />
          </div>
          <h2 className="text-lg font-black text-slate-800">Tra cứu công nợ & Học phí</h2>
          {loading && <Loader2 size={16} className="animate-spin text-rose-500 ml-2" />}
        </div>

        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="rounded-2xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-rose-400"
        >
          {semestersList.map((s) => (<option key={s.id} value={s.id}>{s.label}</option>))}
        </select>
      </div>

      {/* 3 Thẻ Tổng quan */}
      <TuitionSummaryCards totalMucNop={totals.mucNop} totalDaNop={totals.daNop} totalCongNo={totals.congNo} money={money} onOpenPayModal={() => { setPaySuccess(false); setPayModalOpen(true); }} />

      {/* Tabs chuyển đổi: Học phí chính khóa vs Khoản thu khác */}
      <div className="flex items-center gap-2 border-b border-rose-100 pb-2">
        <button
          onClick={() => setActiveSubTab('hoc_phi')}
          className={`rounded-2xl px-4 py-2 text-xs font-bold transition ${activeSubTab === 'hoc_phi' ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-rose-50'}`}
        >
          Học phí chính khóa ({tuitionPeriods.length} đợt)
        </button>
        <button
          onClick={() => setActiveSubTab('mon_hoc')}
          className={`rounded-2xl px-4 py-2 text-xs font-bold transition ${activeSubTab === 'mon_hoc' ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-rose-50'}`}
        >
          Khoản thu khác ({otherFeesData.length})
        </button>
      </div>

      {activeSubTab === 'hoc_phi' ? (
        <TuitionPeriodsTable periods={tuitionPeriods} expandedPeriods={expandedPeriods} togglePeriod={(id) => setExpandedPeriods((p) => ({ ...p, [id]: p[id] === undefined ? false : !p[id] }))} money={money} />
      ) : (
        <OtherFeesTable otherFeesData={otherFeesData} otherFeesTotals={otherFeesTotals} money={money} />
      )}

      <TuitionPaymentModal isOpen={payModalOpen} onClose={() => setPayModalOpen(false)} payAmount={totals.congNo} money={money} child={child} paying={paying} paySuccess={paySuccess} onExecutePayment={handleExecutePayment} />
    </div>
  )
}
