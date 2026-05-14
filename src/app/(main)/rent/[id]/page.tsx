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
    available: { label: 'Доступен', classes: 'text-[#34c759]' },
    rented: { label: 'Занят', classes: 'text-[#ff9f0a]' },
    maintenance: { label: 'На ТО', classes: 'text-[#6b6b6b]' },
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
                    className="inline-flex items-center gap-1.5 text-[14px] text-[#6b6b6b] hover:text-[#f0ece4] transition-colors"
                >
                    <ChevronLeft size={16} />
                    Каталог аренды
                </Link>
                <span className="text-[#3d3d3d]">/</span>
                <span className="text-[14px] text-[#f0ece4]">
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
                        <div className="relative h-[280px] md:h-[420px] rounded-[16px] overflow-hidden bg-[#161616]">
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
                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[13px] font-medium backdrop-blur-sm bg-black/70 ${status.classes}`}>
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
                                        className="relative h-20 flex-1 rounded-[10px] overflow-hidden bg-[#161616] cursor-pointer hover:opacity-80 transition-opacity"
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
                                <h1 className="text-2xl md:text-3xl font-bold tracking-[-0.04em] mb-1 text-[#f0ece4]">
                                    {car.brand} {car.model}
                                </h1>
                                <p className="text-[#6b6b6b] text-[16px]">{car.year} год выпуска</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold tracking-tight text-[#f0ece4]">
                                    {car.price_per_day.toLocaleString('ru-RU')} ₸
                                </p>
                                <p className="text-[13px] text-[#6b6b6b]">за сутки</p>
                            </div>
                        </div>
                    </div>

                    {/* Характеристики */}
                    <div className="bg-[#111111] border border-white/[0.07] rounded-[14px] p-5 fade-in-up">
                        <h2 className="text-[16px] font-bold tracking-tight mb-4 text-[#f0ece4]">
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
                            <h2 className="text-[16px] font-bold tracking-tight mb-3 text-[#f0ece4]">
                                Описание
                            </h2>
                            <p className="text-[15px] text-[#6b6b6b] leading-relaxed">
                                {car.description}
                            </p>
                        </div>
                    )}

                    {/* Фичи */}
                    {car.features?.length > 0 && (
                        <div className="fade-in-up">
                            <h2 className="text-[16px] font-bold tracking-tight mb-3 text-[#f0ece4]">
                                Комплектация
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {car.features.map((f: string) => (
                                    <div key={f} className="flex items-center gap-2.5">
                                        <CheckCircle2 size={16} className="text-[#c9a96e] flex-shrink-0" />
                                        <span className="text-[14px] text-[#6b6b6b]">{f}</span>
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
                                className="flex items-center gap-3 p-4 bg-[#111111] border border-white/[0.07] rounded-[12px]"
                            >
                                <Icon size={16} className="text-[#c9a96e] flex-shrink-0" />
                                <span className="text-[13px] font-medium text-[#f0ece4]">{text}</span>
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
                    <h2 className="text-[20px] font-bold tracking-tight mb-6 text-[#f0ece4]">
                        Другие {car.brand}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 stagger-children">
                        {similar.map(s => (
                            <Link
                                key={s.id}
                                href={`/cars/${s.id}`}
                                className="group bg-[#111111] border border-white/[0.07] rounded-[14px] overflow-hidden hover:shadow-lg hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-300"
                            >
                                <div className="relative h-40 bg-[#161616]">
                                    {s.image_urls?.[0] ? (
                                        <Image
                                            src={s.image_urls[0]}
                                            alt={`${s.brand} ${s.model}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[40px]">🚗</div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <p className="font-bold text-[15px] tracking-tight text-[#f0ece4]">
                                        {s.brand} {s.model}
                                    </p>
                                    <p className="text-[13px] text-[#6b6b6b] mt-0.5">{s.year}</p>
                                    <p className="text-[14px] font-bold text-[#c9a96e] mt-2">
                                        {s.price_per_day.toLocaleString('ru-RU')} ₸
                                        <span className="text-[12px] font-normal text-[#6b6b6b]">/день</span>
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
            <div className="flex items-center gap-1.5 text-[#6b6b6b]">
                {icon}
                <span className="text-[12px]">{label}</span>
            </div>
            <p className="text-[14px] font-bold text-[#f0ece4] truncate">{value}</p>
        </div>
    )
}
