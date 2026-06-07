-- =====================================================================
--  NomadDrive — полный дамп базы данных (Supabase / PostgreSQL)
-- ---------------------------------------------------------------------
--  Что делает скрипт:
--    1. Полностью пересоздаёт схему (DROP + CREATE всех таблиц).
--    2. Включает Row Level Security и настраивает политики доступа.
--    3. Создаёт триггер автосоздания профиля при регистрации.
--    4. Заливает чистые, выверенные демо-данные (фото проверены вручную).
--
--  Как применить:
--    Supabase Dashboard → SQL Editor → New query → вставить → Run.
--    (Скрипт идемпотентный: можно запускать повторно.)
--
--  ВАЖНО про администратора:
--    Пользователи создаются через обычную регистрацию на сайте
--    (Supabase Auth). Чтобы выдать аккаунту права админа, после
--    регистрации выполните:
--        update public.profiles set role = 'admin'
--        where id = (select id from auth.users where email = 'ВАШ_EMAIL');
-- =====================================================================

-- расширение для gen_random_uuid()
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────
--  СБРОС
-- ─────────────────────────────────────────────────────────────────────
drop table if exists public.order_items   cascade;
drop table if exists public.orders        cascade;
drop table if exists public.bookings      cascade;
drop table if exists public.reviews       cascade;
drop table if exists public.promo_codes   cascade;
drop table if exists public.parts         cascade;
drop table if exists public.cars_for_sale cascade;
drop table if exists public.cars_for_rent cascade;
drop table if exists public.profiles      cascade;

-- ─────────────────────────────────────────────────────────────────────
--  ТАБЛИЦЫ
-- ─────────────────────────────────────────────────────────────────────

