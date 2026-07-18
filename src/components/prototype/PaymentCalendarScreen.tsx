'use client'

import React, { useState, useMemo } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { formatRubles, getOrgName } from '@/data/mockData'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  getDay,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
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
  const { calendarEntries, organizations, currentOrgId } = useAppStore()
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1))
  const [orgFilter, setOrgFilter] = useState(currentOrgId)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Shift days so week starts on Monday
  const startDay = getDay(monthStart) // 0=Sun, 1=Mon...
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
              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {weekDays.map((d) => (
                  <div key={d} className="p-2 text-center text-xs font-medium text-muted-foreground">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-1">
                {paddedDays.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} className="min-h-[72px]" />

                  const dateStr = format(day, 'yyyy-MM-dd')
                  const dayEntries = entriesByDate[dateStr] ?? []
                  const totalPlanned = dayEntries.reduce((s, e) => s + e.plannedAmount, 0)
                  const totalActual = dayEntries.reduce((s, e) => s + e.actualAmount, 0)
                  const hasEntries = dayEntries.length > 0
                  const isSelected = selectedDate === dateStr

                  // Determine cell status
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
                      className={`min-h-[72px] rounded-lg border p-1.5 text-left text-xs transition-colors ${
                        isSelected ? 'ring-2 ring-primary border-primary' : 'border-border'
                      } ${cellBg} ${isToday(day) ? 'font-bold' : ''}`}
                    >
                      <div className="font-medium mb-1">{format(day, 'd')}</div>
                      {hasEntries && (
                        <div className="space-y-0.5">
                          {totalPlanned > 0 && (
                            <div className="text-muted-foreground">
                              План: {(totalPlanned / 1000000).toFixed(1)}м
                            </div>
                          )}
                          {totalActual > 0 && (
                            <div className="text-green-700 font-medium">
                              Факт: {(totalActual / 1000000).toFixed(1)}м
                            </div>
                          )}
                          <div className="text-muted-foreground">
                            {dayEntries.length} пл.
                          </div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Legend */}
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side panel */}
        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {selectedDate
                  ? format(new Date(selectedDate), 'd MMMM yyyy', { locale: ru })
                  : 'Выберите дату'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate && selectedEntries.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Нет платежей на эту дату
                </p>
              )}
              {selectedDate && selectedEntries.length > 0 && (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {selectedEntries.map((entry, idx) => (
                    <div
                      key={`${selectedDate}-${idx}`}
                      className="rounded-lg border p-3 space-y-2"
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
                        <p className="text-xs text-muted-foreground">
                          Платежей: {entry.paymentCount}
                        </p>
                      )}
                    </div>
                  ))}
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
    </div>
  )
}