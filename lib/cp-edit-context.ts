import type { SectionEditContext } from './cp-edit';
import { getPageByPath, type SiteData } from './site-data';

/** Resolve JSON page index + section index for tap-to-edit paths. */
export function buildSectionEditContext(
  data: SiteData,
  pagePath: string,
  sectionId: string
): SectionEditContext {
  const page = getPageByPath(data, pagePath);
  const pageIndex = page
    ? Math.max(
        0,
        data.pages.findIndex((p) => p.id === page.id || p.path === page.path)
      )
    : Math.max(
        0,
        data.pages.findIndex((p) => p.path === pagePath)
      );

  const sections = data.pages[pageIndex]?.sections ?? [];
  const sectionIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === sectionId)
  );

  return { pageIndex, sectionIndex, sectionId };
}

/** Page index for `pages.{n}.hero.*` markers. */
export function buildPageIndex(data: SiteData, pagePath: string): number {
  const byId = data.pages.findIndex((p) => p.id === pagePath);
  if (byId >= 0) return byId;

  const page = getPageByPath(data, pagePath);
  if (page) {
    return Math.max(
      0,
      data.pages.findIndex((p) => p.id === page.id || p.path === page.path)
    );
  }
  return Math.max(
    0,
    data.pages.findIndex((p) => p.path === pagePath)
  );
}
