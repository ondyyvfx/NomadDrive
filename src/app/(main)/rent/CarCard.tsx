import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Users, Fuel, Settings2 } from 'lucide-react'
import type { CarForRent } from '@/types'

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

export function CarCard({ car, priority = false }: { car: CarForRent; priority?: boolean }) {
    const status = statusConfig[car.status] ?? statusConfig.available
    const image = car.image_urls?.[0]

    return (
        <Link
            href={`/rent/${car.id}`}
            className="group bg-white border border-black/[0.06] rounded-[16px] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
        >
            {/* Фото */}
            <div className="relative h-48 bg-[#f5f5f7] overflow-hidden">
                {image ? (
                    <Image
                        src={image}
                        alt={`${car.brand} ${car.model}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={priority}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[48px]">
                        🚗
                    </div>
                )}

                {/* Статус */}
                <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium backdrop-blur-sm ${status.classes}`}>
                        {status.label}
                    </span>
                </div>

                {/* Цена */}
                <div className="absolute bottom-3 right-3">
                    <span className="inline-flex items-center px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-[10px] text-[13px] font-semibold text-[#1d1d1f] shadow-sm">
                        {car.price_per_day.toLocaleString('ru-RU')} ₸
                        <span className="text-[11px] font-normal text-[#6e6e73] ml-1">/день</span>
                    </span>
                </div>
            </div>

            {/* Контент */}
            <div className="p-4 flex flex-col flex-1">
                <div className="mb-3">
                    <h3 className="text-[16px] font-semibold tracking-tight text-[#1d1d1f]">
                        {car.brand} {car.model}
                    </h3>
                    <p className="text-[13px] text-[#6e6e73]">{car.year}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                    {car.transmission && (
                        <div className="flex items-center gap-1.5 text-[12px] text-[#6e6e73]">
                            <Settings2 size={13} className="flex-shrink-0" />
                            {transmissionLabel[car.transmission]}
                        </div>
                    )}
                    {car.fuel_type && (
                        <div className="flex items-center gap-1.5 text-[12px] text-[#6e6e73]">
                            <Fuel size={13} className="flex-shrink-0" />
                            {fuelLabel[car.fuel_type]}
                        </div>
                    )}
                    {car.seats && (
                        <div className="flex items-center gap-1.5 text-[12px] text-[#6e6e73]">
                            <Users size={13} className="flex-shrink-0" />
                            {car.seats} мест
                        </div>
                    )}
                    {car.location && (
                        <div className="flex items-center gap-1.5 text-[12px] text-[#6e6e73] truncate">
                            <MapPin size={13} className="flex-shrink-0" />
                            <span className="truncate">{car.location}</span>
                        </div>
                    )}
                </div>

                <div className="mt-auto">
                    <div className={`w-full h-10 rounded-[10px] flex items-center justify-center text-[14px] font-medium transition-all duration-200 ${car.status === 'available'
                            ? 'bg-accent/[0.08] text-accent group-hover:bg-accent group-hover:text-white'
                            : 'bg-[#f5f5f7] text-[#aeaeb2] cursor-not-allowed'
                        }`}>
                        {car.status === 'available' ? 'Забронировать' : 'Недоступен'}
                    </div>
                </div>
            </div>
        </Link>
    )
}