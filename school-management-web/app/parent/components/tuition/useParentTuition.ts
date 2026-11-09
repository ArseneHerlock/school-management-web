import { useState, useEffect, useMemo } from 'react';
import {
  FeeItem,
  InvoiceItem,
  BillingPeriodItem,
  getFees,
  getInvoices,
  getBillings,
  createPayment,
} from '@/services/billing';
import { ChildInfo } from '../../types';
import { PRESCHOOL_FEE_BREAKDOWN } from './preschoolFeeConstants';

export function useParentTuition(child?: ChildInfo) {
  const [selectedSemester, setSelectedSemester] = useState<string>('ALL');
  const [activeSubTab, setActiveSubTab] = useState<'hoc_phi' | 'bieu_phi'>('hoc_phi');
  const [expandedPeriods, setExpandedPeriods] = useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState<boolean>(true);
  const [liveFees, setLiveFees] = useState<FeeItem[]>([]);
  const [liveInvoices, setLiveInvoices] = useState<InvoiceItem[]>([]);
  const [liveBillings, setLiveBillings] = useState<BillingPeriodItem[]>([]);

  const [payModalOpen, setPayModalOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

  const [mealDeduction, setMealDeduction] = useState<{
    absentDaysCount: number;
    deductionAmount: number;
    dailyRate: number;
    finalMealFee: number;
    absentDetails: any[];
  } | null>(null);

  const fetchBillingData = async () => {
    setLoading(true);
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
      ]);

      if (feesRes.status === 'fulfilled') setLiveFees(feesRes.value);
      if (invoicesRes.status === 'fulfilled') setLiveInvoices(invoicesRes.value);
      if (billingsRes.status === 'fulfilled') setLiveBillings(billingsRes.value);
      if (mealRes.status === 'fulfilled' && mealRes.value) setMealDeduction(mealRes.value);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchBillingData();
  }, [child?.id]);

  const semestersList = useMemo(() => [
    { id: 'ALL', label: 'Tất cả các tháng / đợt' },
    { id: '2026-2027', label: 'Năm học 2026-2027' },
  ], []);

  const otherFeesData = useMemo(() => {
    return liveFees.map((fee, idx) => ({
      stt: idx + 1,
      tenKhoan: fee.name,
      chargeType: fee.chargeType,
      mucNop: Number(fee.amount || 0),
      unit: fee.unit || 'tháng',
      moTa: fee.description || '',
      batBuoc: !String(fee.name).includes('Tự nguyện') && !String(fee.name).includes('xe đưa đón'),
    }));
  }, [liveFees]);

  const otherFeesTotals = useMemo(() => ({
    totalMucNop: otherFeesData.reduce((s, x) => s + x.mucNop, 0),
    totalSoTienNop: 0,
    totalCongNo: 0,
  }), [otherFeesData]);

  const tuitionPeriods = useMemo(() => {
    const childInvoices = liveInvoices.filter(
      (inv) => !child?.id || String(inv.childId).toLowerCase() === String(child.id).toLowerCase()
    );

    if (childInvoices.length > 0) {
      return childInvoices.map((inv, idx) => {
        const isPaid =
          inv.status === 'Paid' ||
          inv.status === '2' ||
          (inv as any).status === 2 ||
          Number(inv.outstandingAmount || 0) <= 0;
        const invNum = inv.invoiceNumber || `INV-${idx + 1}`;
        let monthLabel = `Hóa đơn ${invNum}`;
        const matchMonth = invNum.match(/INV-(\d{4})(\d{2})/);
        if (matchMonth) {
          const y = matchMonth[1];
          const m = parseInt(matchMonth[2], 10);
          monthLabel = `Phiếu báo học phí & tiền ăn Tháng ${m}/${y} (${invNum})`;
        }

        const items = PRESCHOOL_FEE_BREAKDOWN.map((bf) => {
          const originalAmount = bf.originalAmount || bf.amount;
          let discount = (bf as any).isExempt ? originalAmount : 0;
          if (bf.isMeal && mealDeduction && mealDeduction.deductionAmount > 0) {
            discount = mealDeduction.deductionAmount;
          }
          const finalAmount = Math.max(0, originalAmount - discount);
          const paid = isPaid ? finalAmount : 0;
          const debt = isPaid ? 0 : finalAmount;

          return {
            noiDung: bf.isMeal && discount > 0
              ? `${bf.name} (Đã trừ ${mealDeduction?.absentDaysCount} ngày nghỉ phép)`
              : bf.name,
            mucPhiBanDau: originalAmount,
            soTienGiam: discount,
            mucNop: finalAmount,
            daNop: paid,
            congNo: debt,
          };
        });

        const subtotalMucNop = items.reduce((s, x) => s + x.mucNop, 0);
        const subtotalDaNop = isPaid ? subtotalMucNop : Number(inv.paidAmount || 0);
        const subtotalCongNo = isPaid ? 0 : Math.max(0, subtotalMucNop - subtotalDaNop);

        return {
          id: inv.id || invNum,
          name: monthLabel,
          items,
          subtotalMucNop,
          subtotalDaNop,
          subtotalCongNo,
        };
      });
    }

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const fallbackDiscount = mealDeduction?.deductionAmount || 0;

    const items = PRESCHOOL_FEE_BREAKDOWN.map((bf) => {
      const originalAmount = bf.originalAmount || bf.amount;
      const discount = (bf as any).isExempt ? originalAmount : (bf.isMeal ? fallbackDiscount : 0);
      const finalAmount = Math.max(0, originalAmount - discount);
      return {
        noiDung: bf.isMeal && discount > 0
          ? `${bf.name} (Đã trừ ${mealDeduction?.absentDaysCount} ngày nghỉ phép)`
          : bf.name,
        mucPhiBanDau: originalAmount,
        soTienGiam: discount,
        mucNop: finalAmount,
        daNop: 0,
        congNo: finalAmount,
      };
    });

    const subtotalMucNop = items.reduce((s, x) => s + x.mucNop, 0);
    return [
      {
        id: `thang-${currentMonth}`,
        name: `Phiếu báo học phí & tiền ăn bán trú Tháng ${currentMonth}/${currentYear}`,
        items,
        subtotalMucNop,
        subtotalDaNop: 0,
        subtotalCongNo: subtotalMucNop,
      },
    ];
  }, [liveInvoices, child?.id, mealDeduction]);

  const totals = useMemo(() => {
    let mucNop = 0, daNop = 0, congNo = 0;
    tuitionPeriods.forEach((p) => {
      mucNop += p.subtotalMucNop;
      daNop += p.subtotalDaNop;
      congNo += p.subtotalCongNo;
    });
    return { mucNop, daNop, congNo };
  }, [tuitionPeriods]);

  const handleExecutePayment = async () => {
    setPaying(true);
    try {
      const targetInvoice =
        liveInvoices.find((i) => Number(i.outstandingAmount || 0) > 0) || liveInvoices[0];
      if (targetInvoice) {
        await createPayment({
          invoiceId: targetInvoice.id,
          amount: totals.congNo || 3240000,
          method: 2,
          idempotencyKey: `pay-${Date.now()}`,
        });
      }
      setPaySuccess(true);
      await fetchBillingData();
    } finally {
      setPaying(false);
    }
  };

  return {
    selectedSemester,
    setSelectedSemester,
    activeSubTab,
    setActiveSubTab,
    expandedPeriods,
    setExpandedPeriods,
    loading,
    liveFees,
    payModalOpen,
    setPayModalOpen,
    paying,
    paySuccess,
    setPaySuccess,
    mealDeduction,
    semestersList,
    otherFeesData,
    otherFeesTotals,
    tuitionPeriods,
    totals,
    handleExecutePayment,
  };
}
