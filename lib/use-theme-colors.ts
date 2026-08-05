import { useMemo } from 'react';
import { useSiteData } from '@/components/site-data-provider';
import { normalizeThemeColors, type ThemeColors } from '@/lib/theme-colors';

export function useThemeColors(): ThemeColors {
  const { data } = useSiteData();
  return useMemo(
    () => normalizeThemeColors(data.siteConfig.theme.colors),
    [data.siteConfig.theme.colors]
  );
}
