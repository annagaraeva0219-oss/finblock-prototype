'use client'

import React, { useState, useMemo } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { formatRubles, getOrgName } from '@/data/mockData'
import { toast } from 'sonner'
import { Download, FileText, Eye } from 'lucide-react'

const statusVariant: Record<string, 'secondary' | 'success'> = {
  'Сформировано': 'secondary',
  'Экспортировано': 'success',
}

function generateTxtContent(order: ReturnType<typeof useAppStore.getState>['paymentOrders'][0], org: { name: string; inn: string; kpp: string; bankAccount: string; bankName: string; bik: string } | undefined) {
  const today = new Date()
  const dateStr = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`

  const lines = [
    'СекцияДокумент=Платежное поручение',
    `Номер=${order.number}`,
    `Дата=${dateStr}`,
    `Сумма=${Math.round(order.amount)}`,
    '',
    `Плательщик=${org?.name || 'Не указан'}`,
    `ПлательщикИНН=${org?.inn || ''}`,
    `ПлательщикКПП=${org?.kpp || ''}`,
    `ПлательщикРасчСчет=${org?.bankAccount || ''}`,
    `ПлательщикБанк1=${org?.bankName || ''}`,
    `ПлательщикБИК=${org?.bik || ''}`,
    '',
    `ПолучательСчет=${order.number}`,
    `НазначениеПлатежа=Оплата по заявкам: ${order.requestNumbers.join(', ')}`,
    '',
    `ВсегоЗаявок=${order.requestNumbers.length}`,
    `ОбщаяСумма=${Math.round(order.amount)}`,
    '',
    'КонецДокумента',
    'КонецФайла',
  ]
  return lines.join('\n')
}

export default function PaymentOrdersScreen() {
  const { paymentOrders, registerEntries, organizations, exportPaymentOrder } = useAppStore()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [previewOrder, setPreviewOrder] = useState<string | null>(null)
  const [detailOrder, setDetailOrder] = useState<string | null>(null)

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
    setPreviewOrder(null)
    toast.success(`Файл PAY_${orderNumber}.txt сформирован и скачан`)
  }

  const handleExportSelected = () => {
    if (selectedIds.length === 0) {
      toast.error('Выберите поручения для экспорта')
      return
    }
    selectedIds.forEach((id) => {
      const po = paymentOrders.find((p) => p.id === id)
      if (po) exportPaymentOrder(id)
    })
    toast.success(`Экспортировано поручений: ${selectedIds.length}`)
    setSelectedIds([])
  }

  const previewPo = previewOrder ? paymentOrders.find((po) => po.id === previewOrder) : null
  const previewOrg = previewPo ? organizations.find((o) => o.id === previewPo.payerId) : undefined
  const previewTxt = previewPo ? generateTxtContent(previewPo, previewOrg) : ''

  const detailPo = detailOrder ? paymentOrders.find((po) => po.id === detailOrder) : null
  const detailOrg = detailPo ? organizations.find((o) => o.id === detailPo.payerId) : undefined
  const detailEntries = detailPo ? registerEntries.filter((e) => detailPo.registerEntryIds.includes(e.id)) : []

  const handleDownloadTxt = () => {
    if (!previewPo || !previewTxt) return
    const blob = new Blob([previewTxt], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `PAY_${previewPo.number}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    handleExport(previewPo.id, previewPo.number)
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
            Выбрать все
          </Button>
          <Button onClick={handleExportSelected} disabled={selectedIds.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Экспорт (.txt)
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
                      checked={selectedIds.length === paymentOrders.filter((po) => po.status === 'Сформировано').length && paymentOrders.filter((po) => po.status === 'Сформировано').length > 0}
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
                  <TableRow
                    key={po.id}
                    className={`cursor-pointer transition-colors hover:bg-muted/80 ${selectedIds.includes(po.id) ? 'bg-muted/50' : ''}`}
                    onClick={() => setDetailOrder(po.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
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
                    <TableCell className="text-right font-medium whitespace-nowrap">{formatRubles(po.amount)}</TableCell>
                    <TableCell><Badge variant={statusVariant[po.status] || 'secondary'}>{po.status}</Badge></TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      {po.status === 'Сформировано' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewOrder(po.id)}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          Экспорт
                        </Button>
                      )}
                      {po.status === 'Экспортировано' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewOrder(po.id)}
                        >
                          <FileText className="mr-1 h-3 w-3" />
                          Просмотр
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

      {/* Detail Dialog */}
      <Dialog open={!!detailOrder && !previewOrder} onOpenChange={(open) => { if (!open) setDetailOrder(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Платёжное поручение — {detailPo?.number}</DialogTitle>
            <DialogDescription>Подробная информация о платёжном поручении</DialogDescription>
          </DialogHeader>
          {detailPo && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Плательщик</p>
                  <p className="text-sm font-medium mt-1">{detailOrg?.name || '—'}</p>
                  {detailOrg && <p className="text-xs text-muted-foreground">ИНН: {detailOrg.inn}</p>}
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Статус</p>
                  <p className="mt-1"><Badge variant={statusVariant[detailPo.status] || 'secondary'}>{detailPo.status}</Badge></p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Дата формирования</p>
                  <p className="text-sm font-medium mt-1">{detailPo.date}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Сумма</p>
                  <p className="text-xl font-bold mt-1">{formatRubles(detailPo.amount)}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Включённые заявки ({detailEntries.length})
                </p>
                <div className="space-y-1.5">
                  {detailEntries.map((e) => (
                    <div key={e.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                      <span className="font-medium">{e.requestNumber}</span>
                      <span className="text-xs text-muted-foreground max-w-[150px] truncate">{e.counterpartyName}</span>
                      <span className="font-medium">{formatRubles(e.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {detailPo.status === 'Сформировано' && (
                <Button className="w-full" onClick={() => { setDetailOrder(null); setPreviewOrder(detailPo.id) }}>
                  <Download className="mr-2 h-4 w-4" />
                  Предпросмотр и экспорт в клиент-банк
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* TXT Preview Dialog */}
      <Dialog open={!!previewOrder} onOpenChange={(open) => { if (!open) setPreviewOrder(null) }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Предпросмотр файла — PAY_{previewPo?.number}.txt</DialogTitle>
            <DialogDescription>
              Формат 1С:Предприятие — Платёжное поручение для загрузки в клиент-банк
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border bg-gray-950 p-4 text-sm font-mono text-green-400 max-h-[400px] overflow-auto whitespace-pre leading-relaxed">
            {previewTxt}
          </div>

          <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
            <div>
              <p className="text-sm font-medium">Файл: PAY_{previewPo?.number}.txt</p>
              <p className="text-xs text-muted-foreground">
                Заявок: {previewPo?.requestNumbers.length} | Сумма: {previewPo ? formatRubles(previewPo.amount) : ''}
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setPreviewOrder(null)}>Отмена</Button>
            {previewPo?.status === 'Сформировано' && (
              <Button onClick={handleDownloadTxt}>
                <Download className="mr-2 h-4 w-4" />
                Скачать и отметить экспортированным
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}