'use client'

import Link from 'next/link'
import { useDict } from '@/contexts/LanguageContext'

export function Footer() {
    const { footer: t } = useDict()

    const links = [
        { href: '/rent', label: t.rent },
        { href: '/sale', label: t.sale },
        { href: '/parts', label: t.parts },
        { href: '/login', label: t.login },
        { href: '/register', label: t.register },
    ]

    return (
        <footer className="border-t border-white/[0.06] bg-[#0a0a0a]">
            <div className="max-w-[1200px] mx-auto px-5 py-12">

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

                    {/* Лого */}
                    <Link href="/" className="font-bold text-xl tracking-[-0.04em] flex-shrink-0 text-[#f0ece4]">
                        Nomad<span className="text-[#c9a96e]">Drive</span>
                    </Link>

                    {/* Ссылки */}
                    <nav className="flex flex-wrap gap-x-6 gap-y-3">
                        {links.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-[15px] text-[#6b6b6b] hover:text-[#f0ece4] transition-colors duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                </div>

                <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-2">
                    <p className="text-[14px] text-[#3d3d3d]">
                        {t.copy}
                    </p>
                    <p className="text-[14px] text-[#3d3d3d]">
                        {t.address}
                    </p>
                </div>

            </div>
        </footer>
    )
}
