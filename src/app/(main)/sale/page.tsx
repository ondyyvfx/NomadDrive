import { createClient } from '@/lib/supabase/server'
import { SaleClient } from './SaleClient'

export const metadata = { title: 'Продажа автомобилей' }

export default async function SalePage() {
    const supabase = await createClient()

    const { data: cars } = await supabase
        .from('cars_for_sale')
        .select('*')
        .order('created_at', { ascending: false })

    const brands = [...new Set((cars ?? []).map(c => c.brand))].sort()

    return (
        <div className="max-w-[1200px] mx-auto px-5 py-10">
            <div className="mb-8 fade-in">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
                    Продажа автомобилей
                </h1>
                <p className="text-[#6e6e73] text-[16px]">
                    {cars?.length ?? 0} автомобилей в наличии
                </p>
            </div>
            <SaleClient cars={cars ?? []} brands={brands} />
        </div>
    )
}