'use client'

import Image from 'next/image'
import { ShoppingCart, Check, Package } from 'lucide-react'
import { useState } from 'react'
import { useDict } from '@/contexts/LanguageContext'
import type { Part } from '@/types'

interface Props {
    part: Part
    onAddToCart: (part: Part) => void
    inCart: boolean
    priority?: boolean
}

export function PartCard({ part, onAddToCart, inCart, priority = false }: Props) {
    const { parts: t, common } = useDict()
    const [added, setAdded] = useState(false)
    const image = part.image_urls?.[0]

    function handleAdd() {
        if (inCart) return
        onAddToCart(part)
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    const isOutOfStock = part.stock === 0

    return (
        <div className="group bg-[#111111] border border-white/[0.07] rounded-[16px] shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-white/[0.12] transition-all duration-300 overflow-hidden flex flex-col">

            {/* Фото */}
            <div className="relative h-44 bg-[#161616] overflow-hidden">
                {image ? (
                    <Image
                        src={image}
                        alt={part.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        priority={priority}
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Package size={40} className="text-[#3d3d3d]" />
                    </div>
                )}

                {/* Сток */}
                <div className="absolute top-3 left-3">
                    {isOutOfStock ? (
                        <span className="px-2.5 py-1 rounded-full text-[12px] font-medium bg-black/70 backdrop-blur-sm text-[#ff3b30]">
                            {t.outOfStock}
                        </span>
                    ) : part.stock <= 5 ? (
                        <span className="px-2.5 py-1 rounded-full text-[12px] font-medium bg-black/70 backdrop-blur-sm text-[#ff9f0a]">
                            {t.leftPrefix} {part.stock} {t.pcs}
                        </span>
                    ) : null}
                </div>
            </div>

            {/* Контент */}
            <div className="p-4 flex flex-col flex-1">

                {/* Категория */}
                {part.category && (
                    <span className="text-[11px] font-medium text-[#c9a96e] uppercase tracking-wider mb-1.5">
                        {part.category}
                    </span>
                )}

                <h3 className="text-[15px] font-bold tracking-tight text-[#f0ece4] mb-1 line-clamp-2">
                    {part.name}
                </h3>

                <p className="text-[13px] text-[#6b6b6b] mb-1">{part.brand}</p>

                {/* Совместимость */}
                {(part.car_brand || part.car_model) && (
                    <p className="text-[12px] text-[#3d3d3d] mb-3">
                        {[part.car_brand, part.car_model, part.year_from && `${part.year_from}–${part.year_to ?? '...'}`]
                            .filter(Boolean)
                            .join(' · ')}
                    </p>
                )}

                {/* OEM */}
                {part.oem_number && (
                    <p className="text-[11px] font-mono text-[#3d3d3d] mb-3">
                        {t.oem}: {part.oem_number}
                    </p>
                )}

                <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-white/[0.05]">
                    <p className="text-[18px] font-bold tracking-tight text-[#f0ece4]">
                        {part.price.toLocaleString(common.locale)} ₸
                    </p>

                    <button
                        onClick={handleAdd}
                        disabled={isOutOfStock || inCart}
                        className={`h-9 px-4 rounded-[8px] text-[13px] font-semibold transition-all duration-300 flex items-center gap-2 flex-shrink-0 ${inCart || added
                                ? 'bg-[#34c759]/[0.10] text-[#34c759]'
                                : isOutOfStock
                                    ? 'bg-[#1a1a1a] text-[#3d3d3d] cursor-not-allowed'
                                    : 'bg-[#c9a96e]/[0.08] text-[#c9a96e] hover:bg-[#c9a96e] hover:text-[#0a0a0a]'
                            }`}
                    >
                        {inCart || added ? (
                            <>
                                <Check size={14} />
                                {t.inCart}
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={14} />
                                {t.addToCart}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
