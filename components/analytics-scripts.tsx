'use client'

import Script from 'next/script'
import { useSiteData } from '@/components/site-data-provider'

export function AnalyticsScripts() {
  const { data } = useSiteData()
  const { analytics } = data.siteConfig

  if (!analytics.enabled) return null

  return (
    <>
      {analytics.googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${analytics.googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${analytics.googleAnalyticsId}');
            `}
          </Script>
        </>
      )}
      {analytics.facebookPixelId && (
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
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
          `}
        </Script>
      )}
    </>
  )
}
