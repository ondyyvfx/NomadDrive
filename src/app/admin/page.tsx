import { createClient } from '@/lib/supabase/server'
import {
    Car, ShoppingBag, Wrench,
    Calendar, Package, TrendingUp
} from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Admin — Обзор' }

export default async function AdminPage() {
    const supabase = await createClient()

    const [
        { count: carsRentCount },
        { count: carsSaleCount },
        { count: partsCount },
        { count: bookingsCount },
        { count: ordersCount },
        { data: recentBookings },
        { data: recentOrders },
    ] = await Promise.all([
        supabase.from('cars_for_rent').select('*', { count: 'exact', head: true }),
        supabase.from('cars_for_sale').select('*', { count: 'exact', head: true }),
        supabase.from('parts').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase
            .from('bookings')
            .select('id, status, total_price, created_at, car:cars_for_rent(brand, model)')
            .order('created_at', { ascending: false })
            .limit(5),
        supabase
            .from('orders')
            .select('id, status, total, type, created_at')
            .order('created_at', { ascending: false })
            .limit(5),
    ])

    const stats = [
        { label: 'Авто в аренде', value: carsRentCount ?? 0, icon: Car, href: '/admin/cars', color: 'text-accent bg-accent/[0.07]' },
        { label: 'Авто на продажу', value: carsSaleCount ?? 0, icon: ShoppingBag, href: '/admin/sale', color: 'text-[#b8860b] bg-[#b8860b]/[0.07]' },
        { label: 'Запчасти', value: partsCount ?? 0, icon: Wrench, href: '/admin/parts', color: 'text-[#8b6f47] bg-[#8b6f47]/[0.07]' },
        { label: 'Бронирований', value: bookingsCount ?? 0, icon: Calendar, href: '/admin/bookings', color: 'text-[#5856d6] bg-[#5856d6]/[0.07]' },
        { label: 'Заказов', value: ordersCount ?? 0, icon: Package, href: '/admin/orders', color: 'text-[#ff9f0a] bg-[#ff9f0a]/[0.07]' },
    ]

    const statusColors: Record<string, string> = {
        pending: 'text-[#ff9f0a] bg-[#ff9f0a]/[0.08]',
        confirmed: 'text-[#34c759] bg-[#34c759]/[0.08]',
        active: 'text-[#34c759] bg-[#34c759]/[0.08]',
        completed: 'text-[#6e6e73] bg-[#6e6e73]/[0.08]',
        cancelled: 'text-[#ff3b30] bg-[#ff3b30]/[0.08]',
        delivered: 'text-[#34c759] bg-[#34c759]/[0.08]',
        shipped: 'text-accent bg-accent/[0.08]',
    }

    const statusLabels: Record<string, string> = {
        pending: 'Ожидает',
        confirmed: 'Подтверждён',
        active: 'Активна',
        completed: 'Завершён',
        cancelled: 'Отменён',
        delivered: 'Доставлен',
        shipped: 'В доставке',
    }

    return (
        <div className="max-w-[1000px]">

            <div className="mb-8 fade-in">
                <h1 className="text-2xl font-semibold tracking-tight mb-1">Обзор</h1>
                <p className="text-[14px] text-[#6e6e73]">
                    {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10 stagger-children">
                {stats.map(({ label, value, icon: Icon, href, color }) => (
                    <Link
                        key={href}
                        href={href}
                        className="bg-white border border-black/[0.06] rounded-[14px] p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                    >
                        <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center mb-3 ${color}`}>
                            <Icon size={18} />
                        </div>
                        <p className="text-[24px] font-semibold tracking-tight">{value}</p>
                        <p className="text-[12px] text-[#6e6e73] mt-0.5">{label}</p>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Последние брони */}
                <div className="bg-white border border-black/[0.06] rounded-[16px] overflow-hidden fade-in-up">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.06]">
                        <h2 className="text-[15px] font-semibold tracking-tight">Последние брони</h2>
                        <Link href="/admin/bookings" className="text-[13px] text-accent hover:underline">
                            Все →
                        </Link>
                    </div>
                    <div className="divide-y divide-black/[0.04]">
                        {recentBookings?.length ? recentBookings.map(b => {
                            const car = Array.isArray(b.car) ? b.car[0] as { brand: string; model: string } | null : b.car as { brand: string; model: string } | null
                            return (
                                <Link
                                    key={b.id}
                                    href={`/dashboard/bookings/${b.id}`}
                                    className="flex items-center justify-between px-5 py-3.5 hover:bg-[#f5f5f7] transition-colors"
                                >
                                    <div>
                                        <p className="text-[13px] font-medium">
                                            {car ? `${car.brand} ${car.model}` : 'Авто'}
                                        </p>
                                        <p className="text-[11px] text-[#aeaeb2]">
                                            {new Date(b.created_at).toLocaleDateString('ru-RU')}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusColors[b.status] ?? ''}`}>
                                            {statusLabels[b.status]}
                                        </span>
                                        <span className="text-[13px] font-semibold">
                                            {b.total_price.toLocaleString('ru-RU')} ₸
                                        </span>
                                    </div>
                                </Link>
                            )
                        }) : (
                            <p className="px-5 py-8 text-center text-[13px] text-[#aeaeb2]">Нет бронирований</p>
                        )}
                    </div>
                </div>

                {/* Последние заказы */}
                <div className="bg-white border border-black/[0.06] rounded-[16px] overflow-hidden fade-in-up">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.06]">
                        <h2 className="text-[15px] font-semibold tracking-tight">Последние заказы</h2>
                        <Link href="/admin/orders" className="text-[13px] text-accent hover:underline">
                            Все →
                        </Link>
                    </div>
                    <div className="divide-y divide-black/[0.04]">
                        {recentOrders?.length ? recentOrders.map(o => (
                            <Link
                                key={o.id}
                                href={`/dashboard/orders/${o.id}`}
                                className="flex items-center justify-between px-5 py-3.5 hover:bg-[#f5f5f7] transition-colors"
                            >
                                <div>
                                    <p className="text-[13px] font-medium">
                                        #{o.id.slice(0, 8).toUpperCase()}
                                    </p>
                                    <p className="text-[11px] text-[#aeaeb2]">
                                        {new Date(o.created_at).toLocaleDateString('ru-RU')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusColors[o.status] ?? ''}`}>
                                        {statusLabels[o.status]}
                                    </span>
                                    <span className="text-[13px] font-semibold">
                                        {o.total.toLocaleString('ru-RU')} ₸
                                    </span>
                                </div>
                            </Link>
                        )) : (
                            <p className="px-5 py-8 text-center text-[13px] text-[#aeaeb2]">Нет заказов</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}