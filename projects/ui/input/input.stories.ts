import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular-vite';
import { expect, userEvent, within } from 'storybook/test';

import { UiInput, UiTextarea } from './input';

type InputArgs = {
  type: string;
  placeholder: string;
  disabled: boolean;
};

const meta: Meta<InputArgs> = {
  title: 'Inputs/Input',
  parameters: {
    docs: {
      description: {
        component: `Styled native text input. The host stays a plain \`<input>\`, so every forms flavor and every native attribute keep working.

#### When to use

* For a single line of free text: an email, a name, a search term.
* Inside a \`ui-field\` when it needs a visible label, a hint or an error message.

#### When not to use

* For multi-line text: use \`textarea[uiTextarea]\`.
* For a choice among a few options: a select or radio group states the options up front.

#### Accessibility

* Every input needs an accessible name: wrap it in a \`ui-field\`, or set \`aria-label\`.
* \`aria-invalid="true"\` turns the border to the destructive token; \`ui-field\` sets it for you when it shows an error.`,
      },
    },
  },
  decorators: [moduleMetadata({ imports: [UiInput, UiTextarea] })],
  render: (args) => ({
    props: args,
    template: `<input uiInput [type]="type" [placeholder]="placeholder" [disabled]="disabled" aria-label="Example" />`,
  }),
  args: {
    type: 'text',
    placeholder: 'you@example.com',
    disabled: false,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search'],
      description: 'Native input type, which drives the mobile keyboard and browser validation.',
    },
    placeholder: { control: 'text', description: 'Hint shown while empty. It never replaces a label.' },
    disabled: { control: 'boolean', description: 'Native disabled attribute.' },
  },
};

export default meta;
type Story = StoryObj<InputArgs>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Textarea: Story = {
  render: () => ({
    template: `<textarea uiTextarea aria-label="Notes"></textarea>`,
  }),
};

export const Invalid: Story = {
  render: (args) => ({
    props: args,
    template: `<input uiInput [type]="type" [placeholder]="placeholder" [disabled]="disabled" aria-label="Example" aria-invalid="true" />`,
  }),
};

export const AcceptsTyping: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Example' });

    await userEvent.type(input, 'jane@example.com');

    await expect(input).toHaveValue('jane@example.com');
  },
};
