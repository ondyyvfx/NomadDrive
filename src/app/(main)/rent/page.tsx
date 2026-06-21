import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getServerDict } from '@/lib/i18n.server'
import { CatalogClient } from './CatalogClient'

export const metadata = {
    title: 'Аренда автомобилей',
}

export default async function CatalogPage() {
    const supabase = await createClient()
    const { rent: t } = await getServerDict()

    const { data: cars } = await supabase
        .from('cars_for_rent')
        .select('*')
        .order('created_at', { ascending: false })

    const brands = [...new Set((cars ?? []).map(c => c.brand))].sort()
    const cities = [...new Set(
        (cars ?? [])
            .map(c => (c.location ?? '').split(',')[0].trim())
            .filter(Boolean)
    )].sort()

    return (
        <div className="max-w-[1200px] mx-auto px-5 py-10">
            <div className="mb-8 fade-in">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
                    {t.title}
                </h1>
                <p className="text-[#6b6b6b] text-[16px]">
                    {cars?.length ?? 0} {t.available}
                </p>
            </div>

            <Suspense fallback={null}>
                <CatalogClient cars={cars ?? []} brands={brands} cities={cities} />
            </Suspense>
        </div>
    )
}