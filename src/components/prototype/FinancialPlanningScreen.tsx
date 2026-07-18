'use client'

import React from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatRubles } from '@/data/mockData'

export default function FinancialPlanningScreen() {
  const { financialPlan, organizations, currentOrgId } = useAppStore()

  const orgPlan = financialPlan.find((fp) => fp.organizationId === currentOrgId)
  const rows = orgPlan?.rows ?? []

  const totalPlan = rows.reduce((s, r) => s + r.plan, 0)
  const totalActual = rows.reduce((s, r) => s + r.actual, 0)
  const totalDeviation = totalActual - totalPlan
  const totalPercent = totalPlan > 0 ? (totalActual / totalPlan) * 100 : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Финансовое планирование</h1>
        <p className="text-muted-foreground">План vs Факт за текущий период по организациям</p>
      </div>

      <Tabs defaultValue={currentOrgId} onValueChange={() => {}}>
        <TabsList className="flex-wrap h-auto gap-1">
          {organizations.map((org) => (
            <TabsTrigger key={org.id} value={org.id} className="text-xs">
              {org.name.replace('ООО "Стэк-', '').replace('"', '')}
            </TabsTrigger>
          ))}
        </TabsList>

        {organizations.map((org) => {
          const plan = financialPlan.find((fp) => fp.organizationId === org.id)
          const planRows = plan?.rows ?? []
          const planTotal = planRows.reduce((s, r) => s + r.plan, 0)
          const actualTotal = planRows.reduce((s, r) => s + r.actual, 0)
          const devTotal = actualTotal - planTotal
          const pctTotal = planTotal > 0 ? (actualTotal / planTotal) * 100 : 0

          return (
            <TabsContent key={org.id} value={org.id}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {org.name} — Январь 2025
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Статья расхода</TableHead>
                        <TableHead className="text-right">План (₽)</TableHead>
                        <TableHead className="text-right">Факт (₽)</TableHead>
                        <TableHead className="text-right">Отклонение (₽)</TableHead>
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
                            <TableCell className="text-right">{formatRubles(row.plan)}</TableCell>
                            <TableCell className="text-right">{formatRubles(row.actual)}</TableCell>
                            <TableCell
                              className={`text-right font-medium ${
                                isOverBudget
                                  ? 'text-red-600'
                                  : isUnderBudget
                                  ? 'text-green-600'
                                  : ''
                              }`}
                            >
                              {deviation > 0 ? '+' : ''}
                              {formatRubles(deviation)}
                            </TableCell>
                            <TableCell
                              className={`text-right ${
                                percent > 100
                                  ? 'text-red-600 font-medium'
                                  : percent > 80
                                  ? 'text-green-600'
                                  : ''
                              }`}
                            >
                              {row.plan > 0 ? `${percent.toFixed(1)}%` : '—'}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      {/* Summary */}
                      <TableRow className="bg-muted/50 font-semibold">
                        <TableCell>ИТОГО</TableCell>
                        <TableCell className="text-right">{formatRubles(planTotal)}</TableCell>
                        <TableCell className="text-right">{formatRubles(actualTotal)}</TableCell>
                        <TableCell
                          className={`text-right ${
                            devTotal > 0 ? 'text-red-600' : devTotal < 0 ? 'text-green-600' : ''
                          }`}
                        >
                          {devTotal > 0 ? '+' : ''}
                          {formatRubles(devTotal)}
                        </TableCell>
                        <TableCell
                          className={`text-right ${
                            pctTotal > 100 ? 'text-red-600' : pctTotal > 80 ? 'text-green-600' : ''
                          }`}
                        >
                          {planTotal > 0 ? `${pctTotal.toFixed(1)}%` : '—'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}