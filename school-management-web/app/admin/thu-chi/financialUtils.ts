import { FeeItem, InvoiceItem } from "@/services/billing";
import { StudentDebtRow, FinancialStats } from "./types";

export const money = (n: any) => Number(n || 0).toLocaleString("vi-VN");

export function computeStudentsDebtList(
  students: any[],
  classes: any[],
  invoices: InvoiceItem[],
  settledStudentIds: Set<string>,
  totalStandardPerChild: number
): StudentDebtRow[] {
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
}

export function computeFinancialStats(
  studentsDebtList: StudentDebtRow[]
): FinancialStats {
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
}
