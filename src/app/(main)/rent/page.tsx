import { createClient } from '@/lib/supabase/server'
import { CatalogClient } from './CatalogClient'

export const metadata = {
    title: 'Аренда автомобилей',
}

export default async function CatalogPage() {
    const supabase = await createClient()

    const { data: cars } = await supabase
        .from('cars_for_rent')
        .select('*')
        .order('created_at', { ascending: false })

    const brands = [...new Set((cars ?? []).map(c => c.brand))].sort()

    return (
        <div className="max-w-[1200px] mx-auto px-5 py-10">
            <div className="mb-8 fade-in">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
                    Аренда автомобилей
                </h1>
                <p className="text-[#6e6e73] text-[16px]">
                    {cars?.length ?? 0} автомобилей доступно прямо сейчас
                </p>
            </div>

            <CatalogClient cars={cars ?? []} brands={brands} />
        </div>
    )
}