# angular-starter-ui

A set of Angular components built on native elements, styled with Tailwind CSS through a light and dark token sheet.

## Installation

```bash
pnpm add angular-starter-ui
```

Peer dependencies: `@angular/common` and `@angular/core` 22.

## Setup

Import the token sheet once, in the application's global stylesheet:

```css
@import 'angular-starter-ui/styles/tokens.css';
```

Register the package as a Tailwind source, since Tailwind does not scan `node_modules` by default:

```css
@import 'tailwindcss';
@source '../node_modules/angular-starter-ui';
```

The active scheme follows the operating system preference. To force one, set `data-theme="light"` or `data-theme="dark"` on `<html>`.

## Usage

Each component is its own entry point, and the package root exports nothing:

```ts
import { UiButton } from 'angular-starter-ui/button';
import { UiField } from 'angular-starter-ui/field';
import { UiInput } from 'angular-starter-ui/input';
```

```html
<button ui-button variant="destructive" size="sm">Delete</button>
<ui-field label="Email" hint="We never share it">
  <input uiInput type="email" />
</ui-field>
```

Components attach to native elements, so focus, forms integration and assistive technology support come from the platform.
