import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview } from '@storybook/angular-vite';
import { getPreferredColorScheme } from 'storybook/theming';

import './preview.css';
import { storybookTheme } from './theme';

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: {
        system: '',
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'system',
      attributeName: 'data-theme',
      parentSelector: 'html',
    }),
  ],
  parameters: {
    controls: { expanded: true },
    a11y: { test: 'error' },
    docs: { theme: storybookTheme(getPreferredColorScheme()) },
    options: {
      storySort: {
        order: ['Foundations', ['Overview', 'Colors', 'Typography'], 'Inputs', 'Data display'],
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
