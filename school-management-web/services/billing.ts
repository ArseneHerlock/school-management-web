import { api, normalizeList } from "./client";

export enum ChargeType {
  Tuition = 1,
  Meal = 2,
  Transportation = 3,
  ExtendedCare = 4,
  Activity = 5,
  OtherService = 6,
}

export const ChargeTypeLabels: Record<number, string> = {
  1: "Học phí chính khóa",
  2: "Tiền ăn bán trú",
  3: "Xe đưa đón",
  4: "Trông muộn / Ngoại khóa",
  5: "Hoạt động dã ngoại / sự kiện",
  6: "Khoản thu khác (Bảo hiểm, Đồng phục...)",
};

export interface FeeItem {
  id: string;
  name: string;
  description?: string | null;
  chargeType: number;
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

/**
 * Lấy danh mục các khoản phí biểu phí theo năm học
 */
export async function getFees(schoolYear?: string): Promise<FeeItem[]> {
  try {
    let targetYear = schoolYear;
    if (!targetYear) {
      const currentYear = new Date().getFullYear();
      targetYear = `${currentYear}-${currentYear + 1}`;
    }

    const encodedYear = encodeURIComponent(targetYear);
    const rawResponse = await api.get<any[]>(
      "billing",
      `/api/billing/fees?schoolYear=${encodedYear}`
    );
    return normalizeList<FeeItem>(rawResponse);
  } catch (error) {
    console.warn("Không thể tải danh sách biểu phí:", error);
    return [];
  }
}

/**
 * Tạo mới một khoản thu phí trong biểu phí
 */
export async function createFee(inputData: CreateFeeInput): Promise<FeeItem> {
  let effectiveFromDate = inputData.effectiveFrom;
  if (effectiveFromDate) {
    effectiveFromDate = effectiveFromDate.slice(0, 10);
  } else {
    effectiveFromDate = new Date().toISOString().slice(0, 10);
  }

  let effectiveToDate: string | null = null;
  if (inputData.effectiveTo) {
    effectiveToDate = inputData.effectiveTo.slice(0, 10);
  }

  const requestPayload = {
    ...inputData,
    amount: Number(inputData.amount),
    chargeType: Number(inputData.chargeType),
    effectiveFrom: effectiveFromDate,
    effectiveTo: effectiveToDate,
  };

  return await api.post<FeeItem>("billing", "/api/billing/fees", requestPayload);
}

/**
 * Cập nhật thông tin khoản phí
 */
export async function updateFee(
  feeId: string,
  updatedData: UpdateFeeInput
): Promise<FeeItem> {
  let resolvedChargeType: number | undefined = undefined;
  if (updatedData.chargeType !== undefined) {
    resolvedChargeType = Number(updatedData.chargeType);
  }

  const requestPayload = {
    ...updatedData,
    amount: Number(updatedData.amount),
    chargeType: resolvedChargeType,
  };

  return await api.put<FeeItem>(
    "billing",
    `/api/billing/fees/${feeId}`,
    requestPayload
  );
}

/**
 * Xóa một khoản phí khỏi biểu phí
 */
export async function deleteFee(feeId: string): Promise<FeeItem> {
  return await api.delete<FeeItem>("billing", `/api/billing/fees/${feeId}`);
}

/**
 * Lấy danh sách hóa đơn theo học sinh, phụ huynh hoặc trạng thái thanh toán
 */
export async function getInvoices(filterOptions?: {
  childId?: string;
  payerId?: string;
  status?: string;
}): Promise<InvoiceItem[]> {
  try {
    const queryParameters = new URLSearchParams();
    if (filterOptions?.childId) {
      queryParameters.set("childId", filterOptions.childId);
    }
    if (filterOptions?.payerId) {
      queryParameters.set("payerId", filterOptions.payerId);
    }
    if (filterOptions?.status) {
      queryParameters.set("status", filterOptions.status);
    }

    let endpointUrl = "/api/billing/invoices";
    const queryString = queryParameters.toString();
    if (queryString.length > 0) {
      endpointUrl = endpointUrl + "?" + queryString;
    }

    const rawResponse = await api.get<any[]>("billing", endpointUrl);
    return normalizeList<InvoiceItem>(rawResponse);
  } catch (error) {
    console.warn("Không thể tải danh sách hóa đơn:", error);
    return [];
  }
}

/**
 * Lấy chi tiết một hóa đơn theo ID
 */
export async function getInvoice(invoiceId: string): Promise<InvoiceItem> {
  return await api.get<InvoiceItem>("billing", `/api/billing/invoices/${invoiceId}`);
}

/**
 * Tạo một hóa đơn mới
 */
export async function createInvoice(invoiceData: CreateInvoiceInput): Promise<InvoiceItem> {
  return await api.post<InvoiceItem>("billing", "/api/billing/invoices", invoiceData);
}

/**
 * Lấy lịch sử giao dịch thanh toán
 */
export async function getPayments(invoiceId?: string): Promise<PaymentItem[]> {
  try {
    let endpointUrl = "/api/billing/payments";
    if (invoiceId) {
      endpointUrl = endpointUrl + `?invoiceId=${encodeURIComponent(invoiceId)}`;
    }
    const rawResponse = await api.get<any[]>("billing", endpointUrl);
    return normalizeList<PaymentItem>(rawResponse);
  } catch (error) {
    console.warn("Không thể tải danh sách thanh toán:", error);
    return [];
  }
}

/**
 * Ghi nhận một khoản thanh toán cho hóa đơn
 */
export async function createPayment(paymentData: CreatePaymentInput): Promise<PaymentItem> {
  return await api.post<PaymentItem>("billing", "/api/billing/payments", paymentData);
}

/**
 * Lấy danh sách kỳ thu học phí
 */
export async function getBillings(filterOptions?: {
  childId?: string;
  payerId?: string;
  schoolYear?: string;
}): Promise<BillingPeriodItem[]> {
  try {
    const queryParameters = new URLSearchParams();
    if (filterOptions?.childId) {
      queryParameters.set("childId", filterOptions.childId);
    }
    if (filterOptions?.payerId) {
      queryParameters.set("payerId", filterOptions.payerId);
    }
    if (filterOptions?.schoolYear) {
      queryParameters.set("schoolYear", filterOptions.schoolYear);
    }

    let endpointUrl = "/api/billing";
    const queryString = queryParameters.toString();
    if (queryString.length > 0) {
      endpointUrl = endpointUrl + "?" + queryString;
    }

    const rawResponse = await api.get<any[]>("billing", endpointUrl);
    return normalizeList<BillingPeriodItem>(rawResponse);
  } catch (error) {
    console.warn("Không thể tải danh sách kỳ thu phí:", error);
    return [];
  }
}

/**
 * Tạo một kỳ thu học phí mới
 */
export async function createBilling(periodData: {
  childId: string;
  payerId: string;
  billingPeriod: string;
  schoolYear: string;
}): Promise<BillingPeriodItem> {
  return await api.post<BillingPeriodItem>("billing", "/api/billing", periodData);
}

/**
 * Lấy toàn bộ biểu phí (không lọc theo năm học)
 */
export async function getAllFees(): Promise<FeeItem[]> {
  const rawResponse = await api.get<any>("billing", "/api/billing/fees");
  return normalizeList<FeeItem>(rawResponse);
}

