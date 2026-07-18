// Mock data for FinBlock — Группа компаний «Стэк»

export interface Organization {
  id: string
  name: string
  inn: string
  kpp: string
  bankAccount: string
  bankName: string
  bik: string
}

export interface Counterparty {
  id: string
  name: string
  inn: string
  kpp: string
  bankAccount: string
  bankName: string
  bik: string
}

export type RequestStatus = 'Новая' | 'На согласовании' | 'Согласованная' | 'Не согласована'
export type OrderStatus = 'Сформировано' | 'Экспортировано'
export type RegisterStatus = 'Ожидает' | 'В поручении' | 'Исполнено'

export interface PaymentRequest {
  id: string
  number: string
  date: string
  organizationId: string
  counterpartyId: string
  counterpartyName: string
  amount: number
  purpose: string
  status: RequestStatus
  expenseCategory: string
  source: 'manual' | 'auto'
  invoiceId?: string
  approvalHistory: { date: string; action: string; user: string }[]
}

export interface Invoice {
  id: string
  number: string
  date: string
  counterpartyId: string
  counterpartyName: string
  inn: string
  amount: number
  purpose: string
  organizationId: string
  expenseCategory: string
  status: 'Обработан' | 'Ожидает'
  linkedRequestId?: string
}

export interface RegisterEntry {
  id: string
  requestId: string
  requestNumber: string
  date: string
  counterpartyName: string
  amount: number
  organizationId: string
  status: RegisterStatus
  orderId?: string
}

export interface PaymentOrder {
  id: string
  number: string
  date: string
  registerEntryIds: string[]
  requestNumbers: string[]
  payerId: string
  amount: number
  status: OrderStatus
}

export interface FinancialPlanRow {
  category: string
  plan: number
  actual: number
}

export interface FinancialPlan {
  organizationId: string
  month: number
  year: number
  rows: FinancialPlanRow[]
}

export interface BankTransaction {
  id: string
  date: string
  document: string
  correspondentAccount: string
  debit: number
  credit: number
  purpose: string
}

export interface BankStatement {
  organizationId: string
  accountNumber: string
  period: string
  openingBalance: number
  transactions: BankTransaction[]
  closingBalance: number
}

export interface CalendarEntry {
  date: string
  plannedAmount: number
  actualAmount: number
  paymentCount: number
  status: 'planned' | 'pending' | 'completed'
  organizationId: string
  description: string
}

export const organizations: Organization[] = [
  {
    id: 'org-1',
    name: 'ООО "Стэк-Строй"',
    inn: '7712345678',
    kpp: '771201001',
    bankAccount: '40702810900000123456',
    bankName: 'ПАО "Сбербанк"',
    bik: '044525225',
  },
  {
    id: 'org-2',
    name: 'ООО "Стэк-Инжиниринг"',
    inn: '7712345679',
    kpp: '771202001',
    bankAccount: '40702810900000234567',
    bankName: 'ПАО "Сбербанк"',
    bik: '044525225',
  },
  {
    id: 'org-3',
    name: 'ООО "Стэк-Монтаж"',
    inn: '7712345680',
    kpp: '771203001',
    bankAccount: '40702810900000345678',
    bankName: 'АО "ВТБ"',
    bik: '044525041',
  },
  {
    id: 'org-4',
    name: 'ООО "Стэк-Логистика"',
    inn: '7712345681',
    kpp: '771204001',
    bankAccount: '40702810900000456789',
    bankName: 'АО "ВТБ"',
    bik: '044525041',
  },
  {
    id: 'org-5',
    name: 'ООО "Стэк-Проект"',
    inn: '7712345682',
    kpp: '771205001',
    bankAccount: '40702810900000567890',
    bankName: 'АО "Альфа-Банк"',
    bik: '044525593',
  },
]

export const counterparties: Counterparty[] = [
  {
    id: 'cp-1',
    name: 'ООО "БетонМастер"',
    inn: '5012345678',
    kpp: '501201001',
    bankAccount: '40702810900001000001',
    bankName: 'ПАО "Сбербанк"',
    bik: '044525225',
  },
  {
    id: 'cp-2',
    name: 'ООО "МеталлСнабПро"',
    inn: '5012345679',
    kpp: '501202001',
    bankAccount: '40702810900002000002',
    bankName: 'ПАО "Сбербанк"',
    bik: '044525225',
  },
  {
    id: 'cp-3',
    name: 'ООО "Арматура-Трейд"',
    inn: '5012345680',
    kpp: '501203001',
    bankAccount: '40702810900003000003',
    bankName: 'АО "ВТБ"',
    bik: '044525041',
  },
  {
    id: 'cp-4',
    name: 'ИП Кузнецов В.П.',
    inn: '500123456789',
    kpp: '',
    bankAccount: '40817810900004000004',
    bankName: 'АО "Альфа-Банк"',
    bik: '044525593',
  },
  {
    id: 'cp-5',
    name: 'ООО "ТрансСтройАвто"',
    inn: '5012345682',
    kpp: '501205001',
    bankAccount: '40702810900005000005',
    bankName: 'ПАО "Сбербанк"',
    bik: '044525225',
  },
  {
    id: 'cp-6',
    name: 'ООО "ЭлектроСнаб"',
    inn: '5012345683',
    kpp: '501206001',
    bankAccount: '40702810900006000006',
    bankName: 'АО "ВТБ"',
    bik: '044525041',
  },
  {
    id: 'cp-7',
    name: 'АО "СтройТехника"',
    inn: '5012345684',
    kpp: '501207001',
    bankAccount: '40702810900007000007',
    bankName: 'ПАО "Сбербанк"',
    bik: '044525225',
  },
  {
    id: 'cp-8',
    name: 'ООО "Прайм-Изоляция"',
    inn: '5012345685',
    kpp: '501208001',
    bankAccount: '40702810900008000008',
    bankName: 'АО "Альфа-Банк"',
    bik: '044525593',
  },
]

