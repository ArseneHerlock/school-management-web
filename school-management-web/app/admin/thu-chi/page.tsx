"use client";

import { useEffect, useMemo, useState } from "react";
import { Receipt, Layers, Users, Utensils } from "lucide-react";
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
import { TabItem } from "@/app/components/ui/TabsNav";
import { AdminBillingTab, StudentDebtRow } from "./types";
import {
  money,
  computeStudentsDebtList,
  computeFinancialStats,
} from "./financialUtils";
import ThuChiHeader from "./components/ThuChiHeader";
import ThuChiDashboard from "./components/ThuChiDashboard";
import ThuChiFees from "./components/ThuChiFees";
import ThuChiStudents from "./components/ThuChiStudents";
import ThuChiModals from "./components/ThuChiModals";
import ThuChiMealDeduction from "./components/ThuChiMealDeduction";

export default function ThuChiPage() {
  const [activeTab, setActiveTab] = useState<AdminBillingTab>("dashboard");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const [fees, setFees] = useState<FeeItem[]>([]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [settledStudentIds, setSettledStudentIds] = useState<Set<string>>(
    new Set()
  );

  const currentSchoolYear = `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
  const [schoolYear] = useState<string>(currentSchoolYear);

  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<
    "ALL" | "PAID" | "DEBT"
  >("ALL");
  const [invoicePage, setInvoicePage] = useState(1);
  const [selectedClassFilter, setSelectedClassFilter] = useState("");
  const [debtStatusFilter, setDebtStatusFilter] = useState<
    "ALL" | "DEBT" | "SETTLED"
  >("ALL");
  const [searchStudent, setSearchStudent] = useState("");
  const [studentPage, setStudentPage] = useState(1);

  const [feeModalOpen, setFeeModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeItem | null>(null);
  const [feeForm, setFeeForm] = useState({
    name: "",
    chargeType: ChargeType.Tuition,
    amount: 0,
    description: "",
    schoolYear: currentSchoolYear,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(
    null
  );
  const [settlingStudent, setSettlingStudent] = useState<StudentDebtRow | null>(
    null
  );

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
    () =>
      computeStudentsDebtList(
        students,
        classes,
        invoices,
        settledStudentIds,
        totalStandardPerChild
      ),
    [students, classes, invoices, settledStudentIds, totalStandardPerChild]
  );

  const financialStats = useMemo(
    () => computeFinancialStats(studentsDebtList),
    [studentsDebtList]
  );

  const feeStructureChartData = useMemo(
    () => fees.map((f) => ({ name: f.name, amount: f.amount })),
    [fees]
  );

  const invoiceStatusChartData = useMemo(
    () => [
      {
        name: "Đã hoàn thành",
        value: financialStats.paidStudentsCount,
        color: "#10b981",
      },
      {
        name: "Còn công nợ",
        value: financialStats.debtStudentsCount,
        color: "#f43f5e",
      },
    ],
    [financialStats]
  );

  const paginatedInvoices = useMemo(() => {
    let list = invoices;
    if (invoiceStatusFilter === "PAID")
      list = list.filter((i) => i.status === "Paid");
    if (invoiceStatusFilter === "DEBT")
      list = list.filter((i) => i.status !== "Paid");
    const start = (invoicePage - 1) * 8;
    return list.slice(start, start + 8);
  }, [invoices, invoiceStatusFilter, invoicePage]);

  const handleSaveFee = async () => {
    setIsSubmitting(true);
    try {
      if (editingFee) {
        await updateFee(editingFee.id, feeForm);
      } else {
        await createFee({
          ...feeForm,
          unit: "tháng",
          effectiveFrom: new Date().toISOString(),
        });
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

  const tabs: TabItem<AdminBillingTab>[] = [
    { id: "dashboard", label: "Tổng quan tài chính", icon: Receipt },
    {
      id: "fees",
      label: "Cấu hình biểu phí",
      icon: Layers,
      badge: fees.length,
    },
    {
      id: "students",
      label: "Công nợ học sinh",
      icon: Users,
      badge: financialStats.debtStudentsCount || undefined,
    },
    {
      id: "meal-deduction",
      label: "Khấu trừ tiền ăn",
      icon: Utensils,
    },
  ];

  return (
    <div className="space-y-6">
      <ThuChiHeader
        loading={loading}
        onRefresh={() => void loadData()}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        notice={notice}
        onClearNotice={() => setNotice("")}
      />

      {activeTab === "dashboard" && (
        <ThuChiDashboard
          financialStats={financialStats}
          schoolYear={schoolYear}
          feeStructureChartData={feeStructureChartData}
          invoiceStatusChartData={invoiceStatusChartData}
          invoices={invoices}
          invoiceStatusFilter={invoiceStatusFilter}
          setInvoiceStatusFilter={setInvoiceStatusFilter}
          paginatedInvoices={paginatedInvoices}
          invoicePage={invoicePage}
          setInvoicePage={setInvoicePage}
          money={money}
          onOpenInvoiceDetail={setSelectedInvoice}
        />
      )}

      {activeTab === "fees" && (
        <ThuChiFees
          fees={fees}
          schoolYear={schoolYear}
          money={money}
          onOpenCreateFee={() => {
            setEditingFee(null);
            setFeeForm({
              name: "",
              chargeType: ChargeType.Tuition,
              amount: 0,
              description: "",
              schoolYear,
            });
            setFeeModalOpen(true);
          }}
          onOpenEditFee={(f) => {
            setEditingFee(f);
            setFeeForm({
              name: f.name,
              chargeType: f.chargeType,
              amount: f.amount,
              description: f.description || "",
              schoolYear: f.schoolYear || schoolYear,
            });
            setFeeModalOpen(true);
          }}
          onDeleteFee={handleDeleteFee}
        />
      )}

      {activeTab === "students" && (
        <ThuChiStudents
          studentsDebtList={studentsDebtList}
          classes={classes}
          selectedClassFilter={selectedClassFilter}
          setSelectedClassFilter={setSelectedClassFilter}
          debtStatusFilter={debtStatusFilter}
          setDebtStatusFilter={setDebtStatusFilter}
          searchStudent={searchStudent}
          setSearchStudent={setSearchStudent}
          currentPage={studentPage}
          setCurrentPage={setStudentPage}
          pageSize={10}
          money={money}
          onSettleDebt={setSettlingStudent}
          onRevertDebt={handleRevertDebt}
        />
      )}

      {activeTab === "meal-deduction" && (
        <ThuChiMealDeduction classes={classes} />
      )}

      <ThuChiModals
        feeModalOpen={feeModalOpen}
        onCloseFeeModal={() => setFeeModalOpen(false)}
        editingFee={editingFee}
        feeForm={feeForm}
        setFeeForm={setFeeForm}
        onSaveFee={handleSaveFee}
        isSubmitting={isSubmitting}
        selectedInvoice={selectedInvoice}
        onCloseInvoiceDetail={() => setSelectedInvoice(null)}
        settlingStudent={settlingStudent}
        onCloseSettleModal={() => setSettlingStudent(null)}
        onConfirmSettle={handleSettleDebtConfirmed}
        money={money}
      />
    </div>
  );
}
