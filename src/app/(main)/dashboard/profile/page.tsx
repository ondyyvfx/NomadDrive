import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getServerDict } from '@/lib/i18n.server'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { ProfileForm } from './ProfileForm'

export async function generateMetadata() {
    const { dash: t } = await getServerDict()
    return { title: t.profile }
}

export default async function ProfilePage() {
    const supabase = await createClient()
    const { dash: t } = await getServerDict()
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
                    {t.dashboard}
                </Link>
                <span className="text-[#3d3d3d]">/</span>
                <span className="text-[14px] text-[#f0ece4]">{t.profile}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold tracking-[-0.04em] mb-8 fade-in text-[#f0ece4]">
                {t.profileTitle}
            </h1>

            <ProfileForm profile={profile} email={user.email ?? ''} />
        </div>
    )
}