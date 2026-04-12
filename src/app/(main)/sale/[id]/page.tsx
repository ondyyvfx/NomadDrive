import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
    ChevronLeft, MapPin, Gauge, Fuel, Settings2,
    Calendar, Shield, CheckCircle2, Phone, MessageCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

const transmissionLabel: Record<string, string> = {
    auto: 'Автомат', manual: 'Механика',
}
const fuelLabel: Record<string, string> = {
    petrol: 'Бензин', diesel: 'Дизель', electric: 'Электро', hybrid: 'Гибрид',
}
const statusConfig: Record<string, { label: string; classes: string }> = {
    available: { label: 'В наличии', classes: 'bg-[#34c759]/[0.08] text-[#34c759]' },
    sold: { label: 'Продан', classes: 'bg-[#ff3b30]/[0.08] text-[#ff3b30]' },
    reserved: { label: 'Резерв', classes: 'bg-[#ff9f0a]/[0.08] text-[#ff9f0a]' },
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: car } = await supabase
        .from('cars_for_sale')
        .select('brand, model, year')
        .eq('id', id)
        .single()
    if (!car) return { title: 'Не найдено' }
    return { title: `${car.brand} ${car.model} ${car.year} — Продажа` }
}

export default async function SaleCarPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: car } = await supabase
        .from('cars_for_sale')
        .select('*')
        .eq('id', id)
        .single()

    if (!car) notFound()

    const { data: similar } = await supabase
        .from('cars_for_sale')
        .select('id, brand, model, year, price, mileage, image_urls, status')
        .eq('brand', car.brand)
        .neq('id', car.id)
        .limit(3)

    const status = statusConfig[car.status] ?? statusConfig.available
    const images = car.image_urls ?? []

    const specs = [
        { icon: Calendar, label: 'Год выпуска', value: String(car.year) },
        { icon: Gauge, label: 'Пробег', value: `${car.mileage.toLocaleString('ru-RU')} км` },
        { icon: Settings2, label: 'Коробка', value: car.transmission ? transmissionLabel[car.transmission] : '—' },
        { icon: Fuel, label: 'Топливо', value: car.fuel_type ? fuelLabel[car.fuel_type] : '—' },
        ...(car.engine_volume ? [{ icon: Fuel, label: 'Объём', value: `${car.engine_volume}L` }] : []),
        ...(car.location ? [{ icon: MapPin, label: 'Город', value: car.location }] : []),
    ]

    return (
        <div className="max-w-[1200px] mx-auto px-5 py-8">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 fade-in">
                <Link
                    href="/sale"
                    className="inline-flex items-center gap-1.5 text-[14px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                >
                    <ChevronLeft size={16} />
                    Продажа авто
                </Link>
                <span className="text-[#aeaeb2]">/</span>
                <span className="text-[14px] text-[#1d1d1f]">{car.brand} {car.model}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

                {/* Левая колонка */}
                <div className="flex flex-col gap-6">

                    {/* Галерея */}
                    <div className="fade-in">
                        <div className="relative h-[280px] md:h-[420px] rounded-[16px] overflow-hidden bg-[#f5f5f7]">
                            {images[0] ? (
                                <Image
                                    src={images[0]}
                                    alt={`${car.brand} ${car.model}`}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 65vw"
                                    priority
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[80px]">🚗</div>
                            )}
                            <div className="absolute top-4 left-4">
                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[13px] font-medium bg-white/90 backdrop-blur-sm ${status.classes}`}>
                                    {status.label}
                                </span>
                            </div>
                        </div>
                        {images.length > 1 && (
                            <div className="flex gap-3 mt-3">
                                {images.slice(1, 5).map((img: string, i: number) => (
                                    <div key={i} className="relative h-20 flex-1 rounded-[10px] overflow-hidden bg-[#f5f5f7]">
                                        <Image
                                            src={img} alt="" fill
                                            sizes="20vw"
                                            className="object-cover hover:opacity-80 transition-opacity cursor-pointer"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Заголовок */}
                    <div className="fade-in-up">
                        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-1">
                            {car.brand} {car.model} {car.year}
                        </h1>
                        {car.vin && (
                            <p className="text-[13px] text-[#aeaeb2]">VIN: {car.vin}</p>
                        )}
                    </div>

                    {/* Характеристики */}
                    <div className="bg-[#f5f5f7] rounded-[14px] p-5 fade-in-up">
                        <h2 className="text-[16px] font-semibold tracking-tight mb-4">Характеристики</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {specs.map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-1.5 text-[#6e6e73]">
                                        <Icon size={14} />
                                        <span className="text-[12px]">{label}</span>
                                    </div>
                                    <p className="text-[14px] font-semibold text-[#1d1d1f]">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Описание */}
                    {car.description && (
                        <div className="fade-in-up">
                            <h2 className="text-[16px] font-semibold tracking-tight mb-3">Описание</h2>
                            <p className="text-[15px] text-[#6e6e73] leading-relaxed">{car.description}</p>
                        </div>
                    )}

                    {/* Гарантии */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 fade-in-up">
                        {[
                            { icon: Shield, text: 'Юридическая чистота проверена' },
                            { icon: CheckCircle2, text: 'Без скрытых дефектов' },
                            { icon: CheckCircle2, text: 'Полная история обслуживания' },
                            { icon: Shield, text: 'Безопасная сделка' },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3 p-4 bg-white border border-black/[0.06] rounded-[12px]">
                                <Icon size={16} className="text-accent flex-shrink-0" />
                                <span className="text-[13px] font-medium">{text}</span>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Правая колонка — цена и контакт */}
                <div className="lg:sticky lg:top-[76px] h-fit">
                    <div className="bg-white border border-black/[0.08] rounded-[20px] shadow-md overflow-hidden scale-in">

                        <div className="px-6 pt-6 pb-5 border-b border-black/[0.06]">
                            <p className="text-[28px] font-semibold tracking-tight">
                                {car.price.toLocaleString('ru-RU')} ₸
                            </p>
                            <p className="text-[13px] text-[#6e6e73] mt-0.5">
                                ≈ {Math.round(car.price / 450).toLocaleString('ru-RU')} $
                            </p>
                        </div>

                        <div className="p-6 flex flex-col gap-3">

                            {/* Быстрые факты */}
                            <div className="grid grid-cols-3 gap-2 mb-2">
                                {[
                                    { label: 'Год', value: String(car.year) },
                                    { label: 'Пробег', value: `${(car.mileage / 1000).toFixed(0)}к` },
                                    { label: 'КПП', value: car.transmission === 'auto' ? 'Авт.' : 'Мех.' },
                                ].map(({ label, value }) => (
                                    <div key={label} className="text-center p-2 bg-[#f5f5f7] rounded-[10px]">
                                        <p className="text-[13px] font-semibold text-[#1d1d1f]">{value}</p>
                                        <p className="text-[11px] text-[#6e6e73]">{label}</p>
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`w-full h-12 font-semibold rounded-[12px] transition-all duration-200 flex items-center justify-center gap-2 text-[15px] ${car.status === 'available'
                                        ? 'bg-accent text-white hover:bg-[#0a6e56]'
                                        : 'bg-[#f5f5f7] text-[#aeaeb2] cursor-not-allowed'
                                    }`}
                                disabled={car.status !== 'available'}
                            >
                                <Phone size={16} />
                                {car.status === 'available' ? 'Связаться с продавцом' : status.label}
                            </button>

                            <button className="w-full h-12 bg-[#f5f5f7] text-[#1d1d1f] font-medium rounded-[12px] border border-black/[0.08] hover:bg-black/[0.04] transition-colors text-[15px] flex items-center justify-center gap-2">
                                <MessageCircle size={16} />
                                Написать в чат
                            </button>

                            <p className="text-[12px] text-[#aeaeb2] text-center">
                                Безопасная сделка через платформу NomadDrive
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Похожие */}
            {similar && similar.length > 0 && (
                <div className="mt-16 fade-in-up">
                    <h2 className="text-[20px] font-semibold tracking-tight mb-6">
                        Другие {car.brand}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 stagger-children">
                        {similar.map(s => (
                            <Link
                                key={s.id}
                                href={`/sale/${s.id}`}
                                className="group bg-white border border-black/[0.06] rounded-[14px] overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="relative h-40 bg-[#f5f5f7]">
                                    {s.image_urls?.[0] ? (
                                        <Image
                                            src={s.image_urls[0]} alt={`${s.brand} ${s.model}`}
                                            fill sizes="33vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[40px]">🚗</div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <p className="font-semibold text-[15px] tracking-tight">{s.brand} {s.model}</p>
                                    <p className="text-[13px] text-[#6e6e73] mt-0.5">
                                        {s.year} · {s.mileage.toLocaleString('ru-RU')} км
                                    </p>
                                    <p className="text-[15px] font-semibold text-accent mt-2">
                                        {s.price.toLocaleString('ru-RU')} ₸
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