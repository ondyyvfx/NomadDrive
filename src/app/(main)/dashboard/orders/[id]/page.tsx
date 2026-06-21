import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { getServerDict } from '@/lib/i18n.server'
import { ChevronLeft, Package, Clock, CheckCircle2, XCircle, ShoppingBag } from 'lucide-react'

export default async function OrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()
    const { dash: t, common } = await getServerDict()

    const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode; step: number }> = {
        pending: { label: t.stProcessing, color: 'text-[#ff9f0a] bg-[#ff9f0a]/[0.08]', icon: <Clock size={14} />, step: 1 },
        confirmed: { label: t.stConfirmedM, color: 'text-[#34c759] bg-[#34c759]/[0.08]', icon: <CheckCircle2 size={14} />, step: 2 },
        shipped: { label: t.stShipped, color: 'text-[#c9a96e] bg-[#c9a96e]/[0.08]', icon: <CheckCircle2 size={14} />, step: 3 },
        delivered: { label: t.stDelivered, color: 'text-[#34c759] bg-[#34c759]/[0.08]', icon: <CheckCircle2 size={14} />, step: 4 },
        cancelled: { label: t.stCancelledM, color: 'text-[#ff3b30] bg-[#ff3b30]/[0.08]', icon: <XCircle size={14} />, step: 0 },
    }

    const steps = [t.stProcessing, t.stConfirmedM, t.stShipped, t.stDelivered]

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

    const partIds = items?.filter(i => i.product_type === 'part').map(i => i.product_id) ?? []
    const { data: parts } = partIds.length
        ? await supabase.from('parts').select('id, name, brand, image_urls, price').in('id', partIds)
        : { data: [] }

    const s = statusConfig[order.status] ?? statusConfig.pending

    return (
        <div className="max-w-[800px] mx-auto px-5 py-10">

            <div className="flex items-center gap-2 mb-8 fade-in">
                <Link
                    href="/dashboard/orders"
                    className="inline-flex items-center gap-1.5 text-[14px] text-[#6b6b6b] hover:text-[#f0ece4] transition-colors"
                >
                    <ChevronLeft size={16} />
                    {t.orders}
                </Link>
                <span className="text-[#3d3d3d]">/</span>
                <span className="text-[14px] text-[#f0ece4]">#{order.id.slice(0, 8).toUpperCase()}</span>
            </div>

            <div className="flex flex-col gap-5">

                <div className="bg-[#111111] border border-white/[0.07] rounded-[16px] p-6 fade-in">
                    <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
                        <div>
                            <p className="text-[13px] text-[#6b6b6b] mb-1">{t.orderNumber}</p>
                            <p className="text-[20px] font-bold tracking-tight text-[#f0ece4]">
                                #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                        </div>
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-medium ${s.color}`}>
                            {s.icon}
                            {s.label}
                        </span>
                    </div>

                    {order.status !== 'cancelled' && (
                        <div className="flex items-center gap-0">
                            {steps.map((step, i) => {
                                const stepNum = i + 1
                                const isActive = s.step >= stepNum
                                const isLast = i === steps.length - 1
                                return (
                                    <div key={step} className="flex items-center flex-1 last:flex-none">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold transition-colors ${isActive ? 'bg-[#c9a96e] text-[#0a0a0a]' : 'bg-[#1a1a1a] text-[#3d3d3d]'
                                                }`}>
                                                {isActive ? '✓' : stepNum}
                                            </div>
                                            <p className={`text-[10px] text-center leading-tight ${isActive ? 'text-[#c9a96e] font-medium' : 'text-[#3d3d3d]'
                                                }`}>
                                                {step}
                                            </p>
                                        </div>
                                        {!isLast && (
                                            <div className={`h-0.5 flex-1 mx-1 mb-4 transition-colors ${s.step > stepNum ? 'bg-[#c9a96e]' : 'bg-[#1a1a1a]'
                                                }`} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="bg-[#111111] border border-white/[0.07] rounded-[16px] p-6 fade-in-up">
                    <h2 className="text-[15px] font-bold tracking-tight mb-4 flex items-center gap-2 text-[#f0ece4]">
                        <ShoppingBag size={16} className="text-[#c9a96e]" />
                        {t.orderItems}
                    </h2>
                    <div className="flex flex-col gap-3">
                        {items?.map(item => {
                            const part = parts?.find(p => p.id === item.product_id)
                            return (
                                <div key={item.id} className="flex items-center gap-4">
                                    <div className="relative w-14 h-14 bg-[#161616] rounded-[10px] overflow-hidden flex-shrink-0">
                                        {part?.image_urls?.[0] ? (
                                            <Image
                                                src={part.image_urls[0]}
                                                alt={part.name}
                                                fill sizes="56px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package size={20} className="text-[#3d3d3d]" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[14px] font-semibold truncate text-[#f0ece4]">
                                            {part?.name ?? t.partFallback}
                                        </p>
                                        <p className="text-[12px] text-[#6b6b6b]">
                                            {part?.brand} · {item.quantity} {t.pcs}
                                        </p>
                                    </div>
                                    <p className="text-[14px] font-semibold flex-shrink-0 text-[#f0ece4]">
                                        {(item.price * item.quantity).toLocaleString(common.locale)} ₸
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="bg-[#111111] border border-white/[0.07] rounded-[16px] p-6 fade-in-up">
                    <h2 className="text-[15px] font-bold tracking-tight mb-4 text-[#f0ece4]">{t.payment}</h2>
                    <div className="flex flex-col gap-2.5">
                        <div className="flex justify-between text-[14px]">
                            <span className="text-[#6b6b6b]">{t.paymentStatus}</span>
                            <span className={`font-medium ${order.payment_status === 'paid' ? 'text-[#34c759]' : 'text-[#ff9f0a]'
                                }`}>
                                {order.payment_status === 'paid' ? t.paid :
                                    order.payment_status === 'refunded' ? t.refunded : t.unpaid}
                            </span>
                        </div>
                        <div className="h-px bg-white/[0.06] my-1" />
                        <div className="flex justify-between">
                            <span className="text-[16px] font-bold text-[#f0ece4]">{t.total}</span>
                            <span className="text-[16px] font-bold text-[#c9a96e]">
                                {order.total.toLocaleString(common.locale)} ₸
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
