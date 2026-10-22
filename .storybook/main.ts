import type { StorybookConfig } from '@storybook/angular-vite';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';

const { name } = JSON.parse(readFileSync(new URL('../projects/ui/package.json', import.meta.url), 'utf8')) as {
  name: string;
};

const config: StorybookConfig = {
  stories: ['../projects/ui/docs/**/*.mdx', '../projects/ui/**/*.stories.ts'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-themes'],
  framework: {
    name: '@storybook/angular-vite',
    options: { compodoc: false },
  },
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      resolve: {
        alias: [
          {
            find: new RegExp(`^${name}/(?!styles/)(.+)$`),
            replacement: `${fileURLToPath(new URL('../projects/ui', import.meta.url))}/$1`,
          },
        ],
      },
    }),
  staticDirs: ['../public'],
  features: {
    sidebarOnboardingChecklist: false,
    menuOnboardingChecklist: false,
  },
};

export default config;
