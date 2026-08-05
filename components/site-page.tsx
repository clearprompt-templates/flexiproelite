'use client';

import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { HeroSection } from '@/components/sections/hero-section';
import { CardGridSection } from '@/components/sections/card-grid-section';
import { AboutSection } from '@/components/sections/about-section';
import { ContactSection } from '@/components/sections/contact-section';
import { useSiteData } from '@/components/site-data-provider';
import type { SiteSection } from '@/lib/site-data';

function renderSection(section: SiteSection) {
  switch (section.type) {
    case 'hero':
      return (
        <HeroSection
          key={section.id}
          content={{
            ...section.content,
            settings: section.content.settings ?? section.settings,
          }}
        />
      );
    case 'cardGrid':
    case 'services':
      return (
        <CardGridSection
          key={section.id}
          content={{
            ...section.content,
            settings: section.content.settings ?? section.settings,
          }}
        />
      );
    case 'about':
      return <AboutSection key={section.id} content={section.content} />;
    case 'contact':
      return <ContactSection key={section.id} content={section.content} />;
    default:
      return null;
  }
}

export function SitePage() {
  const { sections } = useSiteData();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>{sections.map(renderSection)}</main>
      <Footer />
    </div>
  );
}
