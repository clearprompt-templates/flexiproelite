import type { CSSProperties } from 'react'

const MIN_BODY_CONTRAST = 4.5
const MIN_SUBTEXT_CONTRAST = 4.5
const MIN_SUBTEXT_VS_TEXT = 1.4

const parseRgb = (value: string): { r: number; g: number; b: number } | null => {
  const match = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i)
  if (!match) return null
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
  }
}

const parseHex = (hex: string): { r: number; g: number; b: number } | null => {
  const normalized = hex.trim()
  const match = /^#?([a-f\d]{3}|[a-f\d]{6})$/i.exec(normalized)
  if (!match) return null

  let value = match[1]
  if (value.length === 3) {
    value = value
      .split('')
      .map((char) => char + char)
      .join('')
  }

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  }
}

export const parseColor = (color: string): { r: number; g: number; b: number } | null => {
  return parseHex(color) ?? parseRgb(color)
}

const toHex = (color: string): string => {
  const rgb = parseColor(color)
  if (!rgb) return color
  const toChannel = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16)
    return hex.length === 1 ? `0${hex}` : hex
  }
  return `#${toChannel(rgb.r)}${toChannel(rgb.g)}${toChannel(rgb.b)}`.toUpperCase()
}

const getRelativeLuminance = (color: string): number => {
  const rgb = parseColor(color)
  if (!rgb) return 0

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((value) => {
    const channel = value / 255
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const getContrastRatio = (foreground: string, background: string): number => {
  const fg = getRelativeLuminance(foreground)
  const bg = getRelativeLuminance(background)
  const lighter = Math.max(fg, bg)
  const darker = Math.min(fg, bg)
  return (lighter + 0.05) / (darker + 0.05)
}

export const mixColors = (foreground: string, background: string, weight: number): string => {
  const fg = parseColor(foreground)
  const bg = parseColor(background)
  if (!fg || !bg) return toHex(foreground)

  const ratio = Math.max(0, Math.min(1, weight))
  return rgbToHex(
    fg.r * ratio + bg.r * (1 - ratio),
    fg.g * ratio + bg.g * (1 - ratio),
    fg.b * ratio + bg.b * (1 - ratio),
  )
}

const rgbToHex = (r: number, g: number, b: number): string => {
  const toChannel = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16)
    return hex.length === 1 ? `0${hex}` : hex
  }
  return `#${toChannel(r)}${toChannel(g)}${toChannel(b)}`
}

const deriveMutedColor = (text: string, background: string, minRatio: number): string => {
  for (let weight = 0.85; weight >= 0.35; weight -= 0.05) {
    const candidate = mixColors(text, background, weight)
    if (getContrastRatio(candidate, background) >= minRatio) {
      return candidate
    }
  }
  return mixColors(text, background, 0.55)
}

const isReadableSubtext = (candidate: string, text: string, surfaces: string[]): boolean => {
  const onSurfaces = surfaces.every(
    (surface) => getContrastRatio(candidate, surface) >= MIN_SUBTEXT_CONTRAST,
  )
  const distinctFromText = getContrastRatio(candidate, text) >= MIN_SUBTEXT_VS_TEXT
  return onSurfaces && distinctFromText
}

const isCorrectLuminanceSide = (candidate: string, text: string, background: string): boolean => {
  const textLum = getRelativeLuminance(text)
  const bgLum = getRelativeLuminance(background)
  const candidateLum = getRelativeLuminance(candidate)
  const isDarkText = textLum < bgLum
  return isDarkText ? candidateLum < bgLum : candidateLum > bgLum
}

const resolveSubtextColor = (
  text: string,
  muted: string,
  accent: string,
  primary: string,
  background: string,
  secondary: string,
): string => {
  const surfaces = [background, secondary]

  if (
    isCorrectLuminanceSide(muted, text, background) &&
    isReadableSubtext(muted, text, surfaces)
  ) {
    return toHex(muted)
  }

  for (const brandColor of [accent, primary]) {
    const hex = toHex(brandColor)
    if (isReadableSubtext(hex, text, surfaces)) {
      return hex
    }

    const softened = mixColors(
      hex,
      background,
      getRelativeLuminance(background) > 0.5 ? 0.72 : 0.28,
    )
    if (isReadableSubtext(softened, text, surfaces)) {
      return softened
    }
  }

  const derived = deriveMutedColor(text, background, MIN_SUBTEXT_CONTRAST)
  if (isReadableSubtext(derived, text, surfaces)) {
    return derived
  }

  return isCorrectLuminanceSide(text, text, background)
    ? mixColors(text, background, 0.62)
    : mixColors(text, background, 0.38)
}

const ensureContrast = (
  foreground: string,
  background: string,
  minRatio: number,
  fallback: string,
): string => {
  if (getContrastRatio(foreground, background) >= minRatio) {
    return toHex(foreground)
  }
  return fallback
}

export type ThemeColors = {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  muted: string
  subtext: string
}

export const normalizeThemeColors = (
  input: Record<string, string> & { textSecondary?: string },
): ThemeColors => {
  const background = toHex(input.background || '#FFFFFF')
  const text = toHex(input.text || input.foreground || '#111827')
  const accent = toHex(input.accent || input.primary || text)
  const primary = toHex(input.primary || accent)
  const rawMuted = input.muted || input.mutedForeground || input.textSecondary || text

  const secondary = toHex(input.secondary || mixColors(text, background, 0.08))
  const safeText = ensureContrast(
    text,
    background,
    MIN_BODY_CONTRAST,
    getRelativeLuminance(background) > 0.5 ? '#111827' : '#F9FAFB',
  )

  let muted = toHex(rawMuted)
  if (
    !isCorrectLuminanceSide(muted, safeText, background) ||
    !isReadableSubtext(muted, safeText, [background, secondary])
  ) {
    muted = deriveMutedColor(safeText, background, MIN_SUBTEXT_CONTRAST)
  }

  const subtext = resolveSubtextColor(
    safeText,
    muted,
    accent,
    primary,
    background,
    secondary,
  )

  return {
    primary,
    secondary,
    accent,
    background,
    text: safeText,
    muted,
    subtext,
  }
}

export const taglineStyle = (colors: ThemeColors): CSSProperties => ({
  backgroundColor: `${colors.accent}20`,
  color: colors.accent,
})

export const subtextStyle = (colors: ThemeColors): CSSProperties => ({
  color: colors.subtext,
})

export const accentIconStyle = (colors: ThemeColors): CSSProperties => ({
  backgroundColor: `${colors.accent}20`,
  color: colors.accent,
})
