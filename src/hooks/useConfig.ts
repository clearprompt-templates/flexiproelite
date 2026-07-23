import { useState, useEffect, useMemo } from 'react';
import { SiteConfiguration, Theme, Section } from '../types/config';
import { transformConfig } from '../utils/transformConfig';
import fallbackConfig from '../../flexiproelite.json';

function normalizeConfig(rawData: unknown): SiteConfiguration {
  const data = (rawData as { contents?: SiteConfiguration }).contents || (rawData as SiteConfiguration);

  if (!data) {
    throw new Error('Configuration data is empty or invalid.');
  }

  if (!data.pages || !Array.isArray(data.pages)) {
    throw new Error('Configuration missing pages array. Please ensure the config has a valid pages structure.');
  }

  const transformed = transformConfig(data);

  if (transformed.siteConfig?.theme) {
    transformed.siteConfig.theme = {
      ...transformed.siteConfig.theme,
      primaryColor: transformed.siteConfig.theme.colors?.primary || transformed.siteConfig.theme.primaryColor,
      secondaryColor: transformed.siteConfig.theme.colors?.secondary || transformed.siteConfig.theme.secondaryColor,
      accentColor: transformed.siteConfig.theme.colors?.accent || transformed.siteConfig.theme.accentColor,
      backgroundColor: transformed.siteConfig.theme.colors?.background || transformed.siteConfig.theme.backgroundColor,
      textColor: transformed.siteConfig.theme.colors?.text || transformed.siteConfig.theme.textColor,
      fontFamily: transformed.siteConfig.theme.typography?.fontFamily || transformed.siteConfig.theme.fontFamily,
    };
  }

  return transformed;
}

function loadFallbackConfig(): SiteConfiguration {
  return normalizeConfig(fallbackConfig);
}

async function loadConfigFromApi(apiUrl: string, templateId: string, templateName?: string): Promise<SiteConfiguration> {
  const url = `${apiUrl}/?template_id=${encodeURIComponent(templateId)}`;

  console.log(`Fetching config for template: ${templateName || 'unknown'} (${templateId})`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
    },
    body: '',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to load configuration from API: ${response.status} ${response.statusText}. ${errorText}`);
  }

  const apiResponse = await response.json();

  console.log('API Response structure:', {
    hasContents: !!apiResponse.contents,
    contentsType: typeof apiResponse.contents,
    contentsKeys: apiResponse.contents ? Object.keys(apiResponse.contents) : null,
    responseKeys: Object.keys(apiResponse),
  });

  return normalizeConfig(apiResponse);
}

export function useConfig() {
  const [config, setConfig] = useState<SiteConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const templateId = import.meta.env.VITE_TEMPLATE_ID;
        const templateName = import.meta.env.VITE_TEMPLATE_NAME;

        let data: SiteConfiguration;

        if (!apiUrl || !templateId) {
          console.warn('Missing VITE_API_URL or VITE_TEMPLATE_ID. Loading fallback config from flexiproelite.json.');
          data = loadFallbackConfig();
        } else {
          try {
            data = await loadConfigFromApi(apiUrl, templateId, templateName);
          } catch (apiError) {
            console.warn('Failed to load config from API. Falling back to flexiproelite.json.', apiError);
            data = loadFallbackConfig();
          }
        }

        setConfig(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error loading site configuration:', err);
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
