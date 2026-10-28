"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Receipt, Layers, Users } from "lucide-react";
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
} from "@/lib/billing";
import TabsNav, { TabItem } from "@/app/components/ui/TabsNav";
import { AdminBillingTab, StudentDebtRow } from "./thu-chi/types";
import ThuChiDashboard from "./thu-chi/ThuChiDashboard";
import ThuChiFees from "./thu-chi/ThuChiFees";
import ThuChiStudents from "./thu-chi/ThuChiStudents";
import ThuChiModals from "./thu-chi/ThuChiModals";

const money = (n: any) => Number(n || 0).toLocaleString("vi-VN");

export default function ThuChi() {
  const [activeTab, setActiveTab] = useState<AdminBillingTab>("dashboard");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const [fees, setFees] = useState<FeeItem[]>([]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [settledStudentIds, setSettledStudentIds] = useState<Set<string>>(
    new Set(),
  );

  const currentSchoolYear = `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
  const [schoolYear, setSchoolYear] = useState<string>(currentSchoolYear);

  // Filters
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

  // Modals state
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
    null,
  );
  const [settlingStudent, setSettlingStudent] = useState<StudentDebtRow | null>(
    null,
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
    [fees],
  );

  const studentsDebtList: StudentDebtRow[] = useMemo(() => {
    return students.map((s) => {
      const cls = classes.find((c) => c.id === s.lopId);
      const matchedInv = invoices.find((inv) => inv.childId === s.id);
      const isLocallySettled = settledStudentIds.has(s.id);
      const isPaidOnDb = matchedInv?.status === "Paid";
      const isSettled = isPaidOnDb || isLocallySettled;
      const required = matchedInv
        ? matchedInv.totalAmount
        : totalStandardPerChild;
      const paid = isSettled
        ? required
        : matchedInv
          ? matchedInv.paidAmount
          : 0;
      const debt = Math.max(0, required - paid);

      return {
        id: s.id,
        tenHocSinh: s.tenHocSinh || "Bé chưa đặt tên",
        lopId: s.lopId,
        className: cls?.tenLop || "Chưa xếp lớp",
        totalRequired: required,
        paidAmount: paid,
        debtAmount: debt,
        isSettled,
        invoiceId: matchedInv?.id,
      };
    });
  }, [students, classes, invoices, settledStudentIds, totalStandardPerChild]);

  const financialStats = useMemo(() => {
    let totalEstimated = 0,
      totalCollected = 0,
      paidCount = 0,
      debtCount = 0;
    studentsDebtList.forEach((st) => {
      totalEstimated += st.totalRequired;
      totalCollected += st.paidAmount;
      if (st.isSettled) paidCount++;
      else debtCount++;
    });
    const totalDebt = Math.max(0, totalEstimated - totalCollected);
    const rate =
      totalEstimated > 0
        ? Math.round((totalCollected / totalEstimated) * 100)
        : 0;
    return {
      totalEstimatedRevenue: totalEstimated,
      totalCollected,
      totalDebt,
      collectionRate: rate,
      paidStudentsCount: paidCount,
      debtStudentsCount: debtCount,
    };
  }, [studentsDebtList]);

  const feeStructureChartData = useMemo(
    () => fees.map((f) => ({ name: f.name, amount: f.amount })),
    [fees],
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
    [financialStats],
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold text-rose-500 uppercase">
            Tài chính mầm non
          </span>
          <h1 className="text-2xl font-black text-slate-800">
            Quản lý Thu chi & Học phí
          </h1>
        </div>
        <button
          onClick={() => void loadData()}
          className="inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-rose-50 transition"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Cập
          nhật
        </button>
      </div>

      <TabsNav tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      {notice && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-800 flex justify-between">
          {notice} <button onClick={() => setNotice("")}>×</button>
        </div>
      )}

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
