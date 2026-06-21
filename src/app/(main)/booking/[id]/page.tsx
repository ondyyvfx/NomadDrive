import { createClient } from '@/lib/supabase/server'
import { BookingVerifyCard, type VerifiedBooking } from './BookingVerifyCard'

export const metadata = { title: 'Проверка брони' }

/* Публичная страница проверки брони — её открывает QR-код.
   Данные берём через security-definer RPC verify_booking (работает и для
   неавторизованного сотрудника на выдаче). Если RPC ещё не накатан — мягкий
   откат на обычное чтение под RLS (владелец/админ). */
export default async function BookingVerifyPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    let booking: VerifiedBooking | null = null

    const { data: rows } = await supabase.rpc('verify_booking', { p_id: id })
    if (Array.isArray(rows) && rows.length > 0) {
        const r = rows[0]
        booking = {
            id: r.id,
            brand: r.brand,
            model: r.model,
            year: r.year,
            start_date: r.start_date,
            end_date: r.end_date,
            status: r.status,
            payment_status: r.payment_status,
            total_price: Number(r.total_price),
        }
    }

    if (!booking) {
        // откат: авторизованное чтение (если RPC недоступна)
        const { data } = await supabase
            .from('bookings')
            .select('id, start_date, end_date, status, payment_status, total_price, car:cars_for_rent(brand, model, year)')
            .eq('id', id)
            .maybeSingle()
        if (data) {
            const car = (Array.isArray(data.car) ? data.car[0] : data.car) as
                { brand: string; model: string; year: number } | null
            booking = {
                id: data.id,
                brand: car?.brand ?? '',
                model: car?.model ?? '',
                year: car?.year ?? 0,
                start_date: data.start_date,
                end_date: data.end_date,
                status: data.status,
                payment_status: data.payment_status,
                total_price: Number(data.total_price),
            }
        }
    }

    return <BookingVerifyCard booking={booking} />
}
