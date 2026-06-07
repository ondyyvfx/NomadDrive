'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowLeft, Car, Shield, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const perks = [
    { icon: Car, text: 'Доступ к 500+ автомобилям для аренды и покупки' },
    { icon: Shield, text: 'Безопасный личный кабинет и история заказов' },
    { icon: Zap, text: 'Быстрое оформление без лишних шагов' },
]

export default function RegisterPage() {
    const router = useRouter()
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        if (password.length < 6) {
            setError('Пароль должен быть не менее 6 символов')
            return
        }

        setLoading(true)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: fullName },
                },
            })
            if (error) throw error
            router.push('/')
            router.refresh()
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Ошибка регистрации'
            if (msg.includes('already registered')) {
                setError('Этот email уже зарегистрирован')
            } else {
                setError(msg)
            }
        } finally {
            setLoading(false)
        }
    }

    // Success state
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-5">
                <div className="text-center max-w-sm">
                    <div className="w-16 h-16 bg-[#c9a96e]/[0.08] rounded-full flex items-center justify-center mx-auto mb-6">
                        <div className="w-8 h-8 bg-[#c9a96e] rounded-full flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 8l3.5 3.5L13 4.5" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-[24px] font-bold tracking-[-0.04em] mb-2 text-[#f0ece4]">
                        Проверьте почту
                    </h2>
                    <p className="text-[#6b6b6b] text-[15px] leading-relaxed mb-8">
                        Мы отправили письмо с подтверждением на{' '}
                        <span className="text-[#f0ece4] font-medium">{email}</span>.
                        Перейдите по ссылке в письме чтобы завершить регистрацию.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex h-11 px-6 bg-[#c9a96e] text-[#0a0a0a] font-semibold rounded-[10px] hover:bg-[#d4b87a] transition-all duration-300 items-center justify-center text-[15px]"
                    >
                        Перейти ко входу
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex">

            {/* ─── Левая панель ─── */}
            <div className="hidden md:flex md:w-1/2 bg-[#0d0d0d] flex-col justify-between p-12 relative overflow-hidden border-r border-white/[0.06]">

                <div
                    className="absolute inset-0 opacity-100"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                    }}
                />

                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/30 to-transparent" />

                <Link href="/" className="relative z-10 font-bold text-xl tracking-[-0.04em] text-[#f0ece4]">
                    Nomad<span className="text-[#c9a96e]">Drive</span>
                </Link>

                <div className="relative z-10">
                    <h2 className="text-[#f0ece4] text-4xl font-bold tracking-[-0.04em] mb-3 leading-tight">
                        Начните<br />прямо сейчас
                    </h2>
                    <p className="text-[#6b6b6b] text-[16px] mb-10 leading-relaxed font-light">
                        Создайте аккаунт и получите доступ<br />ко всем возможностям платформы
                    </p>

                    <div className="flex flex-col gap-4">
                        {perks.map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-[8px] bg-[#c9a96e]/[0.10] flex items-center justify-center flex-shrink-0">
                                    <Icon size={15} className="text-[#c9a96e]" />
                                </div>
                                <span className="text-[#6b6b6b] text-[14px]">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-[#3d3d3d] text-[13px]">
                    © 2026 NomadDrive · Алматы
                </p>
            </div>

            {/* ─── Правая панель ─── */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-16 py-12 bg-[#0a0a0a]">

                <Link
                    href="/"
                    className="md:hidden inline-flex items-center gap-1.5 text-[14px] text-[#6b6b6b] hover:text-[#f0ece4] mb-10 transition-colors w-fit"
                >
                    <ArrowLeft size={16} />
                    На главную
                </Link>

                <div className="w-full max-w-[380px] mx-auto">

                    <div className="mb-8">
                        <h1 className="text-[28px] font-bold tracking-[-0.04em] mb-2 text-[#f0ece4]">
                            Создать аккаунт
                        </h1>
                        <p className="text-[#6b6b6b] text-[15px]">
                            Уже есть аккаунт?{' '}
                            <Link href="/login" className="text-[#c9a96e] hover:underline font-medium">
                                Войти
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* Full name */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-[#6b6b6b]">
                                Имя и фамилия
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                placeholder="Алексей Иванов"
                                required
                                autoComplete="name"
                                className="w-full h-11 px-3.5 bg-[#111111] border border-white/[0.10] rounded-[10px] text-[15px] text-[#f0ece4] placeholder:text-[#3d3d3d] outline-none transition-all duration-300 focus:border-[#c9a96e] focus:ring-3 focus:ring-[#c9a96e]/[0.10] focus:bg-[#161616]"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-[#6b6b6b]">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                                className="w-full h-11 px-3.5 bg-[#111111] border border-white/[0.10] rounded-[10px] text-[15px] text-[#f0ece4] placeholder:text-[#3d3d3d] outline-none transition-all duration-300 focus:border-[#c9a96e] focus:ring-3 focus:ring-[#c9a96e]/[0.10] focus:bg-[#161616]"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-medium text-[#6b6b6b]">
                                Пароль
                            </label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Минимум 6 символов"
                                    required
                                    autoComplete="new-password"
                                    className="w-full h-11 px-3.5 pr-11 bg-[#111111] border border-white/[0.10] rounded-[10px] text-[15px] text-[#f0ece4] placeholder:text-[#3d3d3d] outline-none transition-all duration-300 focus:border-[#c9a96e] focus:ring-3 focus:ring-[#c9a96e]/[0.10] focus:bg-[#161616]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d3d3d] hover:text-[#6b6b6b] transition-colors"
                                >
                                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>

                            {/* Password strength */}
                            {password.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                    {[1, 2, 3, 4].map(i => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${password.length >= i * 3
                                                ? password.length >= 10
                                                    ? 'bg-[#34c759]'
                                                    : password.length >= 6
                                                        ? 'bg-[#ff9f0a]'
                                                        : 'bg-[#ff3b30]'
                                                : 'bg-white/[0.08]'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
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
                            className="w-full h-11 bg-[#c9a96e] text-[#0a0a0a] font-semibold rounded-[10px] hover:bg-[#d4b87a] transition-all duration-300 flex items-center justify-center gap-2 text-[15px] disabled:opacity-40 disabled:cursor-not-allowed mt-1"
                        >
                            {loading && (
                                <span className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
                            )}
                            {loading ? 'Создаём аккаунт...' : 'Создать аккаунт'}
                        </button>

                        <p className="text-[12px] text-[#3d3d3d] text-center leading-relaxed">
                            Регистрируясь, вы соглашаетесь с условиями использования платформы
                        </p>

                    </form>

                    <Link
                        href="/"
                        className="hidden md:inline-flex items-center gap-1.5 text-[13px] text-[#3d3d3d] hover:text-[#6b6b6b] mt-8 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        На главную
                    </Link>

                </div>
            </div>
        </div>
    )
}
