import type { Metadata } from 'next'
import { Outfit, DM_Mono, DM_Serif_Display } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' })
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' })
const dmSerif = DM_Serif_Display({ subsets: ['latin'], weight: '400', variable: '--font-serif' })

export const metadata: Metadata = {
  title: 'Pedido Mobile — Laboratório Sobral',
  description: 'Sistema de consulta de pedidos por representante comercial',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${outfit.variable} ${dmMono.variable} ${dmSerif.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
