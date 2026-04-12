'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { User, ShoppingCart, LayoutDashboard } from 'lucide-react'
import { LogoutButton } from './LogoutButton'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
    navLinks: { href: string; label: string }[]
    user: SupabaseUser | null
    profile: { full_name: string | null; avatar_url: string | null; role: string } | null
    firstName: string
}

export function MobileMenu({ isOpen, onClose, navLinks, user, profile, firstName }: MobileMenuProps) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div
            className="md:hidden fixed z-40 bg-white border-b border-black/[0.06]"
            style={{ top: 56, left: 0, right: 0, bottom: 0 }}
        >
            <div className="flex flex-col h-full px-5 py-6 overflow-y-auto">

                {/* Если залогинен — показываем профиль */}
                {user && (
                    <div className="flex items-center gap-3 p-4 bg-[#f5f5f7] rounded-[12px] mb-6">
                        <div className="w-10 h-10 rounded-full bg-accent/[0.1] flex items-center justify-center flex-shrink-0">
                            <User size={18} className="text-accent" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-medium text-[15px] text-[#1d1d1f] truncate">{firstName}</p>
                            <p className="text-[13px] text-[#6e6e73] truncate">{user.email}</p>
                        </div>
                    </div>
                )}

                {/* Nav links */}
                <nav className="flex flex-col gap-1 mb-4">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={onClose}
                            className="px-4 py-3.5 text-[17px] font-medium text-[#1d1d1f] rounded-[10px] hover:bg-[#f5f5f7] transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <hr className="border-black/[0.06] my-2" />

                {/* Auth секция */}
                <div className="flex flex-col gap-1 mt-2">
                    {user ? (
                        <>
                            <Link
                                href="/dashboard"
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3.5 text-[16px] font-medium text-[#1d1d1f] rounded-[10px] hover:bg-[#f5f5f7] transition-colors"
                            >
                                <LayoutDashboard size={18} className="text-[#6e6e73]" />
                                Личный кабинет
                            </Link>
                            <Link
                                href="/cart"
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3.5 text-[16px] font-medium text-[#1d1d1f] rounded-[10px] hover:bg-[#f5f5f7] transition-colors"
                            >
                                <ShoppingCart size={18} className="text-[#6e6e73]" />
                                Корзина
                            </Link>
                            <div className="px-2 mt-2">
                                <LogoutButton />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col gap-3 mt-2">
                            <Link
                                href="/register"
                                onClick={onClose}
                                className="w-full h-12 bg-accent text-white text-[16px] font-medium rounded-[10px] hover:bg-[#0a6e56] transition-colors flex items-center justify-center"
                            >
                                Регистрация
                            </Link>
                            <Link
                                href="/login"
                                onClick={onClose}
                                className="w-full h-12 bg-[#f5f5f7] text-[#1d1d1f] text-[16px] font-medium rounded-[10px] border border-black/[0.08] hover:bg-black/[0.04] transition-colors flex items-center justify-center"
                            >
                                Войти
                            </Link>
                        </div>
                    )}
                </div>

                <div className="flex-1" />
                <p className="text-center text-[13px] text-[#aeaeb2] mt-6">
                    © 2025 NomadDrive
                </p>

            </div>
        </div>
    )
}