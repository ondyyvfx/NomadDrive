'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function LogoutButton() {
    const router = useRouter()
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

    // Закрываем dropdown по клику вне
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
            {/* ─── Кнопка ─── */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setShowConfirm(p => !p)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-[15px] text-[#6e6e73] hover:text-[#ff3b30] hover:bg-[#ff3b30]/[0.06] rounded-[8px] transition-all duration-150"
                >
                    <LogOut size={16} />
                    <span className="hidden lg:inline">Выйти</span>
                </button>

                {/* ─── Desktop dropdown ─── */}
                {showConfirm && (
                    <div className="hidden md:block absolute right-0 top-[calc(100%+8px)] w-[220px] bg-white border border-black/[0.08] rounded-[14px] shadow-lg overflow-hidden z-50">

                        <div className="px-4 pt-4 pb-3">
                            <p className="text-[14px] font-semibold text-[#1d1d1f] mb-0.5">
                                Выйти из аккаунта?
                            </p>
                            <p className="text-[12px] text-[#6e6e73] leading-relaxed">
                                Вы будете перенаправлены на главную
                            </p>
                        </div>

                        <div className="h-px bg-black/[0.06] mx-4" />

                        <div className="p-2 flex flex-col gap-1">
                            <button
                                onClick={handleLogout}
                                disabled={loading}
                                className="w-full h-9 bg-[#ff3b30] text-white text-[13px] font-medium rounded-[8px] hover:bg-[#e0352b] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {loading && (
                                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                )}
                                {loading ? 'Выходим...' : 'Да, выйти'}
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="w-full h-9 text-[#6e6e73] text-[13px] font-medium rounded-[8px] hover:bg-black/[0.04] transition-colors"
                            >
                                Отмена
                            </button>
                        </div>

                    </div>
                )}
            </div>

            {/* ─── Mobile bottom sheet ─── */}
            {showConfirm && (
                <div className="md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-[100]"
                        style={{ background: 'rgba(0,0,0,0.25)' }}
                        onClick={() => setShowConfirm(false)}
                    />

                    {/* Sheet */}
                    <div className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-[20px] px-5 pt-5 pb-8 shadow-lg animate-in slide-in-from-bottom duration-300">
                        <div className="w-10 h-1 bg-black/[0.1] rounded-full mx-auto mb-6" />

                        <p className="text-[17px] font-semibold tracking-tight text-[#1d1d1f] mb-1">
                            Выйти из аккаунта?
                        </p>
                        <p className="text-[14px] text-[#6e6e73] mb-6">
                            Вы будете перенаправлены на главную страницу
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
                                {loading ? 'Выходим...' : 'Да, выйти'}
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="w-full h-12 bg-[#f5f5f7] text-[#1d1d1f] font-medium rounded-[12px] border border-black/[0.08] hover:bg-black/[0.04] transition-colors text-[16px]"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}