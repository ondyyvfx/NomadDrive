'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useDict } from '@/contexts/LanguageContext'

export default function ResetPasswordPage() {
    const router = useRouter()
    const { auth: t } = useDict()
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [ready, setReady] = useState(false)
    const [done, setDone] = useState(false)

    // Supabase подхватывает recovery-токен из ссылки и открывает сессию восстановления
    useEffect(() => {
        const supabase = createClient()
        const { data: sub } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') setReady(true)
        })
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) setReady(true)
        })
        return () => sub.subscription.unsubscribe()
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (password.length < 6) {
            setError(t.resetErrShort)
            return
        }
        setError('')
        setLoading(true)
        try {
            const supabase = createClient()
            const { error } = await supabase.auth.updateUser({ password })
            if (error) throw error
            setDone(true)
            setTimeout(() => router.push('/dashboard'), 1800)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : t.resetErr)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#0a0a0a]">
            <div className="w-full max-w-[380px]">

                {done ? (
                    <div className="text-center">
                        <div className="w-14 h-14 rounded-full bg-[#34c759]/[0.10] flex items-center justify-center mx-auto mb-5">
                            <CheckCircle2 size={26} className="text-[#34c759]" />
                        </div>
                        <h1 className="text-[24px] font-bold tracking-[-0.04em] mb-2 text-[#f0ece4]">
                            {t.resetDoneTitle}
                        </h1>
                        <p className="text-[15px] text-[#6b6b6b]">{t.resetDoneSub}</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h1 className="text-[28px] font-bold tracking-[-0.04em] mb-2 text-[#f0ece4]">
                                {t.resetTitle}
                            </h1>
                            <p className="text-[#6b6b6b] text-[15px]">
                                {t.resetSub}
                            </p>
                        </div>

                        {!ready && !error && (
                            <p className="text-[14px] text-[#6b6b6b] mb-4">
                                {t.resetHint}{' '}
                                <Link href="/forgot-password" className="text-[#c9a96e] hover:underline">
                                    {t.resetRequestLink}
                                </Link>
                            </p>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-medium text-[#6b6b6b]">{t.password}</label>
                                <div className="relative">
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
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
                            </div>

                            {error && (
                                <div className="px-3.5 py-2.5 bg-[#ff3b30]/[0.07] border border-[#ff3b30]/[0.15] rounded-[8px]">
                                    <p className="text-[13px] text-[#ff3b30]">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !ready}
                                className="w-full h-11 bg-[#c9a96e] text-[#0a0a0a] font-semibold rounded-[10px] hover:bg-[#d4b87a] transition-all duration-300 flex items-center justify-center gap-2 text-[15px] disabled:opacity-40 disabled:cursor-not-allowed mt-1"
                            >
                                {loading && (
                                    <span className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
                                )}
                                {loading ? t.saving : t.savePassword}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}
