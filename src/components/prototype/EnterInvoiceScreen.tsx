'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { formatRubles, getCounterpartyInn, expenseCategories } from '@/data/mockData'
import { toast } from 'sonner'
import { FileText, Plus } from 'lucide-react'

export default function EnterInvoiceScreen() {
  const { counterparties, organizations, invoices, currentOrgId, addInvoice } = useAppStore()

  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [invoiceDate, setInvoiceDate] = useState('')
  const [counterpartyId, setCounterpartyId] = useState('')
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('')
  const [orgId, setOrgId] = useState(currentOrgId)
  const [category, setCategory] = useState('')

  const selectedCp = counterparties.find((c) => c.id === counterpartyId)
  const inn = selectedCp?.inn ?? ''

  const handleCreate = () => {
    if (!invoiceNumber || !invoiceDate || !counterpartyId || !amount || !purpose || !orgId || !category) {
      toast.error('Заполните все обязательные поля')
      return
    }

    const cp = counterparties.find((c) => c.id === counterpartyId)
    if (!cp) return

    const prId = addInvoice({
      number: invoiceNumber,
      date: invoiceDate,
      counterpartyId,
      counterpartyName: cp.name,
      inn: cp.inn,
      amount: parseFloat(amount),
      purpose,
      organizationId: orgId,
      expenseCategory: category,
    })

    toast.success(`Счёт ${invoiceNumber} добавлен. Создана заявка на оплату.`)

    // Reset form
    setInvoiceNumber('')
    setInvoiceDate('')
    setCounterpartyId('')
    setAmount('')
    setPurpose('')
    setOrgId(currentOrgId)
    setCategory('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ввод данных счёта</h1>
        <p className="text-muted-foreground">Ручной ввод данных счёта ответственным подразделением</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="h-4 w-4" />
              Новый счёт
            </CardTitle>
            <CardDescription>Заполните данные счёта для автоматического создания заявки на оплату</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="inv-number">Номер счёта *</Label>
                <Input
                  id="inv-number"
                  placeholder="СФ-0001 от 01.01.2025"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inv-date">Дата счёта *</Label>
                <Input
                  id="inv-date"
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inv-cp">Наименование поставщика *</Label>
              <Select value={counterpartyId} onValueChange={setCounterpartyId}>
                <SelectTrigger id="inv-cp">
                  <SelectValue placeholder="Выберите поставщика" />
                </SelectTrigger>
                <SelectContent>
                  {counterparties.map((cp) => (
                    <SelectItem key={cp.id} value={cp.id}>
                      {cp.name} (ИНН: {cp.inn})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inv-inn">ИНН поставщика</Label>
              <Input id="inv-inn" value={inn} readOnly className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inv-amount">Сумма (руб.) *</Label>
              <Input
                id="inv-amount"
                type="number"
                placeholder="0"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inv-purpose">Назначение платежа *</Label>
              <Textarea
                id="inv-purpose"
                placeholder="Описание назначения платежа"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="inv-org">Организация-плательщик *</Label>
                <Select value={orgId} onValueChange={setOrgId}>
                  <SelectTrigger id="inv-org">
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="inv-cat">Статья расхода *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="inv-cat">
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleCreate} className="w-full sm:w-auto">
              <FileText className="mr-2 h-4 w-4" />
              Сформировать заявку на оплату
            </Button>
          </CardContent>
        </Card>

        {/* Recent invoices */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Последние введённые счета</CardTitle>
            <CardDescription>Список последних счетов, введённых в систему</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Номер</TableHead>
                    <TableHead>Поставщик</TableHead>
                    <TableHead className="text-right">Сумма</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium text-xs">{inv.number}</TableCell>
                      <TableCell className="text-xs max-w-[150px] truncate">{inv.counterpartyName}</TableCell>
                      <TableCell className="text-right text-xs font-medium">
                        {formatRubles(inv.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={inv.status === 'Обработан' ? 'success' : 'warning'}>
                          {inv.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}