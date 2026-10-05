export type ChromaticColor =
  | 'red' | 'orange' | 'amber' | 'yellow' | 'lime'
  | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky'
  | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia'
  | 'pink' | 'rose';

export type BaseColor =
  | 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
  | 'mauve' | 'olive' | 'mist' | 'taupe';

export type Palette = ChromaticColor | BaseColor;

export interface ColorTheme {
  base: Palette;
  primary: Palette;
  secondary: Palette;
  link: Palette;
}

/**
 * Generates the contents of a color theme stylesheet.
 *
 * Returns CSS as a string.
 */
export declare const generateColorTheme: (theme: ColorTheme) => string;