import type { SheriffConfig } from '@softarc/sheriff-core';

export const config: SheriffConfig = {
  entryFile: 'projects/ui/src/public-api.ts',
  enableBarrelLess: true,
  modules: {
    'projects/ui/<component>': 'component:<component>',
  },
  depRules: {
    root: ['component:*'],
    'component:*': [],
  },
};
