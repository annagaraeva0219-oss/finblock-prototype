'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { formatRubles, getOrgName } from '@/data/mockData'
import { toast } from 'sonner'
import { CreditCard, ArrowLeft, ExternalLink } from 'lucide-react'

const statusVariant: Record<string, 'secondary' | 'warning' | 'success'> = {
  'Ожидает': 'warning',
  'В поручении': 'secondary',
  'Исполнено': 'success',
}

export default function PaymentRegisterScreen() {
  const { registerEntries, paymentRequests, organizations, currentOrgId, createPaymentOrder, setCurrentScreen, setSelectedRequestId } = useAppStore()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [orgFilter, setOrgFilter] = useState(currentOrgId)
  const [detailEntry, setDetailEntry] = useState<string | null>(null)

  const filtered = registerEntries.filter((re) => {
    if (orgFilter !== 'all' && re.organizationId !== orgFilter) return false
    return true
  })

  const detail = detailEntry ? registerEntries.find((e) => e.id === detailEntry) : null
  const detailRequest = detail ? paymentRequests.find((pr) => pr.id === detail.requestId) : null

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filtered.map((re) => re.id))
    }
  }

  const handleCreateOrder = () => {
    if (selectedIds.length === 0) {
      toast.error('Выберите записи для формирования поручения')
      return
    }
    const orderId = createPaymentOrder(selectedIds)
    if (orderId) {
      toast.success('Платёжное поручение сформировано')
      setSelectedIds([])
    }
  }

  const handleGoToRequest = (requestId: string) => {
    setSelectedRequestId(requestId)
    setCurrentScreen('payment-requests')
  }

  const totalSelected = filtered
    .filter((re) => selectedIds.includes(re.id))
    .reduce((s, re) => s + re.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Реестр платежей</h1>
          <p className="text-muted-foreground">
            Реестр согласованных заявок, ожидающих оплату — {filtered.length} записей
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-1 sm:w-48">
            <select
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              value={orgFilter}
              onChange={(e) => setOrgFilter(e.target.value)}
            >
              <option value="all">Все организации</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
          </div>
          <Button onClick={handleCreateOrder} disabled={selectedIds.length === 0}>
            <CreditCard className="mr-2 h-4 w-4" />
            Сформировать ПП
            {selectedIds.length > 0 && (
              <Badge variant="secondary" className="ml-2">{selectedIds.length}</Badge>
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="max-h-[500px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="rounded" />
                  </TableHead>
                  <TableHead>№ Заявки</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Контрагент</TableHead>
                  <TableHead>Организация</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((re) => (
                  <TableRow
                    key={re.id}
                    className={`cursor-pointer transition-colors hover:bg-muted/80 ${selectedIds.includes(re.id) ? 'bg-muted/50' : ''}`}
                    onClick={() => setDetailEntry(re.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={selectedIds.includes(re.id)} onChange={() => toggleSelect(re.id)} disabled={re.status === 'Исполнено'} className="rounded" />
                    </TableCell>
                    <TableCell className="font-medium">{re.requestNumber}</TableCell>
                    <TableCell className="whitespace-nowrap">{re.date}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm">{re.counterpartyName}</TableCell>
                    <TableCell className="text-xs max-w-[150px] truncate">{getOrgName(re.organizationId)}</TableCell>
                    <TableCell className="text-right font-medium whitespace-nowrap">{formatRubles(re.amount)}</TableCell>
                    <TableCell><Badge variant={statusVariant[re.status] || 'secondary'}>{re.status}</Badge></TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={() => setDetailEntry(re.id)}>Открыть</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">Записи в реестре отсутствуют</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <span className="text-sm text-muted-foreground">Выбрано: {selectedIds.length} записей</span>
            <span className="text-sm font-bold">Итого: {formatRubles(totalSelected)}</span>
          </div>
        )}
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!detailEntry} onOpenChange={(open) => { if (!open) setDetailEntry(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Запись реестра — {detail?.requestNumber}</DialogTitle>
            <DialogDescription>Подробная информация о записи в реестре платежей</DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Организация</p>
                  <p className="text-sm font-medium mt-1">{getOrgName(detail.organizationId)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Статус</p>
                  <p className="mt-1"><Badge variant={statusVariant[detail.status] || 'secondary'}>{detail.status}</Badge></p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Контрагент</p>
                  <p className="text-sm font-medium mt-1">{detail.counterpartyName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Дата добавления</p>
                  <p className="text-sm font-medium mt-1">{detail.date}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-medium text-muted-foreground">Сумма</p>
                  <p className="text-xl font-bold mt-1">{formatRubles(detail.amount)}</p>
                </div>
              </div>

              {detailRequest && (
                <div className="rounded-lg border p-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Связанная заявка на оплату</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{detailRequest.number}</p>
                      <p className="text-xs text-muted-foreground">{detailRequest.counterpartyName}</p>
                      <p className="text-xs text-muted-foreground mt-1">{detailRequest.purpose}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => { setDetailEntry(null); handleGoToRequest(detail.requestId) }}>
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Открыть заявку
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}