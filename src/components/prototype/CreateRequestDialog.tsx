'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatRubles, expenseCategories } from '@/data/mockData'
import { toast } from 'sonner'

interface CreateRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateRequestDialog({ open, onOpenChange }: CreateRequestDialogProps) {
  const { counterparties, organizations, currentOrgId, addPaymentRequest } = useAppStore()
  const [cpId, setCpId] = useState('')
  const [amount, setAmount] = useState('')
  const [purpose, setPurpose] = useState('')
  const [orgId, setOrgId] = useState(currentOrgId)
  const [category, setCategory] = useState('')
  const [mode, setMode] = useState<'manual' | 'auto'>('manual')

  const handleCreate = () => {
    if (!cpId || !amount || !purpose || !orgId || !category) {
      toast.error('Заполните все обязательные поля')
      return
    }

    const cp = counterparties.find((c) => c.id === cpId)
    if (!cp) return

    addPaymentRequest({
      organizationId: orgId,
      counterpartyId: cpId,
      counterpartyName: cp.name,
      amount: parseFloat(amount),
      purpose,
      expenseCategory: category,
      status: 'Новая',
      source: 'manual',
    })

    toast.success(`Заявка на оплату создана`)
    onOpenChange(false)
    setCpId('')
    setAmount('')
    setPurpose('')
    setOrgId(currentOrgId)
    setCategory('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Новая заявка на оплату</DialogTitle>
          <DialogDescription>Заполните данные для создания новой заявки</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Entry point labels */}
          <div className="flex gap-3">
            <Button
              variant={mode === 'manual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('manual')}
            >
              Создание вручную
            </Button>
            <Button
              variant={mode === 'auto' ? 'default' : 'outline'}
              size="sm"
              disabled
            >
              Автоматически из данных счёта
            </Button>
          </div>

          {mode === 'auto' && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
              Автоматическое создание доступно только при вводе данных счёта через раздел «Ввод данных счёта».
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            <Label>Контрагент *</Label>
            <Select value={cpId} onValueChange={setCpId}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите контрагента" />
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
            <Label>Сумма (руб.) *</Label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Назначение платежа *</Label>
            <Textarea
              placeholder="Описание назначения платежа"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Организация-плательщик *</Label>
              <Select value={orgId} onValueChange={setOrgId}>
                <SelectTrigger>
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
              <Label>Статья расхода *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
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

          <div className="space-y-2">
            <Label>Расчётный счёт</Label>
            <Input
              value={cpId ? counterparties.find((c) => c.id === cpId)?.bankAccount ?? '' : ''}
              readOnly
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label>Прикрепить документы</Label>
            <div className="flex h-20 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 text-sm text-muted-foreground">
              Перетащите файлы сюда или нажмите для выбора
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleCreate}>Создать заявку</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}