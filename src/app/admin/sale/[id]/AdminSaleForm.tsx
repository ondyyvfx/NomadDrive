'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { CarForSale } from '@/types'
import { Trash2 } from 'lucide-react'

export function AdminSaleForm({ car }: { car: CarForSale | null }) {
    const router = useRouter()
    const isNew = !car

    const [form, setForm] = useState({
        brand: car?.brand ?? '',
        model: car?.model ?? '',
        year: car?.year ?? new Date().getFullYear(),
        color: car?.color ?? '',
        transmission: car?.transmission ?? 'auto',
        fuel_type: car?.fuel_type ?? 'petrol',
        mileage: car?.mileage ?? 0,
        engine_volume: car?.engine_volume ?? '',
        price: car?.price ?? 0,
        status: car?.status ?? 'available',
        location: car?.location ?? '',
        description: car?.description ?? '',
        vin: car?.vin ?? '',
        image_urls: car?.image_urls?.join('\n') ?? '',
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showDel, setShowDel] = useState(false)

    function set(key: string, value: string | number) {
        setForm(f => ({ ...f, [key]: value }))
    }

    async function handleSave() {
        setLoading(true)
        setError('')

        const payload = {
            brand: form.brand,
            model: form.model,
            year: Number(form.year),
            color: form.color || null,
            transmission: form.transmission as 'auto' | 'manual',
            fuel_type: form.fuel_type as 'petrol' | 'diesel' | 'electric' | 'hybrid',
            mileage: Number(form.mileage),
            engine_volume: form.engine_volume ? Number(form.engine_volume) : null,
            price: Number(form.price),
            status: form.status as 'available' | 'sold' | 'reserved',
            location: form.location || null,
            description: form.description || null,
            vin: form.vin || null,
            image_urls: form.image_urls
                ? form.image_urls.split('\n').map(s => s.trim()).filter(Boolean)
                : [],
        }

        try {
            const supabase = createClient()
            if (isNew) {
                const { error } = await supabase.from('cars_for_sale').insert(payload)
                if (error) throw error
            } else {
                const { error } = await supabase.from('cars_for_sale').update(payload).eq('id', car.id)
                if (error) throw error
            }
            router.push('/admin/sale')
            router.refresh()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Ошибка сохранения')
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete() {
        setLoading(true)
        const supabase = createClient()
        await supabase.from('cars_for_sale').delete().eq('id', car!.id)
        router.push('/admin/sale')
        router.refresh()
    }

    const inputCls = "w-full h-11 px-3.5 bg-[#f5f5f7] border border-black/[0.08] rounded-[10px] text-[15px] text-[#1d1d1f] outline-none focus:border-accent focus:ring-3 focus:ring-[#0a5f4a]/[0.08] focus:bg-white transition-all"
    const labelCls = "text-[13px] font-medium text-[#6e6e73] mb-1.5 block"

    return (
        <div className="flex flex-col gap-5 fade-in-up">

            {/* Основное */}
            <div className="bg-white border border-black/[0.06] rounded-[16px] p-6">
                <h2 className="text-[15px] font-semibold tracking-tight mb-5">Основное</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Марка</label>
                        <input className={inputCls} value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="BMW" />
                    </div>
                    <div>
                        <label className={labelCls}>Модель</label>
                        <input className={inputCls} value={form.model} onChange={e => set('model', e.target.value)} placeholder="X5" />
                    </div>
                    <div>
                        <label className={labelCls}>Год</label>
                        <input className={inputCls} type="number" value={form.year} onChange={e => set('year', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelCls}>Цвет</label>
                        <input className={inputCls} value={form.color} onChange={e => set('color', e.target.value)} placeholder="Чёрный" />
                    </div>
                    <div>
                        <label className={labelCls}>КПП</label>
                        <select className={inputCls} value={form.transmission} onChange={e => set('transmission', e.target.value)}>
                            <option value="auto">Автомат</option>
                            <option value="manual">Механика</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Топливо</label>
                        <select className={inputCls} value={form.fuel_type} onChange={e => set('fuel_type', e.target.value)}>
                            <option value="petrol">Бензин</option>
                            <option value="diesel">Дизель</option>
                            <option value="electric">Электро</option>
                            <option value="hybrid">Гибрид</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Пробег (км)</label>
                        <input className={inputCls} type="number" value={form.mileage} onChange={e => set('mileage', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelCls}>Объём двигателя (L)</label>
                        <input className={inputCls} type="number" step="0.1" value={form.engine_volume} onChange={e => set('engine_volume', e.target.value)} placeholder="2.5" />
                    </div>
                    <div>
                        <label className={labelCls}>Цена (₸)</label>
                        <input className={inputCls} type="number" value={form.price} onChange={e => set('price', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelCls}>Статус</label>
                        <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value)}>
                            <option value="available">В наличии</option>
                            <option value="reserved">Резерв</option>
                            <option value="sold">Продан</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Локация</label>
                        <input className={inputCls} value={form.location} onChange={e => set('location', e.target.value)} placeholder="Алматы" />
                    </div>
                    <div>
                        <label className={labelCls}>VIN</label>
                        <input className={inputCls} value={form.vin} onChange={e => set('vin', e.target.value)} placeholder="WBAFR9C50BC..." />
                    </div>
                </div>
            </div>

            {/* Описание и фото */}
            <div className="bg-white border border-black/[0.06] rounded-[16px] p-6">
                <h2 className="text-[15px] font-semibold tracking-tight mb-5">Описание и фото</h2>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className={labelCls}>Описание</label>
                        <textarea
                            className="w-full px-3.5 py-3 bg-[#f5f5f7] border border-black/[0.08] rounded-[10px] text-[15px] text-[#1d1d1f] outline-none focus:border-accent focus:ring-3 focus:ring-[#0a5f4a]/[0.08] focus:bg-white transition-all resize-none"
                            rows={3}
                            value={form.description}
                            onChange={e => set('description', e.target.value)}
                            placeholder="Описание автомобиля..."
                        />
                    </div>
                    <div>
                        <label className={labelCls}>Ссылки на фото (каждая с новой строки)</label>
                        <textarea
                            className="w-full px-3.5 py-3 bg-[#f5f5f7] border border-black/[0.08] rounded-[10px] text-[14px] text-[#1d1d1f] font-mono outline-none focus:border-accent focus:ring-3 focus:ring-[#0a5f4a]/[0.08] focus:bg-white transition-all resize-none"
                            rows={4}
                            value={form.image_urls}
                            onChange={e => set('image_urls', e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                        />
                    </div>
                </div>
            </div>

            {error && <p className="text-[13px] text-[#ff3b30] px-1">{error}</p>}

            <div className="flex gap-3">
                <button
                    onClick={() => router.back()}
                    className="h-11 px-5 bg-[#f5f5f7] text-[#1d1d1f] font-medium rounded-[10px] border border-black/[0.08] hover:bg-black/[0.04] transition-colors text-[15px]"
                >
                    Отмена
                </button>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 h-11 bg-accent text-white font-medium rounded-[10px] hover:bg-[#0a6e56] transition-colors text-[15px] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    {isNew ? 'Создать' : 'Сохранить'}
                </button>
                {!isNew && (
                    <button
                        onClick={() => setShowDel(true)}
                        className="h-11 w-11 flex items-center justify-center text-[#aeaeb2] hover:text-[#ff3b30] hover:bg-[#ff3b30]/[0.06] rounded-[10px] transition-all"
                    >
                        <Trash2 size={17} />
                    </button>
                )}
            </div>

            {showDel && (
                <>
                    <div className="hidden md:block bg-white border border-[#ff3b30]/20 rounded-[16px] p-5 scale-in">
                        <p className="text-[15px] font-semibold mb-1">Удалить автомобиль?</p>
                        <p className="text-[13px] text-[#6e6e73] mb-4">Это действие нельзя отменить</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDel(false)} className="flex-1 h-10 bg-[#f5f5f7] border border-black/[0.08] rounded-[10px] text-[14px] font-medium hover:bg-black/[0.04] transition-colors">Отмена</button>
                            <button onClick={handleDelete} disabled={loading} className="flex-1 h-10 bg-[#ff3b30] text-white rounded-[10px] text-[14px] font-medium hover:bg-[#e0352b] transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                                {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                Удалить
                            </button>
                        </div>
                    </div>
                    <div className="md:hidden fixed inset-0 z-40 bg-black/25" onClick={() => setShowDel(false)} />
                    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[20px] px-5 pt-5 pb-8 shadow-lg slide-in-from-bottom">
                        <div className="w-10 h-1 bg-black/[0.1] rounded-full mx-auto mb-6" />
                        <p className="text-[17px] font-semibold mb-1">Удалить автомобиль?</p>
                        <p className="text-[14px] text-[#6e6e73] mb-6">Это действие нельзя отменить</p>
                        <div className="flex flex-col gap-3">
                            <button onClick={handleDelete} disabled={loading} className="w-full h-12 bg-[#ff3b30] text-white font-medium rounded-[12px] text-[16px] flex items-center justify-center gap-2 disabled:opacity-60">
                                {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                Удалить
                            </button>
                            <button onClick={() => setShowDel(false)} className="w-full h-12 bg-[#f5f5f7] text-[#1d1d1f] font-medium rounded-[12px] border border-black/[0.08] text-[16px]">Отмена</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}