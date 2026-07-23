'use client'

import type { SiteData } from '@/lib/site-data'
import { buildThemeCss } from '@/lib/build-theme-css'
import { normalizeThemeColors } from '@/lib/theme-colors'

export function ThemeStyles({ data }: { data: SiteData }) {
  const colors = normalizeThemeColors(data.siteConfig.theme.colors)
  const enriched: SiteData = {
    ...data,
    siteConfig: {
      ...data.siteConfig,
      theme: {
        ...data.siteConfig.theme,
        colors: {
          ...data.siteConfig.theme.colors,
          ...colors,
          foreground: colors.text,
          mutedForeground: colors.muted,
          primaryForeground: '#FFFFFF',
          accentForeground: '#FFFFFF',
          secondaryForeground: colors.text,
        },
      },
    },
  }
  const css = buildThemeCss(enriched)
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
