'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    ShoppingCart, Trash2, Plus, Minus,
    Package, ChevronRight, ArrowLeft, Tag
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { CartItem } from '@/types'

const CART_KEY = 'nomaddrive_cart'

export default function CartPage() {
    const router = useRouter()
    const [cart, setCart] = useState<CartItem[]>([])
    const [mounted, setMounted] = useState(false)
    const [promoCode, setPromoCode] = useState('')
    const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number; type: string } | null>(null)
    const [promoLoading, setPromoLoading] = useState(false)
    const [promoError, setPromoError] = useState('')
    const [loading, setLoading] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    useEffect(() => {
        try {
            const saved = localStorage.getItem(CART_KEY)
            if (saved) setCart(JSON.parse(saved))
        } catch { }
        setMounted(true)
    }, [])

    function saveCart(items: CartItem[]) {
        setCart(items)
        localStorage.setItem(CART_KEY, JSON.stringify(items))
    }

    function updateQty(productId: string, delta: number) {
        const updated = cart
            .map(i => i.product_id === productId ? { ...i, quantity: i.quantity + delta } : i)
            .filter(i => i.quantity > 0)
        saveCart(updated)
    }

    function removeItem(productId: string) {
        saveCart(cart.filter(i => i.product_id !== productId))
        setDeleteId(null)
    }

    function clearCart() {
        saveCart([])
        setPromoApplied(null)
    }

    async function applyPromo() {
        if (!promoCode.trim()) return
        setPromoLoading(true)
        setPromoError('')
        setPromoApplied(null)

        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('promo_codes')
                .select('*')
                .eq('code', promoCode.trim().toUpperCase())
                .eq('is_active', true)
                .single()

            if (error || !data) throw new Error('Промокод не найден')
            if (data.expires_at && new Date(data.expires_at) < new Date())
                throw new Error('Промокод истёк')
            if (data.max_uses && data.used_count >= data.max_uses)
                throw new Error('Промокод исчерпан')

            setPromoApplied({ code: data.code, discount: data.value, type: data.type })
        } catch (err: unknown) {
            setPromoError(err instanceof Error ? err.message : 'Ошибка')
        } finally {
            setPromoLoading(false)
        }
    }

    async function handleCheckout() {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            router.push('/login?redirect=/cart')
            return
        }

        setLoading(true)
        try {
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    total: totalPrice,
                    status: 'pending',
                    type: 'parts',
                    payment_status: 'unpaid',
                })
                .select()
                .single()

            if (orderError) throw orderError

            const items = cart.map(i => ({
                order_id: order.id,
                product_type: 'part' as const,
                product_id: i.product_id,
                quantity: i.quantity,
                price: i.price,
            }))

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(items)

            if (itemsError) throw itemsError

            clearCart()
            router.push(`/dashboard/orders/${order.id}`)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
    const discount = promoApplied
        ? promoApplied.type === 'percent'
            ? Math.round(subtotal * promoApplied.discount / 100)
            : promoApplied.discount
        : 0
    const totalPrice = Math.max(0, subtotal - discount)
    const totalItems = cart.reduce((s, i) => s + i.quantity, 0)

    if (!mounted) return null

    /* ── Пустая корзина ── */
    if (cart.length === 0) {
        return (
            <div className="max-w-[1200px] mx-auto px-5 py-10">
                <div className="flex items-center gap-2 mb-8 fade-in">
                    <Link
                        href="/parts"
                        className="inline-flex items-center gap-1.5 text-[14px] text-[#6b6b6b] hover:text-[#f0ece4] transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Запчасти
                    </Link>
                </div>

                <div className="text-center py-24 fade-in">
                    <div className="w-20 h-20 bg-[#111111] border border-white/[0.06] rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart size={32} className="text-[#3d3d3d]" />
                    </div>
                    <h1 className="text-[24px] font-bold tracking-tight mb-2 text-[#f0ece4]">
                        Корзина пуста
                    </h1>
                    <p className="text-[15px] text-[#6b6b6b] mb-8 max-w-xs mx-auto">
                        Добавьте запчасти из каталога чтобы оформить заказ
                    </p>
                    <Link
                        href="/parts"
                        className="inline-flex h-12 px-8 bg-[#c9a96e] text-[#0a0a0a] font-semibold rounded-[10px] hover:bg-[#d4b87a] transition-all duration-300 items-center gap-2 text-[15px]"
                    >
                        Перейти в каталог
                        <ChevronRight size={16} />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-[1200px] mx-auto px-5 py-10">

            {/* Header */}
            <div className="flex items-center justify-between mb-8 fade-in">
                <div>
                    <Link
                        href="/parts"
                        className="inline-flex items-center gap-1.5 text-[14px] text-[#6b6b6b] hover:text-[#f0ece4] transition-colors mb-2"
                    >
                        <ArrowLeft size={16} />
                        Продолжить покупки
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#f0ece4]">
                        Корзина
                        <span className="ml-2 text-[#3d3d3d] font-normal text-xl">
                            {totalItems} {totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров'}
                        </span>
                    </h1>
                </div>

                <button
                    onClick={clearCart}
                    className="hidden md:inline-flex items-center gap-2 text-[14px] text-[#6b6b6b] hover:text-[#ff3b30] transition-colors"
                >
                    <Trash2 size={15} />
                    Очистить корзину
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

                {/* ── Список товаров ── */}
                <div className="flex flex-col gap-3 stagger-children">
                    {cart.map(item => (
                        <div
                            key={item.product_id}
                            className="bg-[#111111] border border-white/[0.07] rounded-[14px] p-4 flex gap-4 items-start hover:border-white/[0.12] transition-all duration-200"
                        >
                            {/* Фото */}
                            <div className="relative w-20 h-20 bg-[#161616] rounded-[10px] overflow-hidden flex-shrink-0">
                                {item.image_url ? (
                                    <Image
                                        src={item.image_url}
                                        alt={item.name}
                                        fill
                                        sizes="80px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Package size={24} className="text-[#3d3d3d]" />
                                    </div>
                                )}
                            </div>

                            {/* Инфо */}
                            <div className="flex-1 min-w-0">
                                <p className="text-[15px] font-bold text-[#f0ece4] tracking-tight leading-tight mb-1 truncate">
                                    {item.name}
                                </p>
                                <p className="text-[13px] text-[#6b6b6b] mb-3">
                                    {item.price.toLocaleString('ru-RU')} ₸ / шт.
                                </p>

                                <div className="flex items-center justify-between gap-4 flex-wrap">
                                    {/* Кол-во */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQty(item.product_id, -1)}
                                            className="w-8 h-8 rounded-[8px] bg-[#1a1a1a] border border-white/[0.06] hover:bg-white/[0.06] flex items-center justify-center transition-colors text-[#f0ece4]"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-8 text-center text-[15px] font-bold text-[#f0ece4]">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQty(item.product_id, +1)}
                                            className="w-8 h-8 rounded-[8px] bg-[#1a1a1a] border border-white/[0.06] hover:bg-white/[0.06] flex items-center justify-center transition-colors text-[#f0ece4]"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    {/* Сумма + удалить */}
                                    <div className="flex items-center gap-3">
                                        <p className="text-[16px] font-bold text-[#f0ece4]">
                                            {(item.price * item.quantity).toLocaleString('ru-RU')} ₸
                                        </p>

                                        {/* Desktop — кнопка удалить */}
                                        <button
                                            onClick={() => removeItem(item.product_id)}
                                            className="hidden md:flex w-8 h-8 rounded-[8px] text-[#3d3d3d] hover:text-[#ff3b30] hover:bg-[#ff3b30]/[0.06] items-center justify-center transition-all"
                                        >
                                            <Trash2 size={15} />
                                        </button>

                                        {/* Mobile — bottom sheet удаления */}
                                        <button
                                            onClick={() => setDeleteId(item.product_id)}
                                            className="md:hidden w-8 h-8 rounded-[8px] text-[#3d3d3d] hover:text-[#ff3b30] hover:bg-[#ff3b30]/[0.06] flex items-center justify-center transition-all"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Очистить — mobile */}
                    <button
                        onClick={clearCart}
                        className="md:hidden inline-flex items-center justify-center gap-2 h-11 text-[14px] text-[#6b6b6b] hover:text-[#ff3b30] transition-colors border border-white/[0.08] rounded-[10px]"
                    >
                        <Trash2 size={15} />
                        Очистить корзину
                    </button>
                </div>

                {/* ── Итог ── */}
                <div className="lg:sticky lg:top-[76px] h-fit">
                    <div className="bg-[#111111] border border-white/[0.08] rounded-[20px] shadow-lg overflow-hidden scale-in">

                        <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
                            <p className="text-[17px] font-bold tracking-tight text-[#f0ece4]">Итого заказа</p>
                        </div>

                        <div className="p-6 flex flex-col gap-5">

                            {/* Промокод */}
                            <div>
                                <p className="text-[13px] font-medium text-[#6b6b6b] mb-2 flex items-center gap-1.5">
                                    <Tag size={13} />
                                    Промокод
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={e => {
                                            setPromoCode(e.target.value.toUpperCase())
                                            setPromoApplied(null)
                                            setPromoError('')
                                        }}
                                        placeholder="NOMAD2025"
                                        disabled={!!promoApplied}
                                        className="flex-1 h-10 px-3.5 bg-[#161616] border border-white/[0.08] rounded-[10px] text-[14px] text-[#f0ece4] uppercase placeholder:normal-case placeholder:text-[#3d3d3d] outline-none focus:border-[#c9a96e] focus:ring-3 focus:ring-[#c9a96e]/[0.10] transition-all disabled:opacity-40"
                                    />
                                    {promoApplied ? (
                                        <button
                                            onClick={() => { setPromoApplied(null); setPromoCode('') }}
                                            className="h-10 px-3 text-[#ff3b30] hover:bg-[#ff3b30]/[0.06] rounded-[10px] transition-colors"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={applyPromo}
                                            disabled={promoLoading || !promoCode.trim()}
                                            className="h-10 px-4 bg-[#1a1a1a] border border-white/[0.08] rounded-[10px] text-[13px] font-medium text-[#f0ece4] hover:bg-white/[0.04] transition-colors disabled:opacity-40"
                                        >
                                            {promoLoading ? '...' : 'Применить'}
                                        </button>
                                    )}
                                </div>
                                {promoError && (
                                    <p className="text-[12px] text-[#ff3b30] mt-1.5">{promoError}</p>
                                )}
                                {promoApplied && (
                                    <p className="text-[12px] text-[#34c759] mt-1.5">
                                        ✓ {promoApplied.code} — скидка{' '}
                                        {promoApplied.type === 'percent'
                                            ? `${promoApplied.discount}%`
                                            : `${promoApplied.discount.toLocaleString('ru-RU')} ₸`}
                                    </p>
                                )}
                            </div>

                            {/* Расчёт */}
                            <div className="flex flex-col gap-2.5">
                                <div className="flex justify-between text-[14px]">
                                    <span className="text-[#6b6b6b]">
                                        Товары ({totalItems} шт.)
                                    </span>
                                    <span className="font-medium text-[#f0ece4]">
                                        {subtotal.toLocaleString('ru-RU')} ₸
                                    </span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-[14px]">
                                        <span className="text-[#6b6b6b]">Скидка</span>
                                        <span className="text-[#34c759] font-medium">
                                            −{discount.toLocaleString('ru-RU')} ₸
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-[14px]">
                                    <span className="text-[#6b6b6b]">Доставка</span>
                                    <span className="text-[#34c759] font-medium">Бесплатно</span>
                                </div>
                                <div className="h-px bg-white/[0.06] my-1" />
                                <div className="flex justify-between">
                                    <span className="text-[16px] font-bold text-[#f0ece4]">К оплате</span>
                                    <span className="text-[16px] font-bold text-[#c9a96e]">
                                        {totalPrice.toLocaleString('ru-RU')} ₸
                                    </span>
                                </div>
                            </div>

                            {/* Оформить */}
                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className="w-full h-12 bg-[#c9a96e] text-[#0a0a0a] font-bold rounded-[12px] hover:bg-[#d4b87a] transition-all duration-300 flex items-center justify-center gap-2 text-[15px] disabled:opacity-40"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Оформить заказ
                                        <ChevronRight size={16} />
                                    </>
                                )}
                            </button>

                            <p className="text-[12px] text-[#3d3d3d] text-center leading-relaxed">
                                Оформляя заказ, вы соглашаетесь с условиями платформы
                            </p>

                        </div>
                    </div>
                </div>
            </div>

            {/* ── Mobile delete bottom sheet ── */}
            {deleteId && (
                <>
                    <div
                        className="md:hidden fixed inset-0 z-40"
                        style={{ background: 'rgba(0,0,0,0.6)' }}
                        onClick={() => setDeleteId(null)}
                    />
                    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111111] rounded-t-[20px] px-5 pt-5 pb-8 shadow-lg border-t border-white/[0.06] slide-in-from-bottom">
                        <div className="w-10 h-1 bg-white/[0.10] rounded-full mx-auto mb-6" />
                        <p className="text-[17px] font-bold tracking-tight mb-1 text-[#f0ece4]">
                            Удалить товар?
                        </p>
                        <p className="text-[14px] text-[#6b6b6b] mb-6">
                            {cart.find(i => i.product_id === deleteId)?.name}
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => removeItem(deleteId)}
                                className="w-full h-12 bg-[#ff3b30] text-white font-semibold rounded-[12px] hover:bg-[#e0352b] transition-colors text-[16px]"
                            >
                                Удалить
                            </button>
                            <button
                                onClick={() => setDeleteId(null)}
                                className="w-full h-12 bg-[#1a1a1a] text-[#f0ece4] font-medium rounded-[12px] border border-white/[0.08] hover:bg-white/[0.04] transition-colors text-[16px]"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </>
            )}

        </div>
    )
}
