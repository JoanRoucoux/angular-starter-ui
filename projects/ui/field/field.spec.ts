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
    expect(screen.getByText('Enter an email', { selector: 'p' })).toBeInTheDocument();
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
    expect(screen.queryByText('Enter an email', { selector: 'p' })).not.toBeInTheDocument();
  });

  it('shows the first message of the control errors once touched', async () => {
    await render('<ui-field label="Email"><input uiInput [errors]="errors" [touched]="touched" /></ui-field>', {
      imports: [UiField, UiInput],
      componentProperties: { errors: [{}, { message: 'Enter a valid email' }], touched: true },
    });

    expect(screen.getByText('Enter a valid email', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInvalid();
  });

  it('stays quiet while the control is untouched', async () => {
    await render('<ui-field label="Email"><input uiInput [errors]="errors" [touched]="touched" /></ui-field>', {
      imports: [UiField, UiInput],
      componentProperties: { errors: [{ message: 'Enter a valid email' }], touched: false },
    });

    expect(screen.queryByText('Enter a valid email', { selector: 'p' })).not.toBeInTheDocument();
  });

  it('prefers the explicit error over the control errors', async () => {
    await render(
      '<ui-field label="Email" error="Already taken"><input uiInput [errors]="errors" [touched]="true" /></ui-field>',
      {
        imports: [UiField, UiInput],
        componentProperties: { errors: [{ message: 'Enter a valid email' }] },
      },
    );

    expect(screen.getByText('Already taken', { selector: 'p' })).toBeInTheDocument();
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

  describe('announcements', () => {
    type Props = { error?: string; errors: { message?: string }[]; touched: boolean };
    const template =
      '<ui-field label="Email" [error]="error"><input uiInput [errors]="errors" [touched]="touched" /></ui-field>';
    const live = (container: Element): HTMLElement => container.querySelector<HTMLElement>('[aria-live="polite"]')!;

    it('does not give the error paragraph an alert role', async () => {
      await render<Props>(template, {
        imports: [UiField, UiInput],
        componentProperties: { error: 'Enter an email', errors: [], touched: false },
      });

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('announces an explicit error', async () => {
      const { container, rerender, fixture } = await render<Props>(template, {
        imports: [UiField, UiInput],
        componentProperties: { error: undefined, errors: [], touched: false },
      });

      expect(live(container).textContent?.trim()).toBe('');

      await rerender({ componentProperties: { error: 'Already taken', errors: [], touched: false } });
      await fixture.whenStable();

      expect(live(container)).toHaveTextContent('Already taken');
    });

    it('announces a changed explicit error', async () => {
      const { container, rerender, fixture } = await render<Props>(template, {
        imports: [UiField, UiInput],
        componentProperties: { error: 'Already taken', errors: [], touched: false },
      });

      await rerender({ componentProperties: { error: 'Too short', errors: [], touched: false } });
      await fixture.whenStable();

      expect(live(container)).toHaveTextContent('Too short');
    });

    it('announces a control error when the control turns touched', async () => {
      const { container, rerender, fixture } = await render<Props>(template, {
        imports: [UiField, UiInput],
        componentProperties: { error: undefined, errors: [{ message: 'Enter a valid email' }], touched: false },
      });

      expect(live(container).textContent?.trim()).toBe('');

      await rerender({
        componentProperties: { error: undefined, errors: [{ message: 'Enter a valid email' }], touched: true },
      });
      await fixture.whenStable();

      expect(live(container)).toHaveTextContent('Enter a valid email');
    });

    it('announces nothing when the control turns touched without a message', async () => {
      const { container, rerender, fixture } = await render<Props>(template, {
        imports: [UiField, UiInput],
        componentProperties: { error: undefined, errors: [], touched: false },
      });

      await rerender({ componentProperties: { error: undefined, errors: [], touched: true } });
      await fixture.whenStable();

      expect(live(container).textContent?.trim()).toBe('');
    });

    it('announces nothing while typing toggles the message on a touched control', async () => {
      const { container, rerender, fixture } = await render<Props>(template, {
        imports: [UiField, UiInput],
        componentProperties: { error: undefined, errors: [], touched: true },
      });

      await rerender({
        componentProperties: { error: undefined, errors: [{ message: 'Enter a valid email' }], touched: true },
      });
      await fixture.whenStable();

      expect(screen.getByText('Enter a valid email', { selector: 'p' })).toBeInTheDocument();
      expect(live(container).textContent?.trim()).toBe('');

      await rerender({ componentProperties: { error: undefined, errors: [], touched: true } });
      await fixture.whenStable();
      await rerender({ componentProperties: { error: undefined, errors: [{ message: 'Too short' }], touched: true } });
      await fixture.whenStable();

      expect(live(container).textContent?.trim()).toBe('');
    });

    it('does not announce a control error that changes while the control stays touched', async () => {
      const { container, rerender, fixture } = await render<Props>(template, {
        imports: [UiField, UiInput],
        componentProperties: { error: undefined, errors: [{ message: 'Enter a valid email' }], touched: false },
      });

      await rerender({
        componentProperties: { error: undefined, errors: [{ message: 'Enter a valid email' }], touched: true },
      });
      await fixture.whenStable();
      await rerender({ componentProperties: { error: undefined, errors: [{ message: 'Too short' }], touched: true } });
      await fixture.whenStable();

      expect(live(container).textContent?.trim()).toBe('');
      expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAccessibleDescription('Too short');
    });

    it('keeps an announced explicit error when the control turns touched', async () => {
      const { container, rerender, fixture } = await render<Props>(template, {
        imports: [UiField, UiInput],
        componentProperties: { error: 'Already taken', errors: [], touched: false },
      });

      await rerender({ componentProperties: { error: 'Already taken', errors: [], touched: true } });
      await fixture.whenStable();

      expect(live(container)).toHaveTextContent('Already taken');
    });

    it('clears the announcement when the message disappears', async () => {
      const { container, rerender, fixture } = await render<Props>(template, {
        imports: [UiField, UiInput],
        componentProperties: { error: 'Already taken', errors: [], touched: false },
      });

      await rerender({ componentProperties: { error: undefined, errors: [], touched: false } });
      await fixture.whenStable();

      expect(live(container).textContent?.trim()).toBe('');
    });
  });

  it('renders without a control', async () => {
    await render('<ui-field label="Empty" />', { imports: [UiField] });

    expect(screen.getByText('Empty')).toBeInTheDocument();
  });
});