export const expenseCategories = [
  'Материалы',
  'Подрядные работы',
  'Аренда техники',
  'Зарплата',
  'Налоги',
  'Прочие',
]

export const paymentRequests: PaymentRequest[] = [
  {
    id: 'pr-1',
    number: 'ЗО-001',
    date: '2025-01-06',
    organizationId: 'org-1',
    counterpartyId: 'cp-1',
    counterpartyName: 'ООО "БетонМастер"',
    amount: 2350000,
    purpose: 'Оплата за поставку бетона М300 по договору №45 от 01.03.2024',
    status: 'Согласованная',
    expenseCategory: 'Материалы',
    source: 'auto',
    invoiceId: 'inv-1',
    approvalHistory: [
      { date: '2025-01-06 09:15', action: 'Создана', user: 'Иванова А.А.' },
      { date: '2025-01-07 10:30', action: 'Направлена на согласование', user: 'Петрова М.И.' },
      { date: '2025-01-08 14:00', action: 'Согласована', user: 'Сидоров К.В.' },
    ],
  },
  {
    id: 'pr-2',
    number: 'ЗО-002',
    date: '2025-01-08',
    organizationId: 'org-1',
    counterpartyId: 'cp-2',
    counterpartyName: 'ООО "МеталлСнабПро"',
    amount: 5780000,
    purpose: 'Оплата за поставку арматуры А500С по договору №78 от 15.05.2024',
    status: 'На согласовании',
    expenseCategory: 'Материалы',
    source: 'manual',
    approvalHistory: [
      { date: '2025-01-08 11:00', action: 'Создана', user: 'Иванова А.А.' },
      { date: '2025-01-09 09:00', action: 'Направлена на согласование', user: 'Петрова М.И.' },
    ],
  },
  {
    id: 'pr-3',
    number: 'ЗО-003',
    date: '2025-01-10',
    organizationId: 'org-2',
    counterpartyId: 'cp-5',
    counterpartyName: 'ООО "ТрансСтройАвто"',
    amount: 890000,
    purpose: 'Оплата за перевозку строительных материалов в январе 2025',
    status: 'Новая',
    expenseCategory: 'Прочие',
    source: 'auto',
    invoiceId: 'inv-3',
    approvalHistory: [
      { date: '2025-01-10 08:45', action: 'Создана автоматически из счёта', user: 'Система' },
    ],
  },
  {
    id: 'pr-4',
    number: 'ЗО-004',
    date: '2025-01-11',
    organizationId: 'org-3',
    counterpartyId: 'cp-7',
    counterpartyName: 'АО "СтройТехника"',
    amount: 4500000,
    purpose: 'Аренда экскаватора CAT 320D на январь 2025',
    status: 'Согласованная',
    expenseCategory: 'Аренда техники',
    source: 'manual',
    approvalHistory: [
      { date: '2025-01-11 10:00', action: 'Создана', user: 'Козлов Д.С.' },
      { date: '2025-01-12 11:30', action: 'Направлена на согласование', user: 'Козлов Д.С.' },
      { date: '2025-01-13 16:00', action: 'Согласована', user: 'Сидоров К.В.' },
    ],
  },
  {
    id: 'pr-5',
    number: 'ЗО-005',
    date: '2025-01-13',
    organizationId: 'org-1',
    counterpartyId: 'cp-4',
    counterpartyName: 'ИП Кузнецов В.П.',
    amount: 320000,
    purpose: 'Оплата за электромонтажные работы на объекте «ЖК Horizon»',
    status: 'Не согласована',
    expenseCategory: 'Подрядные работы',
    source: 'manual',
    approvalHistory: [
      { date: '2025-01-13 09:30', action: 'Создана', user: 'Иванова А.А.' },
      { date: '2025-01-14 10:00', action: 'Направлена на согласование', user: 'Петрова М.И.' },
      { date: '2025-01-15 11:00', action: 'Не согласована — превышение бюджета', user: 'Сидоров К.В.' },
    ],
  },
  {
    id: 'pr-6',
    number: 'ЗО-006',
    date: '2025-01-15',
    organizationId: 'org-4',
    counterpartyId: 'cp-6',
    counterpartyName: 'ООО "ЭлектроСнаб"',
    amount: 1670000,
    purpose: 'Оплата за электрооборудование по договору №112 от 20.09.2024',
    status: 'На согласовании',
    expenseCategory: 'Материалы',
    source: 'auto',
    invoiceId: 'inv-5',
    approvalHistory: [
      { date: '2025-01-15 08:00', action: 'Создана автоматически из счёта', user: 'Система' },
      { date: '2025-01-15 14:00', action: 'Направлена на согласование', user: 'Новикова Е.В.' },
    ],
  },
  {
    id: 'pr-7',
    number: 'ЗО-007',
    date: '2025-01-16',
    organizationId: 'org-2',
    counterpartyId: 'cp-3',
    counterpartyName: 'ООО "Арматура-Трейд"',
    amount: 3120000,
    purpose: 'Оплата за поставку крепежных изделий и метизов',
    status: 'Новая',
    expenseCategory: 'Материалы',
    source: 'manual',
    approvalHistory: [
      { date: '2025-01-16 10:15', action: 'Создана', user: 'Козлов Д.С.' },
    ],
  },
  {
    id: 'pr-8',
    number: 'ЗО-008',
    date: '2025-01-17',
    organizationId: 'org-5',
    counterpartyId: 'cp-8',
    counterpartyName: 'ООО "Прайм-Изоляция"',
    amount: 980000,
    purpose: 'Оплата за гидроизоляционные материалы для проекта «Бизнес-Центр Нова»',
    status: 'Согласованная',
    expenseCategory: 'Материалы',
    source: 'auto',
    invoiceId: 'inv-7',
    approvalHistory: [
      { date: '2025-01-17 09:00', action: 'Создана автоматически из счёта', user: 'Система' },
      { date: '2025-01-17 12:00', action: 'Направлена на согласование', user: 'Федорова Л.А.' },
      { date: '2025-01-18 10:00', action: 'Согласована', user: 'Сидоров К.В.' },
    ],
  },
  {
    id: 'pr-9',
    number: 'ЗО-009',
    date: '2025-01-18',
    organizationId: 'org-1',
    counterpartyId: 'cp-1',
    counterpartyName: 'ООО "БетонМастер"',
    amount: 14500000,
    purpose: 'Оплата за крупную партию бетона для фундамента объекта «ЖК Панорама»',
    status: 'На согласовании',
    expenseCategory: 'Материалы',
    source: 'manual',
    approvalHistory: [
      { date: '2025-01-18 08:30', action: 'Создана', user: 'Иванова А.А.' },
      { date: '2025-01-18 15:00', action: 'Направлена на согласование', user: 'Петрова М.И.' },
    ],
  },
  {
    id: 'pr-10',
    number: 'ЗО-010',
    date: '2025-01-19',
    organizationId: 'org-3',
    counterpartyId: 'cp-5',
    counterpartyName: 'ООО "ТрансСтройАвто"',
    amount: 450000,
    purpose: 'Оплата за вывоз грунта с площадки строительства',
    status: 'Согласованная',
    expenseCategory: 'Прочие',
    source: 'manual',
    approvalHistory: [
      { date: '2025-01-19 09:00', action: 'Создана', user: 'Козлов Д.С.' },
      { date: '2025-01-19 14:00', action: 'Направлена на согласование', user: 'Козлов Д.С.' },
      { date: '2025-01-20 09:30', action: 'Согласована', user: 'Сидоров К.В.' },
    ],
  },
  {
    id: 'pr-11',
    number: 'ЗО-011',
    date: '2025-01-20',
    organizationId: 'org-2',
    counterpartyId: 'cp-2',
    counterpartyName: 'ООО "МеталлСнабПро"',
    amount: 2150000,
    purpose: 'Оплата за поставку профнастила и кровельных материалов',
    status: 'Новая',
    expenseCategory: 'Материалы',
    source: 'auto',
    invoiceId: 'inv-2',
    approvalHistory: [
      { date: '2025-01-20 10:00', action: 'Создана автоматически из счёта', user: 'Система' },
    ],
  },
  {
    id: 'pr-12',
    number: 'ЗО-012',
    date: '2025-01-21',
    organizationId: 'org-1',
    counterpartyId: 'cp-6',
    counterpartyName: 'ООО "ЭлектроСнаб"',
    amount: 780000,
    purpose: 'Оплата за кабельно-проводниковую продукцию',
    status: 'На согласовании',
    expenseCategory: 'Материалы',
    source: 'auto',
    invoiceId: 'inv-6',
    approvalHistory: [
      { date: '2025-01-21 08:00', action: 'Создана автоматически из счёта', user: 'Система' },
      { date: '2025-01-21 13:00', action: 'Направлена на согласование', user: 'Петрова М.И.' },
    ],
  },
]

