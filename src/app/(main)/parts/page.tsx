import { createClient } from '@/lib/supabase/server'
import { PartsClient } from './PartsClient'

export const metadata = { title: 'Запчасти' }

export default async function PartsPage() {
    const supabase = await createClient()

    const { data: parts } = await supabase
        .from('parts')
        .select('*')
        .order('created_at', { ascending: false })

    const brands = [...new Set((parts ?? []).map(p => p.brand))].sort()
    const carBrands = [...new Set((parts ?? []).map(p => p.car_brand).filter(Boolean))].sort()
    const categories = [...new Set((parts ?? []).map(p => p.category).filter(Boolean))].sort()

    return (
        <div className="max-w-[1200px] mx-auto px-5 py-10">
            <div className="mb-8 fade-in">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">
                    Запчасти
                </h1>
                <p className="text-[#6e6e73] text-[16px]">
                    {parts?.length ?? 0} позиций в наличии
                </p>
            </div>
            <PartsClient
                parts={parts ?? []}
                brands={brands}
                carBrands={carBrands as string[]}
                categories={categories as string[]}
            />
        </div>
    )
}