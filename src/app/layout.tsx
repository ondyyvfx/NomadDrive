import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'NomadDrive',
    template: '%s — NomadDrive',
  },
  description: 'Аренда, покупка автомобилей и запчасти в одном месте',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="bg-[#0a0a0a] text-[#f0ece4] antialiased">
        {children}
      </body>
    </html>
  )
}