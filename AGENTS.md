# AGENTS.md

Guidance for AI coding agents working in this repository. See the [README](README.md) for the full project overview.

## Project

Angular 22 design system: a publishable component library (`projects/ui`, standalone components, zoneless, signals, prefix `ui`) developed and documented through Storybook. There is no application: Storybook is the only dev surface.

Package manager: **pnpm** (version pinned in the `packageManager` field of package.json). Node 24 (`.nvmrc`).

## Commands

| Command                    | Purpose                                                                                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install`             | Install deps                                                                                                                                        |
| `pnpm start`               | Storybook dev server (http://localhost:6006)                                                                                                        |
| `pnpm run test:coverage`   | Unit tests with coverage                                                                                                                            |
| `pnpm run build`           | Library build (ng-packagr -> `dist/ui`)                                                                                                             |
| `pnpm run build-storybook` | Static Storybook build (-> `storybook-static/`)                                                                                                     |
| `pnpm run test:storybook`  | Story tests (play functions and axe) in Chromium through the Vitest addon, light and dark (needs Chromium: `pnpm exec playwright install chromium`) |
| `pnpm run lint`            | ESLint (includes Sheriff module-boundary rules)                                                                                                     |
| `pnpm run format:check`    | Prettier check                                                                                                                                      |

Before considering a change done, run the same pipeline as CI: `format:check`, `lint`, `test:coverage`, `build`, `build-storybook`, `test:storybook`.

## Architecture

- `projects/ui/<component>/`: one folder per component and one ng-packagr secondary entry point: `ng-package.json` (`{ "lib": { "entryFile": "index.ts" } }`), `index.ts` exporting the public symbols, `<name>.ts` + `<name>.spec.ts` + `<name>.stories.ts` co-located, no `.component`/`.directive` suffixes. Consumers import `<package>/<component>`.
- `projects/ui/src/public-api.ts`: the root entry, `export {};` on purpose. It must never re-export an entry, since a root barrel puts every component in the consumer's initial chunk.
- Cross-entry imports in code, specs and stories go through the package path (`<package>/<component>`, mapped by `tsconfig.json` `paths` and by a `viteFinal` alias in `.storybook/main.ts`), never `../<folder>/...`. Imports inside a folder stay relative. A symbol another entry needs is exported from its `index.ts`, so it becomes public.
- `projects/ui/styles/tokens.css`: the design tokens, shipped as a package asset (`dist/ui/styles/tokens.css`). It must stay a **pure token sheet**: no resets, no element styles. Preview-only chrome belongs in `.storybook/preview.css`.
- `projects/ui/docs/`: Storybook "Foundations" MDX pages (overview, colors, typography).
- `projects/ui/README.md`: the npm page of the published package, copied into `dist/ui` by ng-packagr. Keep it consistent with the root README's setup, and use absolute URLs only (npm does not resolve relative links).
- Module boundaries are enforced at lint time by Sheriff ([sheriff.config.ts](sheriff.config.ts)): **components never import each other unless `depRules` grants it**, and shared building blocks get their own module. Each component folder is a Sheriff module whose `index.ts` is its barrel; private files go in an `internal/` subdirectory.

## Release

- The library version lives in `projects/ui/package.json`. To release: bump it in a pull request together with a `## X.Y.Z` section in `projects/ui/CHANGELOG.md`, merge, then push the tag `vX.Y.Z` on the merge commit. Never run `npm publish` by hand.
- `.github/workflows/release.yml` fires on a `v*` tag: it checks that the tag equals `v` plus the library version and that the commit is on `main`, runs the whole pipeline, publishes `dist/ui` to npm through trusted publishing (OIDC, no token, provenance attached) and creates the GitHub Release from the changelog section.
- npm only accepts a trusted publisher on an existing package: publish the first version once by hand with a token, then register `release.yml` as trusted publisher of the package on npmjs.com.
- Before `npm publish`, `release.yml` writes `repository.type` and `repository.url` into `dist/ui/package.json` from the workflow's own repository: trusted publishing attaches provenance, and npm refuses it (E422) when the package has no `repository.url` matching the repository that publishes.
- `.github/workflows/storybook.yml` deploys the static Storybook to GitHub Pages on every push to `main`; the repository needs Pages enabled with source "GitHub Actions", otherwise the deploy job fails.

## Conventions

