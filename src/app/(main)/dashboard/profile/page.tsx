import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { ProfileForm } from './ProfileForm'

export const metadata = { title: 'Профиль' }

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="max-w-[600px] mx-auto px-5 py-10">
            <div className="flex items-center gap-2 mb-8 fade-in">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 text-[14px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                >
                    <ChevronLeft size={16} />
                    Кабинет
                </Link>
                <span className="text-[#aeaeb2]">/</span>
                <span className="text-[14px]">Профиль</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-8 fade-in">
                Мой профиль
            </h1>

            <ProfileForm profile={profile} email={user.email ?? ''} />
        </div>
    )
}