export const invoices: Invoice[] = [
  {
    id: 'inv-1',
    number: 'СФ-1045 от 05.01.2025',
    date: '2025-01-05',
    counterpartyId: 'cp-1',
    counterpartyName: 'ООО "БетонМастер"',
    inn: '5012345678',
    amount: 2350000,
    purpose: 'Бетон М300, 120 м³',
    organizationId: 'org-1',
    expenseCategory: 'Материалы',
    status: 'Обработан',
    linkedRequestId: 'pr-1',
  },
  {
    id: 'inv-2',
    number: 'СФ-2089 от 18.01.2025',
    date: '2025-01-18',
    counterpartyId: 'cp-2',
    counterpartyName: 'ООО "МеталлСнабПро"',
    inn: '5012345679',
    amount: 2150000,
    purpose: 'Профнастил С-21, 850 м²; кровельные саморезы 5000 шт',
    organizationId: 'org-2',
    expenseCategory: 'Материалы',
    status: 'Обработан',
    linkedRequestId: 'pr-11',
  },
  {
    id: 'inv-3',
    number: 'СФ-0312 от 09.01.2025',
    date: '2025-01-09',
    counterpartyId: 'cp-5',
    counterpartyName: 'ООО "ТрансСтройАвто"',
    inn: '5012345682',
    amount: 890000,
    purpose: 'Перевозка строительных материалов, 12 рейсов',
    organizationId: 'org-2',
    expenseCategory: 'Прочие',
    status: 'Обработан',
    linkedRequestId: 'pr-3',
  },
  {
    id: 'inv-4',
    number: 'СФ-0678 от 12.01.2025',
    date: '2025-01-12',
    counterpartyId: 'cp-3',
    counterpartyName: 'ООО "Арматура-Трейд"',
    inn: '5012345680',
    amount: 4200000,
    purpose: 'Арматура А500С Ø12, 45 тн',
    organizationId: 'org-1',
    expenseCategory: 'Материалы',
    status: 'Ожидает',
  },
  {
    id: 'inv-5',
    number: 'СФ-0901 от 14.01.2025',
    date: '2025-01-14',
    counterpartyId: 'cp-6',
    counterpartyName: 'ООО "ЭлектроСнаб"',
    inn: '5012345683',
    amount: 1670000,
    purpose: 'Кабель ВВГнг 3х4 — 5000 м; автоматические выключатели — 120 шт',
    organizationId: 'org-4',
    expenseCategory: 'Материалы',
    status: 'Обработан',
    linkedRequestId: 'pr-6',
  },
  {
    id: 'inv-6',
    number: 'СФ-1102 от 20.01.2025',
    date: '2025-01-20',
    counterpartyId: 'cp-6',
    counterpartyName: 'ООО "ЭлектроСнаб"',
    inn: '5012345683',
    amount: 780000,
    purpose: 'Кабель ВВГнг 3х2,5 — 3000 м; розетки — 200 шт',
    organizationId: 'org-1',
    expenseCategory: 'Материалы',
    status: 'Обработан',
    linkedRequestId: 'pr-12',
  },
  {
    id: 'inv-7',
    number: 'СФ-0445 от 16.01.2025',
    date: '2025-01-16',
    counterpartyId: 'cp-8',
    counterpartyName: 'ООО "Прайм-Изоляция"',
    inn: '5012345685',
    amount: 980000,
    purpose: 'Мастика битумная — 2 тн; рулонная гидроизоляция — 1500 м²',
    organizationId: 'org-5',
    expenseCategory: 'Материалы',
    status: 'Обработан',
    linkedRequestId: 'pr-8',
  },
  {
    id: 'inv-8',
    number: 'СФ-1234 от 21.01.2025',
    date: '2025-01-21',
    counterpartyId: 'cp-7',
    counterpartyName: 'АО "СтройТехника"',
    inn: '5012345684',
    amount: 2800000,
    purpose: 'Аренда башенного крана Liebherr 150 EC-H, февраль 2025',
    organizationId: 'org-3',
    expenseCategory: 'Аренда техники',
    status: 'Ожидает',
  },
]

