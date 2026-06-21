import { createClient } from '@/lib/supabase/server'
import { getServerDict } from '@/lib/i18n.server'
import {
    Car, ShoppingBag, Wrench,
    Calendar, Package
} from 'lucide-react'
import Link from 'next/link'

export async function generateMetadata() {
    const { admin: t } = await getServerDict()
    return { title: `Admin — ${t.overview}` }
}

export default async function AdminPage() {
    const supabase = await createClient()
    const { admin: t, common } = await getServerDict()

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
        { label: t.statCarsRent, value: carsRentCount ?? 0, icon: Car, href: '/admin/cars', color: 'text-[#c9a96e] bg-[#c9a96e]/[0.07]' },
        { label: t.statCarsSale, value: carsSaleCount ?? 0, icon: ShoppingBag, href: '/admin/sale', color: 'text-[#b8860b] bg-[#b8860b]/[0.07]' },
        { label: t.statParts, value: partsCount ?? 0, icon: Wrench, href: '/admin/parts', color: 'text-[#8b6f47] bg-[#8b6f47]/[0.07]' },
        { label: t.statBookings, value: bookingsCount ?? 0, icon: Calendar, href: '/admin/bookings', color: 'text-[#5856d6] bg-[#5856d6]/[0.07]' },
        { label: t.statOrders, value: ordersCount ?? 0, icon: Package, href: '/admin/orders', color: 'text-[#ff9f0a] bg-[#ff9f0a]/[0.07]' },
    ]

    const statusColors: Record<string, string> = {
        pending: 'text-[#ff9f0a] bg-[#ff9f0a]/[0.08]',
        confirmed: 'text-[#34c759] bg-[#34c759]/[0.08]',
        active: 'text-[#34c759] bg-[#34c759]/[0.08]',
        completed: 'text-[#6b6b6b] bg-white/[0.05]',
        cancelled: 'text-[#ff3b30] bg-[#ff3b30]/[0.08]',
        delivered: 'text-[#34c759] bg-[#34c759]/[0.08]',
        shipped: 'text-[#c9a96e] bg-[#c9a96e]/[0.08]',
    }

    const statusLabels: Record<string, string> = {
        pending: t.stPending,
        confirmed: t.stConfirmed,
        active: t.stActive,
        completed: t.stCompleted,
        cancelled: t.stCancelled,
        delivered: t.stDelivered,
        shipped: t.stShipped,
    }

    return (
        <div className="max-w-[1000px]">

            <div className="mb-8 fade-in">
                <h1 className="text-2xl font-bold tracking-[-0.04em] mb-1 text-[#f0ece4]">{t.overview}</h1>
                <p className="text-[14px] text-[#6b6b6b]">
                    {new Date().toLocaleDateString(common.locale, { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10 stagger-children">
                {stats.map(({ label, value, icon: Icon, href, color }) => (
                    <Link
                        key={href}
                        href={href}
                        className="bg-[#111111] border border-white/[0.07] rounded-[14px] p-5 hover:shadow-lg hover:-translate-y-0.5 hover:border-white/[0.12] transition-all duration-300 group"
                    >
                        <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center mb-3 ${color}`}>
                            <Icon size={18} />
                        </div>
                        <p className="text-[24px] font-bold tracking-tight text-[#f0ece4]">{value}</p>
                        <p className="text-[12px] text-[#6b6b6b] mt-0.5">{label}</p>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div className="bg-[#111111] border border-white/[0.07] rounded-[16px] overflow-hidden fade-in-up">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                        <h2 className="text-[15px] font-bold tracking-tight text-[#f0ece4]">{t.recentBookings}</h2>
                        <Link href="/admin/bookings" className="text-[13px] text-[#c9a96e] hover:underline">
                            {t.all}
                        </Link>
                    </div>
                    <div className="divide-y divide-white/[0.05]">
                        {recentBookings?.length ? recentBookings.map(b => {
                            const car = Array.isArray(b.car) ? b.car[0] as { brand: string; model: string } | null : b.car as { brand: string; model: string } | null
                            return (
                                <Link
                                    key={b.id}
                                    href={`/dashboard/bookings/${b.id}`}
                                    className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.03] transition-colors"
                                >
                                    <div>
                                        <p className="text-[13px] font-medium text-[#f0ece4]">
                                            {car ? `${car.brand} ${car.model}` : t.carFallback}
                                        </p>
                                        <p className="text-[11px] text-[#3d3d3d]">
                                            {new Date(b.created_at).toLocaleDateString(common.locale)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusColors[b.status] ?? ''}`}>
                                            {statusLabels[b.status]}
                                        </span>
                                        <span className="text-[13px] font-semibold text-[#f0ece4]">
                                            {b.total_price.toLocaleString(common.locale)} ₸
                                        </span>
                                    </div>
                                </Link>
                            )
                        }) : (
                            <p className="px-5 py-8 text-center text-[13px] text-[#3d3d3d]">{t.noBookings}</p>
                        )}
                    </div>
                </div>

                <div className="bg-[#111111] border border-white/[0.07] rounded-[16px] overflow-hidden fade-in-up">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                        <h2 className="text-[15px] font-bold tracking-tight text-[#f0ece4]">{t.recentOrders}</h2>
                        <Link href="/admin/orders" className="text-[13px] text-[#c9a96e] hover:underline">
                            {t.all}
                        </Link>
                    </div>
                    <div className="divide-y divide-white/[0.05]">
                        {recentOrders?.length ? recentOrders.map(o => (
                            <Link
                                key={o.id}
                                href={`/dashboard/orders/${o.id}`}
                                className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.03] transition-colors"
                            >
                                <div>
                                    <p className="text-[13px] font-medium text-[#f0ece4]">
                                        #{o.id.slice(0, 8).toUpperCase()}
                                    </p>
                                    <p className="text-[11px] text-[#3d3d3d]">
                                        {new Date(o.created_at).toLocaleDateString(common.locale)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${statusColors[o.status] ?? ''}`}>
                                        {statusLabels[o.status]}
                                    </span>
                                    <span className="text-[13px] font-semibold text-[#f0ece4]">
                                        {o.total.toLocaleString(common.locale)} ₸
                                    </span>
                                </div>
                            </Link>
                        )) : (
                            <p className="px-5 py-8 text-center text-[13px] text-[#3d3d3d]">{t.noOrders}</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}