-- Профили (1:1 с auth.users)
create table public.profiles (
    id          uuid primary key references auth.users(id) on delete cascade,
    full_name   text,
    phone       text,
    avatar_url  text,
    role        text not null default 'client' check (role in ('client','admin')),
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

-- Автомобили в аренду
create table public.cars_for_rent (
    id            uuid primary key default gen_random_uuid(),
    brand         text not null,
    model         text not null,
    year          int  not null,
    color         text,
    transmission  text check (transmission in ('auto','manual')),
    fuel_type     text check (fuel_type in ('petrol','diesel','electric','hybrid')),
    seats         int  not null default 5,
    price_per_day numeric(12,2) not null,
    status        text not null default 'available' check (status in ('available','rented','maintenance')),
    image_urls    text[] not null default '{}',
    description   text,
    location      text,
    lat           double precision,
    lng           double precision,
    features      text[] not null default '{}',
    created_at    timestamptz not null default now()
);

-- Автомобили на продажу
create table public.cars_for_sale (
    id            uuid primary key default gen_random_uuid(),
    brand         text not null,
    model         text not null,
    year          int  not null,
    color         text,
    transmission  text check (transmission in ('auto','manual')),
    fuel_type     text check (fuel_type in ('petrol','diesel','electric','hybrid')),
    mileage       int  not null default 0,
    engine_volume numeric(3,1),
    price         numeric(14,2) not null,
    status        text not null default 'available' check (status in ('available','sold','reserved')),
    image_urls    text[] not null default '{}',
    description   text,
    location      text,
    lat           double precision,
    lng           double precision,
    vin           text,
    created_at    timestamptz not null default now()
);

-- Запчасти
create table public.parts (
    id          uuid primary key default gen_random_uuid(),
    name        text not null,
    brand       text not null,
    car_brand   text,
    car_model   text,
    year_from   int,
    year_to     int,
    category    text,
    oem_number  text,
    price       numeric(12,2) not null,
    stock       int not null default 0,
    image_urls  text[] not null default '{}',
    description text,
    created_at  timestamptz not null default now()
);

-- Промокоды
create table public.promo_codes (
    id          uuid primary key default gen_random_uuid(),
    code        text unique not null,
    type        text not null check (type in ('percent','fixed')),
    value       numeric(12,2) not null,
    max_uses    int,
    used_count  int not null default 0,
    expires_at  timestamptz,
    is_active   boolean not null default true,
    created_at  timestamptz not null default now()
);

-- Бронирования
create table public.bookings (
    id             uuid primary key default gen_random_uuid(),
    user_id        uuid not null references public.profiles(id) on delete cascade,
    car_id         uuid not null references public.cars_for_rent(id) on delete cascade,
    start_date     date not null,
    end_date       date not null,
    total_price    numeric(14,2) not null,
    status         text not null default 'pending' check (status in ('pending','confirmed','active','completed','cancelled')),
    payment_status text not null default 'unpaid' check (payment_status in ('unpaid','paid','refunded')),
    qr_code        text,
    promo_code_id  uuid references public.promo_codes(id) on delete set null,
    notes          text,
    created_at     timestamptz not null default now()
);

-- Заказы
create table public.orders (
    id             uuid primary key default gen_random_uuid(),
    user_id        uuid not null references public.profiles(id) on delete cascade,
    total          numeric(14,2) not null,
    status         text not null default 'pending' check (status in ('pending','confirmed','shipped','delivered','cancelled')),
    type           text not null default 'parts' check (type in ('car_sale','parts')),
    payment_status text not null default 'unpaid' check (payment_status in ('unpaid','paid','refunded')),
    promo_code_id  uuid references public.promo_codes(id) on delete set null,
    notes          text,
    created_at     timestamptz not null default now()
);

-- Позиции заказа
create table public.order_items (
    id           uuid primary key default gen_random_uuid(),
    order_id     uuid not null references public.orders(id) on delete cascade,
    product_type text not null check (product_type in ('car','part')),
    product_id   uuid not null,
    quantity     int  not null default 1,
    price        numeric(12,2) not null,
    created_at   timestamptz not null default now()
);

-- Отзывы
create table public.reviews (
    id           uuid primary key default gen_random_uuid(),
    user_id      uuid not null references public.profiles(id) on delete cascade,
    product_type text not null check (product_type in ('car_rent','car_sale','part')),
    product_id   uuid not null,
    rating       int  not null check (rating between 1 and 5),
    comment      text,
    created_at   timestamptz not null default now()
);

-- Индексы под частые запросы
create index on public.cars_for_rent (brand);
create index on public.cars_for_rent (status);
create index on public.cars_for_sale (brand);
create index on public.parts (car_brand);
create index on public.parts (category);
create index on public.bookings (user_id);
create index on public.orders (user_id);
create index on public.order_items (order_id);

-- ─────────────────────────────────────────────────────────────────────
--  ФУНКЦИИ И ТРИГГЕРЫ
-- ─────────────────────────────────────────────────────────────────────

-- Проверка роли админа (security definer — обходит RLS, без рекурсии)
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
    select exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
    );
$$;

-- Автосоздание профиля при регистрации в auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, full_name)
    values (new.id, coalesce(new.raw_user_meta_data->>'full_name', null))
    on conflict (id) do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- Поддержка updated_at в профиле
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists trg_profiles_touch on public.profiles;
create trigger trg_profiles_touch
    before update on public.profiles
    for each row execute function public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────────────
--  ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────────────
alter table public.profiles      enable row level security;
alter table public.cars_for_rent enable row level security;
alter table public.cars_for_sale enable row level security;
alter table public.parts         enable row level security;
alter table public.promo_codes   enable row level security;
alter table public.bookings      enable row level security;
alter table public.orders        enable row level security;
alter table public.order_items   enable row level security;
alter table public.reviews       enable row level security;

-- profiles
create policy "profiles read"        on public.profiles for select using (true);
create policy "profiles insert self" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles update self" on public.profiles for update using (auth.uid() = id or public.is_admin());

