# AGENTS.md

Guidance for AI coding agents working in this repository. See the [README](README.md) for the full project overview.

## Project

Angular 22 design-system starter: a publishable component library (`projects/ui`, standalone components, zoneless, signals, prefix `ui`) developed and documented through Storybook. There is no application — Storybook is the only dev surface.

Package manager: **pnpm** (version pinned in the `packageManager` field of package.json). Node 24 (`.nvmrc`).

## Commands

| Command                      | Purpose                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| `pnpm install`               | Install deps                                                                                            |
| `pnpm start`                 | Storybook dev server (http://localhost:6006)                                                            |
| `pnpm run test:coverage`     | Unit tests with coverage                                                                                |
| `pnpm run build`             | Library build (ng-packagr → `dist/ui`)                                                                  |
| `pnpm run build-storybook`   | Static Storybook build (→ `storybook-static/`)                                                          |
| `pnpm run test-storybook:ci` | Interaction tests against the built Storybook (needs Chromium: `pnpm exec playwright install chromium`) |
| `pnpm run lint`              | ESLint (includes Sheriff module-boundary rules)                                                         |
| `pnpm run format:check`      | Prettier check                                                                                          |

Before considering a change done, run the same pipeline as CI: `format:check`, `lint`, `test:coverage`, `build`, `build-storybook`, `test-storybook:ci`.

## Architecture

- `projects/ui/<component>/` — one folder per component and one ng-packagr secondary entry point: `ng-package.json` (`{ "lib": { "entryFile": "index.ts" } }`), `index.ts` exporting the public symbols, `<name>.ts` + `<name>.spec.ts` + `<name>.stories.ts` co-located, no `.component`/`.directive` suffixes. Consumers import `<package>/<component>`.
- `projects/ui/src/public-api.ts` — the root entry, `export {};` on purpose: it must never re-export an entry, since a root barrel puts every component in the consumer's initial chunk.
- Cross-entry imports in code, specs and stories go through the package path (`<package>/<component>`, mapped by `tsconfig.json` `paths` and by a `viteFinal` alias in `.storybook/main.ts`), never `../<folder>/...`. Imports inside a folder stay relative. A symbol another entry needs is exported from its `index.ts`, so it becomes public.
- `projects/ui/styles/tokens.css` — the design tokens, shipped as a package asset (`dist/ui/styles/tokens.css`). It must stay a **pure token sheet**: no resets, no element styles. Preview-only chrome belongs in `.storybook/preview.css`.
- `projects/ui/docs/` — Storybook "Foundations" MDX pages (colors, typography).
- Module boundaries are enforced at lint time by Sheriff ([sheriff.config.ts](sheriff.config.ts)): **components never import each other unless `depRules` grants it** — shared building blocks get their own module. Each component folder is a Sheriff module whose `index.ts` is its barrel; private files go in an `internal/` subdirectory.

## Release

- The library version lives in `projects/ui/package.json`. To release: bump it in a pull request together with a `## X.Y.Z` section in `projects/ui/CHANGELOG.md`, merge, then push the tag `vX.Y.Z` on the merge commit. Never run `npm publish` by hand.
- `.github/workflows/release.yml` fires on a `v*` tag: it checks that the tag equals `v` plus the library version and that the commit is on `main`, runs the whole pipeline, publishes `dist/ui` to npm through trusted publishing (OIDC, no token, provenance attached) and creates the GitHub Release from the changelog section.
- npm only accepts a trusted publisher on an existing package: publish the first version once by hand with a token, then register `release.yml` as trusted publisher of the package on npmjs.com.
- `.github/workflows/storybook.yml` deploys the static Storybook to GitHub Pages on every push to `main`; the repository needs Pages enabled with source "GitHub Actions", otherwise the deploy job fails.

## Conventions

- Everything in the repo is written in **English** (code, comments, docs, commit messages).
- Commits follow [Conventional Commits](https://www.conventionalcommits.org), enforced by commitlint. lint-staged formats and lints staged files on commit.
- OnPush is Angular 22's default change detection: do **not** add `ChangeDetectionStrategy.OnPush` to components.
- Selectors use the `ui` prefix. Prefer attaching to native elements (Material-style): `button[ui-button]`, `input[uiInput]` (attribute components/directives keep native semantics, a11y and forms support for free); use element selectors (`ui-badge`) only when there is no native host.
- Signal `input()`s + `host: { '[class]': 'classes()' }` with a `computed()` mapping variant/size records to class strings. No decorators (`@Input`, `@HostBinding`).
- Styling is Tailwind-in-template: arbitrary-value utilities consuming the tokens (`bg-(--primary)`, `border-(--border)`). Components never hardcode colors.
- `verbatimModuleSyntax` is enabled: type-only imports must use `import type { X }` or `import { type X }`.
- `console` is forbidden everywhere (ESLint).

## Storybook

- Stories are CSF3, co-located with their component, with manual `argTypes` (compodoc is not used). Attribute-selector components need a `render` with a `template` and a `moduleMetadata` decorator.
- Test utilities (`fn`, `userEvent`, `within`, `expect`) are imported from the **`storybook/test`** subpath.
- `autodocs` is enabled globally via `tags` in `.storybook/preview.ts` — do not re-tag individual stories.
- The theme switcher is `withThemeByDataAttribute` toggling `data-theme` on `<html>` with `system` (empty attribute, default), `light` and `dark`; tokens resolve via `light-dark()`, and an empty `data-theme` lets `color-scheme: light dark` follow the OS. Never bypass it with story-level colors.
- Story titles are grouped by purpose (`Inputs/...`, `Data display/...`), and `storySort` in `.storybook/preview.ts` pins `Foundations` first with `Overview` as the landing page. Extend the `order` list when a group appears.
- Compodoc is off, so every story meta carries `parameters.docs.description.component` (one sentence on what the component is, then `#### When to use`, `#### When not to use`, `#### Accessibility`) and every `argType` a `description`. Use neutral vocabulary (save, delete, draft, email).
- `parameters.a11y.test` is `'error'`: an axe violation fails `test-storybook:ci`. Every story needs an accessible name for its controls.
- The Storybook chrome (`.storybook/manager.ts`) and the Docs pages (`parameters.docs.theme` in `preview.ts`) take their theme from `.storybook/theme.ts` for the OS preference. The two halves agree on purpose; do not try to make the chrome follow the toolbar (neither `setConfig` nor `api.setOptions` re-themes a running manager, and a Docs page never re-renders on a globals change). A manager globals listener is `addons.register('id', (api) => api.on('updateGlobals', ...))`.
- `theme.ts` restates the token colors in hex: editing a color in `tokens.css` means editing its twin in `theme.ts`, and in the inline style of `.storybook/preview-head.html`, which prevents a white flash on preview reload because `preview.css` arrives with the JS bundle.
- Interaction tests are `play` functions, executed in CI by `@storybook/test-runner` against the built Storybook. The Storybook **Vitest addon is not an option**: it does not support Angular.
- Foundations MDX pages live in `projects/ui/docs/` and use `Meta` from `@storybook/addon-docs/blocks`.

## Testing

- Component tests use Angular Testing Library (`render`, `screen`, `userEvent`) with template-string rendering (`render('<button ui-button>…</button>', { imports: [UiButton] })`): query by role or label, not by CSS selectors. jest-dom matchers are set up in `projects/ui/src/test-setup.ts`.
- Cover every variant/size branch of the class-record maps — that is what keeps coverage at 100%.
- Coverage is at 100% and must stay there; the CI thresholds (85/80/70/85) are intentionally lower so downstream users of the starter are not blocked — do not raise them. `*.stories.ts` files are excluded from coverage (`coverageExclude` in angular.json).

## Generator

New design systems are scaffolded from this starter by [starter-generator](https://github.com/JoanRoucoux/starter-generator), a generic engine: everything starter-specific lives **here**, in [generator.config.json](generator.config.json) (files removed from generated projects, package renames, install commands — full spec in the generator's README) and `.generator/templates/` (currently only the generated README, rendered with `{{token}}` placeholders).

Keep them in sync with the starter:

- The demo components (`badge`, `button`, `input`) are **kept** in generated projects as reference implementations — do not add them to the manifest's `remove`.
- The manifest patches both [package.json](package.json) and [projects/ui/package.json](projects/ui/package.json) (the published name); if the library layout moves, update the manifest paths.
- Template-only content (community files, release tooling) must be listed in the manifest's `remove`.
- `.generator/templates/` stays excluded in [.prettierignore](.prettierignore) and the ESLint `globalIgnores`.
- [generator-check.yml](.github/workflows/generator-check.yml) generates a project from the working tree and runs its quality gates — it fails when the manifest or templates drift. It is starter-only: listed in the manifest's `remove` so generated projects don't inherit a self-check that fails outside the starter (no `generator.config.json` left to generate from).

## Gotchas

- `typescript` is pinned to `~6.0.2`: TypeScript 7 breaks `typescript-eslint` (via `ts-api-utils`). Do not bump until typescript-eslint supports TS 7. (This is also why the Storybook framework is `@storybook/angular-vite` — the webpack `@storybook/angular` peer range only allows TS ≤5.)
- `pnpm-workspace.yaml` `allowBuilds` is required for native postinstall scripts (esbuild, ...) — do not remove it.
- GitHub Actions in `.github/workflows/` are pinned by commit SHA with a `# vX.Y.Z` comment (Dependabot keeps them updated): when adding one, pin it the same way.
- The required status check `ci` is the gate job of `ci.yml`, which needs `static`, `unit` and `storybook` and fails unless each result is `success` or `skipped` (`if: always()`, never `!cancelled()`, so a cancelled run turns the gate red). A new CI job must join its `needs`.
- Dependabot groups every npm update in one pull request and every action update in another: the Storybook, Vite and Playwright families are coupled. TypeScript `>=7` is ignored for the reason in the first Gotcha.
- npm consumers of the published library must add `@source '../node_modules/<pkg>'` to their Tailwind CSS — templates in `node_modules` are not scanned by default. Keep this documented in the README.
- In the starter repository itself `release.yml` never fires: release-please creates its `v1.x.y` tags with `GITHUB_TOKEN`, and events from that token start no workflow. The root package version belongs to release-please; the library version in `projects/ui/package.json` is the one `release.yml` publishes in a generated project.
- Nothing is committed or pushed without an explicit request from the maintainer.
- `pnpm-workspace.yaml` overrides `playwright` and `playwright-core` to `$@playwright/test`: `@storybook/test-runner` brings its own Playwright, and CI installed the browser with one version and launched it with the other, which broke every Dependabot bump that moved only one. pnpm deprecates the `$` reference in favour of catalogs, but Dependabot does not update catalog entries, so the override stays.
- `field`, `input` and `control` are the reference for a component that depends on other entries: `ui-field` finds the projected control through the `UI_CONTROL` token (provided by `UiInput` and `UiTextarea`, which declare the `errors` and `touched` inputs that Angular's `[formField]` fills) and imports it by package path; Sheriff `depRules` grant `field` -> `input`, `control` and `input` -> `control`.
- `field.ts` keeps one `eslint-disable-next-line @angular-eslint/template/label-has-associated-control`: the label's `for` is wired at runtime, once the projected control's id is known.
- `contentChild` compiles to a query function that coverage reports as never called, so `field.ts` sits just under 100% on statements and functions; that gap is expected.
