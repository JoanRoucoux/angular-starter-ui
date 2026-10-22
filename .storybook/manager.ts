import { addons } from 'storybook/manager-api';
import { getPreferredColorScheme } from 'storybook/theming';

import { storybookTheme } from './theme';

addons.setConfig({ theme: storybookTheme(getPreferredColorScheme()) });
