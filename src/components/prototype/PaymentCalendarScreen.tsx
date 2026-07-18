'use client'

import React, { useState, useMemo } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { formatRubles, getOrgName } from '@/data/mockData'
import { toast } from 'sonner'
import { ChevronLeft, ChevronRight, CalendarDays, Plus } from 'lucide-react'
import {
  startOfMonth, endOfMonth, eachDayOfInterval, format, getDay, isToday, addMonths, subMonths,
} from 'date-fns'
import { ru } from 'date-fns/locale'

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-800 border-green-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  planned: 'bg-gray-100 text-gray-600 border-gray-200',
}

const statusLabels: Record<string, string> = {
  completed: 'Исполнено',
  pending: 'В процессе',
  planned: 'Планируется',
}

export default function PaymentCalendarScreen() {
  const { calendarEntries, organizations, currentOrgId, addCalendarEntry } = useAppStore()
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1))
  const [orgFilter, setOrgFilter] = useState(currentOrgId)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [addDate, setAddDate] = useState('')
  const [addForm, setAddForm] = useState({ description: '', plannedAmount: '', actualAmount: '', status: 'planned' as const, organizationId: currentOrgId, paymentCount: 1 })

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const startDay = getDay(monthStart)
  const offset = startDay === 0 ? 6 : startDay - 1
  const paddedDays = [...Array(offset).fill(null), ...days]

  const filteredEntries = calendarEntries.filter((e) => {
    if (orgFilter !== 'all' && e.organizationId !== orgFilter) return false
    return true
  })

  const entriesByDate = useMemo(() => {
    const map: Record<string, typeof filteredEntries> = {}
    filteredEntries.forEach((e) => {
      if (!map[e.date]) map[e.date] = []
      map[e.date].push(e)
    })
    return map
  }, [filteredEntries])

  const selectedEntries = selectedDate ? (entriesByDate[selectedDate] ?? []) : []

  const goToPrev = () => setCurrentDate(subMonths(currentDate, 1))
  const goToNext = () => setCurrentDate(addMonths(currentDate, 1))

  const handleOpenAdd = (dateStr?: string) => {
    setAddDate(dateStr || new Date().toISOString().split('T')[0])
    setAddForm({ description: '', plannedAmount: '', actualAmount: '', status: 'planned', organizationId: currentOrgId, paymentCount: 1 })
    setShowAdd(true)
  }

  const handleAddEntry = () => {
    if (!addForm.description || !addForm.plannedAmount || !addDate) {
      toast.error('Заполните описание и плановую сумму')
      return
    }
    addCalendarEntry({
      date: addDate,
      description: addForm.description,
      plannedAmount: parseFloat(addForm.plannedAmount) || 0,
      actualAmount: parseFloat(addForm.actualAmount) || 0,
      status: addForm.status,
      organizationId: addForm.organizationId,
      paymentCount: addForm.paymentCount,
    })
    toast.success('Запись календаря добавлена')
    setShowAdd(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Платёжный календарь</h1>
          <p className="text-muted-foreground">
            Календарный план и факт исполнения платежей
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={orgFilter} onValueChange={setOrgFilter}>
            <SelectTrigger className="w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все организации</SelectItem>
              {organizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => handleOpenAdd()}>
            <Plus className="mr-2 h-4 w-4" />
            Добавить
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Calendar grid */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <button onClick={goToPrev} className="p-1 rounded hover:bg-accent">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <CardTitle className="text-base">
                  {format(currentDate, 'LLLL yyyy', { locale: ru })}
                </CardTitle>
                <button onClick={goToNext} className="p-1 rounded hover:bg-accent">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {weekDays.map((d) => (
                  <div key={d} className="p-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {paddedDays.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} className="min-h-[72px]" />

                  const dateStr = format(day, 'yyyy-MM-dd')
                  const dayEntries = entriesByDate[dateStr] ?? []
                  const totalPlanned = dayEntries.reduce((s, e) => s + e.plannedAmount, 0)
                  const totalActual = dayEntries.reduce((s, e) => s + e.actualAmount, 0)
                  const hasEntries = dayEntries.length > 0
                  const isSelected = selectedDate === dateStr

                  const allCompleted = hasEntries && dayEntries.every((e) => e.status === 'completed')
                  const anyPending = hasEntries && dayEntries.some((e) => e.status === 'pending')
                  const allPlanned = hasEntries && dayEntries.every((e) => e.status === 'planned')

                  let cellBg = ''
                  if (allCompleted) cellBg = 'bg-green-50'
                  else if (anyPending) cellBg = 'bg-yellow-50'
                  else if (allPlanned) cellBg = 'bg-gray-50'

                  return (
                    <button
                      key={dateStr}
                      onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                      onDoubleClick={() => handleOpenAdd(dateStr)}
                      className={`min-h-[72px] rounded-lg border p-1.5 text-left text-xs transition-all duration-150 hover:shadow-md hover:scale-[1.02] ${
                        isSelected ? 'ring-2 ring-primary border-primary shadow-sm' : 'border-border'
                      } ${cellBg} ${isToday(day) ? 'font-bold' : ''}`}
                      title={hasEntries ? `${dayEntries.length} пл. | Двойной клик — добавить` : 'Двойной клик — добавить запись'}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{format(day, 'd')}</span>
                        {isToday(day) && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                      </div>
                      {hasEntries && (
                        <div className="space-y-0.5 mt-1">
                          {totalPlanned > 0 && (
                            <div className="text-muted-foreground">План: {(totalPlanned / 1000000).toFixed(1)}м</div>
                          )}
                          {totalActual > 0 && (
                            <div className="text-green-700 font-medium">Факт: {(totalActual / 1000000).toFixed(1)}м</div>
                          )}
                          <div className="text-muted-foreground">{dayEntries.length} пл.</div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="flex gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-green-100 border border-green-200" />
                  <span>Исполнено</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-yellow-100 border border-yellow-200" />
                  <span>В процессе</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-gray-100 border border-gray-200" />
                  <span>Планируется</span>
                </div>
                <div className="ml-auto text-muted-foreground">Двойной клик — добавить запись</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side panel */}
        <div>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {selectedDate
                    ? format(new Date(selectedDate), 'd MMMM yyyy', { locale: ru })
                    : 'Выберите дату'}
                </CardTitle>
                {selectedDate && (
                  <Button variant="ghost" size="sm" onClick={() => handleOpenAdd(selectedDate)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedDate && selectedEntries.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-3">Нет платежей на эту дату</p>
                  <Button variant="outline" size="sm" onClick={() => handleOpenAdd(selectedDate)}>
                    <Plus className="mr-1 h-3 w-3" />
                    Добавить запись
                  </Button>
                </div>
              )}
              {selectedDate && selectedEntries.length > 0 && (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {selectedEntries.map((entry, idx) => (
                    <button
                      key={`${selectedDate}-${idx}`}
                      className="w-full rounded-lg border p-3 space-y-2 text-left transition-all duration-150 hover:shadow-md hover:border-primary/30 hover:scale-[1.01]"
                      onClick={() => {
                        toast.info(`${entry.description} — План: ${formatRubles(entry.plannedAmount)}, Факт: ${formatRubles(entry.actualAmount)}`)
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">{getOrgName(entry.organizationId)}</span>
                        <Badge className={`text-xs ${statusColors[entry.status]}`}>
                          {statusLabels[entry.status]}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{entry.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">План: </span>
                          <span className="font-medium">{formatRubles(entry.plannedAmount)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Факт: </span>
                          <span className="font-medium">{formatRubles(entry.actualAmount)}</span>
                        </div>
                      </div>
                      {entry.paymentCount > 0 && (
                        <p className="text-xs text-muted-foreground">Платежей: {entry.paymentCount}</p>
                      )}
                    </button>
                  ))}
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => handleOpenAdd(selectedDate)}>
                    <Plus className="mr-1 h-3 w-3" />
                    Добавить запись
                  </Button>
                </div>
              )}
              {!selectedDate && (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Нажмите на день в календаре для просмотра платежей
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Entry Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Добавить запись в календарь</DialogTitle>
            <DialogDescription>Планирование платежа на конкретную дату</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Дата *</Label>
              <Input type="date" value={addDate} onChange={(e) => setAddDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Организация *</Label>
              <Select value={addForm.organizationId} onValueChange={(v) => setAddForm({ ...addForm, organizationId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Описание *</Label>
              <Textarea placeholder="Оплата по договору, зарплата и т.д." value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Плановая сумма (руб.) *</Label>
                <Input type="number" placeholder="0" value={addForm.plannedAmount} onChange={(e) => setAddForm({ ...addForm, plannedAmount: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Фактическая сумма (руб.)</Label>
                <Input type="number" placeholder="0" value={addForm.actualAmount} onChange={(e) => setAddForm({ ...addForm, actualAmount: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Статус</Label>
                <Select value={addForm.status} onValueChange={(v) => setAddForm({ ...addForm, status: v as 'planned' | 'pending' | 'completed' })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Планируется</SelectItem>
                    <SelectItem value="pending">В процессе</SelectItem>
                    <SelectItem value="completed">Исполнено</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Кол-во платежей</Label>
                <Input type="number" min="1" value={addForm.paymentCount} onChange={(e) => setAddForm({ ...addForm, paymentCount: parseInt(e.target.value) || 1 })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Отмена</Button>
            <Button onClick={handleAddEntry}>Добавить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}