'use client'

import { create } from 'zustand'
import {
  type PaymentRequest,
  type Invoice,
  type RegisterEntry,
  type PaymentOrder,
  type FinancialPlan,
  type BankStatement,
  type CalendarEntry,
  type Organization,
  type Counterparty,
  type RequestStatus,
  type RegisterStatus,
  type OrderStatus,
  organizations as orgs,
  counterparties as cps,
  paymentRequests as prs,
  invoices as invs,
  registerEntries as reg,
  paymentOrders as pos,
  financialPlan as fp,
  bankStatements as bs,
  calendarEntries as ce,
} from '@/data/mockData'

interface AppState {
  // Current view
  currentScreen: string
  selectedRequestId: string | null
  currentOrgId: string
  sidebarCollapsed: boolean

  // Data
  organizations: Organization[]
  counterparties: Counterparty[]
  paymentRequests: PaymentRequest[]
  invoices: Invoice[]
  registerEntries: RegisterEntry[]
  paymentOrders: PaymentOrder[]
  financialPlan: FinancialPlan[]
  bankStatements: BankStatement[]
  calendarEntries: CalendarEntry[]

  // Actions
  setCurrentScreen: (screen: string) => void
  setSelectedRequestId: (id: string | null) => void
  setCurrentOrgId: (id: string) => void
  toggleSidebar: () => void

  addInvoice: (data: Omit<Invoice, 'id' | 'status' | 'linkedRequestId'>) => string
  addPaymentRequest: (data: Omit<PaymentRequest, 'id' | 'number' | 'date' | 'approvalHistory'>) => string

  submitForApproval: (requestId: string) => void
  approveRequest: (requestId: string) => void
  rejectRequest: (requestId: string) => void

  addToRegister: (requestId: string) => void
  createPaymentOrder: (registerEntryIds: string[]) => string
  exportPaymentOrder: (orderId: string) => void

  updateRegisterEntryStatus: (entryId: string, status: RegisterStatus) => void
}

let requestCounter = 12
let invoiceCounter = 8
let registerCounter = 6
let orderCounter = 6

