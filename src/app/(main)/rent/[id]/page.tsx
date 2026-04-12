import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
    MapPin, Users, Fuel, Settings2, Calendar,
    ChevronLeft, Shield, Star, CheckCircle2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { BookingWidget } from './BookingWidget'

const transmissionLabel: Record<string, string> = {
    auto: 'Автомат', manual: 'Механика',
}
const fuelLabel: Record<string, string> = {
    petrol: 'Бензин', diesel: 'Дизель', electric: 'Электро', hybrid: 'Гибрид',
}
const statusConfig: Record<string, { label: string; classes: string }> = {
    available: { label: 'Доступен', classes: 'bg-[#34c759]/[0.08] text-[#34c759]' },
    rented: { label: 'Занят', classes: 'bg-[#ff9f0a]/[0.08] text-[#ff9f0a]' },
    maintenance: { label: 'На ТО', classes: 'bg-[#6e6e73]/[0.08] text-[#6e6e73]' },
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()
    const { data: car } = await supabase
        .from('cars_for_rent')
        .select('brand, model, year')
        .eq('id', id)
        .single()

    if (!car) return { title: 'Автомобиль не найден' }
    return { title: `${car.brand} ${car.model} ${car.year} — Аренда` }
}

export default async function CarPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    const { data: car } = await supabase
        .from('cars_for_rent')
        .select('*')
        .eq('id', id)
        .single()

    if (!car) notFound()

    const { data: { user } } = await supabase.auth.getUser()

    // Похожие авто
    const { data: similar } = await supabase
        .from('cars_for_rent')
        .select('id, brand, model, year, price_per_day, image_urls, status')
        .eq('brand', car.brand)
        .neq('id', car.id)
        .eq('status', 'available')
        .limit(3)

    const status = statusConfig[car.status] ?? statusConfig.available
    const images = car.image_urls?.length ? car.image_urls : []

    return (
        <div className="max-w-[1200px] mx-auto px-5 py-8">

            {/* ── Breadcrumb ── */}
            <div className="flex items-center gap-2 mb-6 fade-in">
                <Link
                    href="/rent"
                    className="inline-flex items-center gap-1.5 text-[14px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                >
                    <ChevronLeft size={16} />
                    Каталог аренды
                </Link>
                <span className="text-[#aeaeb2]">/</span>
                <span className="text-[14px] text-[#1d1d1f]">
                    {car.brand} {car.model}
                </span>
            </div>

            {/* ── Main grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

                {/* ── Левая колонка ── */}
                <div className="flex flex-col gap-6">

                    {/* Галерея */}
                    <div className="fade-in">
                        {/* Главное фото */}
                        <div className="relative h-[280px] md:h-[420px] rounded-[16px] overflow-hidden bg-[#f5f5f7]">
                            {images[0] ? (
                                <Image
                                    src={images[0]}
                                    alt={`${car.brand} ${car.model}`}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[80px]">
                                    🚗
                                </div>
                            )}
                            {/* Статус */}
                            <div className="absolute top-4 left-4">
                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[13px] font-medium backdrop-blur-sm bg-white/90 ${status.classes}`}>
                                    {status.label}
                                </span>
                            </div>
                        </div>

                        {/* Миниатюры */}
                        {images.length > 1 && (
                            <div className="flex gap-3 mt-3">
                                {images.slice(1, 5).map((img: string, i: number) => (
                                    <div
                                        key={i}
                                        className="relative h-20 flex-1 rounded-[10px] overflow-hidden bg-[#f5f5f7] cursor-pointer hover:opacity-80 transition-opacity"
                                    >
                                        <Image src={img} alt="" fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Заголовок */}
                    <div className="fade-in-up">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-1">
                                    {car.brand} {car.model}
                                </h1>
                                <p className="text-[#6e6e73] text-[16px]">{car.year} год выпуска</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
                                    {car.price_per_day.toLocaleString('ru-RU')} ₸
                                </p>
                                <p className="text-[13px] text-[#6e6e73]">за сутки</p>
                            </div>
                        </div>
                    </div>

                    {/* Характеристики */}
                    <div className="bg-[#f5f5f7] rounded-[14px] p-5 fade-in-up">
                        <h2 className="text-[16px] font-semibold tracking-tight mb-4">
                            Характеристики
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {car.transmission && (
                                <SpecItem
                                    icon={<Settings2 size={16} />}
                                    label="Коробка"
                                    value={transmissionLabel[car.transmission]}
                                />
                            )}
                            {car.fuel_type && (
                                <SpecItem
                                    icon={<Fuel size={16} />}
                                    label="Топливо"
                                    value={fuelLabel[car.fuel_type]}
                                />
                            )}
                            {car.seats && (
                                <SpecItem
                                    icon={<Users size={16} />}
                                    label="Мест"
                                    value={String(car.seats)}
                                />
                            )}
                            {car.location && (
                                <SpecItem
                                    icon={<MapPin size={16} />}
                                    label="Локация"
                                    value={car.location}
                                />
                            )}
                        </div>
                    </div>

                    {/* Описание */}
                    {car.description && (
                        <div className="fade-in-up">
                            <h2 className="text-[16px] font-semibold tracking-tight mb-3">
                                Описание
                            </h2>
                            <p className="text-[15px] text-[#6e6e73] leading-relaxed">
                                {car.description}
                            </p>
                        </div>
                    )}

                    {/* Фичи */}
                    {car.features?.length > 0 && (
                        <div className="fade-in-up">
                            <h2 className="text-[16px] font-semibold tracking-tight mb-3">
                                Комплектация
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {car.features.map((f: string) => (
                                    <div key={f} className="flex items-center gap-2.5">
                                        <CheckCircle2 size={16} className="text-accent flex-shrink-0" />
                                        <span className="text-[14px] text-[#6e6e73]">{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Гарантии */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 fade-in-up">
                        {[
                            { icon: Shield, text: 'Страховка включена' },
                            { icon: Star, text: 'Проверенный автомобиль' },
                            { icon: Calendar, text: 'Бесплатная отмена за 24ч' },
                        ].map(({ icon: Icon, text }) => (
                            <div
                                key={text}
                                className="flex items-center gap-3 p-4 bg-white border border-black/[0.06] rounded-[12px]"
                            >
                                <Icon size={16} className="text-accent flex-shrink-0" />
                                <span className="text-[13px] font-medium text-[#1d1d1f]">{text}</span>
                            </div>
                        ))}
                    </div>

                </div>

                {/* ── Правая колонка — виджет бронирования ── */}
                <div className="lg:sticky lg:top-[76px] h-fit">
                    <BookingWidget car={car} user={user} />
                </div>

            </div>

            {/* ── Похожие авто ── */}
            {similar && similar.length > 0 && (
                <div className="mt-16 fade-in-up">
                    <h2 className="text-[20px] font-semibold tracking-tight mb-6">
                        Другие {car.brand}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 stagger-children">
                        {similar.map(s => (
                            <Link
                                key={s.id}
                                href={`/cars/${s.id}`}
                                className="group bg-white border border-black/[0.06] rounded-[14px] overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="relative h-40 bg-[#f5f5f7]">
                                    {s.image_urls?.[0] ? (
                                        <Image
                                            src={s.image_urls[0]}
                                            alt={`${s.brand} ${s.model}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[40px]">🚗</div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <p className="font-semibold text-[15px] tracking-tight">
                                        {s.brand} {s.model}
                                    </p>
                                    <p className="text-[13px] text-[#6e6e73] mt-0.5">{s.year}</p>
                                    <p className="text-[14px] font-semibold text-accent mt-2">
                                        {s.price_per_day.toLocaleString('ru-RU')} ₸
                                        <span className="text-[12px] font-normal text-[#6e6e73]">/день</span>
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

        </div>
    )
}

function SpecItem({
    icon, label, value,
}: {
    icon: React.ReactNode
    label: string
    value: string
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[#6e6e73]">
                {icon}
                <span className="text-[12px]">{label}</span>
            </div>
            <p className="text-[14px] font-semibold text-[#1d1d1f] truncate">{value}</p>
        </div>
    )
}