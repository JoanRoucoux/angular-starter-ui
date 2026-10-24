import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import { setProjectAnnotations } from '@storybook/angular-vite';
import { afterEach } from 'vitest';

import * as projectAnnotations from './preview';

const layoutAnnotations = {
  beforeEach: ({ parameters }: { parameters: { layout?: string } }) => {
    document.body.style.padding = (parameters.layout ?? 'padded') === 'padded' ? '1rem' : '';

    return () => {
      document.body.style.padding = '';
    };
  },
};

const TABBABLE_SELECTOR = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  'summary',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(',');

const hasOutline = (style: CSSStyleDeclaration): boolean =>
  style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;

const describe = (el: Element): string => {
  const name = el.getAttribute('aria-label') ?? el.textContent.trim().slice(0, 40);
  const classes = name ? '' : [...el.classList].slice(0, 4).join('.');

  return `<${el.localName}${classes ? `.${classes}` : ''}>${name ? ` "${name}"` : ''}`;
};

const isTabbable = (el: Element): boolean => {
  if (!(el instanceof HTMLElement) || el.matches(':disabled') || el.inert || el.tabIndex < 0) {
    return false;
  }

  if (el instanceof HTMLInputElement && el.type === 'hidden') {
    return false;
  }

  return el.checkVisibility();
};

const focusRingGuard = {
  afterEach: () => {
    const missing: string[] = [];

    for (const el of document.querySelectorAll<HTMLElement>(TABBABLE_SELECTOR)) {
      if (!isTabbable(el)) {
        continue;
      }

      el.focus({ focusVisible: true } as FocusOptions);

      if (document.activeElement !== el) {
        continue;
      }

      if (![null, '::before', '::after'].some((pseudo) => hasOutline(getComputedStyle(el, pseudo)))) {
        missing.push(describe(el));
      }
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    if (missing.length > 0) {
      throw new Error(`Focus ring missing (no outline on the element, ::before or ::after):\n${missing.join('\n')}`);
    }
  },
};

export const storyAnnotations = [a11yAddonAnnotations, projectAnnotations, layoutAnnotations, focusRingGuard];

setProjectAnnotations(storyAnnotations);

const nextFrames = (): Promise<void> =>
  new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

afterEach(async () => {
  if (window.scrollX !== 0 || window.scrollY !== 0) {
    window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
    await nextFrames();
  }
});
