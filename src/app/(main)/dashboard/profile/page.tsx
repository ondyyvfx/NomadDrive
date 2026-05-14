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
                    className="inline-flex items-center gap-1.5 text-[14px] text-[#6b6b6b] hover:text-[#f0ece4] transition-colors"
                >
                    <ChevronLeft size={16} />
                    Кабинет
                </Link>
                <span className="text-[#3d3d3d]">/</span>
                <span className="text-[14px] text-[#f0ece4]">Профиль</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-[-0.04em] mb-8 fade-in text-[#f0ece4]">
                Мой профиль
            </h1>

            <ProfileForm profile={profile} email={user.email ?? ''} />
        </div>
    )
}