'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatRubles, getOrgName } from '@/data/mockData'
import { toast } from 'sonner'
import { Download, FileText } from 'lucide-react'

const statusVariant: Record<string, 'secondary' | 'success'> = {
  'Сформировано': 'secondary',
  'Экспортировано': 'success',
}

export default function PaymentOrdersScreen() {
  const { paymentOrders, exportPaymentOrder } = useAppStore()
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    const exportable = paymentOrders.filter((po) => po.status === 'Сформировано')
    if (selectedIds.length === exportable.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(exportable.map((po) => po.id))
    }
  }

  const handleExport = (orderId: string, orderNumber: string) => {
    exportPaymentOrder(orderId)
    toast.success(`Файл PAY_${orderNumber}.txt сформирован`)
  }

  const handleExportSelected = () => {
    if (selectedIds.length === 0) {
      toast.error('Выберите поручения для экспорта')
      return
    }
    selectedIds.forEach((id) => {
      const po = paymentOrders.find((p) => p.id === id)
      if (po) {
        exportPaymentOrder(id)
      }
    })
    toast.success(`Экспортировано поручений: ${selectedIds.length}`)
    setSelectedIds([])
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Платёжные поручения</h1>
          <p className="text-muted-foreground">
            Управление платёжными поручениями и экспорт в клиент-банк
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={toggleAll}>
            <FileText className="mr-2 h-4 w-4" />
            Выбрать все для экспорта
          </Button>
          <Button onClick={handleExportSelected} disabled={selectedIds.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Экспорт в клиент-банк (.txt)
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
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length ===
                          paymentOrders.filter((po) => po.status === 'Сформировано').length &&
                        paymentOrders.filter((po) => po.status === 'Сформировано').length > 0
                      }
                      onChange={toggleAll}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead>№ ПП</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Заявки</TableHead>
                  <TableHead>Плательщик</TableHead>
                  <TableHead className="text-right">Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentOrders.map((po) => (
                  <TableRow key={po.id} className={selectedIds.includes(po.id) ? 'bg-muted/50' : ''}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(po.id)}
                        onChange={() => toggleSelect(po.id)}
                        disabled={po.status === 'Экспортировано'}
                        className="rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{po.number}</TableCell>
                    <TableCell className="whitespace-nowrap">{po.date}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {po.requestNumbers.map((rn) => (
                          <Badge key={rn} variant="outline" className="text-xs">{rn}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs max-w-[150px] truncate">{getOrgName(po.payerId)}</TableCell>
                    <TableCell className="text-right font-medium whitespace-nowrap">
                      {formatRubles(po.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[po.status] || 'secondary'}>{po.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {po.status === 'Сформировано' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExport(po.id, po.number)}
                        >
                          <Download className="mr-1 h-3 w-3" />
                          Экспорт
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}