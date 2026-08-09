'use client';

import { useEffect, useState } from 'react';
import {
  isClearPromptEditPreview,
  parsePreviewModeMessage,
  readPreviewModeFromUrl,
  postEditSelection,
  setPreviewInteractionMode,
  type CpPreviewInteractionMode,
} from '@/lib/cp-edit';

const STYLE_ID = 'cp-edit-bridge-styles';
const RING_SELECTED_ID = 'cp-edit-ring-selected';
const RING_HOVER_ID = 'cp-edit-ring-hover';

const BRIDGE_CSS = `
html.cp-edit-mode [data-cp-path],
html.cp-edit-mode [data-cp-section] {
  cursor: pointer !important;
}

html.cp-edit-mode [data-cp-decorative] {
  pointer-events: none !important;
}

html.cp-edit-mode .cp-edit-selected {
  z-index: 11;
}

html.cp-edit-mode img[data-cp-path]:not([data-cp-bg-image]) {
  position: relative;
  z-index: 2;
}

html.cp-edit-mode img[data-cp-path],
html.cp-edit-mode [data-cp-path] img {
  cursor: pointer !important;
}

html.cp-edit-mode form input:not([data-cp-path]),
html.cp-edit-mode form textarea:not([data-cp-path]),
html.cp-edit-mode form select:not([data-cp-path]) {
  pointer-events: none;
}

.cp-edit-ring {
  position: absolute;
  pointer-events: none;
  z-index: 2147483646;
  display: none;
  box-sizing: border-box;
  border-radius: 8px;
  transition:
    top 0.1s ease,
    left 0.1s ease,
    width 0.1s ease,
    height 0.1s ease,
    opacity 0.12s ease;
}

.cp-edit-ring.is-visible {
  display: block;
}

.cp-edit-ring--hover {
  border: 1.5px dashed rgba(99, 102, 241, 0.55);
  background: rgba(99, 102, 241, 0.03);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.65);
}

.cp-edit-ring--selected {
  border: 2px solid #6366f1;
  background: rgba(99, 102, 241, 0.07);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.92),
    0 8px 24px rgba(99, 102, 241, 0.18);
}

.cp-edit-ring__label {
  position: absolute;
  top: 0;
  left: 10px;
  transform: translateY(calc(-100% - 6px));
  padding: 3px 9px;
  border-radius: 999px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #ffffff;
  font:
    600 10px/1.25 ui-sans-serif,
    system-ui,
    -apple-system,
    sans-serif;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.28);
}

.cp-edit-ring__corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border-color: #6366f1;
  border-style: solid;
}

.cp-edit-ring__corner--tl {
  top: -1px;
  left: -1px;
  border-width: 2.5px 0 0 2.5px;
  border-radius: 3px 0 0 0;
}

.cp-edit-ring__corner--tr {
  top: -1px;
  right: -1px;
  border-width: 2.5px 2.5px 0 0;
  border-radius: 0 3px 0 0;
}

.cp-edit-ring__corner--bl {
  bottom: -1px;
  left: -1px;
  border-width: 0 0 2.5px 2.5px;
  border-radius: 0 0 0 3px;
}

.cp-edit-ring__corner--br {
  bottom: -1px;
  right: -1px;
  border-width: 0 2.5px 2.5px 0;
  border-radius: 0 0 3px 0;
}
`.trim();

const KIND_LABELS: Record<string, string> = {
  text: 'Text',
  textarea: 'Paragraph',
  image: 'Image',
  color: 'Color',
  section: 'Section',
};

function ensureBridgeStyles(): void {
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = BRIDGE_CSS;
}

function createRing(id: string, variant: 'hover' | 'selected'): HTMLDivElement {
  let ring = document.getElementById(id) as HTMLDivElement | null;
  if (ring) return ring;

  ring = document.createElement('div');
  ring.id = id;
  ring.className = `cp-edit-ring cp-edit-ring--${variant}`;

  if (variant === 'selected') {
    const label = document.createElement('span');
    label.className = 'cp-edit-ring__label';
    ring.appendChild(label);

    for (const corner of ['tl', 'tr', 'bl', 'br'] as const) {
      const mark = document.createElement('span');
      mark.className = `cp-edit-ring__corner cp-edit-ring__corner--${corner}`;
      ring.appendChild(mark);
    }
  }

  document.body.appendChild(ring);
  return ring;
}

function getDocumentRect(el: HTMLElement, inset = 0): DOMRect {
  const rect = el.getBoundingClientRect();
  const scrollX = window.scrollX || document.documentElement.scrollLeft;
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  const pad = inset;

  return {
    x: rect.left + scrollX - pad,
    y: rect.top + scrollY - pad,
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
    top: rect.top + scrollY - pad,
    left: rect.left + scrollX - pad,
    right: rect.right + scrollX + pad,
    bottom: rect.bottom + scrollY + pad,
    toJSON: rect.toJSON.bind(rect),
  } as DOMRect;
}

function placeRing(ring: HTMLDivElement, el: HTMLElement, inset = 4): void {
  const rect = getDocumentRect(el, inset);
  ring.style.top = `${rect.top}px`;
  ring.style.left = `${rect.left}px`;
  ring.style.width = `${rect.width}px`;
  ring.style.height = `${rect.height}px`;
  ring.classList.add('is-visible');
}

