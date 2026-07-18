'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { formatRubles } from '@/data/mockData'
import { toast } from 'sonner'
import { Pencil } from 'lucide-react'

export default function FinancialPlanningScreen() {
  const { financialPlan, organizations, currentOrgId, updatePlanRow } = useAppStore()
  const [activeTab, setActiveTab] = useState(currentOrgId)
  const [editRow, setEditRow] = useState<{ orgId: string; category: string; field: 'plan' | 'actual'; currentValue: number } | null>(null)
  const [editValue, setEditValue] = useState('')

  const orgPlan = financialPlan.find((fp) => fp.organizationId === activeTab)
  const rows = orgPlan?.rows ?? []

  const totalPlan = rows.reduce((s, r) => s + r.plan, 0)
  const totalActual = rows.reduce((s, r) => s + r.actual, 0)

  const handleEdit = (orgId: string, category: string, field: 'plan' | 'actual', value: number) => {
    setEditRow({ orgId, category, field, currentValue: value })
    setEditValue(String(value))
  }

  const handleSave = () => {
    if (!editRow) return
    const numVal = parseFloat(editValue)
    if (isNaN(numVal) || numVal < 0) {
      toast.error('Введите корректную сумму')
      return
    }
    updatePlanRow(editRow.orgId, editRow.category, editRow.field, numVal)
    toast.success('Значение обновлено')
    setEditRow(null)
  }

  const renderTable = (orgId: string) => {
    const plan = financialPlan.find((fp) => fp.organizationId === orgId)
    const planRows = plan?.rows ?? []
    const planTotal = planRows.reduce((s, r) => s + r.plan, 0)
    const actualTotal = planRows.reduce((s, r) => s + r.actual, 0)
    const devTotal = actualTotal - planTotal
    const pctTotal = planTotal > 0 ? (actualTotal / planTotal) * 100 : 0
    const org = organizations.find((o) => o.id === orgId)

    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{org?.name} — Январь 2025</CardTitle>
            <p className="text-xs text-muted-foreground">Кликните на сумму для редактирования</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Статья расхода</TableHead>
                <TableHead className="text-right">План (руб.)</TableHead>
                <TableHead className="text-right">Факт (руб.)</TableHead>
                <TableHead className="text-right">Отклонение (руб.)</TableHead>
                <TableHead className="text-right">% выполнения</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {planRows.map((row) => {
                const deviation = row.actual - row.plan
                const percent = row.plan > 0 ? (row.actual / row.plan) * 100 : 0
                const isOverBudget = deviation > 0 && row.plan > 0
                const isUnderBudget = deviation < 0 && row.plan > 0

                return (
                  <TableRow key={row.category}>
                    <TableCell className="font-medium">{row.category}</TableCell>
                    <TableCell
                      className="text-right cursor-pointer hover:bg-muted/50 transition-colors group"
                      onClick={() => handleEdit(orgId, row.category, 'plan', row.plan)}
                    >
                      <span className="group-hover:underline decoration-dotted">{formatRubles(row.plan)}</span>
                      <Pencil className="inline ml-1 h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                    </TableCell>
                    <TableCell
                      className="text-right cursor-pointer hover:bg-muted/50 transition-colors group"
                      onClick={() => handleEdit(orgId, row.category, 'actual', row.actual)}
                    >
                      <span className="group-hover:underline decoration-dotted">{formatRubles(row.actual)}</span>
                      <Pencil className="inline ml-1 h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${
                        isOverBudget ? 'text-red-600' : isUnderBudget ? 'text-green-600' : ''
                      }`}
                    >
                      {deviation > 0 ? '+' : ''}{formatRubles(deviation)}
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        percent > 100 ? 'text-red-600 font-medium' : percent > 80 ? 'text-green-600' : ''
                      }`}
                    >
                      {row.plan > 0 ? `${percent.toFixed(1)}%` : '—'}
                    </TableCell>
                  </TableRow>
                )
              })}
              <TableRow className="bg-muted/50 font-semibold">
                <TableCell>ИТОГО</TableCell>
                <TableCell className="text-right">{formatRubles(planTotal)}</TableCell>
                <TableCell className="text-right">{formatRubles(actualTotal)}</TableCell>
                <TableCell
                  className={`text-right ${devTotal > 0 ? 'text-red-600' : devTotal < 0 ? 'text-green-600' : ''}`}
                >
                  {devTotal > 0 ? '+' : ''}{formatRubles(devTotal)}
                </TableCell>
                <TableCell
                  className={`text-right ${pctTotal > 100 ? 'text-red-600' : pctTotal > 80 ? 'text-green-600' : ''}`}
                >
                  {planTotal > 0 ? `${pctTotal.toFixed(1)}%` : '—'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Финансовое планирование</h1>
        <p className="text-muted-foreground">План vs Факт за текущий период по организациям. Нажмите на сумму для редактирования.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          {organizations.map((org) => (
            <TabsTrigger key={org.id} value={org.id} className="text-xs">
              {org.name.replace('ООО "Стэк-', '').replace('"', '')}
            </TabsTrigger>
          ))}
        </TabsList>

        {organizations.map((org) => (
          <TabsContent key={org.id} value={org.id}>
            {renderTable(org.id)}
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={!!editRow} onOpenChange={(open) => { if (!open) setEditRow(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Редактирование</DialogTitle>
            <DialogDescription>
              {editRow?.category} — {editRow?.field === 'plan' ? 'План' : 'Факт'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-lg border p-3 bg-muted/30">
              <p className="text-xs text-muted-foreground">Текущее значение</p>
              <p className="text-lg font-bold">{editRow ? formatRubles(editRow.currentValue) : ''}</p>
            </div>
            <div className="space-y-2">
              <Label>Новое значение (руб.)</Label>
              <Input
                type="number"
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
                placeholder="0"
                min="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRow(null)}>Отмена</Button>
            <Button onClick={handleSave}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}