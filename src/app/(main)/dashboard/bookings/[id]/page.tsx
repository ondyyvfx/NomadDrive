import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getServerDict } from '@/lib/i18n.server'
import {
    ChevronLeft, Calendar, MapPin,
    CheckCircle2, Clock, XCircle, QrCode
} from 'lucide-react'
import { QRCodeWidget } from './QRCodeWidget'
import { CancelBookingButton } from './CancelBookingButton'
import { bookingVerifyUrl } from '@/lib/site'
import Image from 'next/image'

export default async function BookingDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()
    const { dash: t, common } = await getServerDict()

    const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
        pending: { label: t.stPendingFull, color: 'text-[#ff9f0a] bg-[#ff9f0a]/[0.08]', icon: <Clock size={14} /> },
        confirmed: { label: t.stConfirmedF, color: 'text-[#34c759] bg-[#34c759]/[0.08]', icon: <CheckCircle2 size={14} /> },
        active: { label: t.stActive, color: 'text-[#34c759] bg-[#34c759]/[0.08]', icon: <CheckCircle2 size={14} /> },
        completed: { label: t.stCompletedF, color: 'text-[#6b6b6b] bg-white/[0.05]', icon: <CheckCircle2 size={14} /> },
        cancelled: { label: t.stCancelledF, color: 'text-[#ff3b30] bg-[#ff3b30]/[0.08]', icon: <XCircle size={14} /> },
    }

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

    // QR кодирует рабочую ссылку на публичную проверку брони (открывается со смартфона)
    const qrData = bookingVerifyUrl(booking.id)

    return (
        <div className="max-w-[800px] mx-auto px-5 py-10">

            <div className="flex items-center gap-2 mb-8 fade-in">
                <Link
                    href="/dashboard/bookings"
                    className="inline-flex items-center gap-1.5 text-[14px] text-[#6b6b6b] hover:text-[#f0ece4] transition-colors"
                >
                    <ChevronLeft size={16} />
                    {t.bookings}
                </Link>
                <span className="text-[#3d3d3d]">/</span>
                <span className="text-[14px] text-[#f0ece4] truncate">#{booking.id.slice(0, 8).toUpperCase()}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">

                <div className="flex flex-col gap-5">

                    <div className="bg-[#111111] border border-white/[0.07] rounded-[16px] p-6 fade-in">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div>
                                <p className="text-[13px] text-[#6b6b6b] mb-1">{t.bookingNumber}</p>
                                <p className="text-[20px] font-bold tracking-tight text-[#f0ece4]">
                                    #{booking.id.slice(0, 8).toUpperCase()}
                                </p>
                            </div>
                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-medium ${s.color}`}>
                                {s.icon}
                                {s.label}
                            </span>
                        </div>
                    </div>

                    {car && (
                        <div className="bg-[#111111] border border-white/[0.07] rounded-[16px] p-6 fade-in-up">
                            <h2 className="text-[15px] font-bold tracking-tight mb-4 text-[#f0ece4]">{t.carHeading}</h2>
                            <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 rounded-[12px] overflow-hidden bg-[#161616] flex-shrink-0">
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
                                    <p className="text-[17px] font-bold tracking-tight text-[#f0ece4]">
                                        {car.brand} {car.model}
                                    </p>
                                    <p className="text-[13px] text-[#6b6b6b]">{car.year} {t.yearSuffix}</p>
                                    {car.location && (
                                        <p className="text-[13px] text-[#6b6b6b] flex items-center gap-1 mt-0.5">
                                            <MapPin size={12} />
                                            {car.location}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-[#111111] border border-white/[0.07] rounded-[16px] p-6 fade-in-up">
                        <h2 className="text-[15px] font-bold tracking-tight mb-4 flex items-center gap-2 text-[#f0ece4]">
                            <Calendar size={16} className="text-[#c9a96e]" />
                            {t.rentDates}
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-[#161616] rounded-[12px] border border-white/[0.05]">
                                <p className="text-[11px] text-[#3d3d3d] uppercase tracking-wide mb-1">{t.checkIn}</p>
                                <p className="text-[16px] font-bold text-[#f0ece4]">
                                    {new Date(booking.start_date).toLocaleDateString(common.locale, {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="p-4 bg-[#161616] rounded-[12px] border border-white/[0.05]">
                                <p className="text-[11px] text-[#3d3d3d] uppercase tracking-wide mb-1">{t.checkOut}</p>
                                <p className="text-[16px] font-bold text-[#f0ece4]">
                                    {new Date(booking.end_date).toLocaleDateString(common.locale, {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                        <p className="text-[13px] text-[#6b6b6b] mt-3">
                            {t.totalDays} {days} {days === 1 ? t.dayOne : days < 5 ? t.dayFew : t.dayMany}
                        </p>
                    </div>

                    <div className="bg-[#111111] border border-white/[0.07] rounded-[16px] p-6 fade-in-up">
                        <h2 className="text-[15px] font-bold tracking-tight mb-4 text-[#f0ece4]">{t.payment}</h2>
                        <div className="flex flex-col gap-2.5">
                            <div className="flex justify-between text-[14px]">
                                <span className="text-[#6b6b6b]">{t.rentCost}</span>
                                <span className="font-medium text-[#f0ece4]">
                                    {booking.total_price.toLocaleString(common.locale)} ₸
                                </span>
                            </div>
                            <div className="flex justify-between text-[14px]">
                                <span className="text-[#6b6b6b]">{t.paymentStatus}</span>
                                <span className={`font-medium ${booking.payment_status === 'paid'
                                    ? 'text-[#34c759]'
                                    : 'text-[#ff9f0a]'
                                    }`}>
                                    {booking.payment_status === 'paid' ? t.paid :
                                        booking.payment_status === 'refunded' ? t.refunded : t.unpaid}
                                </span>
                            </div>
                            <div className="h-px bg-white/[0.06] my-1" />
                            <div className="flex justify-between">
                                <span className="text-[15px] font-bold text-[#f0ece4]">{t.total}</span>
                                <span className="text-[15px] font-bold text-[#c9a96e]">
                                    {booking.total_price.toLocaleString(common.locale)} ₸
                                </span>
                            </div>
                        </div>
                    </div>

                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <CancelBookingButton bookingId={booking.id} />
                    )}

                </div>

                <div className="flex flex-col gap-5">
                    <div className="bg-[#111111] border border-white/[0.07] rounded-[16px] p-6 fade-in scale-in">
                        <div className="flex items-center gap-2 mb-4">
                            <QrCode size={16} className="text-[#c9a96e]" />
                            <h2 className="text-[15px] font-bold tracking-tight text-[#f0ece4]">{t.qrTitle}</h2>
                        </div>
                        <QRCodeWidget data={qrData} bookingId={booking.id} />
                        <p className="text-[12px] text-[#3d3d3d] text-center mt-3 leading-relaxed">
                            {t.qrHint}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}