- Everything in the repo is written in **English** (code, docs, commit messages).
- Zero comments in code and configuration. A real trap goes in Gotchas below.
- Docs use ASCII punctuation only: straight quotes, `->` for arrows, no dash joining clauses.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org), enforced by commitlint. lint-staged formats and lints staged files on commit.
- OnPush is Angular 22's default change detection: do **not** add `ChangeDetectionStrategy.OnPush` to components.
- Selectors use the `ui` prefix. Prefer attaching to native elements (Material-style): `button[ui-button]`, `input[uiInput]` (attribute components/directives keep native semantics, a11y and forms support for free); use element selectors (`ui-badge`) only when there is no native host.
- Signal `input()`s + `host: { '[class]': 'classes()' }` with a `computed()` mapping variant/size records to class strings. No decorators (`@Input`, `@HostBinding`).
- Styling is Tailwind-in-template: arbitrary-value utilities consuming the tokens (`bg-(--primary)`, `border-(--border)`). Components never hardcode colors, and never glue a class token to an interpolation (`h-${size}`): a consumer's Tailwind scanner cannot see it, and `projects/ui/src/class-literals.spec.ts` fails on it.
- `verbatimModuleSyntax` is enabled: type-only imports must use `import type { X }` or `import { type X }`.
- `console` is forbidden everywhere (ESLint).
- Dependabot runs monthly with a 7-day cooldown. Minor and patch updates merge themselves through `.github/workflows/dependabot-auto-merge.yml` once the required checks pass, and majors are reviewed by hand. The README names major versions only, since the exact ones live in the manifests Dependabot bumps.

## Storybook

- Stories are CSF3, co-located with their component, with manual `argTypes` (compodoc is not used). Attribute-selector components need a `render` with a `template` and a `moduleMetadata` decorator.
- Test utilities (`fn`, `userEvent`, `within`, `expect`) are imported from the **`storybook/test`** subpath.
- `autodocs` is enabled globally via `tags` in `.storybook/preview.ts`: do not re-tag individual stories.
- The theme switcher is `withThemeByDataAttribute` toggling `data-theme` on `<html>` with `system` (empty attribute, default), `light` and `dark`; tokens resolve via `light-dark()`, and an empty `data-theme` lets `color-scheme: light dark` follow the OS. Never bypass it with story-level colors.
- Story titles are grouped by purpose (`Inputs/...`, `Data display/...`), and `storySort` in `.storybook/preview.ts` pins `Foundations` first with `Overview` as the landing page. Extend the `order` list when a group appears.
- Compodoc is off, so every story meta carries `parameters.docs.description.component` (one sentence on what the component is, then `#### When to use`, `#### When not to use`, `#### Accessibility`) and every `argType` a `description`. Use neutral vocabulary (save, delete, draft, email).
- `parameters.a11y.test` is `'error'`: an axe violation fails `test:storybook`. Every story needs an accessible name for its controls.
- The Storybook chrome (`.storybook/manager.ts`) and the Docs pages (`parameters.docs.theme` in `preview.ts`) take their theme from `.storybook/theme.ts` for the OS preference. The two halves agree on purpose; do not try to make the chrome follow the toolbar (neither `setConfig` nor `api.setOptions` re-themes a running manager, and a Docs page never re-renders on a globals change). A manager globals listener is `addons.register('id', (api) => api.on('updateGlobals', ...))`.
- `theme.ts` restates the token colors in hex: editing a color in `tokens.css` means editing its twin in `theme.ts`, and in the inline style of `.storybook/preview-head.html`, which prevents a white flash on preview reload because `preview.css` arrives with the JS bundle.
- Interaction tests are `play` functions, run by `@storybook/addon-vitest` in Vitest browser mode (Chromium through Playwright, `.storybook/vitest.config.mts`) on the stories sources, with no built Storybook needed. Every story tagged `test` (the default) is one test, and an axe violation fails it (`a11y.test: 'error'`). Two Vitest projects run every story: `storybook` (`.storybook/vitest.setup.ts`) and `storybook-dark` (`.storybook/vitest.setup.dark.ts`, which reuses the first and sets the `theme` global to `dark`). A `play` that needs a real browser and no place in the sidebar lives in a story tagged `['!dev', '!autodocs']`, still run by the addon. `projects/ui/**/*.stories.ts` stays out of `ng test`, which only runs specs.
- Foundations MDX pages live in `projects/ui/docs/` and use `Meta` from `@storybook/addon-docs/blocks`.

