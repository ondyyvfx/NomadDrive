import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getServerDict } from '@/lib/i18n.server'
import { Calendar, ChevronLeft, ChevronRight, Clock, CheckCircle2, XCircle } from 'lucide-react'

export async function generateMetadata() {
    const { dash: t } = await getServerDict()
    return { title: t.bookingsTitle }
}

export default async function BookingsPage() {
    const supabase = await createClient()
    const { dash: t, common } = await getServerDict()

    const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
        pending: { label: t.stPending, color: 'text-[#ff9f0a] bg-[#ff9f0a]/[0.08]', icon: <Clock size={13} /> },
        confirmed: { label: t.stConfirmedF, color: 'text-[#34c759] bg-[#34c759]/[0.08]', icon: <CheckCircle2 size={13} /> },
        active: { label: t.stActive, color: 'text-[#34c759] bg-[#34c759]/[0.08]', icon: <CheckCircle2 size={13} /> },
        completed: { label: t.stCompletedF, color: 'text-[#6b6b6b] bg-white/[0.05]', icon: <CheckCircle2 size={13} /> },
        cancelled: { label: t.stCancelledF, color: 'text-[#ff3b30] bg-[#ff3b30]/[0.08]', icon: <XCircle size={13} /> },
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login?redirect=/dashboard/bookings')

    const { data: bookings } = await supabase
        .from('bookings')
        .select('*, car:cars_for_rent(brand, model, image_urls)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-[1200px] mx-auto px-5 py-10">
            <div className="flex items-center gap-3 mb-8 fade-in">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 text-[14px] text-[#6b6b6b] hover:text-[#f0ece4] transition-colors"
                >
                    <ChevronLeft size={16} />
                    {t.dashboard}
                </Link>
                <span className="text-[#3d3d3d]">/</span>
                <span className="text-[14px] text-[#f0ece4]">{t.bookings}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-[-0.04em] mb-8 fade-in text-[#f0ece4]">
                {t.bookingsTitle}
            </h1>

            {!bookings?.length ? (
                <div className="text-center py-20 fade-in">
                    <div className="w-16 h-16 bg-[#161616] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar size={28} className="text-[#3d3d3d]" />
                    </div>
                    <p className="text-[18px] font-bold tracking-tight mb-2 text-[#f0ece4]">{t.noBookings}</p>
                    <p className="text-[14px] text-[#6b6b6b] mb-6">{t.noBookingsSub}</p>
                    <Link
                        href="/rent"
                        className="inline-flex h-11 px-6 bg-[#c9a96e] text-[#0a0a0a] font-semibold rounded-[10px] hover:bg-[#d4b87a] transition-colors items-center gap-2 text-[14px]"
                    >
                        {t.toRentCatalog}
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4 stagger-children">
                    {bookings.map(b => {
                        const s = statusConfig[b.status] ?? statusConfig.pending
                        const car = b.car as { brand: string; model: string; image_urls: string[] } | null
                        const days = Math.ceil(
                            (new Date(b.end_date).getTime() - new Date(b.start_date).getTime()) / 86400000
                        )
                        return (
                            <Link
                                key={b.id}
                                href={`/dashboard/bookings/${b.id}`}
                                className="group bg-[#111111] border border-white/[0.07] rounded-[16px] p-5 flex items-center gap-5 hover:shadow-lg hover:-translate-y-0.5 hover:border-white/[0.12] transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-[#c9a96e]/[0.07] rounded-[12px] flex items-center justify-center flex-shrink-0">
                                    <Calendar size={24} className="text-[#c9a96e]" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <p className="text-[16px] font-bold tracking-tight text-[#f0ece4]">
                                            {car ? `${car.brand} ${car.model}` : t.carFallback}
                                        </p>
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-medium ${s.color}`}>
                                            {s.icon}{s.label}
                                        </span>
                                    </div>
                                    <p className="text-[13px] text-[#6b6b6b]">
                                        {new Date(b.start_date).toLocaleDateString(common.locale)} —{' '}
                                        {new Date(b.end_date).toLocaleDateString(common.locale)}
                                        <span className="ml-2 text-[#3d3d3d]">
                                            {days} {days === 1 ? t.dayOne : days < 5 ? t.dayFew : t.dayMany}
                                        </span>
                                    </p>
                                </div>

                                <div className="text-right flex-shrink-0">
                                    <p className="text-[17px] font-bold tracking-tight text-[#f0ece4]">
                                        {b.total_price.toLocaleString(common.locale)} ₸
                                    </p>
                                    <ChevronRight size={16} className="text-[#3d3d3d] group-hover:text-[#f0ece4] transition-colors ml-auto mt-1" />
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
