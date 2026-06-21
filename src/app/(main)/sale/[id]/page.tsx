import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
    ChevronLeft, MapPin, Gauge, Fuel, Settings2,
    Calendar, Shield, CheckCircle2, Phone, MessageCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getServerDict } from '@/lib/i18n.server'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { saleDetail: t } = await getServerDict()
    const { data: car } = await supabase
        .from('cars_for_sale')
        .select('brand, model, year')
        .eq('id', id)
        .single()
    if (!car) return { title: t.notFound }
    return { title: `${car.brand} ${car.model} ${car.year} — ${t.saleSuffix}` }
}

export default async function SaleCarPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { saleDetail: t, sale: s, common } = await getServerDict()

    const transmissionLabel: Record<string, string> = {
        auto: s.auto, manual: s.manual,
    }
    const fuelLabel: Record<string, string> = {
        petrol: s.petrol, diesel: s.diesel, electric: s.electric, hybrid: s.hybrid,
    }
    const statusConfig: Record<string, { label: string; classes: string }> = {
        available: { label: s.statusAvailable, classes: 'text-[#34c759]' },
        sold: { label: s.statusSold, classes: 'text-[#ff3b30]' },
        reserved: { label: s.statusReserved, classes: 'text-[#ff9f0a]' },
    }

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
        { icon: Calendar, label: t.specYear, value: String(car.year) },
        { icon: Gauge, label: t.specMileage, value: `${car.mileage.toLocaleString(common.locale)} ${s.kmSuffix}` },
        { icon: Settings2, label: t.specTransmission, value: car.transmission ? transmissionLabel[car.transmission] : '—' },
        { icon: Fuel, label: t.specFuel, value: car.fuel_type ? fuelLabel[car.fuel_type] : '—' },
        ...(car.engine_volume ? [{ icon: Fuel, label: t.specVolume, value: `${car.engine_volume}L` }] : []),
        ...(car.location ? [{ icon: MapPin, label: t.specCity, value: car.location }] : []),
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
                    {t.catalog}
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
                        <h2 className="text-[16px] font-bold tracking-tight mb-4 text-[#f0ece4]">{t.specs}</h2>
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
                            <h2 className="text-[16px] font-bold tracking-tight mb-3 text-[#f0ece4]">{t.description}</h2>
                            <p className="text-[15px] text-[#6b6b6b] leading-relaxed">{car.description}</p>
                        </div>
                    )}

                    {/* Гарантии */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 fade-in-up">
                        {[
                            { icon: Shield, text: t.guaranteeLegal },
                            { icon: CheckCircle2, text: t.guaranteeNoDefects },
                            { icon: CheckCircle2, text: t.guaranteeHistory },
                            { icon: Shield, text: t.guaranteeSafe },
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
                                {car.price.toLocaleString(common.locale)} ₸
                            </p>
                            <p className="text-[13px] text-[#6b6b6b] mt-0.5">
                                ≈ {Math.round(car.price / 450).toLocaleString(common.locale)} $
                            </p>
                        </div>

                        <div className="p-6 flex flex-col gap-3">

                            {/* Быстрые факты */}
                            <div className="grid grid-cols-3 gap-2 mb-2">
                                {[
                                    { label: t.factYear, value: String(car.year) },
                                    { label: t.factMileage, value: `${(car.mileage / 1000).toFixed(0)}к` },
                                    { label: t.factTransmission, value: car.transmission === 'auto' ? t.transAuto : t.transManual },
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
                                    {t.contactSeller}
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
                                href={`https://wa.me/77007007000?text=${encodeURIComponent(`${t.whatsappMsg1} ${car.brand} ${car.model} ${car.year} ${t.whatsappMsg2} ${car.price.toLocaleString(common.locale)} ₸`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-12 bg-[#1a1a1a] text-[#f0ece4] font-medium rounded-[12px] border border-white/[0.08] hover:bg-white/[0.04] transition-colors text-[15px] flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={16} />
                                {t.writeWhatsapp}
                            </a>

                            <p className="text-[12px] text-[#3d3d3d] text-center">
                                {t.safeDeal}
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Похожие */}
            {similar && similar.length > 0 && (
                <div className="mt-16 fade-in-up">
                    <h2 className="text-[20px] font-bold tracking-tight mb-6 text-[#f0ece4]">
                        {t.otherOf} {car.brand}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 stagger-children">
                        {similar.map(sc => (
                            <Link
                                key={sc.id}
                                href={`/sale/${sc.id}`}
                                className="group bg-[#111111] border border-white/[0.07] rounded-[14px] overflow-hidden hover:shadow-lg hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-300"
                            >
                                <div className="relative h-40 bg-[#161616]">
                                    {sc.image_urls?.[0] ? (
                                        <Image
                                            src={sc.image_urls[0]} alt={`${sc.brand} ${sc.model}`}
                                            fill sizes="33vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[40px]">🚗</div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <p className="font-bold text-[15px] tracking-tight text-[#f0ece4]">{sc.brand} {sc.model}</p>
                                    <p className="text-[13px] text-[#6b6b6b] mt-0.5">
                                        {sc.year} · {sc.mileage.toLocaleString(common.locale)} {s.kmSuffix}
                                    </p>
                                    <p className="text-[15px] font-bold text-[#c9a96e] mt-2">
                                        {sc.price.toLocaleString(common.locale)} ₸
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
