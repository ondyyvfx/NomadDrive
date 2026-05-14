import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { AdminStatusBadge } from '../AdminStatusBadge'

export const metadata = { title: 'Admin — Брони' }

export default async function AdminBookingsPage() {
    const supabase = await createClient()

    const { data: bookings } = await supabase
        .from('bookings')
        .select('*, car:cars_for_rent(brand, model), profile:profiles(full_name, phone)')
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-[1000px]">
            <div className="mb-8 fade-in">
                <h1 className="text-2xl font-bold tracking-[-0.04em] text-[#f0ece4]">Бронирования</h1>
                <p className="text-[14px] text-[#6b6b6b] mt-1">
                    Всего: {bookings?.length ?? 0}
                </p>
            </div>

            <div className="bg-[#111111] border border-white/[0.07] rounded-[16px] overflow-hidden fade-in">
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                {['ID', 'Клиент', 'Автомобиль', 'Даты', 'Сумма', 'Статус'].map(h => (
                                    <th key={h} className="text-left px-5 py-3.5 text-[12px] font-semibold text-[#6b6b6b] uppercase tracking-wide">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05]">
                            {bookings?.map(b => {
                                const car = b.car as { brand: string; model: string } | null
                                const profile = b.profile as { full_name: string | null; phone: string | null } | null
                                return (
                                    <tr key={b.id} className="hover:bg-white/[0.03] transition-colors">
                                        <td className="px-5 py-3.5">
                                            <Link
                                                href={`/dashboard/bookings/${b.id}`}
                                                className="text-[13px] font-mono text-[#c9a96e] hover:underline"
                                            >
                                                #{b.id.slice(0, 8).toUpperCase()}
                                            </Link>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <p className="text-[13px] font-medium text-[#f0ece4]">{profile?.full_name ?? '—'}</p>
                                            <p className="text-[11px] text-[#3d3d3d]">{profile?.phone ?? '—'}</p>
                                        </td>
                                        <td className="px-5 py-3.5 text-[13px] text-[#f0ece4]">
                                            {car ? `${car.brand} ${car.model}` : '—'}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <p className="text-[12px] text-[#6b6b6b]">{b.start_date}</p>
                                            <p className="text-[12px] text-[#6b6b6b]">{b.end_date}</p>
                                        </td>
                                        <td className="px-5 py-3.5 text-[13px] font-semibold text-[#f0ece4]">
                                            {b.total_price.toLocaleString('ru-RU')} ₸
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <AdminStatusBadge status={b.status} />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-white/[0.05]">
                    {bookings?.map(b => {
                        const car = b.car as { brand: string; model: string } | null
                        const profile = b.profile as { full_name: string | null } | null
                        return (
                            <Link
                                key={b.id}
                                href={`/dashboard/bookings/${b.id}`}
                                className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.03] transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#c9a96e]/[0.07] rounded-[10px] flex items-center justify-center flex-shrink-0">
                                        <Calendar size={18} className="text-[#c9a96e]" />
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-semibold text-[#f0ece4]">
                                            {car ? `${car.brand} ${car.model}` : '—'}
                                        </p>
                                        <p className="text-[12px] text-[#6b6b6b]">
                                            {profile?.full_name ?? '—'} · {b.start_date}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <AdminStatusBadge status={b.status} />
                                    <p className="text-[13px] font-semibold text-[#f0ece4] mt-1">
                                        {b.total_price.toLocaleString('ru-RU')} ₸
                                    </p>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {!bookings?.length && (
                    <p className="text-center py-16 text-[14px] text-[#3d3d3d]">Нет бронирований</p>
                )}
            </div>
        </div>
    )
}
