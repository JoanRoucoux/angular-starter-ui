# {{projectName}}

{{title}}: an Angular design system, a publishable component library (`projects/ui`) developed and documented through Storybook.

## Getting started

```bash
pnpm install
pnpm start      # Storybook on http://localhost:6006
```

## Scripts

| Script                       | Description                                                |
| ---------------------------- | ---------------------------------------------------------- |
| `pnpm start`                 | Storybook dev server                                       |
| `pnpm run build`             | Builds the library into `dist/ui` (Angular Package Format) |
| `pnpm run build-storybook`   | Static Storybook build (-> `storybook-static/`)            |
| `pnpm test`                  | Unit tests (Vitest)                                        |
| `pnpm run test:coverage`     | Unit tests with coverage report and thresholds             |
| `pnpm run test-storybook:ci` | Storybook interaction tests against the built Storybook    |
| `pnpm run lint`              | Lint (ESLint, includes Sheriff module boundaries)          |
| `pnpm run format`            | Format the whole project (Prettier)                        |

## Next steps

- Grow your components in `projects/ui/<folder>/`: one folder per component, each its own entry point (`ng-package.json` + `index.ts`), imported as `{{projectName}}/<folder>` (`badge`, `button`, `input`, `textarea` and `field` are the reference implementations). `projects/ui/src/public-api.ts` exports nothing on purpose.
- Make the design tokens yours in `projects/ui/styles/tokens.css`: components consume them through Tailwind arbitrary values and never hardcode colors. `.storybook/theme.ts` and `.storybook/preview-head.html` restate the same colors in hex, so edit them together.
- The published package is named `{{projectName}}` ([projects/ui/package.json](projects/ui/package.json)); switch to a scope (e.g. `@your-scope/ui`) there if needed. Its version is managed in that file, independently of the root version.
- One-time setting, GitHub Pages: in the repository settings, Pages, set the source to "GitHub Actions". Until then the deploy job of `storybook.yml` is red on every push to `main`.
- One-time setting, npm trusted publisher: npm only accepts a trusted publisher on an existing package. Publish the first version once by hand with a token, then register `release.yml` as trusted publisher of the package on npmjs.com. Later releases are made by pushing a `vX.Y.Z` tag that matches `projects/ui/package.json` and `projects/ui/CHANGELOG.md`.

## Publishing and consuming

The publishable artifact is built from `projects/ui` into `dist/ui`. Consumers must:

1. Import the tokens: `@import '{{projectName}}/styles/tokens.css';`
2. Register the package as a Tailwind source (templates in `node_modules` are not scanned by default): `@source '../node_modules/{{projectName}}';`
3. Import each component from its entry point: `import { UiButton } from '{{projectName}}/button';`

See [AGENTS.md](AGENTS.md) for the architecture, conventions and testing guidelines.

<sub>Generated from [angular-starter-ui](https://github.com/JoanRoucoux/angular-starter-ui).</sub>