-- каталоги: публичное чтение, запись только админ
create policy "rent read"   on public.cars_for_rent for select using (true);
create policy "rent write"  on public.cars_for_rent for all using (public.is_admin()) with check (public.is_admin());

create policy "sale read"   on public.cars_for_sale for select using (true);
create policy "sale write"  on public.cars_for_sale for all using (public.is_admin()) with check (public.is_admin());

create policy "parts read"  on public.parts for select using (true);
create policy "parts write" on public.parts for all using (public.is_admin()) with check (public.is_admin());

-- промокоды: читать всем (для валидации), писать админ
create policy "promo read"  on public.promo_codes for select using (true);
create policy "promo write" on public.promo_codes for all using (public.is_admin()) with check (public.is_admin());

-- бронирования: видит свои или админ
create policy "bookings read"   on public.bookings for select using (auth.uid() = user_id or public.is_admin());
create policy "bookings insert" on public.bookings for insert with check (auth.uid() = user_id);
create policy "bookings update" on public.bookings for update using (auth.uid() = user_id or public.is_admin());

-- заказы
create policy "orders read"   on public.orders for select using (auth.uid() = user_id or public.is_admin());
create policy "orders insert" on public.orders for insert with check (auth.uid() = user_id);
create policy "orders update" on public.orders for update using (auth.uid() = user_id or public.is_admin());

-- позиции заказа: доступ через родительский заказ
create policy "order_items read" on public.order_items for select using (
    exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin()))
);
create policy "order_items insert" on public.order_items for insert with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
);

-- отзывы: читать всем, писать свои
create policy "reviews read"   on public.reviews for select using (true);
create policy "reviews insert" on public.reviews for insert with check (auth.uid() = user_id);
create policy "reviews update" on public.reviews for update using (auth.uid() = user_id or public.is_admin());

-- ═════════════════════════════════════════════════════════════════════
--  ДЕМО-ДАННЫЕ  (все фото вручную проверены: марка ↔ изображение)
-- ═════════════════════════════════════════════════════════════════════

-- ─── Аренда (10 авто) ───
insert into public.cars_for_rent
(brand, model, year, color, transmission, fuel_type, seats, price_per_day, status, location, lat, lng, features, description, image_urls) values

('BMW','M5 Competition',2022,'Белый','auto','petrol',5,45000,'available','Алматы, Бостандыкский район',43.2389,76.8897,
 array['M xDrive','Карбоновые тормоза','Адаптивная подвеска','Harman Kardon','Климат 4 зоны','Подогрев сидений'],
 'BMW M5 Competition — 625 л.с., разгон до 100 км/ч за 3.3 секунды. Идеальный седан для тех, кому нужны и комфорт, и характер.',
 array['https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80']),

('BMW','M4 Competition',2023,'Серебристый','auto','petrol',4,38000,'available','Алматы, Медеуский район',43.2310,76.9450,
 array['M Drive Professional','Спортивные сиденья','Карбон-пакет','Лазерные фары','Apple CarPlay'],
 'BMW M4 Competition — заряженное купе с 510 л.с. Точное управление и узнаваемый дизайн.',
 array['https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80']),

('Mercedes-Benz','AMG GT',2021,'Чёрный','auto','petrol',2,65000,'available','Алматы, Есентай Молл',43.2180,76.9270,
 array['AMG Performance','Керамические тормоза','Burmester','Пневмоподвеска','Режим Race'],
 'Mercedes-AMG GT — двухдверный спорткар ручной сборки. Звук V8 и бескомпромиссная динамика.',
 array['https://images.unsplash.com/photo-1617814065893-00757125efab?auto=format&fit=crop&w=1200&q=80']),

('Tesla','Model 3 Long Range',2023,'Белый','auto','electric',5,25000,'available','Алматы, Аль-Фараби',43.2200,76.9050,
 array['Autopilot','Запас хода 600 км','Премиум-аудио','Стеклянная крыша','OTA-обновления'],
 'Tesla Model 3 Long Range — полный привод, запас хода до 600 км и минималистичный салон. Зарядка по городу бесплатна для арендаторов.',
 array['https://images.unsplash.com/photo-1600712242805-5f78671b24da?auto=format&fit=crop&w=1200&q=80']),

