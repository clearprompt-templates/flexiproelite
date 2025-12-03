import { useState, useEffect, useMemo } from 'react';
import { SiteConfiguration, Theme, Section, ApiResponse } from '../types/config';
import { transformConfig } from '../utils/transformConfig';

export function useConfig() {
  const [config, setConfig] = useState<SiteConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Get environment variables
        const apiUrl = import.meta.env.VITE_API_URL;
        const templateId = import.meta.env.VITE_TEMPLATE_ID;
        const templateName = import.meta.env.VITE_TEMPLATE_NAME;

        if (!apiUrl || !templateId) {
          throw new Error('Missing required environment variables: VITE_API_URL and VITE_TEMPLATE_ID');
        }

        // Build URL with template ID as query parameter
        const url = `${apiUrl}/?template_id=${encodeURIComponent(templateId)}`;

        console.log(`Fetching config for template: ${templateName} (${templateId})`);

        // Fetch from API endpoint (POST request)
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
          },
          body: '',
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to load configuration from API: ${response.status} ${response.statusText}. ${errorText}`);
        }

        const apiResponse: any = await response.json();
        
        // Log the response structure for debugging
        console.log('API Response structure:', {
          hasContents: !!apiResponse.contents,
          contentsType: typeof apiResponse.contents,
          contentsKeys: apiResponse.contents ? Object.keys(apiResponse.contents) : null,
          responseKeys: Object.keys(apiResponse),
          fullResponse: apiResponse
        });
        
        // Extract the contents from the API response
        // Handle both cases: wrapped in 'contents' or direct response
        let data = apiResponse.contents || apiResponse;
        
        // Validate that data exists and has required structure
        if (!data) {
          console.error('API Response:', apiResponse);
          throw new Error('API response is empty or invalid. Please check the API response structure.');
        }
        
        if (!data.pages || !Array.isArray(data.pages)) {
          console.error('Data structure:', {
            hasPages: !!data.pages,
            pagesType: typeof data.pages,
            dataKeys: Object.keys(data),
            data: data
          });
          throw new Error('Configuration missing pages array. Please ensure the config has a valid pages structure.');
        }
        
        // Transform the data to handle API structure differences
        data = transformConfig(data);
        
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
        console.error('Error loading config from API:', err);
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
