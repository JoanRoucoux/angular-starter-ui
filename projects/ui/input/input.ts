import { Directive, forwardRef, input } from '@angular/core';

import { UI_CONTROL, type UiControl, type UiControlError } from 'angular-starter-ui/control';

const CONTROL_CLASSES =
  'w-full rounded-md border border-(--border) bg-transparent px-3 text-sm text-(--foreground) transition-colors placeholder:text-(--muted-foreground) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary) aria-invalid:border-(--destructive) disabled:cursor-not-allowed disabled:opacity-50';

@Directive({
  selector: 'input[uiInput]',
  host: {
    class: `${CONTROL_CLASSES} h-9`,
  },
  providers: [{ provide: UI_CONTROL, useExisting: forwardRef(() => UiInput) }],
})
export class UiInput implements UiControl {
  readonly errors = input<readonly UiControlError[]>([]);
  readonly touched = input(false);
}

@Directive({
  selector: 'textarea[uiTextarea]',
  host: {
    class: `${CONTROL_CLASSES} min-h-24 py-2`,
  },
  providers: [{ provide: UI_CONTROL, useExisting: forwardRef(() => UiTextarea) }],
})
export class UiTextarea implements UiControl {
  readonly errors = input<readonly UiControlError[]>([]);
  readonly touched = input(false);
}
