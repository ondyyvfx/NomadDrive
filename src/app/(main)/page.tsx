import Link from 'next/link'
import { Car, ShoppingBag, Wrench, Star, Shield, Clock, ChevronRight } from 'lucide-react'

const services = [
    {
        icon: Car,
        title: 'Аренда авто',
        desc: 'Широкий выбор автомобилей посуточно. Онлайн-бронирование за 2 минуты.',
        href: '/catalog',
        color: 'text-accent',
        bg: 'bg-[#0a5f4a]/[0.07]',
        label: 'Смотреть каталог',
    },
    {
        icon: ShoppingBag,
        title: 'Продажа авто',
        desc: 'Проверенные автомобили с историей. Прозрачные сделки без посредников.',
        href: '/sale',
        color: 'text-[#b8860b]',
        bg: 'bg-[#b8860b]/[0.07]',
        label: 'Смотреть объявления',
    },
    {
        icon: Wrench,
        title: 'Запчасти',
        desc: 'Оригинальные и аналоговые запчасти. Поиск по марке, модели и году.',
        href: '/parts',
        color: 'text-[#8b6f47]',
        bg: 'bg-[#8b6f47]/[0.07]',
        label: 'Найти запчасти',
    },
]

const stats = [
    { value: '500+', label: 'Автомобилей в каталоге' },
    { value: '12 000+', label: 'Запчастей в наличии' },
    { value: '4.9', label: 'Средняя оценка клиентов' },
    { value: '24/7', label: 'Поддержка клиентов' },
]

const features = [
    {
        icon: Shield,
        title: 'Безопасные сделки',
        desc: 'Все автомобили проверены. Оплата защищена.',
    },
    {
        icon: Clock,
        title: 'Быстрое оформление',
        desc: 'Бронирование и заказ за несколько минут онлайн.',
    },
    {
        icon: Star,
        title: 'Честные отзывы',
        desc: 'Реальные оценки от verified-покупателей.',
    },
]

export default function HomePage() {
    return (
        <div className="bg-white">

            {/* ─── Hero ─── */}
            <section className="dot-grid min-h-[90vh] flex items-center border-b border-black/[0.06]">
                <div className="w-full max-w-[1200px] mx-auto px-5 py-24 text-center">

                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#0a5f4a]/[0.07] border border-[#0a5f4a]/[0.15] rounded-full mb-8">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                        <span className="text-[13px] font-medium text-accent tracking-wide">
                            Премиум платформа · Казахстан
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-[-0.04em] mb-6">
                        Nomad<span className="text-accent">Drive</span>
                    </h1>

                    <p className="text-[#6e6e73] text-lg md:text-xl max-w-lg mx-auto mb-10 leading-relaxed font-light">
                        Аренда и покупка автомобилей, запчасти —
                        всё в одном месте
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/catalog"
                            className="h-12 px-8 bg-accent text-white font-medium rounded-[10px] hover:bg-[#0a6e56] transition-all duration-200 flex items-center justify-center gap-2 text-[15px]"
                        >
                            Арендовать авто
                            <ChevronRight size={16} />
                        </Link>
                        <Link
                            href="/sale"
                            className="h-12 px-8 bg-white text-[#1d1d1f] font-medium rounded-[10px] border border-black/[0.12] hover:border-black/[0.2] hover:bg-black/[0.02] transition-all duration-200 flex items-center justify-center text-[15px]"
                        >
                            Купить авто
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── Stats ─── */}
            <section className="border-b border-black/[0.06]">
                <div className="max-w-[1200px] mx-auto px-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-black/[0.06]">
                        {stats.map((stat, i) => (
                            <div key={i} className="py-10 px-6 text-center">
                                <div className="text-3xl md:text-4xl font-semibold tracking-tight text-[#1d1d1f] mb-1.5">
                                    {stat.value}
                                </div>
                                <div className="text-[13px] text-[#6e6e73]">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Services ─── */}
            <section className="max-w-[1200px] mx-auto px-5 py-24">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
                        Всё что нужно для авто
                    </h2>
                    <p className="text-[#6e6e73] text-[16px] max-w-md mx-auto font-light">
                        Три направления в одной платформе
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {services.map(({ icon: Icon, title, desc, href, color, bg, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className="group p-8 bg-white border border-black/[0.06] rounded-[16px] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col"
                        >
                            <div className={`w-12 h-12 ${bg} rounded-[12px] flex items-center justify-center mb-6`}>
                                <Icon size={22} className={color} />
                            </div>
                            <h3 className="text-[18px] font-semibold tracking-tight mb-2">
                                {title}
                            </h3>
                            <p className="text-[14px] text-[#6e6e73] leading-relaxed mb-6 flex-1">
                                {desc}
                            </p>
                            <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-accent group-hover:gap-2.5 transition-all duration-200">
                                {label}
                                <ChevronRight size={14} />
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ─── Features ─── */}
            <section className="border-t border-black/[0.06]">
                <div className="max-w-[1200px] mx-auto px-5 py-24">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
                            Почему NomadDrive
                        </h2>
                        <p className="text-[#6e6e73] text-[16px] max-w-sm mx-auto font-light">
                            Мы делаем процесс простым и безопасным
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {features.map(({ icon: Icon, title, desc }) => (
                            <div
                                key={title}
                                className="p-8 bg-white border border-black/[0.06] rounded-[16px] shadow-sm"
                            >
                                <div className="w-11 h-11 bg-[#0a5f4a]/[0.07] rounded-[10px] flex items-center justify-center mb-5">
                                    <Icon size={20} className="text-accent" />
                                </div>
                                <h3 className="text-[17px] font-semibold tracking-tight mb-2">
                                    {title}
                                </h3>
                                <p className="text-[14px] text-[#6e6e73] leading-relaxed">
                                    {desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section className="border-t border-black/[0.06]">
                <div className="max-w-[1200px] mx-auto px-5 py-24 text-center">
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                        Готовы начать?
                    </h2>
                    <p className="text-[#6e6e73] text-[16px] max-w-sm mx-auto mb-8 font-light">
                        Зарегистрируйтесь бесплатно и получите доступ ко всем возможностям
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/register"
                            className="h-12 px-8 bg-accent text-white font-medium rounded-[10px] hover:bg-[#0a6e56] transition-all duration-200 flex items-center justify-center gap-2 text-[15px]"
                        >
                            Создать аккаунт
                            <ChevronRight size={16} />
                        </Link>
                        <Link
                            href="/parts"
                            className="h-12 px-8 bg-white text-[#1d1d1f] font-medium rounded-[10px] border border-black/[0.12] hover:border-black/[0.2] hover:bg-black/[0.02] transition-all duration-200 flex items-center justify-center text-[15px]"
                        >
                            Найти запчасти
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    )
}