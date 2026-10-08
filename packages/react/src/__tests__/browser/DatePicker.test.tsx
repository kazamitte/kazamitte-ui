import type { ReactElement } from 'react';
import { LocaleProvider } from '@ark-ui/react/locale';
import { render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { DatePicker, parseDate } from '../../components/DatePicker';

const renderJa = (ui: ReactElement) =>
  render(<LocaleProvider locale="ja-JP">{ui}</LocaleProvider>);

describe('DatePicker', { timeout: 20000 }, () => {
  it('dims the input and trigger when disabled', () => {
    renderJa(
      <DatePicker
        label="予約日"
        disabled
        defaultValue={[parseDate('2026-09-15')]}
      />,
    );
    const input = screen.getByRole('textbox', { name: '予約日' });
    const trigger = screen.getByRole('button', { name: 'カレンダーを開く' });
    expect(getComputedStyle(input).opacity).toBe('0.5');
    expect(getComputedStyle(trigger).opacity).toBe('0.5');
  });

  it('opens the calendar grid with Enter on the focused trigger', async () => {
    renderJa(
      <DatePicker label="予約日" defaultValue={[parseDate('2026-09-15')]} />,
    );
    const trigger = screen.getByRole('button', { name: 'カレンダーを開く' });
    trigger.focus();
    expect(trigger).toHaveFocus();
    expect(screen.queryByRole('grid')).toBeNull();

    await userEvent.keyboard('{Enter}');

    await screen.findByRole('grid');
  });

  it('moves the focused day cell with the arrow keys', async () => {
    renderJa(
      <DatePicker label="予約日" defaultValue={[parseDate('2026-09-15')]} />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'カレンダーを開く' }),
    );
    const grid = await screen.findByRole('grid');
    const startCell = within(grid).getByRole('button', {
      name: /2026年9月15日/,
    });
    await waitFor(() => expect(startCell).toHaveFocus());

    await userEvent.keyboard('{ArrowRight}');

    const nextCell = within(grid).getByRole('button', {
      name: /2026年9月16日/,
    });
    await waitFor(() => expect(nextCell).toHaveFocus());
  });

  it('picks the focused day with Enter and closes the calendar', async () => {
    const onValueChange = vi.fn();
    renderJa(
      <DatePicker
        label="予約日"
        defaultValue={[parseDate('2026-09-15')]}
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'カレンダーを開く' }),
    );
    const grid = await screen.findByRole('grid');
    const startCell = within(grid).getByRole('button', {
      name: /2026年9月15日/,
    });
    await waitFor(() => expect(startCell).toHaveFocus());
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() =>
      expect(
        within(grid).getByRole('button', { name: /2026年9月16日/ }),
      ).toHaveFocus(),
    );

    await userEvent.keyboard('{Enter}');

    await waitFor(() => {
      const details = onValueChange.mock.lastCall?.[0] as {
        value: { toString: () => string }[];
      };
      expect(details.value.map((date) => date.toString())).toEqual([
        '2026-09-16',
      ]);
    });
    await waitFor(() => expect(screen.queryByRole('grid')).toBeNull());
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    renderJa(
      <DatePicker label="予約日" defaultValue={[parseDate('2026-09-15')]} />,
    );
    const trigger = screen.getByRole('button', { name: 'カレンダーを開く' });
    await userEvent.click(trigger);
    await screen.findByRole('grid');

    await userEvent.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('grid')).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
