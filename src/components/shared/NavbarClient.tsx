'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, User, ShoppingCart } from 'lucide-react'
import { MobileMenu } from './MobileMenu'
import { LogoutButton } from './LogoutButton'
import { useLanguage } from '@/contexts/LanguageContext'
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

const NAV_LABELS: Record<string, { ru: string; kz: string }> = {
    '/rent':  { ru: 'Аренда',    kz: 'Жалдау'     },
    '/sale':  { ru: 'Продажа',   kz: 'Сату'        },
    '/parts': { ru: 'Запчасти',  kz: 'Бөлшектер'  },
}

const UI: Record<string, { ru: string; kz: string }> = {
    login:    { ru: 'Войти',        kz: 'Кіру'     },
    register: { ru: 'Регистрация',  kz: 'Тіркелу'  },
}

export function NavbarClient({ navLinks, user, profile }: NavbarClientProps) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const { lang, setLang } = useLanguage()

    const firstName = profile?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'Профиль'

    const translatedLinks = navLinks.map(l => ({
        href: l.href,
        label: NAV_LABELS[l.href]?.[lang] ?? l.label,
    }))

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 h-[56px] navbar-blur border-b border-white/[0.06]">
                <div className="max-w-[1200px] mx-auto px-5 h-full flex items-center relative">

                    <Link href="/" className="font-bold text-[18px] tracking-[-0.04em] flex-shrink-0 text-[#f0ece4]">
                        Nomad<span className="text-[#c9a96e]">Drive</span>
                    </Link>

                    <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1">
                        {translatedLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 text-[14px] text-[#6b6b6b] hover:text-[#f0ece4] rounded-[8px] hover:bg-white/[0.04] transition-all duration-200 tracking-tight"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-2 ml-auto">

                        {/* Language pill */}
                        <button
                            onClick={() => setLang(lang === 'ru' ? 'kz' : 'ru')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] border border-white/[0.10] rounded-full text-[12px] font-semibold hover:border-[#c9a96e]/40 transition-all duration-200"
                        >
                            <span className={lang === 'ru' ? 'text-[#f0ece4]' : 'text-[#3d3d3d]'}>РУС</span>
                            <span className="text-[#3d3d3d]">·</span>
                            <span className={lang === 'kz' ? 'text-[#f0ece4]' : 'text-[#3d3d3d]'}>ҚАЗ</span>
                        </button>

                        {user ? (
                            <>
                                <Link
                                    href="/cart"
                                    className="p-2 text-[#6b6b6b] hover:text-[#f0ece4] hover:bg-white/[0.04] rounded-[8px] transition-all duration-200"
                                    aria-label="Корзина"
                                >
                                    <ShoppingCart size={19} />
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center gap-2 px-3.5 py-2 text-[14px] text-[#6b6b6b] hover:text-[#f0ece4] hover:bg-white/[0.04] rounded-[8px] transition-all duration-200"
                                >
                                    <div className="w-6 h-6 rounded-full bg-[#c9a96e]/[0.12] flex items-center justify-center">
                                        <User size={13} className="text-[#c9a96e]" />
                                    </div>
                                    <span className="max-w-[100px] truncate">{firstName}</span>
                                </Link>
                                <LogoutButton />
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-[14px] text-[#6b6b6b] hover:text-[#f0ece4] rounded-[8px] hover:bg-white/[0.04] transition-all duration-200"
                                >
                                    {UI.login[lang]}
                                </Link>
                                <Link
                                    href="/register"
                                    className="h-9 px-4 bg-[#c9a96e] text-[#0a0a0a] text-[13px] font-semibold rounded-[8px] hover:bg-[#d4b87a] transition-all duration-300 flex items-center"
                                >
                                    {UI.register[lang]}
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => setMobileOpen(prev => !prev)}
                        className="md:hidden ml-auto p-2 -mr-2 text-[#f0ece4] rounded-[8px] hover:bg-white/[0.04] transition-colors"
                        aria-label="Меню"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>

                </div>
            </header>

            <MobileMenu
                isOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
                navLinks={translatedLinks}
                user={user}
                profile={profile}
                firstName={firstName}
            />
        </>
    )
}
