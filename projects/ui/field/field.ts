import {
  Component,
  ElementRef,
  afterRenderEffect,
  booleanAttribute,
  computed,
  contentChild,
  inject,
  input,
} from '@angular/core';

import { UI_CONTROL } from 'angular-starter-ui/control';

const nextId = (() => {
  let count = 0;

  return (): string => ['ui-field', ++count].join('-');
})();

@Component({
  selector: 'ui-field',
  template: `
    <div class="flex flex-col gap-1.5">
      <!-- eslint-disable-next-line @angular-eslint/template/label-has-associated-control -->
      <label [class]="labelClasses()">{{ label() }}</label>

      <ng-content />

      @if (hint()) {
        <span class="text-xs text-(--muted-foreground)" [id]="hintId">{{ hint() }}</span>
      }

      @if (message()) {
        <p class="text-xs font-medium text-(--destructive)" role="alert" [id]="errorId">{{ message() }}</p>
      }
    </div>
  `,
})
export class UiField {
  readonly label = input.required<string>();
  readonly labelHidden = input(false, { transform: booleanAttribute });
  readonly hint = input<string>();
  readonly error = input<string>();

  readonly #id = nextId();
  protected readonly hintId = `${this.#id}-hint`;
  protected readonly errorId = `${this.#id}-error`;
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly control = contentChild(UI_CONTROL);

  protected readonly labelClasses = computed(() =>
    this.labelHidden() ? 'sr-only' : 'text-sm font-medium text-(--foreground)',
  );

  protected readonly message = computed(() => {
    const explicit = this.error();

    if (explicit) {
      return explicit;
    }

    const control = this.control();

    if (!control?.touched()) {
      return undefined;
    }

    return control.errors().find((error) => error.message)?.message;
  });

  constructor() {
    let markedByField = false;
    let ownDescribedBy: string | null | undefined;

    afterRenderEffect(() => {
      const control = this.#host.nativeElement.querySelector<HTMLElement>('input, textarea');

      if (!control) {
        return;
      }

      control.id ||= this.#id;
      this.#host.nativeElement.querySelector('label')!.htmlFor = control.id;

      if (ownDescribedBy === undefined) {
        ownDescribedBy = control.getAttribute('aria-describedby');
      }

      const describedBy = [
        ownDescribedBy,
        this.hint() ? this.hintId : null,
        this.message() ? this.errorId : null,
      ].filter(Boolean);

      if (describedBy.length > 0) {
        control.setAttribute('aria-describedby', describedBy.join(' '));
      } else {
        control.removeAttribute('aria-describedby');
      }

      if (this.message()) {
        control.setAttribute('aria-invalid', 'true');
        markedByField = true;
      } else if (markedByField) {
        control.removeAttribute('aria-invalid');
        markedByField = false;
      }
    });
  }
}
