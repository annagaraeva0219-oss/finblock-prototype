'use client'

import React from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Separator } from '@/components/ui/separator'
import { formatRubles, getOrgName } from '@/data/mockData'
import { toast } from 'sonner'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'

export default function BankReportsScreen() {
  const { bankStatements, organizations, currentOrgId } = useAppStore()
  const [orgId, setOrgId] = React.useState(currentOrgId)

  const statement = bankStatements.find((bs) => bs.organizationId === orgId)
  const org = organizations.find((o) => o.id === orgId)

  const totalDebit = statement?.transactions.reduce((s, t) => s + t.debit, 0) ?? 0
  const totalCredit = statement?.transactions.reduce((s, t) => s + t.credit, 0) ?? 0

  const handleExportExcel = () => {
    toast.success('Экспорт в Excel выполнен успешно')
  }

  const handleExportPdf = () => {
    toast.success('Экспорт в PDF выполнен успешно')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Банковские отчёты</h1>
          <p className="text-muted-foreground">
            Выписка по расчётному счёту (счёт 51)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={orgId} onValueChange={setOrgId}>
            <SelectTrigger className="w-[260px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {bankStatements.map((bs) => {
                const o = organizations.find((org) => org.id === bs.organizationId)
                return (
                  <SelectItem key={bs.organizationId} value={bs.organizationId}>
                    {o?.name ?? bs.organizationId}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Экспорт в Excel
          </Button>
          <Button variant="outline" onClick={handleExportPdf}>
            <FileText className="mr-2 h-4 w-4" />
            Экспорт в PDF
          </Button>
        </div>
      </div>

      {statement && (
        <>
          {/* Summary card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {org?.name} — р/с {statement.accountNumber}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Период: {statement.period}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Начальный остаток</p>
                  <p className="text-lg font-bold mt-1">{formatRubles(statement.openingBalance)}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Оборот по дебету</p>
                  <p className="text-lg font-bold mt-1 text-red-600">{formatRubles(totalDebit)}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Оборот по кредиту</p>
                  <p className="text-lg font-bold mt-1 text-green-600">{formatRubles(totalCredit)}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Конечный остаток</p>
                  <p className="text-lg font-bold mt-1">{formatRubles(statement.closingBalance)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions */}
          <Card>
            <CardContent className="p-0">
              <div className="max-h-[500px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Документ</TableHead>
                      <TableHead>Корр. счёт</TableHead>
                      <TableHead className="text-right">Дебет</TableHead>
                      <TableHead className="text-right">Кредит</TableHead>
                      <TableHead>Назначение</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statement.transactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="whitespace-nowrap">{t.date}</TableCell>
                        <TableCell className="text-xs max-w-[200px] truncate">{t.document}</TableCell>
                        <TableCell className="text-xs font-mono">{t.correspondentAccount.slice(-4)}</TableCell>
                        <TableCell className="text-right font-medium text-red-600 whitespace-nowrap">
                          {t.debit > 0 ? formatRubles(t.debit) : '—'}
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-600 whitespace-nowrap">
                          {t.credit > 0 ? formatRubles(t.credit) : '—'}
                        </TableCell>
                        <TableCell className="text-xs max-w-[300px] truncate">{t.purpose}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!statement && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Выписка недоступна для выбранной организации
          </CardContent>
        </Card>
      )}
    </div>
  )
}