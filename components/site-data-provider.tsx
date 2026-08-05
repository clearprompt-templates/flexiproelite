'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { SiteData, SiteSection } from '@/lib/site-data';
import { getHomeSections } from '@/lib/site-data';

type SiteDataContextValue = {
  data: SiteData;
  sections: SiteSection[];
};

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

export function SiteDataProvider({ data, children }: { data: SiteData; children: ReactNode }) {
  return (
    <SiteDataContext.Provider value={{ data, sections: getHomeSections(data) }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within SiteDataProvider');
  }
  return context;
}
