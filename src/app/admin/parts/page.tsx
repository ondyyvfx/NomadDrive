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
                    <h1 className="text-2xl font-bold tracking-[-0.04em] text-[#f0ece4]">Запчасти</h1>
                    <p className="text-[14px] text-[#6b6b6b] mt-1">Всего: {parts?.length ?? 0}</p>
                </div>
                <Link
                    href="/admin/parts/new"
                    className="inline-flex items-center gap-2 h-10 px-5 bg-[#c9a96e] text-[#0a0a0a] text-[14px] font-semibold rounded-[10px] hover:bg-[#d4b87a] transition-colors"
                >
                    <Plus size={16} />
                    Добавить
                </Link>
            </div>

            <div className="bg-[#111111] border border-white/[0.07] rounded-[16px] overflow-hidden fade-in">
                <div className="divide-y divide-white/[0.05]">
                    {parts?.map(part => (
                        <Link
                            key={part.id}
                            href={`/admin/parts/${part.id}`}
                            className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors"
                        >
                            <div className="relative w-14 h-12 rounded-[8px] overflow-hidden bg-[#161616] flex-shrink-0">
                                {part.image_urls?.[0] ? (
                                    <Image
                                        src={part.image_urls[0]} alt={part.name}
                                        fill sizes="56px" className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package size={18} className="text-[#3d3d3d]" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[14px] font-semibold tracking-tight truncate text-[#f0ece4]">{part.name}</p>
                                <p className="text-[12px] text-[#6b6b6b]">
                                    {part.brand}
                                    {part.car_brand && ` · ${part.car_brand} ${part.car_model ?? ''}`}
                                    {part.category && ` · ${part.category}`}
                                </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="text-[14px] font-semibold text-[#f0ece4]">{part.price.toLocaleString('ru-RU')} ₸</p>
                                <p className={`text-[12px] ${part.stock > 0 ? 'text-[#34c759]' : 'text-[#ff3b30]'}`}>
                                    {part.stock > 0 ? `${part.stock} шт.` : 'Нет'}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
                {!parts?.length && (
                    <p className="text-center py-16 text-[14px] text-[#3d3d3d]">Нет запчастей</p>
                )}
            </div>
        </div>
    )
}