function hideRing(ring: HTMLDivElement): void {
  ring.classList.remove('is-visible');
}

function selectionLabel(el: HTMLElement): string {
  const kind = el.getAttribute('data-cp-kind');
  if (kind && KIND_LABELS[kind]) return KIND_LABELS[kind];

  if (el.hasAttribute('data-cp-section')) return KIND_LABELS.section;

  const path = el.getAttribute('data-cp-path') ?? '';
  const leaf = path.split('.').pop() ?? 'field';
  return leaf.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}

function resolveTarget(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof HTMLElement)) return null;
  return target.closest('[data-cp-path], [data-cp-section]') as HTMLElement | null;
}

function clearEditSelection(): void {
  document.querySelectorAll('.cp-edit-selected').forEach((node) => {
    node.classList.remove('cp-edit-selected');
  });
}

export function CpEditBridge() {
  const [interactionMode, setInteractionMode] = useState<CpPreviewInteractionMode>(
    () => readPreviewModeFromUrl() ?? 'edit'
  );

  useEffect(() => {
    setPreviewInteractionMode(interactionMode);
  }, [interactionMode]);

  useEffect(() => {
    if (!isClearPromptEditPreview()) return;

    const onMessage = (event: MessageEvent) => {
      const mode = parsePreviewModeMessage(event.data);
      if (mode) setInteractionMode(mode);
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    if (!isClearPromptEditPreview()) return;

    ensureBridgeStyles();

    if (interactionMode !== 'edit') {
      document.documentElement.classList.remove('cp-edit-mode');
      clearEditSelection();
      document.getElementById(RING_HOVER_ID)?.classList.remove('is-visible');
      document.getElementById(RING_SELECTED_ID)?.classList.remove('is-visible');
      return;
    }

    document.documentElement.classList.add('cp-edit-mode');

    const hoverRing = createRing(RING_HOVER_ID, 'hover');
    const selectedRing = createRing(RING_SELECTED_ID, 'selected');
    const selectedLabel = selectedRing.querySelector('.cp-edit-ring__label') as HTMLSpanElement;

    let selected: HTMLElement | null = null;
    let hoverTarget: HTMLElement | null = null;
    let rafId = 0;

    const syncRings = () => {
      if (selected) {
        placeRing(selectedRing, selected, 5);
        selectedLabel.textContent = selectionLabel(selected);
      }
      if (hoverTarget && hoverTarget !== selected) {
        placeRing(hoverRing, hoverTarget, 4);
      } else {
        hideRing(hoverRing);
      }
    };

    const scheduleSync = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        syncRings();
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      const el = resolveTarget(event.target);
      if (!el || el === selected) {
        if (hoverTarget) {
          hoverTarget = null;
          hideRing(hoverRing);
        }
        return;
      }

      if (el !== hoverTarget) {
        hoverTarget = el;
        placeRing(hoverRing, el, 4);
      } else {
        placeRing(hoverRing, el, 4);
      }
    };

    const handleMouseLeave = (event: MouseEvent) => {
      const related = event.relatedTarget;
      if (related instanceof Node && document.body.contains(related)) return;
      hoverTarget = null;
      hideRing(hoverRing);
    };

    const handleClick = (event: MouseEvent) => {
      const el = resolveTarget(event.target);
      if (!el) return;

      event.preventDefault();
      event.stopPropagation();

      if (selected) selected.classList.remove('cp-edit-selected');
      selected = el;
      selected.classList.add('cp-edit-selected');

      hoverTarget = null;
      hideRing(hoverRing);
      placeRing(selectedRing, el, 5);
      selectedLabel.textContent = selectionLabel(el);
      observeSelected(el);

      const groupEl = el.closest('[data-cp-group]');
      const groupId =
        el.getAttribute('data-cp-group') ?? groupEl?.getAttribute('data-cp-group') ?? '';
      const fieldPath = el.getAttribute('data-cp-path') ?? undefined;
      const fieldKind = el.getAttribute('data-cp-kind') as
        'text' | 'textarea' | 'image' | 'color' | undefined;
      const sectionId = el.getAttribute('data-cp-section') ?? undefined;

      if (!groupId && !fieldPath) return;

      postEditSelection({
        groupId,
        sectionId,
        fieldPath,
        fieldKind,
      });
    };

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => scheduleSync()) : null;

    const observeSelected = (el: HTMLElement | null) => {
      resizeObserver?.disconnect();
      if (el) resizeObserver?.observe(el);
    };

    document.addEventListener('click', handleClick, true);
    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);
    window.addEventListener('scroll', scheduleSync, true);
    window.addEventListener('resize', scheduleSync);

    return () => {
      document.documentElement.classList.remove('cp-edit-mode');
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('mousemove', handleMouseMove, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      window.removeEventListener('scroll', scheduleSync, true);
      window.removeEventListener('resize', scheduleSync);
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      if (selected) selected.classList.remove('cp-edit-selected');
      hideRing(hoverRing);
      hideRing(selectedRing);
    };
  }, [interactionMode]);

  return null;
}
