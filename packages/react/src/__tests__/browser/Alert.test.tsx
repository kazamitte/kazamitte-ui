import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';

type Rgb = readonly [number, number, number, number];

// getComputedStyle may answer in oklch() or color(); a canvas always
// hands back sRGB bytes.
const context = document.createElement('canvas').getContext('2d', {
  willReadFrequently: true,
});

const toRgb = (css: string): Rgb => {
  if (!context) throw new Error('2d canvas is unavailable');
  context.clearRect(0, 0, 1, 1);
  context.fillStyle = css;
  context.fillRect(0, 0, 1, 1);
  const [r = 0, g = 0, b = 0, a = 0] = context.getImageData(0, 0, 1, 1).data;
  return [r, g, b, a];
};

const luminance = ([r, g, b]: Rgb): number => {
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};

const ratio = (a: Rgb, b: Rgb): number => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05);
};

const STATUSES = ['neutral', 'info', 'success', 'warning', 'error'] as const;
const VARIANTS = ['primary', 'outline', 'ghost', 'link'] as const;
const MODES = ['light', 'dark'] as const;

afterEach(() => {
  delete document.documentElement.dataset.mode;
});

describe('Alert.Actions on variant="solid"', () => {
  for (const mode of MODES) {
    for (const status of STATUSES) {
      for (const variant of VARIANTS) {
        it(`keeps a ${variant} button readable and findable on ${status} (${mode})`, async () => {
          document.documentElement.dataset.mode = mode;
          render(
            <Alert.Root status={status} variant="solid" data-testid="alert">
              <Alert.Content>
                <Alert.Title>題</Alert.Title>
                <Alert.Actions>
                  <Button size="sm" variant={variant}>
                    再試行
                  </Button>
                </Alert.Actions>
              </Alert.Content>
            </Alert.Root>,
          );
          const button = screen.getByRole('button', { name: '再試行' });
          const surface = toRgb(
            getComputedStyle(screen.getByTestId('alert')).backgroundColor,
          );
          const style = getComputedStyle(button);

          const fill = toRgb(style.backgroundColor);
          const behindText = fill[3] === 0 ? surface : fill;
          expect(
            ratio(toRgb(style.color), behindText),
            'text',
          ).toBeGreaterThanOrEqual(4.5);

          // Only a filled or outlined button draws an edge to find.
          const edges: Rgb[] = {
            primary: [fill],
            outline: [toRgb(style.borderTopColor)],
            ghost: [],
            link: [],
          }[variant];
          for (const edge of edges) {
            expect(ratio(edge, surface), 'boundary').toBeGreaterThanOrEqual(3);
          }

          await userEvent.keyboard('{Tab}');
          expect(button).toHaveFocus();
          // The ring fades in; read the color it settles on.
          await Promise.all(
            button.getAnimations().map((animation) => animation.finished),
          );
          expect(
            ratio(toRgb(getComputedStyle(button).outlineColor), surface),
            'focus ring',
          ).toBeGreaterThanOrEqual(3);
        });
      }
    }
  }
});