export const registerEntries: RegisterEntry[] = [
  {
    id: 're-1',
    requestId: 'pr-1',
    requestNumber: 'ЗО-001',
    date: '2025-01-09',
    counterpartyName: 'ООО "БетонМастер"',
    amount: 2350000,
    organizationId: 'org-1',
    status: 'Исполнено',
    orderId: 'po-1',
  },
  {
    id: 're-2',
    requestId: 'pr-4',
    requestNumber: 'ЗО-004',
    date: '2025-01-14',
    counterpartyName: 'АО "СтройТехника"',
    amount: 4500000,
    organizationId: 'org-3',
    status: 'В поручении',
    orderId: 'po-2',
  },
  {
    id: 're-3',
    requestId: 'pr-8',
    requestNumber: 'ЗО-008',
    date: '2025-01-19',
    counterpartyName: 'ООО "Прайм-Изоляция"',
    amount: 980000,
    organizationId: 'org-5',
    status: 'В поручении',
    orderId: 'po-3',
  },
  {
    id: 're-4',
    requestId: 'pr-10',
    requestNumber: 'ЗО-010',
    date: '2025-01-21',
    counterpartyName: 'ООО "ТрансСтройАвто"',
    amount: 450000,
    organizationId: 'org-3',
    status: 'Ожидает',
  },
  {
    id: 're-5',
    requestId: 'pr-1',
    requestNumber: 'ЗО-001',
    date: '2025-01-22',
    counterpartyName: 'ООО "БетонМастер"',
    amount: 1500000,
    organizationId: 'org-1',
    status: 'Ожидает',
  },
  {
    id: 're-6',
    requestId: 'pr-4',
    requestNumber: 'ЗО-004',
    date: '2025-01-22',
    counterpartyName: 'АО "СтройТехника"',
    amount: 3200000,
    organizationId: 'org-3',
    status: 'Ожидает',
  },
]

