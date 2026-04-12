import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Package } from 'lucide-react'

export const metadata = { title: 'Admin — Запчасти' }

export default async function AdminPartsPage() {
    const supabase = await createClient()
    const { data: parts } = await supabase
        .from('parts')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-[1000px]">
            <div className="flex items-center justify-between mb-8 fade-in">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Запчасти</h1>
                    <p className="text-[14px] text-[#6e6e73] mt-1">Всего: {parts?.length ?? 0}</p>
                </div>
                <Link
                    href="/admin/parts/new"
                    className="inline-flex items-center gap-2 h-10 px-5 bg-accent text-white text-[14px] font-medium rounded-[10px] hover:bg-[#0a6e56] transition-colors"
                >
                    <Plus size={16} />
                    Добавить
                </Link>
            </div>

            <div className="bg-white border border-black/[0.06] rounded-[16px] overflow-hidden fade-in">
                <div className="divide-y divide-black/[0.04]">
                    {parts?.map(part => (
                        <Link
                            key={part.id}
                            href={`/admin/parts/${part.id}`}
                            className="flex items-center gap-4 px-5 py-4 hover:bg-[#f5f5f7] transition-colors"
                        >
                            <div className="relative w-14 h-12 rounded-[8px] overflow-hidden bg-[#f5f5f7] flex-shrink-0">
                                {part.image_urls?.[0] ? (
                                    <Image
                                        src={part.image_urls[0]} alt={part.name}
                                        fill sizes="56px" className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package size={18} className="text-[#aeaeb2]" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[14px] font-semibold tracking-tight truncate">{part.name}</p>
                                <p className="text-[12px] text-[#6e6e73]">
                                    {part.brand}
                                    {part.car_brand && ` · ${part.car_brand} ${part.car_model ?? ''}`}
                                    {part.category && ` · ${part.category}`}
                                </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-[14px] font-semibold">{part.price.toLocaleString('ru-RU')} ₸</p>
                                <p className={`text-[12px] ${part.stock > 0 ? 'text-[#34c759]' : 'text-[#ff3b30]'}`}>
                                    {part.stock > 0 ? `${part.stock} шт.` : 'Нет'}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
                {!parts?.length && (
                    <p className="text-center py-16 text-[14px] text-[#aeaeb2]">Нет запчастей</p>
                )}
            </div>
        </div>
    )
}