export const useAppStore = create<AppState>((set, get) => ({
  currentScreen: 'dashboard',
  selectedRequestId: null,
  currentOrgId: 'org-1',
  sidebarCollapsed: false,

  organizations: orgs,
  counterparties: cps,
  paymentRequests: prs,
  invoices: invs,
  registerEntries: reg,
  paymentOrders: pos,
  financialPlan: fp,
  bankStatements: bs,
  calendarEntries: ce,

  setCurrentScreen: (screen) => set({ currentScreen: screen, selectedRequestId: null }),
  setSelectedRequestId: (id) => set({ selectedRequestId: id }),
  setCurrentOrgId: (id) => set({ currentOrgId: id }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  addInvoice: (data) => {
    invoiceCounter++
    const invId = `inv-${invoiceCounter}`
    const invoice: Invoice = {
      ...data,
      id: invId,
      status: 'Обработан',
    }
    set((state) => ({ invoices: [invoice, ...state.invoices] }))

    // Auto-create payment request
    requestCounter++
    const prId = `pr-${requestCounter}`
    const org = get().organizations.find((o) => o.id === data.organizationId)
    const request: PaymentRequest = {
      id: prId,
      number: `ЗО-${String(requestCounter).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      organizationId: data.organizationId,
      counterpartyId: data.counterpartyId,
      counterpartyName: data.counterpartyName,
      amount: data.amount,
      purpose: data.purpose,
      status: 'Новая',
      expenseCategory: data.expenseCategory,
      source: 'auto',
      invoiceId: invId,
      approvalHistory: [
        {
          date: `${new Date().toISOString().split('T')[0]} ${new Date().toTimeString().slice(0, 5)}`,
          action: 'Создана автоматически из счёта',
          user: 'Система',
        },
      ],
    }
    set((state) => ({ paymentRequests: [request, ...state.paymentRequests] }))

    return prId
  },

  addPaymentRequest: (data) => {
    requestCounter++
    const prId = `pr-${requestCounter}`
    const request: PaymentRequest = {
      ...data,
      id: prId,
      number: `ЗО-${String(requestCounter).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      approvalHistory: [
        {
          date: `${new Date().toISOString().split('T')[0]} ${new Date().toTimeString().slice(0, 5)}`,
          action: 'Создана',
          user: 'Иванова А.А.',
        },
      ],
    }
    set((state) => ({ paymentRequests: [request, ...state.paymentRequests] }))
    return prId
  },

  submitForApproval: (requestId) => {
    set((state) => ({
      paymentRequests: state.paymentRequests.map((pr) =>
        pr.id === requestId
          ? {
              ...pr,
              status: 'На согласовании' as RequestStatus,
              approvalHistory: [
                ...pr.approvalHistory,
                {
                  date: `${new Date().toISOString().split('T')[0]} ${new Date().toTimeString().slice(0, 5)}`,
                  action: 'Направлена на согласование',
                  user: 'Петрова М.И.',
                },
              ],
            }
          : pr
      ),
    }))
  },

  approveRequest: (requestId) => {
    set((state) => ({
      paymentRequests: state.paymentRequests.map((pr) =>
        pr.id === requestId
          ? {
              ...pr,
              status: 'Согласованная' as RequestStatus,
              approvalHistory: [
                ...pr.approvalHistory,
                {
                  date: `${new Date().toISOString().split('T')[0]} ${new Date().toTimeString().slice(0, 5)}`,
                  action: 'Согласована',
                  user: 'Сидоров К.В.',
                },
              ],
            }
          : pr
      ),
    }))
  },

  rejectRequest: (requestId) => {
    set((state) => ({
      paymentRequests: state.paymentRequests.map((pr) =>
        pr.id === requestId
          ? {
              ...pr,
              status: 'Не согласована' as RequestStatus,
              approvalHistory: [
                ...pr.approvalHistory,
                {
                  date: `${new Date().toISOString().split('T')[0]} ${new Date().toTimeString().slice(0, 5)}`,
                  action: 'Не согласована — превышение бюджета',
                  user: 'Сидоров К.В.',
                },
              ],
            }
          : pr
      ),
    }))
  },

  addToRegister: (requestId) => {
    const request = get().paymentRequests.find((pr) => pr.id === requestId)
    if (!request) return

    registerCounter++
    const entryId = `re-${registerCounter}`
    const entry: RegisterEntry = {
      id: entryId,
      requestId,
      requestNumber: request.number,
      date: new Date().toISOString().split('T')[0],
      counterpartyName: request.counterpartyName,
      amount: request.amount,
      organizationId: request.organizationId,
      status: 'Ожидает',
    }
    set((state) => ({
      registerEntries: [entry, ...state.registerEntries],
    }))
  },

  createPaymentOrder: (registerEntryIds) => {
    const entries = get().registerEntries.filter((e) => registerEntryIds.includes(e.id))
    if (entries.length === 0) return ''

    orderCounter++
    const poId = `po-${orderCounter}`
    const totalAmount = entries.reduce((sum, e) => sum + e.amount, 0)
    const orgId = entries[0].organizationId

    const order: PaymentOrder = {
      id: poId,
      number: `ПП-${String(orderCounter).padStart(6, '0')}`,
      date: new Date().toISOString().split('T')[0],
      registerEntryIds,
      requestNumbers: entries.map((e) => e.requestNumber),
      payerId: orgId,
      amount: totalAmount,
      status: 'Сформировано',
    }

    set((state) => ({
      paymentOrders: [order, ...state.paymentOrders],
      registerEntries: state.registerEntries.map((e) =>
        registerEntryIds.includes(e.id) ? { ...e, status: 'В поручении' as RegisterStatus, orderId: poId } : e
      ),
    }))

    return poId
  },

  exportPaymentOrder: (orderId) => {
    set((state) => ({
      paymentOrders: state.paymentOrders.map((po) =>
        po.id === orderId ? { ...po, status: 'Экспортировано' as OrderStatus } : po
      ),
      registerEntries: state.registerEntries.map((e) =>
        e.orderId === orderId ? { ...e, status: 'Исполнено' as RegisterStatus } : e
      ),
    }))
  },

  updateRegisterEntryStatus: (entryId, status) => {
    set((state) => ({
      registerEntries: state.registerEntries.map((e) =>
        e.id === entryId ? { ...e, status } : e
      ),
    }))
  },
}))