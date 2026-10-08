import { describe, expect, it } from 'vitest';
import { tv } from '../tv';

const merge = (base: string, override: string): string =>
  tv({ base })({ className: override });

describe('tv merges design token classes', () => {
  it.each([
    ['text-body-16', 'text-dense-14'],
    ['rounded-control', 'rounded-surface'],
    ['shadow-raised', 'shadow-floating'],
    ['duration-transition', 'duration-enter'],
    ['ease-standard', 'ease-emphasized'],
    ['animate-fade-in', 'animate-scale-in'],
    ['z-modal', 'z-popover'],
    ['primary-bg-solid', 'base-bg-muted'],
    ['base-fg', 'link-fg'],
    ['base-border-muted', 'error-border-solid'],
    ['primary-focus-ring', 'error-focus-ring'],
  ])('replaces %s with %s', (base, override) => {
    expect(merge(base, override)).toBe(override);
  });

  it.each([
    ['duration-200', 'duration-transition'],
    ['rounded-md', 'rounded-surface'],
    ['z-10', 'z-modal'],
    ['bg-red-500', 'primary-bg-solid'],
    ['text-red-500', 'base-fg'],
  ])('lets %s be replaced by the token %s', (base, override) => {
    expect(merge(base, override)).toBe(override);
  });

  it('cancels leading-* when a typography utility follows', () => {
    expect(merge('leading-tight', 'text-body-16')).toBe('text-body-16');
  });

  it('keeps a later leading-* next to a typography utility', () => {
    expect(merge('text-body-16', 'leading-tight')).toBe(
      'text-body-16 leading-tight',
    );
  });

  it.each([
    ['text-red-500', 'text-body-16'],
    ['shadow-red-500', 'shadow-raised'],
    ['animate-slide-in-from-bottom', '[--slide-distance:1rem]'],
    ['primary-bg-solid', 'primary-fg-contrast'],
  ])('keeps %s next to %s', (first, second) => {
    expect(merge(first, second)).toBe(`${first} ${second}`);
  });
});

describe('tv merges classes under ark-* variants', () => {
  it.each([
    ['ark-checked:primary-bg-solid', 'ark-checked:base-bg-muted'],
    ['ark-disabled:opacity-50', 'ark-disabled:opacity-30'],
    ['ark-open:rotate-180', 'ark-open:rotate-90'],
  ])('replaces %s with %s', (base, override) => {
    expect(merge(base, override)).toBe(override);
  });

  it.each([
    ['ark-checked:primary-bg-solid', 'ark-open:primary-bg-solid'],
    ['ark-checked:primary-bg-solid', 'primary-bg-solid'],
    ['ark-disabled:opacity-50', 'disabled:opacity-50'],
  ])('keeps %s next to %s', (first, second) => {
    expect(merge(first, second)).toBe(`${first} ${second}`);
  });
});
