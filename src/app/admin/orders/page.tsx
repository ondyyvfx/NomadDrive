import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Package } from 'lucide-react'
import { AdminStatusBadge } from '../AdminStatusBadge'

export const metadata = { title: 'Admin — Заказы' }

export default async function AdminOrdersPage() {
    const supabase = await createClient()

    const { data: orders } = await supabase
        .from('orders')
        .select('*, profile:profiles(full_name, phone), items:order_items(id)')
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-[1000px]">
            <div className="mb-8 fade-in">
                <h1 className="text-2xl font-semibold tracking-tight">Заказы</h1>
                <p className="text-[14px] text-[#6e6e73] mt-1">Всего: {orders?.length ?? 0}</p>
            </div>

            <div className="bg-white border border-black/[0.06] rounded-[16px] overflow-hidden fade-in">
                {/* Desktop */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-black/[0.06]">
                                {['ID', 'Клиент', 'Тип', 'Позиций', 'Сумма', 'Статус', 'Оплата'].map(h => (
                                    <th key={h} className="text-left px-5 py-3.5 text-[12px] font-semibold text-[#6e6e73] uppercase tracking-wide">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[0.04]">
                            {orders?.map(o => {
                                const profile = o.profile as { full_name: string | null; phone: string | null } | null
                                const itemCount = (o.items as unknown[])?.length ?? 0
                                return (
                                    <tr key={o.id} className="hover:bg-[#f5f5f7] transition-colors">
                                        <td className="px-5 py-3.5">
                                            <Link
                                                href={`/dashboard/orders/${o.id}`}
                                                className="text-[13px] font-mono text-accent hover:underline"
                                            >
                                                #{o.id.slice(0, 8).toUpperCase()}
                                            </Link>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <p className="text-[13px] font-medium">{profile?.full_name ?? '—'}</p>
                                            <p className="text-[11px] text-[#aeaeb2]">{profile?.phone ?? '—'}</p>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="text-[12px] px-2.5 py-1 bg-[#f5f5f7] rounded-full text-[#6e6e73]">
                                                {o.type === 'parts' ? 'Запчасти' : 'Авто'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-[13px] text-[#6e6e73]">
                                            {itemCount} шт.
                                        </td>
                                        <td className="px-5 py-3.5 text-[13px] font-semibold">
                                            {o.total.toLocaleString('ru-RU')} ₸
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <AdminStatusBadge status={o.status} />
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`text-[12px] font-medium ${o.payment_status === 'paid' ? 'text-[#34c759]' : 'text-[#ff9f0a]'
                                                }`}>
                                                {o.payment_status === 'paid' ? 'Оплачен' : 'Ожидает'}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile */}
                <div className="md:hidden divide-y divide-black/[0.04]">
                    {orders?.map(o => {
                        const profile = o.profile as { full_name: string | null } | null
                        return (
                            <Link
                                key={o.id}
                                href={`/dashboard/orders/${o.id}`}
                                className="flex items-center justify-between px-5 py-4 hover:bg-[#f5f5f7] transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#b8860b]/[0.07] rounded-[10px] flex items-center justify-center flex-shrink-0">
                                        <Package size={18} className="text-[#b8860b]" />
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-semibold">
                                            #{o.id.slice(0, 8).toUpperCase()}
                                        </p>
                                        <p className="text-[12px] text-[#6e6e73]">{profile?.full_name ?? '—'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <AdminStatusBadge status={o.status} />
                                    <p className="text-[13px] font-semibold mt-1">
                                        {o.total.toLocaleString('ru-RU')} ₸
                                    </p>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {!orders?.length && (
                    <p className="text-center py-16 text-[14px] text-[#aeaeb2]">Нет заказов</p>
                )}
            </div>
        </div>
    )
}