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
    available: { label: 'В наличии', classes: 'text-[#34c759]' },
    sold: { label: 'Продан', classes: 'text-[#ff3b30]' },
    reserved: { label: 'Резерв', classes: 'text-[#ff9f0a]' },
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
                    className="inline-flex items-center gap-1.5 text-[14px] text-[#6b6b6b] hover:text-[#f0ece4] transition-colors"
                >
                    <ChevronLeft size={16} />
                    Продажа авто
                </Link>
                <span className="text-[#3d3d3d]">/</span>
                <span className="text-[14px] text-[#f0ece4]">{car.brand} {car.model}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

                {/* Левая колонка */}
                <div className="flex flex-col gap-6">

                    {/* Галерея */}
                    <div className="fade-in">
                        <div className="relative h-[280px] md:h-[420px] rounded-[16px] overflow-hidden bg-[#161616]">
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
                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[13px] font-medium bg-black/70 backdrop-blur-sm ${status.classes}`}>
                                    {status.label}
                                </span>
                            </div>
                        </div>
                        {images.length > 1 && (
                            <div className="flex gap-3 mt-3">
                                {images.slice(1, 5).map((img: string, i: number) => (
                                    <div key={i} className="relative h-20 flex-1 rounded-[10px] overflow-hidden bg-[#161616]">
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
                        <h1 className="text-2xl md:text-3xl font-bold tracking-[-0.04em] mb-1 text-[#f0ece4]">
                            {car.brand} {car.model} {car.year}
                        </h1>
                        {car.vin && (
                            <p className="text-[13px] text-[#3d3d3d]">VIN: {car.vin}</p>
                        )}
                    </div>

                    {/* Характеристики */}
                    <div className="bg-[#111111] border border-white/[0.07] rounded-[14px] p-5 fade-in-up">
                        <h2 className="text-[16px] font-bold tracking-tight mb-4 text-[#f0ece4]">Характеристики</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {specs.map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-1.5 text-[#6b6b6b]">
                                        <Icon size={14} />
                                        <span className="text-[12px]">{label}</span>
                                    </div>
                                    <p className="text-[14px] font-bold text-[#f0ece4]">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Описание */}
                    {car.description && (
                        <div className="fade-in-up">
                            <h2 className="text-[16px] font-bold tracking-tight mb-3 text-[#f0ece4]">Описание</h2>
                            <p className="text-[15px] text-[#6b6b6b] leading-relaxed">{car.description}</p>
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
                            <div key={text} className="flex items-center gap-3 p-4 bg-[#111111] border border-white/[0.07] rounded-[12px]">
                                <Icon size={16} className="text-[#c9a96e] flex-shrink-0" />
                                <span className="text-[13px] font-medium text-[#f0ece4]">{text}</span>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Правая колонка — цена и контакт */}
                <div className="lg:sticky lg:top-[76px] h-fit">
                    <div className="bg-[#111111] border border-white/[0.08] rounded-[20px] shadow-lg overflow-hidden scale-in">

                        <div className="px-6 pt-6 pb-5 border-b border-white/[0.06]">
                            <p className="text-[28px] font-bold tracking-tight text-[#f0ece4]">
                                {car.price.toLocaleString('ru-RU')} ₸
                            </p>
                            <p className="text-[13px] text-[#6b6b6b] mt-0.5">
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
                                    <div key={label} className="text-center p-2 bg-[#161616] rounded-[10px] border border-white/[0.05]">
                                        <p className="text-[13px] font-bold text-[#f0ece4]">{value}</p>
                                        <p className="text-[11px] text-[#6b6b6b]">{label}</p>
                                    </div>
                                ))}
                            </div>

                            {car.status === 'available' ? (
                                <a
                                    href="tel:+77007007000"
                                    className="w-full h-12 font-bold rounded-[12px] transition-all duration-300 flex items-center justify-center gap-2 text-[15px] bg-[#c9a96e] text-[#0a0a0a] hover:bg-[#d4b87a]"
                                >
                                    <Phone size={16} />
                                    Связаться с продавцом
                                </a>
                            ) : (
                                <button
                                    className="w-full h-12 font-bold rounded-[12px] flex items-center justify-center gap-2 text-[15px] bg-[#1a1a1a] text-[#3d3d3d] cursor-not-allowed border border-white/[0.06]"
                                    disabled
                                >
                                    <Phone size={16} />
                                    {status.label}
                                </button>
                            )}

                            <a
                                href={`https://wa.me/77007007000?text=${encodeURIComponent(`Здравствуйте! Интересует ${car.brand} ${car.model} ${car.year} за ${car.price.toLocaleString('ru-RU')} ₸`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-12 bg-[#1a1a1a] text-[#f0ece4] font-medium rounded-[12px] border border-white/[0.08] hover:bg-white/[0.04] transition-colors text-[15px] flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={16} />
                                Написать в WhatsApp
                            </a>

                            <p className="text-[12px] text-[#3d3d3d] text-center">
                                Безопасная сделка через платформу NomadDrive · +7 700 700 70 00
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Похожие */}
            {similar && similar.length > 0 && (
                <div className="mt-16 fade-in-up">
                    <h2 className="text-[20px] font-bold tracking-tight mb-6 text-[#f0ece4]">
                        Другие {car.brand}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 stagger-children">
                        {similar.map(s => (
                            <Link
                                key={s.id}
                                href={`/sale/${s.id}`}
                                className="group bg-[#111111] border border-white/[0.07] rounded-[14px] overflow-hidden hover:shadow-lg hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-300"
                            >
                                <div className="relative h-40 bg-[#161616]">
                                    {s.image_urls?.[0] ? (
                                        <Image
                                            src={s.image_urls[0]} alt={`${s.brand} ${s.model}`}
                                            fill sizes="33vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[40px]">🚗</div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <p className="font-bold text-[15px] tracking-tight text-[#f0ece4]">{s.brand} {s.model}</p>
                                    <p className="text-[13px] text-[#6b6b6b] mt-0.5">
                                        {s.year} · {s.mileage.toLocaleString('ru-RU')} км
                                    </p>
                                    <p className="text-[15px] font-bold text-[#c9a96e] mt-2">
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
