# ДОКУМЕНТАЦИЯ К ДИПЛОМНОМУ ПРОЕКТУ
# «NomadDrive» — Веб-платформа для аренды, продажи автомобилей и запчастей

---

## СОДЕРЖАНИЕ

1. [Введение](#1-введение)
2. [Анализ предметной области](#2-анализ-предметной-области)
3. [Цели и задачи проекта](#3-цели-и-задачи-проекта)
4. [Требования к системе](#4-требования-к-системе)
5. [Технологический стек](#5-технологический-стек)
6. [Архитектура приложения](#6-архитектура-приложения)
7. [Структура базы данных](#7-структура-базы-данных)
8. [Модули и функциональность](#8-модули-и-функциональность)
9. [Интерфейс пользователя](#9-интерфейс-пользователя)
10. [Аутентификация и безопасность](#10-аутентификация-и-безопасность)
11. [API и взаимодействие с данными](#11-api-и-взаимодействие-с-данными)
12. [Административная панель](#12-административная-панель)
13. [Производительность и оптимизация](#13-производительность-и-оптимизация)
14. [Развёртывание и настройка](#14-развёртывание-и-настройка)
15. [Тестирование](#15-тестирование)
16. [Заключение](#16-заключение)

---

## 1. ВВЕДЕНИЕ

### 1.1 Общее описание проекта

**NomadDrive** — это полнофункциональная веб-платформа, разработанная для оказания услуг по аренде и продаже автомобилей, а также торговле автомобильными запчастями. Платформа ориентирована на казахстанский рынок и поддерживает два языка интерфейса: русский и казахский.

Проект представляет собой современное веб-приложение, построенное с использованием передовых технологий и архитектурных подходов. Он объединяет три ключевых направления автомобильного рынка на одной платформе:

- **Аренда автомобилей** — каталог транспортных средств с системой онлайн-бронирования
- **Продажа автомобилей** — маркетплейс для приобретения автомобилей с пробегом и новых
- **Автозапчасти** — каталог запчастей с функционалом корзины и оформления заказов

Приложение реализует полный жизненный цикл взаимодействия с пользователем: от регистрации и просмотра каталога до оформления бронирования или покупки, отслеживания статуса и управления историей заказов в личном кабинете.

### 1.2 Актуальность разработки

Автомобильный рынок Казахстана демонстрирует стабильный рост. По данным аналитических агентств, рынок аренды автомобилей в стране ежегодно увеличивается на 12–15%. При этом большинство существующих сервисов:

- Не имеют удобных онлайн-инструментов для бронирования
- Не поддерживают государственный язык (казахский)
- Не объединяют аренду, продажу и запчасти в единой экосистеме
- Имеют устаревший интерфейс, не адаптированный для мобильных устройств

NomadDrive решает все перечисленные проблемы, предлагая современную, удобную и многофункциональную платформу.

### 1.3 Практическая значимость

Разработанная платформа может быть использована:
- Компаниями по аренде автомобилей для перевода бизнеса в онлайн
- Автосалонами и дилерами для организации онлайн-продаж
- Магазинами автозапчастей для электронной торговли
- Частными лицами для публикации объявлений о продаже

---

## 2. АНАЛИЗ ПРЕДМЕТНОЙ ОБЛАСТИ

### 2.1 Обзор рынка

Казахстанский рынок онлайн-аренды автомобилей находится на стадии активного развития. Основные игроки — небольшие региональные компании с ограниченными онлайн-возможностями. Крупные международные агрегаторы (Booking.com Cars, Rentalcars.com) присутствуют, но не учитывают местную специфику и не работают с казахским языком.

### 2.2 Анализ конкурентов

| Критерий | NomadDrive | Типичный конкурент |
|---|---|---|
| Онлайн-бронирование | Да | Частично |
| Казахский язык | Да | Нет |
| Каталог запчастей | Да | Нет |
| Мобильная адаптация | Полная | Частичная |
| Промокоды | Да | Редко |
| Личный кабинет | Полный | Минимальный |
| QR-код для заезда | Да | Нет |
| Тёмная тема | Да | Нет |

### 2.3 Целевая аудитория

**Первичная аудитория:**
- Физические лица 25–45 лет, нуждающиеся в краткосрочной аренде автомобиля
- Туристы и командировочные в казахстанских городах

**Вторичная аудитория:**
- Покупатели подержанных автомобилей
- Автовладельцы, ищущие запчасти по выгодным ценам
- Бизнес-клиенты (корпоративная аренда)

---

## 3. ЦЕЛИ И ЗАДАЧИ ПРОЕКТА

### 3.1 Цель проекта

Разработать современную многофункциональную веб-платформу для автомобильного рынка Казахстана, обеспечивающую удобный онлайн-доступ к услугам аренды, продажи автомобилей и приобретения запчастей.

### 3.2 Задачи проекта

**Функциональные задачи:**
1. Реализовать систему регистрации и аутентификации пользователей
2. Разработать каталог автомобилей для аренды с системой онлайн-бронирования
3. Создать маркетплейс для продажи автомобилей
4. Построить каталог автозапчастей с корзиной и оформлением заказов
5. Реализовать личный кабинет пользователя с историей бронирований и заказов
6. Разработать административную панель для управления контентом
7. Внедрить систему промокодов и скидок
8. Обеспечить двуязычность интерфейса (русский/казахский)
9. Реализовать генерацию QR-кодов для подтверждения бронирований

**Технические задачи:**
1. Построить приложение на основе Next.js App Router
2. Интегрировать облачную БД Supabase (PostgreSQL)
3. Настроить защищённую аутентификацию через Supabase Auth
4. Обеспечить адаптивный дизайн для мобильных устройств
5. Оптимизировать производительность приложения

---

## 4. ТРЕБОВАНИЯ К СИСТЕМЕ

### 4.1 Функциональные требования

#### Для незарегистрированных пользователей:
- FR-01: Просмотр каталога автомобилей для аренды
- FR-02: Просмотр каталога автомобилей для продажи
- FR-03: Просмотр каталога автозапчастей
- FR-04: Просмотр детальных страниц товаров
- FR-05: Фильтрация и сортировка каталогов
- FR-06: Регистрация нового аккаунта
- FR-07: Вход в существующий аккаунт
- FR-08: Добавление товаров в корзину (без аккаунта)

#### Для зарегистрированных пользователей:
- FR-09: Бронирование автомобилей на конкретные даты
- FR-10: Применение промокодов при бронировании
- FR-11: Оформление заказов из корзины
- FR-12: Просмотр истории бронирований
- FR-13: Просмотр истории заказов
- FR-14: Скачивание QR-кода бронирования
- FR-15: Редактирование профиля

#### Для администраторов:
- FR-16: Добавление/редактирование/удаление автомобилей для аренды
- FR-17: Добавление/редактирование/удаление автомобилей для продажи
- FR-18: Добавление/редактирование/удаление запчастей
- FR-19: Управление статусами бронирований
- FR-20: Управление статусами заказов
- FR-21: Просмотр общей статистики

### 4.2 Нефункциональные требования

- **NFR-01 Производительность:** Время загрузки страниц — не более 3 секунд
- **NFR-02 Доступность:** Поддержка браузеров Chrome, Firefox, Safari, Edge (последние 2 версии)
- **NFR-03 Адаптивность:** Корректное отображение на экранах от 320px
- **NFR-04 Безопасность:** Шифрование паролей, защищённые HTTP-сессии
- **NFR-05 Масштабируемость:** Возможность расширения функционала без переработки архитектуры
- **NFR-06 Надёжность:** Доступность сервиса 99.5% времени (SLA Supabase)

### 4.3 Системные требования

**Для разработки:**
- Node.js 20+
- npm 10+
- Git

**Для развёртывания:**
- Vercel / любой хостинг с поддержкой Node.js
- Supabase-аккаунт (облачный)

---

## 5. ТЕХНОЛОГИЧЕСКИЙ СТЕК

### 5.1 Обзор технологий

Для разработки NomadDrive был выбран современный стек технологий, обеспечивающий высокую производительность, удобство разработки и масштабируемость.

### 5.2 Фреймворк: Next.js 16

**Next.js** — React-фреймворк для production-ready веб-приложений, разработанный компанией Vercel.

Ключевые особенности, использованные в проекте:

**App Router (новая архитектура маршрутизации):**
- Файловая система как маршрутизатор (каждая папка = маршрут)
- Server Components по умолчанию — рендеринг на стороне сервера без отправки JavaScript клиенту
- Client Components для интерактивных элементов (`'use client'`)
- Route Groups для логической организации маршрутов без влияния на URL

**Rendering стратегии:**
- **SSR (Server-Side Rendering)** — данные каталогов загружаются на сервере
- **CSR (Client-Side Rendering)** — фильтрация, корзина, формы
- **Static Generation** — статические страницы (landing, FAQ)

**Image Optimization:**
- Автоматическая оптимизация изображений через `next/image`
- Поддержка форматов WebP/AVIF
- Lazy loading из коробки

```
Версия: Next.js 16.2.3
Язык: TypeScript 5
```

### 5.3 Язык программирования: TypeScript 5

TypeScript — типизированное надмножество JavaScript, обеспечивающее:
- Статическую проверку типов на этапе компиляции
- Автодополнение в IDE
- Самодокументирующийся код через интерфейсы и типы
- Раннее обнаружение ошибок

В проекте TypeScript используется для определения типов всех сущностей предметной области: автомобили, заказы, пользователи, запчасти.

### 5.4 База данных: Supabase (PostgreSQL)

**Supabase** — Backend-as-a-Service платформа на основе PostgreSQL с открытым исходным кодом.

Используемые возможности:
- **PostgreSQL** — реляционная СУБД для хранения данных
- **Supabase Auth** — готовый сервис аутентификации
- **Supabase JS Client** — JavaScript SDK для работы с БД
- **Row Level Security (RLS)** — политики безопасности на уровне строк
- **Storage** — хранилище для медиафайлов

Преимущества перед альтернативами:
| Критерий | Supabase | Firebase | MongoDB Atlas |
|---|---|---|---|
| Реляционная БД | Да (PostgreSQL) | Нет | Нет |
| Открытый код | Да | Нет | Нет |
| RLS политики | Да | Нет | Нет |
| Бесплатный уровень | Щедрый | Ограниченный | Ограниченный |
| SQL-запросы | Да | Нет | Нет |

### 5.5 Стилизация: Tailwind CSS 4

**Tailwind CSS** — utility-first CSS-фреймворк.

Особенности использования в проекте:
- Кастомные CSS-переменные для цветовой схемы
- Тёмная тема как основная
- Кастомные анимации через `@keyframes`
- Responsive-классы для адаптивной вёрстки

```
Версия: Tailwind CSS 4 (PostCSS плагин)
PostCSS: 4
```

### 5.6 Иконки: Lucide React

**Lucide React** — библиотека SVG-иконок для React. Используется для всех иконок интерфейса: навигация, статусы, действия. Преимущество перед Font Awesome — иконки импортируются поштучно (tree-shaking), что снижает итоговый размер бандла.

### 5.7 QR-коды: qrcode

Библиотека `qrcode` используется для генерации QR-кодов при подтверждении бронирований. QR-код содержит уникальный идентификатор бронирования и позволяет сотруднику автопроката быстро проверить заезд клиента.

### 5.8 Полный список зависимостей

```json
{
  "next": "^16.2.3",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5",
  "@supabase/supabase-js": "latest",
  "@supabase/ssr": "latest",
  "tailwindcss": "^4",
  "lucide-react": "latest",
  "qrcode": "^1.5.4"
}
```

---

## 6. АРХИТЕКТУРА ПРИЛОЖЕНИЯ

### 6.1 Общая архитектура

NomadDrive построена на трёхуровневой архитектуре:

```
┌─────────────────────────────────────────────┐
│              КЛИЕНТСКИЙ СЛОЙ                │
│  Браузер: React компоненты, LocalStorage    │
└──────────────────┬──────────────────────────┘
                   │ HTTP/HTTPS
┌──────────────────▼──────────────────────────┐
│            СЕРВЕРНЫЙ СЛОЙ (Next.js)         │
│  Server Components, API Routes, Middleware  │
└──────────────────┬──────────────────────────┘
                   │ Supabase JS Client
┌──────────────────▼──────────────────────────┐
│              СЛОЙ ДАННЫХ                    │
│  Supabase: PostgreSQL + Auth + Storage      │
└─────────────────────────────────────────────┘
```

### 6.2 Структура директорий

```
nomaddrive/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Корневой layout (шрифты, метаданные)
│   │   ├── globals.css             # Глобальные стили и анимации
│   │   ├── (auth)/                 # Route Group: аутентификация
│   │   │   ├── layout.tsx          # Layout для auth-страниц
│   │   │   ├── login/
│   │   │   │   └── page.tsx        # Страница входа
│   │   │   └── register/
│   │   │       └── page.tsx        # Страница регистрации
│   │   ├── (main)/                 # Route Group: основное приложение
│   │   │   ├── layout.tsx          # Layout с Navbar и Footer
│   │   │   ├── page.tsx            # Главная страница (SSR)
│   │   │   ├── LandingPage.tsx     # Landing-компонент (Client)
│   │   │   ├── rent/               # Модуль аренды
│   │   │   │   ├── page.tsx        # Каталог аренды (SSR)
│   │   │   │   ├── CatalogClient.tsx
│   │   │   │   ├── CarCard.tsx
│   │   │   │   └── [id]/           # Детальная страница авто
│   │   │   │       ├── page.tsx
│   │   │   │       └── BookingWidget.tsx
│   │   │   ├── sale/               # Модуль продажи
│   │   │   │   ├── page.tsx
│   │   │   │   ├── SaleClient.tsx
│   │   │   │   ├── SaleCard.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── parts/              # Модуль запчастей
│   │   │   │   ├── page.tsx
│   │   │   │   ├── PartsClient.tsx
│   │   │   │   ├── PartCard.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── cart/               # Корзина
│   │   │   │   └── page.tsx
│   │   │   └── dashboard/          # Личный кабинет
│   │   │       ├── page.tsx
│   │   │       ├── DashboardClient.tsx
│   │   │       ├── profile/page.tsx
│   │   │       ├── bookings/
│   │   │       │   ├── page.tsx
│   │   │       │   └── [id]/page.tsx
│   │   │       └── orders/
│   │   │           ├── page.tsx
│   │   │           └── [id]/page.tsx
│   │   └── admin/                  # Административная панель
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── AdminSidebar.tsx
│   │       ├── cars/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/edit/page.tsx
│   │       ├── sale/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/edit/page.tsx
│   │       ├── parts/
│   │       │   ├── page.tsx
│   │       │   ├── new/page.tsx
│   │       │   └── [id]/edit/page.tsx
│   │       ├── bookings/page.tsx
│   │       └── orders/page.tsx
│   ├── components/                 # Переиспользуемые компоненты
│   │   ├── shared/
│   │   │   ├── Navbar.tsx          # Server-компонент навбара
│   │   │   ├── NavbarClient.tsx    # Client-компонент навбара
│   │   │   ├── MobileMenu.tsx      # Мобильное меню
│   │   │   ├── Footer.tsx          # Подвал
│   │   │   └── LogoutButton.tsx    # Кнопка выхода
│   │   └── ui/                     # Базовые UI-компоненты
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       └── Input.tsx
│   ├── lib/                        # Вспомогательные функции
│   │   ├── supabase/
│   │   │   ├── client.ts           # Supabase-клиент (браузер)
│   │   │   └── server.ts           # Supabase-клиент (сервер)
│   │   └── utils.ts                # Утилиты
│   ├── contexts/
│   │   └── LanguageContext.tsx     # Контекст локализации
│   ├── types/
│   │   └── index.ts                # Все TypeScript типы
│   └── proxy.ts                    # Middleware (защита маршрутов)
├── public/                         # Статические ресурсы
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── postcss.config.mjs
```

### 6.3 Паттерн Server/Client компонентов

В Next.js App Router все компоненты по умолчанию являются Server Components (рендерятся на сервере). Для компонентов с интерактивностью используется директива `'use client'`.

**Пример разделения:**
```
rent/page.tsx (Server)          rent/CatalogClient.tsx (Client)
  └── Загружает данные из БД      └── Фильтрация, состояние UI
       └── Передаёт в Client           └── Реагирует на действия
```

**Преимущества:**
- Меньше JavaScript отправляется клиенту
- Лучшие показатели Core Web Vitals
- SEO-оптимизация (контент доступен поисковикам)

### 6.4 Middleware (Route Protection)

Файл `src/proxy.ts` реализует защиту маршрутов на уровне middleware Next.js. Он перехватывает каждый запрос до рендеринга страницы:

```
Запрос пользователя
        │
        ▼
  proxy.ts middleware
        │
   ┌────┴────┐
   │  Auth?  │
   └────┬────┘
        │
  ┌─────┴──────┐
  │            │
Да (авториз.) Нет
  │            │
  ▼            ▼
Разрешить   Редирект
  доступ    на /login
```

**Защищённые маршруты:**
- `/dashboard/*` — только для авторизованных пользователей
- `/cart` — только для авторизованных пользователей
- `/admin/*` — только для пользователей с ролью `admin`

### 6.5 Система управления состоянием

В проекте используется минималистичный подход к управлению состоянием:

| Тип состояния | Хранилище |
|---|---|
| Аутентификация | Supabase Auth (cookie) |
| Корзина | localStorage |
| Фильтры каталога | React useState (локальный) |
| Язык интерфейса | React Context |
| Данные пользователя | Server-side (Supabase) |
| UI-состояние (модалки) | React useState (локальный) |

---

## 7. СТРУКТУРА БАЗЫ ДАННЫХ

### 7.1 Обзор схемы

База данных NomadDrive построена на PostgreSQL через Supabase. Схема содержит 9 основных таблиц, связанных внешними ключами.

### 7.2 Диаграмма связей (ERD)

```
auth.users (Supabase)
    │ 1:1
    ▼
profiles ──────────────────── bookings
    │                              │
    │ 1:N                          │ N:1
    ▼                              ▼
orders ────── order_items    cars_for_rent
    │               │
    │               │ N:1
    │               ▼
    │         cars_for_sale
    │         parts
    │
    └── promo_codes (применяются)

reviews → cars_for_rent | cars_for_sale | parts
```

### 7.3 Описание таблиц

#### Таблица `profiles`

Расширяет стандартную таблицу пользователей Supabase Auth дополнительными полями.

```sql
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name   TEXT,
  phone       TEXT,
  avatar_url  TEXT,
  role        TEXT DEFAULT 'client'  -- 'client' | 'admin'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

| Поле | Тип | Описание |
|---|---|---|
| id | UUID | Совпадает с auth.users.id |
| full_name | TEXT | Полное имя пользователя |
| phone | TEXT | Номер телефона |
| avatar_url | TEXT | URL аватара |
| role | TEXT | Роль: client / admin |
| created_at | TIMESTAMPTZ | Дата регистрации |

#### Таблица `cars_for_rent`

Автомобили в парке проката.

```sql
CREATE TABLE cars_for_rent (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand         TEXT NOT NULL,
  model         TEXT NOT NULL,
  year          INTEGER NOT NULL,
  transmission  TEXT NOT NULL,  -- 'auto' | 'manual'
  fuel_type     TEXT NOT NULL,  -- 'petrol' | 'diesel' | 'electric' | 'hybrid'
  seats         INTEGER NOT NULL,
  price_per_day DECIMAL(10,2) NOT NULL,
  status        TEXT DEFAULT 'available',  -- 'available' | 'rented' | 'maintenance'
  location      TEXT,
  description   TEXT,
  features      TEXT[],         -- массив дополнительных опций
  image_urls    TEXT[],         -- массив URL изображений
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

| Поле | Тип | Описание |
|---|---|---|
| id | UUID | Уникальный идентификатор |
| brand | TEXT | Марка автомобиля (Toyota, BMW и т.д.) |
| model | TEXT | Модель (Camry, X5 и т.д.) |
| year | INTEGER | Год выпуска |
| transmission | TEXT | Тип КПП: auto / manual |
| fuel_type | TEXT | Тип топлива |
| seats | INTEGER | Количество мест |
| price_per_day | DECIMAL | Цена аренды в сутки (тенге) |
| status | TEXT | Статус доступности |
| location | TEXT | Город/адрес получения |
| description | TEXT | Описание автомобиля |
| features | TEXT[] | Дополнительные функции (климат-контроль, GPS и т.д.) |
| image_urls | TEXT[] | Список URL фотографий |

#### Таблица `cars_for_sale`

Автомобили, выставленные на продажу.

```sql
CREATE TABLE cars_for_sale (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand         TEXT NOT NULL,
  model         TEXT NOT NULL,
  year          INTEGER NOT NULL,
  price         DECIMAL(12,2) NOT NULL,
  mileage       INTEGER,
  transmission  TEXT NOT NULL,
  fuel_type     TEXT NOT NULL,
  color         TEXT,
  vin           TEXT,
  description   TEXT,
  features      TEXT[],
  image_urls    TEXT[],
  is_available  BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

| Поле | Тип | Описание |
|---|---|---|
| price | DECIMAL | Цена продажи |
| mileage | INTEGER | Пробег в км |
| color | TEXT | Цвет кузова |
| vin | TEXT | VIN-номер |
| is_available | BOOLEAN | Доступна ли для продажи |

#### Таблица `parts`

Каталог автозапчастей.

```sql
CREATE TABLE parts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  brand         TEXT NOT NULL,
  category      TEXT NOT NULL,
  car_brand     TEXT,          -- для какой марки авто
  year_from     INTEGER,       -- совместимость: с года
  year_to       INTEGER,       -- совместимость: по год
  oem_number    TEXT,          -- OEM-номер запчасти
  price         DECIMAL(10,2) NOT NULL,
  stock         INTEGER DEFAULT 0,
  description   TEXT,
  image_urls    TEXT[],
  is_original   BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

| Поле | Тип | Описание |
|---|---|---|
| category | TEXT | Категория (двигатель, тормоза, кузов...) |
| car_brand | TEXT | Марка автомобиля для совместимости |
| year_from / year_to | INTEGER | Диапазон годов совместимости |
| oem_number | TEXT | Оригинальный номер детали |
| stock | INTEGER | Количество на складе |
| is_original | BOOLEAN | Оригинальная / аналог |

#### Таблица `bookings`

Бронирования автомобилей.

```sql
CREATE TABLE bookings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES profiles(id),
  car_id        UUID REFERENCES cars_for_rent(id),
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL,
  total_price   DECIMAL(12,2) NOT NULL,
  status        TEXT DEFAULT 'pending',
  promo_code    TEXT,
  discount      DECIMAL(5,2) DEFAULT 0,
  qr_code       TEXT,          -- base64 QR-код
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

Возможные статусы бронирования:

```
pending → confirmed → active → completed
    │
    └─→ cancelled
```

| Статус | Описание |
|---|---|
| pending | Ожидает подтверждения |
| confirmed | Подтверждено, ожидает заезда |
| active | Авто на руках у клиента |
| completed | Аренда завершена |
| cancelled | Отменено |

#### Таблица `orders`

Заказы из корзины (запчасти и автомобили).

```sql
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES profiles(id),
  total_price     DECIMAL(12,2) NOT NULL,
  status          TEXT DEFAULT 'pending',
  payment_status  TEXT DEFAULT 'unpaid',
  promo_code      TEXT,
  discount        DECIMAL(5,2) DEFAULT 0,
  shipping_address TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

#### Таблица `order_items`

Позиции в заказе.

```sql
CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID REFERENCES orders(id),
  item_type   TEXT NOT NULL,  -- 'part' | 'car'
  item_id     UUID NOT NULL,
  quantity    INTEGER DEFAULT 1,
  price       DECIMAL(10,2) NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

#### Таблица `promo_codes`

Промокоды для скидок.

```sql
CREATE TABLE promo_codes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code          TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL,    -- 'percent' | 'fixed'
  discount_value DECIMAL(10,2) NOT NULL,
  is_active     BOOLEAN DEFAULT TRUE,
  expires_at    TIMESTAMPTZ,
  max_uses      INTEGER,
  current_uses  INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

#### Таблица `reviews`

Отзывы пользователей.

```sql
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id),
  item_type   TEXT NOT NULL,  -- 'rent' | 'sale' | 'part'
  item_id     UUID NOT NULL,
  rating      INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### 7.4 Типы данных TypeScript

Все таблицы имеют соответствующие TypeScript-интерфейсы в `src/types/index.ts`:

```typescript
// Перечисления
type UserRole = 'client' | 'admin';
type Transmission = 'auto' | 'manual';
type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid';
type CarRentStatus = 'available' | 'rented' | 'maintenance';
type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
type DiscountType = 'percent' | 'fixed';

// Основные интерфейсы
interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

interface CarForRent {
  id: string;
  brand: string;
  model: string;
  year: number;
  transmission: Transmission;
  fuel_type: FuelType;
  seats: number;
  price_per_day: number;
  status: CarRentStatus;
  location: string | null;
  description: string | null;
  features: string[] | null;
  image_urls: string[] | null;
  created_at: string;
}

interface Booking {
  id: string;
  user_id: string;
  car_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: BookingStatus;
  promo_code: string | null;
  discount: number;
  qr_code: string | null;
  notes: string | null;
  created_at: string;
  car?: CarForRent;
  profile?: Profile;
}

interface CartItem {
  id: string;
  type: 'part' | 'car';
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
}
```

---

## 8. МОДУЛИ И ФУНКЦИОНАЛЬНОСТЬ

### 8.1 Модуль аутентификации

#### Описание

Аутентификация реализована через Supabase Auth с поддержкой email/пароль. Сессия хранится в httpOnly cookies и автоматически обновляется.

#### Страница регистрации (`/register`)

**Функциональность:**
- Форма с полями: имя, email, пароль, подтверждение пароля
- Индикатор надёжности пароля (слабый/средний/надёжный)
- Валидация совпадения паролей
- Создание записи в таблице `profiles` после регистрации
- Редирект на `/dashboard` после успешной регистрации
- Ссылка на страницу входа

**Индикатор пароля:**
- Слабый (красный): менее 6 символов
- Средний (жёлтый): 6–9 символов
- Надёжный (зелёный): 10+ символов

#### Страница входа (`/login`)

**Функциональность:**
- Двухколоночный layout: преимущества платформы + форма входа
- Email + пароль
- Обработка ошибок (неверный пароль, не найден пользователь)
- Редирект на `/dashboard` или запрошенную страницу
- Ссылка на регистрацию

#### Суперклиент Supabase

**Серверная сторона** (`src/lib/supabase/server.ts`):
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { ... } }
  )
}
```

**Клиентская сторона** (`src/lib/supabase/client.ts`):
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 8.2 Модуль аренды автомобилей

#### Каталог аренды (`/rent`)

**Серверная часть** (`page.tsx`):
- Загружает все доступные автомобили из `cars_for_rent`
- Передаёт данные в клиентский компонент

**Клиентская часть** (`CatalogClient.tsx`):

Реализует многоуровневую систему фильтрации:

| Фильтр | Значения |
|---|---|
| Марка | Toyota, BMW, Kia, Hyundai и т.д. |
| КПП | Автомат / Механика |
| Тип топлива | Бензин / Дизель / Электро / Гибрид |
| Количество мест | 2, 4, 5, 7, 8+ |
| Ценовой диапазон | Ползунок min-max |
| Сортировка | По цене (возр./убыв.), по году |

Отображение: адаптивная сетка (1/2/3 колонки в зависимости от ширины).

**Карточка автомобиля** (`CarCard.tsx`):
- Фото с hover-эффектом (увеличение масштаба)
- Бейдж статуса (доступен/занят/обслуживание)
- Марка, модель, год
- Иконки: КПП, топливо, кол-во мест
- Цена в сутки
- Кнопка «Забронировать»

#### Детальная страница автомобиля (`/rent/[id]`)

**Контент:**
- Галерея фотографий (основное фото + миниатюры)
- Полные характеристики автомобиля
- Список дополнительных опций (features)
- Похожие автомобили (боковая панель)
- Виджет бронирования

**Виджет бронирования** (`BookingWidget.tsx`):

```
Выбор дат:
  [Дата заезда]  →  [Дата выезда]
  
Расчёт стоимости:
  7 дней × 15 000 ₸/сут = 105 000 ₸
  
Промокод: [________] [Применить]
  Скидка: -10 500 ₸ (10%)
  
Итого: 94 500 ₸

[Забронировать]
```

**Логика расчёта:**
1. Пользователь выбирает даты
2. Система вычисляет количество дней: `Math.ceil((endDate - startDate) / 86400000)`
3. Умножает на суточную цену: `days × price_per_day`
4. При вводе промокода — запрашивает таблицу `promo_codes`, проверяет актуальность
5. Применяет скидку (процент или фиксированная сумма)
6. Создаёт запись в таблице `bookings`
7. Генерирует QR-код

### 8.3 Модуль продажи автомобилей

#### Каталог продажи (`/sale`)

Аналогичен каталогу аренды, но с дополнительными фильтрами:

| Фильтр | Описание |
|---|---|
| Цена | Диапазон от/до |
| Год выпуска | Диапазон |
| Пробег | До 50к / 50–100к / 100–200к / 200к+ |
| Марка | Список марок |
| КПП | Авто / Механика |
| Топливо | Все типы |

**Карточка продажи** (`SaleCard.tsx`):
- Фото автомобиля
- Марка, модель, год
- Пробег
- КПП, топливо
- Цена (полная)
- Кнопка «Подробнее»

**Детальная страница** (`/sale/[id]`):
- Галерея фото
- Полные характеристики
- VIN-номер
- История обслуживания (если заполнена)
- Кнопка «Оставить заявку» → создаёт заказ в `orders`

### 8.4 Модуль автозапчастей

#### Каталог запчастей (`/parts`)

**Дополнительные фильтры:**

| Фильтр | Описание |
|---|---|
| Поиск | По названию, бренду, OEM-номеру |
| Категория | Двигатель, тормоза, кузов, электрика... |
| Марка детали | Toyota, Bosch, NGK... |
| Марка авто | Для какого автомобиля |
| В наличии | Только товары на складе |
| Оригинал/аналог | Тип запчасти |

**Карточка запчасти** (`PartCard.tsx`):
- Фото детали
- Название и бренд
- OEM-номер
- Совместимость (марка авто, годы)
- Наличие на складе
- Цена
- Кнопка «В корзину»

#### Корзина и оформление заказа (`/cart`)

**Управление корзиной:**
- Хранится в `localStorage` под ключом `nomaddrive_cart`
- Позволяет добавлять запчасти и автомобили
- Изменение количества (+ / -)
- Удаление позиций
- Очистка корзины

**Структура CartItem:**
```typescript
interface CartItem {
  id: string;          // ID товара
  type: 'part' | 'car';
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
}
```

**Оформление заказа:**
1. Отображение всех позиций корзины
2. Расчёт суммы
3. Ввод промокода
4. Применение скидки
5. Создание записи в `orders` + `order_items`
6. Очистка корзины
7. Редирект на страницу заказа

### 8.5 Личный кабинет

#### Главная страница дашборда (`/dashboard`)

**Статистика:**
- Количество активных бронирований
- Количество ожидающих заказов
- Ссылки на последние действия

#### Страница профиля (`/dashboard/profile`)

**Поля для редактирования:**
- Полное имя
- Номер телефона
- URL аватара

**Сохранение:** обновляет запись в таблице `profiles`.

#### История бронирований (`/dashboard/bookings`)

**Список бронирований:**
- Фото и название автомобиля
- Даты аренды
- Статус (цветовой бейдж)
- Итоговая стоимость
- Ссылка на детальную страницу

**Детальная страница бронирования** (`/dashboard/bookings/[id]`):
- Полная информация о брони
- QR-код для заезда (скачиваемый)
- Статус с иконкой
- Кнопка отмены (для pending/confirmed)

#### История заказов (`/dashboard/orders`)

- Список заказов с датой, статусом и суммой
- Детальная страница с позициями заказа
- Отслеживание оплаты

---

## 9. ИНТЕРФЕЙС ПОЛЬЗОВАТЕЛЯ

### 9.1 Дизайн-система

NomadDrive использует тёмную цветовую схему в золотисто-коричневых акцентах, что создаёт образ премиального автомобильного сервиса.

#### Цветовая палитра

| Переменная | HEX | Применение |
|---|---|---|
| `--primary` | `#c9a96e` | Акцентный цвет (кнопки, ссылки, логотип) |
| `--background` | `#0a0a0a` | Фон страниц |
| `--surface` | `#111111` | Фон карточек |
| `--surface-2` | `#1a1a1a` | Фон вложенных элементов |
| `--text-primary` | `#f0ece4` | Основной текст |
| `--text-secondary` | `#6b6b6b` | Второстепенный текст |
| `--border` | `#2a2a2a` | Границы элементов |
| `--success` | `#34c759` | Успех, доступность |
| `--warning` | `#ff9f0a` | Предупреждение, ожидание |
| `--danger` | `#ff3b30` | Ошибка, отмена |

#### Типографика

| Шрифт | Применение | Вес |
|---|---|---|
| Space Grotesk | Заголовки (h1-h3) | 700 |
| Geist | Основной текст, UI | 400-600 |
| JetBrains Mono | Коды, технические данные | 400 |

#### Анимации

В `globals.css` определены CSS-анимации без использования JavaScript-библиотек:

```css
/* Появление снизу */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Появление слева */
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* Масштабирование */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

/* Утилитарные классы */
.animate-fade-in-up    { animation: fadeInUp 0.6s ease forwards; }
.animate-slide-in-left { animation: slideInLeft 0.45s ease forwards; }
.animate-scale-in      { animation: scaleIn 0.3s ease forwards; }

/* Каскадные задержки для списков */
.stagger-children > *:nth-child(1) { animation-delay: 0.05s; }
.stagger-children > *:nth-child(2) { animation-delay: 0.10s; }
/* ... до 10-го элемента */
```

### 9.2 Компоненты навигации

#### Навбар (`Navbar.tsx` / `NavbarClient.tsx`)

Навбар разделён на серверную и клиентскую части для оптимальной производительности.

**Состав:**
- Логотип «**Nomad**Drive» (Drive — золотой цвет)
- Навигационные ссылки: Аренда / Продажа / Запчасти
- Переключатель языка (РУС / ҚАЗ)
- Иконка корзины с счётчиком (только для авторизованных)
- Аватар пользователя + выпадающее меню
- Кнопки «Войти» и «Зарегистрироваться» (для гостей)

**Мобильная версия:**
- Бургер-меню
- Полноэкранное мобильное меню

#### Мобильное меню (`MobileMenu.tsx`)

- Накрывает весь экран
- Навигационные ссылки
- Кнопки действий (войти/выйти/профиль)
- Переключатель языка
- Анимация появления

### 9.3 Главная страница

**Секции лендинга** (`LandingPage.tsx`):

1. **Hero-секция**
   - Полноэкранный фон с градиентом
   - Заголовок с акцентными словами
   - Строка поиска: город / даты / класс авто
   - CTA-кнопки

2. **Бегущая строка (ticker)**
   - Горизонтальная прокрутка преимуществ платформы
   - CSS-анимация `marquee`

3. **Табы разделов**
   - 4 вкладки: Аренда / Покупка / Продажа / Запчасти
   - Горизонтальный скролл карточек под каждой вкладкой

4. **Showcases**
   - Чередование: текст слева/фото справа
   - Описание ключевых преимуществ

5. **Почему выбирают нас**
   - 6 карточек с иконками и описанием

6. **Процесс аренды**
   - 3 шага: выберите авто → выберите даты → получите ключи

7. **Отзывы клиентов**
   - Карточки с именем, оценкой и текстом

8. **FAQ**
   - Аккордеон с частыми вопросами
   
9. **Форма обратной связи**
   - Поля: имя, телефон, сообщение
   - CTA с призывом к действию

### 9.4 Адаптивный дизайн

Все страницы адаптированы под три типа устройств:

| Устройство | Ширина | Колонки каталога |
|---|---|---|
| Мобильный | < 640px | 1 |
| Планшет | 640–1024px | 2 |
| Десктоп | > 1024px | 3 |

**Мобильные адаптации:**
- Фильтры скрыты в выдвижном листе (bottom sheet)
- Навигация в бургер-меню
- Карточки занимают всю ширину
- Кнопки увеличены для touch-взаимодействия

---

## 10. АУТЕНТИФИКАЦИЯ И БЕЗОПАСНОСТЬ

### 10.1 Система аутентификации

#### Supabase Auth

Аутентификация основана на Supabase Auth, который предоставляет:

- **JWT-токены** для идентификации сессий
- **Refresh-токены** для автоматического обновления
- **httpOnly cookies** для безопасного хранения (не доступны через JavaScript)
- Защиту от CSRF-атак

#### Жизненный цикл сессии

```
Регистрация/Вход
      │
      ▼
Supabase создаёт JWT + Refresh Token
      │
      ▼
Токены сохраняются в httpOnly cookies
      │
      ▼
При каждом запросе:
  middleware → проверяет токен → обновляет если истёк
      │
      ▼
Server Components получают пользователя через:
  const { data: { user } } = await supabase.auth.getUser()
```

### 10.2 Защита маршрутов

Middleware `src/proxy.ts` реализует две формы защиты:

**1. Защита от неавторизованных:**
```
/dashboard → если нет сессии → redirect /login
/cart      → если нет сессии → redirect /login
```

**2. Защита от недостаточных прав:**
```
/admin → если нет роли 'admin' → redirect /
```

**3. Редирект авторизованных:**
```
/login, /register → если уже вошёл → redirect /dashboard
```

### 10.3 Row Level Security (RLS)

Supabase поддерживает Row Level Security — политики безопасности на уровне строк PostgreSQL. Это означает, что даже при прямом обращении к API, пользователь видит только те данные, которые ему разрешены.

**Примеры политик:**

```sql
-- Пользователь видит только свои бронирования
CREATE POLICY "Users see own bookings"
ON bookings FOR SELECT
USING (auth.uid() = user_id);

-- Пользователь редактирует только свой профиль
CREATE POLICY "Users update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Только администраторы изменяют автомобили
CREATE POLICY "Admin can edit cars"
ON cars_for_rent FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### 10.4 Безопасность данных

| Угроза | Защита |
|---|---|
| SQL-инъекции | Parameterized queries через Supabase JS Client |
| XSS | React автоматически экранирует JSX-выражения |
| CSRF | httpOnly cookies + SameSite=Lax |
| Перебор паролей | Supabase Auth rate limiting |
| Утечка токенов | httpOnly cookies (недоступны через JS) |
| Несанкционированный доступ | Middleware + RLS политики |

### 10.5 Роли и разрешения

**Роль `client` (по умолчанию):**
- Просмотр каталогов
- Создание бронирований и заказов
- Управление своим профилем
- Просмотр своей истории

**Роль `admin`:**
- Все права клиента
- CRUD для автомобилей (аренда/продажа)
- CRUD для запчастей
- Изменение статусов бронирований
- Изменение статусов заказов
- Доступ к административной панели

---

## 11. API И ВЗАИМОДЕЙСТВИЕ С ДАННЫМИ

### 11.1 Supabase JS Client

Все запросы к базе данных выполняются через Supabase JS Client, который предоставляет типобезопасный интерфейс:

```typescript
// Получение списка (SELECT)
const { data, error } = await supabase
  .from('cars_for_rent')
  .select('*')
  .eq('status', 'available')
  .order('price_per_day', { ascending: true })

// Получение одной записи с join (SELECT + JOIN)
const { data } = await supabase
  .from('bookings')
  .select(`
    *,
    car:cars_for_rent(*)
  `)
  .eq('id', bookingId)
  .single()

// Создание записи (INSERT)
const { data, error } = await supabase
  .from('bookings')
  .insert({
    user_id: user.id,
    car_id: carId,
    start_date: startDate,
    end_date: endDate,
    total_price: totalPrice,
    status: 'pending'
  })
  .select()
  .single()

// Обновление записи (UPDATE)
const { error } = await supabase
  .from('profiles')
  .update({ full_name: name, phone: phone })
  .eq('id', user.id)

// Удаление записи (DELETE)
const { error } = await supabase
  .from('cars_for_rent')
  .delete()
  .eq('id', carId)
```

### 11.2 Паттерны получения данных

**Серверный компонент (предпочтительно для начальной загрузки):**
```typescript
// app/(main)/rent/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function RentPage() {
  const supabase = await createClient()
  const { data: cars } = await supabase
    .from('cars_for_rent')
    .select('*')
    .order('created_at', { ascending: false })
  
  return <CatalogClient initialCars={cars ?? []} />
}
```

**Клиентский компонент (для интерактивных операций):**
```typescript
// Создание бронирования
'use client'
import { createClient } from '@/lib/supabase/client'

async function handleBooking() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) { router.push('/login'); return }
  
  const { data, error } = await supabase
    .from('bookings')
    .insert({ ... })
    .select()
    .single()
  
  if (!error) router.push(`/dashboard/bookings/${data.id}`)
}
```

### 11.3 Валидация промокодов

```typescript
async function validatePromoCode(code: string) {
  const { data: promo } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .single()
  
  if (!promo) return { valid: false, message: 'Промокод не найден' }
  if (!promo.is_active) return { valid: false, message: 'Промокод неактивен' }
  if (promo.expires_at && new Date(promo.expires_at) < new Date())
    return { valid: false, message: 'Промокод истёк' }
  if (promo.max_uses && promo.current_uses >= promo.max_uses)
    return { valid: false, message: 'Промокод исчерпан' }
  
  return { valid: true, promo }
}
```

### 11.4 Генерация QR-кодов

```typescript
import QRCode from 'qrcode'

async function generateBookingQR(bookingId: string): Promise<string> {
  const qrData = JSON.stringify({
    type: 'nomaddrive_booking',
    id: bookingId,
    timestamp: Date.now()
  })
  
  const qrCodeDataURL = await QRCode.toDataURL(qrData, {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  })
  
  return qrCodeDataURL  // base64 PNG
}
```

QR-код сохраняется в поле `qr_code` таблицы `bookings` и отображается на странице деталей бронирования с возможностью скачивания.

---

## 12. АДМИНИСТРАТИВНАЯ ПАНЕЛЬ

### 12.1 Обзор

Административная панель (`/admin`) доступна только пользователям с ролью `admin`. Она предоставляет полный контроль над контентом платформы.

### 12.2 Структура панели

**Боковая навигация** (`AdminSidebar.tsx`):
- Ссылка на главный сайт (← На сайт)
- Дашборд (статистика)
- Автомобили для аренды
- Автомобили для продажи
- Запчасти
- Бронирования
- Заказы
- Выход

### 12.3 Управление автомобилями для аренды

**Список** (`/admin/cars`):
- Таблица всех автомобилей
- Быстрый просмотр: фото, марка/модель, цена, статус
- Кнопки: Редактировать / Удалить
- Кнопка «Добавить автомобиль»

**Форма создания/редактирования** (`AdminCarForm.tsx`):

| Поле | Тип | Обязательное |
|---|---|---|
| Марка | Text | Да |
| Модель | Text | Да |
| Год | Number | Да |
| КПП | Select (авто/механика) | Да |
| Топливо | Select | Да |
| Кол-во мест | Number | Да |
| Цена/сутки | Number | Да |
| Статус | Select | Да |
| Город | Text | Нет |
| Описание | Textarea | Нет |
| Особенности | Multi-input | Нет |
| Фотографии (URLs) | Multi-input | Нет |

### 12.4 Управление запчастями

Аналогично управлению автомобилями, с дополнительными полями:
- Категория
- OEM-номер
- Марка автомобиля совместимости
- Годы совместимости
- Количество на складе
- Оригинал/аналог

### 12.5 Управление бронированиями и заказами

**Бронирования** (`/admin/bookings`):
- Список всех бронирований с фильтрами по статусу
- Изменение статуса (подтвердить / отметить активным / завершить / отменить)
- `AdminStatusBadge.tsx` — цветовые индикаторы статусов

**Заказы** (`/admin/orders`):
- Список всех заказов
- Изменение статуса доставки
- Изменение статуса оплаты
- Просмотр позиций заказа

### 12.6 Компонент AdminStatusBadge

```typescript
// Компонент отображает статус с цветовым бейджем и иконкой
const statusConfig = {
  pending:   { color: 'yellow', icon: Clock,       label: 'Ожидает' },
  confirmed: { color: 'blue',   icon: CheckCircle,  label: 'Подтверждён' },
  active:    { color: 'green',  icon: Car,          label: 'Активен' },
  completed: { color: 'gray',   icon: CheckCircle2, label: 'Завершён' },
  cancelled: { color: 'red',    icon: XCircle,      label: 'Отменён' },
}
```

---

## 13. ПРОИЗВОДИТЕЛЬНОСТЬ И ОПТИМИЗАЦИЯ

### 13.1 Оптимизация рендеринга

**Server Components:**
- Тяжёлые операции с данными выполняются на сервере
- Клиенту отправляется готовый HTML, а не JavaScript + данные
- Уменьшает время до первого контентного отображения (FCP)

**Code Splitting:**
- Next.js автоматически разбивает код на чанки по маршрутам
- Каждая страница загружает только нужный JavaScript
- Динамический импорт для тяжёлых компонентов (Admin Forms)

### 13.2 Оптимизация изображений

```tsx
// Использование next/image
<Image
  src={car.image_urls[0]}
  alt={`${car.brand} ${car.model}`}
  fill                          // заполняет родительский контейнер
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={isAboveFold}        // критические изображения загружаются сразу
  className="object-cover"
/>
```

Преимущества:
- Автоматическая конвертация в WebP/AVIF
- Lazy loading по умолчанию
- Предотвращение Layout Shift (резервирует место)
- Responsive sizes

### 13.3 Оптимизация фильтрации

Фильтрация каталога выполняется на клиенте с использованием `useMemo`:

```typescript
const filteredCars = useMemo(() => {
  return cars.filter(car => {
    if (filters.brand && car.brand !== filters.brand) return false
    if (filters.transmission && car.transmission !== filters.transmission) return false
    if (filters.minPrice && car.price_per_day < filters.minPrice) return false
    if (filters.maxPrice && car.price_per_day > filters.maxPrice) return false
    return true
  })
}, [cars, filters])
```

`useMemo` пересчитывает результат только при изменении `cars` или `filters`, не при каждом ре-рендере компонента.

### 13.4 LocalStorage для корзины

Корзина хранится в localStorage, что обеспечивает:
- Персистентность между сессиями (данные не теряются при обновлении страницы)
- Мгновенный доступ без запросов к серверу
- Работу без аккаунта (гостевая корзина)

### 13.5 Производительность CSS анимаций

Все анимации используют только `transform` и `opacity` — свойства, которые не вызывают layout reflow и перерисовку, что обеспечивает плавность 60fps:

```css
/* Хорошо: использует compositor-only properties */
animation: fadeInUp 0.6s ease;
/* fadeInUp использует opacity + translateY */

/* Плохо (не используется): вызывает layout reflow */
/* animation: ... width/height/top/left ... */
```

### 13.6 Метрики производительности (Core Web Vitals)

Цели проекта по метрикам Google:

| Метрика | Цель | Описание |
|---|---|---|
| LCP | < 2.5 сек | Largest Contentful Paint |
| FID | < 100 мс | First Input Delay |
| CLS | < 0.1 | Cumulative Layout Shift |
| FCP | < 1.8 сек | First Contentful Paint |
| TTFB | < 0.8 сек | Time to First Byte |

---

## 14. РАЗВЁРТЫВАНИЕ И НАСТРОЙКА

### 14.1 Переменные окружения

Создаётся файл `.env.local` в корне проекта:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Опционально: Service Role Key для admin-операций
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Безопасность переменных:**
- `NEXT_PUBLIC_*` — доступны в браузере (только публичные ключи)
- Без префикса — только серверная сторона

### 14.2 Настройка Supabase

**1. Создание проекта:**
- Зарегистрироваться на supabase.com
- Создать новый проект
- Скопировать URL и anon key

**2. Создание таблиц:**
```sql
-- Выполнить в Supabase SQL Editor
-- Создание всех таблиц (см. раздел 7)
```

**3. Настройка RLS:**
```sql
-- Включить RLS на всех таблицах
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
-- ... и т.д.

-- Создать политики (см. раздел 10.3)
```

**4. Настройка Auth:**
- В Supabase Dashboard → Authentication → Settings
- Включить Email provider
- Настроить redirect URLs для продакшена

### 14.3 Локальный запуск

```bash
# 1. Клонирование репозитория
git clone <repo-url>
cd nomaddrive

# 2. Установка зависимостей
npm install

# 3. Создание .env.local
cp .env.example .env.local
# Заполнить переменные

# 4. Запуск в режиме разработки
npm run dev
# Приложение доступно на http://localhost:3000

# 5. Сборка для продакшена
npm run build
npm start
```

### 14.4 Развёртывание на Vercel

Vercel — рекомендованная платформа для Next.js-приложений:

```bash
# Установка Vercel CLI
npm i -g vercel

# Деплой
vercel

# Продакшен-деплой
vercel --prod
```

**Настройка переменных в Vercel:**
- Dashboard → Project → Settings → Environment Variables
- Добавить `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 14.5 Конфигурация Next.js

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",  // Разрешены все HTTPS-источники изображений
      },
    ],
  },
};

export default nextConfig;
```

### 14.6 Конфигурация TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Ключевой параметр `"@/*": ["./src/*"]` — позволяет импортировать файлы как `@/components/...` вместо `../../components/...`.

---

## 15. ТЕСТИРОВАНИЕ

### 15.1 Стратегия тестирования

Проект использует ручное тестирование с валидацией на уровне бизнес-логики:

#### Клиентская валидация форм

```typescript
// Регистрация
if (password !== confirmPassword) setError('Пароли не совпадают')
if (password.length < 6) setError('Минимум 6 символов')
if (!email.includes('@')) setError('Некорректный email')

// Бронирование
if (!startDate || !endDate) setError('Выберите даты')
if (new Date(endDate) <= new Date(startDate)) setError('Дата выезда должна быть позже заезда')
if (days < 1) setError('Минимум 1 день аренды')
```

#### Серверная валидация (Supabase)

- Уникальность email (ограничение auth.users)
- Внешние ключи (foreign key constraints)
- NOT NULL поля
- CHECK ограничения (рейтинг 1-5)

### 15.2 Тестовые сценарии

**UC-01: Регистрация нового пользователя**
1. Открыть `/register`
2. Заполнить форму корректными данными
3. Ожидаемый результат: редирект на `/dashboard`, запись в `profiles`

**UC-02: Бронирование автомобиля**
1. Открыть `/rent`
2. Выбрать автомобиль
3. Выбрать даты
4. Применить промокод (необязательно)
5. Нажать «Забронировать»
6. Ожидаемый результат: запись в `bookings`, QR-код на странице

**UC-03: Оформление заказа запчастей**
1. Добавить запчасти в корзину из `/parts`
2. Открыть `/cart`
3. Применить промокод (необязательно)
4. Нажать «Оформить заказ»
5. Ожидаемый результат: запись в `orders` + `order_items`, редирект на детали заказа

**UC-04: Администрирование**
1. Войти под аккаунтом с ролью `admin`
2. Открыть `/admin`
3. Добавить новый автомобиль
4. Изменить статус бронирования
5. Ожидаемый результат: данные обновляются в базе и отражаются на сайте

**UC-05: Переключение языка**
1. Открыть любую страницу
2. Нажать «ҚАЗ» в навбаре
3. Ожидаемый результат: весь интерфейс переключается на казахский

### 15.3 Обработка ошибок

Проект реализует многоуровневую обработку ошибок:

```typescript
// Паттерн обработки ошибок Supabase
try {
  const { data, error } = await supabase.from('bookings').insert(...)
  
  if (error) {
    setError('Ошибка при создании бронирования: ' + error.message)
    return
  }
  
  // Успех
  router.push(`/dashboard/bookings/${data.id}`)
} catch (err) {
  setError('Неожиданная ошибка. Попробуйте позже.')
} finally {
  setLoading(false)
}
```

**Уровни отображения ошибок:**
- Inline под полем ввода (валидация формы)
- Alert-блок над формой (ошибки сервера)
- Пустые состояния (нет результатов фильтрации)
- Fallback-UI (ошибки загрузки данных)

---

## 16. ЗАКЛЮЧЕНИЕ

### 16.1 Итоги разработки

В ходе выполнения дипломной работы была разработана полнофункциональная веб-платформа **NomadDrive** для казахстанского автомобильного рынка.

**Достигнутые результаты:**

1. **Реализован полный функциональный стек:**
   - Модуль аренды с онлайн-бронированием и QR-кодами
   - Маркетплейс продажи автомобилей
   - Каталог запчастей с корзиной и заказами
   - Личный кабинет пользователя
   - Административная панель

2. **Применены современные технологии:**
   - Next.js 16 с App Router и Server Components
   - TypeScript для типобезопасности
   - Supabase (PostgreSQL) как Backend-as-a-Service
   - Tailwind CSS 4 для стилизации

3. **Обеспечена безопасность:**
   - Аутентификация через Supabase Auth
   - Row Level Security на уровне БД
   - Защита маршрутов через Middleware

4. **Реализована локализация:**
   - Полная поддержка русского и казахского языков
   - Контекстный переключатель языков

5. **Обеспечена адаптивность:**
   - Корректная работа на мобильных, планшетах и десктопах
   - Mobile-first подход

### 16.2 Статистика проекта

| Показатель | Значение |
|---|---|
| Страниц/маршрутов | 25+ |
| TypeScript/TSX файлов | 60+ |
| Таблиц в БД | 9 |
| Функциональных модулей | 7 |
| Поддерживаемых языков | 2 (рус/каз) |
| Адаптивных брейкпоинтов | 3 |
| Строк CSS-анимаций | ~200 |

### 16.3 Возможные направления развития

1. **Платёжная система** — интеграция с казахстанскими платёжными шлюзами (Kaspi Pay, Freedom Pay)
2. **Push-уведомления** — уведомления об изменении статусов через Supabase Realtime
3. **Мобильное приложение** — React Native версия с общей бизнес-логикой
4. **Система рейтингов** — отображение средней оценки на карточках
5. **Загрузка изображений** — интеграция с Supabase Storage вместо URL
6. **Email-уведомления** — подтверждения и статусы через Resend/SendGrid
7. **Аналитика** — дашборд с метриками (популярные авто, выручка)
8. **API для партнёров** — REST API для интеграции с внешними системами

### 16.4 Вывод

Разработанная платформа NomadDrive демонстрирует применение современных подходов к разработке веб-приложений: серверный рендеринг, типобезопасность, безопасная аутентификация, оптимизированный UI. Проект готов к коммерческому использованию и масштабированию.

---

## СПИСОК ИСПОЛЬЗОВАННЫХ ТЕХНОЛОГИЙ И ИСТОЧНИКОВ

### Технологии

1. **Next.js** — https://nextjs.org/docs — React-фреймворк с App Router
2. **TypeScript** — https://www.typescriptlang.org/docs — Типизированный JavaScript
3. **Supabase** — https://supabase.com/docs — Backend-as-a-Service на PostgreSQL
4. **Tailwind CSS** — https://tailwindcss.com/docs — Utility-first CSS-фреймворк
5. **Lucide React** — https://lucide.dev — SVG-иконки для React
6. **QRCode** — https://github.com/soldair/node-qrcode — Генератор QR-кодов
7. **Vercel** — https://vercel.com/docs — Хостинг для Next.js

### Литература

1. Wieruch, R. — «The Road to React» (2023)
2. Boduch, A. — «React and Libraries» (2023)
3. Simpson, K. — «You Don't Know JS: Types & Grammar»
4. PostgreSQL Documentation — https://www.postgresql.org/docs/
5. MDN Web Docs — https://developer.mozilla.org/

---

*Документация подготовлена для дипломного проекта «NomadDrive»*
*Разработчик: ondyyvfx@gmail.com*
*Дата: 2026*
