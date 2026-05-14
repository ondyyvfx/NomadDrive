'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
    LayoutDashboard, Car, ShoppingBag,
    Wrench, Calendar, Package,
    ChevronRight, Menu, X, LogOut
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Обзор', exact: true },
    { href: '/admin/cars', icon: Car, label: 'Аренда авто' },
    { href: '/admin/sale', icon: ShoppingBag, label: 'Продажа' },
    { href: '/admin/parts', icon: Wrench, label: 'Запчасти' },
    { href: '/admin/bookings', icon: Calendar, label: 'Брони' },
    { href: '/admin/orders', icon: Package, label: 'Заказы' },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [open, setOpen] = useState(false)

    async function handleLogout() {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/')
    }

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="px-5 py-5 border-b border-white/[0.06]">
                <Link href="/" className="font-semibold text-[18px] tracking-tight text-[#f0ece4]">
                    Nomad<span className="text-[#c9a96e]">Drive</span>
                </Link>
                <p className="text-[12px] text-[#6b6b6b] mt-0.5">Admin Panel</p>
            </div>

            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                {navItems.map(({ href, icon: Icon, label, exact }) => {
                    const active = exact ? pathname === href : pathname.startsWith(href)
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-medium transition-all duration-200 ${active
                                    ? 'bg-[#c9a96e] text-[#0a0a0a]'
                                    : 'text-[#6b6b6b] hover:bg-white/[0.04] hover:text-[#f0ece4]'
                                }`}
                        >
                            <Icon size={17} />
                            {label}
                            {active && <ChevronRight size={14} className="ml-auto opacity-60" />}
                        </Link>
                    )
                })}
            </nav>

            <div className="px-3 py-4 border-t border-white/[0.06]">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-medium text-[#6b6b6b] hover:bg-white/[0.04] hover:text-[#f0ece4] transition-all duration-200 mb-1"
                >
                    <ChevronRight size={17} className="rotate-180" />
                    На сайт
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-medium text-[#6b6b6b] hover:bg-[#ff3b30]/[0.08] hover:text-[#ff3b30] transition-all duration-200"
                >
                    <LogOut size={17} />
                    Выйти
                </button>
            </div>
        </div>
    )

    return (
        <>
            <aside className="hidden md:flex w-[220px] flex-shrink-0 bg-[#111111] border-r border-white/[0.06] flex-col h-screen sticky top-0">
                <SidebarContent />
            </aside>

            <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[#111111] border-b border-white/[0.06] flex items-center justify-between px-5">
                <Link href="/" className="font-semibold text-[17px] tracking-tight text-[#f0ece4]">
                    Nomad<span className="text-[#c9a96e]">Drive</span>
                    <span className="text-[12px] font-normal text-[#6b6b6b] ml-1.5">Admin</span>
                </Link>
                <button
                    onClick={() => setOpen(p => !p)}
                    className="w-9 h-9 flex items-center justify-center rounded-[8px] text-[#f0ece4] hover:bg-white/[0.04] transition-colors"
                >
                    {open ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {open && (
                <>
                    <div
                        className="md:hidden fixed inset-0 z-40 bg-black/60"
                        onClick={() => setOpen(false)}
                    />
                    <div className="md:hidden fixed top-14 left-0 bottom-0 w-[260px] z-50 bg-[#111111] border-r border-white/[0.06] shadow-xl slide-in-from-left">
                        <SidebarContent />
                    </div>
                </>
            )}

            <div className="md:hidden h-14 w-full" />
        </>
    )
}
