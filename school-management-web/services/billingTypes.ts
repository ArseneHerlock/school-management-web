export enum ChargeType {
  Tuition = 1,
  Meal = 2,
  Transportation = 3,
  ExtendedCare = 4,
  Activity = 5,
  OtherService = 6,
}

export const ChargeTypeLabels: Record<number | string, string> = {
  1: "Học phí mầm non (Miễn 100% theo NĐ 238/2025/NĐ-CP)",
  2: "Tiền ăn bán trú mầm non (Bữa chính & xế)",
  3: "Dịch vụ xe đưa đón học sinh (Tự nguyện)",
  4: "Dịch vụ chăm sóc & nuôi dưỡng bán trú",
  5: "Ngoại khóa năng khiếu & Kỹ năng sống (Tự nguyện)",
  6: "Học phẩm & Trang thiết bị bán trú",
  Tuition: "Học phí mầm non (Miễn 100% theo NĐ 238/2025/NĐ-CP)",
  Meal: "Tiền ăn bán trú mầm non (Bữa chính & xế)",
  Transportation: "Dịch vụ xe đưa đón học sinh (Tự nguyện)",
  ExtendedCare: "Dịch vụ chăm sóc & nuôi dưỡng bán trú",
  Activity: "Ngoại khóa năng khiếu & Kỹ năng sống (Tự nguyện)",
  OtherService: "Học phẩm & Trang thiết bị bán trú",
};

export function isTuitionCharge(chargeType: any): boolean {
  return chargeType === ChargeType.Tuition || chargeType === 1 || chargeType === "Tuition";
}

export interface FeeItem {
  id: string;
  name: string;
  description?: string | null;
  chargeType: number | string;
  amount: number;
  unit: string;
  schoolYear: string;
  isActive: boolean;
  isMandatory?: boolean;
  code?: string;
}

export interface CreateFeeInput {
  name: string;
  description?: string;
  chargeType: number;
  amount: number;
  unit: string;
  effectiveFrom: string;
  effectiveTo?: string;
  schoolYear: string;
}

export interface UpdateFeeInput {
  name?: string;
  description?: string;
  amount: number;
  unit?: string;
  chargeType?: number;
  schoolYear?: string;
}

export interface InvoiceItemDetail {
  feeId: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateInvoiceInput {
  billingId: string;
  childId: string;
  payerId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItemDetail[];
  discountAmount: number;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  childId: string;
  payerId: string;
  subTotal: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: string;
}

export interface PaymentItem {
  id: string;
  invoiceId: string;
  amount: number;
  status: string;
  externalTransactionId?: string | null;
  method?: number;
  paymentDate?: string;
}

export interface CreatePaymentInput {
  invoiceId: string;
  amount: number;
  method: number;
  idempotencyKey: string;
  externalTransactionId?: string | null;
}

export interface BillingPeriodItem {
  id: string;
  childId: string;
  payerId: string;
  billingPeriod: string;
  schoolYear: string;
  status: string;
}
