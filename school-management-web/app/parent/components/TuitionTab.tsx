'use client'

import { useEffect, useMemo, useState } from 'react'
import { LayoutGrid, Loader2, Utensils, CheckCircle2, ShieldCheck, Sparkles, BookOpen } from 'lucide-react'
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
} from "@/services/billing"
import TuitionSummaryCards from './tuition/TuitionSummaryCards'
import TuitionPeriodsTable from './tuition/TuitionPeriodsTable'
import OtherFeesTable from './tuition/OtherFeesTable'
import TuitionPaymentModal from './tuition/TuitionPaymentModal'
import TuitionSkeleton from './tuition/TuitionSkeleton'

const money = (n: any) => Number(n || 0).toLocaleString('vi-VN')

interface TuitionTabProps {
  child: ChildInfo
  items?: any[]
  history?: any[]
  parentId?: string | null
}

// Danh mục các khoản thu dịch vụ mầm non chuẩn hóa theo Nghị định số 238/2025/NĐ-CP & Nghị quyết HĐND
const PRESCHOOL_FEE_BREAKDOWN = [
  {
    name: 'Học phí mầm non (Miễn 100% theo Nghị định 238/2025/NĐ-CP)',
    amount: 0,
    originalAmount: 160000,
    chargeType: 1,
    isMeal: false,
    isExempt: true,
  },
  {
    name: 'Tiền ăn bán trú mầm non (Bữa chính trưa + bữa xế - 45.000 đ/ngày)',
    amount: 900000,
    originalAmount: 900000,
    chargeType: 2,
    isMeal: true,
  },
  {
    name: 'Dịch vụ chăm sóc & nuôi dưỡng bán trú (Theo Nghị quyết HĐND)',
    amount: 350000,
    originalAmount: 350000,
    chargeType: 4,
    isMeal: false,
  },
  {
    name: 'Dịch vụ nước uống tinh khiết cho học sinh',
    amount: 20000,
    originalAmount: 20000,
    chargeType: 6,
    isMeal: false,
  },
  {
    name: 'Học phẩm & học liệu phục vụ học tập, vui chơi trải nghiệm',
    amount: 30000,
    originalAmount: 30000,
    chargeType: 6,
    isMeal: false,
  },
  {
    name: 'Trang thiết bị, đồ dùng bán trú cá nhân (chăn, gối, khay ăn)',
    amount: 20000,
    originalAmount: 20000,
    chargeType: 6,
    isMeal: false,
  },
  {
    name: 'Hoạt động làm quen tiếng Anh & Ngoại khóa năng khiếu (Tự nguyện)',
    amount: 200000,
    originalAmount: 200000,
    chargeType: 5,
    isMeal: false,
  },
]

