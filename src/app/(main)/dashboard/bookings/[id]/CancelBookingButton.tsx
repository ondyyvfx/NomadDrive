'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useDict } from '@/contexts/LanguageContext'

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
    const router = useRouter()
    const { dash: t } = useDict()
    const [showSheet, setShowSheet] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleCancel() {
        setLoading(true)
        const supabase = createClient()
        await supabase
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', bookingId)
        router.refresh()
        setShowSheet(false)
        setLoading(false)
    }

    return (
        <>
            {/* Desktop — inline кнопка */}
            <div className="hidden md:block fade-in-up">
                {!showSheet ? (
                    <button
                        onClick={() => setShowSheet(true)}
                        className="w-full h-11 border border-[#ff3b30]/30 text-[#ff3b30] text-[14px] font-medium rounded-[12px] hover:bg-[#ff3b30]/[0.06] transition-colors flex items-center justify-center gap-2"
                    >
                        <XCircle size={16} />
                        {t.cancelBooking}
                    </button>
                ) : (
                    <div className="bg-white border border-[#ff3b30]/20 rounded-[16px] p-5 scale-in">
                        <p className="text-[15px] font-semibold tracking-tight mb-1">
                            {t.cancelConfirm}
                        </p>
                        <p className="text-[13px] text-[#6e6e73] mb-4">
                            {t.cancelIrreversible}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSheet(false)}
                                className="flex-1 h-10 bg-[#f5f5f7] text-[#1d1d1f] font-medium rounded-[10px] border border-black/[0.08] hover:bg-black/[0.04] transition-colors text-[14px]"
                            >
                                {t.back}
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex-1 h-10 bg-[#ff3b30] text-white font-medium rounded-[10px] hover:bg-[#e0352b] transition-colors text-[14px] flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                {t.yesCancel}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile — bottom sheet */}
            <button
                onClick={() => setShowSheet(true)}
                className="md:hidden w-full h-11 border border-[#ff3b30]/30 text-[#ff3b30] text-[14px] font-medium rounded-[12px] hover:bg-[#ff3b30]/[0.06] transition-colors flex items-center justify-center gap-2 fade-in-up"
            >
                <XCircle size={16} />
                {t.cancelBooking}
            </button>

            {showSheet && (
                <>
                    <div
                        className="md:hidden fixed inset-0 z-40"
                        style={{ background: 'rgba(0,0,0,0.25)' }}
                        onClick={() => setShowSheet(false)}
                    />
                    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[20px] px-5 pt-5 pb-8 shadow-lg slide-in-from-bottom">
                        <div className="w-10 h-1 bg-black/[0.1] rounded-full mx-auto mb-6" />
                        <p className="text-[17px] font-semibold tracking-tight mb-1">{t.cancelConfirm}</p>
                        <p className="text-[14px] text-[#6e6e73] mb-6">{t.cancelIrreversible}</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="w-full h-12 bg-[#ff3b30] text-white font-medium rounded-[12px] hover:bg-[#e0352b] transition-colors text-[16px] flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                {t.yesCancel}
                            </button>
                            <button
                                onClick={() => setShowSheet(false)}
                                className="w-full h-12 bg-[#f5f5f7] text-[#1d1d1f] font-medium rounded-[12px] border border-black/[0.08] transition-colors text-[16px]"
                            >
                                {t.back}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}