'use client'

import { useDict } from '@/contexts/LanguageContext'

const classesByStatus: Record<string, string> = {
    pending: 'text-[#ff9f0a] bg-[#ff9f0a]/[0.08]',
    confirmed: 'text-[#34c759] bg-[#34c759]/[0.08]',
    active: 'text-[#34c759] bg-[#34c759]/[0.08]',
    completed: 'text-[#6e6e73] bg-[#6e6e73]/[0.08]',
    cancelled: 'text-[#ff3b30] bg-[#ff3b30]/[0.08]',
    delivered: 'text-[#34c759] bg-[#34c759]/[0.08]',
    shipped: 'text-accent bg-accent/[0.08]',
    available: 'text-[#34c759] bg-[#34c759]/[0.08]',
    sold: 'text-[#ff3b30] bg-[#ff3b30]/[0.08]',
    reserved: 'text-[#ff9f0a] bg-[#ff9f0a]/[0.08]',
    rented: 'text-[#ff9f0a] bg-[#ff9f0a]/[0.08]',
    maintenance: 'text-[#6e6e73] bg-[#6e6e73]/[0.08]',
}

export function AdminStatusBadge({ status }: { status: string }) {
    const { admin: t } = useDict()
    const labelByStatus: Record<string, string> = {
        pending: t.stPending,
        confirmed: t.stConfirmed,
        active: t.stActive,
        completed: t.stCompleted,
        cancelled: t.stCancelled,
        delivered: t.stDelivered,
        shipped: t.stShipped,
        available: t.stAvailable,
        sold: t.stSold,
        reserved: t.stReserved,
        rented: t.stRented,
        maintenance: t.stMaintenance,
    }
    const classes = classesByStatus[status] ?? 'text-[#6e6e73] bg-[#6e6e73]/[0.08]'
    const label = labelByStatus[status] ?? status
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium ${classes}`}>
            {label}
        </span>
    )
}
