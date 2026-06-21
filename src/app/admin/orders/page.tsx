import { createClient } from '@/lib/supabase/server'
import { getServerDict } from '@/lib/i18n.server'
import Link from 'next/link'
import { Package } from 'lucide-react'
import { AdminStatusBadge } from '../AdminStatusBadge'

export async function generateMetadata() {
    const { admin: t } = await getServerDict()
    return { title: `Admin — ${t.ordersTitle}` }
}

export default async function AdminOrdersPage() {
    const supabase = await createClient()
    const { admin: t, common } = await getServerDict()

    const { data: orders } = await supabase
        .from('orders')
        .select('*, profile:profiles(full_name, phone), items:order_items(id)')
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-[1000px]">
            <div className="mb-8 fade-in">
                <h1 className="text-2xl font-bold tracking-[-0.04em] text-[#f0ece4]">{t.ordersTitle}</h1>
                <p className="text-[14px] text-[#6b6b6b] mt-1">{t.total} {orders?.length ?? 0}</p>
            </div>

            <div className="bg-[#111111] border border-white/[0.07] rounded-[16px] overflow-hidden fade-in">
                {/* Desktop */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                {[t.thId, t.thClient, t.thType, t.thItems, t.thSum, t.thStatus, t.thPayment].map(h => (
                                    <th key={h} className="text-left px-5 py-3.5 text-[12px] font-semibold text-[#6b6b6b] uppercase tracking-wide">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05]">
                            {orders?.map(o => {
                                const profile = o.profile as { full_name: string | null; phone: string | null } | null
                                const itemCount = (o.items as unknown[])?.length ?? 0
                                return (
                                    <tr key={o.id} className="hover:bg-white/[0.03] transition-colors">
                                        <td className="px-5 py-3.5">
                                            <Link
                                                href={`/dashboard/orders/${o.id}`}
                                                className="text-[13px] font-mono text-[#c9a96e] hover:underline"
                                            >
                                                #{o.id.slice(0, 8).toUpperCase()}
                                            </Link>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <p className="text-[13px] font-medium text-[#f0ece4]">{profile?.full_name ?? '—'}</p>
                                            <p className="text-[11px] text-[#3d3d3d]">{profile?.phone ?? '—'}</p>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="text-[12px] px-2.5 py-1 bg-white/[0.05] rounded-full text-[#6b6b6b]">
                                                {o.type === 'parts' ? t.typeParts : t.typeCar}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-[13px] text-[#6b6b6b]">
                                            {itemCount} {t.pcs}
                                        </td>
                                        <td className="px-5 py-3.5 text-[13px] font-semibold text-[#f0ece4]">
                                            {o.total.toLocaleString(common.locale)} ₸
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <AdminStatusBadge status={o.status} />
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`text-[12px] font-medium ${o.payment_status === 'paid' ? 'text-[#34c759]' : 'text-[#ff9f0a]'
                                                }`}>
                                                {o.payment_status === 'paid' ? t.payPaid : t.payPending}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile */}
                <div className="md:hidden divide-y divide-white/[0.05]">
                    {orders?.map(o => {
                        const profile = o.profile as { full_name: string | null } | null
                        return (
                            <Link
                                key={o.id}
                                href={`/dashboard/orders/${o.id}`}
                                className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.03] transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#b8860b]/[0.07] rounded-[10px] flex items-center justify-center flex-shrink-0">
                                        <Package size={18} className="text-[#b8860b]" />
                                    </div>
                                    <div>
                                        <p className="text-[14px] font-semibold text-[#f0ece4]">
                                            #{o.id.slice(0, 8).toUpperCase()}
                                        </p>
                                        <p className="text-[12px] text-[#6b6b6b]">{profile?.full_name ?? '—'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <AdminStatusBadge status={o.status} />
                                    <p className="text-[13px] font-semibold text-[#f0ece4] mt-1">
                                        {o.total.toLocaleString(common.locale)} ₸
                                    </p>
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {!orders?.length && (
                    <p className="text-center py-16 text-[14px] text-[#3d3d3d]">{t.noOrders}</p>
                )}
            </div>
        </div>
    )
}
