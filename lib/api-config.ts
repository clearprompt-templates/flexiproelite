const trimTrailingSlash = (url: string) => url.replace(/\/$/, '');

/** ClearPrompt API hosts — code defaults only; no `.env` required. */
export const DEFAULT_PROD_API_BASE = 'https://api.clearprompt.dev';
export const DEFAULT_SANDBOX_API_BASE = 'https://api.sandbox.clearprompt.dev';

export const BY_ORIGIN_PATH = '/api/v1/website/templates/by-origin';
export const CONTACT_PATH = '/api/v1/website/contact';

/**
 * Sandbox hosts: local dev and ClearPrompt sandbox deployments.
 * Everything else uses production API.
 */
export const isSandboxOrigin = (origin: string): boolean => {
  try {
    const { hostname } = new URL(origin);
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('sandbox-');
  } catch {
    return false;
  }
};

/** Current browser origin, or empty during SSR. */
export const getBrowserOrigin = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
};

/**
 * Resolve ClearPrompt API base from the site origin.
 * - localhost / 127.0.0.1 / sandbox-* → sandbox API
 * - otherwise → production API
 */
export const getApiBaseUrl = (origin?: string): string => {
  const siteOrigin = origin ?? getBrowserOrigin();
  if (siteOrigin && isSandboxOrigin(siteOrigin)) {
    return DEFAULT_SANDBOX_API_BASE;
  }
  return DEFAULT_PROD_API_BASE;
};

/** Full by-origin templates URL for the given (or current) site origin. */
export const getTemplatesByOriginUrl = (origin?: string): string => {
  return `${getApiBaseUrl(origin)}${BY_ORIGIN_PATH}`;
};

/** Contact form POST URL for the current site origin. */
export const getContactApiUrl = (origin?: string): string => {
  return `${getApiBaseUrl(origin)}${CONTACT_PATH}`;
};

export { trimTrailingSlash };
