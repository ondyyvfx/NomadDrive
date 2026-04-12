import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminPartForm } from './AdminPartForm'

export default async function AdminPartEditPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    const isNew = id === 'new'
    const part = isNew ? null : await supabase
        .from('parts')
        .select('*')
        .eq('id', id)
        .single()
        .then(r => r.data)

    if (!isNew && !part) notFound()

    return (
        <div className="max-w-[700px]">
            <h1 className="text-2xl font-semibold tracking-tight mb-8 fade-in">
                {isNew ? 'Новая запчасть' : part?.name}
            </h1>
            <AdminPartForm part={part} />
        </div>
    )
}