export const paymentOrders: PaymentOrder[] = [
  {
    id: 'po-1',
    number: 'ПП-000001',
    date: '2025-01-10',
    registerEntryIds: ['re-1'],
    requestNumbers: ['ЗО-001'],
    payerId: 'org-1',
    amount: 2350000,
    status: 'Экспортировано',
  },
  {
    id: 'po-2',
    number: 'ПП-000002',
    date: '2025-01-15',
    registerEntryIds: ['re-2'],
    requestNumbers: ['ЗО-004'],
    payerId: 'org-3',
    amount: 4500000,
    status: 'Сформировано',
  },
  {
    id: 'po-3',
    number: 'ПП-000003',
    date: '2025-01-20',
    registerEntryIds: ['re-3'],
    requestNumbers: ['ЗО-008'],
    payerId: 'org-5',
    amount: 980000,
    status: 'Сформировано',
  },
  {
    id: 'po-4',
    number: 'ПП-000004',
    date: '2025-01-22',
    registerEntryIds: ['re-5', 're-6'],
    requestNumbers: ['ЗО-001', 'ЗО-004'],
    payerId: 'org-1',
    amount: 4700000,
    status: 'Сформировано',
  },
  {
    id: 'po-5',
    number: 'ПП-000005',
    date: '2025-01-23',
    registerEntryIds: ['re-4'],
    requestNumbers: ['ЗО-010'],
    payerId: 'org-3',
    amount: 450000,
    status: 'Экспортировано',
  },
  {
    id: 'po-6',
    number: 'ПП-000006',
    date: '2025-01-24',
    registerEntryIds: ['re-2'],
    requestNumbers: ['ЗО-004'],
    payerId: 'org-3',
    amount: 3200000,
    status: 'Сформировано',
  },
]

// Financial plan: monthly plan vs actual for January 2025 by organization
export const financialPlan: FinancialPlan[] = [
  {
    organizationId: 'org-1',
    month: 1,
    year: 2025,
    rows: [
      { category: 'Материалы', plan: 12000000, actual: 8430000 },
      { category: 'Подрядные работы', plan: 5000000, actual: 320000 },
      { category: 'Аренда техники', plan: 2000000, actual: 0 },
      { category: 'Зарплата', plan: 4500000, actual: 4500000 },
      { category: 'Налоги', plan: 1800000, actual: 1800000 },
      { category: 'Прочие', plan: 1500000, actual: 350000 },
    ],
  },
  {
    organizationId: 'org-2',
    month: 1,
    year: 2025,
    rows: [
      { category: 'Материалы', plan: 8000000, actual: 5270000 },
      { category: 'Подрядные работы', plan: 3000000, actual: 0 },
      { category: 'Аренда техники', plan: 1000000, actual: 0 },
      { category: 'Зарплата', plan: 3200000, actual: 3200000 },
      { category: 'Налоги', plan: 1200000, actual: 1200000 },
      { category: 'Прочие', plan: 800000, actual: 890000 },
    ],
  },
  {
    organizationId: 'org-3',
    month: 1,
    year: 2025,
    rows: [
      { category: 'Материалы', plan: 2000000, actual: 0 },
      { category: 'Подрядные работы', plan: 4000000, actual: 0 },
      { category: 'Аренда техники', plan: 6000000, actual: 4500000 },
      { category: 'Зарплата', plan: 2800000, actual: 2800000 },
      { category: 'Налоги', plan: 1000000, actual: 1000000 },
      { category: 'Прочие', plan: 600000, actual: 450000 },
    ],
  },
  {
    organizationId: 'org-4',
    month: 1,
    year: 2025,
    rows: [
      { category: 'Материалы', plan: 3000000, actual: 1670000 },
      { category: 'Подрядные работы', plan: 1000000, actual: 0 },
      { category: 'Аренда техники', plan: 500000, actual: 0 },
      { category: 'Зарплата', plan: 2000000, actual: 2000000 },
      { category: 'Налоги', plan: 800000, actual: 800000 },
      { category: 'Прочие', plan: 400000, actual: 120000 },
    ],
  },
  {
    organizationId: 'org-5',
    month: 1,
    year: 2025,
    rows: [
      { category: 'Материалы', plan: 2500000, actual: 980000 },
      { category: 'Подрядные работы', plan: 1500000, actual: 0 },
      { category: 'Аренда техники', plan: 0, actual: 0 },
      { category: 'Зарплата', plan: 1500000, actual: 1500000 },
      { category: 'Налоги', plan: 600000, actual: 600000 },
      { category: 'Прочие', plan: 300000, actual: 50000 },
    ],
  },
]

