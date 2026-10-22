import { InjectionToken, type Signal } from '@angular/core';

export type UiControlError = { readonly message?: string };

export type UiControl = {
  readonly errors: Signal<readonly UiControlError[]>;
  readonly touched: Signal<boolean>;
};

export const UI_CONTROL = new InjectionToken<UiControl>('UI_CONTROL');
