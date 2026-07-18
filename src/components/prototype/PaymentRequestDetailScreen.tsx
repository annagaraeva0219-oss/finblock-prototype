'use client'

import React from 'react'
import { useAppStore } from '@/store/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatRubles, getOrgName } from '@/data/mockData'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Send,
  CheckCircle,
  XCircle,
  ClipboardList,
  Clock,
  User,
} from 'lucide-react'

const statusVariant: Record<string, 'secondary' | 'warning' | 'success' | 'destructive'> = {
  'Новая': 'secondary',
  'На согласовании': 'warning',
  'Согласованная': 'success',
  'Не согласована': 'destructive',
}

export default function PaymentRequestDetailScreen() {
  const {
    selectedRequestId,
    paymentRequests,
    organizations,
    counterparties,
    setCurrentScreen,
    setSelectedRequestId,
    submitForApproval,
    approveRequest,
    rejectRequest,
    addToRegister,
  } = useAppStore()

  const request = paymentRequests.find((pr) => pr.id === selectedRequestId)

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground mb-4">Заявка не найдена</p>
        <Button variant="outline" onClick={() => setCurrentScreen('payment-requests')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          К списку заявок
        </Button>
      </div>
    )
  }

  const org = organizations.find((o) => o.id === request.organizationId)
  const cp = counterparties.find((c) => c.id === request.counterpartyId)

  const handleSubmitForApproval = () => {
    submitForApproval(request.id)
    toast.success('Заявка направлена на согласование')
  }

  const handleApprove = () => {
    approveRequest(request.id)
    toast.success('Заявка согласована')
  }

  const handleReject = () => {
    rejectRequest(request.id)
    toast.error('Заявка отклонена')
  }

  const handleToRegister = () => {
    addToRegister(request.id)
    toast.success('Заявка добавлена в реестр платежей')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedRequestId(null)
              setCurrentScreen('payment-requests')
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{request.number}</h1>
              <Badge variant={statusVariant[request.status]}>{request.status}</Badge>
              <Badge variant="outline">{request.source === 'auto' ? 'Из счёта' : 'Вручную'}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">от {request.date}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {request.status === 'Новая' && (
            <Button onClick={handleSubmitForApproval}>
              <Send className="mr-2 h-4 w-4" />
              На согласование
            </Button>
          )}
          {request.status === 'На согласовании' && (
            <>
              <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="mr-2 h-4 w-4" />
                Согласовать
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                <XCircle className="mr-2 h-4 w-4" />
                Отклонить
              </Button>
            </>
          )}
          {request.status === 'Согласованная' && (
            <Button onClick={handleToRegister}>
              <ClipboardList className="mr-2 h-4 w-4" />
              В реестр
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Данные заявки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Организация-плательщик</p>
                  <p className="text-sm font-medium mt-1">{org?.name ?? '—'}</p>
                  {org && (
                    <p className="text-xs text-muted-foreground">ИНН: {org.inn}, КПП: {org.kpp}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Контрагент</p>
                  <p className="text-sm font-medium mt-1">{cp?.name ?? '—'}</p>
                  {cp && (
                    <p className="text-xs text-muted-foreground">ИНН: {cp.inn}, р/с: {cp.bankAccount.slice(-4)}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Сумма</p>
                  <p className="text-xl font-bold mt-1">{formatRubles(request.amount)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Статья расхода</p>
                  <p className="text-sm font-medium mt-1">{request.expenseCategory}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium text-muted-foreground">Назначение платежа</p>
                  <p className="text-sm mt-1">{request.purpose}</p>
                </div>
                {cp && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-medium text-muted-foreground">Банк получателя</p>
                    <p className="text-sm mt-1">{cp.bankName} (БИК: {cp.bik})</p>
                    <p className="text-xs text-muted-foreground">р/с: {cp.bankAccount}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Approval history timeline */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">История согласования</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {request.approvalHistory.map((entry, idx) => (
                  <div key={idx} className="relative flex gap-3 pb-4 last:pb-0">
                    {idx < request.approvalHistory.length - 1 && (
                      <div className="absolute left-[11px] top-6 h-full w-px bg-border" />
                    )}
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{entry.action}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{entry.user}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{entry.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}