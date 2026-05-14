import Link from 'next/link'

const links = [
    { href: '/rent', label: 'Аренда авто' },
    { href: '/sale', label: 'Продажа авто' },
    { href: '/parts', label: 'Запчасти' },
    { href: '/login', label: 'Войти' },
    { href: '/register', label: 'Регистрация' },
]

export function Footer() {
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
                        © 2025 NomadDrive
                    </p>
                    <p className="text-[14px] text-[#3d3d3d]">
                        Алматы, Казахстан
                    </p>
                </div>

            </div>
        </footer>
    )
}
