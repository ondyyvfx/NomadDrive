import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from './AdminSidebar'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') redirect('/')

    return (
        <div className="min-h-screen bg-[#f5f5f7] flex">
            <AdminSidebar />
            <main className="flex-1 min-w-0 p-6 md:p-8">
                {children}
            </main>
        </div>
    )
}