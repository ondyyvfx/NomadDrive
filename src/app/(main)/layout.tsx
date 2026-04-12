import { Navbar } from '@/components/shared/Navbar'
import { Footer } from '@/components/shared/Footer'

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Navbar />
            <main className="pt-[56px] min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    )
}