'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { RefreshCw, Plug, Download, History } from 'lucide-react'

const syncLog = [
  { id: 1, date: '2025-01-24 14:30:22', type: '1С:Бухгалтерия', status: 'Успешно', records: 45 },
  { id: 2, date: '2025-01-24 12:00:05', type: 'Клиент-банк', status: 'Успешно', records: 3 },
  { id: 3, date: '2025-01-23 14:30:18', type: '1С:Бухгалтерия', status: 'Успешно', records: 38 },
  { id: 4, date: '2025-01-23 10:15:44', type: 'Клиент-банк', status: 'Ошибка', records: 0 },
  { id: 5, date: '2025-01-22 14:30:11', type: '1С:Бухгалтерия', status: 'Успешно', records: 52 },
  { id: 6, date: '2025-01-22 09:00:33', type: 'Клиент-банк', status: 'Успешно', records: 5 },
  { id: 7, date: '2025-01-21 14:30:09', type: '1С:Бухгалтерия', status: 'Ошибка', records: 0 },
  { id: 8, date: '2025-01-21 08:45:12', type: 'Клиент-банк', status: 'Успешно', records: 2 },
]

export default function IntegrationSettingsScreen() {
  const [sync1c, setSync1c] = useState(true)
  const [syncInterval, setSyncInterval] = useState('60')

  const handleCheckConnection = () => {
    toast.success('Подключение к 1С:Бухгалтерия 3.0 успешно')
  }

  const handleSync = () => {
    toast.success('Синхронизация запущена. Ожидайте...')
    setTimeout(() => {
      toast.success('Синхронизация завершена. Загружено 45 записей.')
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Настройки интеграций</h1>
        <p className="text-muted-foreground">
          Управление подключениями к внешним системам
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 1C Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100">
                <span className="text-sm font-bold text-yellow-800">1С</span>
              </div>
              1С:Бухгалтерия 3.0
            </CardTitle>
            <CardDescription>Интеграция с учётной системой для обмена данными</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="sync-toggle">Автосинхронизация</Label>
              <Switch
                id="sync-toggle"
                checked={sync1c}
                onCheckedChange={setSync1c}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sync-interval">Интервал синхронизации</Label>
              <Select value={syncInterval} onValueChange={setSyncInterval}>
                <SelectTrigger id="sync-interval">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">Каждые 30 минут</SelectItem>
                  <SelectItem value="60">Каждый час</SelectItem>
                  <SelectItem value="120">Каждые 2 часа</SelectItem>
                  <SelectItem value="360">Каждые 6 часов</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="c1c-url">URL подключения</Label>
              <Input
                id="c1c-url"
                defaultValue="http://192.168.1.100/Steck_GRP/hs/finblock/"
                placeholder="http://server/hs/finblock/"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="c1c-login">Логин</Label>
              <Input id="c1c-login" defaultValue="finblock_user" placeholder="Имя пользователя" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="c1c-password">Пароль</Label>
              <Input id="c1c-password" type="password" defaultValue="••••••••" placeholder="Пароль" />
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={handleCheckConnection} className="flex-1">
                <Plug className="mr-2 h-4 w-4" />
                Проверить подключение
              </Button>
              <Button onClick={handleSync} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Синхронизировать
              </Button>
            </div>

            <div className="rounded-lg bg-green-50 border border-green-200 p-3">
              <p className="text-xs text-green-800">
                <span className="font-medium">Последняя синхронизация:</span> 24.01.2025 14:30:22 — Успешно (45 записей)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Client-Bank Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                <Download className="h-4 w-4 text-blue-800" />
              </div>
              Клиент-банк
            </CardTitle>
            <CardDescription>Экспорт платёжных поручений в банковские системы</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bank-format">Формат экспорта</Label>
              <Select defaultValue="sber">
                <SelectTrigger id="bank-format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sber">Сбербанк</SelectItem>
                  <SelectItem value="vtb">ВТБ</SelectItem>
                  <SelectItem value="alfa">Альфа-Банк</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="encoding">Кодировка файла</Label>
              <Select defaultValue="windows1251">
                <SelectTrigger id="encoding">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="windows1251">Windows-1251</SelectItem>
                  <SelectItem value="utf8">UTF-8</SelectItem>
                  <SelectItem value="koi8r">KOI8-R</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Шаблон по умолчанию</Label>
              <Select defaultValue="standard">
                <SelectTrigger id="template">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Стандартный</SelectItem>
                  <SelectItem value="extended">Расширенный (с УИП)</SelectItem>
                  <SelectItem value="budget">Бюджетный платёж</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="cb-path">Путь к папке экспорта</Label>
              <Input
                id="cb-path"
                defaultValue="\\fileserver\finblock\export\"
                placeholder="Путь к папке"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-export">Автоэкспорт после формирования</Label>
              <Switch id="auto-export" defaultChecked />
            </div>

            <div className="rounded-lg bg-green-50 border border-green-200 p-3">
              <p className="text-xs text-green-800">
                <span className="font-medium">Последний экспорт:</span> 24.01.2025 12:00:05 — PAY_000001.txt (Сбербанк)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="h-4 w-4" />
            Журнал синхронизации
          </CardTitle>
          <CardDescription>История операций обмена данными</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[300px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата и время</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Записей</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {syncLog.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap text-xs">{log.date}</TableCell>
                    <TableCell className="text-sm">{log.type}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === 'Успешно' ? 'success' : 'destructive'}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {log.records > 0 ? log.records : '—'}
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