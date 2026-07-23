import type { SiteData } from '@/lib/site-data'

const COLOR_VAR_MAP: Record<string, string> = {
  background: '--background',
  foreground: '--foreground',
  text: '--foreground',
  card: '--card',
  cardForeground: '--card-foreground',
  popover: '--popover',
  popoverForeground: '--popover-foreground',
  primary: '--primary',
  primaryForeground: '--primary-foreground',
  secondary: '--secondary',
  secondaryForeground: '--secondary-foreground',
  muted: '--muted',
  mutedForeground: '--muted-foreground',
  accent: '--accent',
  accentForeground: '--accent-foreground',
  destructive: '--destructive',
  border: '--border',
  input: '--input',
  ring: '--ring',
  subtext: '--subtext',
}

export function buildThemeCss(data: SiteData): string {
  const { theme } = data.siteConfig
  const { colors, typography, spacing, borderRadius } = theme
  const vars: string[] = []

  Object.entries(colors).forEach(([key, value]) => {
    const cssVar = COLOR_VAR_MAP[key]
    if (cssVar) vars.push(`${cssVar}: ${value};`)
    vars.push(`--color-${key}: ${value};`)
  })

  // Compat aliases used by template utilities (.text-gradient, etc.)
  if (colors.primary) vars.push(`--primary-color: ${colors.primary};`)
  if (colors.secondary) vars.push(`--secondary-color: ${colors.secondary};`)
  if (colors.accent) vars.push(`--accent-color: ${colors.accent};`)
  if (colors.background) vars.push(`--background-color: ${colors.background};`)
  if (colors.text || colors.foreground) {
    vars.push(`--text-color: ${colors.text || colors.foreground};`)
  }

  if (colors.text) {
    vars.push(`--text: ${colors.text};`)
  } else if (colors.foreground) {
    vars.push(`--text: ${colors.foreground};`)
  }

  if (borderRadius?.small) vars.push(`--radius-sm: ${borderRadius.small};`)
  if (borderRadius?.medium) vars.push(`--radius-md: ${borderRadius.medium};`)
  if (borderRadius?.large) {
    vars.push(`--radius-lg: ${borderRadius.large};`)
    vars.push(`--radius: ${borderRadius.large};`)
  }

  if (typography.fontFamily) vars.push(`--font-sans-stack: ${typography.fontFamily};`)
  if (typography.headingFontFamily) {
    vars.push(`--font-heading-stack: ${typography.headingFontFamily};`)
  }

  if (typography.fontSize?.base) vars.push(`--font-size-base: ${typography.fontSize.base};`)
  if (typography.fontSize?.heading1) {
    vars.push(`--font-size-heading1: ${typography.fontSize.heading1};`)
  }
  if (typography.fontSize?.heading2) {
    vars.push(`--font-size-heading2: ${typography.fontSize.heading2};`)
  }
  if (typography.fontSize?.heading3) {
    vars.push(`--font-size-heading3: ${typography.fontSize.heading3};`)
  }

  if (spacing.sectionPadding) vars.push(`--section-padding: ${spacing.sectionPadding};`)
  if (spacing.containerMaxWidth) {
    vars.push(`--container-max-width: ${spacing.containerMaxWidth};`)
  }

  return `:root {\n  ${vars.join('\n  ')}\n}`
}
