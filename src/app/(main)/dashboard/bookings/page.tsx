import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Calendar, ChevronLeft, ChevronRight, Clock, CheckCircle2, XCircle } from 'lucide-react'

export const metadata = { title: 'Мои бронирования' }

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: 'Ожидает', color: 'text-[#ff9f0a] bg-[#ff9f0a]/[0.08]', icon: <Clock size={13} /> },
    confirmed: { label: 'Подтверждён', color: 'text-[#34c759] bg-[#34c759]/[0.08]', icon: <CheckCircle2 size={13} /> },
    active: { label: 'Активна', color: 'text-[#34c759] bg-[#34c759]/[0.08]', icon: <CheckCircle2 size={13} /> },
    completed: { label: 'Завершена', color: 'text-[#6e6e73] bg-[#6e6e73]/[0.08]', icon: <CheckCircle2 size={13} /> },
    cancelled: { label: 'Отменена', color: 'text-[#ff3b30] bg-[#ff3b30]/[0.08]', icon: <XCircle size={13} /> },
}

export default async function BookingsPage() {
    const supabase = await createClient()
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
                    className="inline-flex items-center gap-1.5 text-[14px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                >
                    <ChevronLeft size={16} />
                    Кабинет
                </Link>
                <span className="text-[#aeaeb2]">/</span>
                <span className="text-[14px]">Бронирования</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-8 fade-in">
                Мои бронирования
            </h1>

            {!bookings?.length ? (
                <div className="text-center py-20 fade-in">
                    <div className="w-16 h-16 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar size={28} className="text-[#aeaeb2]" />
                    </div>
                    <p className="text-[18px] font-semibold tracking-tight mb-2">Нет бронирований</p>
                    <p className="text-[14px] text-[#6e6e73] mb-6">Забронируйте автомобиль в каталоге аренды</p>
                    <Link
                        href="/rent"
                        className="inline-flex h-11 px-6 bg-accent text-white font-medium rounded-[10px] hover:bg-[#0a6e56] transition-colors items-center gap-2 text-[14px]"
                    >
                        Перейти в каталог
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
                                className="group bg-white border border-black/[0.06] rounded-[16px] p-5 flex items-center gap-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                            >
                                {/* Иконка */}
                                <div className="w-14 h-14 bg-accent/[0.07] rounded-[12px] flex items-center justify-center flex-shrink-0">
                                    <Calendar size={24} className="text-accent" />
                                </div>

                                {/* Инфо */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <p className="text-[16px] font-semibold tracking-tight">
                                            {car ? `${car.brand} ${car.model}` : 'Автомобиль'}
                                        </p>
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-medium ${s.color}`}>
                                            {s.icon}{s.label}
                                        </span>
                                    </div>
                                    <p className="text-[13px] text-[#6e6e73]">
                                        {new Date(b.start_date).toLocaleDateString('ru-RU')} —{' '}
                                        {new Date(b.end_date).toLocaleDateString('ru-RU')}
                                        <span className="ml-2 text-[#aeaeb2]">
                                            {days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}
                                        </span>
                                    </p>
                                </div>

                                {/* Цена */}
                                <div className="text-right flex-shrink-0">
                                    <p className="text-[17px] font-semibold tracking-tight">
                                        {b.total_price.toLocaleString('ru-RU')} ₸
                                    </p>
                                    <ChevronRight size={16} className="text-[#aeaeb2] group-hover:text-[#1d1d1f] transition-colors ml-auto mt-1" />
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}