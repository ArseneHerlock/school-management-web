import { useState, useEffect, useMemo } from "react";
import { getStudents, getClasses } from "@/services";
import {
  FeeItem,
  InvoiceItem,
  ChargeType,
  getFees,
  createFee,
  updateFee,
  deleteFee,
  getInvoices,
} from "@/services/billing";
import { AdminBillingTab, StudentDebtRow } from "./types";
import {
  money,
  computeStudentsDebtList,
  computeFinancialStats,
} from "./financialUtils";

export function useThuChiPage() {
  const [activeTab, setActiveTab] = useState<AdminBillingTab>("dashboard");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const [fees, setFees] = useState<FeeItem[]>([]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [settledStudentIds, setSettledStudentIds] = useState<Set<string>>(new Set());

  const currentSchoolYear = `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
  const [schoolYear] = useState<string>(currentSchoolYear);

  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<"ALL" | "PAID" | "DEBT">("ALL");
  const [invoicePage, setInvoicePage] = useState(1);
  const [selectedClassFilter, setSelectedClassFilter] = useState("");
  const [debtStatusFilter, setDebtStatusFilter] = useState<"ALL" | "DEBT" | "SETTLED">("ALL");
  const [searchStudent, setSearchStudent] = useState("");
  const [studentPage, setStudentPage] = useState(1);

  const [feeModalOpen, setFeeModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeItem | null>(null);
  const [feeForm, setFeeForm] = useState<{
    name: string;
    chargeType: ChargeType | number | string;
    amount: number;
    description: string;
    schoolYear: string;
  }>({
    name: "",
    chargeType: ChargeType.Tuition,
    amount: 0,
    description: "",
    schoolYear: currentSchoolYear,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [settlingStudent, setSettlingStudent] = useState<StudentDebtRow | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [feesRes, invsRes, stuRes, clsRes] = await Promise.all([
        getFees(schoolYear),
        getInvoices(),
        getStudents().catch(() => []),
        getClasses().catch(() => []),
      ]);
      setFees(Array.isArray(feesRes) ? feesRes : []);
      setInvoices(Array.isArray(invsRes) ? invsRes : []);
      setStudents(Array.isArray(stuRes) ? stuRes : []);
      setClasses(Array.isArray(clsRes) ? clsRes : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [schoolYear]);

  const totalStandardPerChild = useMemo(
    () => fees.reduce((sum, f) => sum + (Number(f.amount) || 0), 0),
    [fees]
  );

  const studentsDebtList: StudentDebtRow[] = useMemo(
    () => computeStudentsDebtList(students, classes, invoices, settledStudentIds, totalStandardPerChild),
    [students, classes, invoices, settledStudentIds, totalStandardPerChild]
  );

  const financialStats = useMemo(() => computeFinancialStats(studentsDebtList), [studentsDebtList]);
  const feeStructureChartData = useMemo(() => fees.map((f) => ({ name: f.name, amount: f.amount })), [fees]);

  const invoiceStatusChartData = useMemo(
    () => [
      { name: "Đã hoàn thành", value: financialStats.paidStudentsCount, color: "#10b981" },
      { name: "Còn công nợ", value: financialStats.debtStudentsCount, color: "#f43f5e" },
    ],
    [financialStats]
  );

  const paginatedInvoices = useMemo(() => {
    let list = invoices;
    if (invoiceStatusFilter === "PAID") list = list.filter((i) => i.status === "Paid");
    if (invoiceStatusFilter === "DEBT") list = list.filter((i) => i.status !== "Paid");
    const start = (invoicePage - 1) * 8;
    return list.slice(start, start + 8);
  }, [invoices, invoiceStatusFilter, invoicePage]);

  const handleSaveFee = async () => {
    setIsSubmitting(true);
    try {
      const numericChargeType =
        typeof feeForm.chargeType === "number"
          ? feeForm.chargeType
          : (ChargeType as any)[feeForm.chargeType] || 1;

      if (editingFee) {
        await updateFee(editingFee.id, { ...feeForm, chargeType: numericChargeType });
      } else {
        await createFee({ ...feeForm, chargeType: numericChargeType, unit: "tháng", effectiveFrom: new Date().toISOString() });
      }
      setFeeModalOpen(false);
      setNotice("Đã lưu khoản thu thành công!");
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFee = async (fee: FeeItem) => {
    if (!confirm(`Xóa khoản thu "${fee.name}"?`)) return;
    await deleteFee(fee.id);
    setNotice("Đã xóa khoản thu!");
    await loadData();
  };

  const handleSettleDebtConfirmed = () => {
    if (!settlingStudent) return;
    setSettledStudentIds((prev) => new Set(prev).add(settlingStudent.id));
    setSettlingStudent(null);
    setNotice(`Đã xác nhận thu học phí cho bé ${settlingStudent.tenHocSinh}!`);
  };

  const handleRevertDebt = (st: StudentDebtRow) => {
    setSettledStudentIds((prev) => {
      const next = new Set(prev);
      next.delete(st.id);
      return next;
    });
    setNotice(`Đã hoàn tác trạng thái thu tiền của bé ${st.tenHocSinh}!`);
  };

  return {
    activeTab,
    setActiveTab,
    loading,
    notice,
    setNotice,
    fees,
    invoices,
    students,
    classes,
    schoolYear,
    invoiceStatusFilter,
    setInvoiceStatusFilter,
    invoicePage,
    setInvoicePage,
    selectedClassFilter,
    setSelectedClassFilter,
    debtStatusFilter,
    setDebtStatusFilter,
    searchStudent,
    setSearchStudent,
    studentPage,
    setStudentPage,
    feeModalOpen,
    setFeeModalOpen,
    editingFee,
    setEditingFee,
    feeForm,
    setFeeForm,
    isSubmitting,
    selectedInvoice,
    setSelectedInvoice,
    settlingStudent,
    setSettlingStudent,
    loadData,
    studentsDebtList,
    financialStats,
    feeStructureChartData,
    invoiceStatusChartData,
    paginatedInvoices,
    handleSaveFee,
    handleDeleteFee,
    handleSettleDebtConfirmed,
    handleRevertDebt,
  };
}
