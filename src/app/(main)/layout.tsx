import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'
import { LanguageProvider } from '@/contexts/LanguageContext'

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <LanguageProvider>
            <Navbar />
            <main className="pt-[56px] min-h-screen">{children}</main>
            <Footer />
        </LanguageProvider>
    )
}
