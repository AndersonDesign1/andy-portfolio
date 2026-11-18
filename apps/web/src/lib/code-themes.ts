import minDark from "@shikijs/themes/min-dark";
import minLight from "@shikijs/themes/min-light";

/**
 * Code colours for blog posts and /ai answers: the grayscale Shiki themes
 * (min-light, min-dark) to match the monochrome site, with every token colour
 * that falls under WCAG AA on the site's own backgrounds nudged toward black
 * (light) or white (dark) until it clears the bar. The stock themes were tuned
 * for their editor backgrounds; on #f0f0f0 their comments are 1.5:1.
 */

/** WCAG AA for body-size text, plus a little headroom for card tints. */
const TARGET_RATIO = 4.7;

/**
 * The darkest light surface code could sit on (#e5e5e5, the secondary grey;
 * pages are #f0f0f0) and the lightest dark one (#0a0a0a card; pages are
 * #050505).
 */
const LIGHT_SURFACE = "#e5e5e5";
const DARK_SURFACE = "#0a0a0a";

type Rgb = [number, number, number];

const HEX = /^#?(?<rgb>[\da-f]{6})/iu;

const toRgb = (hex: string): Rgb | undefined => {
  const match = HEX.exec(hex)?.groups?.rgb;

  if (!match) {
    return undefined;
  }

  const channel = (at: number) => Number.parseInt(match.slice(at, at + 2), 16);

  return [channel(0), channel(2), channel(4)];
};

const toHex = (rgb: Rgb) =>
  `#${rgb.map((channel) => Math.round(channel).toString(16).padStart(2, "0")).join("")}`;

const linear = (channel: number) => {
  const c = channel / 255;

  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminance = ([r, g, b]: Rgb) =>
  0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);

const contrast = (a: Rgb, b: Rgb) => {
  const la = luminance(a);
  const lb = luminance(b);

  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

const mix = (from: Rgb, to: Rgb, amount: number): Rgb => {
  const blend = (a: number, b: number) => a + (b - a) * amount;

  return [blend(from[0], to[0]), blend(from[1], to[1]), blend(from[2], to[2])];
};

/** The colour, moved just far enough toward `toward` to reach TARGET_RATIO. */
const readable = (hex: string, surface: Rgb, toward: Rgb): string => {
  const rgb = toRgb(hex);

  if (!rgb || contrast(rgb, surface) >= TARGET_RATIO) {
    return hex;
  }

  const steps = Array.from({ length: 101 }, (_, step) => step / 100);

  const amount =
    steps.find(
      (step) => contrast(mix(rgb, toward, step), surface) >= TARGET_RATIO
    ) ?? 1;

  return toHex(mix(rgb, toward, amount));
};

type Theme = typeof minLight;

const accessible = (
  theme: Theme,
  name: string,
  surface: string,
  toward: string
): Theme => {
  const surfaceRgb = toRgb(surface) ?? [0, 0, 0];
  const towardRgb = toRgb(toward) ?? [0, 0, 0];
  const fix = (hex: string) => readable(hex, surfaceRgb, towardRgb);
  const editorForeground = theme.colors?.["editor.foreground"];

  return {
    ...theme,
    colors: {
      ...theme.colors,
      ...(editorForeground && { "editor.foreground": fix(editorForeground) }),
    },
    name,
    tokenColors: theme.tokenColors?.map((rule) => ({
      ...rule,
      settings: {
        ...rule.settings,
        ...(rule.settings.foreground && {
          foreground: fix(rule.settings.foreground),
        }),
      },
    })),
  };
};

export const codeThemeLight = accessible(
  minLight,
  "min-light-aa",
  LIGHT_SURFACE,
  "#000000"
);

export const codeThemeDark = accessible(
  minDark,
  "min-dark-aa",
  DARK_SURFACE,
  "#ffffff"
);
