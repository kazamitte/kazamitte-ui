'use client';

import { useSyncExternalStore } from 'react';

export const CHART_SERIES_COLORS = [
  'var(--c-orange-bg-solid)',
  'var(--c-sky-bg-solid)',
  'var(--c-green-bg-solid)',
  'var(--c-blue-bg-solid)',
  'var(--c-yellow-bg-solid)',
  'var(--c-purple-bg-solid)',
  'var(--c-red-bg-solid)',
] as const;

export const CHART_SERIES_DASHES = [
  undefined,
  '6 3',
  '2 3',
  '8 3 2 3',
  '4 2',
  '10 4',
  '1 3',
] as const;

export const seriesColor = (index: number): string =>
  CHART_SERIES_COLORS[index % CHART_SERIES_COLORS.length] ??
  CHART_SERIES_COLORS[0];

export const seriesDash = (index: number): string | undefined =>
  CHART_SERIES_DASHES[index % CHART_SERIES_DASHES.length];

export const CHART_CHROME = {
  grid: 'var(--r-base-border-muted)',
  axis: 'var(--r-base-border-solid)',
  text: 'var(--r-base-fg-muted)',
  surface: 'var(--r-base-bg)',
} as const;

const parseDuration = (value: string): number => {
  const trimmed = value.trim();
  if (trimmed.endsWith('ms')) return Number.parseFloat(trimmed);
  if (trimmed.endsWith('s')) return Number.parseFloat(trimmed) * 1000;
  const parsed = Number.parseFloat(trimmed);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const readEnterDuration = (): number =>
  parseDuration(
    getComputedStyle(document.documentElement).getPropertyValue(
      '--duration-enter',
    ),
  );

const subscribeToMotion = (onChange: () => void) => {
  // jsdom has no matchMedia; without it the duration is read once.
  if (typeof window.matchMedia !== 'function') return () => undefined;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};

export const useEnterDuration = (): number =>
  useSyncExternalStore(subscribeToMotion, readEnterDuration, () => 0);
