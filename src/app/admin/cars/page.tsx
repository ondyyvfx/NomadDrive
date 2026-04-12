import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { AdminStatusBadge } from '../AdminStatusBadge'

export const metadata = { title: 'Admin — Аренда авто' }

export default async function AdminCarsPage() {
    const supabase = await createClient()
    const { data: cars } = await supabase
        .from('cars_for_rent')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-[1000px]">
            <div className="flex items-center justify-between mb-8 fade-in">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Аренда авто</h1>
                    <p className="text-[14px] text-[#6e6e73] mt-1">Всего: {cars?.length ?? 0}</p>
                </div>
                <Link
                    href="/admin/cars/new"
                    className="inline-flex items-center gap-2 h-10 px-5 bg-accent text-white text-[14px] font-medium rounded-[10px] hover:bg-[#0a6e56] transition-colors"
                >
                    <Plus size={16} />
                    Добавить
                </Link>
            </div>

            <div className="bg-white border border-black/[0.06] rounded-[16px] overflow-hidden fade-in">
                <div className="divide-y divide-black/[0.04]">
                    {cars?.map(car => (
                        <Link
                            key={car.id}
                            href={`/admin/cars/${car.id}`}
                            className="flex items-center gap-4 px-5 py-4 hover:bg-[#f5f5f7] transition-colors group"
                        >
                            <div className="relative w-16 h-12 rounded-[8px] overflow-hidden bg-[#f5f5f7] flex-shrink-0">
                                {car.image_urls?.[0] ? (
                                    <Image
                                        src={car.image_urls[0]} alt={`${car.brand} ${car.model}`}
                                        fill sizes="64px" className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[20px]">🚗</div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[14px] font-semibold tracking-tight">
                                    {car.brand} {car.model} {car.year}
                                </p>
                                <p className="text-[12px] text-[#6e6e73]">
                                    {car.price_per_day.toLocaleString('ru-RU')} ₸/день
                                    {car.location && ` · ${car.location}`}
                                </p>
                            </div>
                            <AdminStatusBadge status={car.status} />
                        </Link>
                    ))}
                </div>
                {!cars?.length && (
                    <p className="text-center py-16 text-[14px] text-[#aeaeb2]">Нет автомобилей</p>
                )}
            </div>
        </div>
    )
}