import { getContactApiUrl, getTemplatesByOriginUrl } from '@/lib/api-config'

export type SiteImage = {
  url: string
  alt: string
}

export type NavItem = {
  id: string
  label: string
  href: string
  type: string
}

export type CtaButton = {
  text?: string
  label?: string
  href: string
  style?: string
  variant?: string
  icon?: string
}

export type HeroContent = {
  sectionId: string
  badge?: { text: string; icon?: string; visible?: boolean }
  heading?: { text: string; splitAt?: number }
  headline?: string
  subheading?: { text: string }
  description?: string
  cta: {
    primary: CtaButton
    secondary?: CtaButton
  }
  features?: { icon: string; text: string }[]
  backgroundImage?: SiteImage
  scrollIndicator?: { visible?: boolean; text?: string }
  settings?: {
    fullHeight?: boolean
    parallax?: boolean
    overlay?: boolean
    overlayOpacity?: number
  }
}

export type CardItem = {
  id: string
  title: string
  subtitle?: string
  description: string
  media?: SiteImage
  cta?: CtaButton
  tags?: string[]
  featured?: boolean
  metadata?: { value: string; [key: string]: string }
}

export type CardGridContent = {
  sectionId: string
  badge?: string
  heading: string
  description?: string
  items: CardItem[]
  footer?: {
    text: string
    cta: CtaButton
  }
  labels?: {
    featuredBadge?: string
    metadataLabel?: string
  }
  settings?: {
    columns?: { mobile?: number; tablet?: number; desktop?: number }
    featuredIndex?: number
  }
}

export type AboutStat = {
  id: string
  icon?: string
  value: string
  label: string
}

export type AboutContent = {
  sectionId: string
  badge?: string
  heading: string
  description: string
  mission?: {
    heading: string
    text: string
    icon?: string
  }
  stats: AboutStat[]
  image?: SiteImage
  experience?: {
    years: string
    label: string
  }
}

export type ContactInfoItem = {
  id: string
  type: string
  icon: string
  label: string
  value: string
  href: string | null
  color?: { from: string; to: string } | string | null
}

export type ContactFormField = {
  name: string
  label: string
  type: string
  required: boolean
  placeholder?: string
}

export type ContactContent = {
  sectionId: string
  badge?: string
  heading: string
  description: string
  contactInfo: ContactInfoItem[]
  form?: {
    enabled: boolean
    fields: ContactFormField[]
    submitLabel: string
    successTitle?: string
    successDescription?: string
    errorMessage?: string
  }
  cta?: {
    heading: string
    description: string
    button: CtaButton
  }
}

export type SiteSection =
  | { id: string; type: 'hero'; enabled: boolean; order: number; content: HeroContent; settings?: HeroContent['settings'] }
  | { id: string; type: 'cardGrid'; enabled: boolean; order: number; content: CardGridContent; settings?: CardGridContent['settings'] }
  | { id: string; type: 'services'; enabled: boolean; order: number; content: CardGridContent; settings?: CardGridContent['settings'] }
  | { id: string; type: 'about'; enabled: boolean; order: number; content: AboutContent }
  | { id: string; type: 'contact'; enabled: boolean; order: number; content: ContactContent }

export type SitePage = {
  id: string
  path: string
  title: string
  description: string
  enabled: boolean
  sections: SiteSection[]
}

export type SiteData = {
  meta: {
    version: string
    lastUpdated: string
    siteId: string
    language: string
    locales: string[]
    title: string
    description: string
    clearprompt_template_id?: string
  }
  siteConfig: {
    brand: {
      name: string
      tagline: string
      logo: {
        type: string
        text?: string
        url?: string
        width: number
        height: number
        textColor?: string
        iconPrimaryColor?: string
        iconSecondaryColor?: string
        iconStrokeColor?: string
      }
      logoUrl?: string
    }
    theme: {
      themeColor?: string
      colors: Record<string, string>
      typography: {
        fontFamily: string
        headingFontFamily: string
        fontSize: {
          base: string
          heading1: string
          heading2?: string
          heading3?: string
        }
      }
      spacing: {
        sectionPadding: string
        containerMaxWidth: string
      }
      borderRadius: {
        small: string
        medium: string
        large: string
      }
    }
    contact?: {
      location?: string
      locationShort?: string
      email?: string
      phone?: string
      whatsapp?: string
    }
    seo: {
      keywords?: string[]
      author?: string
      siteUrl?: string
      ogImage?: string
      favicon?: string
    }
    analytics: {
      googleAnalyticsId?: string
      facebookPixelId?: string
      enabled: boolean
      clearprompt?: {
        provider?: string
        api_host?: string
        website_id?: string
        template_id?: string
        organization_id?: string
        platform?: string
        tracker_script?: string
      }
      narayani?: {
        provider?: string
        api_host?: string
        website_id?: string
        template_id?: string
        organization_id?: string
        platform?: string
        tracker_script?: string
      }
    }
  }
  navigation: {
    header: {
      enabled: boolean
      position: string
      style: string
      logoHref?: string
      items: NavItem[]
      cta: {
        enabled: boolean
        label: string
        href: string
        style: string
      }
    }
    footer: {
      enabled: boolean
      wordmark?: string
      columns: {
        id: string
        type: string
        heading?: string
        content?: string
        links?: { label: string; href: string }[]
        socialMedia?: { platform: string; url: string; icon: string; label?: string }[]
      }[]
      newsletter: {
        enabled: boolean
        heading?: string
        description?: string
        placeholder?: string
        buttonText?: string
        submitLabel?: string
      }
      bottomBar: {
        copyrightText: string
        links?: { label: string; href: string }[] | string[]
        customText?: { madeWith: string; by: string }
      }
    }
  }
  pages: SitePage[]
}

