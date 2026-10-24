import { render, screen } from '@testing-library/angular';
import { UiInput, UiTextarea } from 'angular-starter-ui/input';

import { UiField } from './field';

describe('UiField', () => {
  it('labels the projected control', async () => {
    await render('<ui-field label="Email"><input uiInput /></ui-field>', { imports: [UiField, UiInput] });

    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
  });

  it('keeps an id the control already has', async () => {
    await render('<ui-field label="Email"><input uiInput id="email" /></ui-field>', {
      imports: [UiField, UiInput],
    });

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('id', 'email');
  });

  it('hides the label visually but keeps it accessible', async () => {
    await render('<ui-field label="Search" labelHidden><input uiInput /></ui-field>', {
      imports: [UiField, UiInput],
    });

    expect(screen.getByText('Search')).toHaveClass('sr-only');
    expect(screen.getByRole('textbox', { name: 'Search' })).toBeInTheDocument();
  });

  it('describes the control with the hint', async () => {
    await render('<ui-field label="Email" hint="We never share it"><input uiInput /></ui-field>', {
      imports: [UiField, UiInput],
    });

    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription('We never share it');
  });

  it('shows an explicit error and marks the control invalid', async () => {
    await render('<ui-field label="Email" error="Enter an email"><input uiInput /></ui-field>', {
      imports: [UiField, UiInput],
    });

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(screen.getByRole('alert')).toHaveTextContent('Enter an email');
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription('Enter an email');
  });

  it('clears the invalid state once the error is gone', async () => {
    const { rerender, fixture } = await render('<ui-field label="Email" [error]="error"><input uiInput /></ui-field>', {
      imports: [UiField, UiInput],
      componentProperties: { error: 'Enter an email' },
    });

    await rerender({ componentProperties: { error: undefined } });
    await fixture.whenStable();

    expect(screen.getByRole('textbox', { name: 'Email' })).toBeValid();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows the first message of the control errors once touched', async () => {
    await render('<ui-field label="Email"><input uiInput [errors]="errors" [touched]="touched" /></ui-field>', {
      imports: [UiField, UiInput],
      componentProperties: { errors: [{}, { message: 'Enter a valid email' }], touched: true },
    });

    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email');
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInvalid();
  });

  it('stays quiet while the control is untouched', async () => {
    await render('<ui-field label="Email"><input uiInput [errors]="errors" [touched]="touched" /></ui-field>', {
      imports: [UiField, UiInput],
      componentProperties: { errors: [{ message: 'Enter a valid email' }], touched: false },
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('prefers the explicit error over the control errors', async () => {
    await render(
      '<ui-field label="Email" error="Already taken"><input uiInput [errors]="errors" [touched]="true" /></ui-field>',
      {
        imports: [UiField, UiInput],
        componentProperties: { errors: [{ message: 'Enter a valid email' }] },
      },
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Already taken');
  });

  it('wraps a textarea', async () => {
    await render('<ui-field label="Notes" hint="Optional"><textarea uiTextarea></textarea></ui-field>', {
      imports: [UiField, UiTextarea],
    });

    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveAccessibleDescription('Optional');
  });

  it('keeps the aria-describedby the control already has', async () => {
    await render(
      '<ui-field label="Code"><input uiInput aria-describedby="code-help" /></ui-field><p id="code-help">Sent by email</p>',
      {
        imports: [UiField, UiInput],
      },
    );

    expect(screen.getByRole('textbox', { name: 'Code' })).toHaveAccessibleDescription('Sent by email');
  });

  it('merges the aria-describedby of the control with the hint and the error', async () => {
    await render(
      '<ui-field label="Code" hint="Six digits" error="Wrong code"><input uiInput aria-describedby="code-help" /></ui-field><p id="code-help">Sent by email</p>',
      { imports: [UiField, UiInput] },
    );

    expect(screen.getByRole('textbox', { name: 'Code' })).toHaveAccessibleDescription(
      'Sent by email Six digits Wrong code',
    );
  });

  it('gives the control its own description back once the hint and the error are gone', async () => {
    const { rerender, fixture } = await render(
      '<ui-field label="Code" [hint]="hint" [error]="error"><input uiInput aria-describedby="code-help" /></ui-field><p id="code-help">Sent by email</p>',
      { imports: [UiField, UiInput], componentProperties: { hint: 'Six digits', error: 'Wrong code' } },
    );

    await rerender({ componentProperties: { hint: undefined, error: undefined } });
    await fixture.whenStable();

    expect(screen.getByRole('textbox', { name: 'Code' })).toHaveAccessibleDescription('Sent by email');
  });

  it('removes the description once the hint is gone from a control that had none', async () => {
    const { rerender, fixture } = await render('<ui-field label="Code" [hint]="hint"><input uiInput /></ui-field>', {
      imports: [UiField, UiInput],
      componentProperties: { hint: 'Six digits' },
    });

    await rerender({ componentProperties: { hint: undefined } });
    await fixture.whenStable();

    expect(screen.getByRole('textbox', { name: 'Code' })).not.toHaveAttribute('aria-describedby');
  });

  it('shows a visible required marker for a required control', async () => {
    await render('<ui-field label="Email"><input uiInput required /></ui-field>', { imports: [UiField, UiInput] });

    const marker = screen.getByText('(required)');
    expect(marker).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeRequired();
  });

  it('shows no marker for an optional control', async () => {
    await render('<ui-field label="Email"><input uiInput /></ui-field>', { imports: [UiField, UiInput] });

    expect(screen.queryByText('(required)')).not.toBeInTheDocument();
  });

  it('uses a custom required text', async () => {
    await render('<ui-field label="Email" requiredText="*"><input uiInput required /></ui-field>', {
      imports: [UiField, UiInput],
    });

    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('follows the required attribute when the app changes it', async () => {
    const { rerender, fixture } = await render(
      '<ui-field label="Email"><input uiInput [required]="required" /></ui-field>',
      { imports: [UiField, UiInput], componentProperties: { required: false } },
    );

    await rerender({ componentProperties: { required: true } });
    await fixture.whenStable();
    await vi.waitFor(() => expect(screen.getByText('(required)')).toBeInTheDocument());

    await rerender({ componentProperties: { required: false } });
    await fixture.whenStable();
    await vi.waitFor(() => expect(screen.queryByText('(required)')).not.toBeInTheDocument());
  });

  it('renders without a control', async () => {
    await render('<ui-field label="Empty" />', { imports: [UiField] });

    expect(screen.getByText('Empty')).toBeInTheDocument();
  });
});
