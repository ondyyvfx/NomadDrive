import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { AdminStatusBadge } from '../AdminStatusBadge'

export const metadata = { title: 'Admin — Продажа авто' }

export default async function AdminSalePage() {
    const supabase = await createClient()
    const { data: cars } = await supabase
        .from('cars_for_sale')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-[1000px]">
            <div className="flex items-center justify-between mb-8 fade-in">
                <div>
                    <h1 className="text-2xl font-bold tracking-[-0.04em] text-[#f0ece4]">Продажа авто</h1>
                    <p className="text-[14px] text-[#6b6b6b] mt-1">Всего: {cars?.length ?? 0}</p>
                </div>
                <Link
                    href="/admin/sale/new"
                    className="inline-flex items-center gap-2 h-10 px-5 bg-[#c9a96e] text-[#0a0a0a] text-[14px] font-semibold rounded-[10px] hover:bg-[#d4b87a] transition-colors"
                >
                    <Plus size={16} />
                    Добавить
                </Link>
            </div>

            <div className="bg-[#111111] border border-white/[0.07] rounded-[16px] overflow-hidden fade-in">
                <div className="divide-y divide-white/[0.05]">
                    {cars?.map(car => (
                        <Link
                            key={car.id}
                            href={`/admin/sale/${car.id}`}
                            className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors"
                        >
                            <div className="relative w-16 h-12 rounded-[8px] overflow-hidden bg-[#161616] flex-shrink-0">
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
                                <p className="text-[14px] font-semibold tracking-tight text-[#f0ece4]">
                                    {car.brand} {car.model} {car.year}
                                </p>
                                <p className="text-[12px] text-[#6b6b6b]">
                                    {car.price.toLocaleString('ru-RU')} ₸
                                    · {car.mileage.toLocaleString('ru-RU')} км
                                    {car.location && ` · ${car.location}`}
                                </p>
                            </div>
                            <AdminStatusBadge status={car.status} />
                        </Link>
                    ))}
                </div>
                {!cars?.length && (
                    <p className="text-center py-16 text-[14px] text-[#3d3d3d]">Нет автомобилей</p>
                )}
            </div>
        </div>
    )
}
