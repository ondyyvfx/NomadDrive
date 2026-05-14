'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { User, ShoppingCart, LayoutDashboard } from 'lucide-react'
import { LogoutButton } from './LogoutButton'
import { useLanguage } from '@/contexts/LanguageContext'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface MobileMenuProps {
    isOpen: boolean
    onClose: () => void
    navLinks: { href: string; label: string }[]
    user: SupabaseUser | null
    profile: { full_name: string | null; avatar_url: string | null; role: string } | null
    firstName: string
}

const UI: Record<string, { ru: string; kz: string }> = {
    dashboard:  { ru: 'Личный кабинет', kz: 'Жеке кабинет' },
    cart:       { ru: 'Корзина',        kz: 'Себет'         },
    register:   { ru: 'Регистрация',    kz: 'Тіркелу'       },
    login:      { ru: 'Войти',          kz: 'Кіру'          },
}

export function MobileMenu({ isOpen, onClose, navLinks, user, profile, firstName }: MobileMenuProps) {
    const { lang, setLang } = useLanguage()

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div
            className="md:hidden fixed z-40 bg-[#0a0a0a] border-b border-white/[0.06]"
            style={{ top: 56, left: 0, right: 0, bottom: 0 }}
        >
            <div className="flex flex-col h-full px-5 py-6 overflow-y-auto">

                {user && (
                    <div className="flex items-center gap-3 p-4 bg-[#111111] rounded-[12px] mb-6 border border-white/[0.06]">
                        <div className="w-10 h-10 rounded-full bg-[#c9a96e]/[0.12] flex items-center justify-center flex-shrink-0">
                            <User size={18} className="text-[#c9a96e]" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-[15px] text-[#f0ece4] truncate">{firstName}</p>
                            <p className="text-[13px] text-[#6b6b6b] truncate">{user.email}</p>
                        </div>
                    </div>
                )}

                <nav className="flex flex-col gap-1 mb-4">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={onClose}
                            className="px-4 py-3.5 text-[17px] font-medium text-[#f0ece4] rounded-[10px] hover:bg-white/[0.04] transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <hr className="border-white/[0.06] my-2" />

                <div className="flex flex-col gap-1 mt-2">
                    {user ? (
                        <>
                            <Link
                                href="/dashboard"
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3.5 text-[16px] font-medium text-[#f0ece4] rounded-[10px] hover:bg-white/[0.04] transition-colors"
                            >
                                <LayoutDashboard size={18} className="text-[#6b6b6b]" />
                                {UI.dashboard[lang]}
                            </Link>
                            <Link
                                href="/cart"
                                onClick={onClose}
                                className="flex items-center gap-3 px-4 py-3.5 text-[16px] font-medium text-[#f0ece4] rounded-[10px] hover:bg-white/[0.04] transition-colors"
                            >
                                <ShoppingCart size={18} className="text-[#6b6b6b]" />
                                {UI.cart[lang]}
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
                                className="w-full h-12 bg-[#c9a96e] text-[#0a0a0a] text-[16px] font-semibold rounded-[10px] hover:bg-[#d4b87a] transition-all duration-300 flex items-center justify-center"
                            >
                                {UI.register[lang]}
                            </Link>
                            <Link
                                href="/login"
                                onClick={onClose}
                                className="w-full h-12 bg-[#111111] text-[#f0ece4] text-[16px] font-medium rounded-[10px] border border-white/[0.10] hover:bg-white/[0.04] transition-colors flex items-center justify-center"
                            >
                                {UI.login[lang]}
                            </Link>
                        </div>
                    )}
                </div>

                <div className="flex-1" />

                {/* Language toggle */}
                <button
                    onClick={() => setLang(lang === 'ru' ? 'kz' : 'ru')}
                    className="flex items-center justify-center gap-2 mt-6 py-3 bg-[#111111] border border-white/[0.08] rounded-[10px] text-[14px] font-semibold"
                >
                    <span className={lang === 'ru' ? 'text-[#f0ece4]' : 'text-[#3d3d3d]'}>РУС</span>
                    <span className="text-[#3d3d3d]">·</span>
                    <span className={lang === 'kz' ? 'text-[#f0ece4]' : 'text-[#3d3d3d]'}>ҚАЗ</span>
                </button>

                <p className="text-center text-[13px] text-[#3d3d3d] mt-4">
                    © 2026 NomadDrive
                </p>

            </div>
        </div>
    )
}
