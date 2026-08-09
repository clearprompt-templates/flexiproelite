'use client'

import { useSiteData } from '@/components/site-data-provider'
import { globalFieldAttrs, jsonPath } from '@/lib/cp-edit'

interface LogoProps {
  className?: string
  textColor?: string
}

export function Logo({ className = '', textColor }: LogoProps) {
  const { data } = useSiteData()
  const { brand } = data.siteConfig
  const imageUrl = brand.logoUrl || (brand.logo?.type === 'image' ? brand.logo.url : '') || ''
  const logoImageAttrs = globalFieldAttrs(jsonPath('siteConfig', 'brand', 'logoUrl'), 'image')
  const nameAttrs = globalFieldAttrs(jsonPath('siteConfig', 'brand', 'name'), 'text')

  // Uploaded / URL logo — mark the image for Direct edit replacement
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={`${brand.name} Logo`}
        className={className}
        {...logoImageAttrs}
      />
    )
  }

  if (brand.logo && (brand.logo.type === 'svg' || brand.logo.type === 'text')) {
    const {
      width = 200,
      height = 60,
      textColor: logoTextColor = '#2d3748',
      iconPrimaryColor = '#6366f1',
      iconSecondaryColor = '#8b5cf6',
      iconStrokeColor = '#ffffff',
    } = brand.logo

    const fill = textColor ?? logoTextColor

    if (brand.logo.type === 'svg') {
      // Wrapper carries logoUrl image target so users can replace the SVG with an upload.
      // Brand name is a separate HTML text target (SVG <text> is a poor Direct-edit hit).
      return (
        <span className={`inline-flex items-center gap-2 ${className}`}>
          <span className="relative inline-flex shrink-0" {...logoImageAttrs}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox={`0 0 50 ${height}`}
              fill="none"
              className="h-full w-auto pointer-events-none"
              aria-hidden="true"
              data-cp-decorative=""
            >
              <defs>
                <linearGradient id="flexipro-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: iconPrimaryColor, stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: iconSecondaryColor, stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <rect x="5" y="10" width="40" height="40" rx="8" fill="url(#flexipro-logo-grad)" />
              <path
                d="M 25 20 L 35 30 L 25 40"
                stroke={iconStrokeColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M 15 25 L 20 30 L 15 35"
                stroke={iconStrokeColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </span>
          <span
            className="text-2xl font-bold leading-none"
            style={{ color: fill, fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
            {...nameAttrs}
          >
            {brand.name}
          </span>
        </span>
      )
    }
  }

  // Text-only brand — still expose logoUrl hit so an image can be added
  return (
    <span className={`inline-flex items-center ${className}`}>
      <span
        className="sr-only"
        {...logoImageAttrs}
        aria-hidden="true"
      />
      <span className="text-2xl font-bold" {...nameAttrs}>
        {brand.name}
      </span>
    </span>
  )
}
