import { Brand } from '../types/config';

interface LogoProps {
  brand: Brand;
  className?: string;
}

export function Logo({ brand, className = '' }: LogoProps) {
  // If using external image URL
  if (brand.logoUrl) {
    return (
      <img
        src={brand.logoUrl}
        alt={`${brand.name} Logo`}
        className={className}
      />
    );
  }

  // If using SVG configuration
  if (brand.logo && brand.logo.type === 'svg') {
    const {
      width = 200,
      height = 60,
      textColor = '#2d3748',
      iconPrimaryColor = '#6366f1',
      iconSecondaryColor = '#8b5cf6',
      iconStrokeColor = '#ffffff',
    } = brand.logo;

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        className={className}
      >
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: iconPrimaryColor, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: iconSecondaryColor, stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Icon background rectangle */}
        <rect x="5" y="10" width="40" height="40" rx="8" fill="url(#grad)" />
        
        {/* Right arrow icon */}
        <path
          d="M 25 20 L 35 30 L 25 40"
          stroke={iconStrokeColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Left arrow icon */}
        <path
          d="M 15 25 L 20 30 L 15 35"
          stroke={iconStrokeColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Brand name text */}
        <text
          x="55"
          y="38"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="28"
          fontWeight="700"
          fill={textColor}
        >
          {brand.name}
        </text>
      </svg>
    );
  }

  // Fallback to text-only logo
  return (
    <span className={`text-2xl font-bold ${className}`}>
      {brand.name}
    </span>
  );
}