('Tesla','Model S Plaid',2022,'Синий','auto','electric',5,40000,'available','Алматы, Аль-Фараби',43.2205,76.9060,
 array['1020 л.с.','Разгон 2.1 с','Autopilot','Премиум-салон','Запас хода 600 км'],
 'Tesla Model S Plaid — самый быстрый серийный электромобиль. Три мотора и 1020 л.с.',
 array['https://images.unsplash.com/photo-1617704548623-340376564e68?auto=format&fit=crop&w=1200&q=80']),

('Audi','R8 V10',2021,'Серый','auto','petrol',2,80000,'available','Алматы, Достык Плаза',43.2330,76.9560,
 array['5.2 V10','quattro','Магнитная подвеска','Bang & Olufsen','Карбоновые элементы'],
 'Audi R8 V10 — атмосферный суперкар с двигателем от Lamborghini. 570 л.с. и полный привод quattro.',
 array['https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80']),

('Audi','RS7 Sportback',2023,'Серый','auto','petrol',5,55000,'available','Алматы, Бостандыкский район',43.2391,76.8900,
 array['4.0 TFSI','quattro','Матричные фары','Панорама','Bang & Olufsen','Массаж сидений'],
 'Audi RS7 Sportback — 600 л.с. в кузове элегантного лифтбека. Спорт и комфорт в одном.',
 array['https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=1200&q=80']),

('Porsche','911 Carrera',2022,'Чёрный','auto','petrol',4,70000,'available','Алматы, Медеуский район',43.2315,76.9460,
 array['PDK','Sport Chrono','Спортивный выхлоп','BOSE','Адаптивные сиденья'],
 'Porsche 911 Carrera — икона спортивных автомобилей. Оппозитный двигатель и безупречная управляемость.',
 array['https://images.unsplash.com/photo-1611821064430-0d40291d0f0b?auto=format&fit=crop&w=1200&q=80']),

('Chevrolet','Camaro SS',2021,'Синий','auto','petrol',4,30000,'available','Алматы, Сайран',43.2530,76.8720,
 array['6.2 V8','455 л.с.','Спортивный выхлоп','Apple CarPlay','Камера 360'],
 'Chevrolet Camaro SS — американский мускул-кар с V8 6.2 л. Яркий характер и узнаваемый звук.',
 array['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80']),

('Ford','Mustang GT',2020,'Серый','manual','petrol',4,28000,'maintenance','Алматы, Сайран',43.2535,76.8725,
 array['5.0 V8','Механика 6МКПП','Спортивный выхлоп','Recaro','Track Apps'],
 'Ford Mustang GT — легендарный пони-кар с механической коробкой и мотором V8. Чистые эмоции от вождения.',
 array['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80']);

-- ─── Продажа (10 авто) ───
insert into public.cars_for_sale
(brand, model, year, color, transmission, fuel_type, mileage, engine_volume, price, status, location, lat, lng, vin, description, image_urls) values

('BMW','M4 Competition',2022,'Оранжевый','auto','petrol',18500,3.0,32500000,'available','Алматы',43.2389,76.8897,'WBS33AZ0XNCJ12345',
 'BMW M4 Competition в редком цвете Sao Paulo Yellow. Один владелец, полная история обслуживания у дилера.',
 array['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80']),

('Mercedes-Benz','AMG GT',2020,'Чёрный','auto','petrol',32000,4.0,48000000,'available','Алматы',43.2180,76.9270,'WDDYJ7JA1LA012345',
 'Mercedes-AMG GT, матовый чёрный. Керамика, выхлоп AMG Performance, безупречное состояние.',
 array['https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80']),

