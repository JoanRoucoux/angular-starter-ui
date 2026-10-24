import {
  Component,
  DestroyRef,
  ElementRef,
  afterRenderEffect,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  inject,
  input,
  signal,
  untracked,
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
      <label [class]="labelClasses()"
        >{{ label() }}
        @if (required()) {
          <span aria-hidden="true" class="font-normal text-(--muted-foreground)">{{ requiredText() }}</span>
        }
      </label>

      <ng-content />

      @if (hint()) {
        <span class="text-xs text-(--muted-foreground)" [id]="hintId">{{ hint() }}</span>
      }

      @if (message()) {
        <p class="text-xs font-medium text-(--destructive)" [id]="errorId">{{ message() }}</p>
      }

      <span aria-live="polite" class="sr-only">{{ announcement() }}</span>
    </div>
  `,
})
export class UiField {
  readonly label = input.required<string>();
  readonly labelHidden = input(false, { transform: booleanAttribute });
  readonly hint = input<string>();
  readonly error = input<string>();
  readonly requiredText = input('(required)');

  readonly #id = nextId();
  protected readonly hintId = `${this.#id}-hint`;
  protected readonly errorId = `${this.#id}-error`;
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #destroyRef = inject(DestroyRef);
  protected readonly required = signal(false);
  protected readonly control = contentChild(UI_CONTROL);
  protected readonly announcement = signal('');

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
    let wasTouched = false;
    let announcedExplicit: string | undefined;

    effect(() => {
      const message = this.message();
      const explicit = this.error() || undefined;
      const touched = this.control()?.touched() ?? false;
      const turnedTouched = touched && !wasTouched;
      const explicitChanged = explicit !== undefined && explicit !== announcedExplicit;

      wasTouched = touched;
      announcedExplicit = explicit;

      if (message && (explicitChanged || (!explicit && turnedTouched))) {
        this.announcement.set(message);
      } else if (message !== untracked(this.announcement)) {
        this.announcement.set('');
      }
    });

    let markedByField = false;
    let ownDescribedBy: string | null | undefined;
    let observed: HTMLElement | undefined;

    afterRenderEffect(() => {
      const control = this.#host.nativeElement.querySelector<HTMLElement>('input, textarea');

      if (!control) {
        return;
      }

      if (observed !== control) {
        observed = control;
        const sync = (): void => this.required.set(control.hasAttribute('required'));
        const observer = new MutationObserver(sync);
        observer.observe(control, { attributes: true, attributeFilter: ['required'] });
        this.#destroyRef.onDestroy(() => observer.disconnect());
        sync();
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