export default function TuitionTab({ child }: TuitionTabProps) {
  const [selectedSemester, setSelectedSemester] = useState<string>('ALL')
  const [activeSubTab, setActiveSubTab] = useState<'hoc_phi' | 'bieu_phi'>('hoc_phi')
  const [expandedPeriods, setExpandedPeriods] = useState<Record<string, boolean>>({})

  const [loading, setLoading] = useState<boolean>(true)
  const [liveFees, setLiveFees] = useState<FeeItem[]>([])
  const [liveInvoices, setLiveInvoices] = useState<InvoiceItem[]>([])
  const [liveBillings, setLiveBillings] = useState<BillingPeriodItem[]>([])

  const [payModalOpen, setPayModalOpen] = useState(false)
  const [paying, setPaying] = useState(false)
  const [paySuccess, setPaySuccess] = useState(false)

  // Khấu trừ tiền ăn do nghỉ học có phép (định mức 45.000 đ/ngày)
  const [mealDeduction, setMealDeduction] = useState<{
    absentDaysCount: number;
    deductionAmount: number;
    dailyRate: number;
    finalMealFee: number;
    absentDetails: any[];
  } | null>(null)

  const fetchBillingData = async () => {
    setLoading(true)
    try {
      const [feesRes, invoicesRes, billingsRes, mealRes] = await Promise.allSettled([
        getFees(),
        child?.id ? getInvoices({ childId: child.id }) : getInvoices(),
        child?.id ? getBillings({ childId: child.id }) : getBillings(),
        child?.id
          ? fetch(`/api/tuition/meal-deduction?childId=${child.id}`).then((r) =>
              r.ok ? r.json() : null
            )
          : Promise.resolve(null),
      ])

      if (feesRes.status === 'fulfilled') setLiveFees(feesRes.value)
      if (invoicesRes.status === 'fulfilled') setLiveInvoices(invoicesRes.value)
      if (billingsRes.status === 'fulfilled') setLiveBillings(billingsRes.value)
      if (mealRes.status === 'fulfilled' && mealRes.value) {
        setMealDeduction(mealRes.value)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void fetchBillingData() }, [child?.id])

  const semestersList = useMemo(() => {
    const list = [
      { id: 'ALL', label: 'Tất cả các tháng / đợt' },
      { id: '2026-2027', label: 'Năm học 2026-2027' },
    ]
    return list
  }, [])

  // Biểu phí niêm yết của trường (tab 2)
  const otherFeesData = useMemo(() => {
    return liveFees.map((fee, idx) => ({
      stt: idx + 1,
      tenKhoan: fee.name,
      chargeType: fee.chargeType,
      mucNop: Number(fee.amount || 0),
      unit: fee.unit || 'tháng',
      moTa: fee.description || '',
      batBuoc: !String(fee.name).includes('Tự nguyện') && !String(fee.name).includes('xe đưa đón'),
    }))
  }, [liveFees])

  const otherFeesTotals = useMemo(() => ({
    totalMucNop: otherFeesData.reduce((s, x) => s + x.mucNop, 0),
    totalSoTienNop: 0,
    totalCongNo: 0,
  }), [otherFeesData])

  // Xây dựng danh sách hóa đơn học phí mầm non theo từng tháng
  const tuitionPeriods = useMemo(() => {
    const childInvoices = liveInvoices.filter(
      (inv) => !child?.id || String(inv.childId).toLowerCase() === String(child.id).toLowerCase()
    )

    // Nếu học sinh có hóa đơn trong CSDL
    if (childInvoices.length > 0) {
      return childInvoices.map((inv, idx) => {
        const isPaid = inv.status === 'Paid' || inv.status === '2' || (inv as any).status === 2 || Number(inv.outstandingAmount || 0) <= 0
        const invNum = inv.invoiceNumber || `INV-${idx + 1}`
        
        // Trích xuất tháng từ số hóa đơn (ví dụ: INV-202611-xxx -> Tháng 11/2026)
        let monthLabel = `Hóa đơn ${invNum}`
        const matchMonth = invNum.match(/INV-(\d{4})(\d{2})/)
        if (matchMonth) {
          const y = matchMonth[1]
          const m = parseInt(matchMonth[2], 10)
          monthLabel = `Phiếu báo học phí & tiền ăn Tháng ${m}/${y} (${invNum})`
        }

        // Tạo các dòng chi tiết cho từng hóa đơn
        const items = PRESCHOOL_FEE_BREAKDOWN.map((bf) => {
          let originalAmount = bf.originalAmount || bf.amount
          let discount = (bf as any).isExempt ? originalAmount : 0

          // Nếu là tiền ăn bán trú và bé có ngày nghỉ được khấu trừ
          if (bf.isMeal && mealDeduction && mealDeduction.deductionAmount > 0) {
            discount = mealDeduction.deductionAmount
          }

          const finalAmount = Math.max(0, originalAmount - discount)
          const paid = isPaid ? finalAmount : 0
          const debt = isPaid ? 0 : finalAmount

          return {
            noiDung: bf.isMeal && discount > 0
              ? `${bf.name} (Đã trừ ${mealDeduction?.absentDaysCount} ngày nghỉ phép)`
              : bf.name,
            mucPhiBanDau: originalAmount,
            soTienGiam: discount,
            mucNop: finalAmount,
            daNop: paid,
            congNo: debt,
          }
        })

        const subtotalMucNop = items.reduce((s, x) => s + x.mucNop, 0)
        const subtotalDaNop = isPaid ? subtotalMucNop : Number(inv.paidAmount || 0)
        const subtotalCongNo = isPaid ? 0 : Math.max(0, subtotalMucNop - subtotalDaNop)

        return {
          id: inv.id || invNum,
          name: monthLabel,
          items,
          subtotalMucNop,
          subtotalDaNop,
          subtotalCongNo,
        }
      })
    }

    // Dự phòng khi chưa có hóa đơn: tạo đợt thu tháng hiện tại
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()
    const fallbackDiscount = mealDeduction?.deductionAmount || 0

    const items = PRESCHOOL_FEE_BREAKDOWN.map((bf) => {
      const originalAmount = bf.originalAmount || bf.amount
      const discount = (bf as any).isExempt ? originalAmount : (bf.isMeal ? fallbackDiscount : 0)
      const finalAmount = Math.max(0, originalAmount - discount)
      return {
        noiDung: bf.isMeal && discount > 0
          ? `${bf.name} (Đã trừ ${mealDeduction?.absentDaysCount} ngày nghỉ phép)`
          : bf.name,
        mucPhiBanDau: originalAmount,
        soTienGiam: discount,
        mucNop: finalAmount,
        daNop: 0,
        congNo: finalAmount,
      }
    })

    const subtotalMucNop = items.reduce((s, x) => s + x.mucNop, 0)
    return [
      {
        id: `thang-${currentMonth}`,
        name: `Phiếu báo học phí & tiền ăn bán trú Tháng ${currentMonth}/${currentYear}`,
        items,
        subtotalMucNop,
        subtotalDaNop: 0,
        subtotalCongNo: subtotalMucNop,
      },
    ]
  }, [liveInvoices, child?.id, mealDeduction])

  const totals = useMemo(() => {
    let mucNop = 0, daNop = 0, congNo = 0
    tuitionPeriods.forEach((p) => {
      mucNop += p.subtotalMucNop
      daNop += p.subtotalDaNop
      congNo += p.subtotalCongNo
    })
    return { mucNop, daNop, congNo }
  }, [tuitionPeriods])

  const handleExecutePayment = async () => {
    setPaying(true)
    try {
      const targetInvoice = liveInvoices.find((i) => Number(i.outstandingAmount || 0) > 0) || liveInvoices[0]
      if (targetInvoice) {
        await createPayment({
          invoiceId: targetInvoice.id,
          amount: totals.congNo || 3240000,
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
          <div className="h-9 w-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-xs">
            <LayoutGrid size={19} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Học phí & Tiền ăn bán trú mầm non</h2>
            <p className="text-xs text-slate-400">Theo dõi chi tiết các khoản thu và hoàn trả tiền ăn của bé</p>
          </div>
        </div>

        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="rounded-2xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 outline-none focus:border-rose-400 shadow-xs"
        >
          {semestersList.map((s) => (<option key={s.id} value={s.id}>{s.label}</option>))}
        </select>
      </div>

      {/* Banner chính sách miễn học phí theo Nghị định 238/2025/NĐ-CP */}
      <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-3.5 text-xs text-sky-950 flex items-start gap-2.5">
        <ShieldCheck size={18} className="text-sky-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <p className="font-bold text-sky-900 mb-0.5">
            Chính sách miễn học phí mầm non (Nghị định số 238/2025/NĐ-CP của Chính phủ)
          </p>
          <p className="text-sky-800 text-[11px]">
            Trẻ mầm non được <strong>miễn 100% học phí chính khóa</strong>. Các khoản đóng góp hàng tháng là dịch vụ phục vụ, hỗ trợ hoạt động giáo dục và nuôi dưỡng bán trú theo đúng Danh mục của HĐND cấp tỉnh ban hành. Tiền ăn bán trú (45.000 đ/ngày) được hoàn trả trực tiếp khi trẻ nghỉ phép có đơn hợp lệ.
          </p>
        </div>
      </div>

      {/* Subtle top progress bar during background refresh */}
      {loading && liveFees.length > 0 && (
        <div className="h-0.5 w-full bg-gradient-to-r from-rose-500 via-pink-400 to-rose-500 animate-pulse rounded-full" />
      )}

      {loading && liveFees.length === 0 ? (
        <TuitionSkeleton />
      ) : (
        <>
          {/* Thẻ Khấu trừ tiền ăn do nghỉ học có phép */}
          {mealDeduction && (
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-3xl p-4 sm:p-5 border border-emerald-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0 shadow-sm">
                  <Utensils size={22} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
                      Cắt suất ăn & Khấu trừ hoàn trả bán trú
                    </span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={11} /> Đã đối soát chuyên cần
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Bé có <strong>{mealDeduction.absentDaysCount} ngày</strong> nghỉ học có phép trong tháng • Định mức hoàn tiền: <strong>{money(mealDeduction.dailyRate)} đ/ngày</strong>
                  </div>
                </div>
              </div>
              <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-emerald-200/60 w-full sm:w-auto">
                <div className="text-base sm:text-lg font-black text-emerald-700">
                  {mealDeduction.deductionAmount > 0
                    ? `- ${money(mealDeduction.deductionAmount)} đ`
                    : '0 đ (Bé đi học đầy đủ)'}
                </div>
                <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                  Tiền ăn bán trú thực nộp: <strong className="text-slate-800">{money(mealDeduction.finalMealFee)} đ</strong>
                </div>
              </div>
            </div>
          )}

          {/* 3 Thẻ Tổng quan: Tổng mức thu - Đã thanh toán - Còn công nợ */}
          <TuitionSummaryCards
            totalMucNop={totals.mucNop}
            totalDaNop={totals.daNop}
            totalCongNo={totals.congNo}
            money={money}
            onOpenPayModal={() => { setPaySuccess(false); setPayModalOpen(true); }}
          />

          {/* Tabs chuyển đổi: Hóa đơn hàng tháng vs Biểu phí niêm yết */}
          <div className="flex items-center gap-2 border-b border-rose-100 pb-2">
            <button
              onClick={() => setActiveSubTab('hoc_phi')}
              className={`rounded-2xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'hoc_phi'
                  ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-rose-50'
              }`}
            >
              Hóa đơn học phí & Tiền ăn theo tháng ({tuitionPeriods.length} đợt)
            </button>
            <button
              onClick={() => setActiveSubTab('bieu_phi')}
              className={`rounded-2xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'bieu_phi'
                  ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-rose-50'
              }`}
            >
              Biểu phí niêm yết & Dịch vụ tự nguyện ({otherFeesData.length})
            </button>
          </div>

          {activeSubTab === 'hoc_phi' ? (
            <TuitionPeriodsTable
              periods={tuitionPeriods}
              expandedPeriods={expandedPeriods}
              togglePeriod={(id) => setExpandedPeriods((p) => ({ ...p, [id]: p[id] === undefined ? false : !p[id] }))}
              money={money}
            />
          ) : (
            <OtherFeesTable
              otherFeesData={otherFeesData}
              otherFeesTotals={otherFeesTotals}
              money={money}
            />
          )}
        </>
      )}

      {/* Modal thanh toán chuyển khoản VietQR */}
      <TuitionPaymentModal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        payAmount={totals.congNo || 3240000}
        money={money}
        child={child}
        paying={paying}
        paySuccess={paySuccess}
        onExecutePayment={handleExecutePayment}
      />
    </div>
  )
}