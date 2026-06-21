'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useDict } from '@/contexts/LanguageContext'

export function LogoutButton() {
    const router = useRouter()
    const { logout: t } = useDict()
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    async function handleLogout() {
        setLoading(true)
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowConfirm(false)
            }
        }
        if (showConfirm) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showConfirm])

    return (
        <>
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setShowConfirm(p => !p)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-[15px] text-[#6b6b6b] hover:text-[#ff3b30] hover:bg-[#ff3b30]/[0.06] rounded-[8px] transition-all duration-200"
                >
                    <LogOut size={16} />
                    <span className="hidden lg:inline">{t.label}</span>
                </button>

                {showConfirm && (
                    <div className="hidden md:block absolute right-0 top-[calc(100%+8px)] w-[220px] bg-[#111111] border border-white/[0.08] rounded-[14px] shadow-xl overflow-hidden z-50">

                        <div className="px-4 pt-4 pb-3">
                            <p className="text-[14px] font-semibold text-[#f0ece4] mb-0.5">
                                {t.title}
                            </p>
                            <p className="text-[12px] text-[#6b6b6b] leading-relaxed">
                                {t.sub}
                            </p>
                        </div>

                        <div className="h-px bg-white/[0.06] mx-4" />

                        <div className="p-2 flex flex-col gap-1">
                            <button
                                onClick={handleLogout}
                                disabled={loading}
                                className="w-full h-9 bg-[#ff3b30] text-white text-[13px] font-medium rounded-[8px] hover:bg-[#e0352b] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {loading && (
                                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                )}
                                {loading ? t.going : t.yes}
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="w-full h-9 text-[#6b6b6b] text-[13px] font-medium rounded-[8px] hover:bg-white/[0.04] transition-colors"
                            >
                                {t.cancel}
                            </button>
                        </div>

                    </div>
                )}
            </div>

            {showConfirm && (
                <div className="md:hidden">
                    <div
                        className="fixed inset-0 z-[100]"
                        style={{ background: 'rgba(0,0,0,0.6)' }}
                        onClick={() => setShowConfirm(false)}
                    />

                    <div className="fixed bottom-0 left-0 right-0 z-[101] bg-[#111111] border-t border-white/[0.06] rounded-t-[20px] px-5 pt-5 pb-8 shadow-xl animate-in slide-in-from-bottom duration-300">
                        <div className="w-10 h-1 bg-white/[0.10] rounded-full mx-auto mb-6" />

                        <p className="text-[17px] font-bold tracking-tight text-[#f0ece4] mb-1">
                            {t.title}
                        </p>
                        <p className="text-[14px] text-[#6b6b6b] mb-6">
                            {t.subLong}
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleLogout}
                                disabled={loading}
                                className="w-full h-12 bg-[#ff3b30] text-white font-medium rounded-[12px] hover:bg-[#e0352b] transition-colors text-[16px] flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {loading && (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                )}
                                {loading ? t.going : t.yes}
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="w-full h-12 bg-[#1a1a1a] text-[#f0ece4] font-medium rounded-[12px] border border-white/[0.08] hover:bg-white/[0.04] transition-colors text-[16px]"
                            >
                                {t.cancel}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
