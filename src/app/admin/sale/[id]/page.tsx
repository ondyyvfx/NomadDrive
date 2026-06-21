import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getServerDict } from '@/lib/i18n.server'
import { AdminSaleForm } from './AdminSaleForm'

export default async function AdminSaleEditPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()
    const { admin: t } = await getServerDict()

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
                {isNew ? t.newCar : `${car?.brand} ${car?.model}`}
            </h1>
            <AdminSaleForm car={car} />
        </div>
    )
}