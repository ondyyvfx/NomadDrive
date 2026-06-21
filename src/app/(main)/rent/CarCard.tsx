'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Users, Fuel, Settings2 } from 'lucide-react'
import type { CarForRent } from '@/types'
import { useDict } from '@/contexts/LanguageContext'

export function CarCard({ car, priority = false }: { car: CarForRent; priority?: boolean }) {
    const { rent: t, common } = useDict()
    const transmissionLabel: Record<string, string> = { auto: t.auto, manual: t.manual }
    const fuelLabel: Record<string, string> = { petrol: t.petrol, diesel: t.diesel, electric: t.electric, hybrid: t.hybrid }
    const statusConfig: Record<string, { label: string; classes: string }> = {
        available: { label: t.statusAvailable, classes: 'text-[#34c759]' },
        rented: { label: t.statusRented, classes: 'text-[#ff9f0a]' },
        maintenance: { label: t.statusMaintenance, classes: 'text-[#6b6b6b]' },
    }
    const status = statusConfig[car.status] ?? statusConfig.available
    const image = car.image_urls?.[0]

    return (
        <Link
            href={`/rent/${car.id}`}
            className="group bg-[#111111] border border-white/[0.07] rounded-[16px] shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-300 overflow-hidden flex flex-col"
        >
            {/* Фото */}
            <div className="relative h-48 bg-[#161616] overflow-hidden">
                {image ? (
                    <Image
                        src={image}
                        alt={`${car.brand} ${car.model}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={priority}
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[48px]">
                        🚗
                    </div>
                )}

                {/* Статус */}
                <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium bg-black/70 backdrop-blur-sm ${status.classes}`}>
                        {status.label}
                    </span>
                </div>

                {/* Цена */}
                <div className="absolute bottom-3 right-3">
                    <span className="inline-flex items-center px-3 py-1.5 bg-black/75 backdrop-blur-sm rounded-[10px] text-[13px] font-semibold text-[#f0ece4] shadow-sm">
                        {car.price_per_day.toLocaleString(common.locale)} ₸
                        <span className="text-[11px] font-normal text-[#6b6b6b] ml-1">{t.daySuffix}</span>
                    </span>
                </div>
            </div>

            {/* Контент */}
            <div className="p-4 flex flex-col flex-1">
                <div className="mb-3">
                    <h3 className="text-[16px] font-bold tracking-tight text-[#f0ece4]">
                        {car.brand} {car.model}
                    </h3>
                    <p className="text-[13px] text-[#6b6b6b]">{car.year}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                    {car.transmission && (
                        <div className="flex items-center gap-1.5 text-[12px] text-[#6b6b6b]">
                            <Settings2 size={13} className="flex-shrink-0" />
                            {transmissionLabel[car.transmission]}
                        </div>
                    )}
                    {car.fuel_type && (
                        <div className="flex items-center gap-1.5 text-[12px] text-[#6b6b6b]">
                            <Fuel size={13} className="flex-shrink-0" />
                            {fuelLabel[car.fuel_type]}
                        </div>
                    )}
                    {car.seats && (
                        <div className="flex items-center gap-1.5 text-[12px] text-[#6b6b6b]">
                            <Users size={13} className="flex-shrink-0" />
                            {car.seats} {t.seatsShort}
                        </div>
                    )}
                    {car.location && (
                        <div className="flex items-center gap-1.5 text-[12px] text-[#6b6b6b] truncate">
                            <MapPin size={13} className="flex-shrink-0" />
                            <span className="truncate">{car.location}</span>
                        </div>
                    )}
                </div>

                <div className="mt-auto">
                    <div className={`w-full h-10 rounded-[10px] flex items-center justify-center text-[14px] font-semibold transition-all duration-300 ${car.status === 'available'
                            ? 'bg-[#c9a96e]/[0.08] text-[#c9a96e] group-hover:bg-[#c9a96e] group-hover:text-[#0a0a0a]'
                            : 'bg-[#1a1a1a] text-[#3d3d3d] cursor-not-allowed'
                        }`}>
                        {car.status === 'available' ? t.book : t.unavailable}
                    </div>
                </div>
            </div>
        </Link>
    )
}
