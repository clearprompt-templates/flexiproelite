'use client';

import { useEffect, useState } from 'react';
import { SiteDataProvider } from '@/components/site-data-provider';
import { SitePage } from '@/components/site-page';
import { AnalyticsScripts } from '@/components/analytics-scripts';
import { ThemeStyles } from '@/components/theme-styles';
import { fetchSiteDataByOrigin, type SiteData } from '@/lib/site-data';
import { normalizeThemeColors } from '@/lib/theme-colors';
import { UI_DEFAULTS } from '@/lib/site-ui-defaults';

function applyDocumentMeta(data: SiteData) {
  document.title = data.meta.title;
  document.documentElement.lang = data.meta.language;

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute('content', data.meta.description);
  }

  const favicon = data.siteConfig.seo.favicon;
  if (favicon) {
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = favicon;
  }

  const themeColor = data.siteConfig.theme.themeColor ?? data.siteConfig.theme.colors.primary;
  if (themeColor) {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', themeColor);
  }

  document.documentElement.style.fontSize = data.siteConfig.theme.typography.fontSize.base;
  document.body.style.fontFamily = data.siteConfig.theme.typography.fontFamily;

  const colors = normalizeThemeColors(data.siteConfig.theme.colors);
  document.documentElement.style.setProperty('--subtext', colors.subtext);
  document.documentElement.style.setProperty('--color-subtext', colors.subtext);
  document.documentElement.style.setProperty('--text', colors.text);
  document.documentElement.style.setProperty('--color-text', colors.text);
}

export function SiteBootstrap() {
  const [data, setData] = useState<SiteData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchSiteDataByOrigin()
      .then((siteData) => {
        if (!cancelled) {
          setData(siteData);
          applyDocumentMeta(siteData);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load site data');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-3 bg-background px-6 text-center text-foreground">
        <p className="text-sm tracking-[0.2em] text-destructive uppercase">Unable to load site</p>
        <p className="max-w-md text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background text-foreground">
        <p className="text-sm tracking-[0.2em] text-muted-foreground">{UI_DEFAULTS.loadingLabel}</p>
      </div>
    );
  }

  return (
    <SiteDataProvider data={data}>
      <ThemeStyles data={data} />
      <AnalyticsScripts />
      <SitePage />
    </SiteDataProvider>
  );
}
