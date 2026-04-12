'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowLeft, Car, Shield, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const perks = [
    { icon: Car, text: 'Более 500 автомобилей для аренды и покупки' },
    { icon: Shield, text: 'Безопасные сделки и защищённая оплата' },
    { icon: Zap, text: 'Бронирование за 2 минуты онлайн' },
]

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) throw error
            router.push('/')
            router.refresh()
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Ошибка входа'
            if (msg.includes('Invalid login credentials')) {
                setError('Неверный email или пароль')
            } else {
                setError(msg)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">

            {/* ─── Левая панель (только desktop) ─── */}
            <div className="hidden md:flex md:w-1/2 bg-[#0a5f4a] flex-col justify-between p-12 relative overflow-hidden">

                {/* Dot grid overlay */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                    }}
                />

                {/* Лого */}
                <Link href="/" className="relative z-10 text-white font-semibold text-xl tracking-tight">
                    Nomad<span className="text-white/60">Drive</span>
                </Link>

                {/* Центральный контент */}
                <div className="relative z-10">
                    <h2 className="text-white text-4xl font-semibold tracking-tight mb-3 leading-tight">
                        Добро<br />пожаловать
                    </h2>
                    <p className="text-white/60 text-[16px] mb-10 leading-relaxed">
                        Войдите чтобы управлять бронированиями,<br />заказами и профилем
                    </p>

                    <div className="flex flex-col gap-4">
                        {perks.map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-[8px] bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <Icon size={15} className="text-white" />
                                </div>
                                <span className="text-white/70 text-[14px]">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Нижний текст */}
                <p className="relative z-10 text-white/30 text-[13px]">
                    © 2025 NomadDrive · Алматы
                </p>
            </div>

            {/* ─── Правая панель (форма) ─── */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-16 py-12 bg-white">

                {/* Кнопка назад — mobile only */}
                <Link
                    href="/"
                    className="md:hidden inline-flex items-center gap-1.5 text-[14px] text-[#6e6e73] hover:text-[#1d1d1f] mb-10 transition-colors w-fit"
                >
                    <ArrowLeft size={16} />
                    На главную
                </Link>

                <div className="w-full max-w-[380px] mx-auto">

                    {/* Заголовок */}
                    <div className="mb-8">
                        <h1 className="text-[28px] font-semibold tracking-tight mb-2">
                            Вход в аккаунт
                        </h1>
                        <p className="text-[#6e6e73] text-[15px]">
                            Нет аккаунта?{' '}
                            <Link href="/register" className="text-accent hover:underline font-medium">
                                Зарегистрироваться
                            </Link>
                        </p>
                    </div>

                    {/* Форма */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-[#6e6e73]">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                                className="w-full h-11 px-3.5 bg-[#f5f5f7] border border-black/[0.08] rounded-[10px] text-[15px] text-[#1d1d1f] placeholder:text-[#aeaeb2] outline-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-[#0a5f4a]/[0.08] focus:bg-white"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-[13px] font-medium text-[#6e6e73]">
                                    Пароль
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-[13px] text-accent hover:underline"
                                >
                                    Забыли пароль?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                    className="w-full h-11 px-3.5 pr-11 bg-[#f5f5f7] border border-black/[0.08] rounded-[10px] text-[15px] text-[#1d1d1f] placeholder:text-[#aeaeb2] outline-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-[#0a5f4a]/[0.08] focus:bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aeaeb2] hover:text-[#6e6e73] transition-colors"
                                >
                                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="px-3.5 py-2.5 bg-[#ff3b30]/[0.07] border border-[#ff3b30]/[0.15] rounded-[8px]">
                                <p className="text-[13px] text-[#ff3b30]">{error}</p>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-accent text-white font-medium rounded-[10px] hover:bg-[#0a6e56] transition-all duration-200 flex items-center justify-center gap-2 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                        >
                            {loading && (
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            )}
                            {loading ? 'Вход...' : 'Войти'}
                        </button>

                    </form>

                    {/* Desktop — ссылка на главную */}
                    <Link
                        href="/"
                        className="hidden md:inline-flex items-center gap-1.5 text-[13px] text-[#aeaeb2] hover:text-[#6e6e73] mt-8 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        На главную
                    </Link>

                </div>
            </div>
        </div>
    )
}