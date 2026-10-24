import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

type Rgb = readonly [number, number, number];
type Scheme = 'light' | 'dark';

const css = readFileSync(join(dirname(expect.getState().testPath ?? ''), '..', 'styles', 'tokens.css'), 'utf8');

const hslToRgb = (h: number, s: number, l: number): Rgb => {
  const sat = s / 100;
  const light = l / 100;
  const a = sat * Math.min(light, 1 - light);
  const channel = (n: number): number => {
    const k = (n + h / 30) % 12;
    return light - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
  };

  return [channel(0), channel(8), channel(4)];
};

const token = (name: string, scheme: Scheme): Rgb => {
  const declaration = css.match(new RegExp(String.raw`--${name}:\s*light-dark\(([^;]+)\);`));
  const colors = [...(declaration?.[1] ?? '').matchAll(/hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)/g)];
  const color = colors[scheme === 'light' ? 0 : 1];

  if (!color) {
    throw new Error(`Token --${name} not found or not in hsl light-dark() format`);
  }

  return hslToRgb(Number(color[1]), Number(color[2]), Number(color[3]));
};

const luminance = (rgb: Rgb): number => {
  const [r, g, b] = rgb.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));

  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
};

const contrast = (a: Rgb, b: Rgb): number => {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);

  return (lighter! + 0.05) / (darker! + 0.05);
};

const over = (foreground: Rgb, background: Rgb, alpha: number): Rgb =>
  foreground.map((c, i) => c * alpha + background[i]! * (1 - alpha)) as unknown as Rgb;

describe('Design tokens contrast', () => {
  it.each<Scheme>(['light', 'dark'])('keeps the input border at 3:1 on the background in %s', (scheme) => {
    expect(contrast(token('input', scheme), token('background', scheme))).toBeGreaterThanOrEqual(3);
  });

  it.each<Scheme>(['light', 'dark'])('keeps the destructive hover text at 4.5:1 in %s', (scheme) => {
    const hovered = over(token('destructive', scheme), token('background', scheme), 0.95);

    expect(contrast(token('destructive-foreground', scheme), hovered)).toBeGreaterThanOrEqual(4.5);
  });
});
