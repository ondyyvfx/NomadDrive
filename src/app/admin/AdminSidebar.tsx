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

    function isActive(item: typeof navItems[0]) {
        return item.exact ? pathname === item.href : pathname.startsWith(item.href)
    }

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Лого */}
            <div className="px-5 py-5 border-b border-black/[0.06]">
                <Link href="/" className="font-semibold text-[18px] tracking-tight">
                    Nomad<span className="text-accent">Drive</span>
                </Link>
                <p className="text-[12px] text-[#6e6e73] mt-0.5">Admin Panel</p>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                {navItems.map(({ href, icon: Icon, label, exact }) => {
                    const active = exact ? pathname === href : pathname.startsWith(href)
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-medium transition-all duration-150 ${active
                                    ? 'bg-accent text-white'
                                    : 'text-[#6e6e73] hover:bg-black/[0.04] hover:text-[#1d1d1f]'
                                }`}
                        >
                            <Icon size={17} />
                            {label}
                            {active && <ChevronRight size={14} className="ml-auto opacity-60" />}
                        </Link>
                    )
                })}
            </nav>

            {/* Выход */}
            <div className="px-3 py-4 border-t border-black/[0.06]">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-medium text-[#6e6e73] hover:bg-black/[0.04] hover:text-[#1d1d1f] transition-all duration-150 mb-1"
                >
                    <ChevronRight size={17} className="rotate-180" />
                    На сайт
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-medium text-[#6e6e73] hover:bg-[#ff3b30]/[0.06] hover:text-[#ff3b30] transition-all duration-150"
                >
                    <LogOut size={17} />
                    Выйти
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden md:flex w-[220px] flex-shrink-0 bg-white border-r border-black/[0.06] flex-col h-screen sticky top-0">
                <SidebarContent />
            </aside>

            {/* Mobile — top bar + drawer */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-black/[0.06] flex items-center justify-between px-5">
                <Link href="/" className="font-semibold text-[17px] tracking-tight">
                    Nomad<span className="text-accent">Drive</span>
                    <span className="text-[12px] font-normal text-[#6e6e73] ml-1.5">Admin</span>
                </Link>
                <button
                    onClick={() => setOpen(p => !p)}
                    className="w-9 h-9 flex items-center justify-center rounded-[8px] hover:bg-black/[0.04] transition-colors"
                >
                    {open ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile drawer */}
            {open && (
                <>
                    <div
                        className="md:hidden fixed inset-0 z-40 bg-black/25"
                        onClick={() => setOpen(false)}
                    />
                    <div className="md:hidden fixed top-14 left-0 bottom-0 w-[260px] z-50 bg-white shadow-lg slide-in-from-left">
                        <SidebarContent />
                    </div>
                </>
            )}

            {/* Mobile top padding */}
            <div className="md:hidden h-14 w-full" />
        </>
    )
}