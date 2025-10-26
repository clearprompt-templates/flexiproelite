import { useState, useEffect, useMemo } from 'react';
import { SiteConfiguration, Theme, Section } from '../types/config';

export function useConfig() {
  const [config, setConfig] = useState<SiteConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/config.json');

        if (!response.ok) {
          throw new Error('Failed to load configuration');
        }

        const data = await response.json();
        
        // Ensure backward compatibility by adding legacy theme properties
        if (data.siteConfig?.theme) {
          data.siteConfig.theme = {
            ...data.siteConfig.theme,
            primaryColor: data.siteConfig.theme.colors?.primary || data.siteConfig.theme.primaryColor,
            secondaryColor: data.siteConfig.theme.colors?.secondary || data.siteConfig.theme.secondaryColor,
            accentColor: data.siteConfig.theme.colors?.accent || data.siteConfig.theme.accentColor,
            backgroundColor: data.siteConfig.theme.colors?.background || data.siteConfig.theme.backgroundColor,
            textColor: data.siteConfig.theme.colors?.text || data.siteConfig.theme.textColor,
            fontFamily: data.siteConfig.theme.typography?.fontFamily || data.siteConfig.theme.fontFamily,
          };
        }
        
        setConfig(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error loading config:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // Helper to get a specific page by ID or path
  const getPage = useMemo(() => {
    return (identifier: string) => {
      if (!config) return null;
      return config.pages.find(
        (page) => page.id === identifier || page.path === identifier
      );
    };
  }, [config]);

  // Helper to get enabled sections from a page
  const getEnabledSections = useMemo(() => {
    return (pageId: string): Section[] => {
      const page = getPage(pageId);
      if (!page) return [];
      return page.sections
        .filter((section) => section.enabled)
        .sort((a, b) => a.order - b.order);
    };
  }, [getPage]);

  // Helper to get a specific section by ID
  const getSection = useMemo(() => {
    return (pageId: string, sectionId: string): Section | null => {
      const page = getPage(pageId);
      if (!page) return null;
      return page.sections.find((section) => section.id === sectionId) || null;
    };
  }, [getPage]);

  // Helper to get theme with all computed values
  const theme = useMemo((): Theme | null => {
    if (!config?.siteConfig?.theme) return null;
    return config.siteConfig.theme;
  }, [config]);

  return {
    config,
    loading,
    error,
    // Helper methods
    getPage,
    getEnabledSections,
    getSection,
    theme,
    // Quick access to commonly used config parts
    brand: config?.siteConfig?.brand || null,
    navigation: config?.navigation || null,
    meta: config?.meta || null,
  };
}
