import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
    Calendar, ShoppingBag, User,
    ChevronRight, Clock, CheckCircle2, XCircle
} from 'lucide-react'

export const metadata = { title: 'Личный кабинет' }

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login?redirect=/dashboard')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const [{ data: bookings }, { data: orders }] = await Promise.all([
        supabase
            .from('bookings')
            .select('id, status, total_price, start_date, end_date, car:cars_for_rent(brand, model)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(3),
        supabase
            .from('orders')
            .select('id, status, total, type, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(3),
    ])

    const firstName = profile?.full_name?.split(' ')[0] ?? user.email?.split('@')[0]

    const bookingStats = {
        total: bookings?.length ?? 0,
        active: bookings?.filter(b => b.status === 'active' || b.status === 'confirmed').length ?? 0,
    }

    const orderStats = {
        total: orders?.length ?? 0,
        pending: orders?.filter(o => o.status === 'pending').length ?? 0,
    }

    const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
        pending: { label: 'Ожидает', icon: <Clock size={13} />, color: 'text-[#ff9f0a] bg-[#ff9f0a]/[0.08]' },
        confirmed: { label: 'Подтверждён', icon: <CheckCircle2 size={13} />, color: 'text-[#34c759] bg-[#34c759]/[0.08]' },
        active: { label: 'Активна', icon: <CheckCircle2 size={13} />, color: 'text-[#34c759] bg-[#34c759]/[0.08]' },
        completed: { label: 'Завершён', icon: <CheckCircle2 size={13} />, color: 'text-[#6e6e73] bg-[#6e6e73]/[0.08]' },
        cancelled: { label: 'Отменён', icon: <XCircle size={13} />, color: 'text-[#ff3b30] bg-[#ff3b30]/[0.08]' },
        delivered: { label: 'Доставлен', icon: <CheckCircle2 size={13} />, color: 'text-[#34c759] bg-[#34c759]/[0.08]' },
    }

    return (
        <div className="max-w-[1200px] mx-auto px-5 py-10">

            {/* Приветствие */}
            <div className="mb-10 fade-in">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-1">
                    Привет, {firstName} 👋
                </h1>
                <p className="text-[#6e6e73] text-[15px]">{user.email}</p>
            </div>

            {/* Быстрые ссылки */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 stagger-children">
                {[
                    {
                        href: '/dashboard/bookings',
                        icon: Calendar,
                        label: 'Мои бронирования',
                        value: bookingStats.total,
                        sub: bookingStats.active > 0 ? `${bookingStats.active} активных` : 'Нет активных',
                        color: 'text-accent bg-accent/[0.07]',
                    },
                    {
                        href: '/dashboard/orders',
                        icon: ShoppingBag,
                        label: 'Мои заказы',
                        value: orderStats.total,
                        sub: orderStats.pending > 0 ? `${orderStats.pending} в обработке` : 'Нет новых',
                        color: 'text-[#b8860b] bg-[#b8860b]/[0.07]',
                    },
                    {
                        href: '/dashboard/profile',
                        icon: User,
                        label: 'Профиль',
                        value: null,
                        sub: profile?.full_name ?? 'Заполнить профиль',
                        color: 'text-[#8b6f47] bg-[#8b6f47]/[0.07]',
                    },
                ].map(({ href, icon: Icon, label, value, sub, color }) => (
                    <Link
                        key={href}
                        href={href}
                        className="group bg-white border border-black/[0.06] rounded-[16px] p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center flex-shrink-0 ${color}`}>
                                <Icon size={20} />
                            </div>
                            <div>
                                <p className="text-[14px] text-[#6e6e73]">{label}</p>
                                <p className="text-[20px] font-semibold tracking-tight text-[#1d1d1f]">
                                    {value !== null ? value : ''}
                                </p>
                                <p className="text-[12px] text-[#aeaeb2]">{sub}</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-[#aeaeb2] group-hover:text-[#1d1d1f] transition-colors" />
                    </Link>
                ))}
            </div>

            {/* Последние бронирования */}
            {bookings && bookings.length > 0 && (
                <div className="mb-8 fade-in-up">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[18px] font-semibold tracking-tight">
                            Последние бронирования
                        </h2>
                        <Link
                            href="/dashboard/bookings"
                            className="text-[14px] text-accent hover:underline"
                        >
                            Все →
                        </Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        {bookings.map(b => {
                            const s = statusConfig[b.status] ?? statusConfig.pending
                            const car = (Array.isArray(b.car) ? b.car[0] : b.car) as { brand: string; model: string } | null
                            return (
                                <Link
                                    key={b.id}
                                    href={`/dashboard/bookings/${b.id}`}
                                    className="bg-white border border-black/[0.06] rounded-[12px] p-4 flex items-center justify-between gap-4 hover:shadow-sm transition-all duration-200 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-accent/[0.07] rounded-[10px] flex items-center justify-center flex-shrink-0">
                                            <Calendar size={18} className="text-accent" />
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-semibold tracking-tight">
                                                {car ? `${car.brand} ${car.model}` : 'Автомобиль'}
                                            </p>
                                            <p className="text-[12px] text-[#6e6e73]">
                                                {b.start_date} — {b.end_date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium ${s.color}`}>
                                            {s.icon}
                                            {s.label}
                                        </span>
                                        <p className="text-[14px] font-semibold hidden sm:block">
                                            {b.total_price.toLocaleString('ru-RU')} ₸
                                        </p>
                                        <ChevronRight size={16} className="text-[#aeaeb2] group-hover:text-[#1d1d1f] transition-colors" />
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Последние заказы */}
            {orders && orders.length > 0 && (
                <div className="fade-in-up">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[18px] font-semibold tracking-tight">
                            Последние заказы
                        </h2>
                        <Link
                            href="/dashboard/orders"
                            className="text-[14px] text-accent hover:underline"
                        >
                            Все →
                        </Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        {orders.map(o => {
                            const s = statusConfig[o.status] ?? statusConfig.pending
                            return (
                                <Link
                                    key={o.id}
                                    href={`/dashboard/orders/${o.id}`}
                                    className="bg-white border border-black/[0.06] rounded-[12px] p-4 flex items-center justify-between gap-4 hover:shadow-sm transition-all duration-200 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#b8860b]/[0.07] rounded-[10px] flex items-center justify-center flex-shrink-0">
                                            <ShoppingBag size={18} className="text-[#b8860b]" />
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-semibold tracking-tight">
                                                Заказ #{o.id.slice(0, 8).toUpperCase()}
                                            </p>
                                            <p className="text-[12px] text-[#6e6e73]">
                                                {new Date(o.created_at).toLocaleDateString('ru-RU')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium ${s.color}`}>
                                            {s.icon}
                                            {s.label}
                                        </span>
                                        <p className="text-[14px] font-semibold hidden sm:block">
                                            {o.total.toLocaleString('ru-RU')} ₸
                                        </p>
                                        <ChevronRight size={16} className="text-[#aeaeb2] group-hover:text-[#1d1d1f] transition-colors" />
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}

        </div>
    )
}