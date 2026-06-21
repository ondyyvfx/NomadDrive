import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getServerDict } from '@/lib/i18n.server'
import {
    Calendar, ShoppingBag, User,
    ChevronRight, Clock, CheckCircle2, XCircle
} from 'lucide-react'

export async function generateMetadata() {
    const { dash: t } = await getServerDict()
    return { title: t.title }
}

export default async function DashboardPage() {
    const supabase = await createClient()
    const { dash: t, common } = await getServerDict()
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
        pending: { label: t.stPending, icon: <Clock size={13} />, color: 'text-[#ff9f0a] bg-[#ff9f0a]/[0.08]' },
        confirmed: { label: t.stConfirmedM, icon: <CheckCircle2 size={13} />, color: 'text-[#34c759] bg-[#34c759]/[0.08]' },
        active: { label: t.stActive, icon: <CheckCircle2 size={13} />, color: 'text-[#34c759] bg-[#34c759]/[0.08]' },
        completed: { label: t.stCompletedM, icon: <CheckCircle2 size={13} />, color: 'text-[#6b6b6b] bg-white/[0.05]' },
        cancelled: { label: t.stCancelledM, icon: <XCircle size={13} />, color: 'text-[#ff3b30] bg-[#ff3b30]/[0.08]' },
        delivered: { label: t.stDelivered, icon: <CheckCircle2 size={13} />, color: 'text-[#34c759] bg-[#34c759]/[0.08]' },
    }

    return (
        <div className="max-w-[1200px] mx-auto px-5 py-10">

            <div className="mb-10 fade-in">
                <h1 className="text-2xl md:text-3xl font-bold tracking-[-0.04em] mb-1 text-[#f0ece4]">
                    {t.greeting} {firstName} 👋
                </h1>
                <p className="text-[#6b6b6b] text-[15px]">{user.email}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 stagger-children">
                {[
                    {
                        href: '/dashboard/bookings',
                        icon: Calendar,
                        label: t.cardBookings,
                        value: bookingStats.total,
                        sub: bookingStats.active > 0 ? `${bookingStats.active} ${t.activeCount}` : t.noActive,
                        color: 'text-[#c9a96e] bg-[#c9a96e]/[0.07]',
                    },
                    {
                        href: '/dashboard/orders',
                        icon: ShoppingBag,
                        label: t.cardOrders,
                        value: orderStats.total,
                        sub: orderStats.pending > 0 ? `${orderStats.pending} ${t.processingCount}` : t.noNew,
                        color: 'text-[#b8860b] bg-[#b8860b]/[0.07]',
                    },
                    {
                        href: '/dashboard/profile',
                        icon: User,
                        label: t.cardProfile,
                        value: null,
                        sub: profile?.full_name ?? t.fillProfile,
                        color: 'text-[#8b6f47] bg-[#8b6f47]/[0.07]',
                    },
                ].map(({ href, icon: Icon, label, value, sub, color }) => (
                    <Link
                        key={href}
                        href={href}
                        className="group bg-[#111111] border border-white/[0.07] rounded-[16px] p-6 hover:shadow-lg hover:-translate-y-0.5 hover:border-white/[0.12] transition-all duration-300 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center flex-shrink-0 ${color}`}>
                                <Icon size={20} />
                            </div>
                            <div>
                                <p className="text-[14px] text-[#6b6b6b]">{label}</p>
                                <p className="text-[20px] font-bold tracking-tight text-[#f0ece4]">
                                    {value !== null ? value : ''}
                                </p>
                                <p className="text-[12px] text-[#3d3d3d]">{sub}</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-[#3d3d3d] group-hover:text-[#f0ece4] transition-colors" />
                    </Link>
                ))}
            </div>

            {bookings && bookings.length > 0 && (
                <div className="mb-8 fade-in-up">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[18px] font-bold tracking-tight text-[#f0ece4]">
                            {t.recentBookings}
                        </h2>
                        <Link
                            href="/dashboard/bookings"
                            className="text-[14px] text-[#c9a96e] hover:underline"
                        >
                            {t.all}
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
                                    className="bg-[#111111] border border-white/[0.07] rounded-[12px] p-4 flex items-center justify-between gap-4 hover:border-white/[0.12] hover:shadow-md transition-all duration-300 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#c9a96e]/[0.07] rounded-[10px] flex items-center justify-center flex-shrink-0">
                                            <Calendar size={18} className="text-[#c9a96e]" />
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-semibold tracking-tight text-[#f0ece4]">
                                                {car ? `${car.brand} ${car.model}` : t.carFallback}
                                            </p>
                                            <p className="text-[12px] text-[#6b6b6b]">
                                                {b.start_date} — {b.end_date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium ${s.color}`}>
                                            {s.icon}
                                            {s.label}
                                        </span>
                                        <p className="text-[14px] font-semibold hidden sm:block text-[#f0ece4]">
                                            {b.total_price.toLocaleString(common.locale)} ₸
                                        </p>
                                        <ChevronRight size={16} className="text-[#3d3d3d] group-hover:text-[#f0ece4] transition-colors" />
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}

            {orders && orders.length > 0 && (
                <div className="fade-in-up">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[18px] font-bold tracking-tight text-[#f0ece4]">
                            {t.recentOrders}
                        </h2>
                        <Link
                            href="/dashboard/orders"
                            className="text-[14px] text-[#c9a96e] hover:underline"
                        >
                            {t.all}
                        </Link>
                    </div>
                    <div className="flex flex-col gap-3">
                        {orders.map(o => {
                            const s = statusConfig[o.status] ?? statusConfig.pending
                            return (
                                <Link
                                    key={o.id}
                                    href={`/dashboard/orders/${o.id}`}
                                    className="bg-[#111111] border border-white/[0.07] rounded-[12px] p-4 flex items-center justify-between gap-4 hover:border-white/[0.12] hover:shadow-md transition-all duration-300 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#b8860b]/[0.07] rounded-[10px] flex items-center justify-center flex-shrink-0">
                                            <ShoppingBag size={18} className="text-[#b8860b]" />
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-semibold tracking-tight text-[#f0ece4]">
                                                {t.orderNo} #{o.id.slice(0, 8).toUpperCase()}
                                            </p>
                                            <p className="text-[12px] text-[#6b6b6b]">
                                                {new Date(o.created_at).toLocaleDateString(common.locale)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium ${s.color}`}>
                                            {s.icon}
                                            {s.label}
                                        </span>
                                        <p className="text-[14px] font-semibold hidden sm:block text-[#f0ece4]">
                                            {o.total.toLocaleString(common.locale)} ₸
                                        </p>
                                        <ChevronRight size={16} className="text-[#3d3d3d] group-hover:text-[#f0ece4] transition-colors" />
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