type SiteDataApiResponse = {
  status: string
  status_code: number
  message: string
  data: {
    json_object?: SiteData
    template_id?: string
    organization_id?: string
  }
}

let remoteSiteData: SiteData | null = null

/** Survives hard navigations to *.html on S3 (in-memory alone does not). */
const SITE_DATA_STORAGE_KEY = 'clearprompt:site-data:v1'

function readStoredSiteData(): SiteData | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(SITE_DATA_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SiteData
  } catch {
    return null
  }
}

function writeStoredSiteData(data: SiteData): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(SITE_DATA_STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Ignore quota / private-mode failures; in-memory cache still works.
  }
}

export function setSiteData(data: SiteData) {
  remoteSiteData = data
  writeStoredSiteData(data)
}

export function getSiteData(): SiteData {
  if (!remoteSiteData) {
    throw new Error('Site data has not been loaded yet')
  }
  return remoteSiteData
}

/** Non-throwing peek for bootstrap (avoids Loading flash on navigations). */
export function peekSiteData(): SiteData | null {
  if (remoteSiteData) return remoteSiteData
  const stored = readStoredSiteData()
  if (stored) {
    remoteSiteData = stored
    return stored
  }
  return null
}

/** Site origin for the ClearPrompt `origin` header — always the real page origin. */
export function resolveSiteOrigin(): string {
  if (typeof window === 'undefined') {
    throw new Error('Site origin is only available in the browser')
  }
  return window.location.origin
}

export async function fetchSiteDataByOrigin(origin?: string): Promise<SiteData> {
  const siteOrigin = origin ?? resolveSiteOrigin()

  if (!siteOrigin) {
    throw new Error('Site origin is required to load site data')
  }

  const response = await fetch(getTemplatesByOriginUrl(siteOrigin), {
    headers: {
      accept: 'application/json',
      origin: siteOrigin,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(
      `Failed to load site config for origin ${siteOrigin} (HTTP ${response.status})`,
    )
  }

  const payload = (await response.json()) as SiteDataApiResponse
  const data = payload.data?.json_object

  if (!data) {
    const apiMessage = payload.message?.trim()
    throw new Error(
      apiMessage ||
        `No site content found for origin ${siteOrigin}. Register this origin in ClearPrompt.`,
    )
  }


  // Prefer API-level template_id when present (local backend / future sandbox)
  const apiTemplateId = payload.data?.template_id?.trim()
  const apiOrgId = payload.data?.organization_id?.trim()
  if (apiTemplateId) {
    const analytics = data.siteConfig.analytics || {
      enabled: true,
      googleAnalyticsId: '',
      facebookPixelId: '',
    }
    const existing = analytics.narayani || analytics.clearprompt || {}
    const narayani = {
      ...existing,
      provider: existing.provider || 'agent-narayani',
      api_host:
        existing.api_host || 'https://analytics.clearprompt.dev',
      website_id:
        existing.website_id ||
        '33b60795-c3da-4860-ae16-5ecddaf4183b',
      template_id: apiTemplateId,
      organization_id: apiOrgId || existing.organization_id || '',
      platform: existing.platform || 'clearprompt',
      tracker_script:
        existing.tracker_script ||
        'https://analytics.clearprompt.dev/static/cp-tracker.js',
    }
    data.siteConfig.analytics = {
      enabled: true,
      googleAnalyticsId: analytics.googleAnalyticsId || '',
      facebookPixelId: analytics.facebookPixelId || '',
      narayani,
    }
    data.meta = {
      ...data.meta,
      clearprompt_template_id: apiTemplateId,
    }
  }

  setSiteData(data)
  return data
}

export async function loadSiteData(origin?: string): Promise<SiteData> {
  return fetchSiteDataByOrigin(origin)
}

/** Collect named form fields into a flat JSON body (field set varies by template). */
export function buildContactPayload(form: HTMLFormElement): Record<string, string> {
  const payload: Record<string, string> = {}
  const formData = new FormData(form)
  formData.forEach((value, key) => {
    const trimmed = String(value).trim()
    if (trimmed) payload[key] = trimmed
  })
  return payload
}

export async function submitContactForm(fields: Record<string, string>): Promise<void> {
  const response = await fetch(getContactApiUrl(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fields),
  })

  if (!response.ok) {
    let detail = ''
    try {
      const body = (await response.json()) as { message?: string; error?: string }
      detail = body.message || body.error || ''
    } catch {
      try {
        detail = await response.text()
      } catch {
        /* ignore */
      }
    }
    throw new Error(detail || `Contact request failed (${response.status})`)
  }
}

export function getPageByPath(data: SiteData, path: string): SitePage | undefined {
  return data.pages.find((page) => page.path === path)
}

export function getHomePage(data: SiteData) {
  return getPageByPath(data, '/') ?? data.pages[0]
}

export function getHomeSections(data: SiteData): SiteSection[] {
  const page = getHomePage(data)
  return [...page.sections]
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order) as SiteSection[]
}

export function getSectionByType<T extends SiteSection['type']>(
  type: T,
  data: SiteData,
): Extract<SiteSection, { type: T }> | undefined {
  const page = getHomePage(data)
  const section = page.sections.find((s) => s.type === type && s.enabled)
  return section as Extract<SiteSection, { type: T }> | undefined
}