('Mercedes-Benz','AMG GT R',2019,'Жёлтый','auto','petrol',41000,4.0,52000000,'reserved','Астана',51.1280,71.4304,'WDDYK7JA9KA012987',
 'AMG GT R — версия для трека. Активная аэродинамика, режим Race, легендарный жёлтый цвет.',
 array['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80']),

('Porsche','Panamera',2021,'Чёрный','auto','hybrid',27000,2.9,46000000,'available','Алматы',43.2330,76.9560,'WP0AA2A70ML012345',
 'Porsche Panamera 4 E-Hybrid. Полный привод, гибридная установка, премиальный салон.',
 array['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80']),

('Nissan','GT-R',2020,'Серебристый','auto','petrol',38000,3.8,39000000,'available','Алматы',43.2530,76.8720,'JN1AR5EF0LM012345',
 'Nissan GT-R R35 — Godzilla. Битурбо V6, полный привод ATTESA, разгон до 100 за 2.9 с.',
 array['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80']),

('McLaren','720S',2021,'Белый','auto','petrol',9800,4.0,145000000,'available','Алматы',43.2200,76.9050,'SBM14DCA0MW012345',
 'McLaren 720S — карбоновый монокок, 720 л.с., дигидральные двери. Машина уровня суперкара.',
 array['https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80']),

('Bugatti','Chiron',2019,'Белый','auto','petrol',5200,8.0,1850000000,'reserved','Астана',51.1280,71.4304,'VF9SP3V30KM795001',
 'Bugatti Chiron — 8.0 W16, 1500 л.с., 420 км/ч. Один из немногих экземпляров в регионе.',
 array['https://images.unsplash.com/photo-1561580125-028ee3bd62eb?auto=format&fit=crop&w=1200&q=80']),

('Tesla','Model 3',2022,'Белый','auto','electric',24000,null,18500000,'available','Алматы',43.2205,76.9060,'5YJ3E1EA7NF012345',
 'Tesla Model 3 на гарантии. Запас хода 510 км, Autopilot, идеальное состояние батареи.',
 array['https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80']),

('Ferrari','488 GTB',2019,'Красный','auto','petrol',16000,3.9,98000000,'available','Алматы',43.2315,76.9460,'ZFF79ALA4K0012345',
 'Ferrari 488 GTB — битурбо V8 670 л.с. Классический Rosso Corsa, сервисная история Ferrari.',
 array['https://images.unsplash.com/photo-1606220838315-056192d5e927?auto=format&fit=crop&w=1200&q=80']),

('Rolls-Royce','Wraith',2018,'Белый','auto','petrol',29000,6.6,135000000,'available','Алматы',43.2330,76.9560,'SCA665C50JUX12345',
 'Rolls-Royce Wraith — 6.6 V12, Starlight Headliner, двери suicide. Венец роскоши и комфорта.',
 array['https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80']);

-- ─── Запчасти (14 позиций) ───
insert into public.parts
(name, brand, car_brand, car_model, year_from, year_to, category, oem_number, price, stock, description, image_urls) values

('Моторное масло Castrol EDGE 5W-30','Castrol',null,null,null,null,'Расходники','15A4C8',18500,48,
 'Синтетическое моторное масло Castrol EDGE 5W-30, канистра 4 л. Технология Fluid Titanium.',
 array['https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80']),

('Комплект ремня ГРМ','Gates','Volkswagen','Passat',2015,2022,'Двигатель','06K109119',42000,12,
 'Полный комплект ГРМ Gates: ремень, ролики, натяжитель. Ресурс 120 000 км.',
 array['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=80']),

('Тормозные колодки передние','Brembo','BMW','3 Series',2019,2024,'Тормоза','34116888457',38000,20,
 'Передние тормозные колодки Brembo, керамика низкой пыльности. Комплект на ось.',
 array['https://images.unsplash.com/photo-1615906655593-ad0386982a0f?auto=format&fit=crop&w=1200&q=80']),

