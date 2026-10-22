import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';

import { UiInput, UiTextarea } from './input';

describe('UiInput', () => {
  it('styles the native input and accepts typing', async () => {
    const user = userEvent.setup();
    await render('<input uiInput aria-label="Email" />', { imports: [UiInput] });

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveClass('border-(--border)');

    await user.type(input, 'jane@example.com');
    expect(input).toHaveValue('jane@example.com');
  });

  it('keeps the native disabled behavior', async () => {
    await render('<input uiInput aria-label="Email" disabled />', { imports: [UiInput] });

    expect(screen.getByRole('textbox', { name: 'Email' })).toBeDisabled();
  });

  it('carries the variant that styles the border from aria-invalid, only effective when the attribute is set', async () => {
    await render('<input uiInput aria-label="Valid" /><input uiInput aria-label="Invalid" aria-invalid="true" />', {
      imports: [UiInput],
    });

    const valid = screen.getByRole('textbox', { name: 'Valid' });
    const invalid = screen.getByRole('textbox', { name: 'Invalid' });
    expect(valid).toBeValid();
    expect(invalid).toBeInvalid();
    expect(valid).toHaveClass('aria-invalid:border-(--destructive)');
    expect(invalid).toHaveClass('aria-invalid:border-(--destructive)');
  });

  it('styles the native textarea and accepts typing', async () => {
    const user = userEvent.setup();
    await render('<textarea uiTextarea aria-label="Notes"></textarea>', { imports: [UiTextarea] });

    const textarea = screen.getByRole('textbox', { name: 'Notes' });
    expect(textarea).toHaveClass('border-(--border)', 'min-h-24');

    await user.type(textarea, 'hello');
    expect(textarea).toHaveValue('hello');
  });
});
