import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { userEvent } from 'vitest/browser';
import { Button } from '../../components/Button';
import { SegmentGroup } from '../../components/SegmentGroup';

const OPTIONS = [
  { value: 'list', label: 'リスト' },
  { value: 'grid', label: 'グリッド' },
  { value: 'map', label: '地図' },
];

const renderWithNeighbors = (defaultValue: string) =>
  render(
    <>
      <Button>前</Button>
      <SegmentGroup
        label="表示形式"
        options={OPTIONS}
        defaultValue={defaultValue}
      />
      <Button>後</Button>
    </>,
  );

describe('SegmentGroup', () => {
  it('keeps a single tab stop: Tab lands only on the checked segment, skipping the rest', async () => {
    renderWithNeighbors('grid');
    await userEvent.tab();
    await expect
      .poll(
        () =>
          screen.getByRole('button', { name: '前' }) === document.activeElement,
      )
      .toBe(true);

    await userEvent.tab();
    const grid = screen.getByRole('radio', { name: 'グリッド' });
    await expect.poll(() => grid === document.activeElement).toBe(true);

    await userEvent.tab();
    await expect
      .poll(
        () =>
          screen.getByRole('button', { name: '後' }) === document.activeElement,
      )
      .toBe(true);
  });

  it('moves focus and selection together with ArrowRight, wrapping past the last option', async () => {
    renderWithNeighbors('map');
    screen.getByRole('radio', { name: '地図' }).focus();
    await userEvent.keyboard('{ArrowRight}');

    const list = screen.getByRole('radio', { name: 'リスト' });
    await expect.poll(() => list === document.activeElement).toBe(true);
    expect(list).toBeChecked();
    expect(screen.getByRole('radio', { name: '地図' })).not.toBeChecked();
  });

  it('moves focus and selection together with ArrowLeft, wrapping before the first option', async () => {
    renderWithNeighbors('list');
    screen.getByRole('radio', { name: 'リスト' }).focus();
    await userEvent.keyboard('{ArrowLeft}');

    const map = screen.getByRole('radio', { name: '地図' });
    await expect.poll(() => map === document.activeElement).toBe(true);
    expect(map).toBeChecked();
    expect(screen.getByRole('radio', { name: 'リスト' })).not.toBeChecked();
  });
});
