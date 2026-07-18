# FinBlock Prototype — Worklog

## Дата: 2025-01-24

## Обзор
Создан полноценный прототип финансовой системы управления платежами для группы компаний «Стэк» на базе Next.js 16 с App Router.

## Созданные файлы

### UI компоненты (src/components/ui/) — 17 файлов
| Файл | Описание |
|------|----------|
| `button.tsx` | Кнопка с вариантами (default, destructive, outline, secondary, ghost, link) |
| `card.tsx` | Карточка (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter) |
| `table.tsx` | Таблица (Table, TableHeader, TableBody, TableRow, TableHead, TableCell) |
| `tabs.tsx` | Вкладки на базе @radix-ui/react-tabs |
| `badge.tsx` | Бейдж с вариантами (default, secondary, destructive, outline, success, warning) |
| `input.tsx` | Текстовый ввод |
| `label.tsx` | Метка на базе @radix-ui/react-label |
| `select.tsx` | Выпадающий список на базе @radix-ui/react-select |
| `separator.tsx` | Разделитель на базе @radix-ui/react-separator |
| `switch.tsx` | Переключатель на базе @radix-ui/react-switch |
| `textarea.tsx` | Многострочный текстовый ввод |
| `scroll-area.tsx` | Область прокрутки на базе @radix-ui/react-scroll-area |
| `dialog.tsx` | Диалоговое окно на базе @radix-ui/react-dialog |
| `progress.tsx` | Прогресс-бар на базе @radix-ui/react-progress |
| `tooltip.tsx` | Всплывающая подсказка на базе @radix-ui/react-tooltip |
| `popover.tsx` | Всплывающая панель на базе @radix-ui/react-popover |
| `sonner.tsx` / `toaster.tsx` | Уведомления (sonner) |

### Данные и состояние
| Файл | Описание |
|------|----------|
| `src/data/mockData.ts` | Моковые данные: 5 организаций, 8 контрагентов, 12 заявок, 8 счетов, 6 записей реестра, 6 поручений, финплан, банковские выписки, календарь |
| `src/store/useAppStore.ts` | Zustand-хранилище с действиями: создание заявок/счетов, согласование, реестр, поручения, экспорт |
| `src/hooks/use-mobile.ts` | Хук для определения мобильного устройства |

### Экранные компоненты (src/components/prototype/) — 12 файлов
| Файл | Описание |
|------|----------|
| `AppShell.tsx` | Основная раскладка: хедер, боковая навигация, роутинг экранов |
| `DashboardScreen.tsx` | Панель управления: KPI-карточки, диаграмма (recharts), последние заявки |
| `EnterInvoiceScreen.tsx` | Ввод данных счёта с автосозданием заявки |
| `PaymentRequestsScreen.tsx` | Список заявок с фильтрами, поиском, статусами |
| `CreateRequestDialog.tsx` | Диалог создания заявки вручную |
| `PaymentRequestDetailScreen.tsx` | Детальная карточка заявки с историей согласования и действиями |
| `PaymentRegisterScreen.tsx` | Реестр платежей с чекбоксами и формированием поручений |
| `PaymentOrdersScreen.tsx` | Платёжные поручения с экспортом в клиент-банк |
| `FinancialPlanningScreen.tsx` | План vs Факт по организациям с отклонениями |
| `PaymentCalendarScreen.tsx` | Календарь платежей с цветовой индикацией и боковой панелью |
| `BankReportsScreen.tsx` | Банковские выписки (счёт 51) с сводкой по оборотам |
| `IntegrationSettingsScreen.tsx` | Настройки интеграций: 1С:Бухгалтерия, Клиент-банк, журнал синхронизации |

### Точки входа
| Файл | Описание |
|------|----------|
| `src/app/layout.tsx` | Root layout с шрифтами Geist, metadata, Toaster |
| `src/app/page.tsx` | Главная страница — рендерит AppShell |
| `src/app/api/route.ts` | Простой API-эндпоинт GET /api |

## Проверка
- TypeScript type check (`tsc --noEmit`): пройден без ошибок
- Все тексты на русском языке
- Использованы только разрешённые пакеты из package.json
- Белый фон, профессиональный дизайн

## Примечания
- ESLint не настроен (отсутствует конфиг), но TypeScript компиляция успешна
- `next lint` в Next.js 16 имеет известное поведение с аргументами командной строки