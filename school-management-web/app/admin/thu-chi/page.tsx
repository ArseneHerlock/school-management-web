"use client";

import { Receipt, Layers, Users, Utensils } from "lucide-react";
import { ChargeType, FeeItem } from "@/services/billing";
import { TabItem } from "@/app/components/ui/TabsNav";
import { AdminBillingTab } from "./types";
import { money } from "./financialUtils";
import ThuChiHeader from "./components/ThuChiHeader";
import ThuChiDashboard from "./components/ThuChiDashboard";
import ThuChiFees from "./components/ThuChiFees";
import ThuChiStudents from "./components/ThuChiStudents";
import ThuChiModals from "./components/ThuChiModals";
import ThuChiMealDeduction from "./components/ThuChiMealDeduction";
import ThuChiSkeleton from "./components/ThuChiSkeleton";
import { useThuChiPage } from "./useThuChiPage";

export default function ThuChiPage() {
  const {
    activeTab,
    setActiveTab,
    loading,
    notice,
    setNotice,
    fees,
    invoices,
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
  } = useThuChiPage();

  const tabs: TabItem<AdminBillingTab>[] = [
    { id: "dashboard", label: "Tổng quan tài chính", icon: Receipt },
    { id: "fees", label: "Cấu hình biểu phí", icon: Layers, badge: fees.length },
    { id: "students", label: "Công nợ học sinh", icon: Users, badge: financialStats.debtStudentsCount || undefined },
    { id: "meal-deduction", label: "Khấu trừ tiền ăn", icon: Utensils },
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

      {loading && fees.length > 0 && (
        <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 animate-pulse rounded-full" />
      )}

      {loading && fees.length === 0 ? (
        <ThuChiSkeleton />
      ) : (
        <>
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

          {activeTab === "meal-deduction" && <ThuChiMealDeduction classes={classes} />}
        </>
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
