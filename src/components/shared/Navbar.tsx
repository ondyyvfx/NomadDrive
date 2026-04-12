import Link from 'next/link'
import { User } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { NavbarClient } from './NavbarClient'
import { LogoutButton } from './LogoutButton'

const navLinks = [
    { href: '/rent', label: 'Аренда' },
    { href: '/sale', label: 'Продажа' },
    { href: '/parts', label: 'Запчасти' },
]

export async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let profile = null
    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('full_name, avatar_url, role')
            .eq('id', user.id)
            .single()
        profile = data
    }

    return (
        <NavbarClient
            navLinks={navLinks}
            user={user}
            profile={profile}
        />
    )
}