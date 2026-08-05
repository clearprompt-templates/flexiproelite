'use client';

/**
 * agent-narayani (Umami) — same workflow as Ethereal/Nova (CP-147).
 * Next.js / Vite-compatible client tracker.
 */

import { useEffect } from 'react';
import { useSiteData } from '@/components/site-data-provider';

const DEFAULT_UMAMI_WEBSITE_ID = '33b60795-c3da-4860-ae16-5ecddaf4183b';
const DEFAULT_NARAYANI_HOST = 'https://analytics.clearprompt.dev';
const TRACKER_SCRIPT_ID = 'cp-narayani-tracker';

type NarayaniConfig = {
  api_host: string;
  website_id: string;
  template_id: string;
  organization_id: string;
  domain: string;
  env: 'sandbox' | 'production';
};

type ClearpromptAnalyticsBlock = {
  provider?: string;
  api_host?: string;
  website_id?: string;
  template_id?: string;
  organization_id?: string;
  platform?: string;
  tracker_script?: string;
};

function resolveDomainsLookupUrl(origin: string): string {
  try {
    const { hostname } = new URL(origin);
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('sandbox-')) {
      return 'https://api.sandbox.clearprompt.dev/api/v1/domains/lookup';
    }
  } catch {
    // fall through
  }
  return 'https://api.clearprompt.dev/api/v1/domains/lookup';
}

function isPreviewHost(host: string): boolean {
  return host.toLowerCase().includes('-preview.clearprompt.');
}

function detectEnv(host: string): 'sandbox' | 'production' {
  const h = host.toLowerCase();
  if (h === 'localhost' || h === '127.0.0.1' || h.startsWith('sandbox-')) {
    return 'sandbox';
  }
  return 'production';
}

function readFromSiteData(data: {
  meta?: { clearprompt_template_id?: string };
  siteConfig?: {
    analytics?: {
      clearprompt?: ClearpromptAnalyticsBlock;
      narayani?: ClearpromptAnalyticsBlock;
      enabled?: boolean;
      googleAnalyticsId?: string;
      facebookPixelId?: string;
    };
  };
}): {
  template_id?: string;
  organization_id?: string;
  website_id?: string;
  api_host?: string;
} {
  const analytics = data.siteConfig?.analytics;
  const block = analytics?.narayani || analytics?.clearprompt || {};
  const meta = data.meta;

  const tid =
    (typeof block.template_id === 'string' && block.template_id.trim()) ||
    (typeof meta?.clearprompt_template_id === 'string' && meta.clearprompt_template_id.trim()) ||
    '';
  const org = (typeof block.organization_id === 'string' && block.organization_id.trim()) || '';
  const websiteId = (typeof block.website_id === 'string' && block.website_id.trim()) || '';
  const apiHost = (typeof block.api_host === 'string' && block.api_host.trim()) || '';

  return {
    template_id: tid || undefined,
    organization_id: org || undefined,
    website_id: websiteId || undefined,
    api_host: apiHost || undefined,
  };
}

async function resolveTemplateIdFromLookup(host: string, origin: string): Promise<string | null> {
  const lookupUrl = `${resolveDomainsLookupUrl(origin)}?domain=${encodeURIComponent(host)}`;
  try {
    const res = await fetch(lookupUrl, {
      headers: { accept: 'application/json', origin },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { data?: { site_id?: string } };
    return body.data?.site_id?.trim() || null;
  } catch {
    return null;
  }
}

function injectNarayaniTracker(cfg: NarayaniConfig) {
  const w = window as Window & { __CP_ANALYTICS__?: NarayaniConfig };
  w.__CP_ANALYTICS__ = cfg;

  if (document.getElementById(TRACKER_SCRIPT_ID)) return;

  const s = document.createElement('script');
  s.id = TRACKER_SCRIPT_ID;
  s.defer = true;
  s.src = `${cfg.api_host}/static/cp-tracker.js`;
  document.head.appendChild(s);
}

export function AnalyticsScripts() {
  const { data } = useSiteData();
  const analytics = data.siteConfig?.analytics;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const host = window.location.hostname;
    if (isPreviewHost(host)) return;

    let cancelled = false;
    const origin = window.location.origin;
    const fromJson = readFromSiteData(data);
    const scripts: HTMLScriptElement[] = [];

    async function start() {
      let templateId =
        fromJson.template_id ||
        (window as Window & { __CP_ANALYTICS__?: { template_id?: string } }).__CP_ANALYTICS__
          ?.template_id ||
        null;

      if (!templateId) {
        templateId = await resolveTemplateIdFromLookup(host, origin);
      }

      if (cancelled) return;
      if (!templateId) {
        console.warn('[clearprompt] analytics: no template_id for', host);
        return;
      }

      const apiHost = (fromJson.api_host || DEFAULT_NARAYANI_HOST).replace(/\/$/, '');
      const websiteId = fromJson.website_id || DEFAULT_UMAMI_WEBSITE_ID;
      const organizationId = fromJson.organization_id || '';

      injectNarayaniTracker({
        api_host: apiHost,
        website_id: websiteId,
        template_id: templateId,
        organization_id: organizationId,
        domain: host,
        env: detectEnv(host),
      });

      // Optional customer GA / FB (opt-in via site content)
      if (analytics?.enabled && analytics.googleAnalyticsId) {
        const gtagScript = document.createElement('script');
        gtagScript.async = true;
        gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${analytics.googleAnalyticsId}`;
        document.head.appendChild(gtagScript);
        scripts.push(gtagScript);

        const inlineGtag = document.createElement('script');
        inlineGtag.textContent = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${analytics.googleAnalyticsId}');
        `;
        document.head.appendChild(inlineGtag);
        scripts.push(inlineGtag);
      }

      if (analytics?.enabled && analytics.facebookPixelId) {
        const fbScript = document.createElement('script');
        fbScript.textContent = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${analytics.facebookPixelId}');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(fbScript);
        scripts.push(fbScript);
      }
    }

    void start();

    return () => {
      cancelled = true;
      scripts.forEach((s) => s.remove());
    };
  }, [data, analytics]);

  return null;
}
