'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatRubles, getOrgName, expenseCategories } from '@/data/mockData'
import { Plus, Search } from 'lucide-react'
import CreateRequestDialog from './CreateRequestDialog'

const statusVariant: Record<string, 'secondary' | 'warning' | 'success' | 'destructive'> = {
  'Новая': 'secondary',
  'На согласовании': 'warning',
  'Согласованная': 'success',
  'Не согласована': 'destructive',
}

export default function PaymentRequestsScreen() {
  const { paymentRequests, currentOrgId, organizations, setCurrentScreen, setSelectedRequestId } =
    useAppStore()
  const [orgFilter, setOrgFilter] = useState(currentOrgId)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const filtered = paymentRequests.filter((pr) => {
    if (orgFilter !== 'all' && pr.organizationId !== orgFilter) return false
    if (statusFilter !== 'all' && pr.status !== statusFilter) return false
    if (search && !pr.counterpartyName.toLowerCase().includes(search.toLowerCase()) && !pr.number.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const total = filtered.reduce((s, pr) => s + pr.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Заявки на оплату</h1>
          <p className="text-muted-foreground">
            Управление заявками на оплату — {filtered.length} заявок на сумму {formatRubles(total)}
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Новая заявка
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Организация</label>
              <Select value={orgFilter} onValueChange={setOrgFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все организации</SelectItem>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Статус</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="Новая">Новая</SelectItem>
                  <SelectItem value="На согласовании">На согласовании</SelectItem>
                  <SelectItem value="Согласованная">Согласованная</SelectItem>
                  <SelectItem value="Не согласована">Не согласована</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Поиск</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Контрагент или номер..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="max-h-[500px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>№</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Организация</TableHead>
                  <TableHead>Контрагент</TableHead>
                  <TableHead>Статья</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                  <TableHead>Источник</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((pr) => (
                  <TableRow
                    key={pr.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedRequestId(pr.id)}
                  >
                    <TableCell className="font-medium">{pr.number}</TableCell>
                    <TableCell className="whitespace-nowrap">{pr.date}</TableCell>
                    <TableCell className="text-xs max-w-[120px] truncate">{getOrgName(pr.organizationId)}</TableCell>
                    <TableCell className="text-xs max-w-[150px] truncate">{pr.counterpartyName}</TableCell>
                    <TableCell className="text-xs">{pr.expenseCategory}</TableCell>
                    <TableCell className="text-right font-medium whitespace-nowrap">
                      {formatRubles(pr.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {pr.source === 'auto' ? 'Авто' : 'Вручную'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[pr.status] || 'secondary'}>
                        {pr.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedRequestId(pr.id)
                        }}
                      >
                        Открыть
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                      Заявки не найдены
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <CreateRequestDialog open={showCreate} onOpenChange={setShowCreate} />
    </div>
  )
}