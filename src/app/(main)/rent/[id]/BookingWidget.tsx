'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, ChevronRight, Info } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { CarForRent } from '@/types'
import type { User } from '@supabase/supabase-js'

interface Props {
    car: CarForRent
    user: User | null
}

export function BookingWidget({ car, user }: Props) {
    const router = useRouter()
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [promoCode, setPromoCode] = useState('')
    const [promoApplied, setPromoApplied] = useState<{ discount: number; type: string } | null>(null)
    const [promoLoading, setPromoLoading] = useState(false)
    const [promoError, setPromoError] = useState('')

    const today = new Date().toISOString().split('T')[0]

    // Считаем дни и цену
    const days = startDate && endDate
        ? Math.max(0, Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000
        ))
        : 0

    const basePrice = days * car.price_per_day
    const discount = promoApplied
        ? promoApplied.type === 'percent'
            ? Math.round(basePrice * promoApplied.discount / 100)
            : promoApplied.discount
        : 0
    const totalPrice = Math.max(0, basePrice - discount)

    async function applyPromo() {
        if (!promoCode.trim()) return
        setPromoLoading(true)
        setPromoError('')
        setPromoApplied(null)

        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('promo_codes')
                .select('*')
                .eq('code', promoCode.trim().toUpperCase())
                .eq('is_active', true)
                .single()

            if (error || !data) throw new Error('Промокод не найден')

            if (data.expires_at && new Date(data.expires_at) < new Date()) {
                throw new Error('Промокод истёк')
            }
            if (data.max_uses && data.used_count >= data.max_uses) {
                throw new Error('Промокод исчерпан')
            }

            setPromoApplied({ discount: data.value, type: data.type })
        } catch (err: unknown) {
            setPromoError(err instanceof Error ? err.message : 'Ошибка')
        } finally {
            setPromoLoading(false)
        }
    }

    async function handleBooking() {
        if (!user) {
            router.push(`/login?redirect=/cars/${car.id}`)
            return
        }

        if (!startDate || !endDate) {
            setError('Выберите даты аренды')
            return
        }

        if (days < 1) {
            setError('Минимальный срок аренды — 1 день')
            return
        }

        setLoading(true)
        setError('')

        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('bookings')
                .insert({
                    user_id: user.id,
                    car_id: car.id,
                    start_date: startDate,
                    end_date: endDate,
                    total_price: totalPrice,
                    status: 'pending',
                    payment_status: 'unpaid',
                })
                .select()
                .single()

            if (error) throw error
            router.push(`/dashboard/bookings/${data.id}`)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Ошибка бронирования')
        } finally {
            setLoading(false)
        }
    }

    const isAvailable = car.status === 'available'

    return (
        <div className="bg-white border border-black/[0.08] rounded-[20px] shadow-md overflow-hidden scale-in">

            {/* Header */}
            <div className="px-6 pt-6 pb-5 border-b border-black/[0.06]">
                <div className="flex items-baseline justify-between">
                    <div>
                        <span className="text-[26px] font-semibold tracking-tight">
                            {car.price_per_day.toLocaleString('ru-RU')} ₸
                        </span>
                        <span className="text-[14px] text-[#6e6e73] ml-1">/ день</span>
                    </div>
                    {days > 0 && (
                        <span className="text-[13px] text-[#6e6e73]">
                            {days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}
                        </span>
                    )}
                </div>
            </div>

            <div className="p-6 flex flex-col gap-5">

                {/* Даты */}
                <div>
                    <p className="text-[13px] font-medium text-[#6e6e73] mb-2">Даты аренды</p>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] text-[#aeaeb2] uppercase tracking-wide">Заезд</label>
                            <input
                                type="date"
                                value={startDate}
                                min={today}
                                onChange={e => {
                                    setStartDate(e.target.value)
                                    if (endDate && e.target.value >= endDate) setEndDate('')
                                    setError('')
                                }}
                                className="w-full h-11 px-3 bg-[#f5f5f7] border border-black/[0.08] rounded-[10px] text-[14px] text-[#1d1d1f] outline-none focus:border-accent focus:ring-3 focus:ring-[#0a5f4a]/[0.08] focus:bg-white transition-all cursor-pointer"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[11px] text-[#aeaeb2] uppercase tracking-wide">Выезд</label>
                            <input
                                type="date"
                                value={endDate}
                                min={startDate || today}
                                onChange={e => { setEndDate(e.target.value); setError('') }}
                                className="w-full h-11 px-3 bg-[#f5f5f7] border border-black/[0.08] rounded-[10px] text-[14px] text-[#1d1d1f] outline-none focus:border-accent focus:ring-3 focus:ring-[#0a5f4a]/[0.08] focus:bg-white transition-all cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Промокод */}
                {days > 0 && (
                    <div className="fade-in">
                        <p className="text-[13px] font-medium text-[#6e6e73] mb-2">Промокод</p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={promoCode}
                                onChange={e => {
                                    setPromoCode(e.target.value.toUpperCase())
                                    setPromoApplied(null)
                                    setPromoError('')
                                }}
                                placeholder="NOMAD2025"
                                className="flex-1 h-10 px-3.5 bg-[#f5f5f7] border border-black/[0.08] rounded-[10px] text-[14px] uppercase outline-none focus:border-accent focus:ring-3 focus:ring-[#0a5f4a]/[0.08] focus:bg-white transition-all placeholder:normal-case placeholder:text-[#aeaeb2]"
                            />
                            <button
                                onClick={applyPromo}
                                disabled={promoLoading || !promoCode.trim()}
                                className="h-10 px-4 bg-[#f5f5f7] border border-black/[0.08] rounded-[10px] text-[13px] font-medium text-[#1d1d1f] hover:bg-black/[0.04] transition-colors disabled:opacity-50"
                            >
                                {promoLoading ? '...' : 'Применить'}
                            </button>
                        </div>
                        {promoError && (
                            <p className="text-[12px] text-[#ff3b30] mt-1.5">{promoError}</p>
                        )}
                        {promoApplied && (
                            <p className="text-[12px] text-[#34c759] mt-1.5 flex items-center gap-1">
                                ✓ Промокод применён — скидка{' '}
                                {promoApplied.type === 'percent'
                                    ? `${promoApplied.discount}%`
                                    : `${promoApplied.discount.toLocaleString('ru-RU')} ₸`}
                            </p>
                        )}
                    </div>
                )}

                {/* Итог */}
                {days > 0 && (
                    <div className="bg-[#f5f5f7] rounded-[12px] p-4 flex flex-col gap-2 fade-in">
                        <div className="flex justify-between text-[14px]">
                            <span className="text-[#6e6e73]">
                                {car.price_per_day.toLocaleString('ru-RU')} ₸ × {days} дн.
                            </span>
                            <span className="font-medium">{basePrice.toLocaleString('ru-RU')} ₸</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-[14px]">
                                <span className="text-[#6e6e73]">Скидка</span>
                                <span className="text-[#34c759] font-medium">
                                    −{discount.toLocaleString('ru-RU')} ₸
                                </span>
                            </div>
                        )}
                        <div className="h-px bg-black/[0.06] my-1" />
                        <div className="flex justify-between">
                            <span className="text-[15px] font-semibold">Итого</span>
                            <span className="text-[15px] font-semibold text-accent">
                                {totalPrice.toLocaleString('ru-RU')} ₸
                            </span>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="flex items-start gap-2 px-3.5 py-2.5 bg-[#ff3b30]/[0.07] border border-[#ff3b30]/[0.15] rounded-[8px]">
                        <Info size={14} className="text-[#ff3b30] mt-0.5 flex-shrink-0" />
                        <p className="text-[13px] text-[#ff3b30]">{error}</p>
                    </div>
                )}

                {/* CTA */}
                <button
                    onClick={handleBooking}
                    disabled={loading || !isAvailable}
                    className="w-full h-12 bg-accent text-white font-semibold rounded-[12px] hover:bg-[#0a6e56] transition-all duration-200 flex items-center justify-center gap-2 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            {!isAvailable
                                ? 'Недоступен'
                                : !user
                                    ? 'Войти и забронировать'
                                    : 'Забронировать'}
                            {isAvailable && <ChevronRight size={16} />}
                        </>
                    )}
                </button>

                {/* Note */}
                <p className="text-[12px] text-[#aeaeb2] text-center leading-relaxed">
                    Бесплатная отмена за 24 часа до начала аренды
                </p>

            </div>
        </div>
    )
}