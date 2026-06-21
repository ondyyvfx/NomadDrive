'use client'

import Link from 'next/link'
import { CheckCircle2, XCircle, Clock, Calendar, Car, ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export interface VerifiedBooking {
    id: string
    brand: string
    model: string
    year: number
    start_date: string
    end_date: string
    status: string
    payment_status: string
    total_price: number
}

const T = {
    ru: {
        title: 'Проверка брони',
        valid: 'Бронь действительна',
        invalid: 'Бронь не найдена',
        invalid_sub: 'Проверьте ссылку или QR-код. Возможно, бронь была удалена.',
        car: 'Автомобиль',
        dates: 'Даты аренды',
        from: 'Заезд',
        to: 'Выезд',
        total: 'Сумма',
        number: 'Номер брони',
        payment: 'Оплата',
        pay_paid: 'Оплачено',
        pay_unpaid: 'Ожидает оплаты',
        pay_refunded: 'Возвращено',
        home: 'На главную',
        note: 'Эту страницу открывает QR-код брони — покажите её при получении автомобиля.',
        st_pending: 'Ожидает подтверждения',
        st_confirmed: 'Подтверждена',
        st_active: 'Активна',
        st_completed: 'Завершена',
        st_cancelled: 'Отменена',
        locale: 'ru-RU',
    },
    kz: {
        title: 'Броньды тексеру',
        valid: 'Бронь жарамды',
        invalid: 'Бронь табылмады',
        invalid_sub: 'Сілтемені немесе QR-кодты тексеріңіз. Бронь жойылған болуы мүмкін.',
        car: 'Автокөлік',
        dates: 'Жалдау күндері',
        from: 'Кіру',
        to: 'Шығу',
        total: 'Сома',
        number: 'Бронь нөмірі',
        payment: 'Төлем',
        pay_paid: 'Төленген',
        pay_unpaid: 'Төлем күтілуде',
        pay_refunded: 'Қайтарылды',
        home: 'Басты бетке',
        note: 'Бұл бетті бронь QR-коды ашады — автокөлікті алу кезінде көрсетіңіз.',
        st_pending: 'Растауды күтуде',
        st_confirmed: 'Расталған',
        st_active: 'Белсенді',
        st_completed: 'Аяқталған',
        st_cancelled: 'Бас тартылған',
        locale: 'kk-KZ',
    },
}

export function BookingVerifyCard({ booking }: { booking: VerifiedBooking | null }) {
    const { lang } = useLanguage()
    const t = T[lang]

    if (!booking) {
        return (
            <div className="max-w-[560px] mx-auto px-5 py-16">
                <div className="bg-[#111111] border border-white/[0.07] rounded-[20px] p-8 text-center fade-in">
                    <div className="w-16 h-16 rounded-full bg-[#ff3b30]/[0.1] flex items-center justify-center mx-auto mb-5">
                        <XCircle size={30} className="text-[#ff3b30]" />
                    </div>
                    <h1 className="text-[22px] font-bold tracking-tight text-[#f0ece4] mb-2">{t.invalid}</h1>
                    <p className="text-[14px] text-[#6b6b6b] mb-6">{t.invalid_sub}</p>
                    <Link
                        href="/"
                        className="inline-flex h-10 px-6 items-center bg-[#c9a96e] text-[#0a0a0a] text-[14px] font-semibold rounded-[10px] hover:bg-[#d4b87a] transition-colors"
                    >
                        {t.home}
                    </Link>
                </div>
            </div>
        )
    }

    const cancelled = booking.status === 'cancelled'
    const pending = booking.status === 'pending'

    const statusLabels: Record<string, string> = {
        pending: t.st_pending,
        confirmed: t.st_confirmed,
        active: t.st_active,
        completed: t.st_completed,
        cancelled: t.st_cancelled,
    }
    const payLabels: Record<string, string> = {
        paid: t.pay_paid,
        unpaid: t.pay_unpaid,
        refunded: t.pay_refunded,
    }

    const accent = cancelled ? '#ff3b30' : pending ? '#ff9f0a' : '#34c759'
    const HeroIcon = cancelled ? XCircle : pending ? Clock : CheckCircle2
    const days = Math.max(
        1,
        Math.ceil((new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / 86400000)
    )
    const fmt = (d: string) =>
        new Date(d).toLocaleDateString(t.locale, { day: 'numeric', month: 'long', year: 'numeric' })

    return (
        <div className="max-w-[560px] mx-auto px-5 py-12">
            <div className="bg-[#111111] border border-white/[0.07] rounded-[20px] overflow-hidden fade-in">

                {/* Шапка со статусом */}
                <div className="px-7 py-8 text-center border-b border-white/[0.06]" style={{ background: `${accent}0d` }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${accent}1a` }}>
                        <HeroIcon size={32} style={{ color: accent }} />
                    </div>
                    <h1 className="text-[24px] font-bold tracking-tight text-[#f0ece4]">
                        {cancelled ? statusLabels.cancelled : t.valid}
                    </h1>
                    <span
                        className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-[13px] font-medium"
                        style={{ background: `${accent}1a`, color: accent }}
                    >
                        <ShieldCheck size={13} />
                        {statusLabels[booking.status] ?? booking.status}
                    </span>
                </div>

                <div className="p-7 flex flex-col gap-5">
                    {/* Авто */}
                    <Row icon={<Car size={16} className="text-[#c9a96e]" />} label={t.car}>
                        <p className="text-[16px] font-bold text-[#f0ece4]">{booking.brand} {booking.model}</p>
                        {booking.year > 0 && <p className="text-[13px] text-[#6b6b6b]">{booking.year}</p>}
                    </Row>

                    {/* Даты */}
                    <Row icon={<Calendar size={16} className="text-[#c9a96e]" />} label={t.dates}>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-[#161616] rounded-[10px] border border-white/[0.05]">
                                <p className="text-[11px] text-[#3d3d3d] uppercase tracking-wide mb-0.5">{t.from}</p>
                                <p className="text-[14px] font-semibold text-[#f0ece4]">{fmt(booking.start_date)}</p>
                            </div>
                            <div className="p-3 bg-[#161616] rounded-[10px] border border-white/[0.05]">
                                <p className="text-[11px] text-[#3d3d3d] uppercase tracking-wide mb-0.5">{t.to}</p>
                                <p className="text-[14px] font-semibold text-[#f0ece4]">{fmt(booking.end_date)}</p>
                            </div>
                        </div>
                        <p className="text-[12px] text-[#6b6b6b] mt-2">{days} {lang === 'ru' ? 'дн.' : 'күн'}</p>
                    </Row>

                    {/* Оплата + сумма */}
                    <div className="flex items-center justify-between pt-1">
                        <div>
                            <p className="text-[12px] text-[#6b6b6b] mb-0.5">{t.payment}</p>
                            <p className="text-[14px] font-medium" style={{ color: booking.payment_status === 'paid' ? '#34c759' : '#ff9f0a' }}>
                                {payLabels[booking.payment_status] ?? booking.payment_status}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[12px] text-[#6b6b6b] mb-0.5">{t.total}</p>
                            <p className="text-[18px] font-bold text-[#c9a96e]">{booking.total_price.toLocaleString(t.locale)} ₸</p>
                        </div>
                    </div>

                    <div className="h-px bg-white/[0.06]" />

                    <div className="flex items-center justify-between">
                        <span className="text-[12px] text-[#6b6b6b]">{t.number}</span>
                        <span className="text-[14px] font-mono font-semibold text-[#f0ece4]">#{booking.id.slice(0, 8).toUpperCase()}</span>
                    </div>

                    <p className="text-[12px] text-[#3d3d3d] text-center leading-relaxed">{t.note}</p>
                </div>
            </div>
        </div>
    )
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-2">
                {icon}
                <span className="text-[13px] font-semibold text-[#f0ece4]">{label}</span>
            </div>
            {children}
        </div>
    )
}
