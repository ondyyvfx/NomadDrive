import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ShoppingBag, ChevronLeft, ChevronRight, Clock, CheckCircle2, XCircle } from 'lucide-react'

export const metadata = { title: 'Мои заказы' }

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: 'В обработке', color: 'text-[#ff9f0a] bg-[#ff9f0a]/[0.08]', icon: <Clock size={13} /> },
    confirmed: { label: 'Подтверждён', color: 'text-[#34c759] bg-[#34c759]/[0.08]', icon: <CheckCircle2 size={13} /> },
    shipped: { label: 'В доставке', color: 'text-[#c9a96e] bg-[#c9a96e]/[0.08]', icon: <CheckCircle2 size={13} /> },
    delivered: { label: 'Доставлен', color: 'text-[#34c759] bg-[#34c759]/[0.08]', icon: <CheckCircle2 size={13} /> },
    cancelled: { label: 'Отменён', color: 'text-[#ff3b30] bg-[#ff3b30]/[0.08]', icon: <XCircle size={13} /> },
}

export default async function OrdersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login?redirect=/dashboard/orders')

    const { data: orders } = await supabase
        .from('orders')
        .select('*, items:order_items(id)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-[1200px] mx-auto px-5 py-10">
            <div className="flex items-center gap-2 mb-8 fade-in">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 text-[14px] text-[#6b6b6b] hover:text-[#f0ece4] transition-colors"
                >
                    <ChevronLeft size={16} />
                    Кабинет
                </Link>
                <span className="text-[#3d3d3d]">/</span>
                <span className="text-[14px] text-[#f0ece4]">Заказы</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-[-0.04em] mb-8 fade-in text-[#f0ece4]">
                Мои заказы
            </h1>

            {!orders?.length ? (
                <div className="text-center py-20 fade-in">
                    <div className="w-16 h-16 bg-[#161616] rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag size={28} className="text-[#3d3d3d]" />
                    </div>
                    <p className="text-[18px] font-bold tracking-tight mb-2 text-[#f0ece4]">Нет заказов</p>
                    <p className="text-[14px] text-[#6b6b6b] mb-6">Оформите заказ в каталоге запчастей</p>
                    <Link
                        href="/parts"
                        className="inline-flex h-11 px-6 bg-[#c9a96e] text-[#0a0a0a] font-semibold rounded-[10px] hover:bg-[#d4b87a] transition-colors items-center text-[14px]"
                    >
                        Перейти в каталог
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4 stagger-children">
                    {orders.map(o => {
                        const s = statusConfig[o.status] ?? statusConfig.pending
                        const itemCount = (o.items as unknown[])?.length ?? 0
                        return (
                            <Link
                                key={o.id}
                                href={`/dashboard/orders/${o.id}`}
                                className="group bg-[#111111] border border-white/[0.07] rounded-[16px] p-5 flex items-center gap-5 hover:shadow-lg hover:-translate-y-0.5 hover:border-white/[0.12] transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-[#b8860b]/[0.07] rounded-[12px] flex items-center justify-center flex-shrink-0">
                                    <ShoppingBag size={24} className="text-[#b8860b]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <p className="text-[16px] font-bold tracking-tight text-[#f0ece4]">
                                            Заказ #{o.id.slice(0, 8).toUpperCase()}
                                        </p>
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-medium ${s.color}`}>
                                            {s.icon}{s.label}
                                        </span>
                                    </div>
                                    <p className="text-[13px] text-[#6b6b6b]">
                                        {new Date(o.created_at).toLocaleDateString('ru-RU', {
                                            day: 'numeric', month: 'long', year: 'numeric'
                                        })}
                                        {itemCount > 0 && (
                                            <span className="ml-2 text-[#3d3d3d]">
                                                · {itemCount} {itemCount === 1 ? 'позиция' : itemCount < 5 ? 'позиции' : 'позиций'}
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-[17px] font-bold tracking-tight text-[#f0ece4]">
                                        {o.total.toLocaleString('ru-RU')} ₸
                                    </p>
                                    <ChevronRight size={16} className="text-[#3d3d3d] group-hover:text-[#f0ece4] transition-colors ml-auto mt-1" />
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
