import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { getSiteFontVariables } from '@/lib/fonts'
import './globals.css'

const fontVariables = getSiteFontVariables()

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Loading…',
  description: 'Loading site content…',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${fontVariables} bg-background`}>
      <body className="font-sans antialiased text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
