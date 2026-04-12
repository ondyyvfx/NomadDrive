import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
    ChevronLeft, Calendar, MapPin,
    CheckCircle2, Clock, XCircle, QrCode
} from 'lucide-react'
import { QRCodeWidget } from './QRCodeWidget'
import { CancelBookingButton } from './CancelBookingButton'
import Image from 'next/image'

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: 'Ожидает подтверждения', color: 'text-[#ff9f0a] bg-[#ff9f0a]/[0.08]', icon: <Clock size={14} /> },
    confirmed: { label: 'Подтверждена', color: 'text-[#34c759] bg-[#34c759]/[0.08]', icon: <CheckCircle2 size={14} /> },
    active: { label: 'Активна', color: 'text-[#34c759] bg-[#34c759]/[0.08]', icon: <CheckCircle2 size={14} /> },
    completed: { label: 'Завершена', color: 'text-[#6e6e73] bg-[#6e6e73]/[0.08]', icon: <CheckCircle2 size={14} /> },
    cancelled: { label: 'Отменена', color: 'text-[#ff3b30] bg-[#ff3b30]/[0.08]', icon: <XCircle size={14} /> },
}

export default async function BookingDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: booking } = await supabase
        .from('bookings')
        .select('*, car:cars_for_rent(*)')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (!booking) notFound()

    const s = statusConfig[booking.status] ?? statusConfig.pending
    const car = booking.car as {
        brand: string
        model: string
        year: number
        location: string | null
        image_urls: string[]
    } | null
    const days = Math.ceil(
        (new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / 86400000
    )

    // QR данные
    const qrData = JSON.stringify({
        booking_id: booking.id,
        car: car ? `${car.brand} ${car.model}` : '',
        start: booking.start_date,
        end: booking.end_date,
        total: booking.total_price,
    })

    return (
        <div className="max-w-[800px] mx-auto px-5 py-10">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8 fade-in">
                <Link
                    href="/dashboard/bookings"
                    className="inline-flex items-center gap-1.5 text-[14px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                >
                    <ChevronLeft size={16} />
                    Бронирования
                </Link>
                <span className="text-[#aeaeb2]">/</span>
                <span className="text-[14px] truncate">#{booking.id.slice(0, 8).toUpperCase()}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">

                {/* Левая колонка */}
                <div className="flex flex-col gap-5">

                    {/* Статус */}
                    <div className="bg-white border border-black/[0.06] rounded-[16px] p-6 fade-in">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div>
                                <p className="text-[13px] text-[#6e6e73] mb-1">Номер брони</p>
                                <p className="text-[20px] font-semibold tracking-tight">
                                    #{booking.id.slice(0, 8).toUpperCase()}
                                </p>
                            </div>
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-medium ${s.color}`}>
                                {s.icon}
                                {s.label}
                            </span>
                        </div>
                    </div>

                    {/* Авто */}
                    {car && (
                        <div className="bg-white border border-black/[0.06] rounded-[16px] p-6 fade-in-up">
                            <h2 className="text-[15px] font-semibold tracking-tight mb-4">Автомобиль</h2>
                            <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 rounded-[12px] overflow-hidden bg-[#f5f5f7] flex-shrink-0">
                                    {car.image_urls?.[0] ? (
                                        <Image
                                            src={car.image_urls[0]}
                                            alt={`${car.brand} ${car.model}`}
                                            fill
                                            sizes="64px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[28px]">
                                            🚗
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-[17px] font-semibold tracking-tight">
                                        {car.brand} {car.model}
                                    </p>
                                    <p className="text-[13px] text-[#6e6e73]">{car.year} год</p>
                                    {car.location && (
                                        <p className="text-[13px] text-[#6e6e73] flex items-center gap-1 mt-0.5">
                                            <MapPin size={12} />
                                            {car.location}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Даты */}
                    <div className="bg-white border border-black/[0.06] rounded-[16px] p-6 fade-in-up">
                        <h2 className="text-[15px] font-semibold tracking-tight mb-4 flex items-center gap-2">
                            <Calendar size={16} className="text-accent" />
                            Даты аренды
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-[#f5f5f7] rounded-[12px]">
                                <p className="text-[11px] text-[#aeaeb2] uppercase tracking-wide mb-1">Заезд</p>
                                <p className="text-[16px] font-semibold">
                                    {new Date(booking.start_date).toLocaleDateString('ru-RU', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="p-4 bg-[#f5f5f7] rounded-[12px]">
                                <p className="text-[11px] text-[#aeaeb2] uppercase tracking-wide mb-1">Выезд</p>
                                <p className="text-[16px] font-semibold">
                                    {new Date(booking.end_date).toLocaleDateString('ru-RU', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                        <p className="text-[13px] text-[#6e6e73] mt-3">
                            Итого: {days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}
                        </p>
                    </div>

                    {/* Оплата */}
                    <div className="bg-white border border-black/[0.06] rounded-[16px] p-6 fade-in-up">
                        <h2 className="text-[15px] font-semibold tracking-tight mb-4">Оплата</h2>
                        <div className="flex flex-col gap-2.5">
                            <div className="flex justify-between text-[14px]">
                                <span className="text-[#6e6e73]">
                                    Стоимость аренды
                                </span>
                                <span className="font-medium">
                                    {booking.total_price.toLocaleString('ru-RU')} ₸
                                </span>
                            </div>
                            <div className="flex justify-between text-[14px]">
                                <span className="text-[#6e6e73]">Статус оплаты</span>
                                <span className={`font-medium ${booking.payment_status === 'paid'
                                    ? 'text-[#34c759]'
                                    : 'text-[#ff9f0a]'
                                    }`}>
                                    {booking.payment_status === 'paid' ? 'Оплачено' :
                                        booking.payment_status === 'refunded' ? 'Возвращено' : 'Ожидает оплаты'}
                                </span>
                            </div>
                            <div className="h-px bg-black/[0.06] my-1" />
                            <div className="flex justify-between">
                                <span className="text-[15px] font-semibold">Итого</span>
                                <span className="text-[15px] font-semibold text-accent">
                                    {booking.total_price.toLocaleString('ru-RU')} ₸
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Отмена */}
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <CancelBookingButton bookingId={booking.id} />
                    )}

                </div>

                {/* Правая колонка — QR */}
                <div className="flex flex-col gap-5">
                    <div className="bg-white border border-black/[0.06] rounded-[16px] p-6 fade-in scale-in">
                        <div className="flex items-center gap-2 mb-4">
                            <QrCode size={16} className="text-accent" />
                            <h2 className="text-[15px] font-semibold tracking-tight">QR-код брони</h2>
                        </div>
                        <QRCodeWidget data={qrData} bookingId={booking.id} />
                        <p className="text-[12px] text-[#aeaeb2] text-center mt-3 leading-relaxed">
                            Покажите QR-код при получении автомобиля
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}