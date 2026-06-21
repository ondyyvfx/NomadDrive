import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { getServerLang } from '@/lib/i18n.server'

export const metadata: Metadata = {
  title: {
    default: 'NomadDrive',
    template: '%s — NomadDrive',
  },
  description: 'Аренда, покупка автомобилей и запчасти в одном месте',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const lang = await getServerLang()
  return (
    <html lang={lang === 'kz' ? 'kk' : 'ru'}>
      <body className="bg-[#0a0a0a] text-[#f0ece4] antialiased">
        <LanguageProvider initial={lang}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}