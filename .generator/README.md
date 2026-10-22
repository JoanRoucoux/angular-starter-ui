# Starter maintenance notes

This folder is deleted from generated projects, so everything specific to the starter itself lives here and not in `AGENTS.md`.

## Generator

New design systems are scaffolded from this starter by [starter-generator](https://github.com/JoanRoucoux/starter-generator), a generic engine: everything starter-specific lives in [generator.config.json](../generator.config.json) (files removed from generated projects, package renames, text replacements, install commands; full spec in the generator's README) and in `.generator/templates/` (the generated root README and the npm README of the library, rendered with `{{token}}` placeholders).

Keep them in sync with the starter:

- The demo components (`badge`, `button`, `input` with its textarea, `field`, `control`) are kept in generated projects as reference implementations: do not add them to the manifest's `remove`.
- The manifest patches both [package.json](../package.json) and [projects/ui/package.json](../projects/ui/package.json) (the published name); if the library layout moves, update the manifest paths.
- The library name is `angular-starter-ui` in the starter. The manifest's `replaceAll` entries rewrite the quoted package path (`'angular-starter-ui/...` and `"angular-starter-ui/...`), `node_modules/angular-starter-ui` and `pnpm add angular-starter-ui` to `{{projectName}}`; `.storybook/main.ts` reads the name from `projects/ui/package.json`. A new unquoted mention of the name in a `.ts`, `.json`, `.md` or `.mdx` file survives generation: either anchor it with a quote or add an entry.
- The AGENTS.md pointer line to this folder is removed by a `replace` entry with an empty value, so a generated AGENTS.md carries no starter content. Keep the two in sync.
- Template-only content (community files, release-please, the root CHANGELOG) must be listed in the manifest's `remove`. `release.yml`, `storybook.yml` and `projects/ui/CHANGELOG.md` stay: a generated project publishes and deploys by itself, after the two one-time settings listed in its README "Next steps".
- `.generator/templates/` stays excluded in [.prettierignore](../.prettierignore) and the ESLint `globalIgnores`.
- [generator-check.yml](../.github/workflows/generator-check.yml) generates a project from the working tree, runs its quality gates (including `build-storybook`, which exercises the Vite alias and the stories glob) and fails when the manifest or templates drift, or when a generated tree still mentions `angular-starter-ui/` outside the README footer link. It mirrors the generator's `postInstall` format step, skipped there with `--skip-install`. It is starter-only: listed in the manifest's `remove`.

## Release of the starter itself

- In the starter repository `release.yml` never fires: release-please creates its `v1.x.y` tags with `GITHUB_TOKEN`, and events from that token start no workflow. The root package version belongs to release-please; the library version in `projects/ui/package.json` is the one `release.yml` publishes in a generated project.
- A breaking change (such as moving the components to entry points) is a `refactor!:` or `feat!:` commit, so release-please proposes a major.
- Dependabot, CI and the Storybook deploy run in the starter as in a generated project.
- The starter commits straight to `main`, with no pull request workflow.

## Coverage

The CI thresholds in `angular.json` are intentionally a floor so that a project grown from the starter is never blocked by the numbers the starter reaches today.
