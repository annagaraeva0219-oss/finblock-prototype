'use client'

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAppStore } from '@/store/useAppStore'
import { formatRubles, getOrgName } from '@/data/mockData'
import { Clock, CheckCircle, AlertCircle, ArrowUpRight } from 'lucide-react'

const statusColors: Record<string, 'secondary' | 'warning' | 'success' | 'destructive'> = {
  'Новая': 'secondary',
  'На согласовании': 'warning',
  'Согласованная': 'success',
  'Не согласована': 'destructive',
}

export default function DashboardScreen() {
  const { paymentRequests, currentOrgId } = useAppStore()

  const orgRequests = paymentRequests.filter((pr) => pr.organizationId === currentOrgId)
  const pendingApproval = orgRequests.filter((pr) => pr.status === 'На согласовании')
  const approved = orgRequests.filter((pr) => pr.status === 'Согласованная')
  const awaitingPayment = orgRequests.filter((pr) => pr.status === 'Согласованная')

  const kpis = [
    {
      title: 'Заявки на согласовании',
      value: pendingApproval.length,
      subtitle: 'требуют внимания',
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      title: 'Согласовано',
      value: formatRubles(approved.reduce((s, pr) => s + pr.amount, 0)),
      subtitle: `заявок: ${approved.length}`,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Ожидает оплаты',
      value: formatRubles(awaitingPayment.reduce((s, pr) => s + pr.amount, 0)),
      subtitle: `заявок: ${awaitingPayment.length}`,
      icon: AlertCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      title: 'Всего заявок',
      value: orgRequests.length,
      subtitle: 'в текущем периоде',
      icon: ArrowUpRight,
      color: 'text-primary',
      bg: 'bg-gray-100',
    },
  ]

  // Chart data: payments by organization
  const orgPayments = useAppStore.getState().organizations.map((org) => {
    const orgPrs = paymentRequests.filter((pr) => pr.organizationId === org.id && pr.status === 'Согласованная')
    const shortName = org.name.replace('ООО "Стэк-', '').replace('"', '')
    return {
      name: shortName,
      'Сумма (₽)': orgPrs.reduce((s, pr) => s + pr.amount, 0) / 1000,
    }
  })

  const recentRequests = [...orgRequests].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Панель управления</h1>
        <p className="text-muted-foreground">
          Обзор финансовых операций — {getOrgName(currentOrgId)}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.title}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                    <p className="mt-1 text-2xl font-bold">{kpi.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{kpi.subtitle}</p>
                  </div>
                  <div className={`rounded-lg p-2 ${kpi.bg}`}>
                    <Icon className={`h-4 w-4 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Платежи по организациям (согласовано, тыс. ₽)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orgPayments} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" fontSize={12} tick={{ fill: '#6b7280' }} />
                <YAxis fontSize={12} tick={{ fill: '#6b7280' }} />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(0)} тыс. ₽`, 'Сумма']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="Сумма (₽)" fill="#1f2937" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent requests */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Последние заявки на оплату</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>№</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Контрагент</TableHead>
                <TableHead className="text-right">Сумма</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRequests.map((pr) => (
                <TableRow key={pr.id}>
                  <TableCell className="font-medium">{pr.number}</TableCell>
                  <TableCell>{pr.date}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{pr.counterpartyName}</TableCell>
                  <TableCell className="text-right font-medium">{formatRubles(pr.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[pr.status] || 'secondary'}>{pr.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {recentRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Нет заявок для выбранной организации
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}