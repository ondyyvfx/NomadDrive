'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Part } from '@/types'
import { Trash2 } from 'lucide-react'

export function AdminPartForm({ part }: { part: Part | null }) {
    const router = useRouter()
    const isNew = !part

    const [form, setForm] = useState({
        name: part?.name ?? '',
        brand: part?.brand ?? '',
        car_brand: part?.car_brand ?? '',
        car_model: part?.car_model ?? '',
        year_from: part?.year_from ?? '',
        year_to: part?.year_to ?? '',
        category: part?.category ?? '',
        oem_number: part?.oem_number ?? '',
        price: part?.price ?? 0,
        stock: part?.stock ?? 0,
        description: part?.description ?? '',
        image_urls: part?.image_urls?.join('\n') ?? '',
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
            name: form.name,
            brand: form.brand,
            car_brand: form.car_brand || null,
            car_model: form.car_model || null,
            year_from: form.year_from ? Number(form.year_from) : null,
            year_to: form.year_to ? Number(form.year_to) : null,
            category: form.category || null,
            oem_number: form.oem_number || null,
            price: Number(form.price),
            stock: Number(form.stock),
            description: form.description || null,
            image_urls: form.image_urls
                ? form.image_urls.split('\n').map(s => s.trim()).filter(Boolean)
                : [],
        }

        try {
            const supabase = createClient()
            if (isNew) {
                const { error } = await supabase.from('parts').insert(payload)
                if (error) throw error
            } else {
                const { error } = await supabase.from('parts').update(payload).eq('id', part.id)
                if (error) throw error
            }
            router.push('/admin/parts')
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
        await supabase.from('parts').delete().eq('id', part!.id)
        router.push('/admin/parts')
        router.refresh()
    }

    const inputCls = "w-full h-11 px-3.5 bg-[#111111] border border-white/[0.10] rounded-[10px] text-[15px] text-[#f0ece4] outline-none focus:border-[#c9a96e] focus:ring-3 focus:ring-[#c9a96e]/[0.12] focus:bg-[#161616] transition-all"
    const labelCls = "text-[13px] font-medium text-[#6b6b6b] mb-1.5 block"

    return (
        <div className="flex flex-col gap-5 fade-in-up">

            <div className="bg-[#111111] border border-white/[0.07] rounded-[16px] p-6">
                <h2 className="text-[15px] font-bold tracking-tight mb-5 text-[#f0ece4]">Основное</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <label className={labelCls}>Название</label>
                        <input className={inputCls} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Масляный фильтр" />
                    </div>
                    <div>
                        <label className={labelCls}>Производитель</label>
                        <input className={inputCls} value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="Toyota" />
                    </div>
                    <div>
                        <label className={labelCls}>Категория</label>
                        <input className={inputCls} value={form.category} onChange={e => set('category', e.target.value)} placeholder="Фильтры" />
                    </div>
                    <div>
                        <label className={labelCls}>OEM номер</label>
                        <input className={inputCls} value={form.oem_number} onChange={e => set('oem_number', e.target.value)} placeholder="90915-YZZD4" />
                    </div>
                    <div>
                        <label className={labelCls}>Цена (₸)</label>
                        <input className={inputCls} type="number" value={form.price} onChange={e => set('price', e.target.value)} />
                    </div>
                    <div>
                        <label className={labelCls}>В наличии (шт.)</label>
                        <input className={inputCls} type="number" value={form.stock} onChange={e => set('stock', e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="bg-[#111111] border border-white/[0.07] rounded-[16px] p-6">
                <h2 className="text-[15px] font-bold tracking-tight mb-5 text-[#f0ece4]">Совместимость</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>Марка авто</label>
                        <input className={inputCls} value={form.car_brand} onChange={e => set('car_brand', e.target.value)} placeholder="Toyota" />
                    </div>
                    <div>
                        <label className={labelCls}>Модель авто</label>
                        <input className={inputCls} value={form.car_model} onChange={e => set('car_model', e.target.value)} placeholder="Camry" />
                    </div>
                    <div>
                        <label className={labelCls}>Год от</label>
                        <input className={inputCls} type="number" value={form.year_from} onChange={e => set('year_from', e.target.value)} placeholder="2018" />
                    </div>
                    <div>
                        <label className={labelCls}>Год до</label>
                        <input className={inputCls} type="number" value={form.year_to} onChange={e => set('year_to', e.target.value)} placeholder="2024" />
                    </div>
                </div>
            </div>

            <div className="bg-[#111111] border border-white/[0.07] rounded-[16px] p-6">
                <h2 className="text-[15px] font-bold tracking-tight mb-5 text-[#f0ece4]">Описание и фото</h2>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className={labelCls}>Описание</label>
                        <textarea
                            className="w-full px-3.5 py-3 bg-[#111111] border border-white/[0.10] rounded-[10px] text-[15px] text-[#f0ece4] outline-none focus:border-[#c9a96e] focus:ring-3 focus:ring-[#c9a96e]/[0.12] focus:bg-[#161616] transition-all resize-none"
                            rows={3}
                            value={form.description}
                            onChange={e => set('description', e.target.value)}
                            placeholder="Описание запчасти..."
                        />
                    </div>
                    <div>
                        <label className={labelCls}>Ссылки на фото (каждая с новой строки)</label>
                        <textarea
                            className="w-full px-3.5 py-3 bg-[#111111] border border-white/[0.10] rounded-[10px] text-[14px] text-[#f0ece4] font-mono outline-none focus:border-[#c9a96e] focus:ring-3 focus:ring-[#c9a96e]/[0.12] focus:bg-[#161616] transition-all resize-none"
                            rows={3}
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
                    className="h-11 px-5 bg-[#1a1a1a] text-[#f0ece4] font-medium rounded-[10px] border border-white/[0.08] hover:bg-white/[0.04] transition-colors text-[15px]"
                >
                    Отмена
                </button>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 h-11 bg-[#c9a96e] text-[#0a0a0a] font-semibold rounded-[10px] hover:bg-[#d4b87a] transition-colors text-[15px] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading && <span className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />}
                    {isNew ? 'Создать' : 'Сохранить'}
                </button>
                {!isNew && (
                    <button
                        onClick={() => setShowDel(true)}
                        className="h-11 w-11 flex items-center justify-center text-[#3d3d3d] hover:text-[#ff3b30] hover:bg-[#ff3b30]/[0.08] rounded-[10px] transition-all"
                    >
                        <Trash2 size={17} />
                    </button>
                )}
            </div>

            {showDel && (
                <>
                    <div className="hidden md:block bg-[#111111] border border-[#ff3b30]/20 rounded-[16px] p-5 scale-in">
                        <p className="text-[15px] font-semibold mb-1 text-[#f0ece4]">Удалить запчасть?</p>
                        <p className="text-[13px] text-[#6b6b6b] mb-4">Это действие нельзя отменить</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDel(false)} className="flex-1 h-10 bg-[#1a1a1a] border border-white/[0.08] rounded-[10px] text-[14px] font-medium text-[#f0ece4] hover:bg-white/[0.04] transition-colors">Отмена</button>
                            <button onClick={handleDelete} disabled={loading} className="flex-1 h-10 bg-[#ff3b30] text-white rounded-[10px] text-[14px] font-medium hover:bg-[#e0352b] transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                                {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                Удалить
                            </button>
                        </div>
                    </div>
                    <div className="md:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setShowDel(false)} />
                    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111111] border-t border-white/[0.06] rounded-t-[20px] px-5 pt-5 pb-8 shadow-xl slide-in-from-bottom">
                        <div className="w-10 h-1 bg-white/[0.10] rounded-full mx-auto mb-6" />
                        <p className="text-[17px] font-bold mb-1 text-[#f0ece4]">Удалить запчасть?</p>
                        <p className="text-[14px] text-[#6b6b6b] mb-6">Это действие нельзя отменить</p>
                        <div className="flex flex-col gap-3">
                            <button onClick={handleDelete} disabled={loading} className="w-full h-12 bg-[#ff3b30] text-white font-medium rounded-[12px] text-[16px] flex items-center justify-center gap-2 disabled:opacity-60">
                                {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                Удалить
                            </button>
                            <button onClick={() => setShowDel(false)} className="w-full h-12 bg-[#1a1a1a] text-[#f0ece4] font-medium rounded-[12px] border border-white/[0.08] text-[16px]">Отмена</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
