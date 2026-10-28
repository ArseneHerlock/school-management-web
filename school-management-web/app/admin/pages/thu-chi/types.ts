import { FeeItem, InvoiceItem, ChargeType } from '@/lib/billing'

export type AdminBillingTab = 'dashboard' | 'fees' | 'students'

export interface StudentDebtRow {
  id: string
  tenHocSinh: string
  lopId?: string
  className: string
  gradeName?: string
  ngaySinh?: string
  gioiTinh?: string
  totalRequired: number
  paidAmount: number
  debtAmount: number
  isSettled: boolean
  invoiceId?: string
}

export interface FinancialStats {
  totalEstimatedRevenue: number
  totalCollected: number
  totalDebt: number
  collectionRate: number
  paidStudentsCount: number
  debtStudentsCount: number
}
