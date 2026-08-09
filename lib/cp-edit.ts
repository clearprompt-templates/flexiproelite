/** ClearPrompt tap-to-edit helpers — maps DOM markers to JSON editor paths. */

export const CP_EDIT_MESSAGE_TYPE = 'clearprompt:edit-select' as const;
export const CP_PREVIEW_MODE_MESSAGE_TYPE = 'clearprompt:preview-mode' as const;

export type CpPreviewInteractionMode = 'edit' | 'browse';

export type CpEditSelectMessage = {
  type: typeof CP_EDIT_MESSAGE_TYPE;
  groupId: string;
  sectionId?: string;
  fieldPath?: string;
  fieldKind?: 'text' | 'textarea' | 'image' | 'color';
};

export type SectionEditContext = {
  pageIndex: number;
  sectionIndex: number;
  sectionId: string;
};

export function isClearPromptEditPreview(): boolean {
  if (typeof window === 'undefined') return false;
  return /-preview\.clearprompt\.dev$/i.test(window.location.hostname);
}

export function parsePreviewModeMessage(data: unknown): CpPreviewInteractionMode | null {
  if (!data || typeof data !== 'object') return null;
  const record = data as Record<string, unknown>;
  if (record.type !== CP_PREVIEW_MODE_MESSAGE_TYPE) return null;
  if (record.mode === 'browse') return 'browse';
  if (record.mode === 'edit') return 'edit';
  return null;
}

export function readPreviewModeFromUrl(): CpPreviewInteractionMode | null {
  if (typeof window === 'undefined') return null;
  const param = new URLSearchParams(window.location.search).get('cpMode');
  if (param === 'browse') return 'browse';
  if (param === 'edit') return 'edit';
  return null;
}

/** Shared preview interaction mode (edit vs browse) for link / UX helpers. */
let previewInteractionMode: CpPreviewInteractionMode =
  typeof window !== 'undefined' ? (readPreviewModeFromUrl() ?? 'edit') : 'edit';

export function getPreviewInteractionMode(): CpPreviewInteractionMode {
  return previewInteractionMode;
}

export function setPreviewInteractionMode(mode: CpPreviewInteractionMode): void {
  previewInteractionMode = mode;
}

/** True when Direct edit should capture clicks instead of following links. */
export function shouldBlockPreviewNavigation(): boolean {
  if (!isClearPromptEditPreview()) return false;
  return getPreviewInteractionMode() === 'edit';
}

export function sectionGroupId(pageIndex: number, sectionIndex: number): string {
  return `page-${pageIndex}-section-${sectionIndex}`;
}

export function fieldPath(
  pageIndex: number,
  sectionIndex: number,
  ...segments: (string | number)[]
): string {
  return jsonPath('pages', pageIndex, 'sections', sectionIndex, ...segments);
}

export function jsonPath(...segments: (string | number)[]): string {
  return segments.map(String).join('.');
}

/** Matches templateJsonEditor inferGroup — used for nav, footer, siteConfig fields. */
export function inferGroupIdFromPath(path: string): string {
  const [root, sub, third, fourth] = path.split('.');
  if (root === 'siteConfig') {
    if (sub === 'theme') return 'theme';
    if (sub === 'brand') return 'brand';
    if (sub === 'seo') return 'seo';
    if (sub === 'contact') return 'site-config-contact';
    if (sub === 'analytics') return 'site-config-analytics';
    return 'siteConfig';
  }
  if (root === 'meta') return 'meta';
  if (root === 'navigation') {
    if (sub === 'header') return 'navigation-header';
    if (sub === 'footer') return 'navigation-footer';
    return 'navigation';
  }
  if (root === 'pages' && sub !== undefined && third === 'sections' && fourth !== undefined) {
    return `page-${sub}-section-${fourth}`;
  }
  if (root === 'pages' && sub !== undefined && third === 'hero') {
    return `page-${sub}-hero`;
  }
  if (root === 'content') {
    if (sub === 'programs') return 'content-programs';
    if (sub === 'faculty') return 'content-faculty';
    if (sub === 'testimonials') return 'content-testimonials';
    if (sub === 'gallery') return 'content-gallery';
    return 'content';
  }
  return 'other';
}

export function sectionAttrs(ctx: SectionEditContext): Record<string, string> {
  return {
    'data-cp-section': ctx.sectionId,
    'data-cp-group': sectionGroupId(ctx.pageIndex, ctx.sectionIndex),
  };
}

export function fieldAttrs(
  path: string,
  kind: CpEditSelectMessage['fieldKind'] = 'text'
): Record<string, string> {
  return {
    'data-cp-path': path,
    'data-cp-kind': kind,
  };
}

/** For navigation, footer, and siteConfig fields outside page sections. */
export function globalFieldAttrs(
  path: string,
  kind: CpEditSelectMessage['fieldKind'] = 'text'
): Record<string, string> {
  return {
    ...fieldAttrs(path, kind),
    'data-cp-group': inferGroupIdFromPath(path),
  };
}

export function postEditSelection(message: Omit<CpEditSelectMessage, 'type'>): void {
  if (typeof window === 'undefined' || window.parent === window) return;
  window.parent.postMessage({ type: CP_EDIT_MESSAGE_TYPE, ...message }, '*');
}
