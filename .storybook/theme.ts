import { type ThemeVars, create } from 'storybook/theming';

const PALETTE = {
  light: {
    background: '#ffffff',
    foreground: '#09090b',
    card: '#ffffff',
    elevated: '#f4f4f5',
    border: '#e4e4e7',
    mutedForeground: '#71717a',
    primary: '#18181b',
  },
  dark: {
    background: '#09090b',
    foreground: '#fafafa',
    card: '#0d0d0f',
    elevated: '#27272a',
    border: '#27272a',
    mutedForeground: '#a1a1aa',
    primary: '#fafafa',
  },
} as const;

const FONT_BASE = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
const FONT_CODE = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

export const storybookTheme = (scheme: 'light' | 'dark'): ThemeVars => {
  const palette = PALETTE[scheme];

  return create({
    base: scheme,

    colorPrimary: palette.primary,
    colorSecondary: palette.foreground,

    appBg: palette.background,
    appContentBg: palette.card,
    appPreviewBg: palette.background,
    appBorderColor: palette.border,
    appBorderRadius: 8,

    fontBase: FONT_BASE,
    fontCode: FONT_CODE,

    textColor: palette.foreground,
    textInverseColor: palette.background,
    textMutedColor: palette.mutedForeground,

    barBg: palette.card,
    barTextColor: palette.mutedForeground,
    barHoverColor: palette.foreground,
    barSelectedColor: palette.foreground,

    buttonBg: palette.elevated,
    buttonBorder: palette.border,
    booleanBg: palette.elevated,
    booleanSelectedBg: palette.card,

    inputBg: palette.card,
    inputBorder: palette.border,
    inputTextColor: palette.foreground,
    inputBorderRadius: 6,

    brandTitle: 'UI library',
    brandUrl: './',
  });
};
