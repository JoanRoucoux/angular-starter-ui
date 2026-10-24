import { setProjectAnnotations } from '@storybook/angular-vite';

import { storyAnnotations } from './vitest.setup';

setProjectAnnotations([...storyAnnotations, { initialGlobals: { theme: 'dark' } }]);
