'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Profile {
    id: string
    full_name: string | null
    phone: string | null
    role: string
}

export function ProfileForm({ profile, email }: { profile: Profile | null; email: string }) {
    const router = useRouter()
    const [fullName, setFullName] = useState(profile?.full_name ?? '')
    const [phone, setPhone] = useState(profile?.phone ?? '')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    async function handleSave() {
        setLoading(true)
        setError('')
        setSuccess(false)

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('profiles')
                .update({ full_name: fullName, phone })
                .eq('id', profile!.id)

            if (error) throw error
            setSuccess(true)
            router.refresh()
            setTimeout(() => setSuccess(false), 3000)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Ошибка сохранения')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-5 fade-in-up">

            {/* Аватар */}
            <div className="bg-white border border-black/[0.06] rounded-[16px] p-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-accent/[0.08] rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={28} className="text-accent" />
                    </div>
                    <div>
                        <p className="text-[17px] font-semibold tracking-tight">
                            {profile?.full_name ?? 'Не указано'}
                        </p>
                        <p className="text-[13px] text-[#6e6e73]">{email}</p>
                        {profile?.role === 'admin' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-accent/[0.08] text-accent mt-1">
                                Администратор
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Форма */}
            <div className="bg-white border border-black/[0.06] rounded-[16px] p-6">
                <h2 className="text-[15px] font-semibold tracking-tight mb-5">
                    Личные данные
                </h2>
                <div className="flex flex-col gap-4">

                    {/* Email — readonly */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-[#6e6e73] flex items-center gap-1.5">
                            <Mail size={13} />
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full h-11 px-3.5 bg-[#f5f5f7] border border-black/[0.08] rounded-[10px] text-[15px] text-[#aeaeb2] cursor-not-allowed"
                        />
                    </div>

                    {/* Имя */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-[#6e6e73] flex items-center gap-1.5">
                            <User size={13} />
                            Имя и фамилия
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            placeholder="Алексей Иванов"
                            className="w-full h-11 px-3.5 bg-[#f5f5f7] border border-black/[0.08] rounded-[10px] text-[15px] text-[#1d1d1f] placeholder:text-[#aeaeb2] outline-none focus:border-accent focus:ring-3 focus:ring-[#0a5f4a]/[0.08] focus:bg-white transition-all"
                        />
                    </div>

                    {/* Телефон */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-[#6e6e73] flex items-center gap-1.5">
                            <Phone size={13} />
                            Телефон
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="+7 (777) 123-45-67"
                            className="w-full h-11 px-3.5 bg-[#f5f5f7] border border-black/[0.08] rounded-[10px] text-[15px] text-[#1d1d1f] placeholder:text-[#aeaeb2] outline-none focus:border-accent focus:ring-3 focus:ring-[#0a5f4a]/[0.08] focus:bg-white transition-all"
                        />
                    </div>

                    {error && (
                        <p className="text-[13px] text-[#ff3b30]">{error}</p>
                    )}

                    {success && (
                        <div className="flex items-center gap-2 text-[13px] text-[#34c759] fade-in">
                            <CheckCircle2 size={15} />
                            Профиль успешно сохранён
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full h-11 bg-accent text-white font-medium rounded-[10px] hover:bg-[#0a6e56] transition-all duration-200 flex items-center justify-center gap-2 text-[15px] disabled:opacity-50 mt-1"
                    >
                        {loading && (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {loading ? 'Сохраняем...' : 'Сохранить изменения'}
                    </button>
                </div>
            </div>

        </div>
    )
}