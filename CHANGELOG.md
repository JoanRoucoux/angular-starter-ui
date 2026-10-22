# Changelog

## [2.0.0](https://github.com/JoanRoucoux/angular-starter-ui/compare/v1.2.1...v2.0.0) (2026-10-22)


### ⚠ BREAKING CHANGES

* **ui:** import components from <package>/<component> instead of the package root.

### Features

* **ui:** add field and control around input and textarea ([9b8d30c](https://github.com/JoanRoucoux/angular-starter-ui/commit/9b8d30c69320f270d6aec67eea126a7e1af7b4d7))


### Bug Fixes

* **ui:** export the stylesheets, show a pointer on buttons, style invalid inputs ([f16f5ff](https://github.com/JoanRoucoux/angular-starter-ui/commit/f16f5ff7c64f1e81634da409c3ed85342222ac0c))
* **ui:** keep a control's own description and publish with provenance ([2363d03](https://github.com/JoanRoucoux/angular-starter-ui/commit/2363d03a103597f8e3834b8e0a0a31dd201bdfc0))


### Code Refactoring

* **ui:** one entry point per component ([0835d50](https://github.com/JoanRoucoux/angular-starter-ui/commit/0835d507cca97c5ee9addf8e7fa6d7d67d009375))

## [1.2.1](https://github.com/JoanRoucoux/angular-starter-ui/compare/v1.2.0...v1.2.1) (2026-08-02)


### Bug Fixes

* **deps:** revert typescript to 6.0.3 and pin all dependency versions ([15dfd7c](https://github.com/JoanRoucoux/angular-starter-ui/commit/15dfd7c0979204bb2962f585d44da4341c960ad3))

## [1.2.0](https://github.com/JoanRoucoux/angular-starter-ui/compare/v1.1.0...v1.2.0) (2026-07-23)


### Features

* **ui:** export component variant/size types and their value tuples ([4771f41](https://github.com/JoanRoucoux/angular-starter-ui/commit/4771f41aae588c61a01b07c16ce63774c5c91e28))


### Bug Fixes

* **ui:** resolve tsconfig rootDir and inlineSources diagnostics ([5b9e2b7](https://github.com/JoanRoucoux/angular-starter-ui/commit/5b9e2b7c4dc64db868af488abdfa5f5b9ff182fa))

## [1.1.0](https://github.com/JoanRoucoux/angular-starter-ui/compare/v1.0.0...v1.1.0) (2026-07-21)


### Features

* make the starter generator-enabled ([e6010eb](https://github.com/JoanRoucoux/angular-starter-ui/commit/e6010eba5140cf5151fbaec7e0976daf01bb430b))


### Bug Fixes

* align the generated README table with Prettier's formatting ([cd3dd87](https://github.com/JoanRoucoux/angular-starter-ui/commit/cd3dd87f86662cd303ae5e00bfc3b076599632e9))

## 1.0.0 (2026-07-21)


### Features

* add Storybook workspace with a11y, theming and interaction tests ([25bc34e](https://github.com/JoanRoucoux/angular-starter-ui/commit/25bc34e8ff593b32fb8c82eef4a11fea318b4534))
* **ui:** add button, input and badge components with unit tests ([aa3468f](https://github.com/JoanRoucoux/angular-starter-ui/commit/aa3468fad8a8eacec78d64ef4812d94fdf629609))
* **ui:** add publishable ng-packagr library scaffold with design tokens ([704324a](https://github.com/JoanRoucoux/angular-starter-ui/commit/704324a4b010faeadc04308577a4b4d5d471d4d4))


### Bug Fixes

* render typography sizes table as HTML/JSX in MDX ([6f4da50](https://github.com/JoanRoucoux/angular-starter-ui/commit/6f4da500e090f7e9d8e332f7445388f09e665698))
* revert TypeScript to 6.0.2 (7.x breaks typescript-eslint) ([b76ee2a](https://github.com/JoanRoucoux/angular-starter-ui/commit/b76ee2a7e2fd687fef912523fb58f9f122b6f9b7))
