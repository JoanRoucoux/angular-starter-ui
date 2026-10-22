import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const uiDir = join(dirname(expect.getState().testPath ?? ''), '..');
const entries = readdirSync(uiDir, { withFileTypes: true }).filter(
  (entry) => entry.isDirectory() && existsSync(join(uiDir, entry.name, 'ng-package.json')),
);

const sources = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      return sources(path);
    }
    return /\.(ts|html)$/.test(entry.name) && !/\.(spec|stories)\.ts$/.test(entry.name) ? [path] : [];
  });

describe('Tailwind class literals', () => {
  it('never glue a class token to an interpolation, which the scanner of a consumer build cannot see', () => {
    const offenders = entries
      .flatMap((entry) => sources(join(uiDir, entry.name)))
      .flatMap((file) =>
        readFileSync(file, 'utf8')
          .split('\n')
          .flatMap((line, index) =>
            [...line.matchAll(/[A-Za-z0-9\])%-]\$\{/g)].map(
              () => `${file.slice(uiDir.length + 1)}:${index + 1}: ${line.trim()}`,
            ),
          ),
      );

    expect(offenders).toEqual([]);
  });
});
