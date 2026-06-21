'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useDict } from '@/contexts/LanguageContext'

interface Profile {
    id: string
    full_name: string | null
    phone: string | null
    role: string
}

export function ProfileForm({ profile, email }: { profile: Profile | null; email: string }) {
    const router = useRouter()
    const { dash: t } = useDict()
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
            setError(err instanceof Error ? err.message : t.saveError)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-5 fade-in-up">

            <div className="bg-[#111111] border border-white/[0.07] rounded-[16px] p-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-[#c9a96e]/[0.08] rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={28} className="text-[#c9a96e]" />
                    </div>
                    <div>
                        <p className="text-[17px] font-bold tracking-tight text-[#f0ece4]">
                            {profile?.full_name ?? t.notSpecified}
                        </p>
                        <p className="text-[13px] text-[#6b6b6b]">{email}</p>
                        {profile?.role === 'admin' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#c9a96e]/[0.08] text-[#c9a96e] mt-1">
                                {t.adminBadge}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-[#111111] border border-white/[0.07] rounded-[16px] p-6">
                <h2 className="text-[15px] font-bold tracking-tight mb-5 text-[#f0ece4]">
                    {t.personalData}
                </h2>
                <div className="flex flex-col gap-4">

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-[#6b6b6b] flex items-center gap-1.5">
                            <Mail size={13} />
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full h-11 px-3.5 bg-[#161616] border border-white/[0.06] rounded-[10px] text-[15px] text-[#3d3d3d] cursor-not-allowed"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-[#6b6b6b] flex items-center gap-1.5">
                            <User size={13} />
                            {t.fullName}
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            placeholder={t.fullNamePlaceholder}
                            className="w-full h-11 px-3.5 bg-[#111111] border border-white/[0.10] rounded-[10px] text-[15px] text-[#f0ece4] placeholder:text-[#3d3d3d] outline-none focus:border-[#c9a96e] focus:ring-3 focus:ring-[#c9a96e]/[0.12] focus:bg-[#161616] transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-[#6b6b6b] flex items-center gap-1.5">
                            <Phone size={13} />
                            {t.phone}
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder={t.phonePlaceholder}
                            className="w-full h-11 px-3.5 bg-[#111111] border border-white/[0.10] rounded-[10px] text-[15px] text-[#f0ece4] placeholder:text-[#3d3d3d] outline-none focus:border-[#c9a96e] focus:ring-3 focus:ring-[#c9a96e]/[0.12] focus:bg-[#161616] transition-all"
                        />
                    </div>

                    {error && (
                        <p className="text-[13px] text-[#ff3b30]">{error}</p>
                    )}

                    {success && (
                        <div className="flex items-center gap-2 text-[13px] text-[#34c759] fade-in">
                            <CheckCircle2 size={15} />
                            {t.profileSaved}
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full h-11 bg-[#c9a96e] text-[#0a0a0a] font-semibold rounded-[10px] hover:bg-[#d4b87a] transition-all duration-300 flex items-center justify-center gap-2 text-[15px] disabled:opacity-50 mt-1"
                    >
                        {loading && (
                            <span className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
                        )}
                        {loading ? t.saving : t.saveChanges}
                    </button>
                </div>
            </div>

        </div>
    )
}
