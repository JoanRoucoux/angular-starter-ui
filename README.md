<img src=".github/assets/banner.png" alt="Angular Starter UI: ready-to-use Angular design system starter" />

[![CI](https://github.com/JoanRoucoux/angular-starter-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/JoanRoucoux/angular-starter-ui/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/JoanRoucoux/angular-starter-ui)](https://github.com/JoanRoucoux/angular-starter-ui/releases)
[![Angular](https://img.shields.io/badge/Angular-22-dd0031?logo=angular)](https://angular.dev)
[![Storybook](https://img.shields.io/badge/Storybook-10-ff4785?logo=storybook&logoColor=white)](https://storybook.js.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Ready-to-use Angular starter for building a design system: a publishable component library (standalone, zoneless, signals) and a Storybook workshop, with every best practice and tool already wired up.

The starter ships a documented set of design tokens (neutral zinc scale, light and dark via `light-dark()`) and example components (button, input, badge, textarea, field) showing the conventions: signal inputs, host class bindings, Tailwind utilities consuming the tokens, stories with interaction tests, and unit tests with enforced coverage thresholds.

It is the design system counterpart of [angular-starter-web](https://github.com/JoanRoucoux/angular-starter-web), which leaves the choice of UI library open.

## The starters

| Repository                                                                         | What it generates                                         |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------- |
| [angular-starter-web](https://github.com/JoanRoucoux/angular-starter-web)          | An Angular web application connected to a backend         |
| [angular-starter-ui](https://github.com/JoanRoucoux/angular-starter-ui) (this one) | An Angular design system: component library and Storybook |
| [java-starter](https://github.com/JoanRoucoux/java-starter)                        | A Spring Boot backend in hexagonal architecture           |

Create an application from any of them with [starter-generator](https://github.com/JoanRoucoux/starter-generator).

## Tech stack

| Tool                                                                                                                                                                                   | Role                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| [Angular](https://angular.dev) + [ng-packagr](https://github.com/ng-packagr/ng-packagr)                                                                                                | Framework and library build (Angular Package Format)     |
| [Storybook](https://storybook.js.org) (`@storybook/angular-vite`)                                                                                                                      | Component workshop: autodocs, a11y addon, theme switcher |
| [Tailwind CSS](https://tailwindcss.com)                                                                                                                                                | Utility-first CSS consuming the design tokens            |
| [ESLint](https://eslint.org) + [angular-eslint](https://github.com/angular-eslint/angular-eslint) + [eslint-plugin-storybook](https://github.com/storybookjs/eslint-plugin-storybook)  | Lint for TypeScript code, templates and stories          |
| [Prettier](https://prettier.io) + [sort-imports](https://github.com/trivago/prettier-plugin-sort-imports) + [tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) | Code formatting, import ordering and class sorting       |
| [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com/docs/angular-testing-library/intro)                                                                       | Unit tests (Angular's default runner)                    |
| [Storybook test-runner](https://github.com/storybookjs/test-runner)                                                                                                                    | Runs every story and its `play` interaction tests in CI  |
| [Sheriff](https://sheriff.softarc.io)                                                                                                                                                  | Enforces module boundaries (components stay isolated)    |
| [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/lint-staged/lint-staged)                                                                                  | Git hooks (format + lint on commit)                      |
| [commitlint](https://commitlint.js.org)                                                                                                                                                | Commit message validation (Conventional Commits)         |
| [GitHub Actions](https://github.com/features/actions)                                                                                                                                  | CI: format, lint, unit tests, builds, interaction tests  |

## Getting started

Generate a design system from this starter:

```bash
starter-generator portfolio-ui --starter ui
```

Then run it. Prerequisites: Node (supported versions in `engines` of [package.json](package.json)) and pnpm.

```bash
pnpm install    # installs dependencies
pnpm start      # Storybook on http://localhost:6006
```

Storybook is the development surface: components are built and reviewed through their stories, there is no demo application.

### Scripts

| Script                       | Description                                                        |
| ---------------------------- | ------------------------------------------------------------------ |
| `pnpm start`                 | Storybook dev server on `http://localhost:6006`                    |
| `pnpm run build`             | Builds the library into `dist/ui` (Angular Package Format)         |
| `pnpm run build:dev`         | Development build of the library                                   |
| `pnpm run build-storybook`   | Builds the static Storybook into `storybook-static/`               |
| `pnpm test`                  | Unit tests (Vitest)                                                |
| `pnpm run test:coverage`     | Unit tests with coverage report and thresholds                     |
| `pnpm run test-storybook`    | Interaction tests against a running Storybook (`pnpm start` first) |
| `pnpm run test-storybook:ci` | Serves `storybook-static/` and runs the interaction tests on it    |
| `pnpm run lint`              | Lint (ESLint)                                                      |
| `pnpm run lint:fix`          | Lint with automatic fixes                                          |
| `pnpm run format`            | Format the whole project (Prettier)                                |
| `pnpm run format:check`      | Check formatting without modifying anything                        |

## Project structure

```txt
.storybook/                  # Storybook config: main.ts, preview.ts (theme switcher), theme.ts, preview.css
projects/ui/
|-- ng-package.json          # ng-packagr config (root entry, shipped assets)
|-- package.json             # Library manifest (rename before publishing)
|-- CHANGELOG.md             # One `## X.Y.Z` section per release, shipped in the package
|-- README.md                # npm page of the published package
|-- styles/
|   `-- tokens.css           # Design tokens, shipped as dist/ui/styles/tokens.css
|-- docs/                    # Storybook "Foundations" MDX pages (overview, colors, typography)
|-- button/                  # One entry point per component: ng-package.json, index.ts,
|-- input/                   # button.ts + button.spec.ts + button.stories.ts
|-- badge/
|-- control/                 # UI_CONTROL token shared by input and field
|-- field/                   # ui-field: label, hint and error around a control
`-- src/
    `-- public-api.ts        # Exports nothing on purpose
```

Each component lives in its own folder with its spec and stories co-located. Dependency rules, enforced at lint time by [Sheriff](https://sheriff.softarc.io) ([sheriff.config.ts](sheriff.config.ts)): components cannot import each other unless `depRules` grants it, and shared building blocks get their own module. Each folder is a module whose `index.ts` is its barrel, and files a module wants to keep private go in an `internal/` subdirectory. Each folder is also its own entry point (`ng-package.json` + `index.ts`) so a consumer pulls in only the components it imports; `public-api.ts` exports nothing and must never re-export an entry.

## Design tokens and theming

All colors come from [projects/ui/styles/tokens.css](projects/ui/styles/tokens.css), a pure token sheet (no resets, no element styles) shipped with the package. Tokens follow the [shadcn/ui](https://ui.shadcn.com/docs/theming) semantic convention on a neutral zinc scale.

Each token declares its light and dark value with `light-dark()`; the active scheme follows the OS preference unless the host forces one:

```html
<html data-theme="dark"></html>
```

The Storybook toolbar theme switcher does exactly that, so every story can be reviewed in both themes. Components consume tokens through Tailwind arbitrary-value utilities (`bg-(--primary)`, `border-(--border)`, ...): retheming means editing one CSS file. The tokens are documented in Storybook under **Foundations**.

## Components

Five example components demonstrate the conventions (prefix `ui`, signal inputs, host class bindings):

| Component | Selector                          | API                                                                             |
| --------- | --------------------------------- | ------------------------------------------------------------------------------- |
| Button    | `button[ui-button], a[ui-button]` | `variant`: primary \| secondary \| destructive \| ghost, `size`: sm \| md \| lg |
| Input     | `input[uiInput]`                  | Styled native input: works with any forms API without plumbing                  |
| Badge     | `ui-badge`                        | `variant`: primary \| secondary \| destructive \| outline                       |
| Textarea  | `textarea[uiTextarea]`            | Styled native textarea, same contract as the input                              |
| Field     | `ui-field`                        | `label`, `labelHidden`, `hint`, `error`: wires the projected input or textarea  |

Button and input attach to native elements (Material-style attribute selectors), keeping native semantics, accessibility and forms compatibility for free:

```html
<button ui-button variant="destructive" size="sm">Delete</button>
<input uiInput type="email" placeholder="you@example.com" />
<ui-badge variant="outline">Draft</ui-badge>
```

## Storybook

The live Storybook is at https://joanroucoux.github.io/angular-starter-ui/.

- **Autodocs**: every story is tagged `autodocs` globally ([.storybook/preview.ts](.storybook/preview.ts)); each component gets a generated docs page from its stories and `argTypes`.
- **Accessibility**: the [a11y addon](https://storybook.js.org/addons/@storybook/addon-a11y) runs axe checks on every story, and a violation fails `test-storybook:ci`.
- **Theming**: the toolbar switcher (system, light, dark) toggles `data-theme` on `<html>` via `withThemeByDataAttribute`, matching the tokens' `light-dark()` contract. The Storybook chrome and the Docs pages follow the OS preference with a theme built from the tokens ([.storybook/theme.ts](.storybook/theme.ts)).
- **Interaction tests**: stories declare `play` functions (imports from `storybook/test`); the [test-runner](https://github.com/storybookjs/test-runner) executes every story in Chromium in CI (`pnpm run test-storybook:ci`).
- **Foundations**: MDX pages in [projects/ui/docs](projects/ui/docs) give the Overview landing page (installation, themes, contributing), the color tokens (light and dark swatches) and typography.
- **Docs pages**: every component carries a description (what it is, when to use it, when not to, accessibility) and a description per control.

Releases are made by tag with npm trusted publishing and Storybook is deployed to GitHub Pages: see the Release section of [AGENTS.md](AGENTS.md).

## Using the library in your app

The publishable artifact is built from `projects/ui` into `dist/ui`. To rename the package (for example to a scope), change three places together: `name` in [projects/ui/package.json](projects/ui/package.json), the `paths` key in [tsconfig.json](tsconfig.json), and every quoted cross-entry import (`'angular-starter-ui/...'` in specs and stories); renaming only `package.json` breaks the build. The root `package.json` version is the starter's own version (managed by release-please), the library version is managed in `projects/ui/package.json`.

In the consuming app:

1. Install the package and its peer dependencies (`@angular/common`, `@angular/core`).
2. Import the token sheet once, e.g. in `styles.css`:
   ```css
   @import 'angular-starter-ui/styles/tokens.css';
   ```
3. **Tailwind consumers**: the library's templates are inside `node_modules`, which Tailwind does not scan by default. Add a [`@source`](https://tailwindcss.com/docs/detecting-classes-in-source-files#explicitly-registering-sources) so the utilities used by the components are generated:
   ```css
   @import 'tailwindcss';
   @source '../node_modules/angular-starter-ui';
   ```
   Non-Tailwind consumers only need the tokens import: component class names would then need to be covered by your own CSS strategy; in that case prefer forking the components into your design system, which is what a starter is for.

The library exports each component's own types so you never recreate them. Every variant/size union comes with a matching `as const` tuple (the single source of truth the type is derived from), so you get both the type and the runtime list:

```ts
import { BUTTON_VARIANTS, type ButtonVariant } from 'angular-starter-ui/button';

// Type your own props with the library's union...
function setTone(variant: ButtonVariant) {
  /* ... */
}

// ...and iterate the values without hardcoding them (selects, validation, docs).
const options = BUTTON_VARIANTS.map((variant) => ({ label: variant, value: variant }));
```

Exported today: `ButtonVariant` / `BUTTON_VARIANTS`, `ButtonSize` / `BUTTON_SIZES` (from `/button`), `BadgeVariant` / `BADGE_VARIANTS` (from `/badge`), and from `/control` the `UI_CONTROL` token with the `UiControl` and `UiControlError` types.

## Testing

- **Unit tests** use [Angular Testing Library](https://testing-library.com/docs/angular-testing-library/intro) (`render`, `screen`, `userEvent`): querying by role or label asserts accessibility for free. The [jest-dom](https://github.com/testing-library/jest-dom) matchers are registered in [projects/ui/src/test-setup.ts](projects/ui/src/test-setup.ts).
- **Coverage** is 100% on branches and lines, 97.27% on statements and 93.33% on functions (the `contentChild` query function in `field` counts as never called); the CI thresholds (statements 85, branches 80, functions 70, lines 85 in [angular.json](angular.json)) are a floor. Stories are excluded from coverage.
- **Interaction tests** live in the stories themselves (`play` functions) and run in a real browser via the Storybook test-runner. The Vitest addon is not used because it does not support Angular.

## Quality and conventions

- **On commit**: lint-staged formats and lints the staged files; commitlint enforces [Conventional Commits](https://www.conventionalcommits.org) (`feat: ...`, `fix: ...`, ...).
- **In CI** ([.github/workflows/ci.yml](.github/workflows/ci.yml)): format check, lint, unit tests, library build, Storybook build and interaction tests on every push/PR.
- **Code conventions**: see the [Angular style guide](https://angular.dev/style-guide). In short: standalone components (`OnPush` change detection is the Angular default since v22, no need to declare it), signals (`input()`, `computed()`), `inject()`, private `#` properties, control flow (`@if`, `@for`), no `.component`/`.directive` suffix in file names.
- **Config files** use ESM `.mjs` where the tool supports it: [eslint.config.mjs](eslint.config.mjs), [prettier.config.mjs](prettier.config.mjs), [commitlint.config.mjs](commitlint.config.mjs).

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for the contribution workflow and [CODE_OF_CONDUCT.md](.github/CODE_OF_CONDUCT.md) for community guidelines. To report a vulnerability, see [SECURITY.md](.github/SECURITY.md).

## License

This project is licensed under [MIT](LICENSE).