## Testing

- Component tests use Angular Testing Library (`render`, `screen`, `userEvent`) with template-string rendering (`render('<button ui-button>...</button>', { imports: [UiButton] })`): query by role or label, not by CSS selectors. jest-dom matchers are set up in `projects/ui/src/test-setup.ts`.
- Cover every variant/size branch of the class-record maps: that is what keeps coverage at its current level.
- Coverage is 100% on branches and lines, 97.27% on statements and 93.33% on functions: the only gap is the query function that `contentChild` compiles to in `field.ts`, which coverage reports as never called. The CI thresholds in `angular.json` (statements 85, branches 80, functions 70, lines 85) are a floor; do not raise them. `*.stories.ts` files are excluded from coverage (`coverageExclude` in `angular.json`).
- `.storybook/vitest.setup.ts` calls `setProjectAnnotations` itself, so the Vitest addon skips its automatic provisioning: an addon with preview annotations added to `.storybook/main.ts` must also join `storyAnnotations`. Under Vitest the preview layout is not applied, hence the `layoutAnnotations` that restore the 1rem body padding of `layout: 'padded'`. The dark setup calls `setProjectAnnotations` again with the same list plus `initialGlobals`, which replaces the first call.

## Gotchas

- TypeScript stays on 6.x (Dependabot ignores `>=7`): TypeScript 7 breaks `typescript-eslint` (via `ts-api-utils`). Do not bump until typescript-eslint supports TS 7. This is also why the Storybook framework is `@storybook/angular-vite`: the webpack `@storybook/angular` peer range only allows TS up to 5.
- `pnpm-workspace.yaml` `allowBuilds` is required for native postinstall scripts (esbuild, ...): do not remove it.
- pnpm 11 holds back versions younger than its `minimumReleaseAge`: a bump that needs a fresh version gets a temporary `minimumReleaseAgeExclude` entry in `pnpm-workspace.yaml`, removed once the version has aged.
- `playwright` comes from the `catalog` of `pnpm-workspace.yaml`, so `playwright install` and the Vitest browser provider use one version. Dependabot does not update catalog entries: bump it by hand along with `@vitest/browser-playwright`.
- GitHub Actions in `.github/workflows/` are pinned by commit SHA with a `# vX.Y.Z` comment (Dependabot keeps them updated): when adding one, pin it the same way.
- The required status check `ci` is the gate job of `ci.yml`, which needs `static`, `unit` and `storybook` and fails unless each result is `success` or `skipped` (`if: always()`, never `!cancelled()`, so a cancelled run turns the gate red). A new CI job must join its `needs`.
- Dependabot groups every npm update in one pull request and every action update in another, because the Storybook, Vite and Playwright families are coupled.
- npm consumers of the published library must add `@source '../node_modules/<pkg>'` to their Tailwind CSS, because templates in `node_modules` are not scanned by default. Keep this documented in both READMEs (root and `projects/ui/README.md`).
- The package name lives in three places that must change together: `name` in `projects/ui/package.json`, the `paths` key in `tsconfig.json`, and every quoted cross-entry import (`'<name>/...'` in specs and stories). Renaming only `package.json` breaks the build (TS6059). `.storybook/main.ts` reads the name from `package.json`.
- `ui-field` keeps the `aria-describedby` the control already has, read once, and appends its hint and error ids to it.
- `field`, `input` and `control` are the reference for a component that depends on other entries: `ui-field` finds the projected control through the `UI_CONTROL` token (provided by `UiInput` and `UiTextarea`, which declare the `errors` and `touched` inputs that Angular's `[formField]` fills) and imports it by package path; Sheriff `depRules` grant `field` -> `input`, `control` and `input` -> `control`.
- `field.ts` keeps one `eslint-disable-next-line @angular-eslint/template/label-has-associated-control`: the label's `for` is wired at runtime, once the projected control's id is known.
- Dark `--destructive` is a light red (`hsl(0 62.8% 60%)`) so it passes 4.5:1 as text on the dark background, which forces the dark `--destructive-foreground` to the dark background color: no single light foreground passes on that red.
- A merge made with `GITHUB_TOKEN` triggers no `push` workflow, which is why `dependabot-auto-merge.yml` uses the `DEPENDABOT_MERGE_TOKEN` secret when it exists.

Starter maintenance notes (generator manifest, templates, starter-only workflows) live in [.generator/README.md](.generator/README.md).
