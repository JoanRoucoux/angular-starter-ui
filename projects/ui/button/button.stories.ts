import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { BUTTON_SIZES, BUTTON_VARIANTS, type ButtonSize, type ButtonVariant, UiButton } from './button';

type ButtonArgs = {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled: boolean;
  label: string;
  onClick: () => void;
};

const meta: Meta<ButtonArgs> = {
  title: 'Inputs/Button',
  parameters: {
    docs: {
      description: {
        component: `Clickable element that triggers an action. Its variant tells the user how consequential the action is.

#### When to use

* For any action taken on the current screen: saving a draft, opening a dialog, deleting a record.
* On an \`<a>\`, only for a navigation the browser performs itself, such as a file download.

#### When not to use

* For ordinary navigation between screens. A link should look like a link.
* More than one \`primary\` per screen. If every action is emphasized, none of them is.
* For a destructive action without a confirmation step.

#### Accessibility

* The host stays a native \`<button>\` or \`<a>\`, so focus, activation with Enter or Space and the disabled state come from the platform.
* A button needs a visible text or an \`aria-label\`.`,
      },
    },
  },
  decorators: [moduleMetadata({ imports: [UiButton] })],
  render: (args) => ({
    props: args,
    template: `<button ui-button [variant]="variant" [size]="size" [disabled]="disabled" (click)="onClick()">{{ label }}</button>`,
  }),
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    label: 'Button',
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [...BUTTON_VARIANTS],
      description:
        'How much emphasis the action carries: primary for the expected action, destructive for an irreversible one.',
    },
    size: {
      control: 'select',
      options: [...BUTTON_SIZES],
      description: 'Height and padding of the button.',
    },
    disabled: {
      control: 'boolean',
      description: 'Native disabled attribute: the button leaves the tab order instead of only looking inactive.',
    },
    label: { control: 'text', description: 'Story-only text projected inside the button.' },
    onClick: { action: 'onClick', table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Destructive: Story = {
  args: { variant: 'destructive' },
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Large: Story = {
  args: { size: 'lg' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AsLink: Story = {
  render: (args) => ({
    props: args,
    template: `<a ui-button [variant]="variant" [size]="size" href="data:text/plain;charset=utf-8,report" download="report.txt">{{ label }}</a>`,
  }),
  args: { label: 'Download report' },
};

export const EmitsClicks: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Button' }));

    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
