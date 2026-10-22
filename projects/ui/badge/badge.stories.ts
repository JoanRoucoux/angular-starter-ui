import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular-vite';
import { expect, within } from 'storybook/test';

import { BADGE_VARIANTS, type BadgeVariant, UiBadge } from './badge';

type BadgeArgs = {
  variant: BadgeVariant;
  label: string;
};

const meta: Meta<BadgeArgs> = {
  title: 'Data display/Badge',
  parameters: {
    docs: {
      description: {
        component: `Small status descriptor for a count, a state or a label.

#### When to use

* To tag an item with a short state: draft, new, archived.
* To show a small count next to a label.

#### When not to use

* For an action: a badge is not interactive, use a button.
* For a long sentence. A badge holds one or two words.

#### Accessibility

* A badge is plain text in a \`<ui-badge>\` element, read in the flow of the page.
* Never rely on the variant color alone to carry the meaning: the text must say it too.`,
      },
    },
  },
  decorators: [moduleMetadata({ imports: [UiBadge] })],
  render: (args) => ({
    props: args,
    template: `<ui-badge [variant]="variant">{{ label }}</ui-badge>`,
  }),
  args: {
    variant: 'primary',
    label: 'Badge',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [...BADGE_VARIANTS],
      description: 'Visual weight of the badge: primary, secondary, destructive or outline.',
    },
    label: { control: 'text', description: 'Story-only text projected inside the badge.' },
  },
};

export default meta;
type Story = StoryObj<BadgeArgs>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Destructive: Story = {
  args: { variant: 'destructive' },
};

export const Outline: Story = {
  args: { variant: 'outline' },
};

export const RendersContent: Story = {
  args: { label: 'New' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(args.label)).toBeVisible();
  },
};
