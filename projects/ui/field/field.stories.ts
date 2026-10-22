import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular-vite';
import { UiInput, UiTextarea } from 'angular-starter-ui/input';
import { expect, userEvent, within } from 'storybook/test';

import { UiField } from './field';

type FieldArgs = {
  label: string;
  labelHidden: boolean;
  hint: string;
  error: string;
};

const meta: Meta<FieldArgs> = {
  title: 'Components/Field',
  decorators: [moduleMetadata({ imports: [UiField, UiInput, UiTextarea] })],
  render: (args) => ({
    props: args,
    template: `<ui-field [label]="label" [labelHidden]="labelHidden" [hint]="hint" [error]="error"><input uiInput type="email" /></ui-field>`,
  }),
  args: {
    label: 'Email',
    labelHidden: false,
    hint: '',
    error: '',
  },
  argTypes: {
    label: { control: 'text' },
    labelHidden: { control: 'boolean' },
    hint: { control: 'text' },
    error: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<FieldArgs>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: 'We never share it' },
};

export const WithError: Story = {
  args: { error: 'Enter a valid email' },
};

export const LabelHidden: Story = {
  args: { label: 'Search', labelHidden: true },
};

export const WithTextarea: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-field [label]="label" [hint]="hint"><textarea uiTextarea></textarea></ui-field>`,
  }),
  args: { label: 'Notes', hint: 'Optional' },
};

export const LabelsTheControl: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Email' });

    await userEvent.type(input, 'jane@example.com');

    await expect(input).toHaveValue('jane@example.com');
  },
};
