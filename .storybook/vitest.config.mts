import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { storybookAngularVitest } from '@storybook/angular-vite/vitest';
import { playwright } from '@vitest/browser-playwright';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const dirname = fileURLToPath(new URL('.', import.meta.url));

const storybookProject = (name: string, setupFile: string): ReturnType<typeof defineConfig>['test'] => ({
  name,
  setupFiles: [`${dirname}${setupFile}`],
  browser: {
    enabled: true,
    headless: true,
    provider: playwright(),
    instances: [{ browser: 'chromium' }],
  },
});

export default defineConfig({
  test: {
    projects: [
      {
        extends: false,
        plugins: [storybookAngularVitest({ zoneless: true }), storybookTest({ configDir: dirname })],
        test: storybookProject('storybook', 'vitest.setup.ts'),
      },
      {
        extends: false,
        plugins: [storybookAngularVitest({ zoneless: true }), storybookTest({ configDir: dirname })],
        test: storybookProject('storybook-dark', 'vitest.setup.dark.ts'),
      },
    ],
  },
});
