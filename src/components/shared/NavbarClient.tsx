'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, User, ShoppingCart, LayoutDashboard } from 'lucide-react'
import { MobileMenu } from './MobileMenu'
import { LogoutButton } from './LogoutButton'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface NavbarClientProps {
    navLinks: { href: string; label: string }[]
    user: SupabaseUser | null
    profile: {
        full_name: string | null
        avatar_url: string | null
        role: string
    } | null
}

export function NavbarClient({ navLinks, user, profile }: NavbarClientProps) {
    const [mobileOpen, setMobileOpen] = useState(false)

    const firstName = profile?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'Профиль'

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 h-[56px] navbar-blur border-b border-black/[0.06]">
                <div className="max-w-[1200px] mx-auto px-5 h-full flex items-center relative">

                    {/* Лого */}
                    <Link href="/" className="font-semibold text-[18px] tracking-tight flex-shrink-0">
                        Nomad<span className="text-accent">Drive</span>
                    </Link>

                    {/* Nav — абсолютный центр desktop */}
                    <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 text-[15px] text-[#6e6e73] hover:text-[#1d1d1f] rounded-[8px] hover:bg-black/[0.04] transition-all duration-150"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Правая часть — desktop */}
                    <div className="hidden md:flex items-center gap-1 ml-auto">
                        {user ? (
                            <>
                                {/* Корзина */}
                                <Link
                                    href="/cart"
                                    className="p-2 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.04] rounded-[8px] transition-all duration-150"
                                    aria-label="Корзина"
                                >
                                    <ShoppingCart size={19} />
                                </Link>

                                {/* Dashboard */}
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center gap-2 px-3.5 py-2 text-[15px] text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.04] rounded-[8px] transition-all duration-150"
                                >
                                    <div className="w-6 h-6 rounded-full bg-accent/[0.1] flex items-center justify-center">
                                        <User size={13} className="text-accent" />
                                    </div>
                                    <span className="max-w-[100px] truncate">{firstName}</span>
                                </Link>

                                <LogoutButton />
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-[15px] text-[#6e6e73] hover:text-[#1d1d1f] rounded-[8px] hover:bg-black/[0.04] transition-all duration-150"
                                >
                                    Войти
                                </Link>
                                <Link
                                    href="/register"
                                    className="h-9 px-4 bg-accent text-white text-[14px] font-medium rounded-[8px] hover:bg-[#0a6e56] transition-colors flex items-center"
                                >
                                    Регистрация
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Гамбургер — mobile */}
                    <button
                        onClick={() => setMobileOpen(prev => !prev)}
                        className="md:hidden ml-auto p-2 -mr-2 text-[#1d1d1f] rounded-[8px] hover:bg-black/[0.04] transition-colors"
                        aria-label="Меню"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>

                </div>
            </header>

            <MobileMenu
                isOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
                navLinks={navLinks}
                user={user}
                profile={profile}
                firstName={firstName}
            />
        </>
    )
}