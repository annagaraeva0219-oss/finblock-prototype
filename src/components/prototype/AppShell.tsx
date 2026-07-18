'use client'

import React from 'react'
import {
  LayoutDashboard,
  FileText,
  FileCheck,
  ClipboardList,
  CreditCard,
  TrendingUp,
  CalendarDays,
  Landmark,
  Settings,
  Menu,
  X,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

import DashboardScreen from './DashboardScreen'
import EnterInvoiceScreen from './EnterInvoiceScreen'
import PaymentRequestsScreen from './PaymentRequestsScreen'
import PaymentRequestDetailScreen from './PaymentRequestDetailScreen'
import PaymentRegisterScreen from './PaymentRegisterScreen'
import PaymentOrdersScreen from './PaymentOrdersScreen'
import FinancialPlanningScreen from './FinancialPlanningScreen'
import PaymentCalendarScreen from './PaymentCalendarScreen'
import BankReportsScreen from './BankReportsScreen'
import IntegrationSettingsScreen from './IntegrationSettingsScreen'

const navItems = [
  { id: 'dashboard', label: 'Панель управления', icon: LayoutDashboard },
  { id: 'enter-invoice', label: 'Ввод данных счёта', icon: FileText },
  { id: 'payment-requests', label: 'Заявки на оплату', icon: FileCheck },
  { id: 'payment-register', label: 'Реестр платежей', icon: ClipboardList },
  { id: 'payment-orders', label: 'Платёжные поручения', icon: CreditCard },
  { id: 'financial-planning', label: 'Финансовое планирование', icon: TrendingUp },
  { id: 'payment-calendar', label: 'Платёжный календарь', icon: CalendarDays },
  { id: 'bank-reports', label: 'Банковские отчёты', icon: Landmark },
  { id: 'integration-settings', label: 'Настройки интеграций', icon: Settings },
]

function ScreenRouter() {
  const { currentScreen, selectedRequestId } = useAppStore()

  if (selectedRequestId && currentScreen === 'payment-requests') {
    return <PaymentRequestDetailScreen />
  }

  switch (currentScreen) {
    case 'dashboard':
      return <DashboardScreen />
    case 'enter-invoice':
      return <EnterInvoiceScreen />
    case 'payment-requests':
      return <PaymentRequestsScreen />
    case 'payment-register':
      return <PaymentRegisterScreen />
    case 'payment-orders':
      return <PaymentOrdersScreen />
    case 'financial-planning':
      return <FinancialPlanningScreen />
    case 'payment-calendar':
      return <PaymentCalendarScreen />
    case 'bank-reports':
      return <BankReportsScreen />
    case 'integration-settings':
      return <IntegrationSettingsScreen />
    default:
      return <DashboardScreen />
  }
}

export default function AppShell() {
  const { currentScreen, currentOrgId, organizations, setCurrentScreen, setCurrentOrgId } =
    useAppStore()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const handleNav = (id: string) => {
    setCurrentScreen(id)
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 flex h-full w-64 flex-col border-r bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">F</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">FinBlock</span>
          <button
            className="ml-auto lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <ScrollArea className="flex-1 px-3 py-2">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentScreen === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t p-4">
          <p className="text-xs text-muted-foreground">
            Группа компаний «Стэк»
          </p>
          <p className="text-xs text-muted-foreground">
            Версия прототипа 1.0
          </p>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:px-6">
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden md:block">
            <span className="text-sm text-muted-foreground">Организация:</span>
          </div>

          <Select value={currentOrgId} onValueChange={setCurrentOrgId}>
            <SelectTrigger className="w-[260px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  {org.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center gap-3">
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                АИ
              </div>
              <span className="hidden text-sm font-medium sm:inline-block">
                Иванова А.А.
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-gray-50/50 p-4 lg:p-6">
          <ScreenRouter />
        </main>
      </div>
    </div>
  )
}