'use client'

import Image from 'next/image'
import { ShoppingCart, Check, Package } from 'lucide-react'
import { useState } from 'react'
import type { Part } from '@/types'

interface Props {
    part: Part
    onAddToCart: (part: Part) => void
    inCart: boolean
    priority?: boolean
}

export function PartCard({ part, onAddToCart, inCart, priority = false }: Props) {
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
        <div className="group bg-white border border-black/[0.06] rounded-[16px] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">

            {/* Фото */}
            <div className="relative h-44 bg-[#f5f5f7] overflow-hidden">
                {image ? (
                    <Image
                        src={image}
                        alt={part.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        priority={priority}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Package size={40} className="text-[#aeaeb2]" />
                    </div>
                )}

                {/* Сток */}
                <div className="absolute top-3 left-3">
                    {isOutOfStock ? (
                        <span className="px-2.5 py-1 rounded-full text-[12px] font-medium bg-white/90 backdrop-blur-sm text-[#ff3b30]">
                            Нет в наличии
                        </span>
                    ) : part.stock <= 5 ? (
                        <span className="px-2.5 py-1 rounded-full text-[12px] font-medium bg-white/90 backdrop-blur-sm text-[#ff9f0a]">
                            Осталось {part.stock} шт.
                        </span>
                    ) : null}
                </div>
            </div>

            {/* Контент */}
            <div className="p-4 flex flex-col flex-1">

                {/* Категория */}
                {part.category && (
                    <span className="text-[11px] font-medium text-accent uppercase tracking-wider mb-1.5">
                        {part.category}
                    </span>
                )}

                <h3 className="text-[15px] font-semibold tracking-tight text-[#1d1d1f] mb-1 line-clamp-2">
                    {part.name}
                </h3>

                <p className="text-[13px] text-[#6e6e73] mb-1">{part.brand}</p>

                {/* Совместимость */}
                {(part.car_brand || part.car_model) && (
                    <p className="text-[12px] text-[#aeaeb2] mb-3">
                        {[part.car_brand, part.car_model, part.year_from && `${part.year_from}–${part.year_to ?? '...'}`]
                            .filter(Boolean)
                            .join(' · ')}
                    </p>
                )}

                {/* OEM */}
                {part.oem_number && (
                    <p className="text-[11px] font-mono text-[#aeaeb2] mb-3">
                        OEM: {part.oem_number}
                    </p>
                )}

                <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-black/[0.04]">
                    <p className="text-[18px] font-semibold tracking-tight text-[#1d1d1f]">
                        {part.price.toLocaleString('ru-RU')} ₸
                    </p>

                    <button
                        onClick={handleAdd}
                        disabled={isOutOfStock || inCart}
                        className={`h-9 px-4 rounded-[8px] text-[13px] font-medium transition-all duration-200 flex items-center gap-2 flex-shrink-0 ${inCart || added
                                ? 'bg-[#34c759]/[0.1] text-[#34c759]'
                                : isOutOfStock
                                    ? 'bg-[#f5f5f7] text-[#aeaeb2] cursor-not-allowed'
                                    : 'bg-accent/[0.08] text-accent hover:bg-accent hover:text-white'
                            }`}
                    >
                        {inCart || added ? (
                            <>
                                <Check size={14} />
                                В корзине
                            </>
                        ) : (
                            <>
                                <ShoppingCart size={14} />
                                В корзину
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}