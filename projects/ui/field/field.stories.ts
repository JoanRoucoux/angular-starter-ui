import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular-vite';
import { UiInput, UiTextarea } from 'angular-starter-ui/input';
import { expect, userEvent, within } from 'storybook/test';

import { UiField } from './field';

type FieldArgs = {
  label: string;
  labelHidden: boolean;
  hint: string;
  error: string;
  requiredText: string;
};

const meta: Meta<FieldArgs> = {
  title: 'Inputs/Field',
  parameters: {
    docs: {
      description: {
        component: `Label, control, hint and error as one unit. It finds the projected input or textarea and wires the label and the ARIA attributes. The message comes from \`error\`, which wins, or else from the control's own validation state once touched.

#### When to use

* Around every input or textarea that needs a visible label.
* To show a hint under a control or a validation message.

#### When not to use

* Around a control that already has its own label, such as a checkbox.
* To lay out several controls side by side: a field wraps exactly one control.

#### Accessibility

* The label is bound to the control through \`for\` and \`id\`; the hint and the error are bound through \`aria-describedby\`.
* An error sets \`aria-invalid\` on the control and is announced through \`role="alert"\`.
* \`labelHidden\` keeps the label for assistive technologies and hides it visually.
* A control with the native \`required\` attribute gets a visible marker after the label (\`requiredText\`). The marker is hidden from assistive technologies, which already read \`required\` from the control.`,
      },
    },
  },
  decorators: [moduleMetadata({ imports: [UiField, UiInput, UiTextarea] })],
  render: (args) => ({
    props: args,
    template: `<ui-field [label]="label" [labelHidden]="labelHidden" [hint]="hint" [error]="error" [requiredText]="requiredText"><input uiInput type="email" /></ui-field>`,
  }),
  args: {
    label: 'Email',
    labelHidden: false,
    hint: '',
    error: '',
    requiredText: '(required)',
  },
  argTypes: {
    label: { control: 'text', description: 'Visible label, bound to the projected control.' },
    labelHidden: {
      control: 'boolean',
      description: 'Hides the label visually but keeps it for assistive technologies.',
    },
    hint: { control: 'text', description: 'Help text shown under the control and read as its description.' },
    error: {
      control: 'text',
      description: 'Error message. It wins over the control errors and marks the control invalid.',
    },
    requiredText: {
      control: 'text',
      description: 'Visible marker shown after the label when the projected control has the native required attribute.',
    },
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

export const Required: Story = {
  render: (args) => ({
    props: args,
    template: `<ui-field [label]="label" [hint]="hint" [requiredText]="requiredText"><input uiInput type="email" required /></ui-field>`,
  }),
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