// Bank statements for org-1 and org-3
export const bankStatements: BankStatement[] = [
  {
    organizationId: 'org-1',
    accountNumber: '40702810900000123456',
    period: 'Январь 2025',
    openingBalance: 45000000,
    transactions: [
      { id: 'bt-1-1', date: '2025-01-03', document: 'Платёжное поручение №890', correspondentAccount: '40702810900001000001', debit: 0, credit: 5000000, purpose: 'Оплата от ООО "БетонМастер" возврат аванса' },
      { id: 'bt-1-2', date: '2025-01-05', document: 'Платёжное поручение №891', correspondentAccount: '40702810900001000001', debit: 3000000, credit: 0, purpose: 'Оплата ООО "БетонМастер" за бетон М300' },
      { id: 'bt-1-3', date: '2025-01-07', document: 'Платёжное поручение №892', correspondentAccount: '40702810900002000002', debit: 2500000, credit: 0, purpose: 'Оплата ООО "МеталлСнабПро" за арматуру' },
      { id: 'bt-1-4', date: '2025-01-08', document: 'Платёжное поручение №893', correspondentAccount: '40702810900004000004', debit: 500000, credit: 0, purpose: 'Оплата ИП Кузнецов В.П. за монтаж' },
      { id: 'bt-1-5', date: '2025-01-09', document: 'Зачисление', correspondentAccount: '40702810999999999999', debit: 0, credit: 12000000, purpose: 'Оплата от заказчика ООО "Девелопмент-Юг" по договору №55' },
      { id: 'bt-1-6', date: '2025-01-10', document: 'Платёжное поручение №894', correspondentAccount: '40702810900001000001', debit: 2350000, credit: 0, purpose: 'Оплата ООО "БетонМастер" по ЗО-001' },
      { id: 'bt-1-7', date: '2025-01-11', document: 'Платёжное поручение №895', correspondentAccount: '40602810900000000001', debit: 4500000, credit: 0, purpose: 'НДС в бюджет за декабрь 2024' },
      { id: 'bt-1-8', date: '2025-01-13', document: 'Зачисление', correspondentAccount: '40702810999999999999', debit: 0, credit: 8000000, purpose: 'Оплата от заказчика АО "ИнвестСтрой" за СМР' },
      { id: 'bt-1-9', date: '2025-01-14', document: 'Платёжное поручение №896', correspondentAccount: '40702810900006000006', debit: 780000, credit: 0, purpose: 'Оплата ООО "ЭлектроСнаб" за кабель' },
      { id: 'bt-1-10', date: '2025-01-15', document: 'Платёжное поручение №897', correspondentAccount: '40602810900000000002', debit: 1200000, credit: 0, purpose: 'НДФЛ за январь 2025' },
      { id: 'bt-1-11', date: '2025-01-16', document: 'Зачисление', correspondentAccount: '40702810999999999999', debit: 0, credit: 6500000, purpose: 'Оплата от ООО "БетонМастер" возврат переплаты' },
      { id: 'bt-1-12', date: '2025-01-17', document: 'Платёжное поручение №898', correspondentAccount: '40702810900002000002', debit: 4000000, credit: 0, purpose: 'Оплата ООО "МеталлСнабПро" по ЗО-002 (частично)' },
      { id: 'bt-1-13', date: '2025-01-18', document: 'Платёжное поручение №899', correspondentAccount: '40702810900006000006', debit: 1670000, credit: 0, purpose: 'Оплата ООО "ЭлектроСнаб" по ЗО-006' },
      { id: 'bt-1-14', date: '2025-01-20', document: 'Зачисление', correspondentAccount: '40702810999999999999', debit: 0, credit: 9500000, purpose: 'Оплата от АО "ИнвестСтрой" промежуточный платёж' },
      { id: 'bt-1-15', date: '2025-01-21', document: 'Платёжное поручение №900', correspondentAccount: '40702810900003000003', debit: 1200000, credit: 0, purpose: 'Оплата ООО "Арматура-Трейд" за метизы' },
      { id: 'bt-1-16', date: '2025-01-22', document: 'Платёжное поручение №901', correspondentAccount: '40602810900000000003', debit: 600000, credit: 0, purpose: 'Страховые взносы за январь 2025' },
      { id: 'bt-1-17', date: '2025-01-23', document: 'Зачисление', correspondentAccount: '40702810999999999999', debit: 0, credit: 5000000, purpose: 'Кредитовый лимит — зачисление' },
    ],
    closingBalance: 0, // will be calculated
  },
  {
    organizationId: 'org-3',
    accountNumber: '40702810900000345678',
    period: 'Январь 2025',
    openingBalance: 22000000,
    transactions: [
      { id: 'bt-3-1', date: '2025-01-03', document: 'Платёжное поручение №210', correspondentAccount: '40702810900007000007', debit: 3500000, credit: 0, purpose: 'Аренда экскаватора CAT 320D декабрь 2024' },
      { id: 'bt-3-2', date: '2025-01-05', document: 'Зачисление', correspondentAccount: '40702810999999999999', debit: 0, credit: 7500000, purpose: 'Оплата от ООО "Стэк-Строй" по договору внутри группы' },
      { id: 'bt-3-3', date: '2025-01-07', document: 'Платёжное поручение №211', correspondentAccount: '40702810900005000005', debit: 1200000, credit: 0, purpose: 'Оплата ООО "ТрансСтройАвто" за перевозку' },
      { id: 'bt-3-4', date: '2025-01-09', document: 'Платёжное поручение №212', correspondentAccount: '40602810900000000004', debit: 2800000, credit: 0, purpose: 'НДС за декабрь 2024' },
      { id: 'bt-3-5', date: '2025-01-10', document: 'Зачисление', correspondentAccount: '40702810999999999999', debit: 0, credit: 4200000, purpose: 'Оплата от заказчика за монтаж конструкций' },
      { id: 'bt-3-6', date: '2025-01-12', document: 'Платёжное поручение №213', correspondentAccount: '40702810900007000007', debit: 4500000, credit: 0, purpose: 'Аренда экскаватора CAT 320D январь 2025' },
      { id: 'bt-3-7', date: '2025-01-14', document: 'Зачисление', correspondentAccount: '40702810999999999999', debit: 0, credit: 6000000, purpose: 'Оплата от ООО "Стэк-Инжиниринг" по договору' },
      { id: 'bt-3-8', date: '2025-01-15', document: 'Платёжное поручение №214', correspondentAccount: '40602810900000000005', debit: 1000000, credit: 0, purpose: 'НДФЛ за январь 2025' },
      { id: 'bt-3-9', date: '2025-01-17', document: 'Платёжное поручение №215', correspondentAccount: '40702810900005000005', debit: 450000, credit: 0, purpose: 'Оплата ООО "ТрансСтройАвто" вывоз грунта' },
      { id: 'bt-3-10', date: '2025-01-19', document: 'Зачисление', correspondentAccount: '40702810999999999999', debit: 0, credit: 3800000, purpose: 'Оплата от АО "СтройТехника" возврат' },
      { id: 'bt-3-11', date: '2025-01-20', document: 'Платёжное поручение №216', correspondentAccount: '40602810900000000006', debit: 500000, credit: 0, purpose: 'Страховые взносы за январь 2025' },
      { id: 'bt-3-12', date: '2025-01-21', document: 'Платёжное поручение №217', correspondentAccount: '40702810900007000007', debit: 2800000, credit: 0, purpose: 'Аренда башенного крана Liebherr февраль 2025' },
      { id: 'bt-3-13', date: '2025-01-22', document: 'Зачисление', correspondentAccount: '40702810999999999999', debit: 0, credit: 5500000, purpose: 'Оплата от заказчика за электромонтаж' },
      { id: 'bt-3-14', date: '2025-01-23', document: 'Платёжное поручение №218', correspondentAccount: '40702810900001000001', debit: 800000, credit: 0, purpose: 'Оплата ООО "БетонМастер" за бетон' },
      { id: 'bt-3-15', date: '2025-01-24', document: 'Платёжное поручение №219', correspondentAccount: '40702810900004000004', debit: 350000, credit: 0, purpose: 'Оплата ИП Кузнецов В.П. за сварочные работы' },
      { id: 'bt-3-16', date: '2025-01-25', document: 'Зачисление', correspondentAccount: '40702810999999999999', debit: 0, credit: 3000000, purpose: 'Оплата от ООО "Стэк-Строй" — внутри группы' },
    ],
    closingBalance: 0,
  },
]

