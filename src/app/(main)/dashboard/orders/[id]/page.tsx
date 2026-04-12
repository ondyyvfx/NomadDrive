import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { ChevronLeft, Package, Clock, CheckCircle2, XCircle, ShoppingBag } from 'lucide-react'

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode; step: number }> = {
    pending: { label: 'В обработке', color: 'text-[#ff9f0a] bg-[#ff9f0a]/[0.08]', icon: <Clock size={14} />, step: 1 },
    confirmed: { label: 'Подтверждён', color: 'text-[#34c759] bg-[#34c759]/[0.08]', icon: <CheckCircle2 size={14} />, step: 2 },
    shipped: { label: 'В доставке', color: 'text-accent bg-accent/[0.08]', icon: <CheckCircle2 size={14} />, step: 3 },
    delivered: { label: 'Доставлен', color: 'text-[#34c759] bg-[#34c759]/[0.08]', icon: <CheckCircle2 size={14} />, step: 4 },
    cancelled: { label: 'Отменён', color: 'text-[#ff3b30] bg-[#ff3b30]/[0.08]', icon: <XCircle size={14} />, step: 0 },
}

const steps = ['В обработке', 'Подтверждён', 'В доставке', 'Доставлен']

export default async function OrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (!order) notFound()

    const { data: items } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id)

    // Загружаем детали запчастей
    const partIds = items?.filter(i => i.product_type === 'part').map(i => i.product_id) ?? []
    const { data: parts } = partIds.length
        ? await supabase.from('parts').select('id, name, brand, image_urls, price').in('id', partIds)
        : { data: [] }

    const s = statusConfig[order.status] ?? statusConfig.pending

    return (
        <div className="max-w-[800px] mx-auto px-5 py-10">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8 fade-in">
                <Link
                    href="/dashboard/orders"
                    className="inline-flex items-center gap-1.5 text-[14px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                >
                    <ChevronLeft size={16} />
                    Заказы
                </Link>
                <span className="text-[#aeaeb2]">/</span>
                <span className="text-[14px]">#{order.id.slice(0, 8).toUpperCase()}</span>
            </div>

            <div className="flex flex-col gap-5">

                {/* Статус */}
                <div className="bg-white border border-black/[0.06] rounded-[16px] p-6 fade-in">
                    <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
                        <div>
                            <p className="text-[13px] text-[#6e6e73] mb-1">Номер заказа</p>
                            <p className="text-[20px] font-semibold tracking-tight">
                                #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                        </div>
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-medium ${s.color}`}>
                            {s.icon}
                            {s.label}
                        </span>
                    </div>

                    {/* Прогресс */}
                    {order.status !== 'cancelled' && (
                        <div className="flex items-center gap-0">
                            {steps.map((step, i) => {
                                const stepNum = i + 1
                                const isActive = s.step >= stepNum
                                const isLast = i === steps.length - 1
                                return (
                                    <div key={step} className="flex items-center flex-1 last:flex-none">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold transition-colors ${isActive ? 'bg-accent text-white' : 'bg-[#f5f5f7] text-[#aeaeb2]'
                                                }`}>
                                                {isActive ? '✓' : stepNum}
                                            </div>
                                            <p className={`text-[10px] text-center leading-tight ${isActive ? 'text-accent font-medium' : 'text-[#aeaeb2]'
                                                }`}>
                                                {step}
                                            </p>
                                        </div>
                                        {!isLast && (
                                            <div className={`h-0.5 flex-1 mx-1 mb-4 transition-colors ${s.step > stepNum ? 'bg-accent' : 'bg-[#f5f5f7]'
                                                }`} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Товары */}
                <div className="bg-white border border-black/[0.06] rounded-[16px] p-6 fade-in-up">
                    <h2 className="text-[15px] font-semibold tracking-tight mb-4 flex items-center gap-2">
                        <ShoppingBag size={16} className="text-accent" />
                        Состав заказа
                    </h2>
                    <div className="flex flex-col gap-3">
                        {items?.map(item => {
                            const part = parts?.find(p => p.id === item.product_id)
                            return (
                                <div key={item.id} className="flex items-center gap-4">
                                    <div className="relative w-14 h-14 bg-[#f5f5f7] rounded-[10px] overflow-hidden flex-shrink-0">
                                        {part?.image_urls?.[0] ? (
                                            <Image
                                                src={part.image_urls[0]}
                                                alt={part.name}
                                                fill sizes="56px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package size={20} className="text-[#aeaeb2]" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[14px] font-semibold truncate">
                                            {part?.name ?? 'Запчасть'}
                                        </p>
                                        <p className="text-[12px] text-[#6e6e73]">
                                            {part?.brand} · {item.quantity} шт.
                                        </p>
                                    </div>
                                    <p className="text-[14px] font-semibold flex-shrink-0">
                                        {(item.price * item.quantity).toLocaleString('ru-RU')} ₸
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Итог */}
                <div className="bg-white border border-black/[0.06] rounded-[16px] p-6 fade-in-up">
                    <h2 className="text-[15px] font-semibold tracking-tight mb-4">Оплата</h2>
                    <div className="flex flex-col gap-2.5">
                        <div className="flex justify-between text-[14px]">
                            <span className="text-[#6e6e73]">Статус оплаты</span>
                            <span className={`font-medium ${order.payment_status === 'paid' ? 'text-[#34c759]' : 'text-[#ff9f0a]'
                                }`}>
                                {order.payment_status === 'paid' ? 'Оплачено' :
                                    order.payment_status === 'refunded' ? 'Возвращено' : 'Ожидает оплаты'}
                            </span>
                        </div>
                        <div className="h-px bg-black/[0.06] my-1" />
                        <div className="flex justify-between">
                            <span className="text-[16px] font-semibold">Итого</span>
                            <span className="text-[16px] font-semibold text-accent">
                                {order.total.toLocaleString('ru-RU')} ₸
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}