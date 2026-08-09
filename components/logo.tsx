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

  if (brand.logoUrl || brand.logo?.type === 'image') {
    const url = brand.logoUrl || brand.logo.url
    if (url) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={`${brand.name} Logo`}
          className={className}
          {...globalFieldAttrs(
            brand.logoUrl
              ? jsonPath('siteConfig', 'brand', 'logoUrl')
              : jsonPath('siteConfig', 'brand', 'logo', 'url'),
            'image',
          )}
        />
      )
    }
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
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${width} ${height}`}
          fill="none"
          className={className}
        >
          <defs>
            <linearGradient id="flexipro-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: iconPrimaryColor, stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: iconSecondaryColor, stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <rect
            x="5"
            y="10"
            width="40"
            height="40"
            rx="8"
            fill="url(#flexipro-logo-grad)"
            data-cp-decorative=""
          />
          <path
            d="M 25 20 L 35 30 L 25 40"
            stroke={iconStrokeColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            data-cp-decorative=""
          />
          <path
            d="M 15 25 L 20 30 L 15 35"
            stroke={iconStrokeColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            data-cp-decorative=""
          />
          <text
            x="55"
            y="38"
            fontFamily="var(--font-inter), system-ui, sans-serif"
            fontSize="28"
            fontWeight="700"
            fill={fill}
            {...globalFieldAttrs(jsonPath('siteConfig', 'brand', 'name'), 'text')}
          >
            {brand.name}
          </text>
        </svg>
      )
    }
  }

  return (
    <span
      className={`text-2xl font-bold ${className}`}
      {...globalFieldAttrs(jsonPath('siteConfig', 'brand', 'name'), 'text')}
    >
      {brand.name}
    </span>
  )
}
