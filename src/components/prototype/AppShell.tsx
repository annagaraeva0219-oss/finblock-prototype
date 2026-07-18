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
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
  { id: 'financial-planning', label: 'Фин. планирование', icon: TrendingUp },
  { id: 'payment-calendar', label: 'Платёжный календарь', icon: CalendarDays },
  { id: 'bank-reports', label: 'Банковские отчёты', icon: Landmark },
  { id: 'integration-settings', label: 'Настройки', icon: Settings },
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

function NavItem({ item, collapsed, onClick }: { item: typeof navItems[0]; collapsed: boolean; onClick: () => void }) {
  const { currentScreen } = useAppStore()
  const Icon = item.icon
  const isActive = currentScreen === item.id

  const button = (
    <button
      onClick={onClick}
      className={`
        group relative flex items-center rounded-lg text-sm font-medium
        transition-all duration-200 ease-out
        hover:scale-[1.02] active:scale-[0.98]
        ${collapsed
          ? 'mx-auto h-10 w-10 justify-center p-0'
          : 'h-9 w-full gap-3 px-3'
        }
        ${
          isActive
            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        }
      `}
    >
      {/* Active indicator bar */}
      {isActive && (
        <span
          className={`
            absolute rounded-full bg-primary-foreground
            transition-all duration-300 ease-out
            ${collapsed ? 'left-1/2 h-1 w-1 -translate-x-1/2 top-[5px]' : '-left-[13px] top-1/2 h-5 w-1 -translate-y-1/2'}
          `}
        />
      )}

      <Icon className={`h-[18px] w-[18px] shrink-0 transition-transform duration-200 ${!collapsed && 'group-hover:rotate-[-6deg] group-hover:scale-110'}`} />

      {!collapsed && (
        <span className="truncate transition-all duration-200">
          {item.label}
        </span>
      )}

      {/* Hover glow effect */}
      {!isActive && (
        <span
          className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300
            bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5
            group-hover:opacity-100"
        />
      )}
    </button>
  )

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          {button}
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={12}>
          <p className="text-xs font-medium">{item.label}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return button
}

export default function AppShell() {
  const { currentOrgId, organizations, setCurrentOrgId, sidebarCollapsed, toggleSidebar, setCurrentScreen } =
    useAppStore()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleNav = (id: string) => {
    setCurrentScreen(id)
    setMobileOpen(false)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300 lg:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          fixed z-50 flex h-full flex-col border-r bg-white
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          lg:static
          ${sidebarCollapsed ? 'lg:w-[68px]' : 'lg:w-64'}
          ${mobileOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo section */}
        <div className="flex h-14 items-center border-b px-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary
              transition-all duration-300 ease-out
              ${sidebarCollapsed ? 'lg:mx-auto' : ''}
            `}
          >
            <span className="text-sm font-bold text-primary-foreground transition-transform duration-300 hover:rotate-12">
              F
            </span>
          </div>
          <div
            className={`
              flex items-center overflow-hidden
              transition-all duration-300 ease-out
              ${sidebarCollapsed ? 'lg:w-0 lg:opacity-0 lg:ml-0' : 'lg:w-auto lg:opacity-100 lg:ml-2.5'}
              ${mobileOpen ? 'ml-2.5 w-auto opacity-100' : 'w-0 opacity-0'}
            `}
          >
            <span className="whitespace-nowrap text-lg font-bold tracking-tight text-foreground">
              FinBlock
            </span>
          </div>

          {/* Mobile close */}
          <button
            className="ml-auto transition-transform duration-200 hover:rotate-90 lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2 py-2">
          <nav className="flex flex-col gap-1">
            {navItems.map((item, index) => (
              <div
                key={item.id}
                className="transition-all duration-300"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <NavItem
                  item={item}
                  collapsed={sidebarCollapsed}
                  onClick={() => handleNav(item.id)}
                />
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Footer with collapse toggle */}
        <div className="border-t p-2">
          {/* Collapse button (desktop only) */}
          <button
            onClick={toggleSidebar}
            className={`
              group flex w-full items-center rounded-lg text-sm text-muted-foreground
              transition-all duration-200 ease-out
              hover:bg-accent hover:text-accent-foreground
              hover:scale-[1.02] active:scale-[0.98]
              ${sidebarCollapsed ? 'mx-auto h-10 w-10 justify-center p-0' : 'h-9 gap-3 px-3'}
            `}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-0.5" />
            ) : (
              <>
                <PanelLeftClose className="h-[18px] w-[18px] transition-transform duration-300 group-hover:-translate-x-0.5" />
                <span className="truncate">Свернуть</span>
              </>
            )}
          </button>

          {/* Version info */}
          <div
            className={`
              mt-2 overflow-hidden transition-all duration-300 ease-out
              ${sidebarCollapsed ? 'h-0 opacity-0' : 'h-auto opacity-100'}
            `}
          >
            <p className="px-3 pb-1 text-[11px] leading-tight text-muted-foreground/70">
              Группа компаний «Стэк»
            </p>
            <p className="px-3 pb-1 text-[11px] leading-tight text-muted-foreground/70">
              Версия прототипа 1.0
            </p>
          </div>
        </div>
      </aside>

      {/* ===== MAIN AREA ===== */}
      <div className="flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-out">
        {/* Top header */}
        <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:px-6">
          {/* Mobile menu button */}
          <button
            className="transition-transform duration-200 hover:scale-110 active:scale-95 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Desktop sidebar toggle when collapsed */}
          <button
            className={`hidden h-8 w-8 items-center justify-center rounded-md transition-all duration-200
              hover:bg-accent hover:scale-110 active:scale-95
              ${sidebarCollapsed ? 'lg:flex' : 'lg:hidden'}`}
            onClick={toggleSidebar}
            title="Развернуть панель"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="hidden md:block">
            <span className="text-sm text-muted-foreground">Организация:</span>
          </div>

          <Select value={currentOrgId} onValueChange={setCurrentOrgId}>
            <SelectTrigger className="w-[260px] transition-all duration-200 hover:shadow-sm focus:shadow-md">
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
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium
                  text-primary-foreground transition-all duration-200 hover:scale-110 hover:shadow-md
                  hover:shadow-primary/25"
              >
                АИ
              </div>
              <span
                className={`hidden text-sm font-medium transition-all duration-300 sm:inline-block ${
                  sidebarCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'lg:opacity-100 lg:w-auto'
                }`}
              >
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