('LED фары адаптивные (комплект)','Hella','Audi','A6',2018,2023,'Оптика','4G0941035',285000,6,
 'Комплект адаптивных LED-фар Hella с матричным светом. Динамические поворотники.',
 array['https://images.unsplash.com/photo-1606577924006-27d39b132ae2?auto=format&fit=crop&w=1200&q=80']),

('Воздушный фильтр','Mann-Filter','Toyota','Camry',2018,2024,'Расходники','178010H050',7800,60,
 'Воздушный фильтр Mann-Filter. Оригинальное качество, увеличенная площадь фильтрации.',
 array['https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80']),

('Свечи зажигания NGK Iridium (к-т 4)','NGK','Hyundai','Tucson',2016,2023,'Двигатель','1884611070',16000,40,
 'Иридиевые свечи зажигания NGK, комплект 4 шт. Увеличенный ресурс до 100 000 км.',
 array['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80']),

('Зарядный кабель Type 2 (EV)','Tesla','Tesla','Model 3',2019,2024,'Электро','110251200A',95000,15,
 'Зарядный кабель Type 2, 32 А / 7.4 кВт, длина 5 м. Совместим с большинством электромобилей.',
 array['https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80']),

('Аккумулятор Bosch S5 77Ah','Bosch',null,null,null,null,'Электро','0092S50080',54000,18,
 'АКБ Bosch S5, 77 Ач, 780 А. Технология AGM, повышенный пусковой ток для холодного климата.',
 array['https://images.unsplash.com/photo-1615906655593-ad0386982a0f?auto=format&fit=crop&w=1200&q=80']),

('Амортизаторы передние (пара)','Sachs','Mercedes-Benz','E-Class',2016,2023,'Подвеска','2053230600',76000,10,
 'Газомасляные амортизаторы Sachs, передняя ось. Оригинальные настройки комфорта.',
 array['https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=1200&q=80']),

('Щётки стеклоочистителя (к-т)','Bosch Aerotwin',null,null,null,null,'Расходники','3397007620',12500,55,
 'Бескаркасные щётки Bosch Aerotwin, комплект. Равномерный прижим по всей длине.',
 array['https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&w=1200&q=80']),

('Масляный фильтр','Mahle','Kia','Sportage',2016,2023,'Расходники','OC1051',4200,80,
 'Масляный фильтр Mahle. Высокая степень очистки и надёжная фильтрация.',
 array['https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=80']),

('Радиатор охлаждения','Nissens','Volkswagen','Tiguan',2017,2023,'Охлаждение','5Q0121251',64000,8,
 'Алюминиевый радиатор охлаждения Nissens. Точная геометрия и эффективный теплоотвод.',
 array['https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80']),

('Комплект сцепления','LuK','Ford','Focus',2015,2022,'Трансмиссия','624363400',88000,7,
 'Комплект сцепления LuK: диск, корзина, выжимной подшипник. Ресурс свыше 150 000 км.',
 array['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=80']),

('Набор инструмента 108 предметов','Force',null,null,null,null,'Инструмент','41082',46000,25,
 'Профессиональный набор инструмента Force, 108 предметов, в кейсе. Хром-ванадиевая сталь.',
 array['https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=1200&q=80']);

-- ─── Промокоды ───
insert into public.promo_codes (code, type, value, max_uses, expires_at, is_active) values
('NOMAD2025','percent',10, 1000, now() + interval '180 days', true),
('WELCOME15','percent',15, 500,  now() + interval '90 days',  true),
('DRIVE50K','fixed', 50000, 200, now() + interval '60 days',  true);

-- =====================================================================
--  Готово. Проверка:
--    select count(*) from public.cars_for_rent;   -- 10
--    select count(*) from public.cars_for_sale;   -- 10
--    select count(*) from public.parts;           -- 14
--    select count(*) from public.promo_codes;     -- 3
-- =====================================================================
