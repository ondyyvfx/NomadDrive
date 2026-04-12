const config: Record<string, { label: string; classes: string }> = {
    pending: { label: 'Ожидает', classes: 'text-[#ff9f0a] bg-[#ff9f0a]/[0.08]' },
    confirmed: { label: 'Подтверждён', classes: 'text-[#34c759] bg-[#34c759]/[0.08]' },
    active: { label: 'Активна', classes: 'text-[#34c759] bg-[#34c759]/[0.08]' },
    completed: { label: 'Завершён', classes: 'text-[#6e6e73] bg-[#6e6e73]/[0.08]' },
    cancelled: { label: 'Отменён', classes: 'text-[#ff3b30] bg-[#ff3b30]/[0.08]' },
    delivered: { label: 'Доставлен', classes: 'text-[#34c759] bg-[#34c759]/[0.08]' },
    shipped: { label: 'В доставке', classes: 'text-accent bg-accent/[0.08]' },
    available: { label: 'Доступен', classes: 'text-[#34c759] bg-[#34c759]/[0.08]' },
    sold: { label: 'Продан', classes: 'text-[#ff3b30] bg-[#ff3b30]/[0.08]' },
    reserved: { label: 'Резерв', classes: 'text-[#ff9f0a] bg-[#ff9f0a]/[0.08]' },
    rented: { label: 'Занят', classes: 'text-[#ff9f0a] bg-[#ff9f0a]/[0.08]' },
    maintenance: { label: 'На ТО', classes: 'text-[#6e6e73] bg-[#6e6e73]/[0.08]' },
}

export function AdminStatusBadge({ status }: { status: string }) {
    const s = config[status] ?? { label: status, classes: 'text-[#6e6e73] bg-[#6e6e73]/[0.08]' }
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium ${s.classes}`}>
            {s.label}
        </span>
    )
}