import { Component, computed, input } from '@angular/core';

export const BADGE_VARIANTS = ['primary', 'secondary', 'destructive', 'outline'] as const;
export type BadgeVariant = (typeof BADGE_VARIANTS)[number];

const BASE_CLASSES = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  primary: 'bg-(--primary) text-(--primary-foreground)',
  secondary: 'bg-(--secondary) text-(--secondary-foreground)',
  destructive: 'bg-(--destructive) text-(--destructive-foreground)',
  outline: 'border border-(--border) text-(--foreground)',
};

@Component({
  selector: 'ui-badge',
  template: '<ng-content />',
  host: {
    '[class]': 'classes()',
  },
})
export class UiBadge {
  readonly variant = input<BadgeVariant>('primary');

  protected readonly classes = computed(() => `${BASE_CLASSES} ${VARIANT_CLASSES[this.variant()]}`);
}
