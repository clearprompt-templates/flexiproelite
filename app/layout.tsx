import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { getSiteFontVariables } from '@/lib/fonts'
import './globals.css'

const fontVariables = getSiteFontVariables()

export const metadata: Metadata = {
  // Placeholder only — real SEO meta is applied at runtime from the API.
  metadataBase: new URL('http://localhost:3000'),
  title: 'Site',
  description: '',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
}

/** Hide the Loading shell before hydrate on preview hosts or when session cache exists. */
const BOOT_CACHE_SCRIPT = `
(function () {
  try {
    var host = location.hostname || '';
    var preview = /-preview\\.clearprompt\\.dev$/i.test(host);
    if (preview || sessionStorage.getItem('clearprompt:site-data:v1')) {
      document.documentElement.classList.add('cp-has-site-cache');
    }
  } catch (e) {}
})();
`.trim()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${fontVariables} bg-background`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_CACHE_SCRIPT }} />
        <style
          dangerouslySetInnerHTML={{
            __html: 'html.cp-has-site-cache [data-cp-boot-loading]{display:none!important}',
          }}
        />
      </head>
      <body className="font-sans antialiased text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
