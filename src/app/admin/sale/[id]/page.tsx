import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSaleForm } from './AdminSaleForm'

export default async function AdminSaleEditPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    const isNew = id === 'new'
    const car = isNew ? null : await supabase
        .from('cars_for_sale')
        .select('*')
        .eq('id', id)
        .single()
        .then(r => r.data)

    if (!isNew && !car) notFound()

    return (
        <div className="max-w-[700px]">
            <h1 className="text-2xl font-semibold tracking-tight mb-8 fade-in">
                {isNew ? 'Новый автомобиль' : `${car?.brand} ${car?.model}`}
            </h1>
            <AdminSaleForm car={car} />
        </div>
    )
}