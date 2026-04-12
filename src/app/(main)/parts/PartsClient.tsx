'use client'

import { useState, useMemo, useEffect } from 'react'
import { SlidersHorizontal, X, ChevronDown, ShoppingCart, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PartCard } from './PartCard'
import type { Part } from '@/types'
import type { CartItem } from '@/types'

interface Filters {
    brand: string
    carBrand: string
    category: string
    priceMin: string
    priceMax: string
    inStock: boolean
}

const defaultFilters: Filters = {
    brand: '', carBrand: '', category: '',
    priceMin: '', priceMax: '', inStock: false,
}

interface Props {
    parts: Part[]
    brands: string[]
    carBrands: string[]
    categories: string[]
}

const CART_KEY = 'nomaddrive_cart'

export function PartsClient({ parts, brands, carBrands, categories }: Props) {
    const router = useRouter()
    const [filters, setFilters] = useState<Filters>(defaultFilters)
    const [applied, setApplied] = useState<Filters>(defaultFilters)
    const [showFilters, setShowFilters] = useState(false)
    const [sortBy, setSortBy] = useState('newest')
    const [search, setSearch] = useState('')
    const [showSortSheet, setShowSortSheet] = useState(false)
    const [cart, setCart] = useState<CartItem[]>([])
    const [showCartToast, setShowCartToast] = useState(false)

    // Загружаем корзину из localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem(CART_KEY)
            if (saved) setCart(JSON.parse(saved))
        } catch { }
    }, [])

    function saveCart(items: CartItem[]) {
        setCart(items)
        localStorage.setItem(CART_KEY, JSON.stringify(items))
    }

    function addToCart(part: Part) {
        const existing = cart.find(i => i.product_id === part.id)
        let updated: CartItem[]
        if (existing) {
            updated = cart.map(i =>
                i.product_id === part.id
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            )
        } else {
            updated = [...cart, {
                id: `cart_${Date.now()}`,
                product_type: 'part' as const,
                product_id: part.id,
                name: part.name,
                price: part.price,
                quantity: 1,
                image_url: part.image_urls?.[0] ?? null,
            }]
        }
        saveCart(updated)
        setShowCartToast(true)
        setTimeout(() => setShowCartToast(false), 2500)
    }

    const cartCount = cart.reduce((s, i) => s + i.quantity, 0)
    const hasActiveFilters = Object.entries(applied).some(([k, v]) =>
        k === 'inStock' ? v === true : v !== ''
    )

    const sortOptions = [
        { value: 'newest', label: 'Сначала новые' },
        { value: 'price_asc', label: 'Сначала дешевле' },
        { value: 'price_desc', label: 'Сначала дороже' },
    ]

    function applyFilters() {
        setApplied({ ...filters })
        setShowFilters(false)
    }

    function resetFilters() {
        setFilters(defaultFilters)
        setApplied(defaultFilters)
    }

    const filtered = useMemo(() => {
        let result = [...parts]

        if (search.trim()) {
            const q = search.toLowerCase()
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q) ||
                p.car_brand?.toLowerCase().includes(q) ||
                p.car_model?.toLowerCase().includes(q) ||
                p.oem_number?.toLowerCase().includes(q)
            )
        }

        if (applied.brand) result = result.filter(p => p.brand === applied.brand)
        if (applied.carBrand) result = result.filter(p => p.car_brand === applied.carBrand)
        if (applied.category) result = result.filter(p => p.category === applied.category)
        if (applied.priceMin) result = result.filter(p => p.price >= Number(applied.priceMin))
        if (applied.priceMax) result = result.filter(p => p.price <= Number(applied.priceMax))
        if (applied.inStock) result = result.filter(p => p.stock > 0)

        if (sortBy === 'price_asc') result.sort((a, b) => a.price - b.price)
        if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price)

        return result
    }, [parts, applied, search, sortBy])

    return (
        <div>
            {/* Search + Toolbar */}
            <div className="flex flex-col gap-3 mb-6 fade-in">

                {/* Поиск */}
                <div className="relative">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#aeaeb2]" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Поиск по названию, марке, OEM номеру..."
                        className="w-full h-11 pl-10 pr-4 bg-[#f5f5f7] border border-black/[0.08] rounded-[10px] text-[15px] text-[#1d1d1f] placeholder:text-[#aeaeb2] outline-none focus:border-accent focus:ring-3 focus:ring-[#0a5f4a]/[0.08] focus:bg-white transition-all"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aeaeb2] hover:text-[#6e6e73]"
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>

                {/* Фильтры + корзина */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowFilters(true)}
                        className={`inline-flex items-center gap-2 h-10 px-4 rounded-[10px] border text-[14px] font-medium transition-all duration-200 ${hasActiveFilters
                                ? 'bg-accent text-white border-accent'
                                : 'bg-white text-[#1d1d1f] border-black/[0.1] hover:border-black/[0.2]'
                            }`}
                    >
                        <SlidersHorizontal size={15} />
                        Фильтры
                        {hasActiveFilters && (
                            <span className="w-5 h-5 bg-white/20 rounded-full text-[11px] flex items-center justify-center">
                                {Object.entries(applied).filter(([k, v]) => k === 'inStock' ? v : v !== '').length}
                            </span>
                        )}
                    </button>

                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            className="inline-flex items-center gap-1.5 h-10 px-3 text-[13px] text-[#6e6e73] hover:text-[#ff3b30] transition-colors"
                        >
                            <X size={14} />
                            Сбросить
                        </button>
                    )}

                    <div className="ml-auto flex items-center gap-2">
                        {/* Сортировка mobile */}
                        <button
                            onClick={() => setShowSortSheet(true)}
                            className="inline-flex items-center gap-2 h-10 px-4 bg-white border border-black/[0.1] hover:border-black/[0.2] rounded-[10px] text-[14px] font-medium text-[#1d1d1f] transition-all md:hidden"
                        >
                            {sortOptions.find(o => o.value === sortBy)?.label}
                            <ChevronDown size={14} className="text-[#6e6e73]" />
                        </button>

                        {/* Сортировка desktop */}
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="hidden md:block h-10 px-4 bg-white border border-black/[0.1] hover:border-black/[0.2] rounded-[10px] text-[14px] font-medium text-[#1d1d1f] outline-none cursor-pointer transition-all"
                        >
                            {sortOptions.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>

                        {/* Корзина */}
                        <button
                            onClick={() => router.push('/cart')}
                            className="relative h-10 w-10 bg-white border border-black/[0.1] hover:border-black/[0.2] rounded-[10px] flex items-center justify-center transition-all hover:shadow-sm"
                        >
                            <ShoppingCart size={17} className="text-[#1d1d1f]" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent text-white text-[11px] font-semibold rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <p className="text-[13px] text-[#6e6e73] mb-4">
                Найдено: <span className="text-[#1d1d1f] font-medium">{filtered.length}</span> позиций
            </p>

            {/* Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-children">
                    {filtered.map((part, index) => (
                        <PartCard
                            key={part.id}
                            part={part}
                            onAddToCart={addToCart}
                            inCart={cart.some(i => i.product_id === part.id)}
                            priority={index < 4}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 fade-in">
                    <p className="text-[40px] mb-4">🔧</p>
                    <p className="text-[18px] font-semibold tracking-tight mb-2">Ничего не найдено</p>
                    <p className="text-[14px] text-[#6e6e73] mb-6">
                        Попробуйте изменить поисковый запрос или фильтры
                    </p>
                    <button
                        onClick={() => { resetFilters(); setSearch('') }}
                        className="h-10 px-6 bg-accent text-white text-[14px] font-medium rounded-[10px] hover:bg-[#0a6e56] transition-colors"
                    >
                        Сбросить всё
                    </button>
                </div>
            )}

            {/* Filter panel */}
            {showFilters && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        style={{ background: 'rgba(0,0,0,0.25)' }}
                        onClick={() => setShowFilters(false)}
                    />
                    <div className="hidden md:flex fixed top-0 right-0 h-full w-[340px] bg-white z-50 flex-col shadow-lg slide-in-from-right">
                        <PartsFilterPanel
                            filters={filters} setFilters={setFilters}
                            brands={brands} carBrands={carBrands} categories={categories}
                            onApply={applyFilters} onClose={() => setShowFilters(false)} onReset={resetFilters}
                        />
                    </div>
                    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[20px] shadow-lg max-h-[85vh] flex flex-col slide-in-from-bottom">
                        <PartsFilterPanel
                            filters={filters} setFilters={setFilters}
                            brands={brands} carBrands={carBrands} categories={categories}
                            onApply={applyFilters} onClose={() => setShowFilters(false)} onReset={resetFilters}
                        />
                    </div>
                </>
            )}

            {/* Sort sheet mobile */}
            {showSortSheet && (
                <>
                    <div
                        className="md:hidden fixed inset-0 z-40"
                        style={{ background: 'rgba(0,0,0,0.25)' }}
                        onClick={() => setShowSortSheet(false)}
                    />
                    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[20px] px-5 pt-5 pb-8 shadow-lg slide-in-from-bottom">
                        <div className="w-10 h-1 bg-black/[0.1] rounded-full mx-auto mb-6" />
                        <p className="text-[16px] font-semibold tracking-tight mb-4">Сортировка</p>
                        <div className="flex flex-col gap-2">
                            {sortOptions.map(o => (
                                <button
                                    key={o.value}
                                    onClick={() => { setSortBy(o.value); setShowSortSheet(false) }}
                                    className={`w-full h-12 rounded-[12px] text-[15px] font-medium transition-colors text-left px-4 ${sortBy === o.value
                                            ? 'bg-accent/[0.08] text-accent'
                                            : 'hover:bg-[#f5f5f7] text-[#1d1d1f]'
                                        }`}
                                >
                                    {o.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Cart toast */}
            {showCartToast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 fade-in">
                    <div
                        className="flex items-center gap-3 px-5 py-3.5 bg-[#1d1d1f] text-white rounded-[14px] shadow-lg cursor-pointer hover:bg-[#2d2d2f] transition-colors"
                        onClick={() => router.push('/cart')}
                    >
                        <ShoppingCart size={16} />
                        <span className="text-[14px] font-medium">Добавлено в корзину</span>
                        <span className="text-[13px] text-white/50">→ Перейти</span>
                    </div>
                </div>
            )}
        </div>
    )
}

/* ── Filter Panel ── */
interface PartsFilterPanelProps {
    filters: Filters
    setFilters: (f: Filters) => void
    brands: string[]
    carBrands: string[]
    categories: string[]
    onApply: () => void
    onClose: () => void
    onReset: () => void
}

function PartsFilterPanel({
    filters, setFilters, brands, carBrands, categories,
    onApply, onClose, onReset,
}: PartsFilterPanelProps) {
    function set(key: keyof Filters, value: string | boolean) {
        setFilters({ ...filters, [key]: value })
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-black/[0.06] flex-shrink-0 relative">
                <div className="md:hidden w-10 h-1 bg-black/[0.1] rounded-full absolute left-1/2 -translate-x-1/2 top-3" />
                <p className="text-[17px] font-semibold tracking-tight">Фильтры</p>
                <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/[0.06] text-[#6e6e73] transition-colors"
                >
                    <X size={17} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">

                {/* Только в наличии */}
                <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-[15px] font-medium text-[#1d1d1f]">Только в наличии</span>
                    <div
                        onClick={() => set('inStock', !filters.inStock)}
                        className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 ${filters.inStock ? 'bg-accent' : 'bg-black/[0.1]'
                            }`}
                    >
                        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${filters.inStock ? 'translate-x-5' : 'translate-x-0.5'
                            }`} />
                    </div>
                </label>

                {/* Категория */}
                <FilterSelect
                    label="Категория"
                    value={filters.category}
                    onChange={v => set('category', v)}
                    options={categories.map(c => ({ value: c, label: c }))}
                    placeholder="Все категории"
                />

                {/* Марка запчасти */}
                <FilterSelect
                    label="Производитель"
                    value={filters.brand}
                    onChange={v => set('brand', v)}
                    options={brands.map(b => ({ value: b, label: b }))}
                    placeholder="Все"
                />

                {/* Марка авто */}
                <FilterSelect
                    label="Марка автомобиля"
                    value={filters.carBrand}
                    onChange={v => set('carBrand', v)}
                    options={carBrands.map(b => ({ value: b, label: b }))}
                    placeholder="Все марки"
                />

                {/* Цена */}
                <div>
                    <p className="text-[13px] font-medium text-[#6e6e73] mb-3">Цена (₸)</p>
                    <div className="flex gap-3">
                        <input
                            type="number"
                            value={filters.priceMin}
                            onChange={e => set('priceMin', e.target.value)}
                            placeholder="От"
                            className="w-full h-11 px-3.5 bg-[#f5f5f7] border border-black/[0.08] rounded-[10px] text-[15px] outline-none focus:border-accent focus:ring-3 focus:ring-[#0a5f4a]/[0.08] focus:bg-white transition-all"
                        />
                        <input
                            type="number"
                            value={filters.priceMax}
                            onChange={e => set('priceMax', e.target.value)}
                            placeholder="До"
                            className="w-full h-11 px-3.5 bg-[#f5f5f7] border border-black/[0.08] rounded-[10px] text-[15px] outline-none focus:border-accent focus:ring-3 focus:ring-[#0a5f4a]/[0.08] focus:bg-white transition-all"
                        />
                    </div>
                </div>

            </div>

            <div className="px-6 py-4 border-t border-black/[0.06] flex gap-3 flex-shrink-0">
                <button
                    onClick={onReset}
                    className="flex-1 h-11 bg-[#f5f5f7] text-[#1d1d1f] font-medium rounded-[10px] border border-black/[0.08] hover:bg-black/[0.04] transition-colors text-[15px]"
                >
                    Сбросить
                </button>
                <button
                    onClick={onApply}
                    className="flex-1 h-11 bg-accent text-white font-medium rounded-[10px] hover:bg-[#0a6e56] transition-colors text-[15px]"
                >
                    Применить
                </button>
            </div>
        </div>
    )
}

function FilterSelect({ label, value, onChange, options, placeholder }: {
    label: string
    value: string
    onChange: (v: string) => void
    options: { value: string; label: string }[]
    placeholder: string
}) {
    return (
        <div>
            <p className="text-[13px] font-medium text-[#6e6e73] mb-2">{label}</p>
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onChange('')}
                    className={`h-9 px-3.5 rounded-[8px] text-[13px] font-medium border transition-all duration-150 ${value === ''
                            ? 'bg-accent text-white border-accent'
                            : 'bg-white text-[#6e6e73] border-black/[0.1] hover:border-black/[0.2]'
                        }`}
                >
                    {placeholder}
                </button>
                {options.map(o => (
                    <button
                        key={o.value}
                        onClick={() => onChange(o.value)}
                        className={`h-9 px-3.5 rounded-[8px] text-[13px] font-medium border transition-all duration-150 ${value === o.value
                                ? 'bg-accent text-white border-accent'
                                : 'bg-white text-[#6e6e73] border-black/[0.1] hover:border-black/[0.2]'
                            }`}
                    >
                        {o.label}
                    </button>
                ))}
            </div>
        </div>
    )
}