// Calculate closing balances
bankStatements[0].closingBalance =
  bankStatements[0].openingBalance +
  bankStatements[0].transactions.reduce((s, t) => s + t.credit - t.debit, 0)
bankStatements[1].closingBalance =
  bankStatements[1].openingBalance +
  bankStatements[1].transactions.reduce((s, t) => s + t.credit - t.debit, 0)

// Calendar entries derived from register + plan
export const calendarEntries: CalendarEntry[] = [
  { date: '2025-01-03', plannedAmount: 3500000, actualAmount: 3500000, paymentCount: 1, status: 'completed', organizationId: 'org-1', description: 'Оплата ООО "БетонМастер" — возврат аванса' },
  { date: '2025-01-05', plannedAmount: 5500000, actualAmount: 5500000, paymentCount: 2, status: 'completed', organizationId: 'org-1', description: 'Оплата за бетон и арматуру' },
  { date: '2025-01-07', plannedAmount: 3700000, actualAmount: 3700000, paymentCount: 2, status: 'completed', organizationId: 'org-1', description: 'Оплата за арматуру и перевозку' },
  { date: '2025-01-08', plannedAmount: 500000, actualAmount: 500000, paymentCount: 1, status: 'completed', organizationId: 'org-1', description: 'Оплата ИП Кузнецов за монтаж' },
  { date: '2025-01-10', plannedAmount: 6850000, actualAmount: 6850000, paymentCount: 2, status: 'completed', organizationId: 'org-1', description: 'Оплата ООО "БетонМастер" и НДС' },
  { date: '2025-01-13', plannedAmount: 8000000, actualAmount: 8000000, paymentCount: 1, status: 'completed', organizationId: 'org-1', description: 'Зачисление от АО "ИнвестСтрой"' },
  { date: '2025-01-14', plannedAmount: 1200000, actualAmount: 1200000, paymentCount: 1, status: 'completed', organizationId: 'org-1', description: 'Оплата за кабель' },
  { date: '2025-01-15', plannedAmount: 1200000, actualAmount: 1200000, paymentCount: 1, status: 'completed', organizationId: 'org-1', description: 'НДФЛ за январь 2025' },
  { date: '2025-01-17', plannedAmount: 4000000, actualAmount: 4000000, paymentCount: 1, status: 'completed', organizationId: 'org-1', description: 'Оплата ООО "МеталлСнабПро"' },
  { date: '2025-01-20', plannedAmount: 9500000, actualAmount: 9500000, paymentCount: 1, status: 'completed', organizationId: 'org-1', description: 'Зачисление от АО "ИнвестСтрой"' },
  { date: '2025-01-22', plannedAmount: 1800000, actualAmount: 1800000, paymentCount: 2, status: 'completed', organizationId: 'org-1', description: 'Оплата за метизы и взносы' },
  { date: '2025-01-24', plannedAmount: 5000000, actualAmount: 0, paymentCount: 0, status: 'planned', organizationId: 'org-1', description: 'Плановый платёж по договору' },
  { date: '2025-01-27', plannedAmount: 3200000, actualAmount: 0, paymentCount: 0, status: 'planned', organizationId: 'org-1', description: 'Плановая оплата подрядчику' },
  { date: '2025-01-29', plannedAmount: 2000000, actualAmount: 0, paymentCount: 0, status: 'planned', organizationId: 'org-1', description: 'Плановая аренда техники' },
  { date: '2025-01-31', plannedAmount: 1500000, actualAmount: 0, paymentCount: 0, status: 'planned', organizationId: 'org-1', description: 'Прочие плановые платежи' },
  { date: '2025-01-03', plannedAmount: 3500000, actualAmount: 3500000, paymentCount: 1, status: 'completed', organizationId: 'org-3', description: 'Аренда экскаватора декабрь 2024' },
  { date: '2025-01-05', plannedAmount: 7500000, actualAmount: 7500000, paymentCount: 1, status: 'completed', organizationId: 'org-3', description: 'Зачисление от ООО "Стэк-Строй"' },
  { date: '2025-01-07', plannedAmount: 1200000, actualAmount: 1200000, paymentCount: 1, status: 'completed', organizationId: 'org-3', description: 'Оплата за перевозку' },
  { date: '2025-01-09', plannedAmount: 2800000, actualAmount: 2800000, paymentCount: 1, status: 'completed', organizationId: 'org-3', description: 'НДС за декабрь 2024' },
  { date: '2025-01-12', plannedAmount: 4500000, actualAmount: 4500000, paymentCount: 1, status: 'completed', organizationId: 'org-3', description: 'Аренда экскаватора январь 2025' },
  { date: '2025-01-15', plannedAmount: 1000000, actualAmount: 1000000, paymentCount: 1, status: 'completed', organizationId: 'org-3', description: 'НДФЛ за январь 2025' },
  { date: '2025-01-17', plannedAmount: 450000, actualAmount: 450000, paymentCount: 1, status: 'completed', organizationId: 'org-3', description: 'Вывоз грунта' },
  { date: '2025-01-20', plannedAmount: 500000, actualAmount: 500000, paymentCount: 1, status: 'completed', organizationId: 'org-3', description: 'Страховые взносы' },
  { date: '2025-01-22', plannedAmount: 2800000, actualAmount: 2800000, paymentCount: 1, status: 'completed', organizationId: 'org-3', description: 'Аренда башенного крана' },
  { date: '2025-01-24', plannedAmount: 1150000, actualAmount: 1150000, paymentCount: 2, status: 'completed', organizationId: 'org-3', description: 'Оплата за бетон и сварку' },
  { date: '2025-01-27', plannedAmount: 2000000, actualAmount: 0, paymentCount: 0, status: 'planned', organizationId: 'org-3', description: 'Плановый платёж по подряду' },
  { date: '2025-01-30', plannedAmount: 3500000, actualAmount: 0, paymentCount: 0, status: 'planned', organizationId: 'org-3', description: 'Плановая аренда февраля' },
]

// Helper to format rubles
export function formatRubles(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Helper to get org name by id
export function getOrgName(orgId: string): string {
  return organizations.find((o) => o.id === orgId)?.name ?? '—'
}

// Helper to get counterparty name by id
export function getCounterpartyName(cpId: string): string {
  return counterparties.find((c) => c.id === cpId)?.name ?? '—'
}

// Helper to get counterparty INN by id
export function getCounterpartyInn(cpId: string): string {
  return counterparties.find((c) => c.id === cpId)?.inn ?? ''
}