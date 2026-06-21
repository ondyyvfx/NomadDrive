'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MailCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useDict } from '@/contexts/LanguageContext'

export default function ForgotPasswordPage() {
    const { auth: t } = useDict()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [sent, setSent] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const supabase = createClient()
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            })
            if (error) throw error
            setSent(true)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : t.forgotErr)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#0a0a0a]">
            <div className="w-full max-w-[380px]">

                <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-[14px] text-[#6b6b6b] hover:text-[#f0ece4] mb-10 transition-colors"
                >
                    <ArrowLeft size={16} />
                    {t.backToLogin}
                </Link>

                {sent ? (
                    <div className="text-center">
                        <div className="w-14 h-14 rounded-full bg-[#34c759]/[0.10] flex items-center justify-center mx-auto mb-5">
                            <MailCheck size={26} className="text-[#34c759]" />
                        </div>
                        <h1 className="text-[24px] font-bold tracking-[-0.04em] mb-2 text-[#f0ece4]">
                            {t.sentTitle}
                        </h1>
                        <p className="text-[15px] text-[#6b6b6b] leading-relaxed">
                            {t.sentSub1} <span className="text-[#f0ece4]">{email}</span> {t.sentSub2}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-8">
                            <h1 className="text-[28px] font-bold tracking-[-0.04em] mb-2 text-[#f0ece4]">
                                {t.forgotTitle}
                            </h1>
                            <p className="text-[#6b6b6b] text-[15px]">
                                {t.forgotSub}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-medium text-[#6b6b6b]">{t.email}</label>
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

                            {error && (
                                <div className="px-3.5 py-2.5 bg-[#ff3b30]/[0.07] border border-[#ff3b30]/[0.15] rounded-[8px]">
                                    <p className="text-[13px] text-[#ff3b30]">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 bg-[#c9a96e] text-[#0a0a0a] font-semibold rounded-[10px] hover:bg-[#d4b87a] transition-all duration-300 flex items-center justify-center gap-2 text-[15px] disabled:opacity-40 disabled:cursor-not-allowed mt-1"
                            >
                                {loading && (
                                    <span className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
                                )}
                                {loading ? t.sending : t.sendLink}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}
