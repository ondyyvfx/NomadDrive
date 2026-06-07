import { createClient } from '@/lib/supabase/server'
import { LandingPage } from './LandingPage'

export default async function HomePage() {
    const supabase = await createClient()

    const [{ data: rentCars }, { data: saleCars }, { data: parts }] = await Promise.all([
        supabase
            .from('cars_for_rent')
            .select('id, brand, model, year, seats, transmission, fuel_type, price_per_day, image_urls, status')
            .eq('status', 'available')
            .order('created_at', { ascending: false })
            .limit(6),
        supabase
            .from('cars_for_sale')
            .select('id, brand, model, year, mileage, transmission, fuel_type, price, image_urls, status')
            .eq('status', 'available')
            .order('created_at', { ascending: false })
            .limit(6),
        supabase
            .from('parts')
            .select('id, name, brand, category, price, oem_number, image_urls')
            .order('created_at', { ascending: false })
            .limit(4),
    ])

    return (
        <LandingPage
            rentCars={rentCars ?? []}
            saleCars={saleCars ?? []}
            parts={parts ?? []}
        />
    )
}
