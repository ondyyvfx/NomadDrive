'use client'

import { useState, useMemo } from 'react'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { SaleCard } from './SaleCard'
import type { CarForSale } from '@/types'

interface Filters {
    brand: string
    transmission: string
    fuel_type: string
    priceMin: string
    priceMax: string
    yearMin: string
    yearMax: string
    mileageMax: string
}

const defaultFilters: Filters = {
    brand: '', transmission: '', fuel_type: '',
    priceMin: '', priceMax: '', yearMin: '', yearMax: '', mileageMax: '',
}

export function SaleClient({ cars, brands }: { cars: CarForSale[]; brands: string[] }) {
    const [filters, setFilters] = useState<Filters>(defaultFilters)
    const [applied, setApplied] = useState<Filters>(defaultFilters)
    const [showFilters, setShowFilters] = useState(false)
    const [sortBy, setSortBy] = useState('newest')
    const [showSortSheet, setShowSortSheet] = useState(false)

    const sortOptions = [
        { value: 'newest', label: 'Сначала новые' },
        { value: 'price_asc', label: 'Сначала дешевле' },
        { value: 'price_desc', label: 'Сначала дороже' },
        { value: 'mileage', label: 'По пробегу' },
    ]

    const hasActiveFilters = Object.values(applied).some(v => v !== '')

    function applyFilters() {
        setApplied({ ...filters })
        setShowFilters(false)
    }

    function resetFilters() {
        setFilters(defaultFilters)
        setApplied(defaultFilters)
    }

    const filtered = useMemo(() => {
        let result = [...cars]
        if (applied.brand) result = result.filter(c => c.brand === applied.brand)
        if (applied.transmission) result = result.filter(c => c.transmission === applied.transmission)
        if (applied.fuel_type) result = result.filter(c => c.fuel_type === applied.fuel_type)
        if (applied.priceMin) result = result.filter(c => c.price >= Number(applied.priceMin))
        if (applied.priceMax) result = result.filter(c => c.price <= Number(applied.priceMax))
        if (applied.yearMin) result = result.filter(c => c.year >= Number(applied.yearMin))
        if (applied.yearMax) result = result.filter(c => c.year <= Number(applied.yearMax))
        if (applied.mileageMax) result = result.filter(c => c.mileage <= Number(applied.mileageMax))

        if (sortBy === 'price_asc') result.sort((a, b) => a.price - b.price)
        if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price)
        if (sortBy === 'mileage') result.sort((a, b) => a.mileage - b.mileage)

        return result
    }, [cars, applied, sortBy])

    return (
        <div>
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-6 fade-in">
                <button
                    onClick={() => setShowFilters(true)}
                    className={`inline-flex items-center gap-2 h-10 px-4 rounded-[10px] border text-[14px] font-medium transition-all duration-200 ${hasActiveFilters
                            ? 'bg-[#c9a96e] text-[#0a0a0a] border-[#c9a96e]'
                            : 'bg-[#111111] text-[#f0ece4] border-white/[0.10] hover:border-white/[0.20]'
                        }`}
                >
                    <SlidersHorizontal size={15} />
                    Фильтры
                    {hasActiveFilters && (
                        <span className="w-5 h-5 bg-[#0a0a0a]/20 rounded-full text-[11px] flex items-center justify-center">
                            {Object.values(applied).filter(v => v !== '').length}
                        </span>
                    )}
                </button>

                <div className="flex items-center gap-2 ml-auto">
                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            className="inline-flex items-center gap-1.5 h-10 px-3 text-[13px] text-[#6b6b6b] hover:text-[#ff3b30] transition-colors"
                        >
                            <X size={14} />
                            Сбросить
                        </button>
                    )}

                    <button
                        onClick={() => setShowSortSheet(true)}
                        className="inline-flex items-center gap-2 h-10 px-4 bg-[#111111] border border-white/[0.10] hover:border-white/[0.20] rounded-[10px] text-[14px] font-medium text-[#f0ece4] transition-all duration-200 md:hidden"
                    >
                        {sortOptions.find(o => o.value === sortBy)?.label}
                        <ChevronDown size={14} className="text-[#6b6b6b]" />
                    </button>

                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="hidden md:block h-10 px-4 bg-[#111111] border border-white/[0.10] hover:border-white/[0.20] rounded-[10px] text-[14px] font-medium text-[#f0ece4] outline-none cursor-pointer transition-all duration-200"
                    >
                        {sortOptions.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <p className="text-[13px] text-[#6b6b6b] mb-4">
                Найдено: <span className="text-[#f0ece4] font-medium">{filtered.length}</span> авто
            </p>

            {/* Grid */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
                    {filtered.map((car, index) => (
                        <SaleCard key={car.id} car={car} priority={index < 3} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 fade-in">
                    <p className="text-[40px] mb-4">🚗</p>
                    <p className="text-[18px] font-bold tracking-tight mb-2 text-[#f0ece4]">Ничего не найдено</p>
                    <p className="text-[14px] text-[#6b6b6b] mb-6">Попробуйте изменить фильтры</p>
                    <button
                        onClick={resetFilters}
                        className="h-10 px-6 bg-[#c9a96e] text-[#0a0a0a] text-[14px] font-semibold rounded-[10px] hover:bg-[#d4b87a] transition-all duration-300"
                    >
                        Сбросить фильтры
                    </button>
                </div>
            )}

            {/* Filter panel */}
            {showFilters && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        style={{ background: 'rgba(0,0,0,0.6)' }}
                        onClick={() => setShowFilters(false)}
                    />
                    <div className="hidden md:flex fixed top-0 right-0 h-full w-[340px] bg-[#111111] z-50 flex-col shadow-lg border-l border-white/[0.06] slide-in-from-right">
                        <SaleFilterPanel
                            filters={filters} setFilters={setFilters} brands={brands}
                            onApply={applyFilters} onClose={() => setShowFilters(false)} onReset={resetFilters}
                        />
                    </div>
                    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111111] rounded-t-[20px] shadow-lg max-h-[85vh] flex flex-col border-t border-white/[0.06] slide-in-from-bottom">
                        <SaleFilterPanel
                            filters={filters} setFilters={setFilters} brands={brands}
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
                        style={{ background: 'rgba(0,0,0,0.6)' }}
                        onClick={() => setShowSortSheet(false)}
                    />
                    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111111] rounded-t-[20px] px-5 pt-5 pb-8 shadow-lg border-t border-white/[0.06] slide-in-from-bottom">
                        <div className="w-10 h-1 bg-white/[0.10] rounded-full mx-auto mb-6" />
                        <p className="text-[16px] font-bold tracking-tight mb-4 text-[#f0ece4]">Сортировка</p>
                        <div className="flex flex-col gap-2">
                            {sortOptions.map(o => (
                                <button
                                    key={o.value}
                                    onClick={() => { setSortBy(o.value); setShowSortSheet(false) }}
                                    className={`w-full h-12 rounded-[12px] text-[15px] font-medium transition-colors text-left px-4 ${sortBy === o.value
                                            ? 'bg-[#c9a96e]/[0.10] text-[#c9a96e]'
                                            : 'hover:bg-white/[0.04] text-[#f0ece4]'
                                        }`}
                                >
                                    {o.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

/* ── Filter Panel ── */
interface SaleFilterPanelProps {
    filters: Filters
    setFilters: (f: Filters) => void
    brands: string[]
    onApply: () => void
    onClose: () => void
    onReset: () => void
}

function SaleFilterPanel({ filters, setFilters, brands, onApply, onClose, onReset }: SaleFilterPanelProps) {
    function set(key: keyof Filters, value: string) {
        setFilters({ ...filters, [key]: value })
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06] flex-shrink-0 relative">
                <div className="md:hidden w-10 h-1 bg-white/[0.10] rounded-full absolute left-1/2 -translate-x-1/2 top-3" />
                <p className="text-[17px] font-bold tracking-tight text-[#f0ece4]">Фильтры</p>
                <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/[0.06] text-[#6b6b6b] transition-colors"
                >
                    <X size={17} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">

                {/* Марка */}
                <FilterSelect
                    label="Марка"
                    value={filters.brand}
                    onChange={v => set('brand', v)}
                    options={brands.map(b => ({ value: b, label: b }))}
                    placeholder="Все марки"
                />

                {/* КПП */}
                <FilterSelect
                    label="Коробка передач"
                    value={filters.transmission}
                    onChange={v => set('transmission', v)}
                    options={[
                        { value: 'auto', label: 'Автомат' },
                        { value: 'manual', label: 'Механика' },
                    ]}
                    placeholder="Любая"
                />

                {/* Топливо */}
                <FilterSelect
                    label="Тип топлива"
                    value={filters.fuel_type}
                    onChange={v => set('fuel_type', v)}
                    options={[
                        { value: 'petrol', label: 'Бензин' },
                        { value: 'diesel', label: 'Дизель' },
                        { value: 'electric', label: 'Электро' },
                        { value: 'hybrid', label: 'Гибрид' },
                    ]}
                    placeholder="Любой"
                />

                {/* Цена */}
                <div>
                    <p className="text-[13px] font-medium text-[#6b6b6b] mb-3">Цена (₸)</p>
                    <div className="flex gap-3">
                        <input
                            type="number"
                            value={filters.priceMin}
                            onChange={e => set('priceMin', e.target.value)}
                            placeholder="От"
                            className="w-full h-11 px-3.5 bg-[#161616] border border-white/[0.08] rounded-[10px] text-[15px] text-[#f0ece4] placeholder:text-[#3d3d3d] outline-none focus:border-[#c9a96e] focus:ring-3 focus:ring-[#c9a96e]/[0.10] transition-all"
                        />
                        <input
                            type="number"
                            value={filters.priceMax}
                            onChange={e => set('priceMax', e.target.value)}
                            placeholder="До"
                            className="w-full h-11 px-3.5 bg-[#161616] border border-white/[0.08] rounded-[10px] text-[15px] text-[#f0ece4] placeholder:text-[#3d3d3d] outline-none focus:border-[#c9a96e] focus:ring-3 focus:ring-[#c9a96e]/[0.10] transition-all"
                        />
                    </div>
                </div>

                {/* Год */}
                <div>
                    <p className="text-[13px] font-medium text-[#6b6b6b] mb-3">Год выпуска</p>
                    <div className="flex gap-3">
                        <input
                            type="number"
                            value={filters.yearMin}
                            onChange={e => set('yearMin', e.target.value)}
                            placeholder="От"
                            className="w-full h-11 px-3.5 bg-[#161616] border border-white/[0.08] rounded-[10px] text-[15px] text-[#f0ece4] placeholder:text-[#3d3d3d] outline-none focus:border-[#c9a96e] focus:ring-3 focus:ring-[#c9a96e]/[0.10] transition-all"
                        />
                        <input
                            type="number"
                            value={filters.yearMax}
                            onChange={e => set('yearMax', e.target.value)}
                            placeholder="До"
                            className="w-full h-11 px-3.5 bg-[#161616] border border-white/[0.08] rounded-[10px] text-[15px] text-[#f0ece4] placeholder:text-[#3d3d3d] outline-none focus:border-[#c9a96e] focus:ring-3 focus:ring-[#c9a96e]/[0.10] transition-all"
                        />
                    </div>
                </div>

                {/* Пробег */}
                <div>
                    <p className="text-[13px] font-medium text-[#6b6b6b] mb-3">Пробег до (км)</p>
                    <input
                        type="number"
                        value={filters.mileageMax}
                        onChange={e => set('mileageMax', e.target.value)}
                        placeholder="Например 100000"
                        className="w-full h-11 px-3.5 bg-[#161616] border border-white/[0.08] rounded-[10px] text-[15px] text-[#f0ece4] placeholder:text-[#3d3d3d] outline-none focus:border-[#c9a96e] focus:ring-3 focus:ring-[#c9a96e]/[0.10] transition-all"
                    />
                </div>

            </div>

            <div className="px-6 py-4 border-t border-white/[0.06] flex gap-3 flex-shrink-0">
                <button
                    onClick={onReset}
                    className="flex-1 h-11 bg-[#1a1a1a] text-[#f0ece4] font-medium rounded-[10px] border border-white/[0.08] hover:bg-white/[0.04] transition-colors text-[15px]"
                >
                    Сбросить
                </button>
                <button
                    onClick={onApply}
                    className="flex-1 h-11 bg-[#c9a96e] text-[#0a0a0a] font-semibold rounded-[10px] hover:bg-[#d4b87a] transition-all duration-300 text-[15px]"
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
            <p className="text-[13px] font-medium text-[#6b6b6b] mb-2">{label}</p>
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onChange('')}
                    className={`h-9 px-3.5 rounded-[8px] text-[13px] font-medium border transition-all duration-150 ${value === ''
                            ? 'bg-[#c9a96e] text-[#0a0a0a] border-[#c9a96e]'
                            : 'bg-[#1a1a1a] text-[#6b6b6b] border-white/[0.10] hover:border-white/[0.20]'
                        }`}
                >
                    {placeholder}
                </button>
                {options.map(o => (
                    <button
                        key={o.value}
                        onClick={() => onChange(o.value)}
                        className={`h-9 px-3.5 rounded-[8px] text-[13px] font-medium border transition-all duration-150 ${value === o.value
                                ? 'bg-[#c9a96e] text-[#0a0a0a] border-[#c9a96e]'
                                : 'bg-[#1a1a1a] text-[#6b6b6b] border-white/[0.10] hover:border-white/[0.20]'
                            }`}
                    >
                        {o.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
